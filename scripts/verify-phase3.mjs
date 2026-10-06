/**
 * Phase 3 local interaction / hydration / currentSrc checks.
 * Isolated Chrome. Blocks analytics / Firestore / EmailJS.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'seo-audit-evidence', 'phase-3');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const previewUrl = process.env.FSMS_PREVIEW_URL || 'http://127.0.0.1:4176/';
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
        return;
      }
      if (message.method) {
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
      if (result.exceptionDetails) {
        throw new Error(result.exceptionDetails.text || 'eval failed');
      }
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

async function launchChrome(port) {
  const userData = fs.mkdtempSync(path.join(os.tmpdir(), `fsms-phase3-verify-${port}-`));
  const proc = spawn(
    chromePath,
    [
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userData}`,
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-background-networking',
      '--window-size=1440,900',
      'about:blank',
    ],
    { windowsHide: true, stdio: 'ignore' },
  );
  await waitForJson(`http://127.0.0.1:${port}/json/version`);
  return { proc, userData, debugPort: port };
}

async function attachPage(debugPort) {
  let pageTarget = null;
  for (let i = 0; i < 25; i++) {
    const targets = await waitForJson(`http://127.0.0.1:${debugPort}/json/list`);
    pageTarget = targets.find((item) => item.type === 'page' && item.webSocketDebuggerUrl);
    if (pageTarget) break;
    await wait(200);
  }
  if (!pageTarget) throw new Error('No Chrome page target');
  const page = new CdpSession(pageTarget.webSocketDebuggerUrl);
  await page.ready;
  await page.send('Network.enable');
  await page.send('Page.enable');
  await page.send('Runtime.enable');
  await page.send('Network.setCacheDisabled', { cacheDisabled: true });
  await page.send('Network.clearBrowserCache');
  await page.send('Network.setBlockedURLs', { urls: BLOCKED });
  return page;
}

async function killChrome(session) {
  session.page?.close();
  session.browser?.close();
  if (session.proc && !session.proc.killed) session.proc.kill();
  await wait(400);
  fs.rmSync(session.userData, { recursive: true, force: true });
}

async function main() {
  const consoleNotes = [];
  const launched = await launchChrome(9361);
  const page = await attachPage(launched.debugPort);
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
  const session = { ...launched, page };
  try {
    await page.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await page.send('Page.navigate', { url: `${previewUrl}?v=phase3-verify` });
    await page.once('Page.loadEventFired').catch(() => null);
    await wait(2500);

    const desktop = await page.eval(`
      (() => {
        const hero = document.querySelector('#home-hero img');
        const pictures = document.querySelectorAll('picture').length;
        const eager = [...document.images].filter((img) => img.loading === 'eager').map((img) => img.alt);
        const broken = [...document.images].filter((img) => img.complete && img.naturalWidth === 0 && img.getBoundingClientRect().height > 0).map((img) => img.src);
        return {
          title: document.title,
          h1: document.querySelector('h1')?.textContent?.trim() || '',
          heroCurrentSrc: hero?.currentSrc || null,
          heroSrc: hero?.src || null,
          heroComplete: !!hero?.complete,
          heroNatural: hero ? [hero.naturalWidth, hero.naturalHeight] : null,
          pictures,
          eagerAlts: eager,
          visibleBroken: broken,
        };
      })()
    `);

    await page.eval(`
      (() => {
        const next = document.querySelector('#home-hero button[aria-label="Next slide"]');
        next?.click();
        return !!next;
      })()
    `);
    await wait(2200);
    const afterNext = await page.eval(`
      (() => {
        const hero = document.querySelector('#home-hero img');
        return {
          heroCurrentSrc: hero?.currentSrc || null,
          heroComplete: !!hero?.complete,
          heroNatural: hero ? [hero.naturalWidth, hero.naturalHeight] : null,
          blank: !hero || (hero.complete && hero.naturalWidth === 0),
        };
      })()
    `);

    await page.eval(`document.querySelector('#expertise')?.scrollIntoView({block:'start',behavior:'instant'})`);
    await wait(500);
    await page.eval(`document.querySelector('#expertise .group')?.click()`);
    await wait(1200);
    const expertiseModal = await page.eval(`
      (() => {
        const text = document.body.innerText;
        const imgs = [...document.querySelectorAll('[role="dialog"] img, .fixed img')].slice(0, 8).map((img) => ({
          alt: img.alt,
          currentSrc: img.currentSrc,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
        }));
        return {
          open: /ARTIFICIAL GRASS|Installation Flow|Artificial Grass/i.test(text),
          images: imgs,
        };
      })()
    `);
    await page.eval(`
      (() => {
        const close = document.querySelector('[aria-label="Close modal"], [aria-label*="Close"]');
        close?.click();
        return true;
      })()
    `);
    await wait(400);
    await page.eval(`document.querySelector('#projects')?.scrollIntoView({block:'start',behavior:'instant'})`);
    await wait(500);
    await page.eval(`document.querySelector('#projects .group')?.click()`);
    await wait(1500);
    const projectModal = await page.eval(`
      (() => {
        const text = document.body.innerText;
        const imgs = [...document.querySelectorAll('.fixed img, [role="dialog"] img')].map((img) => ({
          alt: img.alt,
          currentSrc: img.currentSrc,
          src: img.src,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
        }));
        return {
          open: /Hoora Youth Centre/i.test(text) && /PROJECT OVERVIEW|Project Overview/i.test(text),
          images: imgs,
          hasFinalTopView: imgs.some((img) => /Final_Top_View|Final%20Top%20View|Final Top View/i.test(img.currentSrc + img.src)),
          allWebpOrKnown: imgs.every((img) => /\\/opt\\/.+\\.webp/i.test(img.currentSrc) || !img.currentSrc),
        };
      })()
    `);

    const unknown = await page.eval(`
      (() => {
        const img = document.createElement('img');
        img.src = 'https://example.com/custom-unknown.jpg';
        return { src: img.src, rewritten: img.src.includes('/assets/images/opt/') };
      })()
    `);

    const hydration = consoleNotes.filter((item) => /hydration/i.test(item.text || ''));
    const report = {
      previewUrl,
      desktop,
      afterNext,
      expertiseModal: { open: expertiseModal.open, imageCount: expertiseModal.images.length, samples: expertiseModal.images },
      projectModal,
      unknownUrlUntouched: unknown,
      hydrationErrors: hydration,
      consoleErrors: consoleNotes.filter((item) => item.type === 'error' || item.type === 'exception'),
      consoleNotes: consoleNotes.slice(0, 40),
    };
    fs.mkdirSync(evidenceDir, { recursive: true });
    fs.writeFileSync(path.join(evidenceDir, 'verify-phase3.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await killChrome(session);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
