/**
 * Capture homepage headings before Phase 6 copy edits.
 * Blocks analytics and form backends. Does not submit forms or write localStorage.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'seo-audit-evidence', 'phase-6');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const previewUrl = process.env.FSMS_PREVIEW_URL || 'http://127.0.0.1:3000/';
const debugPort = Number(process.env.FSMS_CDP_PORT || 9380);
const BLOCKED = [
  '*googletagmanager.com*',
  '*google-analytics.com*',
  '*doubleclick.net*',
  '*firestore.googleapis.com*',
  '*firebaseio.com*',
  '*firebaselogging.googleapis.com*',
  '*api.emailjs.com*',
];
const SECTIONS = [
  ['home-hero', 'hero'],
  ['hybridgrass', 'hybrid'],
  ['sub-air-system', 'subair'],
  ['about', 'about'],
  ['services', 'services'],
  ['expertise', 'expertise'],
  ['projects', 'projects'],
  ['safety', 'safety'],
  ['office-location', 'sitra'],
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
  const userData = fs.mkdtempSync(path.join(os.tmpdir(), 'fsms-phase6-before-'));
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

  try {
    await page.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await page.send('Page.navigate', { url: `${previewUrl}?v=phase6-before` });
    await page.once('Page.loadEventFired').catch(() => null);
    await wait(2800);

    const outline = await page.eval(`
      (() => [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((el) => ({
        tag: el.tagName.toLowerCase(),
        text: (el.textContent || '').replace(/\\s+/g, ' ').trim(),
      })))()
    `);

    for (const [id, name] of SECTIONS) {
      await page.eval(`document.getElementById(${JSON.stringify(id)})?.scrollIntoView({ block: 'start' })`);
      await wait(350);
      await screenshot(page, `before-${name}-desktop.png`);
    }

    await page.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await page.send('Page.reload', { ignoreCache: true });
    await page.once('Page.loadEventFired').catch(() => null);
    await wait(2500);

    for (const [id, name] of SECTIONS) {
      await page.eval(`document.getElementById(${JSON.stringify(id)})?.scrollIntoView({ block: 'start' })`);
      await wait(350);
      await screenshot(page, `before-${name}-mobile.png`);
    }

    const report = {
      previewUrl,
      capturedAt: new Date().toISOString(),
      outline,
    };
    fs.writeFileSync(path.join(evidenceDir, 'heading-outline-before.json'), `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify({ captured: SECTIONS.length * 2, h1: outline.find((item) => item.tag === 'h1') }, null, 2));
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
