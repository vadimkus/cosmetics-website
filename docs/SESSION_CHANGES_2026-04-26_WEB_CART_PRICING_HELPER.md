# Web Cart Pricing Helper Slice — 2026-04-26

## Context

This is the next slow step after the pricing contract display cleanup. The goal is to centralize web cart and checkout pricing paths in small, reversible slices without changing the whole checkout stack at once.

## Changes

- Added `lib/cartPricing.ts`, a pure helper for cart line pricing and cart totals.
- `lib/cartStore.ts` now routes `getTotalPrice()` through `getCartTotalPrice()`.
- Added focused Jest coverage in `__tests__/lib/cartPricing.test.ts`.
- Follow-up slow slice: added `getCartRetailTotal()` and routed the `/cart` Black Friday original subtotal / savings display through the helper.
- Regression fix: Beauty Box `originalPrice` now uses the full regular box price from the legacy discount rules, so cart rows and product cards again show full price + strikethrough + 15% discount instead of only the stored box price.
- Follow-up checkout display slice: routed the visible checkout item rows through `getCartLinePricing()` so bundle, Beauty Box, variant, and user-discount row displays use the same contract-backed helper as the cart.
- Follow-up COD payload slice: added `getCartLinePayloadPricing()` and routed the website COD order item `price`, `total`, and bundle discount metadata through the same contract-backed cart pricing helper.
- Follow-up Stripe payload slice: routed the website Stripe payment-intent item `product.price` and bundle metadata through `getCartLinePayloadPricing()`, while leaving `/api/stripe/create-payment-intent` total/order reconstruction untouched.
- Follow-up checkout discount-summary slice: added `getCartDiscountSummary()` and routed the checkout waterfall display / COD bundle-discount metadata source through the contract-backed cart pricing helper.
- Follow-up Stripe backend recomputation slice: `/api/stripe/create-payment-intent` now fetches current server products and recomputes item unit prices, subtotal, Stripe amount, and stored order item prices server-side. Client-submitted item prices are ignored, except explicit checkout-generated free-gift markers.
- Follow-up COD backend recomputation slice: `/api/orders/cod-confirmation` now fetches current server products and recomputes item unit prices, subtotal, shipping, VAT, total, discount amounts, and stored/email item prices server-side. Client-submitted item prices/totals are ignored, except explicit checkout-generated free-gift markers.
- Follow-up mobile Stripe helper slice: `/api/mobile/checkout/stripe` now routes new-checkout item unit pricing and discount amounts through `getCartLinePricing()`, while preserving its authenticated mobile payload, order persistence, Stripe Checkout Session flow, and resume-payment path.
- Follow-up mobile Apple Pay helper slice: `/api/mobile/payments/applepay/intent` now routes item unit pricing and discount amounts through `getCartLinePricing()`, while preserving its authenticated mobile payload, order persistence, PaymentIntent flow, and status endpoint.
- Follow-up mobile COD backend helper slice: `POST /api/mobile/orders` now routes item unit pricing and discount amounts through `getCartLinePricing()`, while preserving order persistence, order response shape, and email/admin notification delivery.

## Scope Boundary

Changed:

- Website cart subtotal helper only.
- Website `/cart` Black Friday strikethrough/savings display.
- Website `/checkout` visible item rows in the expandable mobile/PWA summary and desktop order summary.
- Website COD item payload pricing for `/api/orders/cod-confirmation`.
- Website Stripe item payload pricing for `/api/stripe/create-payment-intent`.
- Website checkout waterfall values: retail total, user discount, bundle discount, intermediate subtotal, and total saved.
- Website Stripe backend item pricing and subtotal recomputation.
- Website COD backend item pricing, subtotal, shipping, VAT, and total recomputation.
- Mobile app Stripe new-checkout item pricing through the shared cart helper.
- Mobile app Apple Pay intent item pricing through the shared cart helper.
- Mobile app COD order creation item pricing through the shared cart helper.

Deliberately unchanged:

- Order emails and admin order reconstruction.
- Native app cart/order logic.
- Stripe payment intent creation API call, duplicate-order check, and webhook flow.
- Frontend checkout subtotal, shipping, VAT, and payment total calculation.
- COD email delivery mechanics and admin notification sender.
- Mobile Stripe resume-payment path and native app client cart math.
- Mobile Apple Pay status endpoint and native app client cart math.
- Native app checkout payload construction.

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
- COD payload unit price / line total and bundle metadata.
- Stripe payload unit price and bundle metadata, including a guard that Beauty Box built-in discounts are not sent as bundle-builder metadata.
- Checkout discount summary with mixed user + bundle discounts.
- Beauty Box-only carts stay out of the cart-level waterfall while preserving line-level Beauty Box savings.
- Route-level Stripe backend guard proving a tampered client item price is ignored and the server product price + user discount determine payment/order totals.
- Route-level COD backend guard proving a tampered client item price/total is ignored and the server product price + user discount determine stored order totals.
- Route-level mobile Stripe guard proving a tampered client item price is ignored and the server product price + user discount determine stored order totals.
- Route-level mobile Apple Pay guard proving a tampered client item price is ignored and the server product price + user discount determine stored order totals.
- Route-level mobile COD guard proving a tampered client item price is ignored and the server product price + user discount determine stored order totals.

