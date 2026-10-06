# Fast & Safe Maintenance Services — Phase 2C Rendering Assessment

**Date:** 14 September 2026  
**Role:** Local architectural assessment only. No application source, Phase 2A files, Google tag, hosting, or deployment settings were changed.  
**Live website:** Not checked and not modified. Deployment remains deferred until separately authorized.

This report does **not** repeat Phase 2A, does **not** rerun Lighthouse, and does **not** recommend deployment as the next step.

---

## 1. Scope and current baseline

The public site is still a **single-page React 19 + Vite 6 CSR app** (`createRoot` in `src/main.tsx`, no router). After `vite build`, `dist/index.html` still has an empty `#root`. Business copy appears only after JavaScript.

**Preserved and out of scope for this assessment**

- Phase 2A title, meta description, and canonical in `index.html`
- `public/robots.txt` and `public/sitemap.xml`
- Visible wording, layout, images, navigation, modals, forms, and Add/Delete project controls
- Application analytics configuration

**Google tag — current baseline, not a Phase 2A change**

`index.html` already includes Google tag **G-SP37M5NYJ5** (`gtag.js` plus `gtag('config', 'G-SP37M5NYJ5')`). That tag is part of the current local baseline. It was **not** introduced by Phase 2A and was **not** edited here.

Isolated browser tests attempted to block analytics hosts in the test tooling (`Network.setBlockedURLs` for googletagmanager / google-analytics / doubleclick). The application’s gtag snippet was left unchanged. The block did **not** stop `https://www.googletagmanager.com/gtag/js?id=G-SP37M5NYJ5` from appearing in resource timing (two hits). Build-time Node prerender is therefore preferred over a headless-browser snapshot, because `renderToString` does not execute the Google tag.

---

## 2. How the existing app renders

### 2.1 React tree

`App` is a composition layer. Always-mounted public sections:

| Section | Component | First-paint content |
| ------- | --------- | ------------------- |
| Nav | `Navbar` | Hash links + Request Consultation button |
| Hero | `HeroCarousel` | Slide 0 only (`AnimatePresence mode="wait"`) |
| Hybrid | `HybridGrassShowcase` | Full hybrid copy; some bullets start `opacity: 0` |
| SubAir | `SubAirVentShowcase` | Headings and explainer copy; particle animation uses `Math.random()` in render |
| About | `AboutSection` | Static Sitra / company copy |
| Services | `PremiumPitchesTech` | Natural-tab systems only |
| Expertise | `ExpertiseSection` | All 7 service names; blurbs in DOM with `text-white/0` |
| Projects | `ProjectsSection` | Source `PROJECTS` unless localStorage overlays them |
| Safety | inline in `App` | ISO / safety copy |
| Map | `SitraMap` | Sitra address + Maps iframe |
| Footer | `Footer` | NAP, activities, copyright year from `new Date().getFullYear()` |

Closed modals (`ConsultationModal`, project/expertise details) return `null` and are **not** in first HTML.

`FencingShowcase` and `NaturalGrassShowcase` are imported in `App.tsx` but not rendered. They are **absent** from the current client bundle (`dist/assets/index-DjXcGWzy.js`). They are not part of the public homepage tree.

### 2.2 Browser-only APIs

| API | Where | During first render? |
| --- | ----- | -------------------- |
| `window` scroll listener | `useScroll` in `Navbar` | No — `useEffect` only; initial `isScrolled = false` |
| `document.getElementById` | Hero buttons, PremiumPitchesTech, ExpertiseDetailsModal | Click handlers only |
| `document.createElement('canvas')` | Camera capture, `compressImage` | User actions only |
| `navigator.mediaDevices` | `useCamera` | Consultation camera only |
| `AudioContext` | SubAir sound | After user enables sound |
| `Image` / canvas | Image compression | Add-project / camera only |
| Maps iframe | `SitraMap` | Present in HTML as an `<iframe>` |

These do not block a first-paint HTML string if effects are not run. They **do** require `window` / `document` stubs (or jsdom) because Motion attaches resize listeners during `renderToString`.

### 2.3 localStorage

`useLocalStorage` in `src/hooks/index.ts` reads `localStorage.getItem` inside the `useState` initializer for:

