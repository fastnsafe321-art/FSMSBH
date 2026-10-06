# Fast & Safe Maintenance Services — Phase 4 Structured Data and Semantics

**Date:** 15 September 2026  
**Scope:** Homepage JSON-LD graph and necessary semantic HTML only. Phases 2A–3A (metadata, canonical, robots, sitemap, prerender/hydration, image pipeline, Google tag `G-SP37M5NYJ5`, site-verification, saved browser data, deferred Firebase) were not redesigned.  
**Live website:** Unchanged. No commit, push, or deploy was performed.

This phase does not restart earlier audits. Rankings, indexing, rich results, and AI citations are **not** guaranteed.

---

## 1. Exact files changed

### New source

| File | Why |
| ---- | --- |
| `src/data/site-schema.ts` | Stable homepage graph and `serializeJsonLd()` (`<` → `\u003c`). |
| `src/components/seo/JsonLd.tsx` | Single `application/ld+json` script rendered with the App so prerender includes it. |

### Edited source

| File | Why |
| ---- | --- |
| `src/App.tsx` | Render `<JsonLd />`; wrap Hero through SitraMap in `<main>`; Safety eyebrow `h2`→`p`, title `h3`→`h2`, ISO badge `h4`→`h3`. |
| `src/components/layout/Navbar.tsx` | `<header>` wrapper; `aria-label="Primary"`; hamburger names; mobile overlay is `<nav aria-label="Mobile">`. |
| `src/components/layout/Footer.tsx` | Column titles `h4`→`h2`. |
| `src/components/sections/AboutSection.tsx` | Eyebrow `h2`→`p`; visual title `h3`→`h2`; feature titles `h4`→`h3`. |
| `src/components/sections/ExpertiseSection.tsx` | Eyebrow `h2`→`p`; visual title `h3`→`h2`. Service-card `h3`s unchanged. |
| `src/components/sections/ProjectsSection.tsx` | Eyebrow `h2`→`p`; visual title `h3`→`h2`; project titles `h4`→`h3`; delete `aria-label` matches visible/title text. |
| `src/components/modals/ExpertiseDetailsModal.tsx` | Close `aria-label="Close modal"`; sidebar `aria-label="Expertise sections"`. |
| `src/components/modals/ProjectDetailsModal.tsx` | Close `aria-label="Close modal"`. |
| `scripts/homepage-prerender.mjs` | Fail the build if `#root` lacks `<main>` or exactly one JSON-LD graph. |

### Local checks and evidence (not shipped as product UI)

| File | Why |
| ---- | --- |
| `scripts/extract-heading-outline.mjs` | Heading/landmark extract from built HTML. |
| `scripts/verify-phase4.mjs` | JSON parse, ID refs, local vocabulary allowlist, metadata checks. |
| `scripts/verify-phase4-browser.mjs` | Isolated Chrome: hydration, one graph, names, screenshots. Blocks gtag/Firestore/EmailJS. |
| `seo-audit-evidence/phase-4/` | Before outline, after outline, parsed JSON-LD, browser report, screenshots. |
| `SEO_PHASE_4_STRUCTURED_DATA_AND_SEMANTICS.md` | This report. |

`dist/` was rebuilt locally (`#root` inject **174,235** characters). Image pipeline on this build: `created: 0`, `reused: 312`. `index.html` head tags were not edited.

No head-management package was added.

---

## 2. Final JSON-LD graph

Parsed from the built `dist/index.html` script text (also `seo-audit-evidence/phase-4/json-ld-parsed.json`):

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.fsmsbh.com/#organization",
      "name": "Fast & Safe Maintenance Services",
      "url": "https://www.fsmsbh.com/",
      "email": "info@fsmsbh.com",
      "telephone": ["+97377912500", "+97339354111"],
      "description": "Fast & Safe Maintenance Services installs artificial turf and natural grass sports pitches in Bahrain. Based in Sitra. Request a consultation."
    },
    {
      "@type": "WebSite",
      "@id": "https://www.fsmsbh.com/#website",
      "url": "https://www.fsmsbh.com/",
      "name": "Fast & Safe Maintenance Services",
      "inLanguage": "en",
      "description": "Fast & Safe Maintenance Services installs artificial turf and natural grass sports pitches in Bahrain. Based in Sitra. Request a consultation.",
      "publisher": { "@id": "https://www.fsmsbh.com/#organization" }
    },
    {
      "@type": "WebPage",
      "@id": "https://www.fsmsbh.com/#webpage",
      "url": "https://www.fsmsbh.com/",
      "name": "Football Pitch Construction in Bahrain | Fast & Safe Maintenance Services",
      "inLanguage": "en",
      "description": "Fast & Safe Maintenance Services installs artificial turf and natural grass sports pitches in Bahrain. Based in Sitra. Request a consultation.",
      "isPartOf": { "@id": "https://www.fsmsbh.com/#website" },
      "about": { "@id": "https://www.fsmsbh.com/#organization" }
    }
  ]
}
```

`name` is the selected public name, not a verified `legalName`.

Serialization: `JSON.stringify` then replace `<` with `\u003c`. The built script text contains no raw `</script>`. JSON was not HTML-entity-encoded.

---

## 3. Source evidence for included fields

| Field | Value | Evidence |
| ----- | ----- | -------- |
| Organization / WebSite `name` | Fast & Safe Maintenance Services | `COMPANY_INFO.fullName`; footer copyright; approved title/description. |
| `url` | `https://www.fsmsbh.com/` | Canonical in `index.html`; footer link `www.fsmsbh.com`. |
| WebPage `name` | Approved document title | `<title>` in `index.html`. |
| `description` | Approved meta description | `<meta name="description">` in `index.html`. Visible About copy is longer and was not substituted. |
| `inLanguage` | `en` | `<html lang="en">`. |
| `email` | `info@fsmsbh.com` | Visible `mailto:` in footer and Sitra map. |
| `telephone` | `+97377912500`, `+97339354111` | Visible `tel:` links. Display text is `+973 77912500` / `+973 39354111` (map) and `+973 7791 2500` / `+973 3935 4111` (footer). Same digits. |

