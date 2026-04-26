# Web Cart Pricing Helper Slice — 2026-04-26

## Context

This is the next slow step after the pricing contract display cleanup. The goal is to centralize one remaining web cart pricing path without touching checkout submission, Stripe/COD payload construction, or order/email rendering.

## Changes

- Added `lib/cartPricing.ts`, a pure helper for cart line pricing and cart totals.
- `lib/cartStore.ts` now routes `getTotalPrice()` through `getCartTotalPrice()`.
- Added focused Jest coverage in `__tests__/lib/cartPricing.test.ts`.
- Follow-up slow slice: added `getCartRetailTotal()` and routed the `/cart` Black Friday original subtotal / savings display through the helper.
- Regression fix: Beauty Box `originalPrice` now uses the full regular box price from the legacy discount rules, so cart rows and product cards again show full price + strikethrough + 15% discount instead of only the stored box price.
- Follow-up checkout display slice: routed the visible checkout item rows through `getCartLinePricing()` so bundle, Beauty Box, variant, and user-discount row displays use the same contract-backed helper as the cart.

## Scope Boundary

Changed:

- Website cart subtotal helper only.
- Website `/cart` Black Friday strikethrough/savings display.
- Website `/checkout` visible item rows in the expandable mobile/PWA summary and desktop order summary.

Deliberately unchanged:

- Web checkout submit item construction.
- Stripe payment intent item payload.
- COD order confirmation item payload.
- Order emails and admin order reconstruction.
- Native app cart/order logic.
- Web checkout submit payloads, Stripe payloads, and COD payloads.

## Covered Scenarios

- Retail product subtotal.
- User percentage discount.
- Bundle-builder item discount with no VIP stacking.
- Beauty Box contract behavior.
- Selected variant size pricing.
- Black Friday priority over user discounts.
- Retail total for cart strikethrough/savings display.
- Beauty Box full-price regression guard (`originalPrice > displayPrice`).
- Checkout item row display totals for contract-backed cart pricing.

## Verification

- `npx jest __tests__/lib/cartPricing.test.ts __tests__/lib/pricingContract.test.ts --runInBand`
- `npm run smoke:pricing-contract`
- `npm run build`

Build note: `npm run build` regenerated `lib/swVersion.ts`; it was restored to the committed value because that file is generated metadata.

## Rollback

Revert the relevant slice commit. The first slice is isolated to the helper, its test, and `cartStore.getTotalPrice()`. The follow-up display slice is isolated to `getCartRetailTotal()`, the cart helper test, and `/cart` original subtotal display.

The checkout display slice is isolated to `app/checkout/CheckoutClient.tsx`; reverting that change restores the previous inline checkout row rendering while leaving cart totals and payment payloads unchanged.
