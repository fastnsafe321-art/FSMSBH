/**
 * Phase 3 cold-cache image baseline against the current local preview.
 * Isolated Chrome only. Blocks analytics / Firestore / EmailJS.
 */
import { spawn } from 'node:child_process';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { allUsedImages, publicPathFor } from './phase3-used-images.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'seo-audit-evidence', 'phase-3');
const shotDir = path.join(evidenceDir, 'baseline-shots');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const magick = 'C:\\Program Files\\ImageMagick-7.1.2-Q16-HDRI\\magick.exe';
const previewUrl = process.env.FSMS_PREVIEW_URL || 'http://127.0.0.1:4175/';
const label = process.env.FSMS_PHASE3_LABEL || 'baseline';
const BLOCKED = [
  '*googletagmanager.com*',
  '*google-analytics.com*',
  '*doubleclick.net*',
  '*firestore.googleapis.com*',
  '*firebaseio.com*',
  '*firebaselogging.googleapis.com*',
  '*api.emailjs.com*',
];

fs.mkdirSync(shotDir, { recursive: true });

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
        const next = (this.listeners.get(method) || []).filter((item) => item !== handler);
        this.listeners.set(method, next);
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

  async eval(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    }
    return result.result?.value;
  }

  close() {
    try {
      this.ws.close();
    } catch {
      // ignore
    }
  }
}

async function launchChrome(debugPort, extraArgs = []) {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fsms-p3-'));
  const chrome = spawn(
    chromePath,
    [
      `--remote-debugging-port=${debugPort}`,
      `--user-data-dir=${userDataDir}`,
      '--headless=new',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--hide-scrollbars',
      `--window-size=${extraArgs.windowWidth || 1440},${extraArgs.windowHeight || 900}`,
      'about:blank',
    ],
    { windowsHide: true, stdio: 'ignore' },
  );
  await waitForJson(`http://127.0.0.1:${debugPort}/json/version`);
  return { chrome, userDataDir, debugPort };
}

async function attachPage(debugPort) {
  const pages = await waitForJson(`http://127.0.0.1:${debugPort}/json/list`);
  const target = pages.find((item) => item.type === 'page' && item.webSocketDebuggerUrl);
  if (!target) throw new Error('No Chrome page target');
  const page = new CdpSession(target.webSocketDebuggerUrl);
  await page.ready;
  await page.send('Runtime.enable');
  await page.send('Page.enable');
  await page.send('Network.enable');
  await page.send('Network.setCacheDisabled', { cacheDisabled: true });
  await page.send('Network.clearBrowserCache');
  await page.send('Network.setBlockedURLs', { urls: BLOCKED });
  return page;
}

async function killChrome(session) {
  try {
    session.page?.close();
  } catch {
    // ignore
  }
  try {
    session.chrome?.kill();
  } catch {
    // ignore
  }
  await wait(400);
  try {
    fs.rmSync(session.userDataDir, { recursive: true, force: true });
  } catch {
    // ignore
  }
}

function collectRequests(page) {
  const requests = new Map();
  page.on('Network.requestWillBeSent', (params) => {
    requests.set(params.requestId, {
      url: params.request?.url,
      method: params.request?.method,
      type: params.type,
      started: Date.now(),
    });
  });
  page.on('Network.responseReceived', (params) => {
    const rec = requests.get(params.requestId) || { url: params.response?.url };
    rec.status = params.response?.status;
    rec.mime = params.response?.mimeType;
    rec.type = rec.type || params.type;
    rec.encodedDataLength = params.response?.encodedDataLength;
    requests.set(params.requestId, rec);
  });
  page.on('Network.loadingFinished', (params) => {
    const rec = requests.get(params.requestId) || {};
    rec.encodedDataLength = params.encodedDataLength;
    requests.set(params.requestId, rec);
  });
  return requests;
}

function summarizeImageRequests(requests) {
  const images = [...requests.values()].filter((item) => {
    const url = item.url || '';
    return item.type === 'Image' || /\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(url);
  });
  return {
    count: images.length,
    bytes: images.reduce((sum, item) => sum + (Number(item.encodedDataLength) || 0), 0),
    urls: images.map((item) => ({
      url: item.url,
      status: item.status,
      mime: item.mime,
      bytes: Number(item.encodedDataLength) || 0,
    })),
  };
}

async function capture(page, filename) {
  const shot = await page.send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  const dest = path.join(shotDir, filename);
  fs.writeFileSync(dest, Buffer.from(shot.data, 'base64'));
  return { file: `baseline-shots/${filename}`, bytes: fs.statSync(dest).size };
}

