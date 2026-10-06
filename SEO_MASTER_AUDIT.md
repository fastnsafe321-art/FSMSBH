# FASTSAFE BAHRAIN — COMPLETE SEO / AEO / TECHNICAL SEO AUDIT

**Project:** Fast & Safe Maintenance Services (website brand variants listed below)  
**Repository:** `C:\Users\DELL\Desktop\F&S\fastNsafe\fastNsafe`  
**Remote:** `https://github.com/SID-CJ/fastNsafe.git` (`main` @ `2257364`)  
**Verified production host:** `https://www.fsmsbh.com/`  
**Audit date:** 14 September 2026  
**Auditor role:** Technical SEO / AEO / React–Vite inspection only  
**Scope:** Inspection, research, analysis, and planning. **No website code, design, routing, packages, Firebase, or content was modified** except creation of this report.

**This is an audit score and opportunity map, not a ranking, traffic, or Lighthouse guarantee.**  
Field rankings, Search Console data, Keyword Planner volumes, CPC, difficulty, backlinks, and CrUX/PageSpeed field metrics were **not connected**. Those items are marked `Not verified` or `External validation required`.

---

## 1. Executive Summary

The live site is a **single-page, client-side-rendered React 19 + Vite 6 application** deployed on **Vercel**. Production raw HTML is **397 bytes**, contains only `lang="en"`, a viewport tag, the title `Fast N Safe`, one JS bundle, one CSS file, and an empty `#root`. There is **no** `robots.txt`, **no** `sitemap.xml`, **no** favicon, **no** web manifest, **no** canonical, **no** meta description, **no** Open Graph / Twitter tags, and **no** JSON-LD.

Googlebot *can* render JavaScript on the homepage, so the page is not automatically invisible. It is still a weak technical foundation for:

- Lighthouse SEO 100/100
- unique service-keyword ranking
- Bing and AI-answer citation
- crawlable deep links
- Core Web Vitals

**Architecture fact:** there is **one indexable URL**. Navigation uses hash fragments (`#hybridgrass`, `#services`, `#contact`). Service specifications, installation steps, galleries, and project details open in **modals** or **React state tabs**. Those are not standalone crawlable landing pages.

**Business fact (from site copy only):** the company presents as a Sitra, Bahrain construction / sports-facility contractor offering artificial grass, natural grass, hybrid grass, SubAir systems, fencing, building construction, swimming pools, horse walkers, and carpentry. Several high-authority claims (FIFA Quality Pro, World Rugby, FIH, “leading certified partner”, GSA partner, zero accidents, 75% repeat customers) appear **without certificate numbers, documents, or third-party proof in the repo**. Treat them as **unverified marketing claims** until substantiated.

**Overall SEO readiness: 29/100** (audit score, not a ranking prediction).

| Item | Count |
| ---- | ----: |
| Existing indexable pages (unique HTTP URLs) | 1 |
| Hash/section views (not separate indexable pages) | 8 |
| Core services with dedicated expertise records | 7 |
| Additional evidenced service lines (sections/footer) | 4 |
| Recommended SEO landing pages | 14 |
| P0 issues | 5 |
| P1 issues | 24 |
| P2 issues | 20 |
| P3 issues | 12 |

**Highest-priority findings**

1. Production HTML is an empty CSR shell (`Fast N Safe` + `#root`).
2. Only `/` is indexable; commercial services have no unique URLs, titles, or H1s.
3. The richest service and project copy lives in modals, tabs, and hover/JS state.
4. Production returns **404** for `robots.txt`, `sitemap.xml`, favicon, manifest, and every non-root path.
5. Brand/NAP identity is inconsistent, and several certification claims are unsubstantiated.

**Recommended next phase:** Phase 1 — Technical SEO foundation (metadata infrastructure, robots, sitemap, canonical hostname, prerender/SSR decision, Vercel fallback). Do not redesign.

---

## 2. Website Architecture

### 2.1 Stack (verified from `package.json`, `vite.config.ts`, `src/main.tsx`)

| Layer | Evidence | SEO relevance |
| ----- | -------- | ------------- |
| TypeScript ~5.8 | `package.json` `typescript: ~5.8.2` | Neutral |
| React 19 | `react` / `react-dom` `^19.0.1` | CSR default |
| Vite 6 | `vite: ^6.2.3` | Static `index.html` + client bundle |
| Tailwind 4 + `@tailwindcss/vite` | `src/index.css` `@import "tailwindcss"` | CSS-in-build; no extra font files |
| Motion | `motion/react` in hero, nav, showcases | INP / main-thread cost |
| Lucide React | icons | Decorative unless labeled |
| Firebase Firestore | `src/firebase.ts`, `ConsultationModal.tsx` | Form only; not content CMS |
| localStorage | `useLocalStorage('fast_safe_projects' / 'fast_safe_expertise')` | Public content can diverge from source data |
| Vercel | Production `Server: Vercel` header | Live host |
| GitHub Pages comments | `vite.config.ts` asset-sync comment | **Not verified** as a live host |

**Unused for the live frontend (do not treat as SEO factors unless later wired):**

- `@google/genai` — no `src/` import
- `express`, `dotenv` — no `src/` import
- `process.env.GEMINI_API_KEY` injected in `vite.config.ts` but unused in app code
- `FencingShowcase.tsx` and `NaturalGrassShowcase.tsx` are **imported in `src/App.tsx` but never rendered**

### 2.2 Render tree (actual homepage)

`src/main.tsx` → `createRoot(...).render(<App />)` → `src/App.tsx` composes:

1. `Navbar` — hash nav + consultation **button**
2. `HeroCarousel` — 3 rotating slides, **one H1 at a time**
3. `HybridGrassShowcase` — `#hybridgrass`
4. `SubAirVentShowcase` — `#sub-air-system`
5. `AboutSection` — `#about` (not in primary nav)
6. `PremiumPitchesTech` wrapped as `#services`
7. `ExpertiseSection` — `#expertise` cards → `ExpertiseDetailsModal`
8. `ProjectsSection` — `#projects` cards → `ProjectDetailsModal` + public Add/Delete
9. Inline `#safety` ISO section
10. `SitraMap` — `#office-location`
11. `Footer` — `#contact`
12. Modals: expertise, project, consultation

**No React Router. No Helmet. No `document.title` updates. No file-based pages.**

### 2.3 Deployment architecture (verified)

| Check | Result | Evidence |
| ----- | ------ | -------- |
| Host | Vercel | `Server: Vercel`, `X-Vercel-Id` |
| Canonical host behavior | Apex `https://fsmsbh.com` → **308** → `https://www.fsmsbh.com/` | `curl -sI https://fsmsbh.com` |
| HTTP → HTTPS | `http://www.fsmsbh.com` → **308** → `https://www.fsmsbh.com/` | curl |
| HSTS | `Strict-Transport-Security: max-age=63072000` | curl |
| SPA fallback | **None.** `/services/artificial-grass` → **404** `X-Vercel-Error: NOT_FOUND` | curl |
| `vercel.json` in repo | **Absent** | glob |
| GitHub Pages config | **Absent** (no `.github/`, no `404.html`, Vite `base` not set) | repo inventory |
| Raw HTML size | **397 bytes** | `Content-Length: 397` |
| JS bundle | `/assets/index-CNlKet0d.js` **837,094 bytes** (~817 KB) | production header |
| CSS | `/assets/index-BVXGzQw9.css` **92,701 bytes** | production header |

---

## 3. Complete URL / Page Inventory

**Conclusion: this is a one-page React SPA.** Hash fragments change scroll position, not the HTTP URL. They are **not** independent indexable pages.

| URL / Route | Page Name | Page Type | Primary Purpose | Main Content | SEO Importance | Current Indexability |
| ----------- | --------- | --------- | --------------- | ------------ | -------------- | -------------------- |
| `https://www.fsmsbh.com/` | Homepage (entire site) | Marketing SPA | Rank + convert for all topics | Hero, hybrid, SubAir, about, pitch tech, expertise, projects, safety, map, footer | Critical | Conditionally indexable after JS; thin without JS |
| `https://fsmsbh.com/` | Apex homepage | Redirect | Canonicalization | 308 to www | Critical | Redirects; do not index apex |
| `/#` or `/#/` | Home hash | Same page | Nav “HOME” | Same DOM | Low | Duplicate of `/` if indexed |
| `/#hybridgrass` | Hybrid Grass section | In-page section | Product education | Hybridgrass explainer | High (should be a page) | Not a unique URL |
| `/#sub-air-system` | SubAir section | In-page section | Product education | SubAir simulator + copy | High (should be a page) | Not a unique URL |
| `/#services` | Pitch technologies | In-page section | Tech comparison | Tabbed natural/artificial systems | High | Not a unique URL |
| `/#expertise` | Expertise grid | In-page section | Service list | 7 service cards | High | Card titles in DOM; details in modal |
| `/#projects` | Projects | In-page section | Proof | 15 project cards | High | Card teasers in DOM; details in modal |
| `/#safety` | Safety / ISO | In-page section | Trust | ISO copy | Medium | Section only |
| `/#contact` | Footer contact | In-page section | Conversion / NAP | Address, phones, email | High | Section only |
| `/#about` | About | In-page section | Entity | Company blurb + ISO | High | **Not linked in `NAV_LINKS`** |
| `/#office-location` | Sitra map | In-page section | Local | Hours, map iframe | Medium | Not in primary nav |
| `/#project-cycle` | Project cycle | In-page fragment | Process | 4 steps inside `#services` | Low | Orphan hash |
| Modal: expertise | Service detail | Overlay | Deep service copy | Specs, steps, gallery, cases | High | **Not URL-addressable** |
| Modal: project | Project detail | Overlay | Case detail | Details + gallery | High | **Not URL-addressable** |
| Modal: consultation | Quote form | Overlay | Lead capture | Form | Conversion only | Should stay noindex |
| `/robots.txt` | Robots | Technical | Crawl rules | Missing | Critical | **404** |
| `/sitemap.xml` | Sitemap | Technical | Discovery | Missing | Critical | **404** |
| `/manifest.json` | PWA manifest | Technical | — | Missing | Low | **404** |
| `/favicon.ico` | Favicon | Technical | Brand SERP | Missing | Medium | **404** |
| Any other path e.g. `/about` | — | — | — | Vercel NOT_FOUND | High if added later | **Hard 404** |

