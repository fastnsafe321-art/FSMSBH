# Fast & Safe Maintenance Services — Phase 0 SEO Audit

**Role:** Technical SEO audit only. No application code, metadata, keywords, Firebase data, or deployment settings were changed except creation of this report and local evidence files.

**This document is not a ranking prediction, traffic forecast, or overall “SEO score.”** Lighthouse SEO is a lab checklist. It is not the same as content quality, indexing, rankings, local pack visibility, or AI-answer citation.

---

## 1. Executive findings and verified business understanding

### What this website is

The public site is a **single-page, client-side-rendered React 19 + Vite 6 application**. There is **no router**. There is **one intended indexable HTTP URL**. Navigation uses hash fragments and buttons. Service specifications, installation steps, galleries, and project details open in **modals** or **React state tabs**.

### Verified business (from site and repository copy only)

| Field | Value used on the live site or in source | Status |
| ----- | ---------------------------------------- | ------ |
| Trading / legal-style name | Fast & Safe Maintenance Services (`COMPANY_INFO.fullName`; footer copyright) | Confirmed as on-site wording |
| Short brand | FAST & SAFE (`COMPANY_INFO.name`); document title **Fast N Safe** | Confirmed inconsistency |
| Other names in UI | Fast & Safe Construction (consultation success copy); FASTSAFE MAINTAIN (process step) | Confirmed inconsistency |
| Stated HQ | Sitra, Kingdom of Bahrain | Confirmed as on-site wording; street address **not present** |
| Stated founding / tenure | 2010 / 16 years | Internally consistent with audit year 2026; founding documents **Not tested** |
| Production website | `https://www.fsmsbh.com/` | Confirmed live (Vercel) |
| Firebase project | `fastsafe-bahrain` | Confirmed in `firebase-applet-config.json` |
| Stated CR | `CR: 33626-6 — ACTIVE` (footer) | On-site claim; Sijilat lookup **Not tested** |
| Stated ISO | ISO 9001:2015, 14001:2015, 45001:2018 | On-site claim; certificates **Not tested** |

The company presents as a **Sitra-based sports-surface and construction contractor** serving Bahrain, with a strong emphasis on football pitches (natural, artificial, hybrid, SubAir) plus fencing, building/turnkey works, swimming pools, horse walkers, and carpentry.

### Target market (inferred only from published content)

| Segment | Evidence | Confidence |
| ------- | -------- | ---------- |
| Ministries / public sports bodies | Repeated client label “Ministry for Youth and Sports Affairs” | High (as claimed on cards) |
| Football clubs / sports cities | Isa Sports City, Sitra/Malkiya/Ettihad/Isa Town/Ittifaq/Budaiya/Najma/Al Ahli/Ma'ameer | High (as claimed) |
| Schools | Bahrain School – Juffair | High (as claimed) |
| Equestrian | Rashid Equestrian Club; horse-walker expertise | High (as claimed) |
| Hospitality / private aquatic | Amwaj Islands Resort Aquatic Project | Medium (client name is marketing-style) |
| Industrial / villa fencing and pools | Expertise copy and unused fencing showcase | Medium |

Purchasing intent on the site is **quote / consultation**, not e-commerce.

### Highest-importance evidence-backed findings

1. **Production raw HTML is a 397-byte CSR shell** (`lang="en"`, viewport, title `Fast N Safe`, one JS file, one CSS file, empty `#root`). No meta description, canonical, Open Graph, robots meta, favicon, or JSON-LD.
2. **Only `/` is an indexable document.** Hash sections and modals are not separate pages. Unknown paths such as `/about` return **hard 404** on Vercel.
3. **Googlebot can render the homepage** (this audit’s live DOM contained ~13,800 characters of business text after JS). React is not “unindexable.” The limitation is **one URL, thin first HTML, and gated service depth**.
4. **Lighthouse SEO is 91/100** on that single URL (mobile and desktop). The only automated SEO fail is **missing meta description**. That is **not** a measure of ranking readiness.
5. **Brand, NAP, and claims are inconsistent or unverified** (two emails in source vs UI, placeholder social `href="#"`, FIFA/World Rugby/FIH/GSA/ISO/CR/“leading certified partner” without documents in the repo).
6. **Homepage image payload is enormous** (Lighthouse total size **37,210 KiB**). Performance scores exist but both Lighthouse runs warned the page loaded too slowly and results may be incomplete.

**Recommended first implementation phase:** Phase 1 — validate which services and claims are real, then lock keyword-to-page targets. Technical crawlability work (Phase 2) is a **prerequisite** before those keywords can have unique titles, H1s, and URLs.

---

## 2. Scope, environment, commands, and limitations

### 2.1 Git baseline

| Item | Value |
| ---- | ----- |
| Branch | `main` |
| Commit | `2257364d05aa51dbc28452af39ac69ec088ff29f` (`2257364 activities`) |
| Remote | `https://github.com/SID-CJ/fastNsafe.git` |
| Working tree at audit start | Untracked `SEO_MASTER_AUDIT.md` only (plus ignored `node_modules`) |
| Audit date | 14 September 2026 |

A prior uncommitted file `SEO_MASTER_AUDIT.md` exists in the tree. This Phase 0 report was **independently re-verified** against the repository, production HTTP, rendered DOM, local TypeScript/build, and Lighthouse 13.4.1.

### 2.2 Repository stack (verified)

| Layer | Evidence |
| ----- | -------- |
| TypeScript ~5.8 | `package.json` `typescript: ~5.8.2` |
| React 19 | `react` / `react-dom` `^19.0.1`; `src/main.tsx` → `createRoot` → `src/App.tsx` |
| Vite 6 | `vite: ^6.2.3` (local build printed `vite v6.4.2`) |
| Dev server | `npm run dev` → `vite --port=3000 --host=0.0.0.0` |
| Tailwind 4 | `@tailwindcss/vite`; `src/index.css` is `@import "tailwindcss"` only |
| Motion | `motion/react` |
| Lucide React | icons |
| Firebase / Firestore | `src/firebase.ts`, `ConsultationModal.tsx`, project `fastsafe-bahrain` |
| Static content | `src/data/expertise.ts`, `src/data/projects.ts`, `src/constants/index.ts` |
| localStorage | `useLocalStorage('fast_safe_projects' / 'fast_safe_expertise')` |
| Images | 224 files in `src/assets/images` (counted on disk). Vite `syncAssets()` copies them to `public/assets/images` |

**No React Router. No Helmet / `document.title` updates. No `robots.txt`, `sitemap.xml`, `vercel.json`, `CNAME`, `.github` workflows, or `public/favicon`.**

**Unused for the live frontend (do not treat as active product features):**

- `@google/genai`, `express`, `dotenv` — no `src/` imports
- `process.env.GEMINI_API_KEY` defined in `vite.config.ts` but unused in app code
- `FencingShowcase.tsx` and `NaturalGrassShowcase.tsx` — **imported in `App.tsx` but never rendered**
- App-level consultation submit / camera / photo state — **not passed into `ConsultationModal`** (the modal has its own Firestore + EmailJS submit)

`README.md` and `metadata.json` are AI Studio leftovers (`react-example`, Gemini, Cloud Run `APP_URL`). They are **not** served as HTML.

### 2.3 Commands run

| Command | Result |
| ------- | ------ |
| `npm run lint` (`tsc --noEmit` via npm) | **Failed** — npm script path breaks on `F&S` (`&`) |
| `node .\node_modules\typescript\bin\tsc --noEmit` | **Failed** — `src/App.tsx(505,9)` `setFormData` type mismatch |
| `node .\node_modules\vite\bin\vite.js build` | **Succeeded** — `dist/index.html` 0.40 kB; JS 837.09 kB (gzip 230.99 kB); CSS 92.75 kB (gzip 13.85 kB); 224 images synced |
| Production `curl` | See §6 and `seo-audit-evidence/` |
| Lighthouse 13.4.1 mobile + desktop | Production `/` only; see §11 |

`npm run preview` was **not** used for Lighthouse (local preview Lighthouse = **Not tested**). Local `dist/index.html` was inspected and matches the same CSR-shell pattern as production (different content hashes).

### 2.4 Evidence locations

