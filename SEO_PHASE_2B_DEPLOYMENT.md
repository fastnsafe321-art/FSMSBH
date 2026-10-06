# Fast & Safe Maintenance Services — Phase 2B Deployment

**Date:** 14 September 2026  
**Authorized scope:** Publish the completed Phase 2A files to the existing production host `https://www.fsmsbh.com/`.  
**Live website after this phase:** Unchanged.

No application code, dependencies, images, CSS, Firebase, EmailJS, routing, environment variables, or hosting configuration were modified in this phase. No commit, push, or deploy was performed.

---

## 1. Verified production project and domain

| Check | Result |
| ----- | ------ |
| Production URL | `https://www.fsmsbh.com/` — **200**, `Server: Vercel` (fresh fetch 14 Sep 2026 10:17 UTC) |
| Apex | Previously confirmed 308 to www (Phase 0). Not re-changed |
| Repo remote | `origin` = `https://github.com/SID-CJ/fastNsafe.git` |
| Local branch | `main` @ `2257364d05aa51dbc28452af39ac69ec088ff29f` (`activities`, 1 Jul 2026), tracking `origin/main` |
| `vercel.json` / `.vercel/` / `.github` workflows | **Absent** in the repository |
| Vercel CLI | **Not installed** |
| `~/.vercel` or project `.vercel` | **Absent** |
| `VERCEL_TOKEN` / `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` | **Not set** |
| GitHub fetch/push from this environment | `git fetch origin` → `Repository not found` |
| Public GitHub page | `https://github.com/SID-CJ/fastNsafe` → **404** |
| Connect GitHub prompt | User **skipped** |

The live hostname is the existing Vercel site for `www.fsmsbh.com`. The **Vercel project name, team, and deployment ID are not available** in this checkout or this machine’s credentials.

A replacement Vercel project was **not** created.

---

## 2. Production baseline and source comparison

### Live production artifact (still pre–Phase 2A)

| Item | Value |
| ---- | ----- |
| Homepage status | 200 |
| Raw title | `Fast N Safe` |
| Meta description | Absent |
| Canonical | Absent |
| JS / CSS | `/assets/index-CNlKet0d.js`, `/assets/index-BVXGzQw9.css` |
| ETag | `4ce99ef4bf3e19304fc00aa5adf1ffb9` |
| Last-Modified (`/`) | Thu, 10 Sep 2026 05:16:00 GMT |
| `/robots.txt` | **404** `X-Vercel-Error: NOT_FOUND` |
| `/sitemap.xml` | **404** `X-Vercel-Error: NOT_FOUND` |
| `/index.html` | **200**, same ETag, `Content-Disposition: inline; filename="index.html"` (not redirected) |
| `/about` | **404** `NOT_FOUND` |

This is the **previous production identifier** that can be used for comparison after a future deploy (ETag + asset hashes). A Vercel deployment UUID could **not** be read.

### Local source vs that baseline

`git show HEAD:index.html` is the same CSR shell as production (`Fast N Safe`, no description, no canonical), plus the Vite module script that the host rewrites to hashed assets.

Local `main` has **no later application commits** after `2257364`. Working-tree **tracked** difference versus `HEAD`:

- `index.html` — three head lines only (title, description, canonical). Body unchanged.

Untracked **approved** application files (not in `HEAD`):

- `public/robots.txt`
- `public/sitemap.xml`

Untracked **non-release** files (audit docs and evidence; not staged; not in `public/` HTML output):

- `SEO_*.md`, `seo-audit-evidence/`

`dist/` is gitignored. A local Vite build of the Phase 2A source produced different asset hashes (`index-DjXcGWzy.js`) than production (`index-CNlKet0d.js`). That is consistent with a later local rebuild of the same architecture. **Hash difference alone is not treated as an application change.**

### Would deploying this checkout publish unrelated application changes?

**Against local `HEAD` `2257364`:** no. Only the three approved SEO files differ as application source.

**Against the live Vercel deployment:** source HTML matches `HEAD`. The host rebuild date (10 Sep 2026) is after the 1 Jul 2026 commit; that is consistent with a later Vercel rebuild of the same Git revision, but the **exact Vercel git SHA was not confirmed**.

