# Khadija Faidar — add Hair Tonic + one-off email (2026-08-13)

**Website order:** `CODM2608138202` (`cmsrkjju5000004kz570f3a95`)  
**Customer:** Khadija Faidar · `khadijafaidar6@gmail.com` · COD, Arabic

Invoice **04928** / shipment **06681** already had **00051** Hair Tonic 70ml ×1 @ **145** clinic. Website SO was still 625. Aligned website + SO to **770**. Unpaid.

## Lines (after)

| Item | Qty | Price |
|------|-----|------:|
| Bio-Ferment Age Defying Powder Mask | 1 | 250 |
| Snow O₂ Cleanser 180ml | 1 | 330 |
| Collagen Mask (promo) | 1 | FREE |
| HR³ MATRIX HAIR TONIC α 70ml | 1 | 145 |
| Delivery Dubai | 1 | 45 |
| **Total** | | **770** |

## Documents

| | |
|--|--|
| SO | CODM2608138202 `a0a896be-9725-11f1-0a80-09ec00337e7c` |
| Invoice | **04928** `a10a8824-9725-11f1-0a80-0360003338ff` |
| Shipment | **06681** `a221a1c2-9725-11f1-0a80-03600033392a` |

## Email (customer only)

- To: `khadijafaidar6@gmail.com`
- Subject: تأكيد الطلب CODM2608138202 - GENOSYS المهني
- SMTP messageId: `<8e6e3a7d-39dd-d3af-fc89-24a91e71e7c9@gmail.com>`
- Marker: `khadijaHairTonicAdded20260813` on `paymentMetadata`

Invoice PDF export failed (`print-prod.moysklad.ru` DNS). Not printed.

## Script

`scripts/add-khadija-faidar-hair-tonic-email-20260813.ts --commit`

## Payment in + delivered (evening)

Cash received. Payment in linked to **shipment 06681** only (no `demand.customerOrder`). SO → **Доставлен**. Website already DELIVERED; `paymentStatus` pending → **paid**.

| | |
|--|--|
| Payment in | **06078** `e42c9092-9731-11f1-0a80-0b8e0038b8cd` · 770 AED |
| Counterparty | `d848422e-9536-11f1-0a80-0b7c0017fbf9` |
| SO state | Доставлен |
| Website | `CODM2608138202` DELIVERED / paid |
| Loyalty / clinic | 0 / 0 (no retail user earn / no clinic attribution) |

Script: `scripts/moysklad-create-khadija-faidar-paymentin-04928-20260813.ts --commit`