| File | Contents |
| ---- | -------- |
| `seo-audit-evidence/production-index.html` | Live raw HTML |
| `seo-audit-evidence/production-index.headers.txt` | HEAD `/` |
| `seo-audit-evidence/production-no-slash.headers.txt` | HEAD `https://www.fsmsbh.com` (no trailing slash) |
| `seo-audit-evidence/production-http-apex.headers.txt` | HEAD `http://fsmsbh.com/` |
| `seo-audit-evidence/get-homepage.headers.txt` | GET `/` headers |
| `seo-audit-evidence/robots-404-body.txt` | Live `/robots.txt` body |
| `seo-audit-evidence/lighthouse-prod-mobile.report.json` + `.html` | Mobile Lighthouse |
| `seo-audit-evidence/lighthouse-prod-desktop.report.json` + `.html` | Desktop Lighthouse |
| `seo-audit-evidence/lighthouse-prod-*-summary.json` | Extracted scores |

### 2.5 What was not done (explicit)

- No consultation form submit; no Firestore writes; no customer record reads; no localStorage project edits
- No deploy, git commit, or account changes
- Google Search Console, Bing Webmaster, Keyword Planner, Ahrefs/Semrush, CrUX / field CWV: **Not tested**
- Google Business Profile, Sijilat CR, ISO registrar, FIFA licensee lists: **Not tested**
- `site:fsmsbh.com` in Google: browser hit an interstitial/captcha — **Not tested**
- Search-volume / CPC / KD: **Not verified** (not available)
- Arabic UI does not exist; Arabic demand is qualitative SERP observation only
- Lighthouse was **not** re-run on a local preview URL
- Field INP was **not** measured (lab navigation only)

### 2.6 How to read labels

| Label | Meaning |
| ----- | ------- |
| **Confirmed** | Observed in repo, live HTTP, rendered DOM, build output, or Lighthouse JSON |
| **Potential** | Reasonable risk from evidence, not fully proven in production crawl logs |
| **Not tested** | Tool, account, or access missing |

---

## 3. Complete page / section / modal inventory

**Rule applied:** sections, hash anchors, tabs, and modals are **not** counted as indexable pages.

### 3.1 HTTP URLs

| URL | Type | Source | Title | Meta description | H1 | Indexable? |
| --- | ---- | ------ | ----- | ---------------- | -- | ---------- |
| `https://www.fsmsbh.com/` | Homepage (entire site) | Live 200 | `Fast N Safe` | Missing | Rotating hero H1 (one at a time) | Conditionally yes after JS; thin without JS |
| `https://www.fsmsbh.com` (no slash) | Same document | Live 200, same 397-byte HTML | Same | Missing | Same | Duplicate of `/` if both indexed |
| `https://www.fsmsbh.com/index.html` | Same document | Live 200, `Content-Disposition: inline; filename="index.html"` | Same | Missing | Same | Duplicate URL **Confirmed** |
| `https://fsmsbh.com/` | Apex | Live **308** → `https://www.fsmsbh.com/` | — | — | — | Redirect; do not index apex |
| `http://www.fsmsbh.com/` | HTTP www | Live **308** → HTTPS www | — | — | — | Redirect |
| `http://fsmsbh.com/` | HTTP apex | Live **308** → `https://fsmsbh.com/` (then another 308 to www) | — | — | — | Two-hop redirect **Confirmed** |
| `https://www.fsmsbh.com/robots.txt` | Technical | Live **404** `X-Vercel-Error: NOT_FOUND` | — | — | — | Missing |
| `https://www.fsmsbh.com/sitemap.xml` | Technical | Live **404** | — | — | — | Missing |
| `https://www.fsmsbh.com/favicon.ico` | Technical | Live **404** (also Lighthouse console error) | — | — | — | Missing |
| `https://www.fsmsbh.com/manifest.json` | Technical | Live **404** | — | — | — | Missing |
| `https://www.fsmsbh.com/apple-touch-icon.png` | Technical | Live **404** | — | — | — | Missing |
| `https://www.fsmsbh.com/llms.txt` | Technical | Live **404** | — | — | — | Not a Google requirement |
| `https://www.fsmsbh.com/about` | Missing route | Live **404** | — | — | — | Hard 404 |
| `https://www.fsmsbh.com/services/artificial-grass` | Missing route | Live **404** | — | — | — | Hard 404 |

**Indexable page count: 1.** Legal, FAQ, blog, about, contact, and service routes **do not exist**.

### 3.2 Homepage sections (same URL)

| Name | Type | Anchor | Source file | Topic | Visible without click? | Independent crawlable page? |
| ---- | ---- | ------ | ----------- | ----- | --------------------- | --------------------------- |
| Navbar | UI | `#` and hashes | `Navbar.tsx` + `NAV_LINKS` | Nav + consultation button | Yes | No |
| Hero carousel | Section | none | `HeroCarousel.tsx` | Brand + rotating pitch claims | Current slide only (`AnimatePresence`) | No |
| Hybrid grass | Section | `#hybridgrass` | `HybridGrassShowcase.tsx` | Hybridgrass explainer | Yes (hotspot popovers need hover/click) | No |
| SubAir | Section | `#sub-air-system` | `SubAirVentShowcase.tsx` | Drainage / aeration explainer | Core copy yes; modes/schematic/sound are interactive | No |
| About | Section | `#about` | `AboutSection.tsx` | Company + ISO stats | Yes | No |
| Pitch technologies | Section | `#services` | `PremiumPitchesTech.tsx` | Natural/hybrid vs artificial systems | Natural tab default; **artificial systems require a click** | No |
| Project cycle | Fragment | `#project-cycle` | inside `PremiumPitchesTech.tsx` | Design → maintain steps | Step titles yes; deep-dive text follows hover/state | No |
| Expertise grid | Section | `#expertise` | `ExpertiseSection.tsx` | 7 services | Titles + short `desc` in DOM; details in modal | No |
| Projects | Section | `#projects` | `ProjectsSection.tsx` | 15 project teasers | Card title/desc/client/year yes; galleries in modal | No |
| Safety / ISO | Section | `#safety` | inline in `App.tsx` | ISO 9001 loop | Yes | No |
| Sitra map | Section | `#office-location` | `SitraMap.tsx` | Area map + hours + phones | Yes | No |
| Footer / contact | Footer | `#contact` | `Footer.tsx` | NAP, activity list, ISO, social | Yes | No |

`#about` and `#office-location` **exist in the DOM** but are **not** in `NAV_LINKS`.

### 3.3 Modals and other UI state (not pages)

| Name | Type | URL | Source | Content | Crawlable page? |
| ---- | ---- | --- | ------ | ------- | --------------- |
| Expertise details | Modal | none (hash stays `#expertise`) | `ExpertiseDetailsModal.tsx` | detailedDesc, features, steps, gallery, cases | **No** — confirmed live: Tech Specs appeared; title stayed `Fast N Safe`; hash unchanged |
| Project details | Modal | none | `ProjectDetailsModal.tsx` | details + gallery + inquire CTA | No |
| Consultation | Modal | none | `ConsultationModal.tsx` | Quote form → Firestore `consultations` + EmailJS | Should remain non-indexable |
| Add portfolio project | Button | none | `ProjectsSection` → `setIsAddProjectOpen(true)` | **No add-project modal is rendered** | Dead control **Confirmed** |
| Delete project | Hover button | none | `ProjectsSection` | Deletes from **this browser’s localStorage** | Not a page; trust risk |
| Hero slides 2–3 | Carousel state | none | `HeroCarousel` | Alternate H1 + copy | Only active slide in DOM |
| Artificial systems 1–4 | Tab state | none | `PremiumPitchesTech` `ARTIFICIAL_SYSTEMS` | Resilience Pro, shockpad, infill, elastic sub-base | **Not in `document.body.innerText` until tab click** (live CDP) |
| Hybrid hotspots | Hover/click | none | `HybridGrassShowcase` | Layer popovers | Button names present; popover text interaction-gated |
| Unused fencing showcase | Not mounted | — | `FencingShowcase.tsx` | Deep fencing apps (includes Unsplash URLs) | Not public |
| Unused natural-grass showcase | Not mounted | — | `NaturalGrassShowcase.tsx` | Alternate SubAir sim | Not public |

