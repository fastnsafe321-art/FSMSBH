# Fast & Safe Maintenance Services — Phase 2D Implementation

**Date:** 14 September 2026  
**Scope:** Local build-time homepage prerender into `#root`, plus client hydration.  
**Live website:** Unchanged. No commit, push, or deploy was performed.

The public name **Fast & Safe Maintenance Services** and the selected service wording come from existing public content. This phase does **not** independently verify legal identity, certifications, or manufacturer relationships.

**Phase status:** Verified locally (14 September 2026 remaining-verification pass). Successful HTML generation alone was not treated as completion.

---

## 1. Exact files changed

### Intentional application source

| File | Why |
| ---- | --- |
| `src/entry-server.tsx` | Build-only `renderHomepage()` using `renderToString` of the existing `App` inside `StrictMode`. Not imported by the client. |
| `src/main.tsx` | `hydrateRoot` when `#root` already has children; `createRoot` for the empty development root. Same `App` + `StrictMode`. Recoverable hydration errors are logged, not swallowed. |
| `src/hooks/index.ts` | `useLocalStorage` first render always uses source defaults. Restore after mount. Empty `[]` is a valid saved value. Malformed JSON is not overwritten. Persist runs outside the React state updater (pure updater). |
| `src/firebase.ts` | No import-time `initializeApp` / `getFirestore` / `testConnection`. Lazy `getFirebaseApp()` / `getDb()`. Shared `writeConsultation()` with optional mock transport. |
| `src/components/modals/ConsultationModal.tsx` | Removed module-level Firebase and `testConnection`. Submits through `writeConsultation`. Validation, collection name, payload, EmailJS, and errors unchanged. |
| `src/App.tsx` | Uses `writeConsultation` on the existing unused submit path. Merges stored expertise onto source `EXPERTISE` by name so Lucide icons survive JSON restore. Delete uses a functional updater (`prev => prev.filter(...)`). |
| `src/components/sections/ExpertiseSection.tsx` | Guard missing `icon` / `gallery` so incomplete stored items cannot unmount the app. |
| `src/components/SubAirVentShowcase.tsx` | Render-time particle values use `particleUnit(bucket, index)` instead of `Math.random`. Motion parameters and particle counts preserved. Audio-effect `Math.random` calls were left in event handlers. |
| `src/components/HeroCarousel.tsx` | `id="home-hero"` and `data-hero-copy` on the existing tag / H1 / description wrappers. Entrance animation props unchanged. |
| `src/components/HybridGrassShowcase.tsx` | `data-hybrid-spec` on the two existing spec lists. |
| `index.html` | `html.no-js` plus an immediate class-removal script; scoped CSS reveals Motion-hidden hero/hybrid copy when JavaScript is off. Phase 2A title, description, canonical, Google tag `G-SP37M5NYJ5`, and the existing `google-site-verification` meta are unchanged. |
| `vite.config.ts` | Registers the build-only prerender plugin. Dev file-watch ignores `seo-audit-evidence/` and `.prerender/` so local Chrome evidence profiles cannot crash Vite. |
| `tsconfig.json` | Excludes `dist/`, `.prerender/`, and `seo-audit-evidence/` so `tsc --noEmit` does not typecheck Chrome profile junk. |
| `.gitignore` | Ignores `.prerender/`. |

### Build-only scripts (not public site files)

| File | Why |
| ---- | --- |
| `scripts/homepage-prerender.mjs` | Vite plugin: isolated SSR build, two renderer processes, inject once into `#root`, hoist preload links into `<head>`, fail on empty or non-deterministic markup. |
| `scripts/homepage-prerender.d.ts` | Type shim for the plugin import. |
| `scripts/ssr-browser-stubs.mjs` | No-op after review. Full fake `window`/`document` stubs were removed because they made Motion set `isBrowser` true and were not required for identical markup. |
| `scripts/render-homepage-once.mjs` | One-shot isolated renderer process. |
| `scripts/verify-consultation-plumbing.mts` | Mocked `writeConsultation` check. Does not write Firestore or send email. |
| `scripts/inspect-dist-html.mjs` | Local HTML coverage inspection. |
| `scripts/verify-isolated-chrome.mjs` | Unused leftover from an earlier WebSocket attempt; not part of the production pipeline. |
| `scripts/review-ssr-stubs.mjs` | Isolated stub-profile review (full / no-window / none). |
| `scripts/verify-phase-2d-remaining.mjs` | Isolated-Chrome hydration identity, screenshots, no-JS, and storage checks. |

