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

## Flagged, not changed (business decisions)

- **`allow_promotion_codes: true`** on the hosted checkout session lets a customer
  enter Stripe Dashboard promo codes and pay less than the order total, while the
  order record keeps the full total. If GENOSYS doesn't intentionally use Stripe
  promo codes, consider setting this to `false` (all discounts already flow through
  the server pricing). The new reconciliation log will surface any such underpayment.
- **No Stripe idempotency key** on `paymentIntents.create` / `sessions.create`. The
  5-minute dedup covers the common double-tap; a per-attempt idempotency key would
  be strictly more robust but is a minor hardening.
- Rate limiting on payment-creation endpoints relies on the same soft per-instance
  limiter noted elsewhere.

## Verification

`tsc --noEmit` + full build clean. Log-only server change; deployed via main, no app
build required.