### 3.4 Heading / CTA snapshot (live rendered homepage)

**Document title (source + live):** `Fast N Safe`  
**Meta description:** none  
**Canonical:** none  
**JSON-LD:** none  

**H1 (rotates; only one in DOM):**

1. WE BUILD THE GROUND / NATURAL GRASS PLAYS THE GAME  
2. HIGH-PERFORMANCE / ARTIFICIAL TURF SYSTEMS  
3. FROM ROOTZONE / TO FINAL LINE MARKING  

**H2s present after JS:** What is HYBRIDGRASS System; How SubAir Technology Works; WHO WE ARE; Advanced Engineered Sports Surface Technologies; Our Expertise; Reference Projects; Commitment to Standards; Sitra Regional Office & Estimating Depot.

**Primary CTAs:** REQUEST CONSULTATION (button, no `href`); hero buttons scroll via `getElementById`; SubAir “Request Sub-Air Engineering Consultation” (button); footer `tel:` / `mailto:` / site link; hybrid `#contact` text link.

**Internal links with real `href`:** nav hashes, hybrid brochure link `#contact`, footer tels/email/site, map Google Maps URL. Many commercial CTAs are **click-only buttons**.

---

## 4. Confirmed service inventory

| Service | Evidence | Existing URL / section | Customer intent | Geographic relevance | Status |
| ------- | -------- | ---------------------- | --------------- | -------------------- | ------ |
| Artificial grass / synthetic turf installation | `expertise.ts` ARTIFICIAL GRASS INSTALLATION; hero slide 2; 8+ club “Replacement of Artificial Grass” projects; footer | `/` + `#expertise` modal; `#services` artificial tab | Commercial / procurement | Bahrain clubs, schools; climate copy | **Confirmed** as offered on-site |
| Natural grass pitch installation | `expertise.ts`; hero slides 1 & 3; about | `/` + modal | Commercial | Bahrain / Sitra & Manama mentioned in process copy | **Confirmed** on-site |
| Hybrid grass / Hybridgrass / FS-Grass hybrid stitching | `HybridGrassShowcase`; `#services` Hybrid Stitching | `/#hybridgrass`, `/#services` | Commercial + informational | Bahrain stadiums/schools/compounds claimed | **Confirmed** on-site; “patented” / FIFA partner language **unsupported** |
| SubAir underground air/water/temperature | `SubAirVentShowcase`; `#services` Sub-Air module | `/#sub-air-system` | Commercial + technical | Bahrain rain/heat narrative | **Confirmed** on-site as a sold capability *claim* |
| DrainTalent™ vacuum extraction | `PremiumPitchesTech` `drainage` | `/#services` tab | Technical commercial | Elite training facilities | **Ambiguous** — branded module; relationship to SubAir unclear |
| Geothermal / root-zone heating | `#services` Geothermal Control; footer “Geothermal Sports Turf Systems” | `/#services` tab + footer list | Niche commercial | Winter dew/frost copy | **Ambiguous** — named, thin, no project proof |
| Pitch maintenance / grooming | Process step FASTSAFE MAINTAIN | `/#project-cycle` | Commercial aftercare | 12+ year field-life claim | **Ambiguous** as a standalone sold service |
| Fencing works | `expertise.ts` FENCING WORKS; footer; unused `FencingShowcase` | `/` + modal | Commercial | Industrial + stadium netting claimed | **Confirmed** on-site; unused showcase not public |
| Building / civil / turnkey construction | `expertise.ts`; Hoora; North Sehla | `/` + modal + project cards | Commercial | Sitra / Bahrain youth centres | **Confirmed** on-site |
| Horse walker / equine systems | `expertise.ts`; Rashid project | `/` + modal | Niche commercial | Bahrain equestrian | **Confirmed** on-site |
| Swimming pool construction | `expertise.ts`; Amwaj project | `/` + modal | Commercial | Amwaj / villas / hotels claimed | **Confirmed** on-site |
| Carpentry & wood works | `expertise.ts` | `/` + modal | Commercial | Equestrian/residential/commercial claimed | **Confirmed** on-site (thinner proof) |
| Landscape & irrigation | Footer list; hero mentions irrigation | Footer only | Commercial | Bahrain | **Unsupported** as a full service page — name only |
| Interior fit out | Footer list | Footer only | Commercial | — | **Unsupported** |
| Sports flooring | Hero slide 1 phrase only | Hero only | Commercial | — | **Unsupported** |
| Scaffolding department | `#safety` bullet | `#safety` | Supporting | — | Capability mention only |
| Design / CAD / soil testing | Process step 01 | `/#project-cycle` | Supporting | Sitra & Manama “engineering divisions” | Supporting process, not a product line |

**Consultation dropdown (`ACTIVITIES`)** includes Artificial Grass, Natural Grass, Fencing, Building, Horse Walker, Swimming Pool, Other/Turnkey. **Missing from the form:** Hybrid Grass, SubAir, Carpentry.

---

## 5. React rendering and crawlability findings

### 5.1 Initial HTML vs rendered DOM

**Initial HTML (production GET, 397 bytes) — Confirmed:**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Fast N Safe</title>
    <script type="module" crossorigin src="/assets/index-CNlKet0d.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-BVXGzQw9.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

No business copy, no links, no images, no H1.

**Rendered DOM (live `https://www.fsmsbh.com/`, 14 Sep 2026, CDP) — Confirmed:**

- `#root` innerHTML length ≈ 152,340 characters
- `document.body.innerText` length ≈ 13,810 characters
- 8 H2s, 7 expertise names, 15 project teasers, footer NAP, hybrid and SubAir explanations
- 28 `<img>` in the document; all had `alt`; none had `loading="lazy"`
- Images resolved to `https://www.fsmsbh.com/assets/images/...` (Vite rewrite of `/src/assets/images/` works)

**Do not claim React is inherently unindexable.** Google Search can execute JS on this homepage. Limitations that *were* observed:

| Limitation | Evidence | Effect |
| ---------- | -------- | ------ |
| Thin first response | 397-byte HTML | Non-JS clients, some social/AI scrapers, and delayed render see only `Fast N Safe` |
| One URL for every intent | No router | Cannot have unique titles/H1s/canonicals per service |
| Modal-gated depth | Expertise click: Tech Specs + FIFA feature list appeared; URL stayed `/#expertise` | Deep specs are not independently fetchable |
| Tab-gated artificial systems | CDP `innerText` lacked “Resilience Pro”, “Performance Shockpad”, “Organic Infill”, “Elastic Sub-Base” until tab change | Those four systems are easy to miss |
| Hero `AnimatePresence mode="wait"` | Only one H1/description in DOM | Crawler may see whichever slide is active |
| Expertise card blurbs `text-white/0` until hover | `ExpertiseSection.tsx` | Text is in the accessibility tree (live snapshot included the short `desc`) but visually hidden |
| Hybrid `whileInView` starts `opacity: 0` | `HybridGrassShowcase.tsx` | If Motion failed, those bullets could stay invisible; they were present in the live a11y tree |
| localStorage overlay | `useLocalStorage` seeds from `PROJECTS` / `EXPERTISE` | A visitor (or stale browser) can show a **different** public portfolio than source data |
| Firestore on every load | `testConnection()` in `firebase.ts` **and** `ConsultationModal.tsx` | Extra network; not used as a CMS |
| Public add/delete project controls | Live snapshot: “Add Portfolio Project” + 15 “Delete Project” | Trust/quality issue; delete is localStorage-only |

JavaScript errors affecting **public content:** Lighthouse recorded a **favicon.ico 404** console error. Firestore Listen channel showed `transferSize: 0` in Resource Timing (streaming/websocket — **Potential**, not proven as a content failure). No blank homepage was observed after JS.

Direct load / refresh: `/` works. `/#expertise` changes hash only (confirmed). `/about` is a **real 404**, not a soft homepage — good for avoiding soft-404 *until* multi-page routes are added (those will need host rewrites).

### 5.2 Prerender / SSR options (plan only — do not migrate)

Smallest suitable options **for this Vite SPA on Vercel**, if later approved:

