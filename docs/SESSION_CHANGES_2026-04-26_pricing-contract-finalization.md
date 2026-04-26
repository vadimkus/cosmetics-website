# Session Changes: Pricing Contract Finalization

Date: 2026-04-26

## Context

Final cleanup after the pricing contract migration audit. Current website and mobile payment flows already recomputed line prices from server product data, but the audit found three remaining undercharge surfaces: the legacy `/api/checkout` route, client-spoofable free-gift markers, and arbitrary client-submitted bundle percentages.

## Changes

- Disabled the legacy `/api/checkout` endpoint by default with `410 Gone`. Current COD orders should use `/api/orders/cod-confirmation`.
- Added `lib/checkoutPricingGuards.ts` to centralize checkout-specific pricing guardrails.
- Restricted free-gift pricing to the known promo mask products only:
  - `36` / `SOOTHING BOMB SEA ALGAE MASK`
  - `53` / `INTENSIVE REPAIR COLLAGEN MASK`
- Changed bundle handling so the server only accepts the configured Build Your Set tiers:
  - 2 items: 5%
  - 3 items: 10%
  - 4 items: 15%
  - 5+ items: 20%
- Applied the guards to website Stripe PaymentIntent, website Stripe Checkout Session, website COD confirmation, mobile Stripe checkout, mobile Apple Pay intent, and mobile order creation.

## Verification

Added focused tests for:

- Promo spoofing: regular products submitted with `price: 0`, `__PROMO__`, or free-gift labels are charged at server-computed price.
- Bundle spoofing: arbitrary submitted bundle percentages are ignored unless they match the server tier.
- Guard helper behavior for promo allowlisting and bundle tiers.

## Remaining Lower-Risk Follow-Ups

- Invoice generation and manual admin notification still accept submitted financial payloads for document/email rendering. They do not capture payment, but should be rebuilt from stored order data in a later integrity cleanup.
- Mobile order item `price` is still required for legacy client compatibility, but is not trusted for totals.