- `fast_safe_projects` → `PROJECTS`
- `fast_safe_expertise` → `EXPERTISE`

That is **synchronous on first render**. In Node without a stub it throws. In the browser, a visitor with saved projects hydrates a **different** portfolio than the source data / prerender. `FencingShowcase` also reads `fencing_custom_*` keys during its own render, but that component is not mounted on the homepage.

### 2.4 Motion and carousel

- Hero uses `AnimatePresence mode="wait"` and `initial={{ opacity: 0, ... }}`. Isolated prerender HTML contains the slide-1 H1 **and** inline `opacity:0` / `translateY` styles.
- Hybrid specification lists use `whileInView` with `initial={{ opacity: 0, x: 20 }}`. The sentences are in the HTML; CSS hides them until Motion runs.
- Projects use `layoutId={`project-${id}`}` (stable ids).
- Navbar Motion variants are hover-only; first paint is fine.
- Carousel autoplay is an 8-second `setInterval` in `useEffect`. Prerender and first HTML are always slide 1: “WE BUILD THE GROUND / NATURAL GRASS PLAYS THE GAME”. That matches the Phase 2A homepage topic. Slides 2–3 are not in the first HTML by design of `mode="wait"`.

### 2.5 Firebase and other side effects

Two module-level initializations run as soon as those modules load:

1. `src/firebase.ts` — `initializeApp`, `getFirestore`, and `testConnection()` (`getDocFromServer` on `test/connection`)
2. `ConsultationModal.tsx` — second Firebase app/db setup (guarded by `getApps()`), plus its own `testConnection()`

`App` imports both, so **every homepage load** opens a Firestore Listen channel even when the modal is closed. The isolated Node probe reproduced this: after importing `App`, Firestore logged `Listen stream ... CANCELLED: Disconnecting idle stream`. The local preview also requested `firestore.googleapis.com/.../Listen/channel`. Firestore is **not** the CMS for public copy. Writes happen only on consultation submit (`addDoc` to `consultations`).

EmailJS credentials exist in `ConsultationModal.tsx`; they are unused until submit. This assessment did not submit forms.

---

## 3. Recommended approach

**Smallest suitable method:** build-time `renderToString` of the **existing homepage `App`** (same components, same `/` URL), inject the markup into `#root` of the built `index.html`, then switch the client from `createRoot` to `hydrateRoot`.

This stays on Vite + React. It does **not** add routes, rewrite copy, or migrate to Next.js / Remix. It uses Vite’s documented SSR loading path (`ssrLoadModule` + `renderToString`) as a **one-shot build step**, not a long-running Express server. The unused `express` dependency is not a reason to adopt runtime SSR.

**Why this is smaller than the alternatives**

| Option | Verdict |
| ------ | ------- |
| Build-time `renderToString` + `hydrateRoot` of existing `App` | **Recommended.** Reuses the current tree. Isolated probe produced H1, nav, hybrid, expertise, projects, footer. Does not execute G-SP37M5NYJ5. |
| Headless Chrome snapshot after `vite build` | Works with real Motion/Firebase, but snapshots a moving carousel, runs gtag unless extra blocking is reliable, and needs Chrome in CI. Larger and less deterministic. |
| Persistent Express / Vite SSR server | Heavier operations change. Express is already unused; adopting it is not the smallest path. |
| Vercel / host bot prerender | Hosting-config change. Deferred with all other deployment work. |
| Next.js / Remix / Vike migration | Explicitly out of scope. |
| Duplicate noscript copy in `index.html` | Would fork wording from the React tree. Not using the existing components as the source of truth. |

**Required companion changes (still local, still one homepage)**

1. SSR-safe `useLocalStorage`: seed from source defaults during prerender/first paint; read stored values only after hydration.
2. Defer Firebase (`initializeApp` / `testConnection`) until consultation submit or first modal open — not on module import.
3. Make SubAir particle markup deterministic on the server (no `Math.random()` during `renderToString`); start random motion after hydration.
4. For SEO-critical Motion (hero H1, hybrid bullets), prerender the **visible** state (`initial={false}` or equivalent) so no-JS HTML is not `opacity:0`.
5. Client entry: `hydrateRoot` instead of `createRoot`, or the prerendered `#root` is wiped.

Phase 2A head tags and G-SP37M5NYJ5 stay in `index.html` unchanged.