| Option | Fit | Trade-off |
| ------ | --- | --------- |
| **Static prerender of `/` (and later routes)** via a Vite prerender plugin or `vite-plugin-ssg` keeping React | Smallest change; ships HTML with H1, nav, service summaries | Need to keep prerender in sync with client app; forms still client-side |
| **Vercel prerender / bot HTML** for the existing SPA | Host-level; no framework rewrite | Preview vs production config must stay consistent; still one URL unless routes are added |
| **React SSR (RSC / custom Express)** | Heavier; Express is already an unused dependency but unused is not a reason to adopt it | Framework-level change; out of Phase 0 scope |
| **Move to Next.js / Remix** | Largest | Explicitly out of scope |

Recommendation when authorized: **prerender the real public URLs after Phase 1 decides the URL set**, rather than adopting a new framework first.

---

## 6. Technical SEO findings

### 6.1 Host and protocol (live, 14 Sep 2026)

| Check | Result | Label |
| ----- | ------ | ----- |
| Host | `Server: Vercel`, `X-Vercel-Id`, `X-Vercel-Cache` | Confirmed |
| HTTPS www | `200`, HSTS `max-age=63072000` | Confirmed |
| Apex HTTPS | `308` → `https://www.fsmsbh.com/` | Confirmed |
| HTTP www | `308` → HTTPS www | Confirmed |
| HTTP apex | `308` → `https://fsmsbh.com/` then another hop to www | Confirmed two-hop |
| GitHub Pages as live host | No `CNAME`, no `.github`, Vite `base` unset | **Not** the live host. Comment in `vite.config.ts` only |
| `vercel.json` | Absent | Confirmed |
| SPA rewrite for unknown paths | Hard **404** `NOT_FOUND` | Confirmed — not a homepage soft-404 today |
| `X-Robots-Tag` on GET `/` | Absent | Confirmed |
| `Access-Control-Allow-Origin: *` on HTML | Present | Unusual for a marketing HTML document; low SEO impact |

Production HTML `Last-Modified` on cached HIT: **Thu, 10 Sep 2026 05:16:00 GMT**. Local build (this audit) emitted different hashed filenames (`index-DbSXG22Z.js`) than live (`index-CNlKet0d.js`). Treat local `dist` as **same architecture, not byte-identical to production**.

### 6.2 robots, sitemap, canonical

| Item | Finding | Label |
| ---- | ------- | ----- |
| `robots.txt` | 404 body: “The page could not be found / NOT_FOUND” | Confirmed |
| Lighthouse `robots-txt` | `notApplicable` (missing file is not an automated fail) | Confirmed |
| `sitemap.xml` | 404 | Confirmed |
| Robots meta | None | Confirmed |
| Canonical | None in source or rendered head | Confirmed |
| Lighthouse canonical | `notApplicable` | Confirmed — **missing canonical is not a Lighthouse SEO fail** |
| Preview/staging robots | No preview host verified | Not tested |

A missing `robots.txt` is **not** the same as deindexing a URL. Crawlers typically treat “no file” as allow-all. The gap is **no sitemap declaration and no crawl-budget guidance**.

### 6.3 Duplicates, casing, trailing slash

- `/` and no-slash www both **200** with the same 397-byte HTML.
- `/index.html` also **200** — **Confirmed** duplicate.
- Hash URLs (`/#`, `/#expertise`) are the same document.
- No case-variant tests beyond the paths above.

### 6.4 Internal links, orphans, assets

- Nav uses real `<a href="#...">` — crawlable as fragments, not as extra pages.
- `#about` is an orphan hash (no primary nav link).
- Social icons: `href="#"` with aria-labels — **Confirmed** placeholder, not profiles.
- Footer activity names are **plain `<li>` text**, not links.
- Expertise/project cards are **clickable `<div>`s / buttons**, not `<a href>`.
- Live image requests for visible cards returned **200** (CDP `naturalWidth > 0` for sampled images).
- Unused fencing Unsplash URLs are **not** in the live DOM.

### 6.5 Language and mobile

- `html lang="en"` only. No `hreflang`. No Arabic routes. Lighthouse `hreflang` scored 1 because **no invalid hreflang exists**.
- Viewport present. Mobile content is the same SPA (parity **Confirmed** as one page, not as separate m-dot).
- No app manifest.

### 6.6 Analytics / Search Console

- No `gtag`, GTM, or `google-site-verification` in `index.html` or `src/`.
- Firebase `measurementId` is empty.
- Search Console verification: **Not tested**.

---

## 7. On-page and keyword-gap analysis

### 7.1 Search intent vs current page

The single URL tries to rank (implicitly) for brand, natural grass, artificial turf, hybrid, SubAir, seven expertise lines, projects, ISO, and local Sitra contact. That is **keyword overlap on one document**, not seven landing pages.

### 7.2 Title and description

| Surface | Current | Assessment |
| ------- | ------- | ---------- |
| `<title>` | Fast N Safe | Passes Lighthouse “has a title”; **poor relevance** (no legal name, service, or Bahrain) |
| Meta description | Missing | Lighthouse SEO **fail**; no SERP snippet control |
| `metadata.json` description | Sports construction + 16 years | **Not injected** into HTML |
| Route-specific titles | None | No `document.title` updates on hash change (live title stayed `Fast N Safe` at `/#expertise`) |

Do not treat title-character counts as a Google requirement. The problem is **identity and intent**, not truncation.

### 7.3 Headings and thin / duplicate copy

- Visual “eyebrow” H2s (`WHO WE ARE`, `Our Expertise`) sit above larger H3s — inverted visual hierarchy.
- Lighthouse a11y: **heading-order fail** (H4 “Natural Grass - Hybrid Stitching” in the system list).
- Eight projects share the card description **“Replacement of Artificial Grass”**.
- Hybrid H3 “Elite Hybridgrass System” is repeated.
- Expertise **detailedDesc / features / steps** are not on-page without a modal.
- Footer lists Landscape, Interior, Geothermal without supporting body copy.

### 7.4 Images and text-in-images

- Visible images had alt text in the live DOM (service name or project title, or decorative-ish hero `alt={slide.tag}` such as “KINGDOM OF BAHRAIN • ESTABLISHED 2010”).
- Hero alts describe tags, not the photograph.
- No evidence that **critical specs exist only as text burned into images** for the main hybrid/SubAir copy (that copy is HTML). Some brochure-style images may still contain unread specs — **Potential**.
- None of the 28 in-DOM images were `loading="lazy"` — below-the-fold project PNGs still download immediately.

### 7.5 Internal link text

- Nav labels are generic (SERVICES, EXPERTISE) but unique enough for an SPA.
- “Request Technical Specifications Brochure” is a real hash link.
- Social “Follow us on Instagram” points to `#`.
- Service names in the footer are not links.

### 7.6 Researched SERP observations (14 Sep 2026, web search)

These are **qualitative result-page observations**, not volumes.

| Query (English unless noted) | Observable results (examples) | This site appeared? |
| ---------------------------- | ----------------------------- | ------------------- |
| `artificial grass installation Bahrain` | Baraka Sports, Greengrass Bahrain, PrimeSports, Sumworks, GFSS | **Not observed** in the result set returned |
| `hybrid grass football pitch Bahrain` | Bahrain Tender Board / GSA natural-grass renovation; Khaldiya club upgrade news; SIS Pitches (international hybrid); PrimeSports | **Not observed** |
| `natural grass football pitch construction Bahrain` | GSA/Tender Board Khaldiya and Khalifa/Muharraq tenders (Paspalum, FIFA-oriented scope) | **Not observed** |
| `swimming pool construction Bahrain` | Atlantic Pools, Riviera Pools, Al Rashid, Safayer, Splash Pools | **Not observed** |
| `sports fencing contractor Bahrain` | GFSS, PrimeSports, Almad | **Not observed** |
| `horse walker installation Bahrain` | JEMS (Salmabad), international manufacturers | **Not observed** |
| `"Fast & Safe Maintenance Services" Bahrain` | Unrelated home-maintenance brands (“fast” repair) | **Not observed** |
| `site:fsmsbh.com` / `"fsmsbh.com"` / `info@fsmsbh.com` | No usable branded hit in the search tool; Google browser search blocked by captcha | **Not verified** |
| `عشب صناعي البحرين تركيب` | Landscape/residential suppliers (e.g. Al Tarek, Play Nation) more than FIFA pitch contractors | **Not observed**; site has no Arabic page |

