/**
 * Isolated fixture tests for the Phase 3A image pipeline.
 * Does not modify original site photographs.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assignVariantStems, ensureOptimizedImages, resolveMagickExecutable } from './image-pipeline.mjs';
import { isKnownLocalImageRef } from './image-path-rules.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'seo-audit-evidence', 'phase-3a');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function makePng(magick, dest, color) {
  execFileSync(magick, ['-size', '64x48', `xc:${color}`, dest], { stdio: 'pipe' });
}

function listWebp(dir) {
  return fs.existsSync(dir) ? fs.readdirSync(dir).filter((name) => name.endsWith('.webp')).sort() : [];
}

function run() {
  const magick = resolveMagickExecutable();
  if (!magick) {
    throw new Error('ImageMagick is required for Phase 3A fixture tests. Set FSMS_MAGICK or install magick on PATH.');
  }

  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'fsms-phase3a-'));
  const srcDir = path.join(root, 'src');
  const publicDir = path.join(root, 'public');
  const outDir = path.join(root, 'opt');
  const manifestPath = path.join(root, 'manifest.json');
  fs.mkdirSync(srcDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });

  makePng(magick, path.join(srcDir, 'alpha.png'), 'red');
  makePng(magick, path.join(srcDir, 'beta.png'), 'blue');
  makePng(magick, path.join(srcDir, 'space name.png'), 'green');
  makePng(magick, path.join(srcDir, 'space_name.png'), 'yellow');
  makePng(magick, path.join(srcDir, 'twin.png'), '#00f');
  execFileSync(magick, ['-size', '64x48', 'xc:purple', path.join(srcDir, 'twin.jpg')], { stdio: 'pipe' });

  const used = [
    { file: 'alpha.png', role: 'card' },
    { file: 'beta.png', role: 'card' },
    { file: 'space name.png', role: 'card' },
    { file: 'space_name.png', role: 'card' },
    { file: 'twin.png', role: 'card' },
    { file: 'twin.jpg', role: 'card' },
  ];
  const roleWidths = { card: [32, 64] };
  const roleQuality = { card: 80 };
  const opts = {
    projectRoot: root,
    srcDir,
    publicDir,
    outDir,
    manifestPath,
    used,
    roleWidths,
    roleQuality,
    removeUnlistedOutputs: true,
  };

  const first = ensureOptimizedImages(opts);
  const firstFiles = listWebp(outDir);
  const firstManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const firstMtimes = Object.fromEntries(firstFiles.map((name) => [name, fs.statSync(path.join(outDir, name)).mtimeMs]));

  const second = ensureOptimizedImages(opts);
  const secondFiles = listWebp(outDir);
  const secondMtimes = Object.fromEntries(secondFiles.map((name) => [name, fs.statSync(path.join(outDir, name)).mtimeMs]));

  const reuseOk =
    second.created === 0 &&
    second.reused === first.reused + first.created &&
    firstFiles.join() === secondFiles.join() &&
    firstFiles.every((name) => firstMtimes[name] === secondMtimes[name]);

  const alphaBefore = firstManifest.images['alpha.png'];
  const alphaFiles = alphaBefore.variants.map((variant) => path.basename(variant.href));
  makePng(magick, path.join(srcDir, 'alpha.png'), 'black');
  const afterSource = ensureOptimizedImages(opts);
  const alphaAfter = JSON.parse(fs.readFileSync(manifestPath, 'utf8')).images['alpha.png'];
  const alphaChanged =
    afterSource.created >= 1 &&
    alphaAfter.sourceHash !== alphaBefore.sourceHash &&
    alphaAfter.fingerprint !== alphaBefore.fingerprint;
  const betaUnchanged =
    JSON.parse(fs.readFileSync(manifestPath, 'utf8')).images['beta.png'].sourceHash ===
    firstManifest.images['beta.png'].sourceHash;

  const missingHref = alphaAfter.variants[0].href;
  const missingName = path.basename(missingHref);
  fs.rmSync(path.join(outDir, missingName));
  const afterMissing = ensureOptimizedImages(opts);
  const restored = fs.existsSync(path.join(outDir, missingName)) && afterMissing.created >= 1;

  const afterSettings = ensureOptimizedImages({
    ...opts,
    roleQuality: { card: 40 },
  });
  const settingsChanged = afterSettings.created >= 1;

  const stems = assignVariantStems(used);
  const stemValues = [...stems.values()];
  const uniqueStems = new Set(stemValues);
  const spaceStem = stems.get('space name.png');
  const spaceUnderStem = stems.get('space_name.png');
  const twinPng = stems.get('twin.png');
  const twinJpg = stems.get('twin.jpg');
  const collisionOk =
    uniqueStems.size === used.length &&
    spaceStem !== spaceUnderStem &&
    twinPng !== twinJpg &&
    fs.existsSync(path.join(outDir, `${spaceStem}__w32.webp`)) &&
    fs.existsSync(path.join(outDir, `${spaceUnderStem}__w32.webp`)) &&
    fs.existsSync(path.join(outDir, `${twinPng}__w32.webp`)) &&
    fs.existsSync(path.join(outDir, `${twinJpg}__w32.webp`));

  const missingMagick = (() => {
    const prevMagick = process.env.FSMS_MAGICK;
    process.env.FSMS_MAGICK = path.join(root, 'no-such-magick.exe');
    fs.rmSync(path.join(outDir, missingName), { force: true });
    let message = '';
    try {
      ensureOptimizedImages(opts);
    } catch (error) {
      message = String(error.message || error);
    }
    if (prevMagick === undefined) delete process.env.FSMS_MAGICK;
    else process.env.FSMS_MAGICK = prevMagick;
    ensureOptimizedImages(opts);
    return /FSMS_MAGICK is set but is not a working ImageMagick executable/.test(message);
  })();

  const pathRules = {
    localSrc: Boolean(isKnownLocalImageRef('/src/assets/images/alpha.png')),
    localPublic: Boolean(isKnownLocalImageRef('/assets/images/alpha.png')),
    externalSameBasename: isKnownLocalImageRef('https://cdn.example.com/assets/images/alpha.png') === null,
    externalRoot: isKnownLocalImageRef('https://example.com/alpha.png') === null,
    dataUrl: isKnownLocalImageRef('data:image/png;base64,xxx') === null,
    blobUrl: isKnownLocalImageRef('blob:https://example.com/1') === null,
    query: isKnownLocalImageRef('/assets/images/alpha.png?v=2') === null,
    hash: isKnownLocalImageRef('/assets/images/alpha.png#x') === null,
    unknownDir: isKnownLocalImageRef('/uploads/alpha.png') === null,
    optDir: isKnownLocalImageRef('/assets/images/opt/alpha__w32.webp') === null,
  };

  fs.rmSync(root, { recursive: true, force: true });

  const report = {
    reuseUnchanged: reuseOk,
    first: { created: first.created, reused: first.reused, files: firstFiles.length },
    second: { created: second.created, reused: second.reused },
    oneSourceChange: alphaChanged && betaUnchanged,
    missingVariantRestored: restored,
    settingsInvalidate: settingsChanged,
    collisions: {
      ok: collisionOk,
      spaceStem,
      spaceUnderStem,
      twinPng,
      twinJpg,
    },
    encoderMissingFails: missingMagick,
    pathRules,
    allPassed:
      reuseOk &&
      alphaChanged &&
      betaUnchanged &&
      restored &&
      settingsChanged &&
      collisionOk &&
      missingMagick &&
      Object.values(pathRules).every(Boolean),
  };

  fs.mkdirSync(evidenceDir, { recursive: true });
  fs.writeFileSync(path.join(evidenceDir, 'pipeline-fixtures.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (!report.allPassed) process.exit(1);
}

run();