**Hidden / unused / obsolete**

| Item | Status | Evidence |
| ---- | ------ | -------- |
| `FencingShowcase` | Imported, **not rendered** | `src/App.tsx` lines 26–27; no JSX usage |
| `NaturalGrassShowcase` | Imported, **not rendered** | same |
| `isAddProjectOpen` / `handleCreateNewProject` | State exists; **no Add Project modal component** | `App.tsx`; button still shown |
| `AddProjectModal` | Documented as TODO only | `ARCHITECTURE_GUIDE.md`, `REFACTORING_GUIDE.md` |
| Legal / FAQ / blog / industry routes | **Do not exist** | repo + production 404s |

**Service uniqueness check (current)**

| Property | Unique per service? |
| -------- | ------------------- |
| Unique route | No |
| Unique URL | No |
| Unique `<title>` | No (global `Fast N Safe`) |
| Unique H1 | No (homepage carousel H1 only) |
| Unique metadata | No |
| Crawlable on-page summary | Partial (card title + hover description) |
| Full specs / process | Modal / tab only |

---

## 4. Complete Service Inventory

Services below are taken **only** from repository copy. Nothing was invented.

| Service | Existing Page/Section | Current URL | Evidence | Search Intent | SEO Opportunity | Dedicated Landing Page Needed? |
| ------- | --------------------- | ----------- | -------- | ------------- | --------------- | ------------------------------ |
| Artificial grass / synthetic turf installation | Expertise card + hero slide 2 + `#services` artificial tabs | `/` + modal | `src/data/expertise.ts` “ARTIFICIAL GRASS INSTALLATION”; `HeroCarousel` slide 2; `PremiumPitchesTech` `ARTIFICIAL_SYSTEMS` | Commercial | **Highest** — many named club replacements | **Yes** |
| Natural grass pitch installation | Expertise card + hero slides 1 & 3 | `/` + modal | `expertise.ts`; hero copy | Commercial | High | **Yes** |
| Hybrid grass / Hybridgrass / FS-Grass hybrid stitching | `#hybridgrass` + `#services` hybrid module | `/#hybridgrass` | `HybridGrassShowcase.tsx`; `NATURAL_SYSTEMS[0]` | Commercial / investigational | High, distinct from 100% natural or 100% artificial | **Yes** |
| SubAir / subsurface aeration & vacuum drainage | `#sub-air-system` + `#services` Sub-Air / DrainTalent modules | `/#sub-air-system` | `SubAirVentShowcase.tsx`; `PremiumPitchesTech` | Commercial / technical | High, specialized | **Yes** |
| Geothermal / root-zone heating | `#services` “Natural Grass - Geothermal Control” + footer line | `/#services` (tab) | `PremiumPitchesTech.tsx` `heating`; Footer “Geothermal Sports Turf Systems” | Commercial / niche | Medium — thin vs other systems | **Later**, only if offering is confirmed |
| DrainTalent™ vacuum extraction | `#services` tab | `/#services` | `PremiumPitchesTech.tsx` `drainage` | Technical commercial | Medium; likely supporting content on SubAir/natural page | No separate doorway; merge |
| Sports pitch maintenance / grooming | `#services` step “FASTSAFE MAINTAIN” | `/#project-cycle` | `SINGLE_SOURCE_STEPS[3]` | Commercial | Medium | Supporting section first |
| Fencing works | Expertise card | `/` + modal | `expertise.ts` FENCING WORKS; unused `FencingShowcase.tsx` has extra depth | Commercial | High | **Yes** |
| Building / civil / turnkey construction | Expertise card + projects | `/` + modal | `expertise.ts`; Hoora / North Sehla projects | Commercial | High | **Yes** |
| Horse walker / equine systems | Expertise card + Rashid project | `/` + modal | `expertise.ts`; `projects.ts` Rashid Equestrian Club | Commercial niche | Medium–high in Bahrain equine market | **Yes** |
| Swimming pool construction | Expertise card + Amwaj project | `/` + modal | `expertise.ts`; project id 6 | Commercial | High | **Yes** |
| Carpentry & wood works | Expertise card | `/` + modal | `expertise.ts` last item | Commercial | Medium | **Yes** (thinner than turf) |
| Landscape & irrigation | Footer list only | none | `Footer.tsx` “Landscape & Irrigation”; hero mentions irrigation | Commercial | Unclear | **Not yet** — insufficient body copy |
| Interior fit out | Footer list only | none | `Footer.tsx` “Interior Fit Out Works” | Commercial | Unclear | **Not yet** |
| Sports flooring | Hero sentence only | none | `HeroCarousel` slide 1 “sports flooring and irrigation” | Commercial | Unclear | **Not yet** |
| Scaffolding (capability mention) | `#safety` bullet | none | `App.tsx` “Certified Scaffolding Dept.” | Supporting | Low | No |
| Design / CAD / soil testing | `#services` process step 01 | `/#project-cycle` | `PremiumPitchesTech` `SINGLE_SOURCE_STEPS` | Supporting | Supporting | No standalone |

**Form activities** (`src/constants/index.ts` `ACTIVITIES`) — used for leads, not pages:

- Artificial Grass Installation
- Natural Grass Installation
- Fencing Works
- Building Construction
- Horse Walker Installation
- Swimming Pool Construction
- Other / Turnkey Project

**Gaps:** Hybrid Grass, SubAir, Carpentry are **sold on-page but missing from the consultation dropdown**. Landscape, interior, geothermal, sports flooring are **named without matching form options or expertise records**.

---

## 5. Business / Search Intent Analysis

### What the company does (from on-site evidence)

A Bahrain-based construction and engineering contractor, legally styled in footer as **Fast & Safe Maintenance Services**, headquartered in **Sitra**, offering **sports-surface construction** (natural, artificial, hybrid, SubAir) plus **civil/turnkey buildings**, **pools**, **fencing**, **equine walkers**, and **carpentry**.

`metadata.json` (AI Studio leftover, not served as HTML): “Full-service Sports Construction and General Engineering company in Bahrain with 16 years of experience specializing in athletic facilities, civil works, and professional landscaping.”

### Target customers (inferred from content, not CRM data)

| Segment | Evidence | Confidence |
| ------- | -------- | ---------- |
| Ministries / public sports bodies | Repeated client “Ministry for Youth and Sports Affairs” | High |
| Football clubs / BFA-related venues | Isa Sports City, many club turf replacements | High |
| Schools | Bahrain School – Juffair | High |
| Equestrian clubs | Rashid Equestrian Club, horse walker gallery | High |
| Hospitality / private developers | Amwaj aquatic project | Medium |
| Industrial / residential fencing | Expertise fencing copy; unused fencing showcase | Medium |
| Private villas (pools) | Pool case-study wording | Medium |

**Orientation:** primarily **B2B / institutional procurement**, with some B2C (villas, compounds). Purchasing intent is **specification-led, quote-led, not e-commerce**.

### Geography

- Stated HQ: Sitra, Kingdom of Bahrain
- Form locations: Manama, Riffa, Amwaj, Sitra, Muharraq, Saar/Janabiya, Seef, Hamad Town/Isa Town, Zallaq, Hidd, Other Bahrain
- Footer: “serving the entire region” — **region beyond Bahrain not specified**. Do not claim GCC-wide delivery without confirmation.

### Differentiators claimed (verification status)

| Claim | Where | Verification |
| ----- | ----- | ------------ |
| Established 2010 / 16 years | `COMPANY_INFO`, hero, about | Internally consistent with audit year 2026; **founding documents Not verified** |
| 75% repeat customers | `COMPANY_INFO.repeatCustomerRate` | **Not verified** |
| ISO 9001 / 14001 / 45001 | About, safety, footer, CR line | **Certificate numbers / registrar Not verified** |
| CR 33626-6 — ACTIVE | Footer | **Sijilat/CR lookup Not verified** |
| FIFA Quality Pro surfaces / partner language | Hybrid, expertise, premium tech | **Not verified** |
| World Rugby & FIH criteria | `PremiumPitchesTech.tsx` | **Not verified** |
| GSA Project Partner | Hero slide 1 | **What “GSA” means here Not verified** |
| 40+ pitches serviced | Hero | **Not verified** |
| ZERO ACCIDENTS | About | **Not verified** |
| “Leading certified partner of original global sports tech” | Hybrid showcase | **Not verified — high risk claim** |
| DrainTalent™ / FS-Grass® / FS-GRASS SPORTS SHIELD® | Marketing names | Trademark ownership **Not verified** |

### Likely search classes (qualitative)

| Class | Examples (not volume-validated) | Current page fit |
| ----- | ------------------------------- | ---------------- |
| High-intent commercial | `artificial grass installation Bahrain`, `football pitch contractor Bahrain` | Homepage only — weak |
| Local | `sports construction company Sitra`, `Fast and Safe Bahrain` | Partial NAP |
| Informational | `what is hybrid grass`, `how SubAir pitch drainage works` | On-page definitions exist; not title-targeted |
| Comparison | `hybrid vs artificial turf Bahrain` | Mixed on one URL |
| Emergency / urgent | Not evidenced as emergency contractor | Do not target |

---

## 6. Current SEO Architecture