**Autocomplete / related searches:** not captured (Google UI blocked). Treat as unavailable.

Public tenders show **real Bahrain demand** for natural-grass renovation, artificial pitches, drainage, irrigation, and fencing — informational confirmation of market, **not** a keyword-volume number.

### 7.7 Validated competitor pages (why they match)

Competitors below were taken from **those SERPs**, not invented.

| Competitor | URL | Why it matches | Observable difference vs this site |
| ---------- | --- | -------------- | ---------------------------------- |
| PrimeSports / SportsBuilders Bahrain | https://primesports.info/ | Bahrain sports-facility construction; football pitches; artificial grass; quote form | Multi-section marketing site with **named service paths** (Pitch Construction, Artificial Grass Installation, Pitch Maintenance); phone `+973 3887 9494`; email `hello@primesports.info`; padel/tennis (services this site does **not** evidence) |
| Gulf Fencing & Specialist Surfacing (GFSS) | https://gfss.com.bh/ | Bahrain fencing + artificial grass + sports pitches + landscaping; Ministry of Youth projects in public profile | Multi-page site; PO Box 5060 Manama; phones; **published hours**; project galleries; company profile PDF listing football-pitch works |
| Almad Contracting | http://www.almadsports.com/ | Bahrain sports courts + security fencing since 1989 | Court sports (tennis/squash etc.) more than football turf; still competes on fencing/facilities |
| Baraka Sports | https://baraka-sports.com/infrastructure/ | Artificial grass installation Bahrain | Dedicated turf/infrastructure page and contact hours |
| Greengrass Bahrain | https://greengrass-bahrain.com/green/fixing-installation/ | Artificial grass supply/install | More landscaping/residential than institutional pitches |
| Atlantic / Riviera / Al Rashid / Splash pools | atlantic-pools.com; rivierapoolbh.com; alrashidpools.com; splashpoolsbh.com | Swimming pool construction Bahrain | Dedicated pool companies with addresses/phones — this site’s pool offer is one modal on a sports SPA |
| JEMS | jems4u.com materials / directory listings | Horse walkers, Bahrain office | Specialist equine equipment firm |

Do not treat these as a complete market map. Other contractors (e.g. general civil firms bidding Khaldiya) appear in news/tenders without being pitch-turf specialists.

---

## 8. Proposed keyword-to-page mapping

**Not applied.** No titles or URLs should be changed until Phase 1 approval.

**Rules used:** candidates come from **confirmed** services first. Volume/CPC/difficulty = **Not verified**. Autocomplete was not available. One primary intent per **existing** page. New URLs are **proposals only**.

### 8.1 Existing URL (only one)

| Service/page | Primary keyword candidate | Secondary terms | Search intent | Bahrain relevance | Existing target URL | Evidence source/date | Confidence | Validation needed |
| ------------ | ------------------------- | --------------- | ------------- | ----------------- | ------------------- | -------------------- | ---------- | ----------------- |
| Homepage (all topics today) | Fast & Safe Maintenance Services Bahrain **or** sports construction company Bahrain | Fast N Safe; FSMS; fsmsbh; Sitra contractor | Brand + commercial | HQ claimed Sitra; nationwide form list | `https://www.fsmsbh.com/` | On-site name + live host 14 Sep 2026 | Medium | Owner must pick **brand vs category** as the homepage primary; cannot be primary for every service |

Until extra URLs exist, **do not** write seven competing title tags. A later homepage title should name the company and the core category once.

### 8.2 Proposed URLs only (not in the site)

| Service/page | Primary keyword candidate | Secondary terms | Search intent | Bahrain relevance | Existing target URL | Evidence source/date | Confidence | Validation needed |
| ------------ | ------------------------- | --------------- | ------------- | ----------------- | ------------------- | -------------------- | ---------- | ----------------- |
| Artificial grass (proposed `/services/artificial-grass/`) | artificial grass installation Bahrain | synthetic turf; football turf replacement; 3G pitch | Commercial | Strong SERP + many on-site club projects | none (modal only) | SERP 14 Sep 2026; `expertise.ts`; projects 3,5,7–15 | High as a **topic**; volume Not verified | Confirm FIFA Quality Pro wording before using “FIFA” in a title |
| Natural grass (proposed `/services/natural-grass/`) | natural grass pitch construction Bahrain | sports field grass; Paspalum/Bermuda only if you actually install those cultivars | Commercial | Active GSA tenders (Paspalum named in public tender text) | none | Tender Board / news 2024–2026; `expertise.ts` | Medium–high | Confirm grass species actually installed (site says Bermuda hybrid cultivars; tender text says Paspalum) |
| Hybrid grass (proposed `/services/hybrid-grass/`) | hybrid grass system Bahrain | hybrid turf; reinforced natural grass | Commercial + informational | International hybrid vendors appear; local hybrid installs not independently verified | `/#hybridgrass` | On-site section; SIS Pitches in SERP | Medium | Confirm you install a named hybrid system and may use that brand |
| SubAir (proposed `/services/subair/`) | SubAir system installation Bahrain | pitch vacuum drainage; subsurface aeration | Commercial / technical | Climate/drainage relevance high; “SubAir” is also a third-party product name | `/#sub-air-system` | On-site section | Medium | Confirm licensee/installer relationship before schema/title uses the product name |
| Fencing (proposed `/services/fencing/`) | sports fencing contractor Bahrain | stadium netting; palisade | Commercial | GFSS dominates general fencing SERP | expertise modal | `expertise.ts`; SERP 14 Sep 2026 | Medium | Decide sports vs industrial fencing as primary |
| Building (proposed `/services/building-construction/`) | turnkey construction Sitra Bahrain | youth centre contractor | Commercial | Hoora / North Sehla claims | project cards | `projects.ts` | Medium | Confirm still offering general building vs sports-only |
| Pools (proposed `/services/swimming-pools/`) | swimming pool construction Bahrain | concrete pool; infinity edge | Commercial | Crowded specialist SERP | expertise + project 6 | SERP 14 Sep 2026 | Medium | Only if pools remain a real sales line |
| Horse walkers (proposed `/services/horse-walkers/`) | horse walker installation Bahrain | equine walker; rubber floor | Niche commercial | JEMS already visible | expertise + Rashid | SERP 14 Sep 2026 | Medium | Narrow page; do not force volume assumptions |
| Carpentry (proposed `/services/carpentry/`) | carpentry and wood works Bahrain | stable timber; decking | Commercial | Generic carpentry SERP likely broad | expertise modal | on-site only | Low–medium | Confirm vs “too generic to rank from a sports brand” |
| Projects hub (proposed `/projects/`) | sports construction projects Bahrain | football pitch projects | Commercial / proof | Club names are local entities | `#projects` | `projects.ts` | Medium | Unique copy per club if split |
| Contact (proposed `/contact/`) | Fast & Safe Sitra contact | quote; phone | Local / transactional | NAP exists | `#contact` | footer + map | High as a page type | Need a real street address if claiming a pin |
| About (proposed `/about/`) | Fast & Safe Maintenance Services Bahrain | CR 33626; ISO contractor Sitra | Informational / brand | Entity | `#about` | constants + footer | Medium | Substantiate ISO/CR first |
| Landscape / interior / geothermal / sports flooring | — | — | — | — | footer/hero mentions | — | **Do not target** | Confirm offering or remove from public lists |

**Do not create city doorway pages** (Manama, Riffa, Muharraq…) with duplicate copy. Location modifiers belong on real service pages.

**Arabic:** qualitative demand exists for residential `عشب صناعي`. Institutional football work also appears in Arabic on the Tender Board. **No Arabic page exists.** Do not add hreflang without real translations.

**Branded vs commercial vs informational vs transactional**

