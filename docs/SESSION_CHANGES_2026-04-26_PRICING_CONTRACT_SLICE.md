# Pricing Contract Migration — First Safe Slice

Date: 2026-04-26

## Context

Pricing was split across web discount utilities, the mobile API pricing enhancer, native product rules, native cart totals, bundle builder logic, and promo/free-item handling. The risk was a big-bang rewrite that could change customer-facing prices.

This slice implements the first safe migration step only: add a server-side pricing contract beside existing mobile API fields, freeze current behavior with tests, and leave all current clients rendering legacy fields.

## What Changed

- Added `lib/pricingContract.ts` with a server-side `PricingContract` adapter over the existing `calculateProductPricing()` behavior.
- Added additive `pricing` objects to:
  - `app/api/mobile/products/route.ts`
  - `app/api/mobile/products/[id]/route.ts`
- Preserved existing legacy fields unchanged:
  - `price`
  - `displayPrice`
  - `originalPrice`
  - `vatAmount`
  - `priceIncludingVat`
  - `discountLabel`
- Added `__tests__/lib/pricingContract.test.ts` to freeze parity between the new contract and current enhanced product output.
- Added `scripts/smoke-pricing-contract.ts` and `npm run smoke:pricing-contract` for quick contract-vs-legacy checks.
- Added missing `jest` dev dependency because the repo already had Jest scripts/config/types, but the runner itself was not installed.

## Contract Shape

The contract currently returns:

- `basePrice`
- `unitPrice`
- `displayPrice`
- `originalPrice`
- `discountAmount`
- `discountPercentage`
- `discountType`
- `discountLabel`
- `vatRate`
- `vatIncluded`
- `vatAmountIncluded`
- `canSeePrice`
- `isPriceOnRequest`
- `exclusions`
- `selectedVariant`
- `source: 'server'`

Important: `canSeePrice` is included as the future rendering gate, but this slice does not remove prices from existing API fields. Old app versions continue to behave as before.

## Test Matrix

Verified with focused Jest tests:

- Guest retail pricing
- Logged-in user percentage discount
- `canSeePrices=false` visibility flag while preserving current calculated pricing
- Beauty Box built-in 15% bundle discount
- Black Friday priority over user discount
- `noDiscount` product exclusion
- Default database variant as product-level price source
- Explicit selected size variant contract

Verified with smoke script:

- Guest retail
- Logged-in user discount
- Beauty Box bundle discount
- Default database variant

## Rollout

This is safe to deploy because it is additive:

1. Existing mobile clients keep reading legacy fields.
2. New clients can inspect `pricing` without changing rendering.
3. Later slices can migrate native display one screen at a time with legacy fallback.

## Rollback

Rollback is simple:

- Ignore or remove the `pricing` field in the mobile API response.
- Legacy fields remain untouched, so existing clients are unaffected.
- Revert `lib/pricingContract.ts`, the route imports/usages, the test file, and the smoke script if needed.

## Deferred

Not changed in this slice:

- Native app display rendering
- Native cart totals
- Bundle builder checkout math
- Web product card/PDP pricing calls
- Checkout recalculation

Those should move only after one deployed contract slice is verified in production responses.
