# Refresh Clinic — June 2026 consignment sales report

**Date:** 2026-07-11  
**Script:** `scripts/moysklad-create-refresh-clinic-commission-report-20260711.js --commit`

## Customer / Agreement

- **Customer:** REFRESH BIOHACKING CLINIC L.L.C (`a6e52a6a-a2d6-11f0-0a80-03b9004ee0de`)
- **Agreement:** 24 (`dc3ad805-a2d6-11f0-0a80-0d1c0051970b`)
- **Period:** 2026-06-01 → 2026-06-30
- **Source:** User screenshot "Sold products for June. 11.07.2026"

## Report created

| Type | Number | ID | Sum | Lines | Units |
|------|--------|----|-----|-------|-------|
| Received commissioner report | **01405** | `59d53e1f-7d24-11f1-0a80-0574003d775e` | **1,844.00 AED** | 9 | 15 |

Report only — no replenishment shipment.

URL: https://online.moysklad.ru/app/#commissionreport/edit?id=59d53e1f-7d24-11f1-0a80-0574003d775e

## Sold lines

| Code | Product | Qty | Unit | Line |
|------|---------|-----|------|------|
| 00021 | Snow O₂ Cleanser 180ml | 1 | 165.00 | 165.00 |
| 00037 | Skin Barrier Protecting Cream 100g | 1 | 225.00 | 225.00 |
| 00063 | Intensive Repair Collagen Mask 23g | 1 | 18.00 | 18.00 |
| 00140 | Soothing Bomb Sea Algae Mask 23g | 2 | 18.00 | 36.00 |
| 00144 | Skin Caring Blemish Balm Cushion #2 Beige | 6 | 150.00 | 900.00 |
| 00145 | Problem Control Toner 200ml | 1 | 130.00 | 130.00 |
| 00188 | Microbiome Energy Infusing Mist 80ml | 1 | 80.00 | 80.00 |
| 54457 | Ultra Shield Sun Cream SPF50/PA++++ 50g | 1 | 125.00 | 125.00 |
| 00191 | Multi Functional Anti-Wrinkle Serum 30ml | 1 | 165.00 | 165.00 |
| **Total** | | **15** | | **1,844.00** |

## PDF

`~/Desktop/orders/GENOSYS_Refresh_Clinic_Consignment_Sales_01405.pdf`

## Payment (2026-07-13)

Full payment received from Refresh Biohacking for June consignment sales.

| Type | Number | ID | Sum | State |
|------|--------|----|-----|-------|
| Incoming payment | **05928** | `6d3b425d-7e93-11f1-0a80-10ac00744fc7` | **1,844.00 AED** | Posted |

- **Script:** `scripts/moysklad-create-refresh-clinic-paymentin-01405-20260713.js --commit`
- Report **01405** → **Paid** (payedSum 1,844 / 1,844 AED)
- URL: https://online.moysklad.ru/app/#paymentin/edit?id=6d3b425d-7e93-11f1-0a80-10ac00744fc7
