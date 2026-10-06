# Fast & Safe Maintenance Services — Phase 3 Image Optimization

**Date:** 14 September 2026  
**Scope:** Local image-delivery optimization for homepage photographs already used in the Phase 2D prerendered site.  
**Live website:** Unchanged. No commit, push, or deploy was performed.

Phase 2D prerendering, hydration, `useLocalStorage`, and deferred Firebase behavior were left in place. This phase does not restart that assessment.

The public name **Fast & Safe Maintenance Services** and the selected service wording come from existing public content. This phase does **not** independently verify legal identity, certifications, or manufacturer relationships.

**Phase status:** Implemented and verified locally against isolated Chrome on `http://127.0.0.1:4176/` (after) versus the Phase 2D preview at `http://127.0.0.1:4175/` (before).

---

## 1. Exact source and tooling changes

### Intentional application source

| File | Why |
| ---- | --- |
| `src/components/media/ResponsiveImage.tsx` | New `<picture className="contents">` + WebP `<source>` + original `<img>` fallback. Unknown URLs render the original `<img>` only. |
| `src/utils/imageVariants.ts` | Manifest lookup by filename. Does not rewrite `localStorage`. `data:` / `blob:` / unmatched URLs stay unchanged. |
| `src/data/image-variants.json` | Generated mapping (116 source files → 312 WebP variants). Bundled as JSON; not handwritten. |
| `src/components/HeroCarousel.tsx` | Uses `ResponsiveImage` (`sizes="100vw"`, `loading="eager"`). Client `useEffect` prefetches the **next** slide’s preferred WebP only. Interval remains 8 seconds. No `fetchPriority="high"`. |
| `src/components/HybridGrassShowcase.tsx` | Banner / soil / backing use measured `sizes`. Existing classes and overlays unchanged. |
| `src/components/SubAirVentShowcase.tsx` | Main photograph uses `ResponsiveImage` with layout-based `sizes`. |
| `src/components/PremiumPitchesTech.tsx` | Tab image uses `ResponsiveImage`. Backdrop uses `image-set(webp, original)`. |
| `src/components/sections/ExpertiseSection.tsx` | Card images use layout-based `sizes`. |
| `src/components/sections/ProjectsSection.tsx` | Card images use layout-based `sizes`. Add / Delete controls unchanged. |
| `src/components/modals/ExpertiseDetailsModal.tsx` | Featured, step, and gallery images lazy-load optimized variants when mapped. |
| `src/components/modals/ProjectDetailsModal.tsx` | Same. Enlarged view still uses the existing motion wrapper. |
| `vite.config.ts` | `ensureOptimizedImages()` runs the optimizer only if the manifest or the sample hero WebP is missing. |
| `tsconfig.json` | `"resolveJsonModule": true` so the manifest can be imported. |
| `package.json` | `"optimize-images": "node ./scripts/optimize-homepage-images.mjs"`. No new runtime or development package. |

### Build-only / local scripts (not public site pages)

| File | Why |
| ---- | --- |
| `scripts/phase3-used-images.mjs` | Homepage-first-paint and opened-gallery file lists, role widths, and qualities. |
| `scripts/optimize-homepage-images.mjs` | ImageMagick WebP generator. Reuses existing variants by mtime. Looks in `src/assets/images/` first, then `public/assets/images/`. |
| `scripts/phase3-baseline.mjs` | Isolated-Chrome cold-cache baseline / after measurement. |
| `scripts/inspect-phase3-html.mjs` | Counts prerendered preloads, `picture`, lazy/eager. |
| `scripts/verify-phase3.mjs` | Isolated-Chrome `currentSrc`, carousel next slide, modals, hydration console. |
| `scripts/phase3-disk-size.mjs` | On-disk `dist/` vs `opt/` size. |
| `scripts/homepage-prerender.mjs` | Phase 2D plugin: now strips React-hoisted **image** preloads except one hero WebP with `imagesrcset` / `imagesizes`. Non-image preloads stay. |

### Tooling

- **ImageMagick** `C:\Program Files\ImageMagick-7.1.2-Q16-HDRI\magick.exe` (already on the machine).
- No `sharp` or other image-processing npm dependency.
- Resize: `-resize {width}x>` (never upscales). Quality by role. Alpha files keep `webp:alpha-quality=90`. Method 6. `-strip` metadata only.
- Deterministic names: `{slug}__w{width}.webp` under `public/assets/images/opt/`. Spaces become `_` (`Maamer 1.png` → `Maamer_1__w640.webp`, `Final Top View.png` → `Final_Top_View__w640.webp`).
- A variant that is not smaller than the original **and** is at least 90% of the source width is deleted (`skippedLarger`: 1).

