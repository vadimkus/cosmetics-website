# Web Cart Pricing Helper Slice — 2026-04-26

## Context

This is the next slow step after the pricing contract display cleanup. The goal is to centralize one remaining web cart pricing path without touching checkout submission, Stripe/COD payload construction, or order/email rendering.

## Changes

- Added `lib/cartPricing.ts`, a pure helper for cart line pricing and cart totals.
- `lib/cartStore.ts` now routes `getTotalPrice()` through `getCartTotalPrice()`.
- Added focused Jest coverage in `__tests__/lib/cartPricing.test.ts`.

## Scope Boundary

Changed:

- Website cart subtotal helper only.

Deliberately unchanged:

- Web checkout submit item construction.
- Stripe payment intent item payload.
- COD order confirmation item payload.
- Order emails and admin order reconstruction.
- Native app cart/order logic.

## Covered Scenarios

- Retail product subtotal.
- User percentage discount.
- Bundle-builder item discount with no VIP stacking.
- Beauty Box contract behavior.
- Selected variant size pricing.
- Black Friday priority over user discounts.

## Verification

- `npx jest __tests__/lib/cartPricing.test.ts --runInBand`
- `npm run smoke:pricing-contract`
- `npm run build`

Build note: `npm run build` regenerated `lib/swVersion.ts`; it was restored to the committed value because that file is generated metadata.

## Rollback

Revert this slice commit. It is isolated to the helper, its test, and `cartStore.getTotalPrice()`.
