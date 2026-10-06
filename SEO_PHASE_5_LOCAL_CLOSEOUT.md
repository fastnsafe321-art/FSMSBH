# Fast & Safe Maintenance Services — Phase 5 Local Close-out

**Date:** 15 September 2026  
**Scope:** Remaining heading semantics, the known `contactMethod` TypeScript error, an implemented-keyword inventory, a consolidated local check, and current Lighthouse lab scores.  
**Live website:** Unchanged. No commit, push, deploy, upload, Search Console submission, or hosting change was performed.

Phases 2A–4 remain in place. Visible copy, layout, colors, photographs, animation timing, navigation, and modal behavior were not redesigned. Keywords were inventoried, not added. Rankings, indexing, rich results, and AI citations are **not** guaranteed. SEO work is **not** complete while the items in §6 remain.

---

## 1. Exact files changed

| File | Why |
| ---- | --- |
| `src/components/HybridGrassShowcase.tsx` | Hotspot popover titles `h4`→`p` (tooltip labels, not headings). |
| `src/components/SubAirVentShowcase.tsx` | Walkthrough / optimization / benefits titles promoted to `h3`; phase-button titles `h5`→`span`; benefit cards `h5`→`h4`. |
| `src/components/PremiumPitchesTech.tsx` | System-list labels inside buttons `h4`→`span` (`block` kept so truncate/layout match). |
| `src/types/index.ts` | Exported `ContactMethod` and `ConsultationFormState` (`Omit<ConsultationForm, 'service'>`). |
| `src/App.tsx` | Form state typed as `ConsultationFormState`; removed `as any`. |
| `src/components/modals/ConsultationModal.tsx` | Shared `ConsultationFormState` and `Dispatch<SetStateAction<…>>` setter. Local `contactMethod: string` removed. |

Local evidence and helpers (not product UI):

| File | Why |
| ---- | --- |
| `scripts/capture-phase5-before.mjs` | Before shots of Hybrid, SubAir, Premium Pitches. |
| `scripts/verify-phase5-browser.mjs` | After shots, hydration, nav, tabs, carousel, modals. |
| `scripts/inventory-phase5-keywords.mjs` | Extract from built HTML. |
| `scripts/run-phase5-lighthouse.mjs` | Temporary runner for cached Lighthouse 13.4.1. Not added to `package.json`. |
| `seo-audit-evidence/phase-5/` | Before/after shots, outlines, keyword extract, Lighthouse reports. |
| `SEO_PHASE_5_LOCAL_CLOSEOUT.md` | This report. |

`index.html` head tags were not edited. Google tag `G-SP37M5NYJ5` and `google-site-verification` are unchanged.

---

## 2. Heading corrections

Before record: `seo-audit-evidence/phase-5/before-*-desktop.png`, `before-*-mobile.png`, `heading-outline-before.json` (Phase 4 preview at `http://127.0.0.1:4178/`).

Semantics were chosen from structure. Tab and phase **labels** are not headings. Existing `className`s were kept. `span` replacements add `block` so they match the previous heading box.

| Location | Before | After | Why |
| -------- | ------ | ----- | --- |
| Hybrid hotspot popovers | `h4` titles | `p` | Interaction-only tooltips. |
| Hybrid Macro-porous / Bahrain Elite | `h4` | Unchanged | Valid children of nearby `h3`s. |
| SubAir drainage walkthrough | `h4` under a different column’s `h3` | `h3` | Its own subsection of “How SubAir Technology Works”. |
| SubAir phase buttons | `h5` Heavy Rain / Percolation / … | `span` | Interactive phase labels. |
| SubAir Smart System Optimization | `h4` then a following `h3` | `h3` | Sibling feature, not a child of Rapid Water Removal. |
| SubAir Key Benefits | `h4` + `h5` cards | `h3` + `h4` cards | Benefits section sits under the H2, not under Air Injected. |
| Premium system list | `h4` inside buttons, so H2→H4 | `span` | Tab/module labels. Selected system remains `h3` in the panel. |
| Premium pipeline steps | `h4` under “The Entire Project…” `h3` | Unchanged | Correct. |

