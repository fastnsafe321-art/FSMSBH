# Fast & Safe Maintenance Services — Phase 6 Keyword and Heading Alignment

**Date:** 15 September 2026  
**Scope:** Local homepage heading and copy alignment to the primary topic **Football pitch construction in Bahrain**, with supporting installation, replacement, drainage, and irrigation wording.  
**Live website:** Unchanged. No commit, push, deploy, upload, Search Console submission, or hosting change was performed.

Phases 2A–5 remain in place. The homepage is still one URL. Approved title, meta description, canonical, robots, sitemap, JSON-LD, Google tag `G-SP37M5NYJ5`, and site-verification meta were not edited. Photographs, colors, typography classes, spacing, navigation destinations, consultation behavior, prerender/hydration, image delivery, carousel prefetch, localStorage keys, and deferred Firebase were preserved.

Keywords were written as natural sentences. No volumes, rankings, or density targets were invented. This is **not** a claim that these phrases are the most searched terms.

---

## 1. Exact source files changed

| File | Why |
| ---- | --- |
| `src/components/HeroCarousel.tsx` | Persistent H1; authorized intro; slide-specific image alts; H1 removed from `AnimatePresence`. |
| `src/components/HybridGrassShowcase.tsx` | Section H2; Hybrid Grass for Sports Pitches label. |
| `src/components/SubAirVentShowcase.tsx` | Section H2. |
| `src/components/sections/AboutSection.tsx` | Section H2. |
| `src/components/PremiumPitchesTech.tsx` | Services H2. |
| `src/components/sections/ExpertiseSection.tsx` | Section H2; cards show `displayName`. |
| `src/components/sections/ProjectsSection.tsx` | Section H2. |
| `src/App.tsx` | Safety H2; merge keeps `name` as the storage key and prefers source `displayName`. |
| `src/components/SitraMap.tsx` | Sitra / contact H2. |
| `src/components/modals/ExpertiseDetailsModal.tsx` | Modal title and alts use presentation label. |
| `src/data/expertise.ts` | Turf `displayName` + summaries; fencing summary clarified. |
| `src/data/projects.ts` | Short factual card descriptions from documented work. |
| `src/types/index.ts` | Optional `displayName` on `Expertise`. |
| `scripts/homepage-prerender.mjs` | Require the new H1 and section headings. Deterministic render, nonempty `#root`, metadata, JSON-LD, preload, and hydration safeguards were not disabled. |

Local evidence and helpers (not product UI):

| File | Why |
| ---- | --- |
| `scripts/capture-phase6-before.mjs` | Before shots and heading outline. |
| `scripts/verify-phase6-browser.mjs` | After shots, one-H1 check, nav/tabs/modals. |
| `scripts/capture-phase6-hero-slides.mjs` | Slide 2/3 shots after scrolling back to the hero. |
| `seo-audit-evidence/phase-6/` | Before/after shots, outlines, browser-check JSON. |
| `SEO_PHASE_6_KEYWORD_HEADING_ALIGNMENT.md` | This report. |

`index.html`, `src/data/site-schema.ts`, `public/robots.txt`, and `public/sitemap.xml` were **not** edited.

---

## 2. Before / after headings and edited summaries

Before record: `seo-audit-evidence/phase-6/heading-outline-before.json` and `before-*-desktop.png` (isolated Chrome against the then-current `http://127.0.0.1:3000/`). After record: production preview `http://127.0.0.1:4180/` (`after-*-desktop.png`, `after-*-mobile.png`, `heading-outline-after.json`, `heading-outline-prerender.json`).

The mobile before-hero frame was taken after Vite HMR had already applied the new intro, so that one image is **not** a clean before. The before heading outline and desktop before-hero are the valid before record.

Existing `className`s and section IDs were kept. Eyebrows stay short and do not repeat the full H2.

