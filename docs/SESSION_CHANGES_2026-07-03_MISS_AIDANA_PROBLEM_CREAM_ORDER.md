# Miss Aidana Yerkegaliyeva — problem cream retail order (2026-07-03)

**Customer:** Miss Aidana Yerkegaliyeva (`e62a4998-8e9f-11ef-0a80-157e000dd8e4`)  
**Phone:** +971 58 120 3838  
**Ship:** Picadilly Green Villa 45, Damac Hills, Dubai  
**Script:** `scripts/moysklad-create-miss-aidana-problem-cream-order-invoice-demand-20260703.js --commit`

## Chain

| Doc | Number | AED |
|-----|--------|----:|
| Sales order | **GENCardM2607033838** | 335.00 | Delivered |
| Invoice | **04761** | 335.00 | paid |
| Shipment | **06470** | 335.00 | paid |
| Payment in | **05882** | 335.00 | linked to 06470 |

- [Order](https://online.moysklad.ru/app/#customerorder/edit?id=2dc3e8a0-7709-11f1-0a80-0b550025385f)
- [Invoice](https://online.moysklad.ru/app/#invoiceout/edit?id=2e0d65b1-7709-11f1-0a80-1f21002542e6)
- [Shipment](https://online.moysklad.ru/app/#demand/edit?id=2ed200ba-7709-11f1-0a80-0d9f0025a0f0)
- [Payment](https://online.moysklad.ru/app/#paymentin/edit?id=c696bc48-7709-11f1-0a80-0c64002664fd)

## Lines (updated 2026-07-04 — FOC add)

| Code | Product | Qty | Retail | Disc | Line |
|------|---------|----:|-------:|-----:|-----:|
| 00035 | Intensive Problem Control Cream 50g | 1 | 290.00 | — | 290.00 |
| 00183 | Problem Control Toner 500ml | 1 | 490.00 | 100% | 0.00 |
| 00063 | Intensive Repair Collagen Mask 23g | 2 | 36.00 | 100% | 0.00 |
| 00140 | Soothing Bomb Sea Algae Mask 23g | 2 | 36.00 | 100% | 0.00 |
| 00065 | Power Solution PCS 1 Vial 2ml | 2 | 58.00 | 100% | 0.00 |
| 00071 | Power Solution HES 1 Vial 2ml | 1 | 58.00 | 100% | 0.00 |
| *(service)* | Excellent Delivery Dubai | 1 | 45.00 | — | 45.00 |
| | | | **Total** | | **335.00** |

**Amend script:** `scripts/moysklad-fix-miss-aidana-add-foc-lines-20260704.js --commit` — masks bumped +1 each; toner/PCS/HES added @ 100% off; total unchanged; PDF reprinted.

## Original lines (2026-07-03)

## PDF / print

Retail template → `~/Desktop/orders/GENOSYS_Miss_Aidana_04761.pdf` — sent to **EPSON_L3260_Series** via `lp`.

Payment **05882** posted 335.00 AED → shipment **06470** fully paid; order state **Delivered**.