One H1 remains: **WE BUILD THE GROUND NATURAL GRASS PLAYS THE GAME** (first hero slide in initial HTML). Carousel still swaps that same H1 when the slide changes. No hidden or duplicate H1.

Desktop/mobile after shots match the before shots for Hybrid, SubAir, and Premium Pitches.

---

## 3. TypeScript correction

**Cause.** `ConsultationModal` declared its own `FormData` with `contactMethod: string` and `setFormData: (data: FormData) => void`. `App` stored `Partial<ConsultationForm>`, whose `contactMethod` is `'WhatsApp' | 'Phone Call' | 'Email Channel'`. Those types are incompatible, so TypeScript rejected `setFormData={setFormData}` at `App.tsx` line 518. `formData as any` had been hiding the same mismatch.

**Correction.** The existing union is now `ContactMethod`. Form fields owned by App (everything on `ConsultationForm` except `service`, which is `selectedService`) are `ConsultationFormState`. App uses `useState<ConsultationFormState>`. The modal takes `ConsultationFormState` and `Dispatch<SetStateAction<ConsultationFormState>>`. Field values, validation, payloads, Firebase, and EmailJS were not changed. The unused `handleSubmitConsultation` path was left in place.

`npx`/local `tsc --noEmit`: **0 errors.**

---

## 4. Implemented-keyword inventory

One document: `https://www.fsmsbh.com/`. Sections and modals are not extra pages. Comments, audit markdown, unused `FencingShowcase` / `NaturalGrassShowcase`, and Phase 1 strategy files are **not** website content.

**Status key:** **Exact** = the phrase appears as written. **Related** = the topic is supported by other wording. **Not implemented** = a Phase 1 recommendation that was never added. No volumes, difficulty, or ranking claims.

