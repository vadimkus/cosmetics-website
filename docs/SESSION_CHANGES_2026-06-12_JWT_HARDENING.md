# Session Changes — 2026-06-12 — JWT Hardening (lib/jwt.ts)

## What changed

Two security fixes in `lib/jwt.ts` (Tier 3 audit item):

1. **`getJwtSecret()` now hard-fails in production when `JWT_SECRET` is missing.**
   Previously it fell back to a deterministic secret derived from `DATABASE_URL` (or a fixed dev string) and only logged a warning — a guessable signing key for every session cookie and mobile token. Now: `throw` in production; the deterministic fallback remains for development/test only. Safe to enforce: `JWT_SECRET` is set in Vercel for Development, Preview, and Production (verified via `vercel env ls`; set ~120 days ago).

2. **Removed the legacy unsigned-JSON cookie branch from `verifySessionToken()`.**
   The migration-era branch accepted any cookie starting with `{` as a valid session **without signature verification and without expiry**. This was an active privilege-escalation hole: `app/api/orders/route.ts` trusts `session.isAdmin` from the cookie, so a hand-crafted `{"isAdmin":true,...}` cookie passed the admin gate. Legacy cookies are now rejected (`null`), forcing a normal sign-in.

## Impact

- **Users with pre-migration (4+ months old) raw-JSON cookies are signed out once** and must log in again. The signed-JWT format has been issued on every login since the migration, and session cookies expire after 30 days anyway, so the affected population is near zero.
- No change to Google/Apple OAuth, password login, mobile app tokens, Stripe, or orders — all token issuance paths already produce signed JWTs.

## Verification

- `tsc --noEmit` clean
- Full Jest suite: 29 suites, 248 passed (3 skipped)
- `next build` clean (393 static pages)
- Post-deploy production smoke: homepage, `/api/auth/session` with no cookie (401/guest), forged legacy-JSON cookie rejected, login flow works