| Class | Candidates (no volume) |
| ----- | ---------------------- |
| Branded | Fast & Safe Maintenance Services; Fast N Safe; FSMS Bahrain; fsmsbh |
| Commercial | artificial grass installation Bahrain; natural grass pitch construction Bahrain; hybrid grass Bahrain; swimming pool construction Bahrain |
| Transactional | quote / consultation / Sitra contact / WhatsApp (no `wa.me` today) |
| Informational | what is hybrid grass; how SubAir pitch drainage works |

---

## 9. Local SEO and trust findings

### 9.1 NAP consistency

| Element | Values found | Consistent? |
| ------- | ------------ | ----------- |
| Name | Fast N Safe / FAST & SAFE / Fast & Safe Maintenance Services / Fast & Safe Construction | **No** |
| Address | “Sitra, Kingdom of Bahrain” only; map query is the same string | Area-level only; **no street, block, or building** |
| Phone | `+973 77912500` / `+973 7791 2500` and `+973 39354111` / `+973 3935 4111` | Same numbers, different spacing **Confirmed** |
| Email (UI) | `info@fsmsbh.com` (footer + map) | Yes in UI |
| Email (constants) | `fastsafecontracting@gmail.com` | **Conflicts** with UI; not shown in live `innerText` |
| Email (EmailJS comments) | `fastnsafe321@gmail.com` | Third address in source comments |
| Website | `https://www.fsmsbh.com` | Matches live host |
| WhatsApp | Form option only; **no `wa.me` link** | Confirmed |
| Hours | Map: Sunday–Thursday 08:00–17:00 AST; “estimating units remain on standby” | On-site only; **Not tested** vs GBP |
| Social | Instagram/Facebook/LinkedIn/YouTube `href="#"` | Placeholders |
| GBP | No embed or “Find us on Google” profile URL | **Not tested** / not linked |
| CR | 33626-6 ACTIVE | **Not tested** externally |
| ISO | 9001 / 14001 / 45001 | **Not tested** externally |

### 9.2 Service area

Form locations: Manama, Riffa, Amwaj Islands, Sitra, Muharraq, Saar/Janabiya, Seef, Hamad Town/Isa Town, Zallaq, Hidd, Other Region (Bahrain). Footer: “serving the entire region” — **region beyond Bahrain is unspecified**. Do not claim GCC-wide coverage.

### 9.3 Trust and credentials (on-site claims)

| Claim | Where | Verification |
| ----- | ----- | ------------ |
| 16 years / founded 2010 | constants, hero, footer | Internal consistency only |
| 75% repeat customers | About stats | **Unsupported** |
| ZERO ACCIDENTS | About | **Unsupported** |
| 40+ pitches serviced | Hero bullets | **Unsupported** |
| 105m × 68m delivered | Hero | Dimension claim; not a project citation |
| GSA Project Partner | Hero | GSA appears in public tenders as General Sports Authority; **partnership Not tested** |
| FIFA Quality Pro / FIFA Quality Programme | Hybrid, expertise features, `#services` disclaimer | **Unsupported** in repo |
| World Rugby, FIH | `#services` disclaimer | **Unsupported** |
| “leading certified partner of original global sports tech” | Hybrid | **Unsupported — high-risk wording** |
| DrainTalent™, FS-Grass®, FS-GRASS SPORTS SHIELD® | Marketing names | Trademark ownership **Not tested** |
| OSHAS accountability | Process copy | Spelling/standard unclear; **Unsupported** |
| Sitra & Manama engineering divisions | Process step 01 | Second office **not** in NAP |

### 9.4 Conversion paths

Helpful: `tel:`, `mailto:`, consultation modal, map “Open in Google Maps”.  
Weak: no WhatsApp click-to-chat; social dead; add/delete project UI on a marketing page; consultation photos/camera in `App.tsx` unused by the live modal.

External directory consistency: **Not tested**.

---

## 10. Structured data and AI search readiness

### 10.1 JSON-LD

**None** in `index.html`, `src/`, or the live rendered document (`jsonldCount: 0`).

Suitable **future** types **only if visible content supports them:**

| Type | Eligible to *mark up* if accurate? | Google rich result? |
| ---- | --------------------------------- | ------------------- |
| Organization | Yes, after name/NAP lock | Logo/knowledge features are eligibility-based, not guaranteed |
| LocalBusiness (or a more specific subtype) | Only with a real address/area you will stand behind | Local rich results are **not** created merely by adding JSON-LD |
| Service | Possible per confirmed service | **No** special “Service rich result” should be assumed |
| BreadcrumbList | Only after real URL hierarchy exists | Breadcrumb rich result possible if URLs exist |
| FAQPage | Only for visible FAQs that are not created for spam | Commercial FAQ rich results are restricted; do not assume eligibility |
| Review / AggregateRating | **Do not** add without collected, policy-compliant reviews | |

Do not mark FIFA/ISO/CR in schema until documents exist. Do not invent `geo` coordinates from a city-level map query.

### 10.2 AI / answer readiness (no AI visibility score)

Public content **does** answer, at a high level: sports construction in Bahrain; hybrid and SubAir explanations; seven service names; how to request a consultation.

It is **weak** on: exact street location; who is authorized to specify FIFA/World Rugby/FIH; which hybrid/SubAir product is licensed; prices; warranties; Arabic; crawlable per-service Q&A.

`llms.txt` 404 is **not** a Google requirement and is not an issue by itself.

---

## 11. Actual Lighthouse results and evidence locations

**Tool:** Lighthouse **13.4.1** (npx)  
**Chrome:** HeadlessChrome / Chrome 152 (mobile emulation: Android 11 moto g power, 412×823, 1.75 DPR)  
**Throttling:** `simulate`  
**Date:** 14 September 2026  
**URL tested:** `https://www.fsmsbh.com/` only (the only intended indexable page)  
**Both runs warned:** “The page loaded too slowly to finish within the time limit. Results may be incomplete.”  
**CLI cleanup:** `EPERM` on temp-profile delete; **JSON/HTML reports were still written.**

**These are lab navigation scores, not field Core Web Vitals. INP was not measured as a field metric.**

| Form factor | SEO | Performance | Accessibility | Best Practices | FCP | LCP | TBT | CLS | SI | TTI | Evidence |
| ----------- | --: | ----------: | ------------: | -------------: | --- | --- | --- | --- | -- | --- | -------- |
| Mobile | **91** | **90** | **88** | **96** | 2.1 s | 2.1 s | 250 ms | 0.011 | 4.5 s | 5.6 s | `seo-audit-evidence/lighthouse-prod-mobile.report.*` |
| Desktop | **91** | **92** | **94** | **96** | 0.5 s | 1.6 s | 0 ms | 0.02 | 1.8 s | 1.6 s | `seo-audit-evidence/lighthouse-prod-desktop.report.*` |

Local preview Lighthouse: **Not tested.**  
Other URLs: **Not tested** (they 404 or are not pages).  
Field CrUX / Search Console CWV: **Not tested.**

### 11.1 How to read the SEO 91

Lighthouse SEO **failed only** `meta-description`.  
`document-title`, `is-crawlable`, `http-status-code`, `image-alt`, `link-text`, `crawlable-anchors` **passed**.  
`robots-txt` and `canonical` were **notApplicable**.  
`structured-data` is **manual**.

**Lighthouse SEO 100 on this URL is mostly “add a meta description” (and keep the existing title/viewport/https).** That would **not** create service-page rankings, a sitemap, or AI citations.

### 11.2 Performance caveats (do not treat 90/92 as a clean bill of health)

Same runs also recorded:

- **Total payload 37,210 KiB** (`total-byte-weight` score 0.5)
- Image delivery insight: estimated **6,542 KiB** savings (mobile)
- Unused JS ~**80 KiB** in the main bundle
- Mobile diagnostics: JS execution **9.0 s**, main-thread work **72.6 s** (treat as incomplete-run diagnostics, not a field INP)
- Live Resource Timing (separate from Lighthouse): ~**35.5 MB** image transfer; largest project PNGs **~2.0–3.5 MB each** (`Img 9.png`, `najma6.png`, `Maamer 1.png`, `isa1.png`, …)
- JS transferred ~**238 KB** gzip (837 KB decoded); CSS ~**14 KB** gzip
- **0** lazy-loaded images in the live DOM
- Hero LCP candidate is a full-bleed PNG (~958 KB file; displayed ~1349×977 in the audit browser)
- System fonts only (`src/index.css` has no `@font-face`)