Graph links: WebSite.publisher → Organization; WebPage.isPartOf → WebSite; WebPage.about → Organization. Browser check confirmed the same IDs after hydration.

---

## 4. Omitted properties and reasons

| Property / type | Reason |
| --------------- | ------ |
| `legalName` | Public trading name only; not independently verified. |
| `logo` | No logo image in `public/` or `src/assets`. The mark is an HTML “F” square. |
| `address` / `geo` | Only “Sitra, Kingdom of Bahrain” is shown. No street or coordinates. |
| `openingHours` | Hours appear on the map UI; this phase forbids inventing or promoting hours in schema. |
| `sameAs` | Footer social icons use `href="#"`. No real profiles. |
| `foundingDate` / `founding` | Visible “since 2010” exists; founding dates were excluded from this phase. |
| `email` from `COMPANY_INFO` | Constant `fastsafecontracting@gmail.com` is **not** on the page. |
| CR `33626-6`, ISO codes, awards | Visible in footer/about; explicitly excluded from this graph. |
| Reviews, ratings, prices, guarantees, statistics | Excluded even where “16” / “75%” appear on About. |
| `LocalBusiness`, `Service`, `OfferCatalog`, `FAQPage`, `BreadcrumbList`, `SearchAction` | Out of scope. Single-page site; no invented breadcrumbs or site search. |

---

## 5. Before / after heading outline

Before record: `seo-audit-evidence/phase-4/heading-outline-before.json` (from pre-Phase-4 `dist/index.html`). Live before-screenshots of those sections were not captured in this continuation; the outline JSON is the before record.

After record: `seo-audit-evidence/phase-4/heading-outline-after.json`.

One H1 remains: **WE BUILD THE GROUND NATURAL GRASS PLAYS THE GAME**. No hidden or duplicate H1.

### Corrected (eyebrow + visual title)

| Section | Before | After |
| ------- | ------ | ----- |
| About | H2 WHO WE ARE → H3 Expertise in Construction & Engineering → H4 cards | `p` WHO WE ARE → **H2** Expertise… → **H3** ISO / HSE / ZERO ACCIDENTS |
| Expertise | H2 Our Expertise → H3 What We Deliver → H3 cards | `p` Our Expertise → **H2** What We Deliver → H3 cards |
| Projects | H2 Reference Projects → H3 Featured Portfolio → H4 titles | `p` Reference Projects → **H2** Featured Portfolio → **H3** titles |
| Safety | H2 Commitment to Standards → H3 Integrated ISO… → H4 ISO 9001 | `p` Commitment… → **H2** Integrated ISO… → **H3** ISO 9001:2015 |
| Footer | H4 Key Activities / ISO / Locations (under Sitra H2) | **H2** for each footer column |

### Left unchanged

Hybrid, SubAir, Premium Pitches tabs (`H2` then `H4` tab labels), Sitra “Main Depot” `H3`, hero wording, carousel, consultation **buttons**, social placeholders, image `alt` text.

---

## 6. Landmark and accessible-name corrections

| Before | After |
| ------ | ----- |
| No `<main>` | One `<main>` around Hero → SitraMap. Navbar/header and Footer outside. Modals remain siblings (overlays). |
| No `<header>` | `<header>` wrapping primary nav + mobile menu. |
| One unnamed `<nav>` | `aria-label="Primary"`. Open mobile menu adds `aria-label="Mobile"`. Expertise modal sidebar `aria-label="Expertise sections"`. |
| Hamburger: no name | `Open menu` / `Close menu`, `aria-expanded`, `aria-controls="mobile-navigation"`. |
| Expertise / project modal close: icon only | `aria-label="Close modal"` (same wording as consultation close). |
| Delete control: `title="Confirm Deletion"` vs visible “Confirm Delete” | `title` and `aria-label` are **Delete Project** / **Confirm Delete**. |

