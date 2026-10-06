# Fast & Safe Maintenance Services — Phase 1 Keyword Strategy

**Role:** Research and documentation only. No application code, visible wording, design, layout, navigation, modals, forms, animations, images, metadata, dependencies, Firebase, localStorage, hosting, or deployment settings were changed.

**Date:** 14 September 2026  
**Baseline:** `SEO_PHASE_0_AUDIT.md` (commit `2257364`, production host `https://www.fsmsbh.com/`)  
**Public name used in this report:** Fast & Safe Maintenance Services — **provisional**, taken from on-site footer / `COMPANY_INFO.fullName`. Pending owner confirmation.

**This document is not a ranking prediction, traffic forecast, or keyword-volume study.** Monthly volume, difficulty, CPC, rankings, and traffic are **Not verified**. Autocomplete was not captured. Tenders are procurement evidence, not search-volume evidence.

---

## How to read labels

| Label | Meaning |
| ----- | ------- |
| **Verified evidence** | Observed in the public site, repository copy, live HTTP from Phase 0, a fetched public page, or a named search-result page on 14 September 2026 |
| **Provisional recommendation** | Research judgement for planning. Not approved for implementation |
| **Pending owner confirmation** | Fact or commercial choice the owner has not answered |

---

## Research environment (applies to every keyword record)

| Item | Status |
| ---- | ------ |
| Tool | Cursor web search and selected page fetches, 14 September 2026 |
| Google Search Console | **Not tested** |
| Keyword Planner / Ahrefs / Semrush | **Not used** — no paid subscriptions requested |
| Search location | **Not a Bahrain-localized Google session.** Tool-mediated results from an unspecified environment. Do not treat observed pages as a Bahrain Google ranking |
| `site:fsmsbh.com` | Still **Not verified** (Phase 0: captcha / empty tool result) |
| Autocomplete / related searches | **Not captured** |

---

# 1. Corrected interpretation of Phase 0

Phase 0 remains the technical inventory. This section corrects overstatement. It does not repeat the full audit.

## 1.1 Baseline corrections (apply before any recommendation)

| Correction | Implication |
| ---------- | ----------- |
| A successful browser / CDP render is **not** proof of Googlebot rendering or indexing | Phase 0’s ~13,800-character live DOM shows the homepage *can* render in a capable browser. Indexing, Googlebot rendering, and Search appearance remain **Not verified** |
| An intended indexable URL is not a confirmed indexed URL | `https://www.fsmsbh.com/` is the **intended** indexable document. It is **not** confirmed as indexed |
| Missing `robots.txt` or `sitemap.xml` do not, by themselves, block indexing | Phase 0 live 404s are discovery and hygiene gaps, not a demonstrated deindex |
| `https://www.fsmsbh.com` and `https://www.fsmsbh.com/` are the **same root URL** | Do not report them as duplicate pages. `/index.html` **is** a distinct URL to evaluate |
| One homepage is an architectural constraint, not proof the site cannot rank | A single URL can hold brand plus one coherent commercial category |
| A homepage can serve both brand and category | Do not force an artificial brand-versus-category choice |
| Buttons that open consultation modals are appropriate buttons | Do not convert quote actions to links merely to satisfy an SEO checklist |
| An imported but unused component is not proof its code ships | `FencingShowcase` and `NaturalGrassShowcase` are imported in `src/App.tsx` and not rendered. **No bundle evidence** was produced in this phase. Do not claim JS savings |
| No certificate in the repository means “not verified from available evidence,” not “false” | FIFA, ISO, CR, GSA partner, and similar claims stay **unverified** until documents or owner confirmation |
| A manifest, apple-touch icon, source maps, and `llms.txt` are **not** mandatory SEO requirements | Treat as optional hygiene, not ranking blockers |
| Timeout-affected Lighthouse results are **provisional** | Phase 0 mobile/desktop runs warned the page loaded too slowly. Do not publish those LCP/TBT figures as trusted field or complete lab results |
| General bot-specific HTML or an unverified prerender plugin is **not** the selected architecture | Rendering remains an open later assessment. Not part of Phase 2A |

## 1.2 Reclassified Phase 0 “P0” items

**Reserve critical (P0) priority for demonstrated failures with critical impact.** After the corrections above, **no Phase 0 P0 item remains a demonstrated critical-impact indexing failure.**

| Phase 0 ID | Original class | Corrected class | Why |
| ---------- | -------------- | --------------- | --- |
| P0-01 Thin CSR shell | P0 | **P1 — architecture / first-HTML hygiene** | Thin first HTML is verified. Googlebot failure is **not** verified. Non-JS scrapers see only `Fast N Safe` |
| P0-02 One HTTP URL | P0 | **P1 — IA constraint / later expansion** | One URL cannot have unique titles per service. That does not prove the homepage cannot rank for one coherent topic |
| P0-03 Missing robots.txt / sitemap | P0 | **P2 — discovery hygiene** | Missing files do not block indexing. Useful once a canonical URL is declared |
| P0-04 Missing description / canonical / OG | P0 | **P1 — snippet and duplicate-URL hygiene** | Missing description is a verified Lighthouse SEO fail and weak snippet control. Missing canonical matters because `/index.html` is a distinct 200 URL. OG is optional social/unfurl, not a ranking requirement |
| P0-05 Unverified FIFA / ISO / GSA / “leading partner” | P0 Potential | **P1 Potential — claims risk** | Absence of certificates is **not verified**, not **false**. Keep out of titles, descriptions, and schema until confirmed |

**Still P1, unchanged in substance:** `/index.html` 200 without a preferred canonical; brand-string inconsistency; modal-gated depth; image payload (provisional Lighthouse); public Add/Delete controls (functionality, not this phase).

**P3 / not SEO-mandatory:** `llms.txt`, source maps, apple-touch icon, web manifest.

## 1.3 What Phase 0 already established (used, not re-audited)

Verified from Phase 0 and re-used here:

- Single-page React 19 + Vite 6 site; no router; one intended indexable document.
- Production raw HTML is a CSR shell titled `Fast N Safe`; no meta description or canonical.
- Apex and HTTP redirect to `https://www.fsmsbh.com/`.
- `/index.html` returns 200 with the same shell (distinct URL).
- Hash sections and modals are not separate pages.
- Consultation CTAs are buttons that open a modal — appropriate for quote intent.
- Lighthouse SEO 91/100; only automated SEO fail was missing meta description; both runs were timeout-affected (**provisional**).

No production HTTP or Lighthouse re-run was required for this phase.

---

# 2. Service decision matrix

**Rules**

- **A** = clearly presented on the public website (visible section, expertise card, footer list, or hero copy).
- **B** = supported by a specific published project claim (named site / client / year in `projects.ts` or equivalent public card).
- **C** = confirmed by the business owner. **None are C.** A or B is never treated as C.
- Provisional research proceeds for A and B. Missing owner answers do not block unrelated research.

## 2.1 Classification summary