| Keyword/topic | Exact wording | Location | Source file | Initial HTML or interaction-only | Planned/implemented status |
| ------------- | ------------- | -------- | ----------- | -------------------------------- | -------------------------- |
| Football pitch construction Bahrain | `Football Pitch Construction in Bahrain \| Fast & Safe Maintenance Services` | Document title; JSON-LD WebPage `name` | `index.html`; `src/data/site-schema.ts` | Initial HTML | **Exact** in title (Phase 2A approved). Phase 1 primary topic **implemented in metadata**, not as body rewrite |
| Brand | `Fast & Safe Maintenance Services` | Title, meta, footer copyright, About, JSON-LD | `index.html`; `src/constants/index.ts`; `src/data/site-schema.ts`; `Footer.tsx`; `AboutSection.tsx` | Initial HTML | **Exact**. Selected public name, not verified legalName |
| Brand short | `FAST & SAFE` | Navbar / footer mark | `Navbar.tsx`; `Footer.tsx` | Initial HTML | **Exact** short mark |
| Artificial turf + natural grass + Bahrain + Sitra | Approved meta description | `<meta name="description">`; JSON-LD `description` | `index.html`; `site-schema.ts` | Initial HTML | **Exact** (Phase 2A) |
| Natural grass (H1) | `WE BUILD THE GROUND` / `NATURAL GRASS PLAYS THE GAME` | Hero H1 | `HeroCarousel.tsx` | Initial HTML (slide 1) | **Related** to natural-grass pitch work |
| Artificial turf systems | `HIGH-PERFORMANCE` / `ARTIFICIAL TURF SYSTEMS` | Hero title | `HeroCarousel.tsx` | Interaction-only (slides 2–3 reuse the same H1) | **Related** |
| Rootzone / line marking | `FROM ROOTZONE` / `TO FINAL LINE MARKING` | Hero title | `HeroCarousel.tsx` | Interaction-only | **Related** |
| Sports flooring | `sports flooring and irrigation` | Hero slide 1 description | `HeroCarousel.tsx` | Initial HTML | **Related** phrase only. Phase 1 **rejected** “sports flooring contractor Bahrain” as a target — **not implemented** as a keyword |
| Artificial grass installation Bahrain | `ARTIFICIAL GRASS INSTALLATION`; `Professional synthetic turf systems for sports and leisure.`; footer `Artificial Grass Sports Field Construction` | Expertise H3 + card `desc`; footer list | `expertise.ts`; `ExpertiseSection.tsx`; `Footer.tsx` | Names/desc in initial HTML; process steps in modal | **Related**. Exact Phase 1 string `artificial football turf installation Bahrain` is **not** on the page |
| Football turf replacement | `Replacement of Artificial Grass` | Eight club project cards | `projects.ts`; `ProjectsSection.tsx` | Initial HTML | **Related** to Phase 1 supporting term. Exact `football turf replacement Bahrain` **not** used |
| Natural grass pitch construction | `NATURAL GRASS INSTALLATION`; footer `Natural Grass Sports Field Construction` | Expertise; footer | `expertise.ts`; `Footer.tsx` | Initial HTML | **Related**. Exact `natural grass pitch construction Bahrain` **not** used |
| Hybrid grass | `What is HYBRIDGRASS System`; `Hybrid Grass Technology`; nav `HYBRID GRASS`; footer `Hybrid Turf System Installation` | Hybrid section; nav; footer | `HybridGrassShowcase.tsx`; `Navbar.tsx`; `Footer.tsx` | Initial HTML | **Related** educational copy. Phase 1 said do not title the homepage as hybrid OEM — **followed** |
| SubAir | `How SubAir Technology Works`; nav `SUB-AIR TECH`; footer `SubAir System Installation & Integration` | SubAir section; nav; footer | `SubAirVentShowcase.tsx`; `Navbar.tsx`; `Footer.tsx` | Initial HTML | **Related**. Phase 1 “do not target branded SubAir until licensee confirmed” — **not** used in title |
| Sports surface technologies | `Advanced Engineered Sports Surface Technologies` | `#services` H2 | `PremiumPitchesTech.tsx` | Initial HTML | **Related** category wrapper |
| Named pitch systems | `Natural Grass - Hybrid Stitching` (and siblings after tab change) | Services panel H3 / list labels | `PremiumPitchesTech.tsx` | Default system in initial HTML; other systems interaction-only | **Related**. DrainTalent™ / geothermal remain on-page names; Phase 1 said **do not target** |
| Fencing | `FENCING WORKS`; `Fencing Solutions` | Expertise; footer | `expertise.ts`; `Footer.tsx` | Initial HTML | **Related** secondary service |
| Building / turnkey | `BUILDING CONSTRUCTION`; `Civil & Structural Works` | Expertise; footer | `expertise.ts`; `Footer.tsx` | Initial HTML | **Related** |
| Horse walkers | `HORSE WALKER INSTALLATION` | Expertise; footer | `expertise.ts`; `Footer.tsx` | Initial HTML | **Related** niche |
| Swimming pools | `SWIMMING POOL CONSTRUCTION` | Expertise; footer | `expertise.ts`; `Footer.tsx` | Initial HTML | **Related** secondary |
| Carpentry | `CARPENTRY & WOOD WORKS` | Expertise only | `expertise.ts` | Initial HTML | **Related**. Not in footer or consultation dropdown |
| Landscape / irrigation / interior / geothermal | Footer list items | Footer Key Activities | `Footer.tsx` | Initial HTML | **Exact** list names. Phase 1: **do not target** as homepage keywords — **not** added to title |
| Internal nav | `HOME`, `HYBRID GRASS`, `SUB-AIR TECH`, `SERVICES`, `EXPERTISE`, `PROJECTS`, `SAFETY`, `CONTACT` | Primary nav | `constants/index.ts`; `Navbar.tsx` | Initial HTML | **Exact** link text. Hash sections, not pages |
| Brochure link | `Request Technical Specifications Brochure` | Hybrid in-page link to `#contact` | `HybridGrassShowcase.tsx` | Initial HTML | **Exact** |
| Project names | Hoora, North Sehla, Isa Sports City, Rashid, Bahrain School – Juffair, Amwaj, Ma'ameer, Sitra/Malkiya/Ettihad/Isa Town/Ittifaq/Budaiya/Najma/Al Ahli Clubs | Project H3s + card copy | `projects.ts` | Titles/desc in initial HTML; `details` in modal | **Exact** names. Proof cluster, not extra URLs |
| Image alts | Hero uses slide `tag` (`KINGDOM OF BAHRAIN • ESTABLISHED 2010`); Hybrid/SubAir descriptive alts; expertise/project alts = names | `<img alt>` | `HeroCarousel.tsx`; showcases; sections | Initial HTML for first slide / cards | **Exact** as listed in `keyword-extract.json`. Not edited this phase |
| JSON-LD (not visible copy) | Organization / WebSite / WebPage graph; brand name; meta description; `info@fsmsbh.com`; phones | `#root` script | `site-schema.ts`; `JsonLd.tsx` | Initial HTML | **Implemented** in Phase 4. Counted separately from visible copy |
| `sports construction company Bahrain` | — | — | — | — | Phase 1 supporting candidate. **Not implemented** as an exact phrase |
| `Fast N Safe` as title | — | — | — | — | Old title. **Replaced** in Phase 2A |
| Arabic clusters | — | — | — | — | Phase 1: do not target on the English homepage. **Not implemented** |
| Service landing pages | — | — | — | — | Phase 1 Map B. **Not implemented** (still one URL) |
| Unique project one-liners | Eight clubs still share `Replacement of Artificial Grass` | Project cards | `projects.ts` | Initial HTML | Phase 1 later copy review. **Not implemented** |