Consultation actions remain buttons, not links.

---

## 7. Local validation and visual checks

Preview: `http://127.0.0.1:4178/` against the rebuilt `dist/`. Isolated Chrome profile. Blocked: Google tag, Analytics, Firestore, EmailJS. The tag snippet in `index.html` was **not** edited. No enquiry was submitted.

| Check | Result |
| ----- | ------ |
| `vite build` | Pass. Prerender inject **174,235** chars. Pipeline `created: 0`, `reused: 312`. |
| Prerender copy / determinism | Required snippets still present. Graph is static source data (no localStorage, random, or build timestamps). Footer year remains runtime `new Date().getFullYear()` and is not in JSON-LD. |
| JSON syntax | Pass. Parsed from the actual built script text. Matches `serializeJsonLd` source graph. |
| Schema vocabulary / properties | Local allowlist pass: only Organization, WebSite, WebPage and the properties listed above. **Not** a full schema.org reasoner. |
| Google Rich Results Test | **Not run.** HTML was not uploaded. These types are not Review / FAQ / Product rich-result types; eligibility is not claimed. |
| Metadata / canonical / robots / sitemap / gtag / verification | Unchanged. |
| JSON-LD after hydration | Exactly one `data-fsms-jsonld="homepage"` on desktop and mobile reload. |
| Hydration / runtime | No `[hydration]` warnings; no console exceptions in the isolated session. |
| TypeScript | Only pre-existing `src/App.tsx(518,9)` `contactMethod` (`string` vs `'WhatsApp' \| 'Phone Call' \| 'Email Channel'`). No new errors. |
| Accessibility tree (DOM / names) | `main` 1, `header` 1, `footer` 1; nav names Primary / Mobile / Expertise sections; hamburger and modal close names as above. |
| Desktop / mobile appearance | After shots in `seo-audit-evidence/phase-4/`. Layout, colors, type scale, photos, and spacing of About, Expertise, Projects, Safety, Footer, hero, and both modals match the existing design. Tag changes kept the same `className`s. |
| Navigation / modals | Desktop primary links unchanged. Mobile overlay opens/closes. Artificial Grass expertise modal and Hoora project modal opened and closed. |

---

## 8. Remaining issues (later; need confirmation or visible/behavior changes)

- Footer social icons still point at `#`. Do not invent `sameAs`.
- `COMPANY_INFO.email` (`fastsafecontracting@gmail.com`) is unused and unused on the page.
- No logo file; Organization.logo omitted until a real asset exists.
- Sitra is locality-only. Street, geo, and hours need business confirmation before LocalBusiness.
- Visible CR, ISO, “since 2010”, and About statistics were not added to JSON-LD.
- Premium Pitches still jumps `H2` → `H4` on tech tabs; SubAir still uses `H5` under `H4`. Left alone to avoid restyling those sections.
- Expertise and project cards are clickable `div`s, not buttons/links. Keyboard access would change behavior.
- Placeholder social destinations and public Add/Delete project controls remain on purpose.
- Modal focus trapping was not refactored.
- Pre-existing `contactMethod` TypeScript error and unused `isAddProjectOpen` remain.
- Motion still hides the hero **photo** until JS; copy remains prerendered.

---

## 9. Local rollback

Do **not** `git checkout` shared files wholesale; that would drop Phases 2A–3A.

1. Delete `src/data/site-schema.ts` and `src/components/seo/JsonLd.tsx`.
2. In `src/App.tsx`, remove the JsonLd import/`<JsonLd />`, unwrap `<main>`, restore Safety heading tags.
3. Restore previous heading tags and navbar/footer/modal attributes in the files listed in §1.
4. Remove the Phase 4 assertions from `scripts/homepage-prerender.mjs`.
5. Delete `scripts/extract-heading-outline.mjs`, `scripts/verify-phase4.mjs`, `scripts/verify-phase4-browser.mjs`, this report, and `seo-audit-evidence/phase-4/`.
6. Rebuild: `node .\node_modules\vite\bin\vite.js build`.

---

## 10. What changed, what passed, what remains

**Changed:** One Organization + WebSite + WebPage JSON-LD graph in the prerendered homepage; landmark and heading-level corrections that keep the same classes and wording; accessible names on the hamburger, modal closes, and delete control.

**Passed:** Local production build and prerender; JSON-LD parse and ID references; one graph before and after hydration; unchanged metadata/canonical/robots/sitemap/gtag/verification; no new hydration errors; no new TypeScript errors; desktop/mobile appearance of touched sections; representative nav and modal flows. Analytics and form backends were blocked in the test browser only.

**Remains:** Business-confirmed identity fields (legal name, logo file, street address, social URLs); richer schema types; heading jumps in Hybrid/SubAir/Premium Pitches; card keyboard access; social `#` links; the known `contactMethod` type error.

Nothing was committed, pushed, or deployed. Phase 4 stops here.
