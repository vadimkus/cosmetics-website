# Bundle Builder vs VIP Discount Rule

Date: 2026-04-28

## Context

Vadim tested the native TestFlight app with user `f.this.that@gmail.com`, which has a 50% personal discount. When adding Bundle Builder items to the cart, the app showed 50% rather than the 20% bundle cap.

That is the correct business behavior:

- Bundle Builder discount and VIP / user discount do **not** stack.
- The customer should receive the better discount.
- A 50% personal discount beats the 20% maximum bundle tier.

## Change

Aligned desktop web and mobile web / PWA with the native app rule.

Updated `lib/cartPricing.ts`:

- Bundle Builder lines still validate and carry their bundle tier.
- The helper now also calculates the user-aware pricing contract for the same product.
- If user / Black Friday pricing is better than the bundle tier, that price wins.
- If the bundle tier is better, the bundle discount still applies.
- Payload pricing only includes `bundleDiscount` when the bundle discount actually wins.

Updated `app/bundle-builder/BundleBuilderClient.tsx`:

- Bundle preview summary now uses the same shared cart pricing helper.
- The progress tier still tracks the bundle tier.
- The displayed total reflects the effective best discount.
- Add-to-cart still sends the validated bundle tier, letting checkout decide the winning discount.

Updated docs:

- `docs/PRICING_DISCOUNT_AUDIT.md`
- `docs/README.md`

## Verification

- `ReadLints` on edited files: no errors.
- `npx eslint lib/cartPricing.ts app/bundle-builder/BundleBuilderClient.tsx lib/bundleStore.ts components/cart/CartItem.tsx __tests__/lib/cartPricing.test.ts`: passed.
- `npm test -- --runTestsByPath __tests__/lib/cartPricing.test.ts __tests__/lib/checkoutPricingGuards.test.ts __tests__/api/stripe-create-payment-intent-pricing.test.ts`: passed.

Added regression coverage:

- Bundle discount wins when it is better than user discount.
- User discount wins when it is better than bundle discount.
- Payload excludes `bundleDiscount` when user discount wins.
