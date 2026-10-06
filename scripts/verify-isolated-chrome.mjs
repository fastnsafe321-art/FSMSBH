/**
 * Isolated Chrome profile checks. Never uses the developer's default profile.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'seo-audit-evidence', 'phase-2d');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const previewUrl = process.env.FSMS_PREVIEW_URL || 'http://127.0.0.1:4174/';
const debugPort = 9334;

const BLOCKED_URLS = [
  '*googletagmanager.com*',
  '*google-analytics.com*',
  '*doubleclick.net*',
  '*firestore.googleapis.com*',
  '*firebaseio.com*',
  '*firebaselogging.googleapis.com*',
  '*api.emailjs.com*',
];

fs.mkdirSync(evidenceDir, { recursive: true });

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForJson(url, attempts = 40) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res.json();
    } catch {
      // retry
    }
    await wait(250);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

class CdpSession {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
    this.events = [];
    this.ready = new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve);
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
      if (message.method) this.events.push(message);
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
      throw new Error(result.exceptionDetails.text || 'Runtime.evaluate failed');
    }
    return result.result?.value;
  }

  close() {
    this.ws.close();
  }
}

async function launchChrome(userDataDir, extraArgs = []) {
  const chrome = spawn(
    chromePath,
    [
      `--remote-debugging-port=${debugPort}`,
      `--user-data-dir=${userDataDir}`,
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-popup-blocking',
      '--window-size=1440,900',
      ...extraArgs,
      'about:blank',
    ],
    { windowsHide: true, stdio: 'ignore' },
  );
  const version = await waitForJson(`http://127.0.0.1:${debugPort}/json/version`);
  return { chrome, wsUrl: version.webSocketDebuggerUrl };
}

async function attachPage(browserWs) {
  const browser = new CdpSession(browserWs);
  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await browser.send('Target.attachToTarget', { targetId, flatten: true });
  const page = {
    send: (method, params = {}) =>
      browser.send('Target.sendMessageToTarget', {
        sessionId,
        message: JSON.stringify({ id: Date.now(), method, params }),
      }),
  };
  // Flattened sessions speak as if we were the page when using the sessionId-aware client.
  const flat = new CdpSession(browserWs);
  // Use the simpler page websocket from /json/list instead.
  flat.close();
  browser.close();

  const pages = await waitForJson(`http://127.0.0.1:${debugPort}/json/list`);
  const target = pages.find((item) => item.id === targetId) || pages.find((item) => item.type === 'page');
  if (!target?.webSocketDebuggerUrl) {
    throw new Error('No page websocket');
  }
  return new CdpSession(target.webSocketDebuggerUrl);
}

async function preparePage(page, { javascript = true } = {}) {
  await page.send('Network.enable');
  await page.send('Network.setBlockedURLs', { urls: BLOCKED_URLS });
  await page.send('Runtime.enable');
  await page.send('Page.enable');
  await page.send('Console.enable');
  await page.send('Log.enable');
  await page.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      window.__fsmsVerify = {
        mutations: [],
        console: [],
        firstChild: null,
        firstLen: 0
      };
      const origError = console.error.bind(console);
      const origWarn = console.warn.bind(console);
      console.error = (...args) => {
        window.__fsmsVerify.console.push({ level: 'error', text: args.map(String).join(' ') });
        origError(...args);
      };
      console.warn = (...args) => {
        window.__fsmsVerify.console.push({ level: 'warn', text: args.map(String).join(' ') });
        origWarn(...args);
      };
      document.addEventListener('DOMContentLoaded', () => {
        const root = document.getElementById('root');
        if (!root) return;
        window.__fsmsVerify.firstChild = root.firstElementChild && root.firstElementChild.tagName;
        window.__fsmsVerify.firstLen = root.innerHTML.length;
        new MutationObserver((records) => {
          for (const record of records) {
            window.__fsmsVerify.mutations.push({
              type: record.type,
              added: record.addedNodes.length,
              removed: record.removedNodes.length
            });
          }
        }).observe(root, { childList: true });
      });
    `,
  });
  if (!javascript) {
    await page.send('Emulation.setScriptExecutionDisabled', { value: true });
  }
}

async function navigate(page, url) {
  const loaded = new Promise((resolve) => {
    const check = () => {
      const event = page.events.find((item) => item.method === 'Page.loadEventFired');
      if (event) resolve(event);
      else setTimeout(check, 50);
    };
    check();
  });
  await page.send('Page.navigate', { url });
  await Promise.race([loaded, wait(15000)]);
  await wait(1500);
}

async function screenshot(page, filename) {
  const result = await page.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(evidenceDir, filename), Buffer.from(result.data, 'base64'));
}

async function main() {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fsms-phase2d-'));
  const report = {
    previewUrl,
    userDataDir,
    blockedUrls: BLOCKED_URLS,
    fresh: null,
    synthetic: null,
    noJs: null,
  };

  let chrome;
  try {
    const launched = await launchChrome(userDataDir);
    chrome = launched.chrome;
    const page = await attachPage(launched.wsUrl);
    await preparePage(page);

    // Confirm interception before first app navigation: request a blocked URL.
    await page.send('Network.clearBrowserCache');
    const probe = await page.eval(`
      fetch('https://www.googletagmanager.com/gtag/js?id=G-SP37M5NYJ5', { mode: 'no-cors' })
        .then(() => 'fetched')
        .catch((err) => String(err && err.message || err));
    `);
    const blockedHits = page.events.filter((item) =>
      item.method === 'Network.loadingFailed' || item.method === 'Network.requestWillBeSent',
    );
    report.interceptionProbe = {
      fetchResult: probe,
      requestEvents: page.events
        .filter((item) => item.method && item.method.startsWith('Network.'))
        .map((item) => ({ method: item.method, url: item.params?.request?.url || item.params?.errorText })),
    };

    await navigate(page, previewUrl);
    const fresh = await page.eval(`
      (() => {
        const root = document.getElementById('root');
        const h1 = document.querySelector('h1');
        const h1Style = h1 ? getComputedStyle(h1.parentElement || h1) : null;
        return {
          title: document.title,
          h1: h1 && h1.textContent.replace(/\\s+/g, ' ').trim(),
          h1Opacity: h1Style && h1Style.opacity,
          rootLen: root && root.innerHTML.length,
          firstChild: window.__fsmsVerify.firstChild,
          firstLen: window.__fsmsVerify.firstLen,
          mutations: window.__fsmsVerify.mutations,
          console: window.__fsmsVerify.console,
          projects: localStorage.getItem('fast_safe_projects'),
          expertise: localStorage.getItem('fast_safe_expertise'),
          projectCards: document.querySelectorAll('#projects h3, #projects h4, [id="projects"] h3').length,
          htmlHasNoJs: document.documentElement.classList.contains('no-js'),
        };
      })()
    `);
    await screenshot(page, 'fresh-desktop-hero.png');
    await page.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await screenshot(page, 'fresh-mobile-hero.png');
    await page.send('Emulation.clearDeviceMetricsOverride');
    report.fresh = fresh;

    const syntheticProjects = [
      {
        id: 9001,
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
    await page.eval(`
      localStorage.setItem('fast_safe_projects', ${JSON.stringify(JSON.stringify(syntheticProjects))});
      localStorage.setItem('fast_safe_expertise', ${JSON.stringify(JSON.stringify([{
        name: 'PHASE2D SYNTHETIC EXPERTISE',
        blurb: 'Isolated verification only',
        gallery: [],
      }]))});
      'ok'
    `);
    await navigate(page, previewUrl);
    await wait(800);
    const afterHydrate = await page.eval(`
      (() => {
        const text = document.body.innerText;
        return {
          hasSyntheticImmediately: text.includes('PHASE2D SYNTHETIC PROJECT'),
          storedProjects: localStorage.getItem('fast_safe_projects'),
          storedExpertise: localStorage.getItem('fast_safe_expertise'),
          console: window.__fsmsVerify.console,
          mutations: window.__fsmsVerify.mutations,
        };
      })()
    `);
    await wait(500);
    const afterRestore = await page.eval(`
      (() => {
        const text = document.body.innerText;
        return {
          hasSyntheticAfterWait: text.includes('PHASE2D SYNTHETIC PROJECT'),
          storedProjects: localStorage.getItem('fast_safe_projects'),
          storedExpertise: localStorage.getItem('fast_safe_expertise'),
        };
      })()
    `);

    // Update synthetic data through the same storage key, then reload.
    await page.eval(`
      const current = JSON.parse(localStorage.getItem('fast_safe_projects') || '[]');
      current.push({
        id: 9002,
        title: 'PHASE2D SYNTHETIC PROJECT TWO',
        category: 'Professional Sports',
        desc: 'Second isolated item',
        image: '/assets/images/pristine_pitch_night_1781166845895.png',
        client: 'Verify Client',
        year: '2026',
        details: 'Second fixture',
        gallery: ['/assets/images/pristine_pitch_night_1781166845895.png']
      });
      localStorage.setItem('fast_safe_projects', JSON.stringify(current));
      'updated'
    `);
    await navigate(page, previewUrl);
    await wait(1200);
    const afterUpdate = await page.eval(`
      (() => {
        const text = document.body.innerText;
        const stored = JSON.parse(localStorage.getItem('fast_safe_projects') || '[]');
        return {
          hasFirst: text.includes('PHASE2D SYNTHETIC PROJECT'),
          hasSecond: text.includes('PHASE2D SYNTHETIC PROJECT TWO'),
          storedCount: stored.length,
          titles: stored.map((item) => item.title),
        };
      })()
    `);

    report.synthetic = { afterHydrate, afterRestore, afterUpdate };

    page.close();
    chrome.kill();
    await wait(500);

    const noJsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fsms-phase2d-nojs-'));
    const noJsLaunch = await launchChrome(noJsDir, ['--blink-settings=scriptEnabled=false']);
    chrome = noJsLaunch.chrome;
    const noJsPage = await attachPage(noJsLaunch.wsUrl);
    await preparePage(noJsPage, { javascript: false });
    await navigate(noJsPage, previewUrl);
    const noJs = await noJsPage.eval(`
      (() => {
        const h1 = document.querySelector('h1');
        const heroCopy = document.querySelector('#home-hero [data-hero-copy]');
        const bullet = document.querySelector('#hybridgrass [data-hybrid-spec] > li');
        const h1Cs = h1 ? getComputedStyle(h1) : null;
        const wrapCs = heroCopy ? getComputedStyle(heroCopy) : null;
        const bulletCs = bullet ? getComputedStyle(bullet) : null;
        return {
          title: document.title,
          htmlHasNoJs: document.documentElement.classList.contains('no-js'),
          h1: h1 && h1.textContent.replace(/\\s+/g, ' ').trim(),
          h1Opacity: h1Cs && h1Cs.opacity,
          heroCopyOpacity: wrapCs && wrapCs.opacity,
          heroCopyTransform: wrapCs && wrapCs.transform,
          bulletText: bullet && bullet.textContent.replace(/\\s+/g, ' ').trim(),
          bulletOpacity: bulletCs && bulletCs.opacity,
          rootLen: document.getElementById('root') && document.getElementById('root').innerHTML.length,
        };
      })()
    `);
    await screenshot(noJsPage, 'nojs-desktop-hero.png');
    report.noJs = noJs;
    noJsPage.close();
    chrome.kill();
    chrome = null;

    fs.rmSync(userDataDir, { recursive: true, force: true });
    fs.rmSync(noJsDir, { recursive: true, force: true });
  } catch (error) {
    report.error = error instanceof Error ? error.stack : String(error);
    if (chrome) chrome.kill();
  }

  fs.writeFileSync(path.join(evidenceDir, 'isolated-chrome-verify.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (report.error) process.exit(1);
}

main();