```
https://www.fsmsbh.com/     ← only indexable document
   ├─ hash sections (scroll)
   ├─ React state tabs (#services systems)
   └─ overlays (expertise / project / consultation)
```

| SEO layer | Present? | Notes |
| --------- | -------- | ----- |
| Multi-page IA | No | |
| Router | No | |
| Per-URL metadata | No | |
| Prerender / SSR / SSG | No | `createRoot` CSR only |
| robots.txt | No (404) | |
| sitemap.xml | No (404) | |
| Canonical | No | Host redirect www exists |
| Schema | No | |
| hreflang / Arabic | No | English only |
| Breadcrumbs | No | |
| Pagination | N/A | |
| Faceted/query pages | No | |
| Hash as pseudo-routing | Yes | Poor for SEO |

---

## 7. Keyword Audit

**Rule applied:** no invented monthly volume, CPC, KD, Trends, traffic, or rank numbers.

**Qualitative labels used:** High commercial relevance · Medium commercial relevance · Informational · Supporting semantic term.

### 7.1 Keyword architecture table

| Page / Proposed Page | Primary Keyword | Secondary Keywords | Long-tail | Location Intent | Search Intent | Priority |
| -------------------- | --------------- | ------------------ | --------- | --------------- | ------------- | -------- |
| `/` Homepage | sports construction company Bahrain | sports facility contractor Bahrain; Fast & Safe Maintenance Services | sports pitch construction company in Sitra Bahrain | Bahrain / Sitra | Commercial + brand | P0 |
| `/about/` | Fast & Safe Maintenance Services Bahrain | FSMS Bahrain; Fast N Safe Bahrain | Fast & Safe construction company Sitra CR 33626 | Sitra, Bahrain | Informational / brand | P1 |
| `/services/` | sports facility construction Bahrain | athletic facility contractor; turnkey sports construction Bahrain | sports engineering contractor Kingdom of Bahrain | Bahrain | Commercial hub | P1 |
| `/services/artificial-grass/` | artificial grass installation Bahrain | synthetic turf contractor; 3G pitch installation Bahrain | FIFA quality artificial turf replacement Bahrain football club | Bahrain | High commercial | P0 |
| `/services/natural-grass/` | natural grass pitch construction Bahrain | natural turf installation; sports field grass Bahrain | Bermuda grass football pitch installation Bahrain | Bahrain | High commercial | P0 |
| `/services/hybrid-grass/` | hybrid grass system Bahrain | hybrid turf installation; reinforced natural grass pitch | FIFA Quality hybridgrass installation Kingdom of Bahrain | Bahrain | High commercial | P0 |
| `/services/subair-system/` | SubAir system installation Bahrain | pitch vacuum drainage; subsurface aeration football field | SubAir turf drainage and aeration contractor Bahrain | Bahrain | High commercial | P0 |
| `/services/fencing/` | sports fencing contractor Bahrain | perimeter fencing installation; stadium netting Bahrain | football pitch fencing and safety netting Bahrain | Bahrain | High commercial | P1 |
| `/services/building-construction/` | building construction company Sitra | turnkey construction Bahrain; civil works contractor | youth centre construction contractor Bahrain | Sitra / Bahrain | High commercial | P1 |
| `/services/swimming-pools/` | swimming pool construction Bahrain | concrete pool contractor; infinity pool construction | swimming pool construction Amwaj / Bahrain villas | Bahrain | High commercial | P1 |
| `/services/horse-walkers/` | horse walker installation Bahrain | equine walker contractor; horse walker rubber floor | horse walker installation equestrian club Bahrain | Bahrain | Medium commercial | P2 |
| `/services/carpentry/` | carpentry and wood works Bahrain | custom timber decking; stable woodwork Bahrain | equestrian carpentry and paddock woodwork Bahrain | Bahrain | Medium commercial | P2 |
| `/projects/` | sports construction projects Bahrain | football pitch projects Bahrain | artificial grass replacement clubs Bahrain | Bahrain | Commercial / proof | P1 |
| `/contact/` | Fast & Safe Sitra contact | sports contractor quote Bahrain | Fast & Safe Maintenance Services phone Sitra | Sitra | Local / transactional | P1 |

**Semantic / entity terms** (use on relevant pages; not as extra title tags): Sitra, Kingdom of Bahrain, rootzone, shock pad, infill, laser grading, ISO 9001, ISO 14001, ISO 45001, Ministry of Youth and Sports Affairs, FIFA Quality Programme *(only if claim is substantiated)*, SubAir, hybrid stitching, palisade, horse walker, CR 33626-6.

### 7.2 Cannibalization and alignment problems (current single URL)

| Conflict | Why it matters |
| -------- | -------------- |
| Homepage H1 slide 1 (natural grass) vs Hybrid section vs Expertise “NATURAL GRASS” vs `#services` hybrid/natural tabs | One URL cannot be the primary result for four close intents |
| Homepage H1 slide 2 (artificial turf) vs Expertise artificial vs `#services` artificial systems | Same |
| Hybrid showcase vs `#services` “Natural Grass - Hybrid Stitching” vs unused `NaturalGrassShowcase` | Duplicate hybrid narrative |
| SubAir section vs `#services` Sub-Air vs DrainTalent vs unused NaturalGrass Sub-Air sim | Duplicate drainage narrative |
| About ISO vs `#safety` ISO vs footer ISO | Harmless component reuse **on one page**; becomes cannibalization if copied to many thin pages later |
| Eight projects with identical `desc`: “Replacement of Artificial Grass” | Weak unique snippets; project pages would need unique copy |
| Footer lists Landscape / Interior / Geothermal without pages | Orphan keyword mentions |

### 7.3 Keywords requiring external validation

Validate later in Google Keyword Planner, Google Trends, Search Console, Bing Webmaster Tools, Semrush, Ahrefs, Similarweb, or DataForSEO. **Do not implement titles from guessed volume.**

- artificial grass Bahrain / installation / company / contractor / supplier
- football turf replacement Bahrain
- hybrid grass / hybrid turf / reinforced natural grass Bahrain
- SubAir Bahrain / pitch drainage system / vacuum drainage football field
- natural grass pitch construction Bahrain
- sports fencing Bahrain / stadium netting
- swimming pool construction Bahrain
- horse walker Bahrain
- sports construction company Bahrain
- Brand: Fast & Safe, Fast N Safe, FSMS, fsmsbh
- Arabic equivalents (if Arabic site is approved later) — **not in current UI**

---

## 8. Keyword-to-Page Map

Each major commercial keyword gets **one** primary page. See also §35.

| Page | URL | Primary Keyword | Secondary Keywords | Search Intent | Current/Needed | Cannibalization Risk |
| ---- | --- | --------------- | ------------------ | ------------- | -------------- | -------------------- |
| Homepage | `/` | sports construction company Bahrain | Fast & Safe; sports facility contractor | Commercial + brand | Current (retarget) | High if it also tries to rank for every service |
| About | `/about/` | Fast & Safe Maintenance Services Bahrain | ISO contractor Sitra; CR 33626 | Informational | Needed | Low if brand-focused |
| Services hub | `/services/` | sports facility construction Bahrain | turnkey athletic facilities | Commercial hub | Needed | Medium vs homepage — keep hub list-oriented |
| Artificial grass | `/services/artificial-grass/` | artificial grass installation Bahrain | synthetic turf; 3G pitch | Commercial | Needed | Low if homepage drops this as H1 |
| Natural grass | `/services/natural-grass/` | natural grass pitch construction Bahrain | natural turf installation | Commercial | Needed | Medium vs hybrid — distinguish 100% natural |
| Hybrid grass | `/services/hybrid-grass/` | hybrid grass system Bahrain | hybrid turf; FS-Grass hybrid | Commercial | Needed | Medium vs natural — explicit “hybrid reinforcement” |
| SubAir | `/services/subair-system/` | SubAir system installation Bahrain | subsurface aeration; vacuum drainage | Commercial | Needed | Low if DrainTalent stays on this page |
| Fencing | `/services/fencing/` | sports fencing contractor Bahrain | perimeter / stadium netting | Commercial | Needed | Low |
| Building | `/services/building-construction/` | building construction company Sitra Bahrain | turnkey civil works | Commercial | Needed | Medium vs homepage “construction” |
| Pools | `/services/swimming-pools/` | swimming pool construction Bahrain | concrete / infinity pool | Commercial | Needed | Low |
| Horse walkers | `/services/horse-walkers/` | horse walker installation Bahrain | equine exercise system | Commercial | Needed | Low |
| Carpentry | `/services/carpentry/` | carpentry wood works Bahrain | timber / stables woodwork | Commercial | Needed | Low |
| Projects | `/projects/` | sports construction projects Bahrain | football pitch case studies | Proof | Needed | Low if not titled as a service |
| Contact | `/contact/` | Fast & Safe Sitra contact | quote; phone | Local | Needed | Low |
| Privacy | `/privacy/` | n/a | legal | Trust | Needed | None |

**Do not create** city doorway pages (Manama, Riffa, Muharraq…) with duplicate copy. Bahrain location modifiers belong **on the real service pages**.

---

## 9. On-Page SEO Audit

### 9.1 Title tags

| Surface | Current title | Issues |
| ------- | ------------- | ------ |
| All URLs | `Fast N Safe` (`index.html` line 6; production HTML) | Generic; not unique; missing Bahrain, services, legal name; truncation not the problem — **relevance is** |
| Route-specific titles | None | No Helmet / no `document.title` |
| `metadata.json` name | “Fast and Safe Maintenance Services” | Not used as HTML title |

### 9.2 Meta descriptions

| Surface | Current | Issues |
| ------- | ------- | ------ |
| `index.html` | **Missing** | Lighthouse SEO fail; no SERP CTA |
| Per-section | None | |
| `metadata.json` description | Exists (sports construction + 16 years) | **Not injected into HTML** |