Incomplete Lighthouse LCP (mobile LCP = FCP = 2.1 s) is **likely understating** image-heavy LCP. Do not publish “LCP is 2.1 s” as a field or fully trusted lab result.

### 11.3 Accessibility / Best Practices (lab)

Mobile a11y fails: `button-name`, `color-contrast`, `heading-order`, `label-content-name-mismatch`.  
Desktop a11y fails: `color-contrast`, `heading-order`, `label-content-name-mismatch`.  
Best Practices fails: favicon **404** console error; missing source maps.

### 11.4 TypeScript / bundle

- `tsc` error blocks a clean `npm run lint` even after the `F&S` path issue.
- Vite warns the main chunk is larger than 500 kB.
- Local dist contains Firebase config **and** EmailJS public credentials (`service_zrbhuxk`, `template_xil9rb2`, `NYxz7kHn0sMp0ntIy`).
- `@google/genai` was **not** found in the built bundle (tree-shaken / unused). Unused **rendered** showcases are still **imported**, so their code can still ship.

---

## 12. Prioritized issue register

| ID | Pri | Status | Affected URL/file | Evidence | Impact | Recommended fix (not implemented) | Visible-design impact | Dependencies | Acceptance check |
| -- | --- | ------ | ----------------- | -------- | ------ | --------------------------------- | --------------------- | ------------ | ---------------- |
| P0-01 | P0 | Confirmed | `/` `index.html` | 397-byte shell; no business HTML | Weak first crawl/snippet; scrapers see only `Fast N Safe` | After URL plan: prerender or equivalent HTML for public URLs | None if markup matches current UI | Phase 1 URL list; host | View-source of `/` contains H1 + service summary |
| P0-02 | P0 | Confirmed | Entire site IA | One HTTP URL; services in hashes/modals | Cannot target distinct commercial intents | Add real routes only for **approved** services | Requires new pages; **must preserve current visual language** | Phase 1 keywords + copy review | Each approved service has unique URL, title, H1 |
| P0-03 | P0 | Confirmed | Production `/robots.txt`, `/sitemap.xml` | Live 404 | No sitemap discovery; no crawl policy | Add accurate `robots.txt` + sitemap of **canonical** URLs only | None | Canonical host lock | 200 + sitemap lists only 200 canonicals |
| P0-04 | P0 | Confirmed | Head tags | No description/canonical/OG | Lighthouse SEO 91; poor snippet/share | Add unique description + absolute canonical `https://www.fsmsbh.com/` | None (head only) | Approved homepage wording | Lighthouse SEO 100 **and** view-source matches |
| P0-05 | P0 | Potential | Claims (FIFA, ISO, GSA, CR, “leading partner”) | On-site text; no certificates in repo | Policy/trust risk if marked up or titled | Validate or qualify wording **before** titles/schema | Possible text wrap if wording changes | Owner documents | No unsupported certification in title/schema |
| P1-01 | P1 | Confirmed | Brand strings | Title vs FAST & SAFE vs Construction vs Gmail vs info@ | Entity confusion | Lock one public name + emails + phones | Low if only head/footer strings change — **review wrap** | Owner | One name/NAP everywhere public |
| P1-02 | P1 | Confirmed | Expertise/project modals | Live click; hash unchanged | Deep copy not URL-addressable | Move summaries on-page; keep galleries in-page or dedicated URLs | Medium — layout must be designed, not stuffed | Phase 2 routes | Specs readable with JS disabled or in prerender |
| P1-03 | P1 | Confirmed | `#services` artificial tab | CDP `innerText` missing those four systems | Crawlers may miss artificial modules | Render all system names + one-sentence summaries in HTML | Low if collapsed visually | Copy approval | All 8 system names in view-source/prerender |
| P1-04 | P1 | Confirmed | `/index.html` 200 | curl | Duplicate homepage | Redirect `index.html` → `/` | None | Vercel redirects | `index.html` 301/308 to `/` |
| P1-05 | P1 | Confirmed | HTTP apex | Two 308 hops | Minor extra hop | Apex HTTP → HTTPS www in one hop | None | DNS/Vercel | Single 308/301 to www HTTPS |
| P1-06 | P1 | Confirmed | Footer social | `href="#"` | Fake social signals; crawl loops to `/#` | Real profile URLs or remove icons | Low | Owner profiles | No `#` social links |
| P1-07 | P1 | Confirmed | Projects UI | Add/Delete on live page | Unprofessional; localStorage divergence | Remove public add/delete from marketing build | **Yes** — controls disappear (functionality change, not colors) | Owner | Visitors cannot delete cards |
| P1-08 | P1 | Confirmed | `useLocalStorage` | `hooks/index.ts` | Public project/service list can drift | Source data as the public default; persist only in an admin tool | None if cards stay the same | CMS decision | Fresh browser matches `projects.ts` |
| P1-09 | P1 | Confirmed | Images | 37,210 KiB LH; 2–3.5 MB PNGs | CWV / crawl waste / incomplete LH | Compress, modern formats, responsive `srcset`; lazy below-fold; **eager LCP only** | Should look the same if quality is checked | Phase 5; visual QA | Payload drop without layout change |
| P1-10 | P1 | Confirmed | Favicon | 404 + LH console error | Best Practices fail; weak SERP brand | Add favicon + apple-touch | Browser tab icon only | Brand asset | 200 favicon; LH console clean |
| P1-11 | P1 | Confirmed | Hero H1 rotation | 3 competing H1s | Unstable main heading | One stable H1 (brand + category); slides as H2/p | **Yes** — heading text/hierarchy; needs review | Phase 1 + design | Single persistent H1 in DOM |
| P1-12 | P1 | Confirmed | Footer vs form vs expertise | Landscape/interior/geothermal/hybrid/SubAir/carpentry mismatches | Misleading inventory | Align lists with confirmed services | Text-only; wrap review | Phase 1 | Footer = form = expertise |
| P1-13 | P1 | Confirmed | Map address | “Sitra, Kingdom of Bahrain” iframe | Weak local pack signal | Real address if one exists; do not fake a pin | Map/sidebar text | Owner | GBP + site + schema match |
| P1-14 | P1 | Confirmed | `tsc` + npm `&` path | `App.tsx:505`; npm lint path | Hygiene; CI risk | Fix types; invoke tsc without broken npm shim | None | — | `tsc --noEmit` exits 0 |
| P1-15 | P1 | Confirmed | Click-only CTAs | Hero/SubAir buttons | Weaker link graph | Use `<a href="#contact">` where it only scrolls | None if styled identically | — | Primary CTAs have `href` |
| P2-01 | P2 | Confirmed | Unused imports | `FencingShowcase`, `NaturalGrassShowcase` | Extra JS | Stop importing unused modules | None (not mounted) | Bundle budget | Chunk size drops; UI unchanged |
| P2-02 | P2 | Confirmed | Double Firebase + EmailJS keys in bundle | `firebase.ts` + modal | Extra connection; key exposure | One Firebase init; treat EmailJS key as public-by-design | None | Security review | Single `testConnection` or none |
| P2-03 | P2 | Confirmed | OG/Twitter | Missing | Weak social/AI link unfurl | Add after titles approved | None | Phase 3 | Card debug matches title/desc/image |
| P2-04 | P2 | Confirmed | Schema absent | CDP | Missed entity clarity | Organization/LocalBusiness **after** NAP lock | None | Phase 4 | Rich Results test: valid, matches visible text |
| P2-05 | P2 | Confirmed | `#about` orphan | Not in `NAV_LINKS` | Weaker internal discovery | Optional nav or footer About link | Small nav change | Design | About reachable via `href` |
| P2-06 | P2 | Confirmed | Thin project blurbs | 8 identical desc | Weak unique snippets | Unique one-line outcomes per club | Card text wrap | Copy review | No duplicated desc |
| P2-07 | P2 | Confirmed | Heading order / contrast | LH a11y | A11y + semantic outline | Fix heading levels; contrast **without** rebranding if possible | Possible color/type tweaks — **review** | Design | LH a11y heading-order pass |
| P2-08 | P2 | Confirmed | No WhatsApp `wa.me` | Form only | Missed local CTA | Add if that number is WhatsApp | New control — **review** | Owner | Link uses official number |
| P2-09 | P2 | Confirmed | Analytics / GSC | Absent | Cannot measure queries | GSC + one analytics property | None | Accounts | GSC property on www |
| P2-10 | P2 | Potential | Motion opacity-0 | `whileInView` | Hidden bullets if JS/animation fail | Ensure content visible without animation | None if fallback visible | — | Content visible with reduced motion |
| P2-11 | P2 | Confirmed | Unused npm deps | package.json | Noise; future bundle risk | Remove only when packaging is in scope | None | Lockfile change later | No unused runtime imports |
| P3-01 | P3 | Confirmed | `llms.txt` 404 | curl | Irrelevant to Google | Ignore unless you want a voluntary file | None | — | N/A |
| P3-02 | P3 | Confirmed | Source maps missing | LH BP | Debug only | Optional prod maps | None | — | Optional |
| P3-03 | P3 | Confirmed | Package name `react-example` | package.json | Hygiene | Rename package when convenient | None | — | — |
| P3-04 | P3 | Not tested | Arabic pages | No `ar` routes | Possible missed demand | Only if you will maintain translations | High (new UI) | Phase 1 | Real `hreflang` pairs only |

