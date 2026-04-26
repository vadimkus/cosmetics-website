# Mobile Order History Email Parity — 2026-04-26

## Context

Native iOS order history showed new mobile orders, but older website orders visible on `/orders` were missing in the app. The website order API already searches both the authenticated login email and `contactEmail`; the mobile order API only searched `user.email`.

This mainly affects Apple/private-relay users and users whose historical web orders were stored under their real contact email while the mobile app authenticates with the relay/login email.

## Changes

- Added `lib/mobileOrderOwnership.ts` to centralize mobile order ownership email matching.
- Updated `GET /api/mobile/orders` to search orders by both `user.email` and `user.contactEmail`.
- Updated `GET /api/mobile/orders/[id]` so order details also work for orders stored under `contactEmail`.
- Updated mobile order delete authorization to allow pending/unpaid orders owned by either login email or contact email.
- Added `__tests__/api/mobile-orders-history.test.ts` covering list and detail lookup for contact-email orders.

## Verification

- `npx jest __tests__/api/mobile-orders-history.test.ts __tests__/api/mobile-orders-pricing.test.ts --runInBand`
- `npm run build`

Build note: `npm run build` regenerated `lib/swVersion.ts`; it was restored to the committed value because that file is generated metadata.

## Rollback

Revert this slice to restore the previous mobile order lookup behavior where only `user.email` was used for history, detail, and delete authorization.
