/**
 * Phase 2D remaining local verification. Isolated Chrome only. No production/deploy.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'seo-audit-evidence', 'phase-2d');
const shotDir = path.join(evidenceDir, 'verify-shots');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const previewUrl = process.env.FSMS_PREVIEW_URL || 'http://127.0.0.1:4175/';
const devUrl = process.env.FSMS_DEV_URL || 'http://127.0.0.1:3003/';
const BLOCKED = [
  '*googletagmanager.com*',
  '*google-analytics.com*',
  '*doubleclick.net*',
  '*firestore.googleapis.com*',
  '*firebaseio.com*',
  '*firebaselogging.googleapis.com*',
  '*api.emailjs.com*',
];

const SYNTHETIC = [
  {
    id: 9101,
    title: 'PHASE2D SYNTHETIC PROJECT',
    category: 'Professional Sports',
    desc: 'Isolated verification only',
    image: '/assets/images/pristine_pitch_night_1781166845895.png',
    client: 'Verify Client',
    year: '2026',
    details: 'Synthetic storage fixture',
    gallery: ['/assets/images/pristine_pitch_night_1781166845895.png'],
  },
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
    this.console = [];
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
        const fns = this.listeners.get(message.method) || [];
        for (const fn of fns) fn(message.params || {});
      }
    });
  }

  on(method, fn) {
    const list = this.listeners.get(method) || [];
    list.push(fn);
    this.listeners.set(method, list);
    return () => {
      this.listeners.set(
        method,
        (this.listeners.get(method) || []).filter((item) => item !== fn),
      );
    };
  }

  once(method, predicate = () => true, timeoutMs = 20000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        off();
        reject(new Error(`Timed out waiting for ${method}`));
      }, timeoutMs);
      const off = this.on(method, (params) => {
        if (!predicate(params)) return;
        clearTimeout(timer);
        off();
        resolve(params);
      });
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
      const text = result.exceptionDetails.exception?.description || result.exceptionDetails.text;
      throw new Error(text || 'Runtime.evaluate failed');
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
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fsms-2d-'));
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
      '--window-size=1440,900',
      ...extraArgs,
      'about:blank',
    ],
    { windowsHide: true, stdio: 'ignore' },
  );
  const version = await waitForJson(`http://127.0.0.1:${debugPort}/json/version`);
  return { chrome, userDataDir, wsUrl: version.webSocketDebuggerUrl, debugPort };
}

async function attachPage(debugPort) {
  const pages = await waitForJson(`http://127.0.0.1:${debugPort}/json/list`);
  const target = pages.find((item) => item.type === 'page' && item.webSocketDebuggerUrl);
  if (!target) throw new Error('No Chrome page target');
  const page = new CdpSession(target.webSocketDebuggerUrl);
  await page.ready;
  page.on('Console.messageAdded', (params) => {
    page.console.push({
      when: Date.now(),
      source: 'console',
      level: params.message?.level,
      text: params.message?.text,
    });
  });
  page.on('Runtime.consoleAPICalled', (params) => {
    page.console.push({
      when: Date.now(),
      source: 'runtime',
      level: params.type,
      text: (params.args || []).map((arg) => arg.value ?? arg.description ?? '').join(' '),
    });
  });
  await page.send('Runtime.enable');
  await page.send('Console.enable');
  await page.send('Log.enable');
  await page.send('Page.enable');
  await page.send('Network.enable');
  await page.send('Network.setBlockedURLs', { urls: BLOCKED });
  await page.send('Emulation.setDefaultBackgroundColorOverride', {
    color: { r: 255, g: 0, b: 255, a: 255 },
  });
  return page;
}

async function prepareStorageProbe(page) {
  await page.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      (function () {
        const writes = [];
        const proto = Storage.prototype;
        const setItem = proto.setItem;
        proto.setItem = function (key, value) {
          writes.push({ key: String(key), value: String(value), at: Date.now() });
          return setItem.call(this, key, value);
        };
        window.__fsmsStorageWrites = writes;
      })();
    `,
  });
}

async function killChrome(session) {
  if (!session) return;
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

function snapshotConsole(page, until) {
  return page.console
    .filter((item) => !until || item.when <= until)
    .map((item) => ({ level: item.level, text: item.text, source: item.source }));
}

async function captureViewport(page, filename) {
  const shot = await page.send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
  });
  const buf = Buffer.from(shot.data, 'base64');
  const dest = path.join(shotDir, filename);
  fs.writeFileSync(dest, buf);
  return {
    file: `verify-shots/${filename}`,
    bytes: buf.length,
    usable: buf.length >= 20000,
  };
}

async function waitForImages(page) {
  await page.eval(`
    Promise.all([...document.images].map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise((resolve) => {
        const done = () => resolve();
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
        setTimeout(done, 4000);
      });
    }))
  `);
}

async function showSection(page, selector) {
  await page.eval(`
    (() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) throw new Error(${JSON.stringify(`missing ${selector}`)});
      el.scrollIntoView({ block: 'start', behavior: 'instant' });
      return true;
    })()
  `);
  await wait(700);
  await waitForImages(page);
  await wait(300);
}

async function hydrateProof(preview) {
  const launched = await launchChrome(9335);
  const page = await attachPage(launched.debugPort);
  const session = { ...launched, page };
  try {
    await page.send('Network.setCacheDisabled', { cacheDisabled: true });
    await page.send('Fetch.enable', {
      patterns: [{ urlPattern: '*/assets/index-*.js*', requestStage: 'Request' }],
    });
    const paused = page.once(
      'Fetch.requestPaused',
      (params) => /index-.*\.js/.test(params.request?.url || ''),
    );
    await page.send('Page.navigate', { url: preview });
    const request = await paused;
    const before = await page.eval(`
      (() => {
        const app = document.querySelector('#root > div');
        const navbar = document.querySelector('#root nav');
        const heading = document.querySelector('#hybridgrass h2');
        window.__fsmsPreNodes = { app, navbar, heading };
        const root = document.getElementById('root');
        return {
          appTag: app && app.tagName,
          appClass: app && app.className,
          navbarTag: navbar && navbar.tagName,
          headingText: heading && heading.textContent.replace(/\\s+/g, ' ').trim(),
          appConnected: !!(app && app.isConnected),
          navbarConnected: !!(navbar && navbar.isConnected),
          headingConnected: !!(heading && heading.isConnected),
          reactKeys: Object.keys(root || {}).filter((key) => key.startsWith('__react')),
          rootChildCount: root && root.childElementCount,
          moduleExecuted: !!(window.__FSMS_MAIN_RAN),
        };
      })()
    `);
    const consoleBeforeModule = snapshotConsole(page);
    await page.send('Fetch.continueRequest', { requestId: request.requestId });
    await page.send('Fetch.disable');
    const hydrated = await (async () => {
      const start = Date.now();
      while (Date.now() - start < 15000) {
        const ready = await page.eval(`
          (() => {
            const root = document.getElementById('root');
            return !!(root && Object.keys(root).some((key) => key.startsWith('__react')));
          })()
        `);
        if (ready) return true;
        await wait(100);
      }
      return false;
    })();
    await wait(400);
    const after = await page.eval(`
      (() => {
        const pre = window.__fsmsPreNodes || {};
        const app = document.querySelector('#root > div');
        const navbar = document.querySelector('#root nav');
        const heading = document.querySelector('#hybridgrass h2');
        const root = document.getElementById('root');
        return {
          hydratedSignal: !!(root && Object.keys(root).some((key) => key.startsWith('__react'))),
          appSameObject: pre.app === app,
          navbarSameObject: pre.navbar === navbar,
          headingSameObject: pre.heading === heading,
          appStillConnected: !!(pre.app && pre.app.isConnected),
          navbarStillConnected: !!(pre.navbar && pre.navbar.isConnected),
          headingStillConnected: !!(pre.heading && pre.heading.isConnected),
          headingStillHybrid: !!(pre.heading && pre.heading === heading && /HYBRIDGRASS/i.test(pre.heading.textContent || '')),
          appStillWrapper: !!(pre.app && pre.app === app && /min-h-screen/.test(pre.app.className || '')),
          navbarStillNav: !!(pre.navbar && pre.navbar === navbar && pre.navbar.tagName === 'NAV'),
        };
      })()
    `);
    const browserRoot = await page.eval(`document.getElementById('root') && document.getElementById('root').innerHTML.length`);
    return {
      before,
      after,
      hydrated,
      consoleBeforeModule,
      consoleAfterHydration: snapshotConsole(page),
      browserRootLength: browserRoot,
      passed:
        after.appSameObject &&
        after.navbarSameObject &&
        after.headingSameObject &&
        after.appStillConnected &&
        after.navbarStillConnected &&
        after.headingStillConnected,
    };
  } finally {
    await killChrome(session);
  }
}