### Preserved, not rewritten as part of this phase

- Approved Phase 2A title, description, and canonical.
- `public/robots.txt` and `public/sitemap.xml`.
- Google tag `G-SP37M5NYJ5` (same script tags and ID).
- Visible wording, images, responsive layouts, navigation, modals, forms, and existing image-copy / asset-path behavior.

### Generated locally (not treated as source)

- `dist/index.html` with prerendered `#root`.
- `dist/assets/index-D54k22b6.js`, `dist/assets/index-DysDIiI-.css`.
- Image copies under `dist/assets/images/`.
- Evidence under `seo-audit-evidence/phase-2d/` (backups, `verify-shots/`, `phase-2d-remaining-verify.json`, `ssr-stub-review.json`). Temporary `.prerender/` is deleted after each successful build.

No new npm dependency. No framework, router, backend, or hosting change.

---

## 2. Build pipeline and commands

Normal production build is still:

```
node .\node_modules\vite\bin\vite.js build
```

(`npm run build` remains `vite build`.) Scripts use `node .\node_modules\...` so the `F&S` directory name is not passed through fragile `npx` / `&&` chaining.

Pipeline:

1. Client Vite build writes `dist/` (including `syncAssets()` image copy).
2. Plugin `closeBundle` runs only when `FSMS_SSR_BUILD` is unset.
3. Isolated Vite SSR build writes `.prerender/` (`copyPublicDir: false`).
4. Two fresh Node processes each import the SSR bundle and print `renderHomepage()`.
5. Markup must be identical or the build fails.
6. React 19 `renderToString` preload `<link>` tags are hoisted into `<head>`. Only the App tree is injected into the single `<div id="root"></div>`.
7. Build fails on empty root, missing H1 / required copy, duplicate `#root`, lost Phase 2A metadata, or lost Google tag.
8. `.prerender/` is deleted in `finally`.

Development: `node .\node_modules\vite\bin\vite.js --port=3002 --host=127.0.0.1` (or `npm run dev`). Source `index.html` keeps an empty `#root`, so the client uses `createRoot`.

Local preview used for the remaining-verification pass: `http://127.0.0.1:4175/` (`vite preview`). StrictMode storage used `http://127.0.0.1:3003/`.

---

## 3. Generated HTML coverage

Latest successful build injected **160,949** characters into `#root`. Two isolated renderer runs were **identical**.

`seo-audit-evidence/phase-2d/dist-html-inspection.json`:

| Check | Result |
| ----- | ------ |
| `<title>` / description / canonical | 1 each |
| Google tag `G-SP37M5NYJ5` | Present (2 mentions: script URL + `gtag('config')`) |
| `#root` | 1, not empty |
| `<h1>` | 1 — `WE BUILD THE GROUND` / `NATURAL GRASS PLAYS THE GAME` |
| `<h2>` | 8 |
| `<img>` | 28 |
| Hybrid / artificial / natural / Hoora / Sitra copy | Present |
| `class="no-js"` + no-JS CSS | Present |
| Client script / CSS | Current rebuild: `index-D54k22b6.js`, `index-DysDIiI-.css` |
| `renderHomepage` / `entry-server` in HTML | Absent |

Client bundle `dist/assets/index-D54k22b6.js` does not contain `renderToString`, `renderHomepage`, `installSsrBrowserStubs`, or `testConnection`.

Local preview HTTP 200 on `http://127.0.0.1:4175/` after the remaining-verification rebuild.

`.prerender/` is gone after the build. Build exited cleanly; no hanging Firestore handles.

Required snippets enforced by the plugin: `WE BUILD THE GROUND`, `NATURAL GRASS PLAYS THE GAME`, `What is HYBRIDGRASS System`, `ARTIFICIAL GRASS INSTALLATION`, `NATURAL GRASS INSTALLATION`, `Sitra`, `Fast &amp; Safe`.

One homepage URL. No second HTML document, no bot-specific markup, no duplicate SEO-only copy.

---

## 4. Hydration evidence

