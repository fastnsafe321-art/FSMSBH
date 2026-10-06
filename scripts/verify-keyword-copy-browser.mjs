/**
 * Isolated browser check for the keyword/copy update.
 * Blocks analytics and form backends. Does not submit forms or write the user's localStorage.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'seo-audit-evidence', 'keyword-copy');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const previewUrl = process.env.FSMS_PREVIEW_URL || 'http://127.0.0.1:4181/';
const debugPort = Number(process.env.FSMS_CDP_PORT || 9382);
const EXPECTED_H1 = 'Football Pitch Construction in Bahrain';
const EXPECTED_SUMMARIES = [
  'Artificial grass installation in Bahrain, including artificial football turf installation and football turf replacement for sports facilities.',
  'Natural grass pitch installation in Bahrain for natural grass football pitches, with ground preparation, rootzone construction and irrigation.',
  'Fencing works in Bahrain, including perimeter fencing and sports safety netting for facilities and athletic sites.',
  'Building construction in Bahrain, covering comprehensive civil works and turnkey construction.',
  'Horse walker installation in Bahrain for specialized industrial equine exercise systems.',
  'Swimming pool construction in Bahrain, covering professional concrete pool shells and turnkey aquatic works.',
  'Carpentry and wood works in Bahrain, including precision carpentry installations and custom woodwork.',
];
const EXPECTED_LABELS = [
  'Artificial Football Turf Installation',
  'Natural Grass Pitch Installation',
  'FENCING WORKS',
  'BUILDING CONSTRUCTION',
  'HORSE WALKER INSTALLATION',
  'SWIMMING POOL CONSTRUCTION',
  'CARPENTRY & WOOD WORKS',
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

function collectCopyState() {
  return `
    (() => {
      const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((el) => ({
        tag: el.tagName.toLowerCase(),
        text: (el.textContent || '').replace(/\\s+/g, ' ').trim(),
      }));
      const cards = [...document.querySelectorAll('#expertise .cursor-pointer')];
      const expertise = cards.map((card) => {
        const heading = card.querySelector('h3');
        const summary = card.querySelector('p');
        const headingBox = heading?.getBoundingClientRect();
        const summaryBox = summary?.getBoundingClientRect();
        const cardBox = card.getBoundingClientRect();
        const style = summary ? getComputedStyle(summary) : null;
        const overflow =
          !!summaryBox &&
          (summaryBox.bottom > cardBox.bottom + 1 ||
            summaryBox.right > cardBox.right + 1 ||
            summary.scrollHeight > summary.clientHeight + 1);
        return {
          label: heading?.textContent?.replace(/\\s+/g, ' ').trim() || '',
          summary: summary?.textContent?.replace(/\\s+/g, ' ').trim() || '',
          opacity: style ? Number(style.opacity) : 0,
          color: style?.color || '',
          overflow,
          headingVisible: !!headingBox && headingBox.height > 0 && headingBox.width > 0,
          summaryVisible: !!summaryBox && summaryBox.height > 0 && summaryBox.width > 0,
        };
      });
      return {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content || null,
        h1Count: document.querySelectorAll('h1').length,
        h1: document.querySelector('h1')?.textContent?.replace(/\\s+/g, ' ').trim() || '',
        headings,
        expertise,
        heroAlt: document.querySelector('#home-hero img')?.getAttribute('alt') || '',
      };
    })()
  `;
}

async function main() {
  fs.mkdirSync(evidenceDir, { recursive: true });
  const userData = fs.mkdtempSync(path.join(os.tmpdir(), 'fsms-keyword-copy-'));
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
    await page.send('Page.navigate', { url: `${previewUrl}?v=keyword-copy` });
    await page.once('Page.loadEventFired').catch(() => null);
    await wait(2800);

    const desktop = await page.eval(collectCopyState());
    await page.eval(`document.getElementById('expertise')?.scrollIntoView({ block: 'start' })`);
    await wait(500);
    await screenshot(page, 'expertise-desktop.png');

    await page.eval(`document.getElementById('home-hero')?.scrollIntoView({ block: 'start' })`);
    await wait(400);
    await page.eval(`document.querySelector('#home-hero button[aria-label="Next slide"]')?.click()`);
    await wait(1600);
    const afterNext = await page.eval(collectCopyState());
    await page.eval(`document.querySelector('#home-hero button[aria-label="Next slide"]')?.click()`);
    await wait(1600);
    const afterNext2 = await page.eval(collectCopyState());

    await page.eval(`document.querySelector('#expertise .cursor-pointer')?.click()`);
    await wait(900);
    const expertiseModal = await page.eval(`
      (() => ({
        open: !!document.querySelector('button[aria-label="Close modal"]'),
        title: document.querySelector('.fixed h2')?.textContent?.replace(/\\s+/g, ' ').trim() || '',
      }))()
    `);
    await page.eval(`document.querySelector('button[aria-label="Close modal"]')?.click()`);
    await wait(400);
    const modalClosed = await page.eval(`!document.querySelector('button[aria-label="Close modal"]')`);

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
        options: [...document.querySelectorAll('#cm-service option')].map((el) => el.value),
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
    const mobile = await page.eval(collectCopyState());
    await page.eval(`document.getElementById('expertise')?.scrollIntoView({ block: 'start' })`);
    await wait(500);
    await screenshot(page, 'expertise-mobile.png');
    await page.eval(`document.getElementById('expertise')?.scrollIntoView({ block: 'end' })`);
    await wait(400);
    await screenshot(page, 'expertise-mobile-end.png');

    const hydrationErrors = consoleNotes.filter((item) => /hydration/i.test(item.text || ''));
    const consoleErrors = consoleNotes.filter((item) => item.type === 'error' || item.type === 'exception');
    const desktopSummaries = (desktop.expertise || []).map((item) => item.summary);
    const mobileSummaries = (mobile.expertise || []).map((item) => item.summary);
    const desktopLabels = (desktop.expertise || []).map((item) => item.label);
    const summariesVisibleDesktop = (desktop.expertise || []).every((item) => item.opacity > 0.5 && item.summaryVisible);
    const summariesVisibleMobile = (mobile.expertise || []).every((item) => item.opacity > 0.5 && item.summaryVisible);
    const noOverflow = [...(desktop.expertise || []), ...(mobile.expertise || [])].every((item) => !item.overflow);

    const report = {
      previewUrl,
      desktop,
      mobile,
      afterNext: { h1Count: afterNext.h1Count, h1: afterNext.h1, heroAlt: afterNext.heroAlt },
      afterNext2: { h1Count: afterNext2.h1Count, h1: afterNext2.h1, heroAlt: afterNext2.heroAlt },
      expertiseModal,
      modalClosed,
      consultOpened,
      consultation,
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
      desktop.title.includes(EXPECTED_H1) &&
      JSON.stringify(desktopSummaries) === JSON.stringify(EXPECTED_SUMMARIES) &&
      JSON.stringify(mobileSummaries) === JSON.stringify(EXPECTED_SUMMARIES) &&
      JSON.stringify(desktopLabels) === JSON.stringify(EXPECTED_LABELS) &&
      summariesVisibleDesktop &&
      summariesVisibleMobile &&
      noOverflow &&
      expertiseModal.open &&
      expertiseModal.title === EXPECTED_LABELS[0] &&
      modalClosed &&
      consultation.open &&
      consultation.serviceValue === 'Artificial Grass Installation' &&
      hydrationErrors.length === 0;

    fs.writeFileSync(path.join(evidenceDir, 'browser-check.json'), `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify({
      passed: report.passed,
      h1: desktop.h1,
      h1AfterSlides: [afterNext.h1, afterNext2.h1],
      summariesVisibleDesktop,
      summariesVisibleMobile,
      noOverflow,
      desktopExpertise: desktop.expertise,
      mobileOverflow: (mobile.expertise || []).filter((item) => item.overflow),
      hydrationErrors: hydrationErrors.length,
      consoleErrors: consoleErrors.map((item) => item.text).slice(0, 8),
      expertiseModal,
      modalClosed,
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
