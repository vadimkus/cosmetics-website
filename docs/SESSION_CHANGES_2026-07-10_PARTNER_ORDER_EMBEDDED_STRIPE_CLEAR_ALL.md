# Session Changes — Partner Order: Embedded Stripe + Clear All + Minimal Footer

**Date:** 2026-07-10
**Scope:** Partner portal order page (`/partner-portal/order`), web only.

## 1. Pay online now stays on the same page (embedded Stripe bottom sheet)

Previously "Pay online" → redirect to Stripe hosted checkout. Now the Stripe
payment window slides up from below and the partner completes payment without
leaving the order page — same pattern as the retail checkout (Feb 2026,
`docs/EMBEDDED_STRIPE_CHECKOUT.md`).

### Server — `app/api/partners/order/route.ts`
- `paymentOption === 'online'`: creates a **PaymentIntent** (via existing
  `createPaymentIntent` in `lib/stripe.ts`) instead of a hosted Checkout session.
- Saves `stripePaymentIntentId` on the order (`paymentMetadata` records
  `paymentIntentId`, `source: 'partner_web'`).
- Response now returns `clientSecret` instead of `paymentUrl`.
- Webhook already handles it: `payment_intent.succeeded` →
  finds order by `stripePaymentIntentId` → `paymentStatus: paid`,
  `status: CONFIRMED`, confirmation emails sent once (atomic claim).

### Client — `app/partner-portal/order/page.tsx`
- On `clientSecret` in the response: opens `BottomSheet` (existing component)
  with `StripeProvider` + `PaymentForm` (Payment Element: card / Apple Pay / Link).
- Pay success → in-page success screen with green **Paid** badge.
- Sheet dismissed → success screen with "payment not completed, pay later from
  your orders" note (order stays PENDING with `partner_online`, so the app's
  Pay/resume flow still works for abandoned payments).
- 3DS-redirect methods return to `/pay/success?orderNumber=…`.

### `components/stripe/PaymentForm.tsx`
- New optional `returnUrl` prop (defaults to retail `/checkout/success` —
  retail flow unchanged).

### Not changed
- Mobile app partner endpoint `/api/mobile/partner/order` still uses hosted
  checkout (`createOrderCheckoutSession` remains in `lib/stripe.ts` for it).

## 2. Clear all list

- New "Clear all" button (trash icon) above the product list, visible whenever
  at least one item is selected, with `confirm()` guard.
- Also shows "N items selected" counter on the same row.

## 3. Minimal footer on partner portal (earlier this session)

- `components/footer/Footer.tsx`: new route branch for `/partner-portal` —
  renders only Privacy Policy + Terms + copyright (like the enclosed checkout
  variant, but slimmer). Trust badges, sitemap columns, app buttons, and
  payment marks are hidden on partner portal pages.

## Verification
- `npx tsc --noEmit` clean.
- Not yet deployed/committed at time of writing.