| Class | Services |
| ----- | -------- |
| **A — presented on the website** | Artificial grass; natural grass; hybrid grass; SubAir; fencing; building / turnkey; swimming pools; horse walkers; carpentry (expertise grid). Footer also names geothermal, landscape & irrigation, interior fit-out. Hero mentions sports flooring and irrigation. Process step names post-handover turf care |
| **B — specific published project claims** | Artificial grass (multiple named clubs + school + Isa Sports City); fencing as part of Ma'ameer; building / youth-centre works (Hoora, North Sehla); swimming pools (Amwaj); horse walkers / equine facilities (Rashid). Natural grass at Hoora is **ambiguous** (turf not named as natural vs artificial). Hybrid, SubAir, DrainTalent, geothermal, carpentry, landscape, interior, sports flooring: **no named project that states that system** |
| **C — owner confirmed** | **None** |

## 2.2 Primary services

| Service | Public evidence | Project evidence | Scope described | Business confirmation status | Research priority | Safe keyword scope | Open question |
| ------- | --------------- | ---------------- | --------------- | ---------------------------- | ----------------- | ------------------ | ------------- |
| Artificial grass / synthetic sports turf | **A.** Expertise card `ARTIFICIAL GRASS INSTALLATION`; hero slide 2; `#services` artificial systems (tab-gated); footer “Artificial Grass Sports Field Construction”; consultation activity | **B.** Isa Sports City (2020, AFC client claim); Bahrain School – Juffair (2022); Ma'ameer (2024); Sitra, Malkiya, Ettihad, Isa Town, Ittifaq, Budaiya, Najma, Al Ahli clubs (2022) — eight cards titled “Replacement of Artificial Grass” | Full install path in modal: excavation, base, compaction, shock pad, laying, infill & marking. Sports and leisure in the short blurb; club cards are football-club replacements | **Not C.** Presented and project-backed | **High** | Institutional football turf **installation and replacement** in Bahrain. Not villa-lawn supply | Confirm FIFA Quality Pro wording before any public use. Confirm still selling new builds vs replacement-only |
| Natural grass football pitches | **A.** Expertise `NATURAL GRASS INSTALLATION`; hero slides 1 and 3; `#services` natural tab (default); footer “Natural Grass Sports Field Construction”; consultation activity | **B weak / ambiguous.** Hoora Youth Centre (2019): “two full-sized pitches” and “professional turf laying” — surface type not named. No card titled natural-grass install | Soil analysis, irrigation, laser leveling, Bermuda hybrid cultivars (modal). Hero names sand rootzone, irrigation, 12-month grow-in | **Not C.** Strongly presented; project proof thinner than artificial | **High (as supporting homepage cluster)** | Natural **sports pitch** construction / renovation in Bahrain. Not garden lawns | Confirm grass species actually installed (site: Bermuda hybrid; public GSA tender text: Paspalum). Confirm Hoora surface type |
| Hybrid grass | **A.** `#hybridgrass` section; nav “HYBRID GRASS”; `#services` Hybrid Stitching; footer “Hybrid Turf System Installation”. **Not** in the consultation dropdown | **B absent.** No named project says “hybrid” | Educational explainer: stitched / tufted synthetic fibres in a natural sward; FS-Grass® / Hybridgrass marketing names; FIFA Quality Programme language | **Not C.** Presented as a capability claim | **Medium — educational first** | Informational “what is hybrid grass” plus **generic** hybrid pitch construction **only if** owner confirms a real system. Do not imply GrassMaster / SIS / manufacturer authorization | Which system is installed? Own brand vs licensed third party? Any completed Bahrain hybrid pitch? |
| SubAir / subsurface pitch aeration and drainage | **A.** `#sub-air-system`; nav “SUB-AIR TECH”; `#services` Sub-Air module; footer “SubAir System Installation & Integration”. **Not** in the consultation dropdown | **B absent.** No named project claims a SubAir install | Public copy describes underground air, water, and temperature control. SubAir is also a **third-party product name** (SubAir Systems, Graniteville, SC — https://subairsystems.com/) | **Not C.** Sold-capability *claim* only | **Medium — do not lead** | Generic subsurface aeration / vacuum drainage for natural pitches, or branded SubAir **only after** licensee confirmation. Do not imply manufacturer authorization | Installer / licensee relationship? Completed install? Distinct from DrainTalent? |
| Fencing | **A.** Expertise `FENCING WORKS`; footer “Fencing Solutions”; consultation “Fencing Works”. Unused `FencingShowcase.tsx` is **not public** | **B partial.** Ma'ameer: “safety containment netting” and “heavy-duty perimeter fencing”. Expertise case titles (“Industrial Plant Perimeter”, “City Sports Complex Netting”) have no client names | Palisade, sports netting, gates, mesh — industrial **and** stadium | **Not C.** | **Medium — secondary** | **Sports / stadium** fencing and pitch netting as a companion to turf work. Industrial palisade is a different buyer | Sports vs industrial as the sales lead? Any named industrial client that can be published? |
| Building / turnkey construction | **A.** Expertise `BUILDING CONSTRUCTION`; footer “Civil & Structural Works”; consultation “Building Construction” / “Other / Turnkey Project”; success copy “Fast & Safe Construction” | **B.** Hoora Youth Centre (2019, Ministry): pitches **and** services building. North Sehla Youth Empowerment Center (2023): “full construction from foundation to final fit-out” | Shoring, excavation, structural concrete, turnkey, MEP | **Not C.** | **Medium** | Youth-centre / sports-facility **civil** works in Bahrain. Not generic villa building as the homepage topic | Still offering general building, or sports-facility civils only? |
| Swimming pools | **A.** Expertise `SWIMMING POOL CONSTRUCTION`; footer; consultation activity | **B.** Amwaj Islands Resort Aquatic Project (2022) — infinity-edge concrete pools. Client label is marketing-style (“Amwaj Aquatic Properties”) | Concrete shells, filtration, infinity edge, tiling; residences and hotels in the modal | **Not C.** | **Low–medium** | Keep as a **secondary** service. Do not make the homepage a pool contractor page | Is this an active sales line vs a completed one-off? |
| Horse walkers | **A.** Expertise `HORSE WALKER INSTALLATION`; footer; consultation activity | **B.** Rashid Equestrian Club (2021): stables for 80 horses, Jockey Academy, “drainage-optimized horse walkers” | Automated walkers, rubber floors, rails, safety sensors | **Not C.** | **Low–medium (niche)** | Equine walker **installation** in Bahrain, not equipment manufacturing | Own install vs supply of a named brand? Still actively sold? |
| Carpentry and wood works | **A.** Expertise `CARPENTRY & WOOD WORKS` only. **Not** in footer Key Activities. **Not** in the consultation dropdown | **B absent / weak.** Rashid is stables and walkers, not labelled carpentry. Expertise claims equestrian / residential / commercial timber | Decking, framing, stables woodwork | **Not C.** | **Low** | Do not use generic “carpentry Bahrain” to define the homepage | Is this a current sold line or workshop support for other trades? |

## 2.3 Conditional services (do not treat as homepage or near-term page targets)

| Service | Public evidence | Project evidence | Scope described | Business confirmation status | Research priority | Safe keyword scope | Open question |
| ------- | --------------- | ---------------- | --------------- | ---------------------------- | ----------------- | ------------------ | ------------- |
| DrainTalent | `#services` tab “Natural Grass - DrainTalent™ Vacuum System” only | None | Branded vacuum extraction; manufacturer site https://draintalent.com/ states DrainTalent is part of **SIS Pitches** | **Not C.** Conditional | **Do not target** | None until relationship is confirmed. Treat as third-party product | Licensee / installer? Same as SubAir or different? |
| Geothermal systems | `#services` “Natural Grass - Geothermal Control”; footer “Geothermal Sports Turf Systems” | None | Under-turf hydronic warming; winter dew/frost copy | **Not C.** Conditional | **Do not target** | None | Ever installed in Bahrain? |
| Standalone maintenance contracts | Process step “FASTSAFE MAINTAIN”; hero “12-Month Grow-In”; expertise natural-grass step 08 | None as a sold contract product | Grooming, deep clean, aeration, “12+ year” field-life claim | **Not C.** Conditional | **Low** | Pitch **aftercare** as a supporting phrase, not “maintenance services Bahrain” (handyman SERP) | Are annual pitch-maintenance contracts sold? |
| Landscaping / irrigation | Footer “Landscape & Irrigation”; hero slide 1 lists irrigation with pitches | Irrigation appears as **pitch** irrigation, not garden landscaping. No landscape project card | Name-only as a standalone service | **Not C.** Conditional | **Do not target as landscaping** | Irrigation only as part of **pitch construction** | Separate landscape division? |
| Interior fit-out | Footer “Interior Fit Out Works”; North Sehla details mention “interior design” and “final fit-out” | North Sehla is a turnkey building, not an interiors studio | Name-only as a service line | **Not C.** Conditional | **Do not target** | None | Sold separately? |
| Sports flooring | Hero slide 1 phrase “sports flooring” only | None. Elastic-sub-base copy mentions “padel courts” as a **use case**, not a delivered project | Unsupported as a service page | **Not C.** Conditional | **Reject as a target** | Do not target “sports flooring contractor Bahrain” (see §3) | Do you install acrylic, PU, or indoor sports floors? |

---

# 3. Bahrain keyword research

Numerical demand is **Not verified**. Result types below are **observed pages in this research environment**, not Bahrain Google rankings.

## 3.1 Intent distinctions (apply to every cluster)

| Distinction | What the results showed | Relevance to this company |
| ----------- | ----------------------- | ------------------------- |
| Institutional sports facilities vs residential landscaping | `artificial grass installation Bahrain` mixes **both**: football/sports contractors **and** garden/lawn suppliers | Company’s published projects are **institutional / club / school / ministry**. Residential lawn intent is a mismatch risk |
| Full installation vs turf supply only | Sumworks and similar pages sell **supply**; BLC, Baraka, GFSS, PrimeSports describe **install**. Public tenders specify excavation, grass, fencing, electrical | Site copy and projects describe **install / replace**, not a turf shop |
| Pitch replacement vs new construction | Eight club cards are **replacement**. Hoora and the 2021 MOYS tender are **new** small pitches. GSA 2024 text is natural-grass **renovation** | Both exist in the market. Company’s strongest published set is **replacement** |
| Natural vs artificial vs hybrid | Tenders and news treat natural and artificial as **separate** scopes (e.g. Khaldiya 2026: one natural + one artificial). Hybrid results are mostly **international vendor education**, not local completed-pitch pages | Do not collapse the three surfaces into one keyword |
| Sports fencing vs industrial / residential fencing | GFSS leads with fencing **and** landscaping; Almad is court fencing; industrial palisade is a different trade | Company’s public fencing proof is **pitch netting / perimeter** at Ma'ameer |
| Construction vs maintenance | “Maintenance services Bahrain” returns **home/appliance/property** firms. Pitch maintenance appears on specialist sports sites (PrimeSports nav) | Do **not** let the legal-style name pull the homepage toward handyman intent |
| Branded equipment vs generic engineering | SubAir, DrainTalent, GrassMaster, SIS Grass are **manufacturer brands**. Local contractor pages more often say football pitch / artificial grass | Use generic engineering language unless authorization is confirmed |

## 3.2 Specified candidate comparison

These are **research candidates, not approved targets.**

| Keyword | Language | Intent | Relevant service | Observed result types | Source URL | Date | Geographic limitations | Confidence | Decision |
| ------- | -------- | ------ | ---------------- | --------------------- | ---------- | ---- | ---------------------- | ---------- | -------- |
| artificial grass installation Bahrain | en | Commercial (mixed institutional + residential) | Artificial grass | Local installers and landscapers: BLC Sports, Baraka Sports infrastructure page, GFSS, Al Amin Gardens; also supply-led pages | https://blcsports.com/ ; https://baraka-sports.com/infrastructure/ ; https://gfss.com.bh/ ; https://www.alamingardens.com/ ; Phase 0 also listed Greengrass and Sumworks | 14 Sep 2026 | Not Bahrain-localized Google | Medium–high as a **topic**; volume Not verified | **Narrow, do not use as the sole homepage phrase.** Too much villa/garden overlap. Prefer football-qualified variants |
| football pitch construction Bahrain | en | Commercial institutional; some GCC/international builders | Football pitch construction (surface + civils) | PrimeSports homepage (football pitches + padel/tennis); GFSS football-pitch gallery; Bahrain Tender Board (40×20 m MOYS pitches); news of five new artificial grounds | https://primesports.info/ ; https://gfss.com.bh/gallery/artificial-grass-foot-ball-pitch-baba-garden/ ; https://www.tenderboard.gov.bh/tenderdetails/?id=340%2F2021%2FBTB+%28RFPMYS%2F2%2F2021%29 ; https://www.newsofbahrain.com/bahrain/73802.html | 14 Sep 2026 | Not Bahrain-localized Google | Medium–high as **intent fit** | **Keep as a core supporting term.** Matches Hoora-style new grounds and MOYS procurement language. Broader than turf-only; still football-led |
| artificial football turf installation Bahrain | en | Commercial football-specific install | Artificial football turf | PrimeSports (football + synthetic turf); UAE/GCC pitch builders; manufacturer case pages (UNIGRASS); paid market reports (ignore numbers) | https://primesports.info/ ; https://www.gzunigrass.com/sport/fifa-pro-football-pitch-in-bahrain | 14 Sep 2026 | Not Bahrain-localized Google | Medium | **Preferred commercial qualifier** for the evidenced club work. Narrower than generic “artificial grass” |
| football turf replacement Bahrain | en | Commercial replacement / refurbishment | Artificial (and possibly natural) turf replacement | Public tenders and news (refurbishment of existing grounds; AFC-funded replacement at BFA); fewer dedicated local “replacement” landing pages than “installation” | https://www.biddingsource.com/tenders/6475628 (GSA 2024 refurbishment of 6 grounds — tender listing); https://www.bna.bh/news?cms=q8FmFJgiscL2fwIzON1%2BDjIP2uTSOCfzBKoxXaKX66Y%3D | 14 Sep 2026 | Not Bahrain-localized Google | Medium as **business fit**; SERP is tender-heavy | **Keep as supporting term.** Strongest match to eight club cards. Do not treat tenders as volume. Useful in body/projects, not the only title phrase |
| natural grass pitch construction Bahrain | en | Commercial / procurement | Natural grass pitches | GSA Tender Board renovation at Khalifa Sports City and Muharraq (Paspalum, rootzone, drainage, irrigation); Khaldiya news (new natural + artificial pitches); few specialist contractor landing pages in this result set | https://www.tenderboard.gov.bh/TenderDetails/?id=504%2F2024%2FBTB+%28RFP%2FGSA%2F05%2F2024%29 ; https://www.newsofbahrain.com/business/135267.html | 14 Sep 2026 | Not Bahrain-localized Google | Medium | **Keep as supporting homepage cluster.** Do not use Paspalum in metadata unless that species is confirmed |
| sports construction company Bahrain | en | Commercial category / brand-category | Multi-service sports contractor | PrimeSports (“sport facility construction”); Almad (courts, not football turf); GFSS (fencing + surfacing + landscape) | https://primesports.info/ ; http://www.almadsports.com/ ; https://gfss.com.bh/ | 14 Sep 2026 | Not Bahrain-localized Google | Medium | **Viable category wrapper** with the company name. Risk: padel, tennis, indoor courts this site does **not** evidence. Use only if football/turf remains the first topic |
| sports flooring contractor Bahrain | en | Commercial — **indoor/court floors** | Not an evidenced FSMS line | Almad (acrylic, wooden sports floors, squash); PrimeSports “Sports Flooring & Running Track”; acrylic-floor Instagram/suppliers | http://www.almadsports.com/ ; https://primesports.info/ | 14 Sep 2026 | Not Bahrain-localized Google | High that **intent does not match** | **Reject** as a homepage or near-term target |

## 3.3 Additional researched clusters

| Keyword | Language | Intent | Relevant service | Observed result types | Source URL | Date | Geographic limitations | Confidence | Decision |
| ------- | -------- | ------ | ---------------- | --------------------- | ---------- | ---- | ---------------------- | ---------- | -------- |
| hybrid grass football pitch Bahrain | en | Mixed informational + procurement | Hybrid grass | Local tenders/news about **natural or artificial**, not confirmed local hybrid installs; international hybrid vendors (SIS, GrassMaster); PrimeSports as a general sports contractor | https://www.grassmastersolutions.com/en/grassmaster-overview ; https://www.sispitches.com/us/surface/hybrid-grass/ ; https://www.tenderboard.gov.bh/TenderDetails/?id=504%2F2024%2FBTB+%28RFP%2FGSA%2F05%2F2024%29 | 14 Sep 2026 | Not Bahrain-localized Google | Medium that **buying intent is thin locally** | **Educational supporting content only.** Do not title the homepage as a hybrid OEM |
| SubAir system installation Bahrain | en | Branded product / technical | SubAir claim | Manufacturer and distributor pages (SubAir Systems; Bernhard UK). No Bahrain install page found in this set | https://subairsystems.com/ ; https://bernhard.co.uk/products/subair/ ; https://subairsystems.com/field-notes/world-cup-installations-2021-z5n6w | 14 Sep 2026 | Not Bahrain-localized Google | High that this is **branded equipment search** | **Do not target** until licensee status is confirmed. Qatar World Cup pages are manufacturer PR, not Bahrain demand |
| sports fencing contractor Bahrain | en | Commercial mixed | Fencing | GFSS (fencing + crash barrier + sports fields); Almad security/court fencing; GFSS project list includes BAPCO fencing and sports pitches | https://gfss.com.bh/ ; https://gfss.com.bh/projects/ ; http://www.almadsports.com/ | 14 Sep 2026 | Not Bahrain-localized Google | Medium | **Secondary only.** Sports-pitch fencing is safer than competing as a general fencing firm |
| swimming pool construction Bahrain | en | Commercial residential / hospitality | Pools | Specialist pool builders: Riviera, Bader/Anthony, AB Prime, Unimech, Citadel; Phase 0 also listed Atlantic, Al Rashid, Splash | https://rivierapoolbh.com/ ; https://badergroup.bh/?page_id=10 ; https://www.abprimebh.com/ ; https://unimech.co/ ; https://citadel-bh.com/ | 14 Sep 2026 | Not Bahrain-localized Google | High that SERP is **pool specialists** | **Do not use for homepage.** Secondary service only |
| horse walker installation Bahrain | en | Niche commercial / branded equipment | Horse walkers | JEMS (Salmabad) manufacturer/installer; UAE equine suppliers; Bahrain Turf Club facility page (club amenity, not a contractor) | http://www.jems4u.com/uploads/brochure/JEMS_in_Horse_Training_Equipments.pdf ; https://bahrainturfclub.com/racing/equine-facilities | 14 Sep 2026 | Not Bahrain-localized Google | Medium | **Do not use for homepage.** Niche supporting service |
| maintenance services Bahrain | en | Residential / property handyman | **Not** this business’s evidenced work | Home appliance repair, property maintenance, plumbing/electrical/handyman | https://homefixbahrain.com/ ; https://www.fidelity-bh.com/en/ ; https://gulfbangamaintenance.com/ | 14 Sep 2026 | Not Bahrain-localized Google | High that intent **mismatches** | **Reject for homepage targeting.** The trading name may stay in the title as **brand**, not as this query |
| Fast and Safe Maintenance Services Bahrain | en | Branded | Brand | 2021 *Daily Tribune* tender report lists the company as a bidder on MOYS artificial-turf football grounds. Unrelated “fast/safe maintenance” startups also appear | https://www.newsofbahrain.com/bahrain/73802.html | 14 Sep 2026 | Not Bahrain-localized Google | High for the **news mention**; index status of fsmsbh.com still Not verified | **Use as brand in the title.** The news item is third-party name + category evidence, not a ranking |

## 3.4 Arabic candidates (intent only — no on-page Arabic, no hreflang)

There is **no Arabic UI or Arabic URL**. Do **not** insert Arabic keywords into English copy. Do **not** add hreflang without translated pages.

| Keyword | Language | Intent | Relevant service | Observed result types | Source URL | Date | Geographic limitations | Confidence | Decision |
| ------- | -------- | ------ | ---------------- | --------------------- | ---------- | ---- | ---------------------- | ---------- | -------- |
| عشب صناعي البحرين تركيب | ar | Commercial — mostly **residential landscaping** and retail tiles | Artificial grass (wrong buyer mix) | Landscape firms (Al Tarek), IKEA-style tiles, Play Nation product page | https://www.altarek-landscape.com/2021/08/blog-post_47.html ; https://play.bh/product/artificial-grass/?lang=ar | 14 Sep 2026 | Not Bahrain-localized Google | Medium | **Do not target on the English homepage.** Residential SERP |
| ملعب كرة قدم عشب صناعي البحرين | ar | Institutional / municipal football | Artificial football pitches | Municipal news (Jurdab; Sitra municipal pitch); Tender Board Arabic scope (Ekr: سياج + حشيش صناعي) | https://www.mun.gov.bh/newportal/ar/municipal-affairs/news/wkyl-shywn-albldyat-ytl-ly-mkhtt-ansha-mlb-jrdab-fy-aldayrt-alsabt-bmhafzt ; https://www.albiladpress.com/news/2025/6145/bahrain/931079.html ; https://tenderboard.gov.bh/tenderdetails/?id=977%2F2024%2FBTB+%28MUN%2FCM%2F25%2F2024%29 | 14 Sep 2026 | Not Bahrain-localized Google | Medium | **Relevant intent for a future Arabic page.** Not for English metadata |
| تجديد عشب طبيعي ملعب / توريد وإصلاح عشبة | ar | Procurement / renovation | Natural grass renovation | GSA Tender Board bilingual notice (Khalifa & Muharraq, Paspalum) | https://www.tenderboard.gov.bh/TenderDetails/?id=504%2F2024%2FBTB+%28RFP%2FGSA%2F05%2F2024%29 | 14 Sep 2026 | Not Bahrain-localized Google | Medium | Procurement wording. Future Arabic service page only if natural-grass work is confirmed |
| استبدال العشب الصناعي | ar | Replacement (BFA / AFC news) | Turf replacement | BNA: AFC funding to replace artificial turf with natural at BFA outer pitch 3 | https://www.bna.bh/news?cms=q8FmFJgiscL2fwIzON1%2BDjIP2uTSOCfzBKoxXaKX66Y%3D | 14 Sep 2026 | Not Bahrain-localized Google | Medium | Demand evidence in Arabic news, not a keyword-volume figure |

## 3.5 Competitor wording (observed, not recommended)

| Competitor | URL | Observed wording (theirs) | Difference vs this site |
| ---------- | --- | ------------------------- | ----------------------- |
| PrimeSports / SportsBuilders Bahrain | https://primesports.info/ | “Sport Facility Construction Bahrain”; “Football Pitches, Tennis Courts, Padel Courts & Professional Artificial Grass Installation”; nav labels Pitch Construction, Artificial Grass Installation, Pitch Maintenance; phone `+973 3887 9494`; email `hello@primesports.info` | Named service **labels** on a multi-section site. Direct fetches of `https://primesports.info/pitch-construction` and `.../artificial-grass-installation` returned **404** in this environment — treat the **homepage** as the confirmed document. They publicly claim padel, tennis, FIFA/ITF/FIP — **their claims, not ours** |
| GFSS | https://gfss.com.bh/ ; https://gfss.com.bh/company-profile/ ; https://gfss.com.bh/gallery/artificial-grass-foot-ball-pitch-baba-garden/ ; profile PDF https://gfss.com.bh/wp-content/uploads/2024/11/GFSS-Company-Profile-JULY-2024.pdf | “Artificial Grass”, “Fencing & Crash Barrier”, landscaping; project “Artificial Grass Foot Ball Pitch @ Baba Garden”; published hours; PO Box 5060 Manama | Multi-page contractor with fencing **and** landscape heritage. Lowest quoted bidder in the 2021 MOYS five-pitch tender news item |
| BLC Sports | https://blcsports.com/ ; https://blcsports.com/Services.php | “Supply & Installation of Artificial Grass in Bahrain”; garden **and** soccer fields; rubber tiles, GRP tanks | Mixes landscaping supply with field work |
| Baraka Sports | https://baraka-sports.com/infrastructure/ | “Artificial grass… for home yards, and football courts” (Phase 0 + search; fetch returned 403 in this pass) | Home yards + football — broader residential mix |
| Greengrass Bahrain | https://greengrass-bahrain.com/green/fixing-installation/ (Phase 0 / search; fetch 404 in this pass); https://greengrass-bahrain.com/green/residential-grass/ | “fake grass lawns and landscaping, pet grass, putting green… sports field turf” | Landscape/retail-led |
| Sumworks | https://sumworksme.com/artificial-grass-supply | “artificial grass suppliers in Bahrain”; homes, rooftops, balconies | **Supply / interiors**, not institutional pitches |
| Almad Contracting | http://www.almadsports.com/ | Tennis, squash, basketball, acrylic, wooden sports floors, security fencing since 1989 | Court **flooring**, not football turf |
| Riviera / Bader / others | https://rivierapoolbh.com/ etc. | Dedicated pool construction | Pool specialists — not a peer set for the homepage |
| JEMS | jems4u.com brochure | Horse walker manufacture, erection, AMC | Equine **equipment** specialist |
| SubAir Systems | https://subairsystems.com/ | Manufacturer of subsurface aeration / moisture / hydronics | Brand owner — not a Bahrain contractor peer |
| DrainTalent / SIS | https://draintalent.com/ | “DrainTalent is part of SIS Pitches” | Brand owner — do not imply FSMS partnership |

**Third-party mention of this company (verified page text):** *Daily Tribune*, 3 July 2021, lists “Fast and Safe Maintenance Services” among bidders for five 40×20 m artificial-grass football fields (MOYS). That is **bid participation**, not an award, and not a ranking. Source: https://www.newsofbahrain.com/bahrain/73802.html

---

# 4. Recommended homepage topic

**Status:** Provisional recommendation. Does not promise rankings. Does not change the live site.

## 4.1 Recommended primary topic

**Football pitch and sports-turf construction in Bahrain**, presented under the brand **Fast & Safe Maintenance Services**.

The homepage already is the brand URL. The commercial topic should be the **sports-ground / football-turf contractor** work the site actually evidences — not generic “maintenance services” and not an invented single-product specialty.

## 4.2 Supporting keyword cluster (candidates, not volume-ranked)

1. football pitch construction Bahrain  
2. artificial football turf installation Bahrain  
3. football turf replacement Bahrain  
4. natural grass pitch construction Bahrain  
5. sports construction company Bahrain *(category wrapper only; football remains first)*  
6. Fast & Safe Maintenance Services / Fast N Safe / fsmsbh *(brand)*

## 4.3 Why it fits

| Criterion | Assessment |
| --------- | ---------- |
| Existing service and project evidence | Strongest **B** set is football-club artificial-turf **replacement**, plus Hoora football grounds + services building, Isa Sports City turf replacement, and a 2021 press mention as a MOYS artificial-turf bidder. Hero, expertise, `#services`, and footer all lead with grass / pitch systems |
| Fit with target buyers | Published clients are ministries, clubs, a school, and sports-city / equestrian bodies — procurement and facilities buyers, not homeowners booking a handyman |
| Search-result intent | Football-qualified queries align with institutional contractors and tenders. Unqualified “artificial grass installation” and “maintenance services” do not |
| Breadth of the actual business | Leaves room for natural grass, hybrid/SubAir *as on-page sections*, fencing, youth-centre civils, pools, and equine work **without** making those the `<title>` |
| Risk of irrelevant enquiries | Avoids villa-lawn, IKEA-tile, padel/tennis flooring, and AC/plumbing leads that the name “Maintenance Services” would otherwise attract |

## 4.4 Alternatives considered

| Alternative | Why not primary |
| ----------- | --------------- |
| Brand only (“Fast N Safe” / name with no category) | Current title already does this. Phase 0: poor relevance. Brand **belongs in the title** but should not stand alone |
| Generic “artificial grass installation Bahrain” | SERP is landscaping + supply + sports mixed. High risk of garden enquiries |
| Hybrid grass or SubAir as primary | Educational / branded-equipment intent; no named project; authorization unverified |
| “Sports construction company Bahrain” alone | Fits the multi-trade reality but SERP peers sell padel, tennis, indoor floors this site does not evidence |
| “Sports flooring contractor Bahrain” | **Rejected** — different trade |
| Swimming pools, fencing, or horse walkers | Real services; weaker or specialist SERPs; would hide the football-turf proof |
| Generic maintenance / handyman | **Rejected** — mismatches evidenced work |

## 4.5 Assumptions needing owner confirmation

1. Public trading name in titles remains **Fast & Safe Maintenance Services**.  
2. Football pitches / sports turf remain the **lead** commercial offer (not general building or pools).  
3. The company still bids **new** pitches as well as replacements.  
4. FIFA / ISO / GSA / “leading partner” stay **out** of metadata until documents exist.  
5. Hybrid and SubAir remain on-page capability stories, not title claims, until product relationships are confirmed.

---

# 5. Map A — Existing website

**URL in scope:** `https://www.fsmsbh.com/` only.

**State explicitly**

- Every section below **shares** the homepage’s title and canonical. There is only one document.
- Hash fragments (`#expertise`, `#hybridgrass`, `#services`, …) are **not** service landing pages.
- Metadata improvements can proceed **without** adding routes.
- Visible keyword edits remain **proposals** and need wording/layout review. They are **not** authorized in Phase 2A.

| URL | Section/component | Primary topic | Supporting terms | Current coverage | Content gap | Proposed wording location | Approval needed |
| --- | ----------------- | ------------- | ---------------- | ---------------- | ----------- | ------------------------- | --------------- |
| `https://www.fsmsbh.com/` | `<head>` / `index.html` | Brand + football pitch / sports-turf construction | Fast & Safe Maintenance Services; Bahrain; Sitra | Title `Fast N Safe` only; no description; no canonical | Identity and category missing from first HTML | **Phase 2A:** title, meta description, canonical — drafts in §7 | Yes — copy approval of drafts only |
| same | `HeroCarousel.tsx` | Rotating: natural grass / artificial turf / rootzone-to-marking | Sports flooring; irrigation; FIFA Quality; 40+ pitches; GSA partner | Strong visual sports message; mixed unverified stats; one H1 at a time | Unstable H1; sports flooring unsupported; stats unverified | **Not Phase 2A.** Later copy review if a single persistent H1 is wanted | Yes — visible change |
| same | `HybridGrassShowcase.tsx` `#hybridgrass` | What hybrid grass is | FS-Grass®; FIFA Quality Pro; “leading certified partner” | Long educational copy | No named Bahrain hybrid project; OEM authorization unverified | Keep educational. Do not add manufacturer names without confirmation | Yes before any FIFA/partner edit |
| same | `SubAirVentShowcase.tsx` `#sub-air-system` | How subsurface aeration / drainage works | Vacuum / pressure modes | Educational explainer | Product vs generic engineering unclear; no project citation | Later: qualify as “subsurface aeration” unless licensee confirmed | Yes |
| same | `AboutSection.tsx` `#about` | Construction & engineering; sports turf, fencing, pools | ISO stats; 16 years; 75% repeat | Company story | Unverified statistics | Do not put stats in metadata | Yes before any about rewrite |
| same | `PremiumPitchesTech.tsx` `#services` | Natural/hybrid vs artificial pitch systems | DrainTalent™; geothermal; Resilience Pro; shockpad | Default tab is natural/hybrid; artificial systems click-gated | Artificial module names easy to miss; DrainTalent/geothermal thin | **Not Phase 2A.** Optional later: visible one-line names for all systems | Yes — layout |
| same | `#project-cycle` (inside PremiumPitchesTech) | Design → construct → install → maintain | Sitra & Manama engineering; FASTSAFE MAINTAIN | Process narrative | Maintenance not evidenced as a standalone product | Supporting only | Yes if process copy changes |
| same | `ExpertiseSection.tsx` `#expertise` | Seven service names | Short `desc` in DOM; details in modal | Names are crawlable after JS; depth is modal-gated | No unique URLs | **Not Phase 2A.** Do not turn cards into new routes without Map B approval | Yes |
| same | `ProjectsSection.tsx` `#projects` | Proof: clubs, youth centres, school, Amwaj, Rashid | Eight identical “Replacement of Artificial Grass” blurbs | Strong named-entity proof | Duplicate blurbs; surface type at Hoora unnamed | Later unique one-liners — **copy review**, not 2A | Yes |
| same | `#safety` (App.tsx) | ISO loop; scaffolding mention | ISO 9001/14001/45001 | Visible claim | Certificates not in repo | Omit from metadata | Yes before schema |
| same | `SitraMap.tsx` `#office-location` | Sitra depot, hours, phones, email | Sunday–Thursday 08:00–17:00 | Area-level NAP | No street address | Not required for 2A metadata | Address if claiming a precise pin later |
| same | `Footer.tsx` `#contact` | Activity list + NAP + ISO + CR | Landscape, interior, geothermal; social `href="#"` | Lists more activities than expertise/form | Inventory mismatch | **Not Phase 2A.** Align lists only after owner service confirmation | Yes |
| same | Consultation modal | Quote / consultation | Activities omit Hybrid, SubAir, Carpentry | Correct as a **button-opened form** | N/A for keywords | Do **not** convert to a link for SEO | No change |

---

# 6. Map B — Optional future service pages

**Not authorized.** No routes, nav items, or pages should be built from this table.

Propose a page only where buyer intent is distinct **and** enough factual content exists or can be published without inventing claims.

| Proposed URL | Service | Primary intent | Supporting evidence | Unique content available | Missing facts | Priority | Overlap risk |
| ------------ | ------- | -------------- | ------------------- | ------------------------ | ------------- | -------- | ------------ |
| `/services/football-turf/` **or** `/services/artificial-grass/` | Artificial football turf install + replacement | Commercial install / replace | 10+ named projects; expertise steps; 2021 tender news | Club names, replacement vs new, climate/drainage narrative already in copy | FIFA licence; turf brand; warranty | **First to consider** | Overlaps homepage cluster — page must go deeper (process, replacement vs new, gallery) or it is a doorway |
| `/services/natural-grass/` | Natural grass pitches | Commercial construction / renovation | Strong on-page process; GSA-style market exists | Installation steps, irrigation/rootzone copy | Species actually used; named natural-grass project (Hoora?) | **Second — after owner confirms species + at least one project** | Overlaps hybrid section if both say “natural” |
| `/projects/` | Reference projects hub | Commercial proof | 15 named cards | Unique clubs/years/clients | Unique outcome lines; permission to keep ministry/club names | **Consider with first service page** | Thin if cards stay eight identical sentences |
| `/services/hybrid-grass/` | Hybrid systems | Informational + possible commercial | Long `#hybridgrass` copy | Educational layers | Product identity; authorization; a completed job | **Wait** | High overlap with natural-grass page and homepage section |
| `/services/subair/` | Subsurface aeration | Technical / branded | Long `#sub-air-system` copy | Educational modes | Licensee status; a completed job | **Wait** | Branded-SERP / manufacturer conflict |
| `/services/fencing/` | Sports fencing / netting | Commercial | Expertise + Ma'ameer | Sports vs palisade already in modal | Named clients; sports-only vs industrial | **Wait** | GFSS-dominated general fencing |
| `/services/building-construction/` | Turnkey / youth-centre civils | Commercial | Hoora + North Sehla | Two substantial projects | Whether general building is still sold | **Wait** | Different buyer than turf; can dilute sports identity |
| `/services/swimming-pools/` | Pools | Commercial | One Amwaj-style project + modal | Pool gallery | Active sales line; addressable vs specialists | **Wait** | Crowded specialist SERP |
| `/services/horse-walkers/` | Horse walkers | Niche commercial | Rashid + expertise | Equine gallery | Brand of walker; active sales | **Wait** | JEMS-style equipment SERP |
| `/services/carpentry/` | Carpentry | Generic commercial | Expertise only | Workshop steps | Any named job; whether sold | **Wait / likely skip** | Generic carpentry market |
| `/contact/` | Contact / quote | Transactional | Footer + map | Phones, email, hours | Street address; real social URLs | **Only if a real address will be published** | Homepage `#contact` already exists |
| `/about/` | Entity / about | Brand | About + footer CR/ISO | Name, Sitra, services list | Legal name lock; ISO/CR proof | **Wait for claims confirmation** | Homepage `#about` |
| City doorways (Manama, Riffa, …) | — | — | Form location list only | None unique | — | **Do not create** | Duplicate doorways |
| DrainTalent / geothermal / landscape / interior / sports flooring pages | — | — | Name-only or wrong SERP | Insufficient | Owner confirmation | **Do not create** | Misleading inventory |

**Consider first:** one football-turf/artificial-grass URL, then natural grass **if** facts appear, plus a projects hub if unique blurbs can be written.

**Wait:** hybrid, SubAir, secondary trades, contact/about until NAP and claims are locked.

**Do not create** a page per keyword, town, modal, or product trademark.

---

# 7. Draft homepage titles and descriptions

**Not applied.** Provisional public name: **Fast & Safe Maintenance Services** (pending owner confirmation).

**Omitted on purpose:** FIFA, ISO, CR, GSA partner, years of experience, pitch counts, repeat-customer rates, “best/leading/certified partner,” manufacturer authorization, performance statistics.

### Title option 1

`Fast & Safe Maintenance Services | Football Pitch Construction in Bahrain`

### Title option 2

`Fast & Safe Maintenance Services | Sports Turf Installation, Sitra, Bahrain`

### Meta description option 1

`Fast & Safe Maintenance Services constructs and replaces football pitches in Bahrain, including artificial turf and natural grass sports surfaces. Based in Sitra. Request a consultation.`

### Meta description option 2

`Sitra-based Fast & Safe Maintenance Services installs and replaces football turf and builds sports grounds for clubs, schools, and public facilities in Bahrain. Call or request a consultation.`

Optional later addition **after** owner confirms the public numbers: a `tel:` in the description. Not required for Phase 2A.

---

# 8. Claims and business-detail register

**This phase does not remove or rewrite existing on-page claims.** Unverified claims are omitted from the §7 drafts.

| Fact/claim | Current public wording | Source | Verification status | Can use in draft metadata? | Confirmation needed |
| ---------- | ---------------------- | ------ | ------------------- | -------------------------- | ------------------- |
| Public business name | Footer copyright: Fast & Safe Maintenance Services. Brand block: FAST & SAFE / CONSTRUCTION & ENGINEERING. Title: Fast N Safe. Modal success: Fast & Safe Construction. Process: FASTSAFE MAINTAIN | `Footer.tsx`, `COMPANY_INFO`, `index.html`, `ConsultationModal.tsx`, `PremiumPitchesTech.tsx` | On-site wording **verified**. Legal name **pending** | **Yes — provisional** “Fast & Safe Maintenance Services” only | Lock one public name |
| Phone 1 | Footer `+973 7791 2500` (`tel:+97377912500`); map `+973 77912500` | `Footer.tsx`, `SitraMap.tsx` | Same number, spacing variants. **Not** a NAP conflict | Optional in description; not required | Confirm still in service |
| Phone 2 | Footer `+973 3935 4111`; map `+973 39354111` | same | Same number, spacing variants | Optional | Confirm still in service |
| Email (public UI) | `info@fsmsbh.com` | Footer, map | **Verified** as displayed | Yes if a contact line is added later | Confirm inbox is monitored |
| Email (constants) | `fastsafecontracting@gmail.com` | `COMPANY_INFO.email` | **Not** in live UI innerText (Phase 0) | **No** | Which email is public? |
| Email (source comment) | `fastnsafe321@gmail.com` | EmailJS comments | Comment only — **not** a public NAP conflict | **No** | — |
| WhatsApp | Consultation form option “WhatsApp”; no `wa.me` control | `ConsultationModal.tsx` | Form preference only | **No** (would imply a click-to-chat that does not exist) | Which number, if any, is WhatsApp |
| Address | “Sitra, Kingdom of Bahrain” | Footer, map, constants | Area-level **verified**; street **absent** | “Sitra, Bahrain” **yes** | Street / block if a pin or LocalBusiness schema is wanted later |
| Hours | Sunday–Thursday 8:00 AM – 5:00 PM AST; “estimating units remain on standby” | `SitraMap.tsx` | On-site only; GBP **Not tested** | **No** (hours not needed in these drafts) | Official hours? |
| Website | `https://www.fsmsbh.com` | Footer | Matches live host | Canonical **yes** | — |
| Social profiles | Instagram/Facebook/LinkedIn/YouTube `href="#"` | Footer | Placeholders | **No** | Real URLs or leave icons (out of 2A) |
| Founded 2010 / 16 years | Hero, about, footer | constants / hero | Internal consistency only | **No** | Documents if to be used |
| 75% repeat customers | About stat | `COMPANY_INFO.repeatCustomerRate` | **Not verified** | **No** | — |
| ZERO ACCIDENTS | About (Phase 0) | About section | **Not verified** | **No** | — |
| 40+ pitches serviced | Hero | `HeroCarousel.tsx` | **Not verified** | **No** | — |
| 105m × 68m delivered | Hero | `HeroCarousel.tsx` | Dimension claim; not a cited project | **No** | — |
| GSA Project Partner | Hero | `HeroCarousel.tsx` | **Not verified** | **No** | — |
| FIFA Quality Pro / FIFA Quality Programme | Hybrid, expertise features, `#services` disclaimer, Isa Sports City “FIFA-grade” | multiple | **Not verified** | **No** | Certificates or “do not use” |
| World Rugby, FIH | `#services` disclaimer | `PremiumPitchesTech.tsx` | **Not verified** | **No** | — |
| “leading certified partner of original global sports tech” | Hybrid Bahrain box | `HybridGrassShowcase.tsx` | **Not verified** — high-risk | **No** | — |
| ISO 9001/14001/45001 | About, footer, safety | constants / footer | On-site claim; certificates **not in repo** | **No** | Registrar docs |
| CR 33626-6 — ACTIVE | Footer | `Footer.tsx` | On-site claim; Sijilat **Not tested** | **No** | Sijilat / owner |
| FS-Grass®, FS-GRASS SPORTS SHIELD®, DrainTalent™ | Hybrid / `#services` | components | Trademark ownership **Not tested** | **No** | — |
| SubAir as installed product | `#sub-air-system` | `SubAirVentShowcase.tsx` | Capability claim; manufacturer is a third party | **No** as authorization | Licensee? |
| Project: Hoora Youth Centre, 2019, Ministry, 2 football grounds + services building | Projects card | `projects.ts` | Published on-site claim | Not needed in metadata | Surface type (natural vs artificial)? |
| Project: North Sehla, 2023, turnkey youth centre | Projects card | `projects.ts` | Published on-site claim | No | — |
| Project: Isa Sports City, 2020, AFC client, artificial grass replacement | Projects card | `projects.ts` | Published on-site claim | No | Confirm client wording |
| Project: club replacements 2022–2024 (Sitra, Malkiya, Ettihad, Isa Town, Ittifaq, Budaiya, Najma, Al Ahli, Ma'ameer) | Projects cards | `projects.ts` | Published on-site claims | No | Permission to keep names |
| Project: Bahrain School – Juffair, 2022 | Projects card | `projects.ts` | Published on-site claim | No | — |
| Project: Rashid Equestrian Club, 2021 | Projects card | `projects.ts` | Published on-site claim | No | — |
| Project: Amwaj aquatic, 2022 | Projects card | `projects.ts` | Published on-site claim; client name marketing-style | No | Confirm client name |
| 2021 MOYS five-pitch tender bidder | “Fast and Safe Maintenance Services” among bidders | https://www.newsofbahrain.com/bahrain/73802.html | **Verified** as press text; **not** an award | Do not claim the contract was won | — |

---

# 9. Prioritized Phase 2A proposal

**Goal:** Homepage SEO foundations with **no visual changes**.

Do **not** combine the buckets below into one implementation.

## 9.1 In scope for Phase 2A (head and crawl files only)

### A. Head metadata and canonical

| | |
| --- | --- |
| **Files** | `index.html` only |
| **Proposed changes** | Set `<title>` to an approved §7 option. Add one `<meta name="description">` from §7. Add `<link rel="canonical" href="https://www.fsmsbh.com/">`. Keep `lang="en"` and the existing viewport. Do **not** add JSON-LD, FIFA/ISO, or unverified stats |
| **Dependencies** | Owner accepts provisional name + one title + one description, **or** supplies replacements that still omit unverified claims |
| **Visible impact** | None in the page body. SERP snippet may change after recrawl (not guaranteed) |
| **Acceptance** | View-source of production `/` shows title, description, and absolute www canonical. Lighthouse `meta-description` pass. Body, CSS, and JS unchanged |

### B. Accurate robots.txt and sitemap for **existing URLs only**

| | |
| --- | --- |
| **Files** | New `public/robots.txt`, new `public/sitemap.xml` |
| **Proposed changes** | `robots.txt`: allow `/`; disallow nothing required for JS/CSS; `Sitemap: https://www.fsmsbh.com/sitemap.xml`. `sitemap.xml`: **only** `https://www.fsmsbh.com/` (lastmod optional). Do **not** list hashes, `/index.html`, 404 paths, or proposed future URLs |
| **Dependencies** | Canonical host remains www |
| **Visible impact** | None |
| **Acceptance** | `https://www.fsmsbh.com/robots.txt` and `.../sitemap.xml` return 200. Sitemap contains one canonical URL. Unknown paths such as `/about` still 404 |

### C. `/index.html` canonicalization — **separate small change**

| | |
| --- | --- |
| **Files** | Host config only if authorized (e.g. a new `vercel.json` redirect). **Not** a visual file |
| **Proposed change** | 301/308 `https://www.fsmsbh.com/index.html` → `https://www.fsmsbh.com/` |
| **Dependencies** | Owner authorizes a **hosting** redirect. Until then, the §9.1.A canonical is the non-hosting mitigation |
| **Visible impact** | None if redirect preserves the same rendered app |
| **Acceptance** | `HEAD /index.html` is 301/308 to `/`. `/` remains 200 |

## 9.2 Explicitly out of Phase 2A (do not bundle)

| Bucket | Why it is separate |
| ------ | ------------------ |
| Rendering / prerender / bot HTML / SSR | Needs its own architectural assessment. No plugin is selected |
| Performance (image compression, lazy-load, unused imports) | Separate visual QA; unused-import **savings not proven** |
| Optional service-page expansion (Map B) | New routes and navigation — **not authorized** |
| Visible content or functionality | Hero wording, service copy, footer lists, heading hierarchy, colors, WhatsApp controls, Add/Delete, modal behavior |

## 9.3 Explicitly excluded even as “while we’re here”

These may be later recommendations. They are **not** authorized Phase 2A changes:

- Removing Add/Delete project controls  
- Changing modal behavior  
- Changing the hero wording  
- Adding WhatsApp controls  
- Changing colors or contrast  
- Adding pages  
- Rewriting service copy  
- Converting consultation buttons to links  
- JSON-LD / Open Graph (optional later; OG is not required for 2A)  
- Arabic pages or hreflang  

## 9.4 Suggested sequence

1. Approve §7 title + description (or edited equivalents).  
2. Implement **9.1.A** (`index.html` head).  
3. Implement **9.1.B** (robots + sitemap of `/` only).  
4. Decide **9.1.C** (`/index.html` redirect) as its own hosting ticket.  
5. Stop. Reassess rendering and Map B only after a later authorization.

---

# 10. Owner questions that materially affect the next step

Questions that do **not** block Phase 2A (full service list, hybrid OEM, grass species, Arabic, GSC access, Add/Delete, street address) are deferred.

Answer these before or with Phase 2A:

1. **Homepage topic:** Approve “football pitch / sports-turf construction in Bahrain” under Fast & Safe Maintenance Services as the metadata topic? If not, state the replacement **one** topic.  
2. **Public name in `<title>`:** Confirm `Fast & Safe Maintenance Services`, or supply the exact string to use.  
3. **Pick drafts:** Title 1 or 2; Description 1 or 2 — or paste replacements that still omit unverified claims.  
4. **Phase 2A hosting:** Authorize `index.html` head + robots/sitemap only, and separately yes/no to the `/index.html` → `/` redirect?  
5. **Claims in metadata:** Confirm FIFA, ISO, CR, years, and “leading/certified” stay **out** of the first title/description. If any must go in, supply the document first — that delays 2A.

---

# Recommendation

Proceed with **Phase 2A only**: add a verified-claim homepage title, meta description, and `https://www.fsmsbh.com/` canonical; publish a robots.txt and a one-URL sitemap; treat `/index.html` redirection as a separate hosting decision.

Do not add routes, do not rewrite visible copy, and do not target generic maintenance, villa artificial grass, or sports flooring.

**Stop.** No implementation in this phase.