### Preserved, not rewritten

- Visible wording, Phase 2A title / description / canonical.
- `public/robots.txt`, `public/sitemap.xml`.
- Google tag `G-SP37M5NYJ5` and `google-site-verification`.
- Original photographs (not regenerated, cropped, stretched, or deleted).
- Carousel interval (8 s), Motion transitions (1.4 s), tabs, modals, Add / Delete project controls.
- Phase 2D prerender injection (172,360 characters into `#root` after this build; two isolated renderer processes still required).
- Stored `localStorage` URLs and data shapes. Optimized variants are used only when a filename mapping exists.

### Not converted

- Unused showcase modules that are imported but not mounted (`FencingShowcase`, `NaturalGrassShowcase`) unless the same file is also used on the homepage or in an opened gallery.
- Other files that only sit in `public/assets/images/` and are not referenced by the used-image list.

---

## 2. Original-to-variant mapping

Canonical map: `src/data/image-variants.json`.

- **116** source filenames.
- **312** WebP files in `public/assets/images/opt/` and `dist/assets/images/opt/`.
- Lookup key is the original filename (`Img 9.png`, `Maamer 2 .png`, `Final Top View.png`).
- `original` stays `/assets/images/{file}`. `<img src>` is that fallback. Browsers that understand `<picture>` select a WebP from `srcSet`.

### Role widths and quality

| Role | Widths (px, plus native if smaller than source) | WebP quality |
| ---- | ----------------------------------------------- | ------------ |
| hero | 1280, 1920, 2560 | 82 |
| full | 960, 1600, 1920 | 80 |
| detail | 800, 1200 | 88 |
| backdrop | 1280, 1920 | 70 |
| card | 640, 960 | 80 |
| thumb | 160, 320 | 82 |
| gallery | 640, 1280 | 80 |

Hero sources are 1408×768, so 1920/2560 are skipped (no upscale). Native 1408 is added.

### Examples

| Original | Variants |
| -------- | -------- |
| `pristine_pitch_night_1781166845895.png` (958,127 B) | `__w1280.webp` 155,328 B; `__w1408.webp` 185,866 B |
| `Img 9.png` (3,473,529 B) | `__w640.webp` 94,174 B; `__w960.webp` and native-width WebP; largest WebP 505,216 B |
| `Final Top View.png` (2,977,793 B, public-only original) | `__w640.webp` 78,132 B; `__w1280.webp` 262,036 B; `__w1448.webp` 314,500 B |
| `hybrid_soil_block_clone_1781513567584.jpg` | detail quality 88; `__w800.webp` used on desktop/mobile first paint |

`Final Top View.png` is referenced by `src/data/projects.ts` (Hoora gallery) but lives in `public/assets/images/`, not `src/assets/images/`. The optimizer was updated to read that existing public file. The photograph was not replaced. The project URL string was not changed.

---

## 3. Baseline capture (before any image-delivery change)

**Preview:** Phase 2D `http://127.0.0.1:4175/`  
**Evidence:** `seo-audit-evidence/phase-3/baseline-network.json`  
**Shots:** `seo-audit-evidence/phase-3/baseline-shots/baseline-*.png`

### Conditions (same for after)

| Item | Value |
| ---- | ----- |
| Desktop viewport | 1440×900, DPR 1 |
| Mobile viewport | 390×844, DPR 2 |
| Cache | Isolated Chrome profile, `Network.setCacheDisabled`, cache cleared |
| Blocked | gtag, Google Analytics, DoubleClick, Firestore, EmailJS |
| Phase A | Navigate, wait ~2.5 s, **no scroll** |
| Phase B | Instant-scroll `#hybridgrass` → `#sub-air-system` → `#services` → `#expertise` → `#projects` → `#contact` (700 ms each) |
| Phase C | Open first expertise card, then first project card (~1.5 s each) |
| Byte source | `Network.loadingFinished.encodedDataLength` for `Image` or `png|jpe?g|webp|gif|avif` |

The historical “~37 MB” figure is **not** this phase’s after-state. It matches this Phase 2D baseline (36,041,991 bytes on first paint).

### Actual LCP (do not assume the hero photograph)

| Viewport | LCP element | Photo URL |
| -------- | ----------- | --------- |
| Desktop | `H1` hero headline | none |
| Mobile | `SPAN.text-[#0083C9]` logo word | none |

### Displayed vs file (desktop, Phase 2D)