async function installObservers(page) {
  await page.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      window.__fsmsPhase3 = { lcp: null };
      try {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1];
          if (!last) return;
          window.__fsmsPhase3.lcp = {
            startTime: last.startTime,
            size: last.size,
            url: last.url || null,
            tag: last.element && last.element.tagName,
            id: last.element && last.element.id,
            alt: last.element && last.element.getAttribute && last.element.getAttribute('alt'),
            className: last.element && last.element.className,
          };
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (error) {}
    `,
  });
}

async function displayedImages(page) {
  return page.eval(`
    (() => [...document.images].map((img) => {
      const rect = img.getBoundingClientRect();
      return {
        src: img.currentSrc || img.src,
        alt: img.alt,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        clientWidth: Math.round(img.clientWidth),
        clientHeight: Math.round(img.clientHeight),
        top: Math.round(rect.top),
        inViewport: rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth,
        loading: img.loading,
        complete: img.complete,
      };
    }))()
  `);
}

async function runViewport(viewport, port) {
  const launched = await launchChrome(port, {
    windowWidth: viewport.width,
    windowHeight: viewport.height,
  });
  const page = await attachPage(launched.debugPort);
  const session = { ...launched, page };
  const requests = collectRequests(page);
  const started = Date.now();
  try {
    await installObservers(page);
    await page.send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: viewport.dpr,
      mobile: viewport.mobile,
    });

    await page.send('Page.navigate', { url: `${previewUrl}${previewUrl.includes('?') ? '&' : '?'}v=${label}-${viewport.name}` });
    await page.once('Page.loadEventFired').catch(() => null);
    await wait(2500);

    const phaseA = {
      name: 'A-initial-no-scroll',
      durationMs: Date.now() - started,
      viewport: viewport.name,
      width: viewport.width,
      height: viewport.height,
      dpr: viewport.dpr,
      images: summarizeImageRequests(requests),
      displayed: await displayedImages(page),
      lcp: await page.eval(`window.__fsmsPhase3 && window.__fsmsPhase3.lcp`),
      shots: {
        hero: await capture(page, `${label}-${viewport.name}-hero.png`),
      },
    };

    const scrollStarted = Date.now();
    for (const selector of ['#hybridgrass', '#sub-air-system', '#services', '#expertise', '#projects', '#contact']) {
      await page.eval(`
        (() => {
          const el = document.querySelector(${JSON.stringify(selector)});
          if (el) el.scrollIntoView({ block: 'start', behavior: 'instant' });
          return true;
        })()
      `).catch(() => null);
      await wait(700);
    }
    const phaseB = {
      name: 'B-full-homepage-scroll',
      durationMs: Date.now() - scrollStarted,
      sequence: ['#hybridgrass', '#sub-air-system', '#services', '#expertise', '#projects', '#contact'],
      images: summarizeImageRequests(requests),
      shots: {
        hybrid: await (async () => {
          await page.eval(`document.querySelector('#hybridgrass')?.scrollIntoView({block:'start',behavior:'instant'})`);
          await wait(400);
          return capture(page, `${label}-${viewport.name}-hybrid.png`);
        })(),
        expertise: await (async () => {
          await page.eval(`document.querySelector('#expertise')?.scrollIntoView({block:'start',behavior:'instant'})`);
          await wait(400);
          return capture(page, `${label}-${viewport.name}-expertise.png`);
        })(),
        projects: await (async () => {
          await page.eval(`document.querySelector('#projects')?.scrollIntoView({block:'start',behavior:'instant'})`);
          await wait(400);
          return capture(page, `${label}-${viewport.name}-projects.png`);
        })(),
        contact: await (async () => {
          await page.eval(`document.querySelector('#contact')?.scrollIntoView({block:'start',behavior:'instant'})`);
          await wait(400);
          return capture(page, `${label}-${viewport.name}-contact.png`);
        })(),
      },
    };

    const galleryStarted = Date.now();
    await page.eval(`document.querySelector('#expertise')?.scrollIntoView({block:'start',behavior:'instant'})`);
    await wait(400);
    await page.eval(`
      (() => {
        const card = document.querySelector('#expertise .group, #expertise [class*="cursor-pointer"]');
        if (card) card.click();
        return true;
      })()
    `);
    await wait(1500);
    const expertiseModalOpen = await page.eval(`document.body.innerText.includes('ARTIFICIAL GRASS') || document.body.innerText.includes('Installation Flow')`);
    const afterExpertise = summarizeImageRequests(requests);
    await page.eval(`
      (() => {
        const close = document.querySelector('[aria-label="Close modal"], button[aria-label*="Close"]')
          || [...document.querySelectorAll('button')].find((el) => el.querySelector('svg') && el.closest('.relative'));
        const buttons = [...document.querySelectorAll('button')];
        const x = buttons.find((el) => el.getAttribute('aria-label') && /close/i.test(el.getAttribute('aria-label')));
        (x || buttons.find((el) => el.className.includes('rounded-full') && el.closest('#expertise-section-overview, .relative.h-\\[420px\\], .h-56')))?.click();
        return true;
      })()
    `).catch(() => null);
    await wait(400);
    await page.eval(`document.querySelector('#projects')?.scrollIntoView({block:'start',behavior:'instant'})`);
    await wait(400);
    await page.eval(`
      (() => {
        const card = document.querySelector('#projects .group');
        if (card) card.click();
        return true;
      })()
    `);
    await wait(1500);
    const projectModalText = await page.eval(`document.body.innerText.includes('Project Overview') || document.body.innerText.includes('Project Visual')`);
    const modalShot = await capture(page, `${label}-${viewport.name}-modal.png`);
    const phaseC = {
      name: 'C-representative-modals',
      durationMs: Date.now() - galleryStarted,
      sequence: ['open first expertise card', 'open first project card'],
      expertiseModalOpen,
      projectModalOpen: projectModalText,
      images: summarizeImageRequests(requests),
      expertiseOnlyDeltaBytes: afterExpertise.bytes - phaseB.images.bytes,
      shots: { modal: modalShot },
    };

    return {
      viewport,
      phaseA,
      phaseB,
      phaseC,
      totalImageBytes: summarizeImageRequests(requests).bytes,
      totalImageRequests: summarizeImageRequests(requests).count,
    };
  } finally {
    await killChrome(session);
  }
}

function inventoryOnDisk() {
  const srcDir = path.join(projectRoot, 'src', 'assets', 'images');
  const publicDir = path.join(projectRoot, 'public', 'assets', 'images');
  return allUsedImages().map((item) => {
    const srcPath = path.join(srcDir, item.file);
    const publicPath = path.join(publicDir, item.file);
    const resolved = fs.existsSync(srcPath) ? srcPath : publicPath;
    const exists = fs.existsSync(resolved);
    let identify = null;
    if (exists) {
      try {
        identify = execFileSync(magick, ['identify', '-format', '%w %h %m %b %[opaque]', resolved], {
          encoding: 'utf8',
        }).trim();
      } catch (error) {
        identify = String(error.stderr || error.message);
      }
    }
    const [width, height, format, bytes, opaque] = (identify || '').split(' ');
    return {
      file: item.file,
      role: item.role,
      publicPath: publicPathFor(item.file),
      exists,
      width: Number(width) || null,
      height: Number(height) || null,
      format: format || null,
      diskBytes: exists ? fs.statSync(resolved).size : null,
      magickBytes: bytes || null,
      opaque: opaque,
    };
  });
}

async function main() {
  const report = {
    generatedAt: new Date().toISOString(),
    label,
    previewUrl,
    coldCache: {
      cacheDisabled: true,
      clearBrowserCache: true,
      isolatedProfile: true,
      blocked: BLOCKED,
    },
    diskInventory: inventoryOnDisk(),
    desktop: null,
    mobile: null,
  };

  report.desktop = await runViewport(
    { name: 'desktop', width: 1440, height: 900, dpr: 1, mobile: false },
    9351,
  );
  report.mobile = await runViewport(
    { name: 'mobile', width: 390, height: 844, dpr: 2, mobile: true },
    9352,
  );

  const out = path.join(evidenceDir, `${label}-network.json`);
  fs.writeFileSync(out, JSON.stringify(report, null, 2), 'utf8');
  const summary = {
    file: out,
    desktopA: report.desktop.phaseA.images,
    desktopB: { count: report.desktop.phaseB.images.count, bytes: report.desktop.phaseB.images.bytes },
    desktopC: { count: report.desktop.phaseC.images.count, bytes: report.desktop.phaseC.images.bytes },
    desktopLcp: report.desktop.phaseA.lcp,
    mobileA: report.mobile.phaseA.images,
    mobileLcp: report.mobile.phaseA.lcp,
  };
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
