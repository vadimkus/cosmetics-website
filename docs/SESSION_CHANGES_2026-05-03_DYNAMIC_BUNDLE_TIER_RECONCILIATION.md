# Dynamic Build Your Set Tier Reconciliation

Date: 2026-05-03

## Context

Build Your Set items can be edited in the cart after being added. If a customer removes bundle items, the discount must follow the remaining bundle count instead of keeping the original submitted tier forever.

## Rule

- 5+ remaining Build Your Set lines: keep `20%`.
- 4 remaining Build Your Set lines: downgrade to `15%`.
- 3 remaining Build Your Set lines: downgrade to `10%`.
- 2 remaining Build Your Set lines: downgrade to `5%`.
- 1 remaining Build Your Set line: remove the bundle discount and return the item to normal retail/user-discount behavior.

The count is based on remaining Build Your Set cart lines, matching the existing bundle-builder behavior where selected products are added as individual lines.

## Website / Mobile Web Changes

- `lib/cartStore.ts`
  - Added `getBuildSetDiscountForCount()`.
  - Added `reconcileBuildSetBundleDiscounts()`.
  - Reconciliation now runs after add, remove, decrement, quantity, color, and size cart mutations.
  - When the remaining bundle line count drops below two, stale `fromBundle` and `bundleDiscountPercent` metadata is removed.

## Server Checkout Changes

- `lib/checkoutPricingGuards.ts`
  - Checkout now treats submitted bundle discount as a marker that the line came from Build Your Set.
  - The server computes the allowed tier from the submitted bundle line count.
  - Stale client submissions are downgraded safely, e.g. four submitted bundle lines with stale `20%` become `15%`; one remaining line gets no bundle discount.

This prevents stale cart state from either over-discounting or being rejected when the correct behavior is to recalculate proportionally.

## Native App Changes

- `scripts/smoke-cart-pricing-contract.js`
  - Added regression coverage for `6 -> 5` remaining bundle lines keeping `20%`.
  - Existing coverage already verifies `5 -> 4` downgrades to `15%` and `2/1 -> 1` removes the bundle discount.

Native cart reconciliation already handled the dynamic tier; this pass made the behavior explicit in regression tests.

## Verification

- Website: `npm test -- --runTestsByPath __tests__/lib/cartPricing.test.ts __tests__/lib/checkoutPricingGuards.test.ts`
- Website: `npx eslint lib/cartStore.ts lib/checkoutPricingGuards.ts __tests__/lib/cartPricing.test.ts __tests__/lib/checkoutPricingGuards.test.ts`
- Website: `npx tsc --noEmit`
- Website: `npm run smoke:pricing-contract`
- Native: `npm run smoke:cart-pricing-contract`
- Native: `npm run smoke:order-payload-pricing-contract`
- Native: `npm run smoke:pricing-display`
- Native: `npx tsc --noEmit`
- ReadLints: no errors on touched website/native files.