### 9.3 Heading matrix (homepage DOM after JS)

| Location | Tag | Text (representative) | Problem |
| -------- | --- | --------------------- | ------- |
| Hero | **H1** (rotates) | Slide 1: “WE BUILD THE GROUND / NATURAL GRASS PLAYS THE GAME”; Slide 2: “HIGH-PERFORMANCE / ARTIFICIAL TURF SYSTEMS”; Slide 3: “FROM ROOTZONE / TO FINAL LINE MARKING” | **Three competing H1s**; only one in DOM at a time; brand/service not in H1; marketing-first |
| Hybrid | H2 | “What is HYBRIDGRASS System” | Good question-style H2 |
| Hybrid | H3 | “Hybrid Grass Technology”, “Elite Hybridgrass System” (twice) | Duplicate H3 pattern |
| SubAir | H2 | “How SubAir Technology Works” | Strong AEO heading |
| About | H2 | “WHO WE ARE” (eyebrow style) | H2 used as label |
| About | H3 | “Expertise in Construction & Engineering” | Visual title is H3, not H1/H2 primary |
| `#services` | H2 | “Advanced Engineered Sports Surface Technologies” | Broad |
| `#services` | H3 | Active system name only | Other systems’ H3s not in DOM until click |
| Expertise | H2 | “Our Expertise” | Eyebrow |
| Expertise | H3 | “What We Deliver” **and** each service name | Multiple H3s; service names good |
| Projects | H2 / H3 | “Reference Projects” / “Featured Portfolio” | Same eyebrow pattern |
| Projects | H4 | Project titles | OK as list headings |
| Safety | H2 / H3 | “Commitment to Standards” / “Integrated ISO Quality & Safety Loop” | |
| Map | H2 | “Sitra Regional Office & Estimating Depot” | Good local H2 |
| Footer | H4 only | Key Activities / ISO / Locations | No H2; activities not links |
| Initial HTML (no JS) | **No headings** | Empty `#root` | Non-JS crawlers see zero headings |

**No page has a stable, unique, keyword-aligned H1 for a service.**

---

## 10. Content Audit

### 10.1 Strengths (keep; do not dilute)

- Substantial technical copy for hybrid grass and SubAir (definitions, benefits, process language).
- Named Bahrain projects and public-sector clients (strong E-E-A-T *if accurate*).
- Sitra + hours + two phones + email + CR line.
- Installation steps exist in data for artificial grass, natural grass, carpentry.

### 10.2 Weaknesses

| Issue | Evidence | SEO effect |
| ----- | -------- | ---------- |
| Thin project blurbs | 8× `desc: "Replacement of Artificial Grass"` in `projects.ts` | Duplicate snippets |
| Empty `caseStudies: []` | Artificial grass, natural grass, horse walker | Missing proof blocks |
| Hover-only service blurbs | `ExpertiseSection` `text-white/0 group-hover:text-white/80` | Users (and some AT) miss descriptions; crawlers that see CSS may still see text |
| Tab-gated system copy | Only `activeSystem` description rendered | Inactive systems’ full copy not in HTML |
| Hybrid hotspots | Content in hover popover | Fragile extraction |
| Vague marketing | “award-winning field patterns”, “elite”, “uncompromising” | Low citation value |
| Grammar | About: “offers a elite complement” | Quality signal |
| SubAir button label | “Vacuum ModeActive” (missing space) | Minor quality |
| Unsupported claims | FIFA / FIH / World Rugby / leading partner | Trust + possible rich-result rejection |
| Missing buyer content | Price ranges, timelines, inclusions/exclusions, documents needed, warranty | Weak commercial completeness |
| No FAQ | Repo-wide no FAQ component | Weak AEO |
| No testimonials component | None | Trust gap (do not fabricate) |
| Sports flooring / landscape / interior | Mentioned, not explained | Thin / misleading if indexed as offerings |

### 10.3 Missing information by major service (do not write answers this phase)

For **each** of: artificial grass, natural grass, hybrid, SubAir, fencing, building, pools, horse walkers, carpentry — the site is missing a crawlable page that clearly states:

- What the service is  
- Who needs it (clubs, ministries, schools, villas — only where evidenced)  
- Scope / inclusions / exclusions  
- Process (some exists in modal data)  
- Bahrain climate relevance (partially present)  
- Standards **only if documents exist**  
- Project examples with unique copy  
- Quote CTA  
- FAQs  

---

## 11. React / Vite SEO Audit

### 11.1 How HTML is generated

| Question | Answer | Evidence |
| -------- | ------ | -------- |
| CSR only? | **Yes** | `src/main.tsx` `createRoot` |
| Prerender? | **No** | No `vite-plugin-ssr`, no `vike`, no `react-snap`, no prerender plugin |
| SSR? | **No** | No Node render for routes; Express unused |
| SSG / unique HTML per route? | **No** | Single `index.html` |
| React Helmet / similar? | **No** | Grep: no matches |
| `document.title` updates? | **No** | |
| Initial HTML architecture | Shell only | Production 397-byte document |

Production source (verified):

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

### 11.2 Unique tags per important page

| Tag | Possible today? |
| --- | --------------- |
| `<title>` | One global title |
| meta description | Missing |
| canonical | Missing |
| Open Graph | Missing |
| Twitter | Missing |
| robots meta | Missing (defaults to index,follow — OK for `/` only) |
| JSON-LD | Missing |

### 11.3 CSR risks

- Google may index `/` after render, but **title/snippet still come from static HTML** unless JS updates them (it does not).
- Bing / some AI fetchers / social scrapers often **do not execute JS** → empty body, title `Fast N Safe`.
- Lighthouse SEO audits the **delivered HTML + some computed fields**; missing description / crawlable links hurt the score.
- Hash changes do not create new documents.

### 11.4 Compatible approaches (recommend later — **do not install now**)

| Approach | Fit | Notes |
| -------- | --- | ----- |
| Static prerender of real routes (Vite SSG / `vike` / framework migrate) | High SEO impact | Best if IA becomes multi-page; **design-lock:** reuse current section components |
| `react-snap` / prerender-spa-plugin after build | Medium | Fragile with Firebase/modals; can snapshot homepage |
| Cloudflare / Vercel prerender for bots | Medium | Hosting-level; still need unique URLs first |
| `react-helmet-async` or native per-route head in a small router | Required either way | Metadata only; no visual change |
| Stay CSR + improve `index.html` only | Low | Helps homepage Lighthouse; **cannot** solve service-keyword targeting |

**Prerender/static generation would materially improve SEO** once unique URLs exist. Metadata-only changes help Lighthouse on `/` immediately.

---

## 12. Crawlability Audit

| Check | Status | Evidence |
| ----- | ------ | -------- |
| Homepage reachable | Yes | 200 |
| Hash links crawlable as `<a href>` | Partial | `NAV_LINKS` in `src/constants/index.ts` |
| Footer service list crawlable | **No** | `<li>` text only, `Footer.tsx` |
| Expertise details | **No** | `onClick` → modal |
| Project details | **No** | `onClick` → modal |
| Hero / SubAir / pitch-tech CTAs | **No** | `<button>` + `scrollIntoView` / `triggerConsultation` |
| Hybrid brochure CTA | Yes | `<a href="#contact">` |
| Map CTA | Yes | external Google Maps |
| Phone / email | Yes | `tel:` / `mailto:` |
| Social | Dead | `href="#"` |
| Logo / HOME | Logo is **not** an `<a href="/">` | `Navbar.tsx` `motion.div` |
| JS required | Yes | Empty `#root` |
| Blocked resources | Not verified in GSC | Firebase/EmailJS third parties after JS |
| Orphan sections | `#about`, `#office-location`, `#project-cycle` | Not in `NAV_LINKS` |

---

## 13. Indexability Audit

| Check | Status |
| ----- | ------ |
| `noindex` mistakes | None found (good) |
| robots meta | Absent |
| X-Robots-Tag | Not present on HTML response (verified headers) |
| Duplicate hosts | Apex 308 → www (**good**) |
| HTTP | 308 → HTTPS (**good**) |
| Trailing slash | `/` only; no multi-page policy |
| Query parameters | None used for content |
| Hash URLs | May be ignored as separate URLs (typical) |
| Soft 404 | `/` returns 200 with real content after JS — OK; **empty-looking 200s** if JS fails |
| Unknown paths | Hard 404 (Vercel) — good today; **will break** React routes without rewrite |
| Soft-404 risk later | If SPA fallback added without true 404 component, unknown slugs could 200 |

**Existing indexable pages: 1.**

---

## 14. Robots Audit

| Item | Finding |
| ---- | ------- |
| Repo file | **Does not exist** (`public/` contains only `assets/`) |
| Production `https://www.fsmsbh.com/robots.txt` | **404** `X-Vercel-Error: NOT_FOUND` |
| Accidental blocks | None (file missing) |
| Sitemap reference | None |
| Staging paths | None in robots (N/A) |

**Required later (do not create this phase):**

```
User-agent: *
Allow: /

Sitemap: https://www.fsmsbh.com/sitemap.xml
```

Do not `Disallow` `/assets/` (CSS/JS needed for rendering). Do not expose admin/test paths (none exist as routes). Consultation modal should not get a public URL.

---

## 15. Sitemap Audit

| Item | Finding |
| ---- | ------- |
| Repo `sitemap.xml` | **Absent** |
| Production `/sitemap.xml` | **404** |
| Completeness | N/A |
| Hostname | N/A |

**Required later:** XML sitemap listing only canonical www HTTPS URLs that return 200 with unique content. Start with `/` only until landing pages exist; expand with lastmod. Do not include `#` hashes, modal states, or 404s.

---

## 16. Canonical Audit