| Location | Before | After |
| -------- | ------ | ----- |
| Hero H1 | `WE BUILD THE GROUND` / `NATURAL GRASS PLAYS THE GAME` (swapped per slide) | **Football Pitch Construction in Bahrain** (persistent; wraps on the existing two styled lines) |
| Hero slide 1 intro | Elite sports-facility copy including standalone “sports flooring” | Authorized Sitra / installation / replacement intro (below) |
| Hybrid H2 | What is HYBRIDGRASS System | Hybrid Grass Systems for Football Pitches |
| Hybrid label | Bahrain Elite Arena Certified | Hybrid Grass for Sports Pitches |
| SubAir H2 | How SubAir Technology Works | Football Pitch Drainage & Root-Zone Aeration |
| About H2 | Expertise in Construction & Engineering | Fast & Safe Maintenance Services in Bahrain |
| Services H2 | Advanced Engineered Sports Surface Technologies | Natural & Artificial Football Pitch Systems |
| Expertise H2 | What We Deliver | Turf Installation & Construction Services |
| Projects H2 | Featured Portfolio | Football Pitch & Construction Projects |
| Safety H2 | Integrated ISO Quality & Safety Loop | Quality & Safety in Project Delivery |
| Sitra H2 | Sitra Regional Office & Estimating Depot | Contact Fast & Safe in Sitra, Bahrain |
| Artificial-grass card | `ARTIFICIAL GRASS INSTALLATION` / Professional synthetic turf systems for sports and leisure. | Display **Artificial Football Turf Installation** / Artificial turf installation and replacement for football pitches and sports facilities in Bahrain. |
| Natural-grass card | `NATURAL GRASS INSTALLATION` / Top-tier natural turf solutions for professional pitches. | Display **Natural Grass Pitch Installation** / Natural grass sports-pitch installation with ground preparation, rootzone construction and irrigation. |
| Fencing card summary | Secure perimeter and sports-specific fencing solutions. | Perimeter fencing and sports safety netting for facilities and athletic sites. |

Hero slide 1 intro now reads:

> Fast & Safe Maintenance Services installs artificial turf and natural grass sports pitches in Bahrain. Our published projects include football turf replacement for clubs and sports facilities. Based in Sitra, we welcome enquiries about pitch installation and replacement.

Slide 2 and 3 descriptions were kept. CTAs, timing, and image transitions were not redesigned.

### Service identity (verified)

`name` remains the lookup and storage key (`ARTIFICIAL GRASS INSTALLATION`, `NATURAL GRASS INSTALLATION`, and the other existing names). Consultation dropdown values stay `ACTIVITIES` (`Artificial Grass Installation`, etc.). Isolated verification opened the form with `Artificial Grass Installation`. Saved browser arrays were not migrated.

### Project card descriptions

| Project | After (card `desc`) | Basis |
| ------- | ------------------- | ----- |
| Hoora Youth Centre | Construction of two football field grounds and a services building at Hoora, including site preparation, drainage, and turf laying. | Existing desc + details |
| North Sehla Youth Empowerment Center | Turnkey construction from foundation to fit-out, including civil works, structural concrete, and sports facilities. | Existing desc + details |
| Isa Sports City | Replacement of artificial grass at the Bahrain Football Association facility, including removal of the existing surface and installation of synthetic turf. | Existing desc + details. FIFA-grade wording **omitted** (certification claim). |
| Rashid Equestrian Club | Infrastructure including stables for 80 horses and a Jockey Academy, with ventilated stables and horse-walker works. | Existing desc + details |
| Bahrain School - Juffair | Construction of artificial grass fields for educational athletics. | Existing desc. Usage/safety outcomes **omitted**. |
| Amwaj Islands Resort Aquatic Project | Turnkey design and structural concrete construction of infinity-edge pools. | Existing desc. “High-end” **omitted**. |
| Ma'ameer Club Sports Ground | Installation of synthetic sports fields with safety containment netting, perimeter fencing, and field lighting. | Existing desc + details |
| Sitra / Ettihad / Najma / Al Ahli Clubs | Replacement of artificial grass. | Replacement is the only solid shared scope. |
| Malkiya Club | Replacement of artificial grass, including removal of the existing surface and sub-grade drainage works. | Details |
| Isa Town Club | Replacement of artificial grass, including seam welding and perimeter containment. | Details |
| Ittifaq Club | Replacement of artificial grass, including sand and rubber infill. | Details |
| Budaiya Club | Replacement of artificial grass, including removal of the existing turf and sub-base leveling. | Details |

