/**
 * Temporary Lighthouse CLI runner. Uses the already-cached 13.4.1 package.
 * Does not add lighthouse to application dependencies.
 * Blocks analytics/Firestore/EmailJS. Does not disable animations or images.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'seo-audit-evidence', 'phase-5');
const lighthouseCli = path.join(
  process.env.LOCALAPPDATA,
  'npm-cache',
  '_npx',
  '5390d7d89c0de19d',
  'node_modules',
  'lighthouse',
  'cli',
  'index.js',
);
const previewUrl = process.env.FSMS_PREVIEW_URL || 'http://127.0.0.1:4179/';

function runLighthouse(label, extraArgs) {
  return new Promise((resolve, reject) => {
    const outBase = path.join(evidenceDir, `lighthouse-${label}`);
    const args = [
      lighthouseCli,
      previewUrl,
      '--only-categories=performance,accessibility,best-practices,seo',
      '--output=json',
      '--output=html',
      `--output-path=${outBase}`,
      '--max-wait-for-load=120000',
      '--blocked-url-patterns=*googletagmanager.com*',
      '--blocked-url-patterns=*google-analytics.com*',
      '--blocked-url-patterns=*firestore.googleapis.com*',
      '--blocked-url-patterns=*firebaseio.com*',
      '--blocked-url-patterns=*api.emailjs.com*',
      '--chrome-flags=--headless=new --no-first-run --disable-extensions',
      ...extraArgs,
    ];
    const child = spawn(process.execPath, args, {
      cwd: projectRoot,
      windowsHide: true,
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('error', reject);
    child.on('close', (code) => {
      resolve({ label, code, stdout, stderr, outBase });
    });
  });
}

function summarize(label, result) {
  const jsonPath = `${result.outBase}.report.json`;
  if (!fs.existsSync(jsonPath)) {
    return {
      label,
      completed: false,
      exitCode: result.code,
      stderrTail: result.stderr.slice(-2000),
    };
  }
  const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const cats = report.categories || {};
  const audits = report.audits || {};
  return {
    label,
    completed: true,
    exitCode: result.code,
    lighthouseVersion: report.lighthouseVersion,
    fetchTime: report.fetchTime,
    requestedUrl: report.requestedUrl,
    finalUrl: report.finalUrl,
    configSettings: {
      formFactor: report.configSettings?.formFactor,
      screenEmulation: report.configSettings?.screenEmulation,
      throttlingMethod: report.configSettings?.throttlingMethod,
      maxWaitForLoad: report.configSettings?.maxWaitForLoad,
      blockedUrlPatterns: report.configSettings?.blockedUrlPatterns,
    },
    scores: {
      performance: cats.performance?.score,
      accessibility: cats.accessibility?.score,
      bestPractices: cats['best-practices']?.score,
      seo: cats.seo?.score,
    },
    metrics: {
      lcp: audits['largest-contentful-paint']?.numericValue,
      tbt: audits['total-blocking-time']?.numericValue,
      cls: audits['cumulative-layout-shift']?.numericValue,
      fcp: audits['first-contentful-paint']?.numericValue,
      si: audits['speed-index']?.numericValue,
    },
    runWarnings: report.runWarnings || [],
    runtimeError: report.runtimeError || null,
    seoAuditIds: Object.entries(audits)
      .filter(([, audit]) => audit.scoreDisplayMode !== 'manual' && audit.score !== null && audit.score < 1)
      .filter(([id]) => (report.categories?.seo?.auditRefs || []).some((ref) => ref.id === id))
      .map(([id, audit]) => ({ id, title: audit.title, score: audit.score })),
  };
}

async function main() {
  if (!fs.existsSync(lighthouseCli)) {
    throw new Error(`Cached Lighthouse CLI not found at ${lighthouseCli}`);
  }
  fs.mkdirSync(evidenceDir, { recursive: true });

  const mobile = await runLighthouse('mobile', []);
  const desktop = await runLighthouse('desktop', ['--preset=desktop']);
  const summary = {
    tool: 'Lighthouse CLI 13.4.1 from existing npx cache (not added to package.json)',
    previewUrl,
    mobile: summarize('mobile', mobile),
    desktop: summarize('desktop', desktop),
  };
  fs.writeFileSync(path.join(evidenceDir, 'lighthouse-summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));
  if (!summary.mobile.completed || !summary.desktop.completed) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
