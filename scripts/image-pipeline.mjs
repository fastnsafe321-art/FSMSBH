/**
 * Incremental WebP generation for known homepage photographs.
 * Fingerprints source bytes + inventory + encoder settings. Does not use mtime alone.
 *
 * ImageMagick prerequisite: `magick` on PATH, or FSMS_MAGICK pointing at the executable.
 * Documented Windows fallback: C:\Program Files\ImageMagick-7.1.2-Q16-HDRI\magick.exe
 */
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { allUsedImages, publicPathFor, ROLE_QUALITY, ROLE_WIDTHS } from './phase3-used-images.mjs';

export const DOCUMENTED_MAGICK_WIN = 'C:\\Program Files\\ImageMagick-7.1.2-Q16-HDRI\\magick.exe';

export const ENCODER_SETTINGS = {
  version: 1,
  format: 'webp',
  method: 6,
  alphaQuality: 90,
  resizeSuffix: 'x>',
  strip: true,
  skipLargerNearFullWidth: 0.9,
  namingVersion: 1,
};

const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function hashBuffer(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function hashFile(filePath) {
  return hashBuffer(fs.readFileSync(filePath));
}

export function hashJson(value) {
  return hashBuffer(JSON.stringify(value));
}

export function defaultVariantStem(file) {
  return file.replace(/\.[^.]+$/, '').replace(/[^A-Za-z0-9._-]+/g, '_').replace(/_+/g, '_');
}

export function disambiguatedStem(file) {
  const extMatch = file.match(/\.([^.]+)$/);
  const ext = (extMatch?.[1] || 'bin').toLowerCase();
  const stem = file.replace(/\.[^.]+$/, '');
  const encoded = stem.replace(/~/g, '~~').replace(/ /g, '~s').replace(/[^A-Za-z0-9._~-]+/g, '_');
  return `${encoded}__${ext}`;
}

export function assignVariantStems(used) {
  const groups = new Map();
  for (const item of used) {
    const def = defaultVariantStem(item.file);
    if (!groups.has(def)) groups.set(def, []);
    groups.get(def).push(item);
  }
  const stems = new Map();
  for (const items of groups.values()) {
    if (items.length === 1) {
      stems.set(items[0].file, defaultVariantStem(items[0].file));
      continue;
    }
    const taken = new Set();
    for (const item of items) {
      let stem = disambiguatedStem(item.file);
      if (taken.has(stem)) {
        stem = `${stem}__${hashBuffer(item.file).slice(0, 8)}`;
      }
      taken.add(stem);
      stems.set(item.file, stem);
    }
  }
  return stems;
}

export function resolveMagickExecutable() {
  const configured = process.env.FSMS_MAGICK;
  if (configured) {
    const ok = canRunMagick(configured);
    if (!ok) {
      throw new Error(
        `[image-pipeline] FSMS_MAGICK is set but is not a working ImageMagick executable:\n  ${configured}\nInstall ImageMagick or point FSMS_MAGICK at magick.exe / magick.`,
      );
    }
    return configured;
  }

  const candidates = ['magick', 'magick.exe'];
  if (process.platform === 'win32') candidates.push(DOCUMENTED_MAGICK_WIN);
  for (const candidate of candidates) {
    if (canRunMagick(candidate)) return candidate;
  }
  return null;
}

function canRunMagick(executable) {
  if (!executable) return false;
  const looksPath = executable.includes('/') || executable.includes('\\');
  if (looksPath && !fs.existsSync(executable)) return false;
  try {
    execFileSync(executable, ['-version'], { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

export function magickRequiredMessage() {
  return [
    '[image-pipeline] ImageMagick is required to generate optimized image variants.',
    'Install ImageMagick and ensure `magick` is on PATH, or set FSMS_MAGICK to the executable.',
    `Documented Windows path: ${DOCUMENTED_MAGICK_WIN}`,
  ].join('\n');
}

export function resolveSource(file, srcDir, publicDir) {
  const fromSrc = path.join(srcDir, file);
  if (fs.existsSync(fromSrc)) return fromSrc;
  const fromPublic = path.join(publicDir, file);
  if (fs.existsSync(fromPublic)) return fromPublic;
  return null;
}

function identify(magick, filePath) {
  const raw = execFileSync(magick, ['identify', '-format', '%w %h %m %[opaque] %A', filePath], {
    encoding: 'utf8',
  }).trim();
  const [width, height, format, opaque, alpha] = raw.split(' ');
  return {
    width: Number(width),
    height: Number(height),
    format,
    hasAlpha: opaque === 'False' || /true/i.test(alpha || ''),
  };
}

function writeVariant(magick, sourcePath, destPath, width, quality, hasAlpha, settings) {
  const args = [sourcePath];
  if (settings.strip) args.push('-strip');
  args.push('-resize', `${width}${settings.resizeSuffix}`, '-quality', String(quality));
  if (hasAlpha) args.push('-define', `webp:alpha-quality=${settings.alphaQuality}`);
  args.push('-define', `webp:method=${settings.method}`, destPath);
  execFileSync(magick, args, { stdio: 'pipe' });
}

function loadManifest(manifestPath) {
  if (!fs.existsSync(manifestPath)) return { images: {} };
  try {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch {
    return { images: {} };
  }
}

function settingsFingerprint(roleWidths, roleQuality, encoderSettings) {
  return hashJson({ encoderSettings, roleWidths, roleQuality });
}

function imageFingerprint({ sourceHash, role, quality, widths, stem, settingsHash }) {
  return hashJson({ sourceHash, role, quality, widths, stem, settingsHash });
}

function plannedWidths(role, sourceWidth, roleWidths) {
  return [...(roleWidths[role] || roleWidths.card), sourceWidth]
    .filter((width) => width <= sourceWidth)
    .filter((width, index, list) => list.indexOf(width) === index)
    .sort((a, b) => a - b);
}

export function verifyManifestFiles(manifest, outDir) {
  const missing = [];
  for (const entry of Object.values(manifest.images || {})) {
    for (const variant of entry.variants || []) {
      const name = path.basename(decodeURI(variant.href || ''));
      const full = path.join(outDir, name);
      if (!fs.existsSync(full)) missing.push(variant.href);
    }
  }
  return missing;
}

/**
 * Incremental optimize. Regenerates only affected variants.
 * @returns {object} summary
 */
export function ensureOptimizedImages(options = {}) {
  const projectRoot = options.projectRoot || DEFAULT_ROOT;
  const srcDir = options.srcDir || path.join(projectRoot, 'src', 'assets', 'images');
  const publicDir = options.publicDir || path.join(projectRoot, 'public', 'assets', 'images');
  const outDir = options.outDir || path.join(projectRoot, 'public', 'assets', 'images', 'opt');
  const manifestPath = options.manifestPath || path.join(projectRoot, 'src', 'data', 'image-variants.json');
  const used = options.used || allUsedImages();
  const roleWidths = options.roleWidths || ROLE_WIDTHS;
  const roleQuality = options.roleQuality || ROLE_QUALITY;
  const encoderSettings = { ...ENCODER_SETTINGS, ...(options.encoderSettings || {}) };
  const removeUnlisted = options.removeUnlistedOutputs !== false;

  const settingsHash = settingsFingerprint(roleWidths, roleQuality, encoderSettings);
  const inventoryHash = hashJson(used.map((item) => ({ file: item.file, role: item.role })));
  const prev = loadManifest(manifestPath);
  const stems = assignVariantStems(used);
  const stemOwners = new Map();

  fs.mkdirSync(outDir, { recursive: true });

  const planned = [];
  const missingSources = [];

  for (const item of used) {
    const sourcePath = resolveSource(item.file, srcDir, publicDir);
    if (!sourcePath) {
      missingSources.push(item.file);
      continue;
    }
    const stem = stems.get(item.file);
    if (stemOwners.has(stem) && stemOwners.get(stem) !== item.file) {
      throw new Error(
        `[image-pipeline] Variant stem collision for "${stem}" between "${stemOwners.get(stem)}" and "${item.file}".`,
      );
    }
    stemOwners.set(stem, item.file);

    const sourceStat = fs.statSync(sourcePath);
    const sourceHash = hashFile(sourcePath);
    const quality = roleQuality[item.role] || 80;
    const prevEntry = prev.images?.[item.file];
    const hashKnown = Boolean(prevEntry?.sourceHash);
    const sourceUnchanged = hashKnown
      ? prevEntry.sourceHash === sourceHash
      : prevEntry?.originalBytes === sourceStat.size;
    const metaFromPrev =
      sourceUnchanged && prevEntry?.width
        ? {
            width: prevEntry.width,
            height: prevEntry.height,
            format: prevEntry.format,
            hasAlpha: prevEntry.hasAlpha,
          }
        : null;

    planned.push({
      item,
      sourcePath,
      sourceHash,
      sourceStat,
      stem,
      quality,
      role: item.role,
      prevEntry,
      metaFromPrev,
    });
  }

  const summary = {
    created: 0,
    reused: 0,
    skippedLarger: 0,
    missing: missingSources,
    writtenManifest: false,
    magick: null,
    removedStale: 0,
  };
  const images = {};
  const listedOutputs = new Set();
  let magick = null;

  const needMagick = planned.some((row) => {
    if (!row.metaFromPrev) return true;
    const widths = plannedWidths(row.role, row.metaFromPrev.width, roleWidths);
    return widths.some((width) => {
      if (row.prevEntry?.skippedWidths?.includes(width)) return false;
      const destPath = path.join(outDir, `${row.stem}__w${width}.webp`);
      const href = `/assets/images/opt/${row.stem}__w${width}.webp`;
      const prevVar = row.prevEntry?.variants?.find((variant) => variant.width === width && variant.href === href);
      return !fs.existsSync(destPath) || !prevVar;
    });
  });

  if (needMagick) {
    magick = resolveMagickExecutable();
    if (!magick) throw new Error(magickRequiredMessage());
    summary.magick = magick;
  }

  for (const row of planned) {
    const meta = row.metaFromPrev || identify(magick, row.sourcePath);
    const widths = plannedWidths(row.role, meta.width, roleWidths);
    const fingerprint = imageFingerprint({
      sourceHash: row.sourceHash,
      role: row.role,
      quality: row.quality,
      widths,
      stem: row.stem,
      settingsHash,
    });
    const variants = [];
    const skippedWidths = [];

    for (const width of widths) {
      const destName = `${row.stem}__w${width}.webp`;
      const destPath = path.join(outDir, destName);
      const href = `/assets/images/opt/${destName}`;
      listedOutputs.add(destName);
      const prevVar = row.prevEntry?.variants?.find((variant) => variant.width === width && variant.href === href);
      if (row.prevEntry?.skippedWidths?.includes(width) && !fs.existsSync(destPath) && row.prevEntry?.fingerprint === fingerprint) {
        listedOutputs.delete(destName);
        skippedWidths.push(width);
        continue;
      }
      const exists = fs.existsSync(destPath);
      const fingerprintOk = row.prevEntry?.fingerprint === fingerprint;
      const adoptedOk =
        exists &&
        prevVar &&
        prevVar.bytes === fs.statSync(destPath).size &&
        (fingerprintOk ||
          (!row.prevEntry?.fingerprint &&
            row.prevEntry?.quality === row.quality &&
            row.prevEntry?.role === row.role));

      if (!exists || !prevVar || (!fingerprintOk && !adoptedOk)) {
        if (!magick) {
          magick = resolveMagickExecutable();
          if (!magick) throw new Error(magickRequiredMessage());
          summary.magick = magick;
        }
        writeVariant(magick, row.sourcePath, destPath, width, row.quality, meta.hasAlpha, encoderSettings);
        summary.created += 1;
      } else {
        summary.reused += 1;
      }

      const destBytes = fs.statSync(destPath).size;
      if (destBytes >= row.sourceStat.size && width >= meta.width * encoderSettings.skipLargerNearFullWidth) {
        fs.rmSync(destPath, { force: true });
        listedOutputs.delete(destName);
        skippedWidths.push(width);
        summary.skippedLarger += 1;
        continue;
      }
      variants.push({ width, href, bytes: destBytes });
    }

    if (!variants.length) continue;

    images[row.item.file] = {
      file: row.item.file,
      role: row.role,
      original: publicPathFor(row.item.file),
      sourceKey: row.sourcePath.startsWith(srcDir)
        ? `/src/assets/images/${row.item.file}`
        : `/assets/images/${row.item.file}`,
      width: meta.width,
      height: meta.height,
      format: meta.format,
      hasAlpha: meta.hasAlpha,
      originalBytes: row.sourceStat.size,
      quality: row.quality,
      sourceHash: row.sourceHash,
      fingerprint,
      variantStem: row.stem,
      skippedWidths,
      variants,
    };
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    tool: 'ImageMagick magick',
    outputDir: '/assets/images/opt/',
    settingsHash,
    inventoryHash,
    settings: { ...encoderSettings, roleWidths, roleQuality },
    images,
  };

  const missingFiles = verifyManifestFiles(manifest, outDir);
  if (missingFiles.length) {
    throw new Error(`[image-pipeline] Manifest references missing files:\n${missingFiles.join('\n')}`);
  }

  const prevJson = JSON.stringify({
    settingsHash: prev.settingsHash || null,
    inventoryHash: prev.inventoryHash || null,
    images: prev.images || {},
  });
  const nextJson = JSON.stringify({
    settingsHash: manifest.settingsHash,
    inventoryHash: manifest.inventoryHash,
    images: manifest.images,
  });

  if (prevJson !== nextJson) {
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    summary.writtenManifest = true;
  }

  if (removeUnlisted && fs.existsSync(outDir)) {
    for (const name of fs.readdirSync(outDir)) {
      if (!name.endsWith('.webp')) continue;
      if (!listedOutputs.has(name)) {
        fs.rmSync(path.join(outDir, name), { force: true });
        summary.removedStale = (summary.removedStale || 0) + 1;
      }
    }
  }

  summary.mapped = Object.keys(images).length;
  summary.manifest = manifestPath;
  return summary;
}

export function heroPreloadTag(manifestPath = path.join(DEFAULT_ROOT, 'src', 'data', 'image-variants.json')) {
  const heroFile = 'pristine_pitch_night_1781166845895.png';
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const hero = manifest.images?.[heroFile];
  if (!hero?.variants?.length) {
    throw new Error('[image-pipeline] Hero variants missing from the manifest. Generate images before prerender.');
  }
  const srcset = hero.variants.map((variant) => `${encodeURI(variant.href)} ${variant.width}w`).join(', ');
  const href = encodeURI(hero.variants[0].href);
  return `<link rel="preload" as="image" type="image/webp" href="${href}" imagesrcset="${srcset}" imagesizes="100vw"/>`;
}