Names, clients, years, galleries, and modal `details` were not rewritten.

### Hero image alts

Inspected the three hero photographs. Slogan/date tags were replaced. No stadium, client, or location was inferred.

| Slide | After `alt` |
| ----- | ----------- |
| 1 | Floodlit football pitch at night with marked grass and empty stadium stands |
| 2 | Close-up of a football pitch sideline and turf under stadium floodlights |
| 3 | Workers unrolling natural grass sod on a sports pitch |

---

## 3. Keywords actually implemented and their locations

Status: **Exact** = the phrase appears as written. **Related** = the topic is supported by other wording. No ranking claim.

| Topic | Wording | Location | Source | Initial HTML or interaction-only |
| ----- | ------- | -------- | ------ | -------------------------------- |
| Football pitch construction in Bahrain | `Football Pitch Construction in Bahrain` | Visible H1; already in title / JSON-LD WebPage `name` | `HeroCarousel.tsx`; `index.html`; `site-schema.ts` | Initial HTML |
| Artificial turf and natural grass sports pitches in Bahrain | Authorized hero intro | Hero slide 1 description | `HeroCarousel.tsx` | Initial HTML |
| Football turf replacement | `football turf replacement for clubs and sports facilities` | Hero intro | `HeroCarousel.tsx` | Initial HTML |
| Artificial football turf installation | `Artificial Football Turf Installation` + summary | Expertise H3 / card | `expertise.ts`; `ExpertiseSection.tsx` | Initial HTML |
| Natural grass pitch installation | `Natural Grass Pitch Installation` + ground preparation, rootzone, irrigation | Expertise H3 / card | `expertise.ts` | Initial HTML |
| Sports turf / pitch systems | Services H2; About body still describes sports turf installations | `#services`; `#about` | `PremiumPitchesTech.tsx`; `AboutSection.tsx` | Initial HTML |
| Pitch drainage and root-zone aeration | SubAir H2 | `#sub-air-system` | `SubAirVentShowcase.tsx` | Initial HTML |
| Hybrid grass for football pitches | Hybrid H2 | `#hybridgrass` | `HybridGrassShowcase.tsx` | Initial HTML |
| Sitra contact | Sitra H2; Sitra also in hero intro and company location | `#office-location`; hero | `SitraMap.tsx`; `HeroCarousel.tsx` | Initial HTML |
| Brand in Bahrain | About H2 | `#about` | `AboutSection.tsx` | Initial HTML |
| Secondary services | Existing names kept (fencing, building, pools, horse walkers, carpentry) | Expertise cards | `expertise.ts` | Initial HTML |

Exact Phase 1 strings such as `artificial football turf installation Bahrain` were **not** forced into every heading. “Bahrain” is in the H1, About H2, Sitra H2, and the turf summary, not in every H2.

---

## 4. Wording deferred because evidence was insufficient

| Item | Why deferred |
| ---- | ------------ |
| FIFA-grade / FIFA Quality Pro in the Isa Sports City **card** | Certification implication. Modal details still contain the older “international federation standards” sentence; that body was not rewritten. |
| Distinct blurbs for Sitra, Ettihad, Najma, and Al Ahli | Extra detail was marketing (certified fibers, next-generation, elite bounce). Replacement-only copy was kept. |
| Daily-usage / impact-attenuation outcomes on Bahrain School | Outcome claim, not a documented deliverable. |
| “High-end” on Amwaj | Puffery. Structural/infinity-edge facts kept. |
| Hybrid body paragraph (“leading certified partner…”) | Only the heading was authorized. Educational body was left as-is. |
| Exact phrase `sports turf installation in Bahrain` in every section | Supported as related copy; not stuffed. |
| Footer keyword lists or new targets for geothermal, DrainTalent, interiors, landscaping | Out of scope. Footer list unchanged. |
| Changing consultation `ACTIVITIES` values to the new display labels | Would break form values and matching. Presentation label used instead. |

