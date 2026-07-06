# Checkout & Payment Integrity — Audit — 2026-07-06

Scope: the money path — Stripe hosted checkout, embedded payment intents, mobile
card + Apple Pay, COD, the Stripe webhook, and the payment-status poll.

## Verdict: the payment path is well-built. One defense-in-depth safeguard added.

### Verified correct (no change needed)

1. **Webhook signature verification** — `stripe.webhooks.constructEvent(rawBody,
   sig, STRIPE_WEBHOOK_SECRET)`; missing sig → 400, invalid → 400, missing secret
   → 500. Raw body read via `request.text()`. Spoofed webhooks are rejected.
2. **Server-authoritative amounts** — every payment-creating endpoint
   (`create-payment-intent`, `create-checkout-session`, `mobile/checkout/stripe`,
   `mobile/payments/applepay/intent`, `orders/cod-confirmation`) ignores
   client-submitted prices and recomputes each line via `getProductById` +
   `getCartLinePricing`, then charges the server total (`aedToFils`). A tampered
   client price cannot change what Stripe charges.
3. **Exactly-once paid transition + emails** — the webhook
   (`checkout.session.completed`, `payment_intent.succeeded`) and the payment-status
   poll all race to flip an order to paid. Each uses the same atomic conditional
   `updateMany({ where: paymentStatus != 'paid' })` "claim"; the single winner sends
   the customer + admin emails. This correctly prevents both duplicate emails and
   the older "poll marked paid, webhook skipped emails" gap. Genuinely good design.
4. **Bundle-tier revalidation** at checkout (see BUILD_YOUR_SET audit) — tiers are
   recomputed server-side, not trusted from the client.
5. **Order-creation dedup** — `create-payment-intent` reuses an existing active
   intent for a same-email/same-total pending order within 5 minutes (prevents
   double orders on double-tap); reuses the client order number on the mobile flows.

### Added: paid-amount reconciliation safeguard

The webhook marked orders paid without ever comparing the amount Stripe actually
charged to the order total we stored. It's normally safe (we create the charge with
the server total), but a silent divergence — a Stripe promo code applied at hosted
checkout (`allow_promotion_codes: true`), a partial capture, a currency mistake, or
a future bug — would go unnoticed while the order shows a different total than was
paid.

Added `reconcilePaidAmount(order, paidFils, context)`: on every paid transition
(`checkout.session.completed` + `payment_intent.succeeded`) it compares
`aedToFils(order.total)` to Stripe's `amount_total` / `amount_received`. On a
mismatch (>1 fils) it emits a loud, greppable `errorLog` ("PAYMENT AMOUNT
MISMATCH — reconcile") with both amounts and the delta. **Log-only** — it never
blocks a genuinely paid order (blocking would be worse than the discrepancy);
finance just gets a signal to reconcile.

## Follow-up (same day): both hardenings applied

1. **`allow_promotion_codes` → `false`** on the hosted checkout session. All
   discounts (VIP, bundle, Beauty Box) are computed server-side and baked into the
   line items, so a Stripe-level code was the only way a customer could pay less
   than the recorded order total. Now disabled.
2. **Stripe idempotency keys** added to every charge-creation call:
   - Web `lib/stripe.ts` `createPaymentIntent` / `createCheckoutSession`: keyed by
     `payment_intent_<orderNumber>` / `checkout_session_<orderNumber>`. Both web
     routes mint a fresh order number per call, so the key only collapses true
     Stripe-level retries of the identical create.
   - Mobile `checkout/stripe` (new + resume session) and `applepay/intent`: keyed by
     `<order>_<2-min bucket>` so a double-tap within the window is deduped while a
     genuine later resume still gets a fresh session/intent (these paths reuse the
     same pending order across attempts, so a plain key would wrongly return a stale
     expired session).

## Flagged, not changed

- Rate limiting on payment-creation endpoints relies on the same soft per-instance
  limiter noted elsewhere.

## Verification

`tsc --noEmit` + full build clean. Log-only server change; deployed via main, no app
build required.
