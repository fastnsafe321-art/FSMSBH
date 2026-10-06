/**
 * Focused Phase 3A browser check: hydration image attrs + carousel prefetch pair.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
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

async function main() {
  const html = fs.readFileSync(path.join(projectRoot, 'dist', 'index.html'), 'utf8');
  const prerenderSrcset = (html.match(
    /<source type="image\/webp" srcSet="([^"]*pristine_pitch_night[^"]*)"/,
  ) || html.match(
    /<source type="image\/webp" srcset="([^"]*pristine_pitch_night[^"]*)"/,
  ))?.[1] || null;
  const prerenderSrc = (html.match(
    /src="(\/assets\/images\/pristine_pitch_night_1781166845895\.png)"/,
  ) || [])[1] || null;
  const userData = fs.mkdtempSync(path.join(os.tmpdir(), 'fsms-phase3a-browser-'));
  const chrome = spawn(
    chromePath,
    [
      '--remote-debugging-port=9366',
      `--user-data-dir=${userData}`,
      '--headless=new',
      '--no-first-run',
      '--disable-extensions',
      '--window-size=1440,900',
      'about:blank',
    ],
    { windowsHide: true, stdio: 'ignore' },
  );
  await waitForJson('http://127.0.0.1:9366/json/version');
  let targets = [];
  for (let i = 0; i < 25; i++) {
    targets = await waitForJson('http://127.0.0.1:9366/json/list');
    if (targets.find((item) => item.type === 'page' && item.webSocketDebuggerUrl)) break;
    await wait(200);
  }
  const target = targets.find((item) => item.type === 'page' && item.webSocketDebuggerUrl);
  const page = new CdpSession(target.webSocketDebuggerUrl);
  await page.ready;
  await page.send('Network.enable');
  await page.send('Page.enable');
  await page.send('Runtime.enable');
  await page.send('Network.setCacheDisabled', { cacheDisabled: true });
  await page.send('Network.clearBrowserCache');
  await page.send('Network.setBlockedURLs', { urls: BLOCKED });
  await page.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  const imageUrls = [];
  page.on('Network.responseReceived', (params) => {
    const url = params.response?.url || '';
    if (/\.(webp|png|jpe?g)(\?|$)/i.test(url) || params.type === 'Image') {
      imageUrls.push(url);
    }
  });

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
    await page.send('Page.navigate', { url: `${previewUrl}?v=phase3a` });
    await page.once('Page.loadEventFired').catch(() => null);
    await wait(2500);

    const afterLoad = await page.eval(`
      (() => {
        const source = document.querySelector('#home-hero source');
        const img = document.querySelector('#home-hero img');
        return {
          srcset: source?.srcset || null,
          src: img?.src || null,
          currentSrc: img?.currentSrc || null,
          h1: document.querySelector('h1')?.textContent?.trim() || '',
        };
      })()
    `);

    const stadiumBeforeClick = imageUrls.filter((url) => url.includes('stadium_turf_night_pro'));
    await page.eval(`document.querySelector('#home-hero button[aria-label="Next slide"]')?.click()`);
    await wait(2200);
    const afterNext = await page.eval(`
      (() => {
        const img = document.querySelector('#home-hero img');
        return { currentSrc: img?.currentSrc || null, complete: !!img?.complete, blank: !img || (img.complete && img.naturalWidth === 0) };
      })()
    `);
    const stadiumAll = imageUrls.filter((url) => url.includes('stadium_turf_night_pro'));
    const stadiumWidths = [...new Set(stadiumAll.map((url) => (url.match(/__w(\d+)\.webp/) || [])[1]))];

    const report = {
      previewUrl,
      prerenderSrcset,
      prerenderSrc,
      hydratedSrcset: afterLoad.srcset,
      hydratedSrc: afterLoad.src,
      prerenderHydrateMatch:
        Boolean(prerenderSrcset) &&
        afterLoad.srcset === prerenderSrcset &&
        decodeURI(afterLoad.src || '').includes('/assets/images/pristine_pitch_night_1781166845895.png'),
      heroCurrentSrc: afterLoad.currentSrc,
      nextCurrentSrc: afterNext.currentSrc,
      nextBlank: afterNext.blank,
      stadiumBeforeClick,
      stadiumAll,
      stadiumWidths,
      noSmallPlusLargePrefetch:
        stadiumWidths.length <= 1 &&
        stadiumAll.every((url) => /__w1408\.webp/.test(url)) &&
        !stadiumAll.some((url) => /__w1280\.webp/.test(url)),
      hydrationErrors: consoleNotes.filter((item) => /hydration/i.test(item.text || '')),
      consoleErrors: consoleNotes.filter((item) => item.type === 'error' || item.type === 'exception'),
    };
    report.passed =
      report.prerenderHydrateMatch &&
      report.noSmallPlusLargePrefetch &&
      !report.nextBlank &&
      /stadium_turf_night_pro.+__w1408\.webp/.test(report.nextCurrentSrc || '') &&
      report.hydrationErrors.length === 0;

    fs.mkdirSync(path.join(projectRoot, 'seo-audit-evidence', 'phase-3a'), { recursive: true });
    fs.writeFileSync(
      path.join(projectRoot, 'seo-audit-evidence', 'phase-3a', 'browser-check.json'),
      `${JSON.stringify(report, null, 2)}\n`,
    );
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
