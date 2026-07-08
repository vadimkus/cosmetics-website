# Session Changes — Test/Debug API Routes Audit & Cleanup

**Date:** 2026-07-08
**Scope:** Audit of `/api/init-db`, `/api/update-admin-email`, `/api/test-*`, `/api/debug/*` (plus the same-family `/api/send-*-test` routes) — confirm admin guards, delete dead routes.

## Audit result

### Kept (guarded + actually used)

| Route | Guard | Caller |
|---|---|---|
| `GET/POST /api/init-db` | `requireAdminAuth` on both methods | `app/admin/init-db/page.tsx`; regression-tested in `__tests__/api/guarded-routes-auth.test.ts` |
| `POST /api/test-email` | `requireDevelopment` + `requireAdminAuth` + CSRF | fallback in `scripts/send-welcome-email.js` |
| `POST /api/debug/order-calculation` | `requireDevelopment` + `requireAdminAuth` + CSRF | manual pricing-integrity debug tool (reworked 2026-04-26) |
| `GET /api/mobile/test` | `MOBILE_APP_KEY` (`x-api-key`) check | mobile API setup diagnostic, referenced in mobile docs |

### Deleted (dead — zero callers in app code, scripts, or tests)

| Route | Guard it had | Notes |
|---|---|---|
| `POST /api/update-admin-email` | admin auth | guarded but nothing called it |
| `POST /api/test-admin` | dev-only + admin + CSRF | debug clone of admin-login (could also upgrade plaintext passwords) |
| `POST /api/test-admin-notification` | dev-only + admin + CSRF | |
| `GET /api/test-admin-orders` | dev-only | no admin auth — trusted a spoofable `x-admin-email` header |
| `GET /api/test-email-config` | dev-only + admin | |
| `POST /api/test-discount-email` | dev-only | no admin auth |
| `GET/POST /api/test-enhanced-mobile` | GET dev-only; **POST had NO guard at all** | the real find of the audit — POST would run in production, querying users/products by ID |
| `GET /api/debug/analytics` | dev-only + admin | |
| `GET /api/debug/profile-picture` | dev-only | was fetched by `app/profile/page.tsx` in production → always 404, wasted request per profile load |
| `POST /api/send-welcome-test` | dev-only | no admin auth |
| `POST /api/send-sample-admin-email` | dev-only | no admin auth |

## Code changes

- Deleted the 11 route files listed above.
- `app/profile/page.tsx`: removed the dead `fetch('/api/debug/profile-picture')` block (the following
  `forceRefreshUser()` fallback already covered the missing-picture case; the debug call was a no-op 404 in production).
- `docs/MOBILE_API_ENHANCED_DOCUMENTATION.md` / `docs/MOBILE_API_SPECIFICATIONS_EXTENSION.md`: replaced
  `test-enhanced-mobile` curl examples with the real `/api/products/[id]?enhanced=true` and `/api/mobile/products/[id]` endpoints.

## Security notes

- Worst pre-existing exposure: `POST /api/test-enhanced-mobile` was reachable in production with no auth.
  Practical risk was low (user lookup required knowing a CUID; products are public data), but it leaked
  discount fields for a known user ID. Now gone.
- `GET /api/test-admin-orders` trusted a client-supplied `x-admin-email` header, but was dev-only (404 in prod). Now gone.
- All remaining test/debug surfaces are behind `requireAdminAuth` and/or `requireDevelopment` (404 outside `NODE_ENV=development`).

## Verification

- `npx jest __tests__/api/guarded-routes-auth.test.ts` — pass (init-db guards intact).
- `npx tsc --noEmit` + eslint on `app/profile/page.tsx` — clean.
