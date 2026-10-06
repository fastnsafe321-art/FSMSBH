# Fast & Safe Maintenance Services — Phase 3A Image Pipeline Hardening

**Date:** 14 September 2026  
**Scope:** Harden the existing local image pipeline. Phase 3 variants, layout, prerender, hydration, metadata, Google tag `G-SP37M5NYJ5`, and stored browser data were not redesigned.  
**Live website:** Unchanged. No commit, push, or deploy was performed.

Phase 3 optimization remains in place. This phase does not restart the SEO audit or replace photographs.

---

## 1. Actual issues found

1. **`ensureOptimizedImages()` was a shortcut.** It returned as soon as `image-variants.json` and one hero WebP existed. Source edits, inventory edits, quality/width/encoder changes, and missing non-sample variants could leave stale output.
2. **Reuse used modification time.** A source rewritten in place, or a clock-skewed copy, could be treated as current.
3. **`resolveImageDelivery` matched on basename.** An external URL such as `https://cdn.example.com/assets/images/pristine_pitch_night_….png` could be given local WebP variants.
4. **Carousel prefetch used a fixed 1280w floor.** At desktop 1440×900 DPR 1 the displayed slide selected **1408w**. Phase 3 traces showed prefetch `__w1280.webp` and later `currentSrc` `__w1408.webp` for the same next slide.
5. **Hero preload markup was hardcoded.** A naming or width change could desynchronize `srcSet`, preload, and the manifest.
6. **Isolated SSR imported `vite.config.ts` again.** That re-ran generation during the prerender Vite build.
7. **Encoder path was a single Windows default, and config errors were swallowed.** A missing encoder could continue on stale files.
8. **Variant stems could collide.** `space name.png` and `space_name.png` both slugged to `space_name`; `twin.png` and `twin.jpg` both slugged to `twin`.
9. **One discarded near-full-width WebP was rebuilt every run.** Phase 3 deleted a variant that was not smaller than its original. The next run saw a missing file and encoded it again.

---

## 2. Exact files changed

| File | Why |
| ---- | --- |
| `scripts/image-pipeline.mjs` | Incremental fingerprints, ImageMagick discovery, collision stems, manifest verification, hero preload helper. |
| `scripts/image-path-rules.mjs` | Known local-path guard used by delivery and tests. |
| `scripts/image-path-rules.d.ts` | Type shim for the guard. |
| `scripts/optimize-homepage-images.mjs` | Thin CLI around `ensureOptimizedImages()`. |
| `scripts/homepage-prerender.mjs` | Hero preload tag is built from the current manifest. |
| `vite.config.ts` | Incremental generate before the client build; skip when `FSMS_SSR_BUILD=1`. Generation failures are not swallowed. |
| `src/utils/imageVariants.ts` | Local-only lookup; `pickVariantHrefForDisplay` / `prefetchResponsiveImage`. |
| `src/components/HeroCarousel.tsx` | Prefetch uses `sizes="100vw"` and current viewport × DPR. Interval remains 8 s. |
| `src/data/image-variants.json` | Added `settingsHash`, `inventoryHash`, per-image `sourceHash`, `fingerprint`, `variantStem`, `skippedWidths`. Existing hrefs kept where stems did not collide. |
| `scripts/verify-phase3a-pipeline.mjs` | Isolated fixture tests. |
| `scripts/verify-phase3a-delivery.mts` | `resolveImageDelivery` / viewport pick tests. |
| `scripts/verify-phase3a-browser.mjs` | Focused hydration + carousel network check. |

Originals under `src/assets/images/` and `public/assets/images/` were not edited for invalidation tests.

---

## 3. Freshness and collision-handling rules

### Freshness

A variant is reused only when **all** of these hold:

- The planned output file exists.
- The manifest still points at the same `href` and width.
- The image **fingerprint** matches, or this is the one-time Phase 3 adoption (same role, quality, and recorded byte size) while fingerprints are first written.

Fingerprint input (SHA-256 of JSON):

- SHA-256 of the **source file bytes**
- Role, quality, planned widths
- Variant stem
- Settings hash (encoder version, WebP method 6, alpha quality 90, resize `{width}x>`, skip-larger ratio, naming version, role widths, role qualities)

Inventory hash is the used-file list plus roles. A new used file is generated; removed files are dropped from the manifest. Unlisted `*.webp` files in `public/assets/images/opt/` are deleted. Originals are never deleted.

If a listed variant file is missing, only that file is restored.

If settings change (quality, widths, encoder options), fingerprints change and affected variants are rewritten.

A width that was encoded and then discarded as not smaller is stored in `skippedWidths` so later runs do not encode it again.

The client Vite process runs `ensureOptimizedImages()` when the config loads, **before** the bundle reads `image-variants.json`. The isolated SSR build sets `FSMS_SSR_BUILD=1` and logs `Skipping image generation during isolated SSR build`. Observed on the 14 September 2026 production build.

After generation, every manifest `href` must exist on disk or the run fails.

### Collisions

Default stem is the Phase 3 slug (non-alphanumerics → `_`). If two used filenames share that stem, each gets a disambiguated stem:

- Spaces are `~s` (so they differ from `_`)
- Original extension is appended (`twin__png` vs `twin__jpg`)
- A leftover clash gets an 8-character content hash suffix

The pipeline refuses to let two sources own the same stem. Fixture result:

| Source | Stem |
| ------ | ---- |
| `space name.png` | `space~sname__png` |
| `space_name.png` | `space_name__png` |
| `twin.png` | `twin__png` |
| `twin.jpg` | `twin__jpg` |