**Original-node retention (required proof).** Isolated Chrome profile, production preview `http://127.0.0.1:4175/`. CDP `Fetch` paused `*/assets/index-*.js*` after the document parsed and **before** the application module ran. Live element references were stored on `window.__fsmsPreNodes`. The module was then released.

| Node captured before the module | Same object after hydration | Still `isConnected` |
| --- | --- | --- |
| `#root > div.min-h-screen` (App wrapper) | Yes | Yes |
| `#root nav` (Navbar) | Yes | Yes |
| `#hybridgrass h2` (`What is HYBRIDGRASS System`) | Yes | Yes |

Before the module: `reactKeys` was `[]`, `moduleExecuted` was `false`, heading text was already `What is HYBRIDGRASS System`. After release: a React container key appeared (used only as a *hydration-finished* signal, not as node-identity proof). The three stored objects still `===` the current query results.

`onRecoverableError` in `src/main.tsx` still logs `[hydration]`. Isolated-profile console from document start through hydration: **no warnings and no `[hydration]` recoverable errors**.

Matching text or a populated `#root` was not treated as sufficient. Evidence: `seo-audit-evidence/phase-2d/phase-2d-remaining-verify.json` → `hydration.passed: true`.

Production startup code was not changed to make this test pass. The delay was Fetch interception only.

---

## 5. localStorage restoration and persistence

Public API and keys unchanged: `fast_safe_projects`, `fast_safe_expertise`.

Rules implemented:

- Build / first hydrate never read `localStorage` in the state initializer.
- Restore runs in `useEffect` only when `getItem` returns a string (`null` leaves defaults; `"[]"` restores empty).
- `setValue` computes the next value, then calls `setStoredValue` with that concrete value (no `localStorage` side effect inside the React updater), then persists. Functional updaters read `valueRef`.
- Parse failures warn and do not write.
- Unavailable storage still updates React state.

**All storage tests used the isolated Cursor preview profile on 127.0.0.1:4174. The user’s real Chrome profile was not opened or modified.**

| Scenario | Preview 4175 | Dev 3003 (StrictMode) |
| -------- | ------------ | --------------------- |
| Fresh profile (no keys) | Source defaults. No `fast_safe_projects` writes on startup. | Same. |
| Synthetic project restore | Only `PHASE2D SYNTHETIC PROJECT` visible. Key unchanged. Startup writes: none. | Same. |
| Functional updater + Delete | First click armed **Confirm Deletion**. Second click wrote `[]` once via `setProjectsList(prev => prev.filter(...))`. | Same single write of `[]`. |
| Delete after reload | Synthetic title gone. Key still `[]`. | Same. |
| Empty `"[]"` | No project cards, no Hoora. Key remained `[]`. Startup writes: none. | Same. StrictMode did not write defaults. |
| Malformed `{not-valid-json` | App stayed mounted. Defaults visible. **Raw key not overwritten.** Writes: none. | Same. |
| Cleanup | Isolated-profile keys removed at the end of the script. User Chrome profile was not opened. | Same. |

### Brief default-content display

The first React render (and the prerendered HTML) always uses source `PROJECTS` / `EXPERTISE`. Saved data is applied in `useEffect` after hydration.

Therefore a visitor with saved projects—or an intentional empty array—can briefly see the source portfolio (Hoora, Sitra Club, and the other default teasers) before the restored list appears. That flash is required so the first hydrated tree matches the build HTML. It was not frame-captured (`Page.addScriptToEvaluateOnNewDocument` did not attach on that navigation); it follows directly from the hook and from seeing Hoora in static `dist/index.html` while a later restore showed only the synthetic project or an empty grid.

---

## 6. Firebase initialization and mocked submission

- Importing `App` / `firebase.ts` does not call `initializeApp` or `testConnection`.
- Homepage load does not perform diagnostic Firestore reads.
- `writeConsultation(payload, transport?)` initializes Firebase only when called without a transport.
- Consultation validation, `consultations` collection, payload fields, EmailJS REST helper, and error handling are unchanged. The real write was not replaced with a stub.

Mock verification (`node .\node_modules\tsx\dist\cli.mjs .\scripts\verify-consultation-plumbing.mts`):

```json
{
  "ok": true,
  "firebaseAppsAfterImportAndMockWrite": 0,
  "collection": "consultations",
  "payloadKeys": ["name","phone","location","timeline","contactMethod","service","status","ticket"]
}
```

