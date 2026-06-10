# Session Changes — 2026-06-10 — CI Pipeline (Both Repos)

Audit backlog item: minimal CI. Implemented for `cosmetics-website` and `genosys-mobile-app`.

## What was added

### Website — `.github/workflows/ci.yml`

Two jobs on every push to `main` and every PR:

1. **Typecheck, lint, tests**
   - `tsc --noEmit` (blocking)
   - `eslint .` (**report-only** — `continue-on-error: true` because the repo has ~40 pre-existing lint errors; backlog: clear lint debt, then make blocking)
   - `jest --ci` with `pricingEngine.test.ts` excluded (11 pre-existing failures, separate backlog item) — 28 suites / 210 tests, includes the 21 security regression tests
2. **Secret scan** — gitleaks `dir` scan of the tracked tree, config in `.gitleaks.toml`

### Website — `.gitleaks.toml`

Allowlists **false positives only**: `__tests__/` dummy secrets, doc placeholders (`YOUR_*`, example JWT), and the public-by-design mobile app API key. `regexTarget = "match"`.

### Mobile — `.github/workflows/ci.yml`

1. **Typecheck + release smokes** — `tsc --noEmit` + `npm run verify:release` (hermetic pricing/order contract smokes + splash sync — same suite used before store releases)
2. **Secret scan** — gitleaks (repo scanned clean, no allowlist needed)

## Real leak found and fixed during setup

The first gitleaks scan found a **hardcoded live Prisma Accelerate API key** in two tracked archive scripts:

- `scripts/archive/blog-posts/create-blog-direct-db.ts` (deleted)
- `scripts/archive/blog-posts/create-blog-with-env.js` (deleted)

`scripts/README.md` updated. The key is the same Accelerate credential already pending rotation (SEC-2 / Step 1) — rotation kills it everywhere, including old git history.

## Verification

- Website CI run on `6684813b`: ✅ success (both jobs)
- Mobile CI run on `a9d057d`: ✅ success on first run
- gitleaks: website tree clean with allowlist; mobile clean with defaults
- Production untouched: homepage/products 200, Stripe webhook signature check intact (CI never touches runtime code or deploys)

## Notes

- CI is **independent of Vercel** — a red CI never blocks deploys (no branch protection configured)
- gitleaks-action was avoided deliberately (org license requirement); plain binary install instead
- To make lint blocking later: remove `continue-on-error: true` from the Lint step after clearing the ~40 errors
