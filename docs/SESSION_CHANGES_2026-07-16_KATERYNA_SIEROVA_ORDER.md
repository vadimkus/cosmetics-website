# Session — Manual Order Import: Kateryna Sierova (2026-07-16)

## Context

Offline retail sale recorded into the website DB so Kateryna has order history
+ GENOSYS Rewards points. Must **not** be pushed to MoySklad. Also assigned
VIP 12% on her account with the discount email.

## Customer

- **Name:** Kateryna Sierova
- **Email:** kateryna.sierova10@gmail.com (`cmrmz9a0b0692gfnmp146ogjm`)
- **Phone:** +971562190979
- **Address:** Oasis Villas 13, JVC, Dubai

## Order

- **Order number:** `MSK-KATERYNA-160726` (`cmrn2pdzy06a5gfnmqwbyklf5`)
- **Status:** DELIVERED · **Payment:** paid (bank_transfer)
- **Retail prices** (no order discount) + delivery **45 AED**

| Item | Retail | Qty |
|---|---|---|
| Snow O₂ Cleanser 180ml (`10`) | 330 | 1 |
| EZ CO₂ Mask Kit (`38`) | 460 | 1 |
| Skin Caring Blemish Balm Cushion #3 Camel (`41`) | 300 | 1 |

- Subtotal **1,090** + shipping **45** → total **1,135** (VAT incl. 54.05)
- `moySkladOrderId` = order number (treat as already synced)

### Correction (same day) — 10% order discount

Applied **10%** on product lines (shipping unchanged):

| Item | Was | Now (−10%) |
|---|---|---|
| Snow O₂ 180ml | 330 | 297 |
| EZ CO₂ Mask | 460 | 414 |
| Cushion Camel | 300 | 270 |

- Subtotal **981** (−109) + shipping **45** → total **1,026** (VAT 48.86)
- Loyalty adjusted **1,090 → 981** pts; totalSpent **1,026**; still SILVER
- Earlier delivered/points emails still show the old AED 1,135 / +1,090 figures
  (not re-sent unless requested)

## Account + loyalty

- VIP **12%** applied; discount assignment email sent
- Awarded **+1,090 points** (product spend only; REWARDS track)
- Tier refreshed to **SILVER** (totalSpent 1,135 ≥ 1,000)
- Balance **1,090 pts**

## Emails sent

1. VIP 12% discount assignment
2. Order delivered / thank-you (AED 1,135)
3. Points earned (+1,090, SILVER)

## Scripts

- `scripts/import-kateryna-order-20260716.js` (`--commit`)
- `scripts/send-kateryna-emails-20260716.ts`

## Note

Snow O₂ sized as **180ml (330 AED)**. If the bottle was the 500ml professional
(510 AED), totals/points need a correction.