---

## 4. Concrete obstacles

1. **`createRoot` wipes `#root`.** `src/main.tsx` must change or prerendered HTML never reaches the user.
2. **Motion needs a DOM-like `window`/`document` with `addEventListener`.** A first Node probe failed with `target.addEventListener is not a function` until stubs were added. A later implementation needs those stubs or jsdom in the build plugin.
3. **`useLocalStorage` is not SSR-safe** and can mismatch hydration if the browser already has `fast_safe_projects`.
4. **Firebase starts on import.** Importing `App` in the probe opened a Listen stream and delayed Vite shutdown (~90s). A build prerender that imports `App` today would contact Firestore.
5. **Duplicate Firebase init** in `ConsultationModal.tsx`.
6. **`SubAirVentShowcase` calls `Math.random()` while rendering particles.** Full-`App` `renderToString` was **not bit-identical** across two consecutive calls (`deterministic: false`). Isolated trees without SubAir **were** identical. This is a hydration-mismatch source.
7. **Hero `initial` styles write `opacity:0` into the HTML.** Crawlers that read text still see the H1. Users without JS would see a blank hero unless Motion initial styles are skipped for prerender.
8. **Hybrid `whileInView` bullets** have the same `opacity:0` first-HTML issue. Text is present.
9. **`PremiumPitchesTech` default tab is `natural`.** Isolated and live first paint both **lack** “Resilience Pro”, “Performance Shockpad”, “Organic Infill”, and “Elastic Sub-Base”. The Artificial tab label is present. Fixing that is a later content decision, not required to prerender `/`.
10. **Carousel** only ships slide 1 in first HTML. Acceptable for the current homepage topic; do not snapshot mid-rotation.
11. **Public Add/Delete controls** will appear in prerendered HTML if the current UI is preserved. Do not remove them in this workstream.
12. **`Footer` uses `new Date().getFullYear()`.** Fine within one build year; do not invent a date.
13. **SitraMap iframe** will appear in static HTML (third-party Maps, not the Google tag).
14. **Existing `tsc` error in `src/App.tsx`** remains a baseline issue. Do not expand this phase to fix it unless it blocks the prerender compile.

---

## 5. Exact files a later local implementation would change

**Must change**

| File | Why |
| ---- | --- |
| `src/main.tsx` | `hydrateRoot` |
| `src/hooks/index.ts` | SSR-safe `useLocalStorage` |
| `src/firebase.ts` | Lazy init; no `testConnection()` on import |
| `src/components/modals/ConsultationModal.tsx` | Share lazy Firebase; no module-level `testConnection()` |
| `src/components/SubAirVentShowcase.tsx` | Defer `Math.random()` particles until after hydration |
| `src/components/HeroCarousel.tsx` | Prerender visible H1 (skip `opacity:0` initial) |
| `src/components/HybridGrassShowcase.tsx` | Prerender visible spec bullets |
| `vite.config.ts` | Build-time prerender plugin / `closeBundle` hook |

**Likely new files (not routes, not a framework)**

| File | Why |
| ---- | --- |
| `src/entry-server.tsx` | `renderToString(<App />)` export for the build step |
| Optional `scripts/prerender.mjs` | Same work outside the Vite plugin if that is cleaner |

**Must not change**

- `index.html` Phase 2A title / description / canonical
- Google tag **G-SP37M5NYJ5**
- `public/robots.txt`, `public/sitemap.xml`
- Visible marketing copy, images, CSS, Firebase project config values, EmailJS IDs (except moving *when* Firebase is constructed)
- Hosting files, `vercel.json`, redirects, new pages

`App.tsx` should stay a composition layer. Touch it only if a small `isPrerender` prop is unavoidable. Prefer environment-based guards in the files above.

---

## 6. Isolated prototype results

Experiments lived under `seo-audit-evidence/phase-2c/` and were **not** wired into the main app.

Command: `node seo-audit-evidence/phase-2c/ssr-probe.mjs`  
Runtime: Vite `createServer` + `ssrLoadModule` + `react-dom/server` `renderToString`  
Date: 14 September 2026, `2026-09-14T10:40:11.199Z`

