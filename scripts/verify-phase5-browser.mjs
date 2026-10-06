/**
 * Phase 5 visual/a11y check after heading and TypeScript fixes.
 * Blocks analytics, Firestore, and EmailJS. Does not submit forms.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'seo-audit-evidence', 'phase-5');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const previewUrl = process.env.FSMS_PREVIEW_URL || 'http://127.0.0.1:4179/';
const debugPort = Number(process.env.FSMS_CDP_PORT || 9371);
const BLOCKED = [
  '*googletagmanager.com*',
  '*google-analytics.com*',
  '*doubleclick.net*',
  '*firestore.googleapis.com*',
  '*firebaseio.com*',
  '*firebaselogging.googleapis.com*',
  '*api.emailjs.com*',
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForJson(url, attempts = 50) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res.json();
    } catch {
      // retry
    }
    await wait(200);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

class CdpSession {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Map();
    this.ready = new Promise((resolve, reject) => {
      this.ws.addEventListener('open', () => resolve());
      this.ws.addEventListener('error', reject);
    });
    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(JSON.stringify(message.error)));
        else resolve(message.result);
      } else if (message.method) {
        for (const fn of this.listeners.get(message.method) || []) fn(message.params || {});
      }
    });
  }

  on(method, fn) {
    const list = this.listeners.get(method) || [];
    list.push(fn);
    this.listeners.set(method, list);
  }

  once(method, timeoutMs = 20000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Timed out waiting for ${method}`)), timeoutMs);
      const handler = (params) => {
        clearTimeout(timer);
        this.listeners.set(
          method,
          (this.listeners.get(method) || []).filter((item) => item !== handler),
        );
        resolve(params);
      };
      this.on(method, handler);
    });
  }

  async send(method, params = {}) {
    await this.ready;
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  eval(expression) {
    return this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    }).then((result) => {
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'eval failed');
      return result.result?.value;
    });
  }

  close() {
    try {
      this.ws.close();
    } catch {
      // ignore
    }
  }
}

async function screenshot(page, filename) {
  const result = await page.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(evidenceDir, filename), Buffer.from(result.data, 'base64'));
}

async function main() {
  fs.mkdirSync(evidenceDir, { recursive: true });
  const userData = fs.mkdtempSync(path.join(os.tmpdir(), 'fsms-phase5-browser-'));
  const chrome = spawn(
    chromePath,
    [
      `--remote-debugging-port=${debugPort}`,
      `--user-data-dir=${userData}`,
      '--headless=new',
      '--no-first-run',
      '--disable-extensions',
      '--window-size=1440,900',
      'about:blank',
    ],
    { windowsHide: true, stdio: 'ignore' },
  );

  await waitForJson(`http://127.0.0.1:${debugPort}/json/version`);
  let targets = [];
  for (let i = 0; i < 25; i++) {
    targets = await waitForJson(`http://127.0.0.1:${debugPort}/json/list`);
    if (targets.find((item) => item.type === 'page' && item.webSocketDebuggerUrl)) break;
    await wait(200);
  }
  const page = new CdpSession(
    targets.find((item) => item.type === 'page' && item.webSocketDebuggerUrl).webSocketDebuggerUrl,
  );
  await page.ready;
  await page.send('Network.enable');
  await page.send('Page.enable');
  await page.send('Runtime.enable');
  await page.send('Network.setBlockedURLs', { urls: BLOCKED });
  await page.send('Network.setCacheDisabled', { cacheDisabled: true });

  const imageUrls = [];
  const consoleNotes = [];
  page.on('Network.responseReceived', (params) => {
    const url = params.response?.url || '';
    if (/\.(webp|png|jpe?g)(\?|$)/i.test(url) || params.type === 'Image') imageUrls.push(url);
  });
  page.on('Runtime.consoleAPICalled', (params) => {
    const text = (params.args || []).map((arg) => arg.value || arg.description || '').join(' ');
    consoleNotes.push({ type: params.type, text });
  });
  page.on('Runtime.exceptionThrown', (params) => {
    consoleNotes.push({
      type: 'exception',
      text: params.exceptionDetails?.exception?.description || params.exceptionDetails?.text,
    });
  });

  try {
    await page.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await page.send('Page.navigate', { url: `${previewUrl}?v=phase5` });
    await page.once('Page.loadEventFired').catch(() => null);
    await wait(2800);

    const desktop = await page.eval(`
      (() => {
        const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((el) => ({
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || '').replace(/\\s+/g, ' ').trim(),
        }));
        const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')];
        return {
          title: document.title,
          canonical: document.querySelector('link[rel="canonical"]')?.href || null,
          jsonLdCount: jsonLd.length,
          h1Count: document.querySelectorAll('h1').length,
          h1: document.querySelector('h1')?.textContent?.replace(/\\s+/g, ' ').trim() || '',
          headings,
          tabHeadingsInPremium: [...document.querySelectorAll('#services button h4, #services button h3')].length,
          phaseHeadings: [...document.querySelectorAll('#sub-air-system button h5')].length,
          verification: document.querySelector('meta[name="google-site-verification"]')?.content || null,
          gtagPresent: !!document.querySelector('script[src*="G-SP37M5NYJ5"]'),
        };
      })()
    `);

    for (const [id, name] of [
      ['hybridgrass', 'hybrid'],
      ['sub-air-system', 'subair'],
      ['services', 'premium'],
    ]) {
      await page.eval(`document.getElementById(${JSON.stringify(id)})?.scrollIntoView({ block: 'start' })`);
      await wait(400);
      await screenshot(page, `after-${name}-desktop.png`);
    }

    await page.eval(`document.querySelector('#home-hero button[aria-label="Next slide"]')?.click()`);
    await wait(1500);
    const afterNext = await page.eval(`
      (() => ({
        h1Count: document.querySelectorAll('h1').length,
        currentSrc: document.querySelector('#home-hero img')?.currentSrc || null,
      }))()
    `);

    await page.eval(`document.querySelector('#services button')?.click()`);
    await wait(400);
    await page.eval(`document.querySelector('#expertise .cursor-pointer')?.click()`);
    await wait(900);
    const expertiseModal = await page.eval(`!!document.querySelector('button[aria-label="Close modal"]')`);
    await page.eval(`document.querySelector('button[aria-label="Close modal"]')?.click()`);
    await wait(400);
    await page.eval(`document.querySelector('#projects .cursor-pointer')?.click()`);
    await wait(900);
    const projectModal = await page.eval(`!!document.querySelector('button[aria-label="Close modal"]')`);
    await page.eval(`document.querySelector('button[aria-label="Close modal"]')?.click()`);
    await wait(400);

    await page.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await page.send('Page.reload', { ignoreCache: true });
    await page.once('Page.loadEventFired').catch(() => null);
    await wait(2500);
    for (const [id, name] of [
      ['hybridgrass', 'hybrid'],
      ['sub-air-system', 'subair'],
      ['services', 'premium'],
    ]) {
      await page.eval(`document.getElementById(${JSON.stringify(id)})?.scrollIntoView({ block: 'start' })`);
      await wait(400);
      await screenshot(page, `after-${name}-mobile.png`);
    }
    await page.eval(`document.querySelector('button[aria-label="Open menu"]')?.click()`);
    await wait(600);
    const mobileNav = await page.eval(`
      (() => [...document.querySelectorAll('nav')].map((el) => el.getAttribute('aria-label')))()
    `);
    await page.eval(`document.querySelector('button[aria-label="Close menu"]')?.click()`);

    const originalsPlusVariants = imageUrls.filter((url) =>
      /\/assets\/images\/[^/]+\.(png|jpe?g)$/i.test(url) && imageUrls.some((other) => other.includes('/opt/') && other.includes(path.basename(url).replace(/\.[^.]+$/, ''))),
    );

    const report = {
      previewUrl,
      desktop,
      afterNext,
      expertiseModal,
      projectModal,
      mobileNav,
      hydrationErrors: consoleNotes.filter((item) => /hydration/i.test(item.text || '')),
      consoleErrors: consoleNotes.filter((item) => item.type === 'error' || item.type === 'exception'),
      imageSample: [...new Set(imageUrls)].slice(0, 20),
      imageCount: imageUrls.length,
    };
    report.passed =
      desktop.jsonLdCount === 1 &&
      desktop.h1Count === 1 &&
      afterNext.h1Count === 1 &&
      desktop.tabHeadingsInPremium === 0 &&
      desktop.phaseHeadings === 0 &&
      expertiseModal &&
      projectModal &&
      report.hydrationErrors.length === 0;

    fs.writeFileSync(path.join(evidenceDir, 'browser-check.json'), `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify(report, null, 2));
    if (!report.passed) process.exit(1);
  } finally {
    page.close();
    chrome.kill();
    await wait(400);
    fs.rmSync(userData, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