| Page | Current canonical | Problem | Recommended later |
| ---- | ----------------- | ------- | ----------------- |
| `/` | **None** | Relies only on 308 host redirect | `<link rel="canonical" href="https://www.fsmsbh.com/">` absolute |
| Future service pages | N/A | — | Self-referencing `https://www.fsmsbh.com/services/.../` |
| Apex | Redirect | Good | Do not publish apex canonicals |
| Hash URLs | N/A | Do not canonicalize hashes | |

No duplicated canonical tags exist because none exist.

---

## 17. URL Architecture Audit

| Current | Assessment |
| ------- | ---------- |
| `/` | Fine as homepage; keep |
| `#section` | Not keyword URLs; OK as in-page jumps after pages exist |
| Query service pages | Not used |
| Case sensitivity | N/A (one path) |
| Spaces in **image** URLs | Yes — `Maamer 2 .png`, `img 11.png`, `Final Top View.png` (encoded by `getImgUrl` → `encodeURI`) | Ugly, cache-fragile; do not rename until a planned image phase |
| Ideal future | See §38 | Meaningful lowercase slugs, trailing-slash policy, one host |

**Redirects if URLs are introduced later**

- Keep `/` 200.
- Add Vercel `cleanUrls` / rewrite `/*` → `/index.html` **only together with a real client 404**.
- 301 any accidental GH Pages or `*.vercel.app` hosts to `https://www.fsmsbh.com` — **preview hostnames Not verified**.
- No 301s required today except existing apex → www.

---

## 18. Schema Audit

**Existing JSON-LD / microdata / RDFa: none** (repo grep + production HTML).

Do **not** add Review/AggregateRating, fake prices, fake awards, invented founding employee counts.

| Page | Existing Schema | Missing / Recommended Schema | Reason |
| ---- | --------------- | ---------------------------- | ------ |
| `/` | None | `Organization` + `WebSite` (and `LocalBusiness` **only if** visible NAP matches a real registered type, e.g. General Contractor — confirm legal category) | Entity identity |
| `/` or `/contact/` | None | `ContactPoint` (phone, email, areaServed Bahrain) | Matches visible footer |
| `/about/` (future) | None | `Organization` / `LocalBusiness` with same NAP | About page |
| Service pages (future) | None | `Service` + `WebPage` + `BreadcrumbList` | Matches visible service copy |
| Pages with real FAQ **after content exists** | None | `FAQPage` | Only for visible Q&A |
| Project pages (future) | None | `WebPage`; `Article` only if written as articles | Do not force `Product` |
| Consultation form | None | Do not mark as `Product`/`Offer` without prices | No prices on site |
| Map iframe | None | Optional `GeoCoordinates` **if** a precise address is published | Current address is “Sitra, Kingdom of Bahrain” only — too coarse for precise geo |

**Conflicts:** none (no schema).  
**Do not** emit FIFA/ISO as `Award` or `hasCredential` without documents.

---

## 19. Local Bahrain SEO Audit

### 19.1 NAP consistency

| Field | Source A | Source B | Consistent? |
| ----- | -------- | -------- | ----------- |
| Brand | `index.html`: Fast N Safe | `COMPANY_INFO.name`: FAST & SAFE | **No** |
| Legal / trading | `COMPANY_INFO.fullName`: Fast & Safe Maintenance Services | Consultation success: “Fast & Safe Construction” | **No** |
| Footer domain | `www.fsmsbh.com` | `metadata.json`: Fast and Safe Maintenance Services | Different channel |
| Address | Sitra, Kingdom of Bahrain | Same in map | **Yes but incomplete** (no street, block, building) |
| Phone 1 | `COMPANY_INFO`: `+973 77912500` | Footer display `+973 7791 2500` / `tel:+97377912500` | Same number, format differs |
| Phone 2 | Footer / map `+973 3935 4111` / `tel:+97339354111` | **Not in `COMPANY_INFO`** | Partial |
| Email | `COMPANY_INFO.email`: `fastsafecontracting@gmail.com` | Footer/map: `info@fsmsbh.com` | **Conflict** |
| Email (ops comment) | ConsultationModal comment: `fastnsafe321@gmail.com` | Not shown in UI | Third unpublished address |
| Hours | Map: Sun–Thu 8:00 AM – 5:00 PM AST | Not in footer | Partial |
| Map query | `Sitra, Kingdom of Bahrain` | Not a pin-precise address | Weak local pack signal |
| CR | 33626-6 | Only footer | Unverified |
| Social profiles | Icons only, `href="#"` | No URLs | **No profile graph** |

**Bahrain language:** strong (Kingdom of Bahrain, Sitra, club names, form governorates).  
**Doorway risk:** do not spin city pages from the form location list.

**Opportunities (later):** one official NAP, street address if real, Google Business Profile alignment (**GBP Not verified**), LocalBusiness schema matching visible facts, service-area copy on service pages (“installed at Sitra Club, Isa Town Club…” — already evidenced).

---

## 20. Image SEO Audit

### 20.1 Inventory

| Item | Count / size | Evidence |
| ---- | ------------ | -------- |
| Files in `src/assets/images` | **224** files, **~246.45 MB** | local inventory |
| Synced `public/assets/images` | 225 files (includes copy from Vite sync) | `vite.config.ts` `syncAssets()` |
| Formats | 141 PNG (~210 MB), 55 JPEG, 28 JPG | no WebP/AVIF |
| Largest files | Many **~2.8–3.5 MB** PNGs (`Night Vision.png`, `Img 9.png`, `Maamer 4.png`, …) | filesystem |
| Spaces / typos in names | `Maamer 2 .png`, `Night Vsion.png`, `img  12.png`, `imag 5.png` | filesystem |
| Git-tracked | Yes (224 + public copies) | `git ls-files` |

### 20.2 Markup

| Pattern | Finding |
| ------- | ------- |
| `alt` | Present on most content `<img>` |
| Hero alts | Uses slide **tag**, e.g. `KINGDOM OF BAHRAIN • ESTABLISHED 2010` — not image-descriptive |
| Expertise alts | Service name (good) |
| Project alts | Project title (good) |
| Lightbox | `alt="Enlarged view"` — generic |
| Decorative overlays | CSS gradients, not imgs |
| `loading="lazy"` | **Only** Sitra map **iframe**; images eager |
| `fetchpriority` / LCP | **None**; hero is full-viewport `<img>` PNG ~936 KB |
| `width` / `height` | **None** on content images → CLS risk |
| `srcset` / `<picture>` | **None** |
| Background image | `#services` uses CSS `backgroundImage` (weaker alt/SEO) |

### 20.3 Classification for a later image phase (no renames now)

1. **Accessibility alts:** hero (describe pitch photo), lightbox, icon-only controls.  
2. **SEO-descriptive alts:** service and project photos (already closer).  
3. **Empty alt:** purely decorative if any remain.  
4. **Performance:** compress / convert oversized PNGs; lazy-load below fold; priority on LCP only.

**Design-lock:** compression and `srcset` can preserve appearance; renaming files needs redirect/map.

---

## 21. Internal Linking Audit

### Current crawl paths

```
Navbar <a href="#..."> → sections on same document
Hybrid <a href="#contact">
Footer: no service <a>
Expertise / Projects: click handlers, not hrefs
Pitch tech / SubAir / Hero: buttons
```

### Problems

- Footer “Key Activities” are **orphan text**, not links.
- No breadcrumbs.
- No contextual “related service” links.
- Generic / non-descriptive actions: “FROM EXPERTISE”, “VIEW SERVICES”, “View Details”, “Inquire About This Turf System”.
- About and office are weakly linked.
- Logo is not a home link.

### Recommended relationships (implement later)

| From | To | Anchor idea (descriptive, not “Learn more”) |
| ---- | -- | ------------------------------------------- |
| Home | Each core service URL | Service name |
| Service | Related service | e.g. Artificial grass → Shockpad/drainage supporting copy → SubAir only if offered together |
| Service | Relevant projects | Club/project name |
| Service | Contact | “Request a quote for [service] in Bahrain” |
| Projects | Service | “Artificial grass installation” |
| About | Services hub + Contact | |
| Footer | All indexable service URLs + legal | Same names as pages |
| Breadcrumbs | Home > Services > [Service] | **Visible UI — design-lock flag** |

---

## 22. Open Graph Audit

| Tag | Current | Issue |
| --- | ------- | ----- |
| `og:title` | Missing | Social/AI scrapers use `Fast N Safe` |
| `og:description` | Missing | |
| `og:image` | Missing; `/og-image.jpg` **404** | |
| `og:url` | Missing | |
| `og:type` | Missing | |
| `og:locale` | Missing | |
| Twitter card | Missing | |

Not route-aware. Duplication N/A.

---

## 23. E-E-A-T Audit

| Signal | Present? | Quality |
| ------ | -------- | ------- |
| Company name | Yes, inconsistent | Weak entity |
| Address | City-level only | Weak |
| Phone / email | Yes, email conflict | Medium |
| Hours | Yes on map | Medium |
| CR number | Yes, unverified | Medium if real |
| Named projects + ministries | Yes | Strong **if accurate** |
| ISO claims | Yes, no certificate IDs | Risky |
| Team / authors | No | Weak |
| Testimonials | No | Do not invent |
| Case studies | Partial / some empty | Medium |
| Legal (privacy, terms) | **None** | Weak trust |
| Partner logos | GSA mentioned as text | Unverified |
| Public “Add Portfolio Project” / Delete | **Yes on production** | **Harms trust**; anyone can mutate localStorage view |
| Social proof links | Dead `#` | Weak |

Recommend later: one legal name, one NAP, hide public CMS controls, publish only substantiated credentials, add privacy page, optional real project pages. **Do not add fake reviews or badges.**

---

## 24. AI SEO / AEO Audit

