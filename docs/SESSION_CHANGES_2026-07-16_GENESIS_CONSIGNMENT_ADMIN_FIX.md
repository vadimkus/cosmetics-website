# Session — Genesis consignment + admin save fix (2026-07-16)

## Activate

**Genesis Healthcare Center** (`support@genesis-dubai.com`) —
`consignmentActive = true` in DB (CLINIC 50% unchanged).

## Bug

Admin profile **Activate** for consignment looked like it worked until you left
the profile and came back — then it showed Off again.

**Cause:** PUT `/api/admin/users/[id]` wrote `consignmentActive` correctly, but
GET list + GET by id **never selected** that field. Reload rebuilt the customer
object without it → UI always showed Off.

## Fix

- `app/api/admin/users/route.ts` — include `consignmentActive` in list select
- `app/api/admin/users/[id]/route.ts` — include on detail select
- `app/admin/page.tsx` — User type + merge full detail payload on select
- `components/auth/AuthProvider.tsx` — persist/refresh `consignmentActive` so
  partner portal can see the flag after login/refresh