| Use | Displayed (approx.) | File |
| --- | ------------------- | ---- |
| Hero | 1440×900, `object-cover` | 1408×768 JPEG-in-`.png`, 958 KB |
| Hybrid banner | 1182×498 | 1376×768 JPEG, 992 KB |
| Soil block | 494×494, `object-contain` | 1408×768 JPEG, 1.06 MB |
| Backing | 94×94 | JPEG, 906 KB |
| SubAir | 566×350 | JPEG, 1.24 MB |
| Services tab | 264×198 | various |
| Expertise featured | 604×450 | various |
| Project cards | ~371×209 | several multi-MB PNGs |

All homepage `<img>` tags used `loading="auto"` and React-hoisted image preloads, so Phase A already downloaded the full homepage set.

---

## 4. Before / after measurements

MB below is **decimal megabytes** (bytes / 1,000,000). Transfer is **not** the same as `dist/` size.

### Desktop 1440×900 DPR 1

| Phase | Before (4175) | After (4176) |
| ----- | ------------- | ------------ |
| A initial, no scroll | 29 req / **36,041,991 B (36.04 MB)** | 5 req / **673,166 B (0.67 MB)** |
| B after same scroll | 29 / 36.04 MB | 30 / **2,150,860 B (2.15 MB)** |
| C + representative modals | 49 / **51,836,687 B (51.84 MB)** | 53 / **3,950,144 B (3.95 MB)** |

After Phase A URLs (all WebP, no originals):

1. Hero `…pristine…__w1408.webp` 186,136 B  
2. Backdrop `…sports_engineering_backdrop…__w1408.webp` 29,540 B (CSS `image-set`)  
3. Hybrid grass `…__w1376.webp` 182,244 B (lazy, but inside Chrome’s near-viewport fetch distance; element `top` 1135 px)  
4. Soil `…__w800.webp` 125,412 B (lazy, `top` 1731 px)  
5. Next hero slide prefetch `…stadium_turf…__w1280.webp` 149,834 B (client-only, not in prerendered HTML)

### Mobile 390×844 DPR 2

| Phase | Before | After |
| ----- | ------ | ----- |
| A | 29 / 36.04 MB | 6 / **596,710 B (0.60 MB)** — hero **`__w1280.webp`** 155,598 B |
| B | 29 / 36.04 MB | 19 / **1,930,434 B (1.93 MB)** |
| C | 49 / 51.84 MB | 33 / **2,961,880 B (2.96 MB)** |

### Original + variant double download

| Trace | Original image files | WebP `/opt/` |
| ----- | -------------------- | ------------ |
| After desktop A/B | 0 | all |
| After desktop C (final) | **0** | 53 |
| After mobile A/B/C (final) | **0** | all |

`<img src>` still points at the original path as the fallback. Chrome’s `currentSrc` was the WebP. The network log did not fetch both.

### Intermediate Phase C note

The first after-run, before the public-folder fallback for `Final Top View.png`, downloaded that original PNG (2,978,064 B). After mapping it, Phase C dropped from 6,849,808 B to 3,950,144 B. Pass 1 is saved as `seo-audit-evidence/phase-3/after-network-pass1.json`.

### Expertise gallery increment (desktop)

| | Bytes |
| --- | ---: |
| Before | 8,182,408 |
| After | 922,358 |

### Largest individual file reductions (source vs largest generated WebP)

| File | Original | Largest WebP | Saved |
| ---- | -------: | -----------: | ----: |
| `Img 9.png` | 3,473,529 | 505,216 | 2,968,313 |
| `Maamer 4.png` | 3,306,486 | 466,560 | 2,839,926 |
| `najma6.png` | 3,192,237 | 385,638 | 2,806,599 |
| `ittifaq1.png` | 3,033,867 | 318,374 | 2,715,493 |
| `najma1.png` | 3,042,499 | 341,378 | 2,701,121 |
| `isa1.png` | 2,883,558 | 273,086 | 2,610,472 |
| `Maamer 1.png` | 3,046,932 | 451,356 | 2,595,576 |

Card display uses the smaller 640/960 widths, so transfer for those teasers is lower than the “largest WebP” column.

### On-disk build size (separate from transfer)

| Tree | Files | Bytes |
| ---- | ----: | ----: |
| `dist/` | 542 | 304,191,698 (**290.1 MiB**) |
| `public/assets/images/opt/` | 312 | 41,666,000 (39.74 MiB) |

Originals remain in `dist/assets/images/` on purpose. The 290 MiB folder is **not** what the first homepage paint downloads.

Client JS after this build: `dist/assets/index-C8OLdyw2.js` (851.41 kB / 229.12 kB gzip). CSS hash unchanged (`index-DysDIiI-.css`).