### Suitability today

| Factor | Assessment |
| ------ | ---------- |
| Entity identity | Fragmented names; hard to quote consistently |
| Concise definitions | Hybrid (“What is HYBRIDGRASS System”) and SubAir (“How SubAir Technology Works”) are the best extractable passages |
| Q&A / FAQ | Absent |
| Service pages | Absent — models must summarize one long SPA |
| Schema | Absent |
| Citation-worthy facts | Project names are citable; FIFA/ISO superlatives are not |
| Consistency | Email/brand/claims conflict |
| JS-only body | Many answer engines fetch raw HTML → **almost nothing to cite** |

### Likely customer questions (do not write full answers now)

**Artificial grass:** What is included in installation? Who needs FIFA-grade turf in Bahrain? How long does replacement take? Which clubs has FASTSAFE resurfaced? How is heat/UV handled?

**Natural grass:** What grass types are used? What is grow-in time? Irrigation scope? Maintenance after handover?

**Hybrid:** What is hybrid grass vs artificial? Who needs it? FIFA Quality Programme meaning? Cost drivers? **External validation + legal review of FIFA wording required.**

**SubAir:** What is SubAir? Vacuum vs pressure? Who needs it in Bahrain rain/heat? Water reuse? How to request a quote?

**Fencing:** Sports vs industrial types? Heights? Bahrain marine corrosion?

**Building:** Which building types? Youth centres? Design-build vs build-only?

**Pools:** Concrete shells? Residential vs resort? Timeline?

**Horse walkers:** What is installed? Safety features? Rashid reference?

**Company:** Where is the office? Hours? How to request a consultation? What is CR 33626-6?

---

## 25. Core Web Vitals / Performance Audit

**Field CWV / PSI / CrUX: Not verified.** Below are code- and production-weight inferences.

### SEO-critical

| Risk | Evidence |
| ---- | -------- |
| LCP | Hero full-viewport PNG ~936 KB (`pristine_pitch_night_…png`); no `fetchpriority`, no preload, no WebP |
| CLS | Images lack width/height; fonts are Tailwind/system default (good); carousels/modals can shift |
| JS weight | **~817 KB** single module; Firebase + EmailJS + Motion + unused showcases in graph |
| Render-blocking | CSS 93 KB + module JS before content |
| Image weight | **~246 MB** source tree; many 3 MB PNGs in galleries |

### Performance improvement (not ranking-critical alone)

- No route-based code splitting (`React.lazy` unused)
- `SubAirVentShowcase` Web Audio engine always mounted
- 8s hero timer + Motion animations → INP risk
- `Access-Control-Allow-Origin: *` on HTML (host default; not CWV)
- Hashed assets served `max-age=0, must-revalidate` — weaker cache than typical immutable hashes
- Duplicate image trees (`src/assets` + `public/assets`)

### Optional

- Remove unused `@google/genai` / Express from install later (not this phase)
- Unused Lucide imports (`Navbar` Globe, Search, ChevronRight)

**Do not optimize this phase.**

---

## 26. Mobile SEO Audit

| Check | Finding | Design-lock |
| ----- | ------- | ----------- |
| Viewport | Present, correct | OK |
| Responsive classes | Extensive `sm:`/`md:`/`lg:` | OK |
| Hero `h-screen` | Large mobile LCP; text italic/black | Visual — do not restyle now |
| Tap targets | Some icon buttons ~40–48px; progress bars `p-2` | Review later without shrinking brand style |
| Hover-only expertise descriptions | Fail on touch (stay `text-white/0`) | **Content parity issue**; fixing visibility **is a visual change** — flag |
| Full-screen mobile menu | Present | OK |
| Consultation modal `max-h-[90vh]` | Usable; camera leftover in App unused by modal | |
| Map iframe | `min-h-[400px]` | OK |
| Content parity desktop/mobile | Same React tree | Good |
| Intrusive overlays | Consultation + details modals | OK if user-initiated |
| Overflow | `overflow-hidden` on several sections | Watch clipped content |
| Add/Delete on cards | Hover-reveal delete — awkward on mobile | Hygiene |

---

## 27. Semantic / Accessibility SEO Audit

Focus: crawl semantics and UX, not a full WCAG rebuild.

| Issue | Evidence | SEO/UX |
| ----- | -------- | ------ |
| No `<main>` / `<header>` | Root is a `div` | Weaker landmarks |
| `<nav>` / `<footer>` | Present | Good |
| Heading order | H2 labels + H3 titles; no stable H1 in static HTML | Topic confusion |
| Buttons as links | Widespread | Crawl + AT |
| Icon-only menu | Hamburger has **no `aria-label`** | `Navbar.tsx` mobile toggle |
| Expertise close button | No aria-label | Modal |
| Form labels | Consultation fields have `htmlFor` | Good |
| Map “labels” | `<label>` not associated with controls | Minor |
| Social aria-labels | Present, but `href="#"` | Accessible names, useless destinations |
| Expertise sidebar `<nav>` | Buttons, not links | OK for in-modal |

---

## 28. Duplicate Content / Cannibalization Audit

**Harmless reuse:** ISO cards, `getImgUrl`, shared modal chrome, color tokens.

**SEO-visible duplication:**

- One URL targeting natural + artificial + hybrid + SubAir + construction + pools.
- Hybrid explained in `HybridGrassShowcase` and again in `PremiumPitchesTech` hybrid module.
- SubAir explained in dedicated section and again in `#services`.
- ISO story in About + Safety + Footer.
- Club projects share near-identical replacement copy.
- Brand strings duplicated with different legal names.
- Unused `NaturalGrassShowcase` / `FencingShowcase` would add **more** duplicate hybrid/fencing copy if mounted.

---

## 29. Navigation / Footer Audit

### Navbar (`NAV_LINKS`)

HOME, HYBRID GRASS, SUB-AIR TECH, SERVICES, EXPERTISE, PROJECTS, SAFETY, CONTACT.

Missing: About, Office, individual services, legal.  
CONTACT hash → footer (no dedicated page).  
REQUEST CONSULTATION is a **button** (correct as modal, but no `/contact` fallback).

### Footer

- Brand blurb + year + Sitra  
- Key Activities **not links**  
- ISO list  
- NAP + website  
- Social `#`  
- No privacy/terms  
- No sitemap link  

Major services **cannot** all be discovered via normal footer `<a href="/services/...">`.

---

## 30. Conversion Path Audit

| Path | Mechanism | SEO landing issue |
| ---- | --------- | ----------------- |
| Request consultation | Modal (`ConsultationModal`) | Fine as conversion; not a landing page |
| Hero primary | Scroll to `#contact` (footer), **not** modal | User lands on footer, form is still a modal from nav |
| SubAir CTA | `triggerConsultation(...)` button | Good intent, not crawlable |
| Project inquire | Modal → consultation with prefilled message | Good UX |
| Phone | `tel:+97377912500`, `tel:+97339354111` | Good |
| Email | `mailto:info@fsmsbh.com` | Good |
| WhatsApp | Form option only; **no `wa.me` / `https://wa.me/973...`** | Missed high-intent local CTA |
| Maps | External Google Maps | Good |
| Quote form | Name/phone required; service dropdown incomplete vs site services | Lead quality |

Firebase/EmailJS: out of SEO implementation scope. EmailJS public key is hardcoded in `ConsultationModal.tsx` (client-visible by design of EmailJS; still a hygiene note).

---

## 31. JavaScript Crawlability Audit

| Pattern | Where | Crawler sees |
| ------- | ----- | ------------ |
| `<a href="#...">` | Navbar | Same-document fragments |
| `onClick` + `setSelectedExpertise` | Expertise cards | No URL |
| `onClick` + `setSelectedProject` | Project cards | No URL |
| `onClick` + `scrollIntoView` | Hero, pitch tech | No href |
| `onClick` + `triggerConsultation` | SubAir, Navbar, projects | Overlay |
| Tab `setActiveSystemId` | PremiumPitchesTech | Partial list names in DOM; bodies gated |
| Hotspot hover | Hybrid | Popover copy |
| Hash after JS | All sections | IDs exist after render |

Search engines **cannot assign a unique result** to “artificial grass installation Bahrain” that is only a modal.

---

## 32. Technical File Audit

| File | Exists | SEO notes |
| ---- | ------ | --------- |
| `package.json` | Yes | Name `react-example`; no react-router/helmet; unused AI/Express deps |
| `index.html` | Yes | Only charset, viewport, title |
| `vite.config.ts` | Yes | Asset sync; no `base`; GEMINI define; no prerender |
| `src/main.tsx` | Yes | CSR |
| `src/App.tsx` | Yes | Composition + unused showcase imports |
| `src/index.css` | Yes | Tailwind only; no `@font-face` |
| `src/data/expertise.ts` | Yes | Service corpus |
| `src/data/projects.ts` | Yes | 15 projects |
| `src/constants/index.ts` | Yes | Nav, NAP fragments, activities |
| `public/robots.txt` | **No** | |
| `public/sitemap.xml` | **No** | |
| `public/manifest.json` | **No** | |
| Favicon | **No** | |
| `vercel.json` | **No** | No rewrites/headers/redirects in repo (Vercel project settings **Not fully verified**) |
| `.github/` | **No** | |
| `.gitignore` | Yes | Ignores `.env*`, `dist/` |
| `.env.example` | Yes | GEMINI / APP_URL leftovers |
| `firebase-applet-config.json` | Yes | Client API key (normal for Firebase web; restrict in console) |
| `firestore.rules` | Yes | Consultations create-only |
| `metadata.json` | Yes | AI Studio; not HTML |
| `README.md` | Yes | Generic AI Studio readme |
| SEO packages | **None** | |

`npm run lint` / `npm run build` were **not required** to complete this audit and were **not run as a fix**. Existing build errors: **Not verified this session**.