async function visualSuite(preview, viewport, prefix) {
  const port = viewport.mobile ? 9337 : 9336;
  const launched = await launchChrome(port, [
    `--window-size=${viewport.width},${viewport.height}`,
  ]);
  const page = await attachPage(launched.debugPort);
  const session = { ...launched, page };
  const shots = {};
  try {
    await page.send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: viewport.mobile ? 2 : 1,
      mobile: viewport.mobile,
    });
    await page.send('Page.navigate', { url: preview });
    await page.once('Page.loadEventFired', () => true, 20000).catch(() => null);
    await wait(900);
    await waitForImages(page);
    const heroMeta = await page.eval(`
      (() => {
        const h1 = document.querySelector('#home-hero h1, h1');
        return {
          h1: h1 && h1.textContent.replace(/\\s+/g, ' ').trim(),
          slide: document.body.innerText.includes('WE BUILD THE GROUND') ? 1 : 'other',
        };
      })()
    `);
    shots.hero = await captureViewport(page, `${prefix}-hero-slide1.png`);
    shots.hero.meta = heroMeta;
    const sections = [
      ['hybrid', '#hybridgrass'],
      ['expertise', '#expertise'],
      ['projects', '#projects'],
      ['contact', '#contact'],
    ];
    for (const [name, selector] of sections) {
      try {
        await showSection(page, selector);
        shots[name] = await captureViewport(page, `${prefix}-${name}.png`);
      } catch (error) {
        shots[name] = { file: null, error: String(error.message || error), usable: false };
      }
    }
    try {
      await page.eval(`
        (() => {
          const btn = [...document.querySelectorAll('button')].find((el) =>
            /REQUEST CONSULTATION/i.test(el.textContent || '')
          );
          if (!btn) throw new Error('consultation button missing');
          btn.click();
          return true;
        })()
      `);
      await wait(800);
      shots.modal = await captureViewport(page, `${prefix}-modal.png`);
      shots.modal.meta = await page.eval(`
        document.body.innerText.includes('Request Technical Consultation')
      `);
      await page.eval(`
        (() => {
          const close = document.querySelector('[aria-label="Close modal"]')
            || [...document.querySelectorAll('button')].find((el) => /close/i.test(el.getAttribute('aria-label') || '') || el.textContent.trim() === '×');
          if (close) close.click();
          return true;
        })()
      `);
    } catch (error) {
      shots.modal = { file: null, error: String(error.message || error), usable: false };
    }
    return shots;
  } finally {
    await killChrome(session);
  }
}