---

## 5. Responsive sizing and loading-priority decisions

`sizes` come from the measured layout, not guesses:

| Surface | `sizes` | Loading |
| ------- | ------- | ------- |
| Hero | `100vw` | `eager` |
| Hybrid banner | `(min-width: 1024px) 1182px, calc(100vw - 48px)` | lazy |
| Soil cutaway | `(min-width: 1024px) 500px, calc(100vw - 80px)` | lazy |
| Backing thumb | `96px` | lazy |
| SubAir | `(min-width: 1024px) 566px, calc(100vw - 48px)` | lazy |
| Services tab | `(min-width: 768px) 264px, calc(100vw - 48px)` | lazy |
| Expertise featured / wide | `(min-width: 1024px) 50vw, 100vw` | lazy |
| Expertise standard | `(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw` | lazy |
| Project cards | `(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw` | lazy |
| Project modal hero | `(min-width: 768px) 896px, 100vw` | lazy until opened |
| Modal gallery thumbs | 96px / 20vw / 400px as laid out | lazy until opened |

`width` / `height` on `<img>` are the **intrinsic source** dimensions from the manifest. CSS (`w-full h-full object-cover` / `object-contain`, existing wrappers) still controls layout. Before/after screenshots show the same crop and aspect.

`fetchPriority="high"` is **not** set. Measured LCP is the H1 / logo span, not the photograph.

Carousel: only the visible slide is in the tree (`AnimatePresence mode="wait"`). The next slide’s WebP is prefetched in a client `useEffect` so the 1.4 s crossfade is not a blank image. That prefetch does not appear in prerendered HTML.

Modals do not fetch their galleries until opened. Homepage cards stay lazy.

### `localStorage` images

`resolveImageDelivery` maps by filename after normalizing `/src/assets/images/` → `/assets/images/`. Stored records are not rewritten. Custom, external, or unknown URLs keep their `src`. A constructed `https://example.com/custom-unknown.jpg` was not rewritten.

---

## 6. Preload verification

`dist/index.html` after the Phase 3 build:

- **1** image preload: hero WebP with  
  `imagesrcset="…__w1280.webp 1280w, …__w1408.webp 1408w"` and `imagesizes="100vw"`.
- **0** below-the-fold PNG/JPEG preloads.
- **28** `<picture>` / `<img>` pairs. The hero is `loading="eager"`; the other prerendered photographs are `loading="lazy"` (`seo-audit-evidence/phase-3/dist-html-images.json`).
- Gtag `G-SP37M5NYJ5`, site-verification meta, and H1 copy present.

Network trace agrees: Phase A does **not** download the full homepage original set. Remaining early bytes are the hero, the CSS backdrop, Chrome’s near-viewport lazy speculation (hybrid + soil), and the next-slide prefetch.

The browser selected **one** hero width (desktop 1408, mobile 1280), not both preloaded candidates.

---

## 7. Visual comparisons

Same viewport, slide 1, and section positions. Files:

`seo-audit-evidence/phase-3/baseline-shots/baseline-{desktop,mobile}-{hero,hybrid,expertise,projects,contact,modal}.png`  
`seo-audit-evidence/phase-3/baseline-shots/after-{desktop,mobile}-{hero,hybrid,expertise,projects,contact,modal}.png`

| Pair | Result |
| ---- | ------ |
| Desktop hero | Same pitch crop, floodlights, overlays, 01/03. No visible WebP banding on grass. |
| Mobile hero | Same composition and controls. |
| Hybrid | Same stadium crop, overlay type, grass texture. |
| Expertise | Same artificial-grass macro, sprinkler, chain-link fence, buildings. Fence mesh and grass blades remain sharp at card size. |
| Projects | Same Hoora / North Sehla / Isa Sports City crops. |
| Hoora modal | Same featured pitch, fencing, gallery thumbs. `Final Top View` now shows as WebP (`Final_Top_View__w640.webp`) without a layout change. |

Logos and UI type are SVG/HTML, not in the photographs. Text baked into photographs (fence / building signage) did not show new compression damage at the displayed sizes.

Motion still delays the hero photograph after the file has downloaded. That is the Phase 2D rendering limitation, not an image-byte problem.

---

## 8. Hydration and interaction checks

Isolated Chrome, `http://127.0.0.1:4176/?v=phase3-verify`, analytics / Firestore / EmailJS blocked. Evidence: `seo-audit-evidence/phase-3/verify-phase3.json`.