Because the existing Vercel project cannot be selected or authenticated here, that residual SHA uncertainty was **not** used as a reason to invent a deploy target. Isolated checkout was unnecessary for local cleanliness; it would not have supplied missing host credentials.

---

## 3. Exact changes prepared (not released)

Ready on disk, matching Phase 2A:

**Title:** Football Pitch Construction in Bahrain | Fast & Safe Maintenance Services  
**Description:** Fast & Safe Maintenance Services installs artificial turf and natural grass sports pitches in Bahrain. Based in Sitra. Request a consultation.  
**Canonical:** `https://www.fsmsbh.com/`

`public/robots.txt` allows `/` and declares the sitemap.  
`public/sitemap.xml` lists only `https://www.fsmsbh.com/`.

These files were **not** committed or uploaded.

---

## 4. Commit / deployment identifier

| Item | Value |
| ---- | ----- |
| New git commit | **None** |
| Push | **None** |
| New Vercel deployment | **None** |
| Previous live artifact | ETag `4ce99ef4bf3e19304fc00aa5adf1ffb9`; JS `index-CNlKet0d.js`; title `Fast N Safe` |

---

## 5. Build and deployment results

| Step | Result |
| ---- | ------ |
| Phase 2A local `vite build` | Already succeeded (see `SEO_PHASE_2A_IMPLEMENTATION.md`) |
| Git-triggered deploy | **Blocked** — no writable GitHub access to `SID-CJ/fastNsafe`; user skipped GitHub connect |
| Vercel CLI / API deploy to the existing project | **Blocked** — no CLI, no token, no project link |
| Rollback mechanism | Existing Vercel dashboard/CLI rollback **not usable** from this environment |

Nothing was published.

---

## 6. Production HTTP and metadata checks

Fresh production checks (14 Sep 2026) confirm the site is **still the pre–Phase 2A artifact**. These are baseline confirmation, not post-release verification.

| URL | Status | Notes |
| --- | ------ | ----- |
| `https://www.fsmsbh.com/` | 200 | Title still `Fast N Safe`; no description; no canonical |
| `https://www.fsmsbh.com/robots.txt` | 404 | Not the new robots file |
| `https://www.fsmsbh.com/sitemap.xml` | 404 | Not the new sitemap |
| `https://www.fsmsbh.com/index.html` | 200 | Same document; redirect **not** added (in scope to record only) |
| `https://www.fsmsbh.com/about` | 404 | Expected hard 404 unchanged |

HTTPS `Strict-Transport-Security` remains. Preferred host remains www on the homepage fetch used here.

---

## 7. Browser checks

**Not run against a new production release.** Phase 2A already verified the same three files on local Vite preview only. Live production was not re-browsed for this failed deploy, because no new build was published.

---

## 8. Lighthouse

**Not tested** for Phase 2B. There is no new production deployment to audit. Do not reuse the local preview 100 as a live-site score.

---

## 9. Rollback

**Not needed.** No deployment was published.

---

## 10. Remaining work

To finish Phase 2B from a machine that already owns the **existing** Vercel project for `www.fsmsbh.com`:

1. Restore access to that project (Vercel login or `VERCEL_TOKEN` + existing `VERCEL_PROJECT_ID`) **or** restore push access to the GitHub repository that project already builds.  
2. Record the current Vercel deployment ID from that project (rollback handle).  
3. Stage **only** `index.html`, `public/robots.txt`, and `public/sitemap.xml`.  
4. Normal commit + push to the existing production branch, **or** `vercel --prod` **only** after linking the existing project (do not create a new project).  
5. Re-run the Phase 2B production HTTP, browser, and optional Lighthouse checks.

Do not start another SEO phase until that publish succeeds.

---

## Status

**Not deployed, with the exact blocker.**

This environment cannot authenticate to the existing Vercel project that serves `www.fsmsbh.com`, and cannot push to `https://github.com/SID-CJ/fastNsafe.git`. Creating a new host or guessing a project ID was not allowed. Production remains the 10 September 2026 `Fast N Safe` artifact.