---

## 5. Current local audit results

Fresh `vite build` (15 September 2026). Preview: `http://127.0.0.1:4179/`. Image pipeline: `created: 0`, `reused: 312`. Prerender inject **174,315** characters. Isolated Chrome blocked gtag, Analytics, Firestore, and EmailJS. No enquiry was submitted. Tag configuration was not edited.

| Check | Result |
| ----- | ------ |
| TypeScript | Pass (`tsc --noEmit`, 0 errors) |
| Sitemap | One URL: `https://www.fsmsbh.com/` (`public/sitemap.xml` / `dist/sitemap.xml`) |
| Title / description / canonical | Unchanged approved values |
| `robots.txt` | `Allow: /` + sitemap line, unchanged |
| Prerendered homepage | Required copy still present; one H1; meaningful `#root` |
| JSON-LD | One graph; IDs resolve; email/phones match visible contact |
| Hydration | No `[hydration]` warnings or runtime exceptions in the isolated session |
| Images | Representative flow used WebP variants (hero next slide `stadium_turf_night_pro…__w1408.webp`). No original-plus-variant pair in that flow. Phase 3A pipeline tests **reused**, not re-run |
| Nav / tabs / carousel / modals | Desktop links, mobile Primary+Mobile, Premium category tabs, next-slide, expertise and project modals open/close |
| Google tag / verification | Unchanged |
| Storage persist / Firebase lazy load | Prior Phase 2D evidence reused |

### Lighthouse (current lab, local preview)

Cached CLI **Lighthouse 13.4.1** (`%LOCALAPPDATA%\npm-cache\_npx\5390d7d89c0de19d\…`). Not added to application dependencies. URL `http://127.0.0.1:4179/`. Categories: Performance, Accessibility, Best Practices, SEO. Animations and images were **not** disabled. Analytics/Firestore/EmailJS URLs were blocked. `max-wait-for-load`: 120000 ms. Throttling: simulate. Mobile 412×823 @ 1.75; desktop preset 1350×940.

Earlier Phase 0 / 2A scores are **not** reused. Phase 2A’s SEO 100 was timeout-affected; these runs have **no** `runWarnings` and `runtimeError: null`. Lighthouse’s process exit code was 1 because some audits scored below 1 — the reports completed.

| | Mobile | Desktop |
| --- | --- | --- |
| Performance | **86** | **99** |
| Accessibility | **96** | **96** |
| Best Practices | **96** | **96** |
| SEO | **100** | **100** |
| LCP | 3784 ms | 876 ms |
| TBT | 59 ms | 0 ms |
| CLS | 0 | 0 |
| FCP | 2301 ms | 504 ms |
| Speed Index | 3064 ms | 1050 ms |