| Check | Result |
| ----- | ------ |
| Title / H1 | Unchanged Phase 2A title; H1 `WE BUILD THE GROUND NATURAL GRASS PLAYS THE GAME` |
| Hydration console | **No** `[hydration]` messages, no exceptions |
| Visible broken images | **None** |
| Desktop hero `currentSrc` | `…pristine…__w1408.webp` |
| Hero fallback `src` | original `.png` (not transferred) |
| Next slide | `…stadium_turf…__w1408.webp`, `complete`, not blank |
| Expertise modal | Opened; featured + steps are `/opt/*.webp` |
| Project modal | Hoora opened; `Final_Top_View__w640.webp` + hora WebPs |
| Unknown URL | `https://example.com/custom-unknown.jpg` not rewritten |
| Carousel timing | Still `intervalTime = 8000` |
| Prerender | 172,360 characters injected; inspect counts stable after rebuild |

The measurement script’s `projectModalOpen` flag used a case-sensitive `"Project Overview"` test and reported false even when the Hoora modal was on screen. Screenshots and `verify-phase3.mjs` (case-insensitive) confirm the modal.

A Cursor IDE browser profile still held leftover Phase 2D **synthetic** expertise in `localStorage`. Isolated measurement profiles did not. Stored records were not rewritten by this phase.

---

## 9. Lighthouse

**Not tested.** `lighthouse` is not installed in the project or on `PATH`. No Lighthouse dependency was added. Local measurements were not labeled as field Core Web Vitals. Animations were not disabled and images were not blocked to inflate a score.

---

## 10. Remaining limitations

- Chrome may still fetch lazy images that sit just below the fold (hybrid / soil on desktop A; backing on mobile A). That is the browser’s lazy distance, not a leftover React image preload.
- The services backdrop is a CSS background, so it cannot use `loading="lazy"`. It is now a ~30 KB WebP instead of a ~612 KB PNG.
- Motion still hides the hero photograph until JS animation runs (no-JS hero photo limitation from Phase 2D). Smaller files do not remove that delay.
- `dist/` stays large because originals are kept.
- Photographs used only by unmounted showcases were not bulk-converted.
- `fetchPriority="high"` is intentionally unused; LCP is text.
- Existing TypeScript `contactMethod` mismatch in `src/App.tsx` was not touched.
- Lighthouse: not tested.
- Production / hosting / Search Console: not in scope.

---

## 11. Local rollback (no git commit)

1. Delete `public/assets/images/opt/` and `src/data/image-variants.json`.
2. Revert the Phase 3 component/util files to `<img src={getImgUrl(...)}>` (or restore from your working tree).
3. Restore the previous `splitSsrMarkup` image-preload behavior in `scripts/homepage-prerender.mjs` if you want every React-hoisted image preload back.
4. Remove `ensureOptimizedImages()` from `vite.config.ts` and the `optimize-images` script if desired.
5. Rebuild: `node .\node_modules\vite\bin\vite.js build`.

Do not `git checkout` unless you intend to discard other uncommitted work (Phase 2A–2D sources, SEO docs, robots/sitemap).

---

## 12. Close-out

### What improved

- First desktop paint image transfer: **36.04 MB → 0.67 MB** (29 → 5 requests).
- Same desktop scroll: **36.04 MB → 2.15 MB**.
- Desktop + two representative galleries: **51.84 MB → 3.95 MB**, with **no** leftover original+WebP pairs.
- Mobile first paint: **36.04 MB → 0.60 MB**, and the hero `currentSrc` correctly chose **1280w** instead of 1408w.
- Multi-megabyte card/gallery PNGs now have WebP variants in the 50–500 KB range at display widths.
- Prerendered HTML no longer eagerly preloads every homepage photograph.

### What was verified

- Phase 2D `#root` injection still populated and deterministic (172,360 characters).
- No new hydration errors.
- Generated `/opt/` URLs resolve (200).
- Unknown / custom URLs are not rewritten.
- Desktop vs mobile `currentSrc` selection.
- Carousel next slide is a real WebP, not a blank frame.
- Expertise and Hoora galleries show the intended pictures.
- Before/after screenshots: same crop, no obvious compression damage on grass, fencing, or in-photo detail.
- Gtag, verification meta, robots, sitemap, and visible wording untouched.

### What remains

- Motion / no-JS hero-photo timing.
- Near-viewport lazy speculation and the CSS backdrop request.
- Large on-disk `dist/` while originals are retained.
- Lighthouse untested.
- Nothing deployed.

### Confirmation

**Phase 3 is complete locally.**

Nothing was committed, pushed, or deployed. Hosting settings and credentials were not requested or changed. Phase 2D was not re-assessed. Stop here; do not start another SEO phase from this document.
