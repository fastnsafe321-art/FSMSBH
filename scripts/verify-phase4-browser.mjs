/**
 * Phase 4 browser checks: JSON-LD after hydration, landmarks, names, screenshots.
 * Blocks analytics, Firestore, and EmailJS. Does not submit forms.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(projectRoot, 'seo-audit-evidence', 'phase-4');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const previewUrl = process.env.FSMS_PREVIEW_URL || 'http://127.0.0.1:4178/';
const debugPort = Number(process.env.FSMS_CDP_PORT || 9368);
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

async function screenshot(page, filename) {
  const result = await page.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(evidenceDir, filename), Buffer.from(result.data, 'base64'));
}

async function setViewport(page, width, height, mobile) {
  await page.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: mobile ? 2 : 1,
    mobile,
  });
}

async function main() {
  fs.mkdirSync(evidenceDir, { recursive: true });
  const userData = fs.mkdtempSync(path.join(os.tmpdir(), 'fsms-phase4-browser-'));
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
  const target = targets.find((item) => item.type === 'page' && item.webSocketDebuggerUrl);
  const page = new CdpSession(target.webSocketDebuggerUrl);
  await page.ready;
  await page.send('Network.enable');
  await page.send('Page.enable');
  await page.send('Runtime.enable');
  await page.send('Accessibility.enable');
  await page.send('Network.setCacheDisabled', { cacheDisabled: true });
  await page.send('Network.clearBrowserCache');
  await page.send('Network.setBlockedURLs', { urls: BLOCKED });
  await setViewport(page, 1440, 900, false);

  const blockedHits = [];
  page.on('Network.requestWillBeSent', (params) => {
    const url = params.request?.url || '';
    if (/googletagmanager|google-analytics|firestore|firebase|emailjs/i.test(url)) {
      blockedHits.push(url);
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
    await page.send('Page.navigate', { url: `${previewUrl}?v=phase4` });
    await page.once('Page.loadEventFired').catch(() => null);
    await wait(2800);

    const desktopState = await page.eval(`
      (() => {
        const scripts = [...document.querySelectorAll('script[type="application/ld+json"]')];
        let parsed = null;
        let parseError = null;
        try {
          parsed = scripts[0] ? JSON.parse(scripts[0].textContent || '') : null;
        } catch (error) {
          parseError = String(error);
        }
        const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((el) => ({
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
        }));
        return {
          title: document.title,
          canonical: document.querySelector('link[rel="canonical"]')?.href || null,
          jsonLdCount: scripts.length,
          jsonLdMarker: scripts[0]?.getAttribute('data-fsms-jsonld') || null,
          parsed,
          parseError,
          landmarks: {
            main: document.querySelectorAll('main').length,
            header: document.querySelectorAll('header').length,
            footer: document.querySelectorAll('footer').length,
            nav: document.querySelectorAll('nav').length,
            navLabels: [...document.querySelectorAll('nav')].map((el) => el.getAttribute('aria-label')),
          },
          openMenu: document.querySelector('button[aria-label="Open menu"]')?.getAttribute('aria-expanded') || null,
          headings,
          visibleEmail: [...document.querySelectorAll('a[href^="mailto:"]')].map((el) => el.textContent.trim()),
          visiblePhones: [...document.querySelectorAll('a[href^="tel:"]')].map((el) => ({
            href: el.getAttribute('href'),
            text: el.textContent.trim(),
          })),
          h1: document.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim() || '',
        };
      })()
    `);

    await page.eval(`document.getElementById('about')?.scrollIntoView({ block: 'start' })`);
    await wait(400);
    await screenshot(page, 'after-about-desktop.png');
    await page.eval(`document.getElementById('expertise')?.scrollIntoView({ block: 'start' })`);
    await wait(400);
    await screenshot(page, 'after-expertise-desktop.png');
    await page.eval(`document.getElementById('projects')?.scrollIntoView({ block: 'start' })`);
    await wait(400);
    await screenshot(page, 'after-projects-desktop.png');
    await page.eval(`document.getElementById('safety')?.scrollIntoView({ block: 'start' })`);
    await wait(400);
    await screenshot(page, 'after-safety-desktop.png');
    await page.eval(`document.getElementById('contact')?.scrollIntoView({ block: 'start' })`);
    await wait(400);
    await screenshot(page, 'after-footer-desktop.png');

    await page.eval(`document.getElementById('expertise')?.scrollIntoView({ block: 'center' })`);
    await wait(300);
    await page.eval(`document.querySelector('#expertise .cursor-pointer')?.click()`);
    await wait(1200);
    const expertiseModal = await page.eval(`
      (() => {
        const close = document.querySelector('button[aria-label="Close modal"]');
        const navs = [...document.querySelectorAll('nav')].map((el) => el.getAttribute('aria-label'));
        return {
          closeName: close?.getAttribute('aria-label') || null,
          navLabels: navs,
          visible: !!close,
        };
      })()
    `);
    await screenshot(page, 'after-expertise-modal-desktop.png');
    await page.eval(`document.querySelector('button[aria-label="Close modal"]')?.click()`);
    await wait(600);

    await page.eval(`document.getElementById('projects')?.scrollIntoView({ block: 'center' })`);
    await wait(300);
    await page.eval(`document.querySelector('#projects .cursor-pointer')?.click()`);
    await wait(1200);
    const projectModal = await page.eval(`
      (() => ({
        closeName: document.querySelector('button[aria-label="Close modal"]')?.getAttribute('aria-label') || null,
        visible: !!document.querySelector('button[aria-label="Close modal"]'),
      }))()
    `);
    await screenshot(page, 'after-project-modal-desktop.png');
    await page.eval(`document.querySelector('button[aria-label="Close modal"]')?.click()`);
    await wait(600);

    await page.eval(`window.scrollTo(0, 0)`);
    await wait(400);
    await screenshot(page, 'after-hero-desktop.png');

    await setViewport(page, 390, 844, true);
    await page.send('Page.reload', { ignoreCache: true });
    await page.once('Page.loadEventFired').catch(() => null);
    await wait(2800);

    const mobileMenuClosed = await page.eval(`
      (() => ({
        jsonLdCount: document.querySelectorAll('script[type="application/ld+json"]').length,
        openMenu: document.querySelector('button[aria-label="Open menu"]')?.getAttribute('aria-label') || null,
        navLabels: [...document.querySelectorAll('nav')].map((el) => el.getAttribute('aria-label')),
      }))()
    `);
    await screenshot(page, 'after-hero-mobile.png');
    await page.eval(`document.querySelector('button[aria-label="Open menu"]')?.click()`);
    await wait(800);
    const mobileMenuOpen = await page.eval(`
      (() => ({
        closeMenu: document.querySelector('button[aria-label="Close menu"]')?.getAttribute('aria-label') || null,
        expanded: document.querySelector('button[aria-label="Close menu"]')?.getAttribute('aria-expanded') || null,
        navLabels: [...document.querySelectorAll('nav')].map((el) => el.getAttribute('aria-label')),
        hasMobileNav: !!document.getElementById('mobile-navigation'),
      }))()
    `);
    await screenshot(page, 'after-mobile-menu.png');
    await page.eval(`document.querySelector('button[aria-label="Close menu"]')?.click()`);
    await wait(600);

    await page.eval(`document.getElementById('about')?.scrollIntoView({ block: 'start' })`);
    await wait(400);
    await screenshot(page, 'after-about-mobile.png');
    await page.eval(`document.getElementById('expertise')?.scrollIntoView({ block: 'start' })`);
    await wait(400);
    await screenshot(page, 'after-expertise-mobile.png');
    await page.eval(`document.getElementById('projects')?.scrollIntoView({ block: 'start' })`);
    await wait(400);
    await screenshot(page, 'after-projects-mobile.png');
    await page.eval(`document.getElementById('safety')?.scrollIntoView({ block: 'start' })`);
    await wait(400);
    await screenshot(page, 'after-safety-mobile.png');
    await page.eval(`document.getElementById('contact')?.scrollIntoView({ block: 'start' })`);
    await wait(400);
    await screenshot(page, 'after-footer-mobile.png');

    const hydrationErrors = consoleNotes.filter((item) => /hydration/i.test(item.text || ''));
    const consoleErrors = consoleNotes.filter((item) => item.type === 'error' || item.type === 'exception');
    const org = desktopState.parsed?.['@graph']?.find((node) => node['@type'] === 'Organization');
    const website = desktopState.parsed?.['@graph']?.find((node) => node['@type'] === 'WebSite');
    const webpage = desktopState.parsed?.['@graph']?.find((node) => node['@type'] === 'WebPage');

    const report = {
      previewUrl,
      jsonLdCountDesktop: desktopState.jsonLdCount,
      jsonLdCountMobile: mobileMenuClosed.jsonLdCount,
      jsonLdMarker: desktopState.jsonLdMarker,
      parseError: desktopState.parseError,
      title: desktopState.title,
      canonical: desktopState.canonical,
      landmarks: desktopState.landmarks,
      h1: desktopState.h1,
      visibleEmail: desktopState.visibleEmail,
      visiblePhones: desktopState.visiblePhones,
      organizationMatchesVisible:
        org?.email === 'info@fsmsbh.com' &&
        desktopState.visibleEmail.includes('info@fsmsbh.com') &&
        Array.isArray(org?.telephone),
      graphRefsResolve:
        website?.publisher?.['@id'] === org?.['@id'] &&
        webpage?.isPartOf?.['@id'] === website?.['@id'] &&
        webpage?.about?.['@id'] === org?.['@id'],
      expertiseModal,
      projectModal,
      mobileMenuClosed,
      mobileMenuOpen,
      blockedHits,
      hydrationErrors,
      consoleErrors,
    };
    report.passed =
      report.jsonLdCountDesktop === 1 &&
      report.jsonLdCountMobile === 1 &&
      report.jsonLdMarker === 'homepage' &&
      !report.parseError &&
      report.landmarks.main === 1 &&
      report.landmarks.header === 1 &&
      report.landmarks.footer === 1 &&
      report.organizationMatchesVisible &&
      report.graphRefsResolve &&
      report.expertiseModal.visible &&
      report.expertiseModal.closeName === 'Close modal' &&
      report.projectModal.visible &&
      report.mobileMenuOpen.navLabels.includes('Primary') &&
      report.mobileMenuOpen.navLabels.includes('Mobile') &&
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