---

## 33. Indexing Hygiene Audit

| Item | Risk | Notes |
| ---- | ---- | ----- |
| Public Add/Delete portfolio | High | Client-side localStorage; not a secret CMS, but looks unprofessional and can show junk to users/crawlers |
| `localStorage` override of `PROJECTS` / `EXPERTISE` | Medium | Indexed HTML after render may not match repo |
| EmailJS keys in source | Medium (abuse of email quota) | Not an SEO ranking factor |
| Firebase config in repo | Expected for web | Restrict API keys / domains |
| `GEMINI_API_KEY` define | Low if unset | Leftover |
| `security_spec.md`, architecture guides | Low | Not in `public/` |
| Unused fencing Unsplash URLs | Low unless component mounted | Third-party images |
| Test Firestore `test/connection` | Low | Client read attempt on load (`src/firebase.ts`) |
| Internal test routes | None found | |
| Debug `console.error` payloads | Low | |

No staging hostname found in repo. Vercel preview URLs: **Not verified**.

---

## 34. Missing SEO Elements

- Unique indexable service / about / project / contact URLs  
- Metadata component / per-route head  
- robots.txt, sitemap.xml, canonical, OG, Twitter, favicon, apple-touch, theme-color  
- JSON-LD  
- SPA fallback + real 404  
- Crawlable footer/service links  
- FAQ  
- Legal pages  
- Consistent NAP  
- WhatsApp link  
- Image performance pipeline  
- Prerender or equivalent  
- Breadcrumbs (optional, visible)  
- hreflang / Arabic (**only if** business wants Arabic)  
- Search Console / Bing verification files (**not in repo**; presence on host **Not verified**)

---

## 35. Quick Wins

High impact, low visual risk, no redesign. **Do not implement until approved.**

1. Replace `index.html` title + add meta description, canonical, robots, OG/Twitter, lang, theme-color (homepage only).  
2. Add `public/robots.txt` + `public/sitemap.xml` (www HTTPS `/`).  
3. Add favicon / `og:image` (new assets, no layout change).  
4. Convert footer activities and expertise cards to `<a href>` **once URLs exist**; until then, `#expertise` anchors are a weaker interim.  
5. One official H1 on the homepage (content change, same styling). **Flag: visible text.**  
6. Align displayed email/phone/name to one NAP. **Flag: visible text.**  
7. Hide “Add Portfolio Project” / delete from public UI. **Flag: visible control removal (hygiene, not restyle).**  
8. Add `width`/`height` + `loading="lazy"` below-fold; `fetchpriority="high"` on LCP only.  
9. Organization JSON-LD matching **visible** footer facts only.  
10. `vercel.json` rewrites when routes are added; custom 404.

---

## 36. P0 / P1 / P2 / P3 Issue Matrix

| Priority | Issue | Page/File | SEO Impact | Recommended Fix | Phase |
| -------- | ----- | --------- | ---------- | --------------- | ----- |
| P0 | CSR empty HTML (397 B, no content/headings) | `index.html`, `src/main.tsx`, production `/` | Non-JS crawlers, social, many AI fetchers, Lighthouse | Prerender or equivalent + real metadata | 1 |
| P0 | Only one indexable URL for all commercial intents | `src/App.tsx` (no router) | Cannot rank service keywords cleanly | Multi-page IA with unique titles/H1s | 1–5 |
| P0 | Service/project depth trapped in modals/tabs/state | `ExpertiseSection`, `ExpertiseDetailsModal`, `ProjectsSection`, `PremiumPitchesTech` | Crawlers lack unique documents | Promote to URLs; keep design | 4–5 |
| P0 | No metadata / canonical / OG system | `index.html` | Weak snippets, wrong entity, no sharing preview | Head manager + homepage tags | 1 |
| P0 | Vercel hard 404 on every non-root path | Host (no `vercel.json`) | Future URLs and mistaken deep links fail | Rewrites + real 404 **when routes exist** | 1 |
| P1 | `robots.txt` 404 | production / missing `public/robots.txt` | No crawl policy / sitemap hint | Add file | 1 |
| P1 | `sitemap.xml` 404 | production | Slower discovery | Add XML | 1 |
| P1 | Title `Fast N Safe` | `index.html` | Poor relevance | Brand + Bahrain + category | 3 |
| P1 | No meta description | `index.html` | Lighthouse + snippets | Unique homepage description | 3 |
| P1 | No favicon / manifest | production 404 | Weaker SERP/brand | Add icons | 1 |
| P1 | No JSON-LD | entire site | Weaker entity / local | Organization/LocalBusiness from facts | 7 |
| P1 | Rotating competing H1s | `HeroCarousel.tsx` | Unstable primary topic | One H1; slides as H2 or styled text | 3 |
| P1 | Heading hierarchy (eyebrow H2 / title H3) | About, Expertise, Projects | Topic outline unclear | Semantic headings, same CSS | 3–4 |
| P1 | Footer services not links | `Footer.tsx` | Lost crawl paths | `<a>` to future URLs | 8 |
| P1 | Major CTAs are buttons | Hero, SubAir, PremiumPitchesTech | Poor discovery | Visually identical `<a href>` | 8 |
| P1 | NAP / brand / email conflicts | `constants`, `Footer`, `index.html`, modal | Local + entity confusion | Single source of truth | 6 |
| P1 | FIFA / ISO / “leading partner” / GSA / zero accidents unverified | multiple | Trust / policy risk | Substantiate or soften | 6–10 |
| P1 | LCP hero ~900 KB+ PNG | `HeroCarousel.tsx`, images | CWV / Lighthouse | Compress/priority; no visual redesign | 11 |
| P1 | ~817 KB monolithic JS + unused showcase imports | `App.tsx`, production bundle | INP / render delay | Split; drop unused imports | 11 |
| P1 | Public add/delete projects | `ProjectsSection.tsx` | Trust / hygiene | Remove from public UI | 6 |
| P1 | Consultation activities omit Hybrid, SubAir, Carpentry | `constants` / `ConsultationModal` | Conversion mismatch | Align list (function, not SEO text) | later / conv. |
| P1 | No privacy/legal pages | repo | Trust / ads/compliance | Add `/privacy/` | 6 |
| P1 | Social `href="#"` | `Footer.tsx` | Fake crawl targets | Real URLs or remove | 6 |
| P1 | About / office not in primary nav | `NAV_LINKS` | Orphan important content | Add hash or page links | 8 |
| P1 | All project modal locations hardcoded “Manama” | `ProjectDetailsModal.tsx` | Inaccurate local entity | Use real project locality | 4 |
| P1 | No FAQ / extractable AEO blocks | repo | Weak AI answers | FAQs on service pages | 10 |
| P1 | Homepage keyword cannibalization | single `/` | Diluted relevance | One primary intent on `/` | 2–3 |
| P1 | Duplicate thin project descriptions | `projects.ts` | Weak uniqueness | Unique project blurbs | 4 |
| P1 | Image filenames with spaces; no lazy/srcset | assets + `<img>` | Crawl waste, LCP, CLS | Image SEO pass | 9 |
| P1 | localStorage can replace published projects/expertise | `useLocalStorage` | Index/content drift | Don’t persist public catalog in localStorage | 6 |
| P2 | No width/height on images | all `<img>` | CLS | Attributes | 9 / 11 |
| P2 | Motion + SubAir audio always on | showcases | INP | Lazy-mount | 11 |
| P2 | Unused npm deps / GEMINI inject | `package.json`, vite | Bundle/hygiene | Clean later | 11 |
| P2 | Map is city-level Sitra | `SitraMap.tsx` | Weak local pack | Precise address if real | 6 |
| P2 | No WhatsApp click-to-chat | footer/modal | Missed local CTA | `wa.me` if approved | 6 |
| P2 | Empty case studies | `expertise.ts` | Thin proof | Only real cases | 4 |
| P2 | Hover-only expertise descriptions | `ExpertiseSection.tsx` | Mobile parity | Visible text (**visual flag**) | 4 |
| P2 | Footer-only landscape / interior | `Footer.tsx` | Misleading offerings | Confirm or remove from crawlable lists | 5 |
| P2 | Sports flooring mentioned once | `HeroCarousel.tsx` | Thin claim | Confirm or drop from copy | 3 |
| P2 | No Arabic | `lang="en"` only | Market coverage | Separate decision | later |
| P2 | Duplicate Firebase init | `firebase.ts` + modal | Hygiene | Not SEO-first | — |
| P2 | No custom 404 page | host | UX when routes added | Add with design system | 1 |
| P2 | Asset cache `max-age=0` | Vercel headers | Repeat-view performance | Immutable cache headers | 11 |
| P2 | `#services` CSS background image | `PremiumPitchesTech.tsx` | No alt | Keep visual; optional img | 9 |
| P2 | Camera / AI Studio leftovers | `metadata.json`, hooks | Confusion | Ignore for SEO | — |
| P2 | Geothermal thin module | `PremiumPitchesTech` | Over-promise | Confirm before landing page | 5 |
| P2 | Trademarked product names | Hybrid / DrainTalent | Legal/SEO claim risk | Review usage | 6 |
| P2 | Navbar logo not linking home | `Navbar.tsx` | Minor crawl | `<a href="/">` same look | 8 |
| P2 | Dual image trees | `src/assets` + `public` | Deploy weight | Pipeline later | 11 |
| P3 | “a elite”, “OSHAS”, “ModeActive” | About / Premium / SubAir | Quality | Copy polish | 10 |
| P3 | Unused Lucide imports | `Navbar.tsx` | Tiny bundle | Cleanup | 11 |
| P3 | `package.json` name `react-example` | package | Hygiene | Rename | — |
| P3 | Generic AI Studio README | `README.md` | Not user-facing | Optional | — |
| P3 | Duplicate near-identical night PNGs | assets | Weight | Dedupe | 9 |
| P3 | Footer H4-only blocks | `Footer.tsx` | Outline | Promote headings | 8 |
| P3 | Emoji hotspot hint | Hybrid | Minor | Optional | 10 |
| P3 | FastSAFE vs Fast & Safe in step title | `PremiumPitchesTech` | Entity | Align | 6 |
| P3 | Consultation success “Construction” vs “Maintenance Services” | modal | Entity | Align | 6 |
| P3 | `COMPANY_INFO.email` unused | constants | Drift | Delete or use | 6 |
| P3 | Unused `COLORS` import in Navbar | `Navbar.tsx` | Noise | Cleanup | — |
| P3 | Hash `#` HOME | `NAV_LINKS` | Duplicate `/` | `href="/"` | 8 |

