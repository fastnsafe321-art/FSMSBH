/**
 * Phase 6 local preview check: headings, one H1 across slides, interactions.
 * Blocks analytics, Firestore, and EmailJS. Does not submit forms or write localStorage.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'seo-audit-evidence', 'phase-6');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const previewUrl = process.env.FSMS_PREVIEW_URL || 'http://127.0.0.1:4180/';
const debugPort = Number(process.env.FSMS_CDP_PORT || 9381);
const EXPECTED_H1 = 'Football Pitch Construction in Bahrain';
const EXPECTED_H2S = [
  'Hybrid Grass Systems for Football Pitches',
  'Football Pitch Drainage & Root-Zone Aeration',
  'Fast & Safe Maintenance Services in Bahrain',
  'Natural & Artificial Football Pitch Systems',
  'Turf Installation & Construction Services',
  'Football Pitch & Construction Projects',
  'Quality & Safety in Project Delivery',
  'Contact Fast & Safe in Sitra, Bahrain',
];
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

function collectPageState() {
  return `
    (() => {
      const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((el) => ({
        tag: el.tagName.toLowerCase(),
        text: (el.textContent || '').replace(/\\s+/g, ' ').trim(),
      }));
      const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')];
      return {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content || null,
        canonical: document.querySelector('link[rel="canonical"]')?.href || null,
        robots: document.querySelector('meta[name="robots"]')?.content || null,
        jsonLdCount: jsonLd.length,
        jsonLd: jsonLd[0]?.textContent || '',
        h1Count: document.querySelectorAll('h1').length,
        h1: document.querySelector('h1')?.textContent?.replace(/\\s+/g, ' ').trim() || '',
        h2s: headings.filter((item) => item.tag === 'h2').map((item) => item.text),
        headings,
        verification: document.querySelector('meta[name="google-site-verification"]')?.content || null,
        gtagPresent: !!document.querySelector('script[src*="G-SP37M5NYJ5"]'),
        heroAlt: document.querySelector('#home-hero img')?.getAttribute('alt') || '',
      };
    })()
  `;
}

async function main() {
  fs.mkdirSync(evidenceDir, { recursive: true });
  const userData = fs.mkdtempSync(path.join(os.tmpdir(), 'fsms-phase6-after-'));
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

  const consoleNotes = [];
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
    await page.send('Page.navigate', { url: `${previewUrl}?v=phase6-after` });
    await page.once('Page.loadEventFired').catch(() => null);
    await wait(2800);

    const desktop = await page.eval(collectPageState());

    for (const [id, name] of SECTIONS) {
      await page.eval(`document.getElementById(${JSON.stringify(id)})?.scrollIntoView({ block: 'start' })`);
      await wait(400);
      await screenshot(page, `after-${name}-desktop.png`);
    }

    await page.eval(`document.querySelector('#home-hero button[aria-label="Next slide"]')?.click()`);
    await wait(1600);
    const afterNext = await page.eval(collectPageState());
    await screenshot(page, 'after-hero-slide2-desktop.png');
    await page.eval(`document.querySelector('#home-hero button[aria-label="Next slide"]')?.click()`);
    await wait(1600);
    const afterNext2 = await page.eval(collectPageState());
    await screenshot(page, 'after-hero-slide3-desktop.png');

    const navHref = await page.eval(`
      (() => {
        const link = [...document.querySelectorAll('nav a')].find((el) => (el.textContent || '').includes('EXPERTISE'));
        link?.click();
        return link?.getAttribute('href') || null;
      })()
    `);
    await wait(600);

    await page.eval(`document.querySelector('#services button')?.click()`);
    await wait(400);
    const serviceTab = await page.eval(`
      (() => ({
        buttons: document.querySelectorAll('#services button').length,
        selectedH3: document.querySelector('#services h3')?.textContent?.replace(/\\s+/g, ' ').trim() || '',
      }))()
    `);

    await page.eval(`document.querySelector('#expertise .cursor-pointer')?.click()`);
    await wait(900);
    const expertiseModal = await page.eval(`
      (() => ({
        open: !!document.querySelector('button[aria-label="Close modal"]'),
        title: document.querySelector('[role="dialog"] h2, .fixed h2')?.textContent?.replace(/\\s+/g, ' ').trim() || '',
      }))()
    `);
    await page.eval(`document.querySelector('button[aria-label="Close modal"]')?.click()`);
    await wait(400);

    await page.eval(`document.querySelector('#projects .cursor-pointer')?.click()`);
    await wait(900);
    const projectModal = await page.eval(`
      (() => ({
        open: !!document.querySelector('button[aria-label="Close modal"]'),
        title: document.querySelector('[role="dialog"] h2, .fixed h2')?.textContent?.replace(/\\s+/g, ' ').trim() || '',
      }))()
    `);
    await page.eval(`document.querySelector('button[aria-label="Close modal"]')?.click()`);
    await wait(400);

    const consultOpened = await page.eval(`
      (() => {
        const btn = [...document.querySelectorAll('button')].find((el) =>
          /consult|enquire|discuss/i.test(el.textContent || '')
        );
        btn?.click();
        return !!btn;
      })()
    `);
    await wait(800);
    const consultation = await page.eval(`
      (() => ({
        open: !!document.querySelector('#cm-service, form'),
        serviceValue: document.querySelector('#cm-service')?.value || null,
        hasSubmit: !!document.querySelector('form button[type="submit"]'),
      }))()
    `);
    await page.eval(`
      (() => {
        const close = document.querySelector('button[aria-label="Close modal"]');
        if (close) close.click();
      })()
    `);
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
    const mobile = await page.eval(collectPageState());

    for (const [id, name] of SECTIONS) {
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

    const missingH2s = EXPECTED_H2S.filter((text) => !desktop.h2s.includes(text));
    const hydrationErrors = consoleNotes.filter((item) => /hydration/i.test(item.text || ''));
    const consoleErrors = consoleNotes.filter((item) => item.type === 'error' || item.type === 'exception');

    const report = {
      previewUrl,
      desktop,
      mobile,
      afterNext: { h1Count: afterNext.h1Count, h1: afterNext.h1, heroAlt: afterNext.heroAlt },
      afterNext2: { h1Count: afterNext2.h1Count, h1: afterNext2.h1, heroAlt: afterNext2.heroAlt },
      navHref,
      serviceTab,
      expertiseModal,
      projectModal,
      consultOpened,
      consultation,
      mobileNav,
      missingH2s,
      hydrationErrors,
      consoleErrors,
    };
    report.passed =
      desktop.h1Count === 1 &&
      desktop.h1 === EXPECTED_H1 &&
      afterNext.h1Count === 1 &&
      afterNext.h1 === EXPECTED_H1 &&
      afterNext2.h1Count === 1 &&
      afterNext2.h1 === EXPECTED_H1 &&
      mobile.h1Count === 1 &&
      mobile.h1 === EXPECTED_H1 &&
      missingH2s.length === 0 &&
      desktop.title.includes('Football Pitch Construction in Bahrain') &&
      desktop.canonical === 'https://www.fsmsbh.com/' &&
      desktop.gtagPresent &&
      desktop.verification === 'yXUx7Tla5BhkNfydJx8nApAJE-Zhyd44jHL0OJdJyg4' &&
      desktop.jsonLdCount === 1 &&
      expertiseModal.open &&
      projectModal.open &&
      consultation.open &&
      hydrationErrors.length === 0;

    fs.writeFileSync(path.join(evidenceDir, 'browser-check.json'), `${JSON.stringify(report, null, 2)}\n`);
    fs.writeFileSync(
      path.join(evidenceDir, 'heading-outline-after.json'),
      `${JSON.stringify({ desktop: desktop.headings, mobile: mobile.headings }, null, 2)}\n`,
    );
    console.log(JSON.stringify({
      passed: report.passed,
      h1: desktop.h1,
      h1AfterSlides: [afterNext.h1, afterNext2.h1],
      missingH2s,
      hydrationErrors: hydrationErrors.length,
      consoleErrors: consoleErrors.map((item) => item.text).slice(0, 8),
      expertiseModal,
      projectModal,
      consultation,
    }, null, 2));
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
