# Miss Irina (Mirdif) — new retail customer + unpaid chain

**Date:** 2026-08-16  
**Script:** `scripts/moysklad-create-miss-irina-mirdif-retail-order-20260816.js --commit`

New customer. Not Miss Irina Solodkaya. Unpaid. No print.

## Customer

| | |
|--|--|
| Name | Miss Irina |
| Phone | +971 54 301 0063 |
| Address | Villa 45c, Street 45c, Mirdif, Dubai |
| ID | `80826c3f-9947-11f1-0a80-1a580088d7e6` |

## Documents (SO → INV → SHIP)

| Doc | Number | Sum |
|-----|--------|----:|
| Order | **GENCardM2608160063** | 1,962.00 |
| Invoice | **04934** | 1,962.00 |
| Shipment | **06688** | 1,962.00 |

Shipment linked to invoice only. No payment in.

## Lines (retail, 10% off products 2026-08-16)

Was 2,175 list / briefly 50% (1,110). Now 10%. Delivery not discounted.

| Code | Product | Qty | Unit | Disc | Line |
|------|---------|----:|-----:|:----:|-----:|
| 00021 | Snow O₂ Cleanser 180ml | 1 | 330 | 10% | 297 |
| 00145 | Problem Control Toner 200ml | 1 | 260 | 10% | 234 |
| 00029 | Problem Control Serum 30ml | 1 | 330 | 10% | 297 |
| 00035 | Intensive Problem Control Cream 50g | 1 | 290 | 10% | 261 |
| 00189 | Skin Rescue Overnight Cream Mask 100g | 1 | 340 | 10% | 306 |
| 00065 | Power Solution PCS 1 Vial 2ml | 10 | 58 | 10% | 522 |
| 00089 | Excellent Delivery Dubai | 1 | 45 | — | 45 |
| | | | | **Total** | **1,962** |

PCS is 10 ampoules (vial SKU; box 00064 is not stocked).

## PDF

`~/Desktop/orders/GENOSYS_Miss_Irina_Mirdif_04934.pdf` (refreshed after 10% off)

Discount script: `scripts/moysklad-fix-miss-irina-mirdif-10pct-discount-20260816.js --commit`
