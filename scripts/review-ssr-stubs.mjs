/**
 * Isolated review of build-time browser stubs. Does not deploy or change hosting.
 * The decisive run is saved at seo-audit-evidence/phase-2d/ssr-stub-review.json
 * (captured while the full stub installer still existed). The installer is now a no-op.
 */
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(projectRoot, '.prerender-review');
const evidenceDir = path.join(projectRoot, 'seo-audit-evidence', 'phase-2d');
const reportPath = path.join(evidenceDir, 'ssr-stub-review.json');

function sha(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function runNode(args, env) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, args, {
      cwd: projectRoot,
      env: { ...process.env, FSMS_SSR_BUILD: '1', ...env },
      windowsHide: true,
    });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      child.kill();
      resolve({ code: -1, stdout, stderr: `${stderr}\nTIMEOUT` });
    }, 45000);
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr });
    });
  });
}

function parseTrace(stderr) {
  const line = stderr.split(/\r?\n/).find((item) => item.startsWith('[fsms-stub-trace]'));
  if (!line) return [];
  try {
    return JSON.parse(line.replace('[fsms-stub-trace]', '').trim());
  } catch {
    return [line];
  }
}

async function findSsrEntry() {
  if (!fs.existsSync(outDir)) return null;
  const files = fs.readdirSync(outDir);
  const match = files.find((file) => file.startsWith('entry-server') && /\.(m?js|cjs)$/.test(file));
  return match ? path.join(outDir, match) : null;
}

async function motionBrowserFlag(attachWindow) {
  const childSource = `
    import { installSsrBrowserStubs } from ${JSON.stringify(pathToFileURL(path.join(projectRoot, 'scripts/ssr-browser-stubs.mjs')).href)};
    installSsrBrowserStubs({ attachWindow: ${attachWindow ? 'true' : 'false'} });
    const motion = await import('framer-motion');
    console.log(JSON.stringify({
      attachWindow: ${attachWindow ? 'true' : 'false'},
      typeofWindow: typeof window,
      typeofDocument: typeof document,
      isBrowser: motion.isBrowser,
    }));
  `;
  const tmp = path.join(outDir, attachWindow ? 'probe-window.mjs' : 'probe-no-window.mjs');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(tmp, childSource, 'utf8');
  return runNode([tmp], {});
}

async function main() {
  fs.mkdirSync(evidenceDir, { recursive: true });
  process.env.FSMS_SSR_BUILD = '1';

  console.log('[stub-review] Building isolated SSR bundle');
  await build({
    configFile: path.join(projectRoot, 'vite.config.ts'),
    root: projectRoot,
    build: {
      ssr: path.join(projectRoot, 'src', 'entry-server.tsx'),
      outDir,
      emptyOutDir: true,
      copyPublicDir: false,
      sourcemap: false,
    },
  });

  const ssrEntry = await findSsrEntry();
  if (!ssrEntry) {
    throw new Error('SSR entry missing after review build');
  }

  const renderer = path.join(projectRoot, 'scripts', 'render-homepage-once.mjs');
  const profiles = [
    { name: 'full', env: { FSMS_SSR_ENTRY: ssrEntry, FSMS_STUB_TRACE: '1' } },
    {
      name: 'no-window',
      env: { FSMS_SSR_ENTRY: ssrEntry, FSMS_STUB_ATTACH_WINDOW: '0', FSMS_STUB_TRACE: '1' },
    },
    { name: 'none', env: { FSMS_SSR_ENTRY: ssrEntry, FSMS_STUB_PROFILE: 'none' } },
  ];

  const results = {};
  for (const profile of profiles) {
    if (profile.name === 'none') {
      const noneSource = `
        import { pathToFileURL } from 'node:url';
        const loaded = await import(pathToFileURL(process.env.FSMS_SSR_ENTRY).href);
        const html = loaded.renderHomepage();
        process.stdout.write(html);
      `;
      const noneFile = path.join(outDir, 'render-none.mjs');
      fs.writeFileSync(noneFile, noneSource, 'utf8');
      results[profile.name] = await runNode([noneFile], { FSMS_SSR_ENTRY: ssrEntry });
    } else {
      results[profile.name] = await runNode([renderer], profile.env);
    }
  }

  const windowProbe = await motionBrowserFlag(true);
  const noWindowProbe = await motionBrowserFlag(false);

  const report = {
    generatedAt: new Date().toISOString(),
    motion: {
      withWindow: safeJson(windowProbe.stdout),
      withoutWindow: safeJson(noWindowProbe.stdout),
      withWindowStderr: windowProbe.stderr.slice(0, 1000),
      withoutWindowStderr: noWindowProbe.stderr.slice(0, 1000),
    },
    profiles: {},
  };

  for (const [name, result] of Object.entries(results)) {
    report.profiles[name] = {
      exitCode: result.code,
      htmlLength: result.stdout.length,
      sha256: result.stdout ? sha(result.stdout) : null,
      hasH1: result.stdout.includes('WE BUILD THE GROUND'),
      hasHybrid: result.stdout.includes('What is HYBRIDGRASS'),
      storageWrites: (result.stdout.match(/fast_safe_projects|fast_safe_expertise/g) || []).length,
      accessedApis: parseTrace(result.stderr),
      error: result.code === 0 ? null : (result.stderr || result.stdout).slice(0, 4000),
    };
  }

  report.fullEqualsNoWindow =
    report.profiles.full?.sha256 &&
    report.profiles.full.sha256 === report.profiles['no-window']?.sha256;
  report.recommendation = recommend(report);

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  fs.rmSync(outDir, { recursive: true, force: true });
  console.log(JSON.stringify(report, null, 2));
}

function safeJson(text) {
  try {
    return JSON.parse(text.trim());
  } catch {
    return { raw: text.slice(0, 500) };
  }
}

function recommend(report) {
  const full = report.profiles.full;
  const noWindow = report.profiles['no-window'];
  const none = report.profiles.none;
  const motionUsesBrowser = report.motion.withWindow?.isBrowser === true;
  if (none?.exitCode === 0 && none.hasH1) {
    return 'Renderer works with no stubs; production stubs can be removed.';
  }
  if (noWindow?.exitCode === 0 && noWindow.hasH1 && full?.exitCode === 0) {
    if (report.fullEqualsNoWindow) {
      return motionUsesBrowser
        ? 'no-window markup matches full stubs. Prefer no-window so Motion keeps the server path.'
        : 'no-window works and matches. Window/document stubs are unnecessary.';
    }
    return 'no-window renders but markup differs from full stubs. Keep current stubs unless hydration fails.';
  }
  if (full?.exitCode === 0) {
    return 'Full stubs are required for a successful prerender. Do not slim them.';
  }
  return 'All stub profiles failed. Inspect errors before changing the installer.';
}

main().catch((error) => {
  fs.mkdirSync(evidenceDir, { recursive: true });
  fs.writeFileSync(
    reportPath,
    JSON.stringify({ error: error instanceof Error ? error.stack : String(error) }, null, 2),
    'utf8',
  );
  console.error(error);
  process.exit(1);
});