async function noJsSuite(preview) {
  const launched = await launchChrome(9338);
  const page = await attachPage(launched.debugPort);
  const session = { ...launched, page };
  try {
    await page.send('Emulation.setScriptExecutionDisabled', { value: true });
    await page.send('Page.navigate', { url: preview });
    await page.once('Page.loadEventFired', () => true, 20000).catch(() => null);
    await wait(1000);
    const readability = await page.eval(`
      (() => {
        const h1 = document.querySelector('#home-hero h1, h1');
        const heroCopy = document.querySelector('#home-hero [data-hero-copy]');
        const bullets = [...document.querySelectorAll('#hybridgrass [data-hybrid-spec] > li')];
        const h1Cs = h1 ? getComputedStyle(h1) : null;
        const wrapCs = heroCopy ? getComputedStyle(heroCopy) : null;
        return {
          htmlHasNoJs: document.documentElement.classList.contains('no-js'),
          h1: h1 && h1.textContent.replace(/\\s+/g, ' ').trim(),
          h1Opacity: h1Cs && h1Cs.opacity,
          heroCopyOpacity: wrapCs && wrapCs.opacity,
          heroCopyTransform: wrapCs && wrapCs.transform,
          bullets: bullets.map((li) => ({
            text: li.textContent.replace(/\\s+/g, ' ').trim(),
            opacity: getComputedStyle(li).opacity,
            transform: getComputedStyle(li).transform,
          })),
        };
      })()
    `);
    const hero = await captureViewport(page, 'nojs-desktop-hero.png');
    try {
      await showSection(page, '#hybridgrass');
    } catch {
      // scroll may fail if evaluate is limited; still try capture
    }
    const hybrid = await captureViewport(page, 'nojs-desktop-hybrid.png');
    try {
      await showSection(page, '#hybridgrass [data-hybrid-spec]');
    } catch {
      // keep previous hybrid shot if the spec list cannot be scrolled
    }
    const hybridBullets = await captureViewport(page, 'nojs-desktop-hybrid-bullets.png');
    return { readability, hero, hybrid, hybridBullets };
  } finally {
    await killChrome(session);
  }
}