No real enquiry, email, or Firestore write was sent. Firebase config, credentials, rules, and environment variables were not changed.

Opening and closing the consultation modal was verified in the preview. The submit button was not used.

---

## 7. Deterministic SubAir particles

`particleUnit(bucket, index)` is a fixed 0..1 hash from integer bucket and index. Every render-time particle left / delay / duration / height / position that previously called `Math.random()` now uses a distinct bucket.

`Math.random` is **not** globally overridden. Audio drip / click handlers still use `Math.random` after user interaction; those values are not in the prerendered HTML.

A former discharge `Math.random() ? 1 : 0` (almost always `1`) is now the constant `1`, matching the previous typical visual.

Two isolated renderer runs produced identical HTML, so build output and the first browser paint use the same particle style attributes.

---

## 8. Animation / no-JS text fallback

Phase 2C found hero copy and hybrid bullets initially hidden by Motion `opacity` / `transform`.

**Change (narrow):**

1. `index.html` starts as `<html lang="en" class="no-js">`.
2. The first script removes `no-js` when JavaScript runs.
3. Scoped CSS:

```css
html.no-js #home-hero [data-hero-copy],
html.no-js #hybridgrass [data-hybrid-spec] > li {
  opacity: 1 !important;
  transform: none !important;
}
```

4. Existing Motion wrappers received `data-hero-copy` / `data-hybrid-spec` only. Wording, size, spacing, color, and layout were not changed. Entrance `initial` / `animate` props were not removed for JS users.

Motion was not disabled globally. No second copy of the text. Inactive tabs and closed modals stay closed in the generated HTML. Default carousel slide and default Natural tab are unchanged.

Isolated Chrome with script execution disabled:

- `verify-shots/nojs-desktop-hero.png`: H1 **WE BUILD THE GROUND / NATURAL GRASS PLAYS THE GAME** is readable. Computed `opacity` of `[data-hero-copy]` is `1`, transform `none`.
- `verify-shots/nojs-desktop-hybrid-bullets.png`: both spec lists are visible (optimum reinforcement… / Optimum surface coverage…). Every `[data-hybrid-spec] > li` has computed `opacity: 1` and `transform: none`.
- Intentional no-JS difference: the hero **photograph** stays at Motion `initial` opacity 0 (that wrapper is not in the no-JS CSS). Copy sits on the section’s black background. That is not a Phase 2D regression of the text fallback.

---

## 9. Desktop / mobile and JavaScript-disabled checks

Isolated Chrome user-data directories (temp profiles killed after each suite) — not the user’s Chrome profile. Device metrics were set **before** navigation. Sections were scrolled with `scrollIntoView`, not hash URLs. Blank compositor frames from the earlier hash-capture attempt were not reused.

Pre-2D baseline PNG files were **not on disk**. Visual comparison is current desktop vs mobile of the same local preview, plus no-JS vs JS. That baseline gap is recorded; it is not treated as pixel-perfect proof against a saved pre-2D build.

| Capture | File | Result |
| ------- | ---- | ------ |
| Desktop JS hero, slide 1 | `verify-shots/desktop-hero-slide1.png` | Stadium, H1 slide 1, CTAs, 01/03. 1.59 MB. |
| Mobile JS hero, same slide | `verify-shots/mobile-hero-slide1.png` | Same slide 1 copy, stacked CTAs, hamburger. 1.33 MB. |
| Desktop hybrid | `verify-shots/desktop-hybrid.png` | Hybrid header + technology card. |
| Mobile hybrid | `verify-shots/mobile-hybrid.png` | Same section, stacked layout. |
| Desktop expertise | `verify-shots/desktop-expertise.png` | What We Deliver grid. |
| Mobile expertise | `verify-shots/mobile-expertise.png` | Same cards, single column. |
| Desktop projects | `verify-shots/desktop-projects.png` | Featured Portfolio + Hoora / default cards. |
| Mobile projects | `verify-shots/mobile-projects.png` | Same section, stacked. |
| Desktop contact/footer | `verify-shots/desktop-contact.png` | Sitra, phones, activities. |
| Mobile contact/footer | `verify-shots/mobile-contact.png` | Same footer content. |
| Desktop modal | `verify-shots/desktop-modal.png` | Request Technical Consultation form. |
| Mobile modal | `verify-shots/mobile-modal.png` | Same form, stacked fields. |
| Desktop no-JS hero | `verify-shots/nojs-desktop-hero.png` | Hero **copy** readable; photo hidden (see §8). |
| Desktop no-JS hybrid + bullets | `verify-shots/nojs-desktop-hybrid.png`, `nojs-desktop-hybrid-bullets.png` | Spec bullets readable without JS. |