Evidence: `seo-audit-evidence/phase-5/lighthouse-mobile.report.*`, `lighthouse-desktop.report.*`, `lighthouse-summary.json`.

SEO automated checks passed (including meta description). Accessibility 96 is not a pass of every axe rule: remaining fails include hero CTA contrast (`#ffffff` on `#0083C9`, 4.12 < 4.5) and carousel buttons whose visible `01`/`02`/`03` is not inside `aria-label="Go to slide N"`. Best Practices 96 includes missing `favicon.ico` (404) and missing production source maps. Those were not treated as reasons to chase 100.

---

## 6. What remains

### A. Fixed and verified locally

- Metadata, canonical, robots, one-URL sitemap (Phase 2A).
- Prerender + hydration (Phase 2D).
- Image variants, fingerprints, representative delivery (Phases 3–3A).
- Homepage JSON-LD graph and landmark/heading work from Phase 4, plus Phase 5 Hybrid / SubAir / Premium heading semantics.
- `contactMethod` TypeScript error.
- Current local Lighthouse lab scores (above).

### B. Known limitations preserved under the current scope

- Card click-targets are `div`s (keyboard access would change behavior).
- Modal focus trapping not refactored.
- Hero photo still Motion-hidden until JavaScript; copy is prerendered.
- Public Add/Delete project controls remain.
- Footer social icons still `href="#"`.
- Unused `COMPANY_INFO.email` (`fastsafecontracting@gmail.com`).
- Unused `isAddProjectOpen`.
- One-time Phase 3A image-fingerprint adoption exception (historical pipeline rule).
- Unused `FencingShowcase` / `NaturalGrassShowcase` (not shipped UI).
- Lighthouse contrast, carousel name mismatch, favicon 404, and missing source maps — fixing them needs visible color, name, or asset changes.

### C. Decisions or facts needed from the business owner

- Confirmed legal name vs public name; logo file; street address; real social URLs.
- FIFA / ISO / CR / GSA / manufacturer (SubAir, DrainTalent, hybrid OEM) documents before those claims go into schema or metadata.
- Whether football turf stays the lead offer; new-build vs replacement mix.
- Whether service pages, unique project blurbs, or Arabic should ever be added.
- Open Graph / social preview images and a real favicon.

### D. Checks deferred until the user explicitly authorizes deployment

- Production upload and host cache.
- Apex / `www` / `/index.html` redirects on the live host.
- Search Console sitemap submission and indexing status.
- Field performance (CrUX), not this lab preview.
- Google Rich Results Test / live structured-data fetch.
- Production Lighthouse / PSI against `https://www.fsmsbh.com/`.

Optional additions (OG, favicon, service pages, richer schema) are **not** mandatory ranking requirements.

---

## 7. What has improved (plain language)

The homepage already had a real title, description, prerendered content, faster images, and a small accurate schema graph. This close-out finished the leftover heading outline in the Hybrid, SubAir, and Premium sections so screen readers follow the same sections people see, without changing how those sections look. The consultation form now type-checks the three contact methods the form actually offers. A current local Lighthouse run — not an old timeout-affected one — shows SEO 100 in the lab, with performance and accessibility still short of a perfect score for reasons that would need design or hosting work.

---

## 8. Stop point

**Complete locally:** Phases 2A–5 as implemented in this repository. Build, TypeScript, prerender, one JSON-LD graph, heading outline, and the lab scores above.

**Current scores:** Mobile 86 / 96 / 96 / 100 and desktop 99 / 96 / 96 / 100 (Performance / Accessibility / Best Practices / SEO), Lighthouse 13.4.1 on `http://127.0.0.1:4179/`.

**Concrete remaining blocker for going live:** none in the application type-check or build. Deployment, production redirects, indexing, and field measurement are **blocked only by the user’s deployment decision**. Business facts (logo, address, social URLs, credentials) still block richer schema and some copy claims.

Nothing was committed, pushed, or deployed. Phase 5 stops here. Deployment remains deferred until explicitly requested.
