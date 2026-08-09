# Olga Pikina permanent account discount

**Date:** 2026-08-09  
**Scope:** Production website account, pricing behavior, and one customer email.

## Outcome

The exact Olga Pikina account established by the two prior authoritative order
imports received a permanent **10% account discount**:

- Account identity: `ol***@gmail.com` (one exact case-insensitive production match)
- Account name: Olga Pikina
- Identity checks: existing Olga MoySklad link matched; both prior imported
  website orders were present and linked to the same canonical login
- Stored account fields: `discountType = VIP`,
  `discountPercentage = 10`
- No coupon or Stripe promotion code was created
- Existing GENOSYS Rewards balance remained **1,015 points**

The safe maintenance script is:

`scripts/assign-olga-pikina-permanent-discount-20260809.ts`

It supports separate dry-run, apply, and send-email stages. It refuses
conflicting identity or discount records and records assignment/email audit
markers in `user_actions`. Re-running apply performs no account write;
re-running send-email skips the already accepted message.

## Pricing behavior

No pricing implementation change or deployment was required. The existing
account-discount path already reads both account fields across website,
mobile web/PWA, native mobile product APIs, COD, Stripe, and Apple Pay.

Established rules apply:

- Eligible regular products receive 10% automatically while Olga is logged in.
- Beauty Boxes retain their built-in price/discount and do not receive another
  account discount.
- Devices, Hydro Cool Modelling Mask, and products marked `noDiscount` are
  excluded.
- Build Your Set compares its tier discount with the account discount and uses
  the better single price; the two percentages do not stack.
- Black Friday/customer pricing follows the central single-discount priority.
- Free/promo lines remain free and do not receive another discount.
- Product variants/options receive the account discount from their applicable
  variant price.
- Olga remains on the retail `REWARDS` track because partner classification
  starts at 20%, so future eligible delivered purchases still earn points.
- Points redemption is disabled while any active account discount exists, so
  the 10% account discount cannot stack with a redemption.
- Order rows, customer/admin emails, receipts, success/history views, and admin
  details store/render the applied account percentage and amount.

## Customer email

Exactly one confirmation email was sent to the verified account address:

- Recipient: `ol***@gmail.com`
- Subject: `Your permanent 10% GENOSYS discount is active`
- Locale: English, matching the imported website orders
- Provider: Gmail SMTP
- Accepted message ID:
  `<2720d2f4-b822-0fe4-2e6a-92f3781c3152@gmail.com>`

The message states that the GENOSYS account now has a permanent 10% discount
and that it applies automatically to eligible future purchases when logged in.
No admin email was sent.

## Production verification

After the write and again after email acceptance:

- Exact account match: one
- Account discount: `VIP 10%`
- Assignment audit marker: present
- Email acceptance marker: present
- Rewards track: `REWARDS`
- Materialized points balance: unchanged at 1,015
- Idempotency rerun: apply made no change; email stage skipped

## Validation

- Focused pricing/checkout tests: **8 suites, 70 tests passed**
  - centralized pricing engine and cart best-discount behavior
  - web COD and Stripe Payment Intent
  - native COD, Stripe, and Apple Pay
  - loyalty redemption non-stacking
- `npx tsc --noEmit`: passed
- Script ESLint with `--no-ignore`: 0 errors (maintenance-script console warnings only)
- IDE diagnostics: no errors

This was a data-only account update using existing production behavior. No
website deployment was needed.