## Verification

- `npx jest __tests__/lib/cartPricing.test.ts __tests__/lib/pricingContract.test.ts --runInBand`
- `npx jest __tests__/api/mobile-stripe-checkout-pricing.test.ts __tests__/api/cod-confirmation-pricing.test.ts __tests__/api/stripe-create-payment-intent-pricing.test.ts __tests__/lib/cartPricing.test.ts __tests__/lib/pricingContract.test.ts --runInBand`
- `npx jest __tests__/api/mobile-applepay-intent-pricing.test.ts __tests__/api/mobile-stripe-checkout-pricing.test.ts __tests__/api/cod-confirmation-pricing.test.ts __tests__/api/stripe-create-payment-intent-pricing.test.ts __tests__/lib/cartPricing.test.ts __tests__/lib/pricingContract.test.ts --runInBand`
- `npx jest __tests__/api/mobile-orders-pricing.test.ts __tests__/api/mobile-applepay-intent-pricing.test.ts __tests__/api/mobile-stripe-checkout-pricing.test.ts __tests__/api/cod-confirmation-pricing.test.ts __tests__/api/stripe-create-payment-intent-pricing.test.ts __tests__/lib/cartPricing.test.ts __tests__/lib/pricingContract.test.ts --runInBand`
- `npm run smoke:pricing-contract`
- `npm run build`

Build note: `npm run build` regenerated `lib/swVersion.ts`; it was restored to the committed value because that file is generated metadata.

## Rollback

Revert the relevant slice commit. The first slice is isolated to the helper, its test, and `cartStore.getTotalPrice()`. The follow-up display slice is isolated to `getCartRetailTotal()`, the cart helper test, and `/cart` original subtotal display.

The checkout display slice is isolated to `app/checkout/CheckoutClient.tsx`; reverting that change restores the previous inline checkout row rendering while leaving cart totals and payment payloads unchanged.

The COD payload slice is isolated to `getCartLinePayloadPricing()`, its focused tests, and the COD item mapper in `app/checkout/CheckoutClient.tsx`. Reverting it restores the previous inline COD payload calculation; Stripe payment intent payloads remain unchanged in this slice.

The Stripe payload slice is isolated to the Stripe item mapper in `app/checkout/CheckoutClient.tsx` plus one helper test. Reverting it restores the previous inline Stripe payload calculation while leaving the backend route unchanged.

The checkout discount-summary slice is isolated to `getCartDiscountSummary()`, its focused tests, and the summary destructuring in `app/checkout/CheckoutClient.tsx`. Reverting it restores the previous inline waterfall calculation without changing payment totals.

The Stripe backend recomputation slice is isolated to `/api/stripe/create-payment-intent` and `__tests__/api/stripe-create-payment-intent-pricing.test.ts`. Reverting it restores the previous behavior where the web Stripe route trusted submitted final item prices.

The COD backend recomputation slice is isolated to `/api/orders/cod-confirmation` and `__tests__/api/cod-confirmation-pricing.test.ts`. Reverting it restores the previous behavior where the web COD route trusted submitted final item prices/totals.

The mobile Stripe helper slice is isolated to the new-checkout pricing block in `/api/mobile/checkout/stripe` and `__tests__/api/mobile-stripe-checkout-pricing.test.ts`. Reverting it restores the previous manual mobile Stripe pricing calculation while leaving web checkout and mobile resume-payment behavior unchanged.

The mobile Apple Pay helper slice is isolated to the pricing block in `/api/mobile/payments/applepay/intent` and `__tests__/api/mobile-applepay-intent-pricing.test.ts`. Reverting it restores the previous manual Apple Pay intent pricing calculation while leaving the Apple Pay status endpoint unchanged.

The mobile COD backend helper slice is isolated to the pricing block in `POST /api/mobile/orders` and `__tests__/api/mobile-orders-pricing.test.ts`. Reverting it restores the previous manual mobile COD pricing calculation while leaving order reads and email delivery behavior unchanged.
