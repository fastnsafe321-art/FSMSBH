/**
 * Isolated one-shot homepage render. Used to compare two fresh Node processes.
 */
import { pathToFileURL } from 'node:url';
import { installSsrBrowserStubs } from './ssr-browser-stubs.mjs';

installSsrBrowserStubs();

const entry = process.env.FSMS_SSR_ENTRY;
if (!entry) {
  console.error('FSMS_SSR_ENTRY is required');
  process.exit(1);
}

const loaded = await import(pathToFileURL(entry).href);
if (typeof loaded.renderHomepage !== 'function') {
  console.error('SSR entry did not export renderHomepage()');
  process.exit(1);
}

const html = loaded.renderHomepage();
if (typeof html !== 'string' || html.trim() === '') {
  console.error('renderHomepage() returned empty markup');
  process.exit(1);
}

process.stdout.write(html);
