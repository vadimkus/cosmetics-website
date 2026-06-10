# Session Changes — 2026-06-10 — Env File Scrub + Remaining Route Guards

Follow-up to `SESSION_CHANGES_2026-06-10_ADMIN_AUTH_BYPASS_FIX.md` (audit Tasks 1.2 / 1.4 / SEC-2).

## What was done

### Step 2 — Git hygiene (both repos)

Discovered the website tracked **five** env files (worse than the audit's initial `.env.bak` finding):

| File | Leaked |
|---|---|
| `.env` | Postgres URL + password, Prisma Accelerate API key, MoySklad login + password |
| `.env.backup.20250920_222701` | Database URLs |
| `.env.local.backup.20250920_222705` | Database URL, SMTP password, Gmail app password |
| `.env.new` | `file:./dev.db` only (harmless, untracked anyway) |

Mobile repo tracked `.env.backup` (website DB credentials).

- `git rm --cached` all of the above (files remain on disk for local dev)
- Hardened both `.gitignore`s: `.env`, `.env.*`, with `!.env.example` exception
- Verified BEFORE untracking that all critical vars (`DATABASE_URL`, `PRISMA_DATABASE_URL`, `POSTGRES_URL`, `MOYSKLAD_LOGIN/PASSWORD`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `GMAIL_APP_PASSWORD`, `MOBILE_APP_KEY`) exist in the Vercel production dashboard — so deploys do not depend on the tracked `.env`
- Commits: website `301843f7` (rewritten), mobile `214782d`

### Step 4 — Remaining unguarded routes (website)

- `app/api/admin/create-payment-blog` — was a zero-auth DB write; now `requireAdminAuth`
- `app/api/init-db` (GET + POST) — leaked user/order/product counts; now `requireAdminAuth`
- `app/api/admin/ping-search-engines` — accepted any `Bearer x` token (format-only check); now `requireAdminAuth`
- `app/api/auth/register` — added 10/hour per-client rate limit (mobile register already had 5/hour; mobile untouched)
- New tests: `__tests__/api/guarded-routes-auth.test.ts` (10 tests: 401-before-DB, admin-session acceptance, rate-limit behavior)
- Commit: `18d9a49d` (rewritten hash)

### Step 3 — History scrub (both repos)

- `git filter-repo --invert-paths` on mirror clones, purging from ALL history:
  - website: `.env`, `.env.backup.20250920_222701`, `.env.local.backup.20250920_222705`, `.env.new`, **`.env.production`** (extra file found in history, deleted from tree long ago)
  - mobile: `.env.backup`, **`.env`** (also found in history)
- `.env.example` intentionally kept
- Force-pushed all branches/tags; rewritten HEAD trees verified byte-identical to pre-scrub HEADs
- Local clones reconciled via `git fetch` + `git reset --soft origin/main` (working trees untouched)
- Six local-only backup branches were accidentally published during the mirror push and immediately deleted from GitHub (`IAMDIFFERENT`, `backup-working-version`, `full-backup*`, `working-version`)

## Production verification (genosys.ae, post-deploy)

| Check | Result |
|---|---|
| Homepage / products API | 200 |
| `GET /api/init-db` | 401 (was leaking counts) |
| `POST /api/admin/create-payment-blog` | 401 |
| `POST /api/admin/ping-search-engines` + junk Bearer | 401 (old bypass closed) |
| `POST /api/webhooks/stripe` unsigned | 400 "Missing signature" (intact) |
| `POST /api/auth/login` / `register` via curl | 403 CSRF (routes alive, protections intact) |
| `GET /api/mobile/products` without key | 401 (mobile API key flow unchanged) |
| tsc / eslint / jest | clean; only pre-existing `pricingEngine.test.ts` failures (11, same as baseline) |

## Still pending (the important one)

**Step 1 — credential rotation.** The history scrub removes the files from GitHub going forward, but GitHub may retain unreachable objects/cached views for a while, and anyone who cloned earlier has the secrets. Rotation is the actual kill switch:

1. Prisma console → rotate DB password + Accelerate API key → update `DATABASE_URL`, `PRISMA_DATABASE_URL`, `POSTGRES_URL` in Vercel
2. MoySklad → change password → update `MOYSKLAD_PASSWORD` in Vercel
3. SMTP (`hello@genosys.ae`) + Gmail app password → rotate → update `SMTP_PASS` / `GMAIL_APP_PASSWORD`
4. Redeploy

## Note for other machines

If the repos are cloned on any other machine, re-clone (or `git fetch && git reset --hard origin/main`) — history was rewritten.
