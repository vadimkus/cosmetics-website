# Session — Manual Order Import: Olha Kravchuk (2026-07-11)

## Context

Vadim asked to record a one-off paid order into the website DB so the customer
has it in her order history and earns loyalty points, and to send her the two
customer emails. Same pattern as Iryna Sarazhynska's order the same day
(`SESSION_CHANGES_2026-07-11_IRYNA_SARAZHYNSKA_ORDER.md`). The sale was handled
outside the website; it must NOT be pushed to MoySklad.

## Customer

- **Name:** Olha Kravchuk
- **Email:** oli.kravchuk95@gmail.com (user id `cmk4a189s00ece9k5nsvqxnb7`)
- **Phone:** +971 55 691 0355
- **Address on file:** Al Jaddaf, O Ten by Aqua Properties, 1004, Dubai

## Order (as recorded)

- **Order number:** `MSK-OLHA-110726` (order id `cmrg2y7h505lrgfnmhjfjsozc`)
- **Date:** 2026-07-11 · **Status:** DELIVERED · **Payment:** paid (bank_transfer)

| Item | Retail | −10% unit | Qty |
|---|---|---|---|
| Skin Defender Lip & Eye Makeup Remover (product `11`) | 290 | 261 | 1 |
| Snow O₂ Cleanser 180ml (product `10`) | 330 | 297 | 1 |

- Retail sum 620 → **one-off 10% discount** (−62) → subtotal **558**
- Delivery **45** → total **603** (VAT incl. 28.71)
- `moySkladOrderId` set to the order number so admin "Push to MoySklad" treats
  it as already synced — do not push again.

## Loyalty

- Track: REWARDS (no partner discount on account)
- Awarded **+558 points** (1 pt/AED on product spend, MEMBER ×1, not birthday month)
- User refreshed: totalSpent 948, totalOrders 2, tier MEMBER, **balance 1,003**
  (had 445 before). One more order or 52 AED spent and she reaches SILVER.

## Emails sent (both delivered via SMTP)

1. **Order delivered / thank-you** — standard `orderDelivered` template with
   order number, total AED 603, Shop Again CTA
2. **+558 GENOSYS Rewards points** — new balance 1,003 pts, MEMBER tier

## Scripts

- `scripts/import-olha-order-20260711.js` — dry-run by default, `--commit` to
  write. Idempotent. Adapted from `scripts/import-iryna-order-20260711.js`.
- `scripts/send-olha-order-emails-20260711.ts` — sent the two emails above.