async function storageSuite(url, label) {
  const launched = await launchChrome(label === 'dev' ? 9339 : 9340);
  const page = await attachPage(launched.debugPort);
  const session = { ...launched, page };
  try {
    await prepareStorageProbe(page);
    const result = { label, url };

    await page.send('Page.navigate', { url });
    await page.once('Page.loadEventFired', () => true, 20000).catch(() => null);
    await wait(1200);
    result.freshWrites = await page.eval(`window.__fsmsStorageWrites || []`);
    result.freshProjects = await page.eval(`localStorage.getItem('fast_safe_projects')`);

    await page.eval(`localStorage.setItem('fast_safe_projects', ${JSON.stringify(JSON.stringify(SYNTHETIC))})`);
    await page.send('Page.navigate', { url: `${url}${url.includes('?') ? '&' : '?'}v=synthetic` });
    await page.once('Page.loadEventFired', () => true, 20000).catch(() => null);
    await wait(1500);
    result.afterSyntheticRestore = await page.eval(`
      (() => {
        const text = document.body.innerText;
        return {
          visible: text.includes('PHASE2D SYNTHETIC PROJECT'),
          stored: localStorage.getItem('fast_safe_projects'),
          startupWrites: (window.__fsmsStorageWrites || []).filter((item) => item.key === 'fast_safe_projects'),
        };
      })()
    `);

    await page.eval(`
      (() => {
        const cardTitle = [...document.querySelectorAll('#projects h4')].find((el) =>
          el.textContent.includes('PHASE2D SYNTHETIC PROJECT')
        );
        if (!cardTitle) throw new Error('synthetic card missing');
        cardTitle.scrollIntoView({ block: 'center', behavior: 'instant' });
        const card = cardTitle.closest('.group') || cardTitle.closest('div');
        const btn = card.querySelector('button');
        if (!btn) throw new Error('delete button missing');
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
        btn.click();
        return true;
      })()
    `);
    await wait(600);
    const confirmReady = await page.eval(`
      (() => {
        const cardTitle = [...document.querySelectorAll('#projects h4')].find((el) =>
          el.textContent.includes('PHASE2D SYNTHETIC PROJECT')
        );
        if (!cardTitle) return { ready: false, reason: 'card gone' };
        const card = cardTitle.closest('.group') || cardTitle.closest('div');
        const btn = card.querySelector('button');
        return {
          ready: !!(btn && /Confirm/i.test(String(btn.getAttribute('title') || '') + ' ' + String(btn.textContent || ''))),
          title: btn && btn.getAttribute('title'),
          text: btn && btn.textContent.trim(),
        };
      })()
    `);
    result.deleteArm = confirmReady;
    if (!confirmReady.ready) {
      await wait(400);
    }
    result.delete = await page.eval(`
      (() => {
        const cardTitle = [...document.querySelectorAll('#projects h4')].find((el) =>
          el.textContent.includes('PHASE2D SYNTHETIC PROJECT')
        );
        if (!cardTitle) return { ok: false, reason: 'synthetic card missing after first click' };
        const card = cardTitle.closest('.group') || cardTitle.closest('div');
        const btn = [...card.querySelectorAll('button')].find((el) =>
          /Confirm Delete|Delete Project/i.test(String(el.getAttribute('title') || '') + ' ' + String(el.textContent || ''))
        );
        if (!btn) return { ok: false, reason: 'confirm button missing' };
        const confirmLabel = btn.getAttribute('title') || btn.textContent;
        btn.style.opacity = '1';
        btn.click();
        return {
          ok: true,
          confirmLabel,
          stored: localStorage.getItem('fast_safe_projects'),
          visibleAfter: document.body.innerText.includes('PHASE2D SYNTHETIC PROJECT'),
          writes: (window.__fsmsStorageWrites || []).filter((item) => item.key === 'fast_safe_projects'),
        };
      })()
    `);
    await wait(300);
    await page.send('Page.navigate', { url: `${url}${url.includes('?') ? '&' : '?'}v=after-delete` });
    await page.once('Page.loadEventFired', () => true, 20000).catch(() => null);
    await wait(1500);
    result.afterDeleteReload = await page.eval(`
      (() => ({
        visible: document.body.innerText.includes('PHASE2D SYNTHETIC PROJECT'),
        stored: localStorage.getItem('fast_safe_projects'),
      }))()
    `);

    await page.eval(`localStorage.setItem('fast_safe_projects', '[]')`);
    await page.send('Page.navigate', { url: `${url}${url.includes('?') ? '&' : '?'}v=empty` });
    await page.once('Page.loadEventFired', () => true, 20000).catch(() => null);
    await wait(1500);
    result.emptyArray = await page.eval(`
      (() => ({
        stored: localStorage.getItem('fast_safe_projects'),
        hasHoora: document.body.innerText.includes('Hoora'),
        cardTitles: [...document.querySelectorAll('#projects h4')].map((el) => el.textContent.trim()),
        writes: (window.__fsmsStorageWrites || []).filter((item) => item.key === 'fast_safe_projects'),
      }))()
    `);

    await page.eval(`localStorage.setItem('fast_safe_projects', '{not-valid-json')`);
    await page.send('Page.navigate', { url: `${url}${url.includes('?') ? '&' : '?'}v=malformed` });
    await page.once('Page.loadEventFired', () => true, 20000).catch(() => null);
    await wait(1500);
    result.malformed = await page.eval(`
      (() => ({
        stored: localStorage.getItem('fast_safe_projects'),
        mounted: !!(document.getElementById('root') && document.getElementById('root').childElementCount),
        hasDefaultHint: document.body.innerText.includes('Hoora') || document.body.innerText.includes('Featured Portfolio'),
        writes: (window.__fsmsStorageWrites || []).filter((item) => item.key === 'fast_safe_projects'),
      }))()
    `);

    await page.eval(`
      localStorage.removeItem('fast_safe_projects');
      localStorage.removeItem('fast_safe_expertise');
    `);
    return result;
  } finally {
    await killChrome(session);
  }
}