**Counts: P0 = 5 · P1 = 24 · P2 = 20 · P3 = 12**

---

## 37. SEO Scorecard

Scoring is **audit readiness**, not rankings. 100 = production-ready technical + on-page + IA for this business type.

| Category | Score | Main Problems |
| ----------------- | ----: | ------------- |
| Technical SEO | 24 | CSR shell, no head stack, no robots/sitemap, no prerender, no SPA fallback |
| Crawlability | 30 | Hash nav only; buttons; footer not linked; JS required |
| Indexability | 25 | One URL; 404 technical files; good www/HTTPS |
| On-page SEO | 18 | Generic title, no description, unstable H1, heading misuse |
| Keyword Targeting | 20 | No map; homepage owns every intent |
| Content Quality | 48 | Real depth on hybrid/SubAir/projects; thin FAQs; claims; modal trap |
| Local SEO | 42 | Bahrain/Sitra/phones/hours exist; NAP conflicts; coarse address |
| Schema | 5 | None |
| Internal Linking | 18 | No service graph |
| Image SEO | 30 | Some alts; 246 MB, spaces, no lazy/srcset |
| Mobile SEO | 58 | Viewport + responsive; hover-only gaps |
| Performance SEO | 22 | 817 KB JS, huge LCP/gallery PNGs |
| AEO / AI Search | 25 | Two good definitions; empty raw HTML; no FAQ/entity pages |
| Trust / E-E-A-T | 38 | Real projects vs public edit UI, claim risk, no legal |

**Overall SEO readiness: 29/100**

Criteria: 0–20 missing fundamentals; 21–40 partial signals; 41–60 usable but not competitive; 61–80 solid; 81–100 excellent technical + IA + content. This site is **partial local/content signal, missing fundamentals**.

---

## 38. Proposed SEO Site Architecture

Preserve `/`. Do not use city doorways. Trailing slashes recommended for consistency.

| Proposed URL | Target Topic | Primary Keyword | Intent | Existing/New | Priority |
| ------------ | ------------ | --------------- | ------ | ------------ | -------- |
| `/` | Brand + sports construction contractor Bahrain | sports construction company Bahrain | Commercial + brand | Existing | P0 |
| `/about/` | Company, ISO, Sitra, history | Fast & Safe Maintenance Services Bahrain | Informational | New | P1 |
| `/services/` | Service hub | sports facility construction Bahrain | Commercial | New | P1 |
| `/services/artificial-grass/` | Artificial / synthetic turf | artificial grass installation Bahrain | Commercial | New | P0 |
| `/services/natural-grass/` | Natural pitches | natural grass pitch construction Bahrain | Commercial | New | P0 |
| `/services/hybrid-grass/` | Hybridgrass / hybrid stitching | hybrid grass system Bahrain | Commercial | New | P0 |
| `/services/subair-system/` | SubAir + vacuum drainage | SubAir system installation Bahrain | Commercial | New | P0 |
| `/services/fencing/` | Sports & security fencing | sports fencing contractor Bahrain | Commercial | New | P1 |
| `/services/building-construction/` | Civil / turnkey | building construction company Sitra Bahrain | Commercial | New | P1 |
| `/services/swimming-pools/` | Pools | swimming pool construction Bahrain | Commercial | New | P1 |
| `/services/horse-walkers/` | Equine walkers | horse walker installation Bahrain | Commercial | New | P2 |
| `/services/carpentry/` | Wood works | carpentry and wood works Bahrain | Commercial | New | P2 |
| `/projects/` | Portfolio hub | sports construction projects Bahrain | Proof | New | P1 |
| `/contact/` | NAP + quote | Fast & Safe Sitra contact | Local | New | P1 |

**Optional later (not in the 14):** individual project URLs (Hoora, Isa Sports City, Rashid) after unique copy; `/privacy/`; geothermal **only if** confirmed.

**Not recommended:** `/manama/`, `/riffa/` clones; landscape/interior/sports-flooring pages without more evidence.

**Hash mapping (keep as in-page aliases after launch):** `#hybridgrass` → hybrid page, `#sub-air-system` → SubAir page, `#expertise` → hub or first service, `#projects` → projects, `#contact` → contact, `#about` → about.

---

## 39. Proposed Implementation Phases

Do **not** execute in this audit phase.

### Phase 1 — Technical SEO foundation

Indexability, crawling, robots, sitemap, canonical hostname, `index.html` metadata, favicon, Vercel rewrite strategy, choose prerender vs CSR+head-only, 404 plan.

### Phase 2 — Keyword strategy

Approve the keyword-to-page map after Keyword Planner / GSC / Trends validation. Lock one primary keyword per URL.

### Phase 3 — Homepage SEO

Stable H1, title, description, OG; reduce cannibalization; **no layout redesign**.

### Phase 4 — Core service SEO

Expose existing `expertise.ts` + showcase copy on crawlable pages (reuse components). Unique titles/H1s. Fix project location field.

### Phase 5 — Missing service landing pages

Hybrid, SubAir, then fencing/building/pools; horse walker/carpentry if still justified. No unverified extra services.

### Phase 6 — Local Bahrain SEO

NAP unification, hours, map query, hide public CMS, legal page, claim review.

### Phase 7 — Schema

JSON-LD matching visible content only.

### Phase 8 — Internal linking

Footer/nav `<a href>`, contextual links, optional breadcrumbs (**visible — approve design**).

### Phase 9 — Image SEO

Alts, dimensions, lazy, compression/format; rename only with a map.

### Phase 10 — AEO / AI SEO

FAQs and definition blocks per service; soften unsubstantiated claims.

### Phase 11 — Performance SEO

LCP, JS split, lazy showcases/audio; no visual redesign.

### Phase 12 — Validation

Build, crawl, Lighthouse (lab), schema validators, link checker, robots/sitemap fetch. Re-measure. Still no ranking guarantees.

---

## 40. Exact Recommended Next Phase

**Start Phase 1 — Technical SEO foundation only.**

Do not add service pages, rewrite marketing copy, restyle Tailwind, or install prerender packages until Phase 1 scope is approved.

Phase 1 deliverables (when you say go):

1. Homepage `<title>`, meta description, canonical `https://www.fsmsbh.com/`, robots, OG/Twitter placeholders.  
2. `public/robots.txt` + `public/sitemap.xml` (homepage).  
3. Favicon (and OG image asset).  
4. Written decision: prerender/SSG vs metadata-only CSR (recommendation: **plan unique URLs + prerender/SSG**, implement routing in Phase 4–5).  
5. `vercel.json` rewrite/404 **design** (implement when first extra route ships).  
6. Confirm official legal name, email, phones, street address **from the business** before schema.

**Design lock reminder:** Phase 1 should change **invisible / head / static files** only, except favicon in the tab. Visible H1/NAP/footer-link changes belong to later approved phases.

---

## Appendix A — Production header evidence (14 Sep 2026)

- `https://www.fsmsbh.com` → `200`, `Server: Vercel`, `Content-Length: 397`, HSTS  
- `https://fsmsbh.com` → `308` `Location: https://www.fsmsbh.com/`  
- `http://www.fsmsbh.com` → `308` to HTTPS www  
- `/robots.txt`, `/sitemap.xml`, `/favicon.ico`, `/manifest.json`, `/services/artificial-grass` → `404`  
- JS `index-CNlKet0d.js` = 837094 bytes  
- Sample hero PNG = 958127 bytes  

## Appendix B — Competitor research preparation (no metrics)

Do not invent competitor rankings. Later research categories:

| Category | Example searches to run (validate volume later) |
| -------- | ----------------------------------------------- |
| Direct sports-surface contractors in Bahrain | `artificial grass company Bahrain`; `football pitch contractor Bahrain`; `sports construction Bahrain` |
| Hybrid / elite pitch specialists (GCC ranking in BH) | `hybrid grass Bahrain`; `hybrid turf stadium GCC` |
| Subsurface drainage / SubAir-type | `SubAir installation Middle East`; `pitch vacuum drainage Bahrain` |
| Fencing / stadium netting | `sports fencing Bahrain`; `stadium netting contractor Bahrain` |
| Civil / youth facilities | `youth centre construction Bahrain`; `contractor Ministry of Youth Bahrain` |
| Pools | `swimming pool contractor Bahrain` |
| Equine | `horse walker Bahrain`; `equestrian contractor Bahrain` |
| Brand SERP | `Fast & Safe Maintenance Services`; `fsmsbh`; `Fast N Safe Bahrain` |

Record who ranks, title patterns, schema use, and whether they have service URLs — **External validation required**.

## Appendix C — Scoring and data limitations

Not verified in this audit: Google Search Console, Bing Webmaster, Lighthouse run, CrUX, rankings, backlinks, GBP, Sijilat CR, ISO certificates, FIFA licensee status, EmailJS deliverability, Vercel project env, whether a second GitHub Pages site is live.

---

*End of audit. Wait for stakeholder review before any website changes.*