All listed files are usable photographs of the page (not empty magenta/white frames). No Phase 2D visual regression was found in these shots. The Add Portfolio control remains the pre-existing unused modal gap.

---

## 10. TypeScript: existing versus new

**Baseline (do not fix in this phase):**

```
src/App.tsx(517,9): error TS2322: FormData.contactMethod is string,
not "WhatsApp" | "Phone Call" | "Email Channel"
```

The same error was `App.tsx(505,9)` before this phase and `App.tsx(517,9)` after the first 2D pass. It is now `App.tsx(516,9)` after the delete updater change. The error is unchanged.

**New tooling, not new App errors:**

- First `tsc --noEmit` after Chrome evidence profiles were written hit a heap OOM because `allowJs` had no exclude list.
- `tsconfig.json` now excludes `node_modules`, `dist`, `.prerender`, and `seo-audit-evidence`.
- After that exclude, `tsc --noEmit` returns only the baseline `App.tsx` error.

No new TypeScript errors were introduced in the Phase 2D files.

---

## 11. Interactions verified (preview 4175)

| Control | Result |
| ------- | ------ |
| Hash `#projects` | URL updated; `projects` top ≈ 0. |
| Hero carousel | Slide 2 CTAs `GET ESTIMATE` / `VIEW SERVICES`; H1 `HIGH-PERFORMANCE ARTIFICIAL TURF SYSTEMS`. Slide 3 CTAs also appeared via next/autoplay. |
| Natural / Artificial tabs | Artificial shows Resilience Pro, Performance Shockpad, Organic Infill, Elastic Sub-Base. |
| SubAir | Pressure control clicked (`PRESSURE MODEACTIVE`). Vacuum / standby / 3D–2D still present. |
| Consultation | Opened (`Request Technical Consultation`, activity/location/timeline fields). Closed. **Not submitted.** |
| Expertise modal | Artificial Grass Installation: Overview, Tech Specs, Installation Flow, Gallery, excavation → infill steps. |
| Project modal | Synthetic project: overview, Verify Client, 2026, gallery. |
| Add Portfolio Project | Button still calls `setIsAddProjectOpen(true)`. **No add modal is mounted in existing `App.tsx`** (`isAddProjectOpen` has no consumer). That is a pre-existing gap, not introduced here. |
| Delete | Isolated synthetic card: hover/force-visible → Confirm Deletion → persist `[]` → still empty after reload. |

Development server on **3002** rendered the full homepage with source defaults (Hoora and the rest).

---

## 12. External requests during tests

Google tag markup is unchanged (`G-SP37M5NYJ5`).

Before preview interaction, `Network.setBlockedURLs` blocked gtag, Google Analytics, DoubleClick, Firestore, and EmailJS hosts.

Explicit `fetch` after that:

- `https://www.googletagmanager.com/gtag/js?id=G-SP37M5NYJ5` → **Failed to fetch**
- `https://firestore.googleapis.com/v1/projects/x` → **Failed to fetch**
- `https://api.emailjs.com/api/v1.0/email/send` → **Failed to fetch**

Resource timing can still *list* the gtag URL (blocked, status 0). No Firestore diagnostic read ran on homepage load. Vite dev listed the local `firebase_firestore.js` module file; that is the SDK module, not a database write.

---

## 13. Remaining limitations

- Production was not checked (out of scope for this pass).
- First hydrate matches source defaults, so saved or empty project lists can flash default teasers for one paint.
- `isAddProjectOpen` is still unused (baseline). The Add control was not wired.
- No pre-2D screenshot folder existed, so visual parity is not a pixel diff against a saved CSR baseline.
- No-JS hero photograph remains Motion-hidden; copy and hybrid bullets are readable.
- Audio-path `Math.random` remains for click/drip sound only.
- Lighthouse was not re-run.
- `scripts/verify-isolated-chrome.mjs` is unused.

