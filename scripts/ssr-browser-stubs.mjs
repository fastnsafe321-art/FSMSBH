/**
 * Build-time stub hook.
 *
 * Review (14 Sep 2026, scripts/review-ssr-stubs.mjs):
 * `renderHomepage()` produced identical markup with full stubs, without
 * window/document, and with no stubs at all (sha256 match, 163207 chars).
 * The only traced access under full stubs was `navigator.userAgent`.
 *
 * Defining `window` made Motion's `isBrowser` true
 * (`typeof window !== "undefined"` at module evaluate) and would create
 * visual elements during Node `renderToString`. That is unnecessary: the
 * same HTML is produced when `window` stays undefined.
 *
 * This installer is therefore a no-op. Do not add fake browser APIs to
 * conceal prerender errors. If a future import truly needs a host object,
 * add only that object and record why.
 */
export function installSsrBrowserStubs() {
  if (globalThis.__FSMS_SSR_STUBS__) {
    return globalThis.__FSMS_SSR_STUBS__;
  }
  const installed = { mode: 'noop', store: new Map() };
  globalThis.__FSMS_SSR_STUBS__ = installed;
  return installed;
}