---

## 5. Local verification

Fresh `vite build` (15 September 2026) via `node .\node_modules\vite\bin\vite.js build`. Image pipeline: `created: 0`, `reused: 312`. Prerender inject **174,884** characters. Preview: `http://127.0.0.1:4180/`. Isolated Chrome blocked gtag, Analytics, Firestore, and EmailJS. No enquiry was submitted. Application configuration was not edited. Tag `G-SP37M5NYJ5` was not changed.

`npx` wrappers fail on this path because of `&` in `F&S`. TypeScript and Vite were invoked through `node .\node_modules\...`.

| Check | Result |
| ----- | ------ |
| TypeScript | **Pass** (`tsc --noEmit`, 0 errors) |
| Production build + prerender | **Pass**. Required H1 and H2 texts asserted on stripped heading text |
| Prerendered H1 | Exactly one: Football Pitch Construction in Bahrain |
| Prerendered section H2s | All eight authorized headings present |
| Title / description / canonical | Unchanged approved values |
| JSON-LD | One graph; Organization / WebSite / WebPage IDs unchanged |
| `robots.txt` / sitemap | Unchanged; one URL `https://www.fsmsbh.com/` |
| Google tag / verification meta | Unchanged |
| Hydration | No `[hydration]` warnings or runtime exceptions in the isolated session |
| H1 across slides | Count 1 and same wording on slides 1–3 (isolated Chrome + IDE preview) |
| Heading hierarchy | H1 → section H2s → existing H3/H4 children. Footer H2s (`Key Activities`, `ISO Certifications`, `Locations & Contact`) unchanged |
| Visual | Desktop/mobile after shots: headings wrap; no clipping, overlap, or broken CTAs. Font-size classes unchanged |
| Nav | Desktop EXPERTISE hash `#expertise`. Isolated mobile Primary + Mobile menus still present |
| Service tabs | `#services` category buttons still operate |
| Expertise / project modals | Open/close. Expertise modal title: Artificial Football Turf Installation. Project modal: Hoora Youth Centre |
| Consultation | Open/close. Service value still `Artificial Grass Installation`. Form not submitted |
| Lighthouse | Not re-run (optional this phase) |

Evidence: `seo-audit-evidence/phase-6/browser-check.json` (`passed: true`).

---

## 6. Unresolved limitations

- A browser that already has `fast_safe_expertise` or `fast_safe_projects` in localStorage will keep those saved card strings after mount. Isolated verification used an empty profile, so source defaults were shown. Saved data was not rewritten.
- Hybrid educational paragraph still includes certification-partner language. Only the label was changed.
- Slide 3 still says “Premium certified sports turf installations.” That was retained as compatible slide copy, not newly evidenced.
- Hero stat bullets (FIFA Quality, GSA partner, 105m × 68m) were not in the authorized rewrite and were left as existing UI.
- Historical helpers (`inspect-dist-html.mjs`, `verify-phase-2d-remaining.mjs`, and similar) still look for the old H1 if re-run. They are not on the production build path.
- Phase 5 leftover items (div click-targets, modal focus trapping, public Add/Delete project controls, footer `href="#"`) were not part of this phase.

---

## 7. What changed and what passed

The homepage now states the primary topic in a single visible H1 — **Football Pitch Construction in Bahrain** — and that wording stays put while the carousel changes photographs and supporting copy. Section headings now name football-pitch systems, drainage, turf installation, and the Sitra contact point without turning the footer into a keyword list or inventing credentials.

Service keys, consultation values, and saved-data merge still use the old names. Visitors see the new turf labels and summaries. Project cards use short descriptions taken from each record; where replacement is all that is documented, the cards repeat that fact.

Locally, the production build, TypeScript check, prerender assertions, one-H1 carousel check, metadata/JSON-LD, and nav/modal/consultation open-close all passed. Nothing was committed, pushed, or deployed.

**Stop point:** Phase 6 is complete on this machine. Deployment remains deferred until explicitly requested.
