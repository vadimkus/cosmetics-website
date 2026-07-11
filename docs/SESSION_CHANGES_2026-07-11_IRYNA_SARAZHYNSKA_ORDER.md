# Session — Manual Order Import: Iryna Sarazhynska (2026-07-11)

## Context

Vadim asked to record a one-off paid order into the website DB so the customer
has it in her order history and earns loyalty points. The sale was handled
outside the website; it must NOT be pushed to MoySklad.

## Customer

- **Name:** Iryna Sarazhynska
- **Email:** irina.adel89@gmail.com (user id `cmrg0k1ow05lhgfnmnwzyp8kg`)
- **Phone:** +971 50 185 4130
- **Address on file:** Town Square, Rawda Parkviews 3, 1111, Dubai

## Order (as recorded)

- **Order number:** `MSK-IRYNA-110726` (order id `cmrg0y2zy05ligfnmv3tz2tzn`)
- **Date:** 2026-07-11 · **Status:** DELIVERED · **Payment:** paid (bank_transfer)

| Item | Retail | −10% unit | Qty |
|---|---|---|---|
| Multi Vita Radiance Serum 30ml (product `21`) | 330 | 297 | 1 |
| Multi Vita Radiance Cream 50g (product `31`) | 290 | 261 | 1 |

- Retail sum 620 → **one-off 10% discount** (−62) → subtotal **558**
- Delivery **45** → total **603** (VAT incl. 28.71)
- `moySkladOrderId` set to the order number so admin "Push to MoySklad" treats
  it as already synced — do not push again.

## Loyalty

- Track: REWARDS (no partner discount on account)
- Awarded **+558 points** (1 pt/AED on product spend, MEMBER ×1, not birthday month)
- User refreshed: totalSpent 603, totalOrders 1, tier MEMBER, balance 558

## Scripts

- `scripts/import-iryna-order-20260711.js` — dry-run by default, `--commit` to
  write. Idempotent (skips existing order, unique (orderId, type) on points).
  Adapted from `scripts/import-alena-order-04794.js`.
- `scripts/send-iryna-order-emails-20260711.ts` — sent her two customer emails
  (both delivered successfully via SMTP):
  1. **Order delivered / thank-you** email (standard `orderDelivered` template
     with order number, total AED 603, Shop Again CTA)
  2. **+558 GENOSYS Rewards points** email (new balance 558 pts, MEMBER tier)
