# Session Changes — 2026-08-05 — Mobile registration transaction fix

## Incident

At 20:48 GST, native-app email registration returned HTTP 500 with
`Internal server error`. Vercel recorded an expired Prisma interactive
transaction: its five-second timeout elapsed while `prisma.user.create()` was
waiting, and the full request failed after 8.9 seconds.

The account-deletion request immediately before registration completed with
HTTP 200. Shared anonymization had already released the original email and
Apple identity (`appleSub`) while retaining the anonymized order owner required
for legal records. The first two registration attempts returned validation
responses (HTTP 400); they were not server failures.

## Root cause

The mobile registration transaction called `generateMemberNumber()`, which
always used the global Prisma client. Production Vercel instances intentionally
use a one-connection PostgreSQL pool. The active transaction held that single
connection while the nested global query waited for another connection. This
self-contention expired the transaction.

The issue was backend-only and unrelated to Apple private-relay email,
uniqueness constraints, account tombstones, admin notifications, or native
client rendering.

## Fix

- `generateMemberNumber()` now accepts an optional transaction client.
- Mobile email registration passes its current transaction client, keeping
  member-number lookup, promo handling, and user creation on one connection.
- Non-transactional Apple and Google registration callers retain the global
  client default.
- Added regression coverage proving a supplied transaction client is used
  without touching the global Prisma client.

No native-app change or OTA is required.