---

## 13. Proposed implementation phases (plan only)

**Keyword research/approval comes first.** Technical blockers that stop those keywords from working as intended: **P0-01, P0-02, P0-03, P0-04** (CSR shell, one URL, no robots/sitemap/canonical/description). Do not expect new titles on `/` alone to rank for seven services.

### Phase 1 — Validate services and select keyword targets

| | |
| --- | --- |
| **Goal** | Freeze the public service list, claims that may be used in titles/schema, and one primary intent per future URL. |
| **Exact scope/files** | Review only: `src/data/expertise.ts`, `src/data/projects.ts`, `src/constants/index.ts`, `Footer.tsx`, `HeroCarousel.tsx`, `PremiumPitchesTech.tsx`, this audit §4 and §8. **No code edits.** |
| **Dependencies** | Owner answers in §14 |
| **Design safeguard** | No UI changes |
| **Acceptance** | Written yes/no per service; approved primary keyword per existing `/` and per proposed URL; banned claims list |
| **Rollback** | N/A (document only) |

### Phase 2 — Crawlability, rendering, routes, indexing foundations

| | |
| --- | --- |
| **Goal** | Give approved pages real URLs, first-HTML content, robots/sitemap, host redirects, and noindex rules for previews. |
| **Exact scope/files** | `index.html`; new route module (only if approved); `vite.config.ts` prerender **if chosen**; new `public/robots.txt`, `public/sitemap.xml`; Vercel redirects (`index.html` → `/`); **not** a framework migration |
| **Dependencies** | Phase 1 URL set; decision on prerender vs stay CSR |
| **Design safeguard** | Reuse existing components/visuals; no new marketing look |
| **Acceptance** | Approved URLs 200; view-source contains main copy; unknown paths 404 or intentional rewrite (documented); robots/sitemap 200; www canonical |
| **Rollback** | Revert route/prerender files; Vercel redirect rollback |

### Phase 3 — Approved titles, descriptions, semantics, internal links

| | |
| --- | --- |
| **Goal** | Unique title/description/H1 per approved URL; real `href`s; heading outline. |
| **Exact scope/files** | Head manager or `index.html` + per-route meta; `Navbar.tsx`, `Footer.tsx`, hero CTA buttons; heading tags in section components |
| **Dependencies** | Phase 1 copy; Phase 2 URLs |
| **Design safeguard** | Present every visible string for wrap/layout review before merge |
| **Acceptance** | Lighthouse SEO 100 on each **intended indexable** URL; titles match map; no `href="#"` socials |
| **Rollback** | Revert head/nav/footer strings |

### Phase 4 — Approved service wording, local signals, structured data

| | |
| --- | --- |
| **Goal** | On-page service answers + consistent NAP + schema that matches visible text. |
| **Exact scope/files** | Approved section copy; `SitraMap.tsx` / footer NAP; JSON-LD component |
| **Dependencies** | Validated address/ISO/CR/FIFA; Phase 3 |
| **Design safeguard** | Copy review; no keyword stuffing or hidden text |
| **Acceptance** | Schema validates; matches page; no unsupported props; footer = expertise = form |
| **Rollback** | Remove JSON-LD; restore copy |

### Phase 5 — Measured performance, preserve design

| | |
| --- | --- |
| **Goal** | Cut the measured 37 MB homepage payload and unused JS without visual redesign. |
| **Exact scope/files** | Image pipeline (`src/assets/images`, `getImgUrl`); lazy-load below-fold; drop unused showcase imports; optional code-split SubAir audio |
| **Dependencies** | Visual QA of compressed images; Lighthouse re-run |
| **Design safeguard** | Side-by-side screenshots of hero, hybrid, projects |
| **Acceptance** | New LH JSON stored; payload down; layout/colors unchanged; LCP image not lazy |
| **Rollback** | Restore original images/imports |

### Phase 6 — Release validation and monitoring

| | |
| --- | --- |
| **Goal** | Confirm production headers, GSC, sitemap fetch, and no accidental noindex. |
| **Exact scope/files** | Production curls; GSC property; optional analytics |
| **Dependencies** | Deploy access; GSC verification |
| **Design safeguard** | None |
| **Acceptance** | Live view-source = intended; GSC coverage sane; preview hosts not indexed |
| **Rollback** | Revert deploy |

---

## 14. Outstanding questions and unavailable external checks

### 14.1 Information needed from you (blocks Phase 1)

1. **Legal / public name** to use everywhere: Fast & Safe Maintenance Services vs Fast N Safe vs Fast & Safe Construction vs other.  
2. **Which services are actively sold** among: artificial grass, natural grass, hybrid, SubAir, DrainTalent, geothermal, maintenance contracts, fencing, building/turnkey, pools, horse walkers, carpentry, landscape/irrigation, interior fit-out, sports flooring.  
3. **May we use** FIFA Quality Pro, World Rugby, FIH, GSA partner, ISO 9001/14001/45001, CR 33626-6, 75% repeat, zero accidents, 40+ pitches, “leading certified partner,” FS-Grass® / DrainTalent™ in public text? Please supply certificate numbers or say **do not use**.  
4. **Which hybrid/SubAir product** you install (own brand vs third-party licensee).  
5. **Grass species** you actually install (site: Bermuda hybrid; public Bahrain tenders often say Paspalum).  
6. **Canonical phones, WhatsApp number, emails** (resolve `info@fsmsbh.com` vs `fastsafecontracting@gmail.com` vs `fastnsafe321@gmail.com`).  
7. **Street address**, Google Business Profile URL, and whether Sunday–Thursday 08:00–17:00 is official.  
8. **Real social profile URLs** or permission to remove icons.  
9. **Are public Add/Delete project controls intentional?**  
10. **Should Phase 2 add multi-page URLs**, or only strengthen the single homepage?  
11. **Arabic pages:** yes / later / never.  
12. **Search Console / Analytics / GBP access** for later measurement (not required to start Phase 1).

### 14.2 External checks still unavailable

| Check | Why |
| ----- | --- |
| Google index / `site:fsmsbh.com` | Search tool empty; Google UI captcha |
| Query volumes, CPC, difficulty, traffic | No Keyword Planner / third-party rank API |
| Rankings / backlinks | Not connected |
| Field LCP/INP/CLS (CrUX) | Not connected |
| GSC coverage, sitemap, enhancements | No property access |
| GBP, reviews, categories, hours | No account / no on-site profile link |
| Sijilat CR 33626-6 | Not queried |
| ISO registrar / FIFA licensee lists | Not queried |
| Preview `*.vercel.app` hosts | Not discovered |
| Local `vite preview` Lighthouse | Not run |
| Live INP | Not a click-trace study |

---

**End of Phase 0.** No fixes were implemented. Next step requires your explicit authorization, starting with Phase 1 service/keyword validation.
