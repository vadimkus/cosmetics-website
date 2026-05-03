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

## Mobile Web Build Your Set Follow-up

After production testing in mobile Safari, Build Your Set items reached the web cart as normal retail lines: no per-line bundle badge, no checkout bundle waterfall, and subtotal stayed at retail. Root cause was the web Bundle Builder adding products to the cart one-by-one. The first line was immediately reconciled as a single non-qualifying bundle item and lost `fromBundle` metadata before the remaining products arrived.

Additional hardening:

- Added `addBundleItems()` to the web cart store so Build Your Set products enter cart atomically, matching the native fix.
- Bundle metadata is now written to both the cart row and the cart product object.
- Cart pricing now recognizes bundle metadata from either location, so persistence/navigation cannot silently turn bundle lines into retail lines.
- Web Bundle Builder now uses selected/default retail price instead of regular pricing-contract `basePrice` when preparing bundle products.
- Added regression coverage for product-level bundle metadata and the atomic web bundle add path.

Verification:

- Website: `npm test -- --runTestsByPath __tests__/lib/cartPricing.test.ts __tests__/lib/checkoutPricingGuards.test.ts __tests__/api/stripe-create-payment-intent-pricing.test.ts` passed (`25` tests).
- Website: `npx eslint app/bundle-builder/BundleBuilderClient.tsx lib/cartStore.ts lib/cartPricing.ts types/index.ts __tests__/lib/cartPricing.test.ts` passed.
- Website: `npx tsc --noEmit` passed.
- Website: `npm run smoke:pricing-contract` passed.
- ReadLints: no errors on touched web files.

## Mist Price Follow-up

Production checkout showed `MICROBIOME ENERGY INFUSING MIST` as `AED 320 -> AED 256` inside Build Your Set, while the correct retail base is `AED 160 -> AED 128`.

Root cause:

- Product `14` had correct product-level price `160`.
- Its default DB variant had `size: null`, `color: null`, and stale price `320`.
- The bundle retail resolver treated that null variant as selectable and used `320`.

Fix:

- Corrected the DB null default variant for product `14` from `320` to `160`.
- Web Bundle Builder now ignores variants that have neither size nor color.
- Mobile bundle-builder API filters out null size/color variants before sending data to the native app.
- Native bundle/cart/order payload fallbacks now ignore null size/color variants and prefer product retail base for non-variant bundle items.

Verification:

- Website: `npm test -- --runTestsByPath __tests__/api/mobile-bundle-builder-pricing.test.ts __tests__/lib/cartPricing.test.ts __tests__/lib/checkoutPricingGuards.test.ts __tests__/api/stripe-create-payment-intent-pricing.test.ts` passed (`27` tests).
- Website: `npx eslint app/bundle-builder/BundleBuilderClient.tsx app/api/mobile/bundle-builder/route.ts lib/cartStore.ts lib/cartPricing.ts types/index.ts __tests__/lib/cartPricing.test.ts __tests__/api/mobile-bundle-builder-pricing.test.ts` passed.
- Website: `npx tsc --noEmit` passed.
- Website: `npm run smoke:pricing-contract` passed.
- Native: `npm run smoke:cart-pricing-contract && npm run smoke:order-payload-pricing-contract && npm run smoke:pricing-display` passed.
- Native: `npx tsc --noEmit` passed.
- ReadLints: no errors on touched website/native files.

## Native Build Your Set List Price Follow-up

Native Build Your Set product cards showed inflated retail prices before cart add. This was the same class of issue as the Mist case, but across many null default variants:

- `ALL FOR SENSITIVE SERUM`: `450` shown vs `330` product base.
- `MOISTURE REPLENISHING HYALURON SERUM`: `450` shown vs `330` product base.
- `MULTI VITA RADIANCE SERUM`: `490` shown vs `330` product base.
- `MULTI FUNCTIONAL ANTI-WRINKLE SERUM`: `520` shown vs `330` product base.
- `EGF REPAIR OXYMASK CREAM`: `450` shown vs `290` product base.
- `INTENSIVE BLEMISH BALM CREAM`: `350` shown vs `250` product base.

Root cause:

- The product-level prices were correct.
- 41 `product_variants` rows had neither size nor color but carried stale prices.
- Native code treated those null variants as real default variants and displayed them.

Fix:

- Ran a DB normalization update: every null size/color variant now mirrors its parent product price (`41` rows updated, `0` mismatches remaining).
- Website mobile bundle-builder API filters null size/color variants out of the response.
- Web and native bundle retail resolvers ignore variants with no size/color.

Verification:

- Spot-check after DB correction:
  - Product `18` Hyaluron Serum: base `330`, null variant `330`.
  - Product `19` All For Sensitive Serum: base `330`, null variant `330`.
  - Product `21` Multi Vita Radiance Serum: base `330`, null variant `330`.
  - Product `22` Anti-Wrinkle Serum: base `330`, null variant `330`.
  - Product `26` EGF Repair Oxymask Cream: base `290`, null variant `290`.
  - Product `42` Intensive Blemish Balm Cream: base `250`, null variant `250`.
- Website: `npm test -- --runTestsByPath __tests__/api/mobile-bundle-builder-pricing.test.ts __tests__/lib/cartPricing.test.ts __tests__/lib/checkoutPricingGuards.test.ts __tests__/api/stripe-create-payment-intent-pricing.test.ts` passed (`27` tests).
- Website: focused ESLint passed.
- Website: `npx tsc --noEmit` passed.
- Native: `npm run smoke:cart-pricing-contract && npm run smoke:order-payload-pricing-contract && npm run smoke:pricing-display` passed.
- Native: `npx tsc --noEmit` passed.
- ReadLints: no errors on touched website/native files.
