# Web loyalty redemption at checkout

**Date:** 2026-07-18
**Scope:** GENOSYS website checkout, order receipts/history, admin order detail, and payment/COD lifecycle.
**Database migration:** none.

## Program rules

- Retail rewards accounts only.
- Active VIP/clinic account discounts do not stack with points redemption.
- Redeem in blocks of **100 points = AED 5**.
- Maximum redemption is **20% of the discounted product subtotal**.
- Shipping eligibility uses the pre-redemption subtotal.
- VAT is recalculated from the final VAT-inclusive total.
- Order APIs re-read the live ledger and clamp the request; client calculations are display-only.

## Checkout UX

Added `components/checkout/RewardsRedemptionCard.tsx`.

The web checkout now:

- always shows the rewards card for authenticated `REWARDS` accounts, including zero/low balances;
- shows current points and AED value;
- explains when redemption is unavailable because of an account discount;
- lets the customer apply/remove rewards;
- lets the customer select the number of 100-point blocks using plus/minus controls or a range input;
- offers a “Use maximum” action;
- shows the selected points and AED discount in both checkout summaries;
- updates total, VAT, earn preview, and “You saved” immediately;
- supports EN/AR/RU and RTL.

The membership API now returns the authoritative redemption configuration:

- `eligible`
- `reason`
- `blockPoints`
- `blockAed`
- `maxOrderFraction`

## Server and lifecycle hardening

### COD database timeout

The COD path now keeps the original database save promise after an 8-second timeout instead of immediately starting a duplicate write. Once a real order ID exists in the background:

- redemption is recorded against that ID;
- the ledger write retries once;
- idempotency remains protected by `(orderId, type)`.

### Membership recalculation

`recalcUserStats()` no longer reconstructs points from lifetime spend. It now uses the loyalty ledger sum, preserving:

- redemptions;
- reversals;
- welcome/review bonuses;
- adjustments.

### Card-payment emails

The payment-status poll path now passes loyalty fields to customer and admin confirmation emails, matching the Stripe webhook path.

The Stripe webhook and COD admin-notification calls now also pass both loyalty fields:

- `loyaltyPointsRedeemed`
- `loyaltyDiscountAmount`

### Real-order template verification

Verified against order **GENCardM2607176967** (Alesya Sokolenko, 17 Jul 2026):

- points redeemed: **1,400**
- loyalty discount: **AED 70**
- order total: **AED 535**

Both rendered templates contain:

- `GENOSYS Rewards (1,400 pts)`
- `-AED 70.00`

## Post-order visibility

Added the GENOSYS Rewards line to:

- customer order success page;
- customer order history;
- admin order details;
- reusable admin order breakdown;
- admin new-order email.

The displayed “You saved” amount now includes loyalty redemption.

## Key files

- `components/checkout/RewardsRedemptionCard.tsx`
- `app/checkout/CheckoutClient.tsx`
- `app/api/user/membership/route.ts`
- `lib/loyalty.ts`
- `lib/membership.ts`
- `app/api/orders/cod-confirmation/route.ts`
- `app/api/stripe/payment-status/route.ts`
- `app/api/orders/success/[orderNumber]/route.ts`
- `app/success/SuccessClient.tsx`
- `app/orders/page.tsx`
- `components/admin/OrderDetails.tsx`
- `components/admin/OrderBreakdown.tsx`
- `lib/email/types.ts`
- `lib/email/templates.ts`
- `messages/en.json`
- `messages/ar.json`
- `messages/ru.json`

## Tests

- `__tests__/lib/loyaltyRedemption.test.ts`
  - block rounding;
  - balance cap;
  - 20% cap;
  - minimum order;
  - invalid requests;
  - account-discount eligibility.
- `__tests__/components/RewardsRedemptionCard.test.tsx`
  - balance/value display;
  - apply maximum;
  - plus/minus blocks;
  - account-discount explanation;
  - minimum-points explanation.
- `__tests__/lib/emailLoyaltyRedemption.test.ts`
  - customer confirmation includes points and AED discount;
  - admin notification includes points and AED discount;
  - rewards row is omitted when no points were redeemed.
- Existing COD and Stripe pricing tests remain green.

Validation command:

```bash
npx jest __tests__/components/RewardsRedemptionCard.test.tsx \
  __tests__/lib/loyaltyRedemption.test.ts \
  __tests__/api/cod-confirmation-pricing.test.ts \
  __tests__/api/stripe-create-payment-intent-pricing.test.ts \
  --runInBand
```

Result: **4 suites / 19 tests passed**.

Additional validation:

- `npx tsc --noEmit` — passed.
- Targeted ESLint — 0 errors (two pre-existing exhaustive-deps warnings in `app/orders/page.tsx`).

## Final local hardening (2026-07-18)

- Fixed the embedded Payment Intent poll race: every successful Stripe observer
  now attempts the idempotent `REDEEM` ledger write, independently from the
  one-time email transition claim.
- Stripe webhook retries and later payment-status polls can recover a transient
  ledger failure without resending confirmation emails.
- Hardened the COD timeout retry: if the first insert committed but its
  connection failed, the retry recovers the existing order by order number and
  still settles redemption.
- Loyalty-only orders now show “You saved” in order history and customer email.
- Customer confirmation emails localize the points number/unit for EN/AR/RU.
- Added ledger idempotency, cancellation reversal, membership recalculation,
  Payment Intent race, and localized-email tests.

Final local verification:

- Full Jest suite: **46 suites passed; 293 passed, 3 skipped, 0 failed**.
- Loyalty/payment/polish subset: **12 suites / 36 tests passed**.
- `npx tsc --noEmit`: passed.
- Targeted ESLint: 0 errors (the two existing order-page hook warnings remain).
- `npm run build`: passed, including Prisma generation and migration check.
- No order, payment, email, or external write was submitted during testing.