| Probe | Result |
| ----- | ------ |
| `NoMotionSections` (`AboutSection` + `Footer` only) | **OK.** Deterministic. 11,266 HTML chars. Sitra + Fast & Safe present. No H1 (those sections have none). |
| Isolated `StaticHomepage` (Navbar, Hero, Hybrid, About, Expertise, Projects, Footer — no App/Firebase/localStorage hooks) | **OK.** Deterministic. 79,931 HTML chars. 1 H1, 4 H2s, 26 images. Slide-1 H1, hybrid H2, all expertise names, Hoora and other project teasers. Artificial-system product names absent (PremiumPitchesTech not included). |
| Full `App` | **OK with stubs.** 168,140 HTML chars; ~13,813 text chars (same order as the live rendered homepage). 1 H1, 8 H2s, 28 images. **Not deterministic** because of SubAir `Math.random()`. Import started Firestore Listen. |

Saved markup (evidence only):

- `seo-audit-evidence/phase-2c/ssr-probe-results.json`
- `seo-audit-evidence/phase-2c/no-motion-sections.html`
- `seo-audit-evidence/phase-2c/isolated-static-homepage.html`
- `seo-audit-evidence/phase-2c/full-app.html`

**Hydration:** `hydrateRoot` was **not** executed in a browser against the isolated HTML. Doing that would require changing `src/main.tsx` or adding a second client entry. Deterministic isolated HTML is supporting evidence; the SubAir randomness is a known blocker for a clean hydrate of full `App`.

**Local CSR preview (analytics block attempted):** `http://127.0.0.1:4173/`

- `#root` after JS: 158,225 characters
- H1: “WE BUILD THE GROUND / NATURAL GRASS PLAYS THE GAME”
- Artificial product names still absent until the Artificial tab
- Request Consultation opened and closed without submit
- gtag script still present in the document (baseline); gtag.js still appeared in resource timing despite `Network.setBlockedURLs`

Local Vite preview is not production status-code evidence.

---

## 7. Acceptance checks for a later local implementation

Appearance and interactions must match the current site. Use the local production preview, not a live deploy.

**HTML / crawl**

1. Built `dist/index.html` still has exactly one Phase 2A title, description, and canonical.
2. G-SP37M5NYJ5 snippet is unchanged.
3. `#root` contains the homepage H1, nav links, hybrid H2, expertise names, project teasers, Sitra/footer NAP — without running the client bundle.
4. robots.txt and sitemap.xml still copy through unchanged.
5. Artificial-tab-only product names may still be absent; do not “fix” that by rewriting service copy in this step.

**Hydration and look**

6. Client hydrates without replacing the tree via `createRoot`.
7. No hydration warning from SubAir random particles or localStorage overlay on a clean profile.
8. Hero H1 is visible in the prerendered HTML (not left at `opacity:0` for no-JS).
9. After JS, hero still auto-advances; slides 2–3 still work.
10. Hybrid `whileInView` bullets become visible as they do today.
11. Desktop and mobile layout match the current CSS (no new classes except what Motion already emits).

**Interactions (do not submit forms; do not write Firestore)**

12. Hash nav (`#expertise`, `#services`, `#contact`) still scrolls.
13. Request Consultation still opens and closes.
14. Project and expertise cards still open their modals.
15. Add/Delete project controls still appear and still use localStorage after hydration.
16. SubAir mode toggles, sound-off default, and PremiumPitchesTech tabs still work.
17. Camera is still closed unless the user starts it.

**Side effects**

18. `vite build` prerender does not call `testConnection()` or open Firestore Listen.
19. Local prerender/preview checks do not require editing the Google tag. Prefer Node prerender so build machines do not execute gtag.

---

## 8. Next local implementation step

**Phase 2D (local only): implement build-time prerender of `/`.**

Add a Vite build hook (or a script invoked after `vite build`) that `renderToString`s the existing `App`, injects it into `dist/index.html` `#root`, and switch the client to `hydrateRoot`. Make `useLocalStorage` and Firebase import-safe. Defer SubAir random particles. Prerender the hero/hybrid text in the visible state. Keep Phase 2A metadata, G-SP37M5NYJ5, robots, sitemap, wording, and controls as they are.

Verify on local `vite preview` only, using the acceptance list above.

Do not commit, push, deploy, add service pages, or change hosting in that step. Deployment stays deferred until separately authorized.