async function leakCheck() {
  const distHtml = fs.readFileSync(path.join(projectRoot, 'dist', 'index.html'), 'utf8');
  const jsMatch = distHtml.match(/src="(\/assets\/index-[^"]+\.js)"/);
  const jsPath = jsMatch ? path.join(projectRoot, 'dist', jsMatch[1].replace(/\//g, path.sep)) : null;
  const js = jsPath && fs.existsSync(jsPath) ? fs.readFileSync(jsPath, 'utf8') : '';
  return {
    clientJs: jsMatch && jsMatch[1],
    hasRenderToString: js.includes('renderToString'),
    hasRenderHomepage: js.includes('renderHomepage'),
    hasStubInstaller: js.includes('installSsrBrowserStubs') || js.includes('fsms-prerender'),
    rootFilled: !distHtml.includes('<div id="root"></div>'),
    gtag: distHtml.includes('G-SP37M5NYJ5'),
    verification: distHtml.includes('google-site-verification'),
  };
}

async function main() {
  const selected = new Set(process.argv.slice(2));
  const run = (name) => selected.size === 0 || selected.has(name);
  const previous = path.join(evidenceDir, 'phase-2d-remaining-verify.json');
  const report = fs.existsSync(previous)
    ? JSON.parse(fs.readFileSync(previous, 'utf8'))
    : {};
  report.generatedAt = new Date().toISOString();
  report.previewUrl = previewUrl;
  report.devUrl = devUrl;
  report.leakCheck = await leakCheck();
  report.visuals = report.visuals || {};

  if (run('hydration')) {
    try {
      report.hydration = await hydrateProof(previewUrl);
    } catch (error) {
      report.hydration = { error: error instanceof Error ? error.stack : String(error), passed: false };
    }
  }

  if (run('visuals')) {
    try {
      report.visuals.desktop = await visualSuite(previewUrl, { width: 1440, height: 900, mobile: false }, 'desktop');
    } catch (error) {
      report.visuals.desktop = { error: error instanceof Error ? error.stack : String(error) };
    }

    try {
      report.visuals.mobile = await visualSuite(previewUrl, { width: 390, height: 844, mobile: true }, 'mobile');
    } catch (error) {
      report.visuals.mobile = { error: error instanceof Error ? error.stack : String(error) };
    }
  }

  if (run('nojs')) {
    try {
      report.noJs = await noJsSuite(previewUrl);
    } catch (error) {
      report.noJs = { error: error instanceof Error ? error.stack : String(error) };
    }
  }

  if (run('storage')) {
    try {
      report.storagePreview = await storageSuite(previewUrl, 'preview');
    } catch (error) {
      report.storagePreview = { error: error instanceof Error ? error.stack : String(error) };
    }

    try {
      const devRes = await fetch(devUrl);
      if (devRes.ok) {
        report.storageDevStrict = await storageSuite(devUrl, 'dev');
      } else {
        report.storageDevStrict = { skipped: true, reason: `dev ${devRes.status}` };
      }
    } catch (error) {
      report.storageDevStrict = { skipped: true, reason: String(error.message || error) };
    }
  }

  const out = path.join(evidenceDir, 'phase-2d-remaining-verify.json');
  fs.writeFileSync(out, JSON.stringify(report, null, 2), 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