## 13b. Browser-stub review

`scripts/review-ssr-stubs.mjs` built an isolated SSR bundle and rendered with three profiles.

| Profile | Exit | HTML length | sha256 | Notes |
| ------- | ---- | ----------: | ------ | ----- |
| Full historical stubs | 0 | 163207 | `3aaaa523…` | Traced access: `navigator.userAgent` only |
| No `window` (`document` still defined) | 0 | 163207 | identical | Motion `isBrowser` **false** |
| No stubs | 0 | 163207 | identical | Renderer succeeded |

Motion `isBrowser` is `typeof window !== "undefined"` at module evaluate. Installing `window` before the SSR import made `isBrowser` **true** and would construct visual elements during `renderToString`. Markup did not change, but that is the browser path.

Because the renderer produced the same homepage with no stubs, `scripts/ssr-browser-stubs.mjs` is now a documented no-op. Import order is unchanged (`installSsrBrowserStubs()` still runs before the SSR entry). No fake `window`/`document`/`localStorage` is injected. No stub code is in the client bundle or `public/`. The production `vite build` after this change injected 160,949 characters into `#root` from two identical isolated processes and exited normally.

No storage or network writes occur during prerender (`storageWrites` on generated HTML: 0; Firebase stays lazy).

---

## 14. Local rollback (no git commit)

Working copies of the pre-2D sources are in `seo-audit-evidence/phase-2d/pre-2d-*.bak` and `pre-2d-index.html`.

To restore the previous local sources:

1. Copy those backups over `src/`, `index.html`, and `vite.config.ts`.
2. Delete `src/entry-server.tsx`.
3. Remove the new `scripts/homepage-prerender.*`, `scripts/ssr-browser-stubs.mjs`, and `scripts/render-homepage-once.mjs` files if you do not want the pipeline.
4. Revert the `.gitignore` `.prerender/` line, the `tsconfig.json` `exclude` list, and the `index.html` no-JS class/CSS if you want the exact previous template.
5. Rebuild with `node .\node_modules\vite\bin\vite.js build` if you need a CSR-only `dist/`.

Do not `git checkout` unless you intend to discard other uncommitted user work (Phase 2A robots/sitemap, verification meta, SEO docs).

---

## 15. Close-out

### Narrowly scoped fixes in this remaining-verification pass

| File | Change |
| ---- | ------ |
| `src/hooks/index.ts` | Persist `localStorage` outside the React state updater; keep restore-after-mount guard. |
| `src/App.tsx` | `handleDeleteProject` uses a functional updater. |
| `scripts/ssr-browser-stubs.mjs` | Replaced unused fake browser APIs with a no-op after the stub review. |
| `scripts/render-homepage-once.mjs` | Still installs the (now no-op) stub hook, then imports the SSR entry. |
| `scripts/review-ssr-stubs.mjs` | New review harness. |
| `scripts/verify-phase-2d-remaining.mjs` | New isolated-Chrome verification harness. |

Google tag `G-SP37M5NYJ5` and the existing `google-site-verification` meta remain in `dist/index.html`.

### What now works locally

- `vite build` prerenders the real homepage into `#root` and hydrates the **same DOM nodes**.
- Development still uses `createRoot` on an empty root.
- Firestore is idle until a real consultation write.
- SubAir particles are deterministic across build and first paint.
- Hero copy and hybrid spec bullets are readable without JavaScript.
- Isolated-profile storage: functional updater + Delete persist; empty `[]` and malformed JSON are not overwritten; StrictMode on the dev server does not write defaults.

### What was verified

- Original-node identity across delayed-module hydration (App wrapper, Navbar, hybrid H2).
- Desktop and mobile photographs of hero (same slide), hybrid, expertise, projects, contact/footer, and the consultation modal.
- No-JS hero copy and no-JS hybrid bullets (visual + computed style).
- Isolated storage update/delete on preview and StrictMode dev.
- Stub review; client bundle leak check; TypeScript baseline only.

### Remaining verification gap

None for the requested Phase 2D checks, except that a saved pre-2D screenshot baseline was not available to diff against. Current-section photographs are complete.

### Confirmation

**Phase 2D verified locally.**

Nothing was committed, pushed, or deployed. Hosting settings and credentials were not requested or changed. The user’s real saved project data was not opened or modified.
