# Web Cart Pricing Helper Slice — 2026-04-26

## Context

This is the next slow step after the pricing contract display cleanup. The goal is to centralize one remaining web cart pricing path without touching checkout submission, Stripe/COD payload construction, or order/email rendering.

## Changes

- Added `lib/cartPricing.ts`, a pure helper for cart line pricing and cart totals.
- `lib/cartStore.ts` now routes `getTotalPrice()` through `getCartTotalPrice()`.
- Added focused Jest coverage in `__tests__/lib/cartPricing.test.ts`.
- Follow-up slow slice: added `getCartRetailTotal()` and routed the `/cart` Black Friday original subtotal / savings display through the helper.

## Scope Boundary

Changed:

- Website cart subtotal helper only.
- Website `/cart` Black Friday strikethrough/savings display.

Deliberately unchanged:

- Web checkout submit item construction.
- Stripe payment intent item payload.
- COD order confirmation item payload.
- Order emails and admin order reconstruction.
- Native app cart/order logic.
- Web checkout page pricing displays and submit payloads.

## Covered Scenarios

- Retail product subtotal.
- User percentage discount.
- Bundle-builder item discount with no VIP stacking.
- Beauty Box contract behavior.
- Selected variant size pricing.
- Black Friday priority over user discounts.
- Retail total for cart strikethrough/savings display.

## Verification

- `npx jest __tests__/lib/cartPricing.test.ts __tests__/lib/pricingContract.test.ts --runInBand`
- `npm run smoke:pricing-contract`
- `npm run build`

Build note: `npm run build` regenerated `lib/swVersion.ts`; it was restored to the committed value because that file is generated metadata.

## Rollback

Revert the relevant slice commit. The first slice is isolated to the helper, its test, and `cartStore.getTotalPrice()`. The follow-up display slice is isolated to `getCartRetailTotal()`, the cart helper test, and `/cart` original subtotal display.
