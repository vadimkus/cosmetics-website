# Pricing Contract Migration — Web Display Slice

Date: 2026-04-26

## Context

The mobile API now returns a server `PricingContract`. This slice moves web read-only price display toward the same contract shape while avoiding checkout, payment, and order-calculation changes.

## What Changed

- Added `lib/pricingDisplay.ts`.
  - Wraps `buildPricingContract()`.
  - Exposes a compact display shape for UI components: `displayPrice`, `unitPrice`, `originalPrice`, `hasDiscount`, `discountPercentage`, visibility flags, and price-on-request state.
- Updated focused web display surfaces to consume the helper:
  - Product cards and product-card aria labels.
  - PDP price blocks.
  - Product recommendations.
  - Concern/category price blocks and sticky bar display.
  - Routine product chips.
  - Homepage desktop product cards.
  - Cart item row display.
  - Bundle Builder retail display and bundle summary math.
- Extended pricing contract tests with display-helper coverage for logged-in discount and guest visibility.

## Guardrails

Intentionally untouched:

- `lib/cartStore.ts`
- `app/checkout/CheckoutClient.tsx`
- Stripe checkout APIs
- order payload pricing
- server checkout recalculation
- legacy `discountUtils` and `pricingEngine` internals

These remain the source of truth for checkout until the next explicit server-checkout migration slice.

## Verification

Passed:

- `npm test -- --runTestsByPath __tests__/lib/pricingContract.test.ts --runInBand`
- `npm run smoke:pricing-contract`
- `npm run build`
- `git diff --check`
- focused IDE lint check on edited files

Known pre-existing issue:

- `npx tsc --noEmit --pretty false` still fails on older test-only typing issues (`jest-dom` matchers, stale `stock` fixtures, and outdated profile/order fixture shapes). The production build TypeScript pass succeeds.

## Rollback

Revert this slice by restoring:

- `lib/pricingDisplay.ts`
- the focused UI component edits listed above
- the display-helper assertions in `__tests__/lib/pricingContract.test.ts`

The existing discount engine and checkout math were not removed, so rollback is a normal code revert.