Current homepage inventory has no colliding default stems, so existing `/opt/{slug}__w{width}.webp` names were kept. `srcSet`, the hero preload, and the manifest stay aligned because the preload tag is generated from the manifest.

---

## 4. Encoder prerequisite

**ImageMagick `magick` is required when any variant must be generated or identified.**

Detection order:

1. `FSMS_MAGICK` — must be a working executable. A bad value fails immediately.
2. `magick` / `magick.exe` on `PATH`
3. Documented Windows path: `C:\Program Files\ImageMagick-7.1.2-Q16-HDRI\magick.exe`

If generation is required and no encoder is found, the process throws:

```
[image-pipeline] ImageMagick is required to generate optimized image variants.
Install ImageMagick and ensure `magick` is on PATH, or set FSMS_MAGICK to the executable.
Documented Windows path: C:\Program Files\ImageMagick-7.1.2-Q16-HDRI\magick.exe
```

Unchanged inputs do **not** need ImageMagick. A reuse-only production run reported `"magick": null`, `"created": 0`, `"reused": 312`.

This environment was not modified. ImageMagick was not installed or reconfigured here.

---

## 5. Targeted test results

Evidence: `seo-audit-evidence/phase-3a/`.

### Isolated fixtures (`verify-phase3a-pipeline.mjs`)

Temporary 64×48 PNGs/JPEGs only. **allPassed: true**

| Check | Result |
| ----- | ------ |
| Second run on unchanged inputs | created 0, reused 12, same files and mtimes |
| One source rewritten | that image’s hash/fingerprint changed; `beta.png` unchanged |
| One variant deleted | file restored |
| Quality 80 → 40 | created ≥ 1 |
| Space vs underscore / png vs jpg | distinct stems and files |
| `FSMS_MAGICK` pointed at a missing exe while a variant was missing | failed with the configured-encoder message |

### Delivery (`verify-phase3a-delivery.mts`)

Uses the real `resolveImageDelivery`. **allPassed: true**

| Input | Optimized? |
| ----- | ---------- |
| `/src/assets/images/pristine_….png` | yes |
| `/assets/images/pristine_….png` | yes |
| `https://cdn.example.com/assets/images/pristine_….png` | **no**; `src` unchanged |
| `https://www.fsmsbh.com/assets/images/pristine_….png` | **no** |
| `data:` / `blob:` | **no** |
| `/assets/images/not-a-real-file-xyz.png` | **no** |
| `/assets/images/pristine_….png?v=2` | **no** |
| 1440 CSS px × DPR 1 | picks `__w1408.webp` |
| 390 CSS px × DPR 2 | picks `__w1280.webp` |

`localStorage` is not read or written.

### Production build

```
[Asset Setup] Image pipeline {"created":0,"reused":312,"mapped":116,"writtenManifest":false}
[Asset Setup] Skipping image generation during isolated SSR build
[homepage-prerender] Injected 172360 characters into dist/index.html #root
```

One image preload remains, sourced from the manifest. Gtag and verification meta remain. Dist HTML: 28 `<picture>` / `<img>` pairs.

### Focused browser (`verify-phase3a-browser.mjs`)

Preview `http://127.0.0.1:4176/`, 1440×900, DPR 1, isolated Chrome, analytics/Firestore/EmailJS blocked.

| Check | Result |
| ----- | ------ |
| Prerendered hero `srcSet` vs hydrated `srcset` | identical |
| Fallback `src` | original PNG path (not transferred as the selected resource) |
| Hydration console | no `[hydration]` errors |
| Next-slide `currentSrc` | `stadium_turf_…__w1408.webp`, not blank |
| Stadium requests in that sequence | **1408w only** (prefetch and display) |

Lighthouse and the full screenshot suite were not repeated.

---

## 6. Carousel request findings

Phase 3 reported a desktop prefetch of **1280w** and a displayed next-slide `currentSrc` of **1408w**. That pair is real: `preferredVariantHref(next, 1280)` took the first width ≥ 1280, while `sizes="100vw"` at 1440×1 needs 1440 px and therefore 1408w.

The prefetch now uses the same rule as the displayed hero (`100vw` × `devicePixelRatio`). On the focused desktop check, `stadium_turf_night_pro` appeared only as `__w1408.webp` before and after Next. The 8-second interval, 1.4 s Motion transition, and crop were not changed.

---

## 7. Remaining limitations

- Absolute `http(s)` URLs are never optimized, even if they point at this origin. Safer than basename matching; stored relative `/src/assets/images/…` and `/assets/images/…` paths still map.
- Query strings and hashes are not treated as the same asset.
- The first fingerprint adoption may treat an equal-sized rewrite as unchanged if `sourceHash` was not yet stored. Later runs compare bytes hashes.
- ImageMagick is still required when output must be created or identified.
- Chrome may still fetch nearby lazy images; that is unchanged browser behavior.
- Motion / no-JS hero-photo timing is unchanged.
- On-disk `dist/` still includes originals.

---

## 8. Close-out

### What was fixed (supported by the checks)

- Incremental, content-hashed generation before the client build; SSR does not recurse into generation.
- Missing or stale variants regenerate; unchanged inputs reuse files without ImageMagick.
- A missing encoder fails with an actionable message instead of keeping silent stale output.
- Only verified local image paths get WebP `srcSet`.
- Colliding filenames cannot overwrite each other.
- Desktop next-slide prefetch no longer downloads 1280w and 1408w for the same photograph.
- Prerendered and hydrated hero `srcSet` strings match.

### Confirmation

Nothing was committed, pushed, or deployed. Hosting and accounts were not changed. Stop after this bounded Phase 3A task.
