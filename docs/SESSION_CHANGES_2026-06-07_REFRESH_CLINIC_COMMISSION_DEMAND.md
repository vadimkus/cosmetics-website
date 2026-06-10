# Refresh Clinic — May Commission Report + Replenishment Shipment (2026-06-07)

## Context

User provided the "Sold products for May. 07.06.2026" screenshot for Refresh Clinic and asked to create:

- `Полученный отчет комиссионера`
- `Отгрузка` under the same agreement
- Same product set, with shipment quantities **Beige x5** and **Camel x3**

## Customer / Agreement

- **Customer:** `REFRESH BIOHACKING CLINIC L.L.C`
- **Counterparty ID:** `a6e52a6a-a2d6-11f0-0a80-03b9004ee0de`
- **Agreement:** `24`
- **Contract ID:** `dc3ad805-a2d6-11f0-0a80-0d1c0051970b`
- **Commission period:** `2026-05-01 00:00:00` → `2026-05-31 23:59:59`

## Created Documents

| Type | Number | ID | Sum | Lines | Units |
|------|--------|----|-----|-------|-------|
| Received commissioner report | `01373` | `59d4984e-6278-11f1-0a80-01a50063982b` | 1,451.00 AED | 8 | 11 |
| Shipment / Отгрузка | `06312` | `5a740601-6278-11f1-0a80-06700063aed2` | 2,201.00 AED | 8 | 16 |

Report URL: https://online.moysklad.ru/app/#commissionreport/edit?id=59d4984e-6278-11f1-0a80-01a50063982b

Shipment URL: https://online.moysklad.ru/app/#demand/edit?id=5a740601-6278-11f1-0a80-06700063aed2

## Report Lines (Sold May Screenshot)

| Code | Product | Qty | Unit | Line |
|------|---------|-----|------|------|
| `00145` | Problem Control Toner 200ml | 1 | 130.00 | 130.00 |
| `00144` | Skin Caring Blemish Balm Cushion #2 Beige | 2 | 150.00 | 300.00 |
| `00021` | Snow O2 Cleanser 180ml | 1 | 165.00 | 165.00 |
| `54464` | Skin Caring Blemish Balm Cushion #3 Camel | 1 | 150.00 | 150.00 |
| `54457` | Ultra Shield Sun Cream SPF50/PA++++ 50g | 1 | 125.00 | 125.00 |
| `00031` | Intensive Hydro Soothing Cream 50g | 1 | 145.00 | 145.00 |
| `54467` | Skin Reboot PDRN mask Pack | 2 | 200.00 | 400.00 |
| `00063` | Intensive Repair Collagen Mask 23g | 2 | 18.00 | 36.00 |
| **Total** | | **11** | | **1,451.00** |

## Shipment Lines

Same product set as report, but with replenishment quantity override:

- Beige cushion #2: **5 pcs**
- Camel cushion #3: **3 pcs**

| Code | Product | Qty | Unit | Line |
|------|---------|-----|------|------|
| `00145` | Problem Control Toner 200ml | 1 | 130.00 | 130.00 |
| `00144` | Skin Caring Blemish Balm Cushion #2 Beige | 5 | 150.00 | 750.00 |
| `00021` | Snow O2 Cleanser 180ml | 1 | 165.00 | 165.00 |
| `54464` | Skin Caring Blemish Balm Cushion #3 Camel | 3 | 150.00 | 450.00 |
| `54457` | Ultra Shield Sun Cream SPF50/PA++++ 50g | 1 | 125.00 | 125.00 |
| `00031` | Intensive Hydro Soothing Cream 50g | 1 | 145.00 | 145.00 |
| `54467` | Skin Reboot PDRN mask Pack | 2 | 200.00 | 400.00 |
| `00063` | Intensive Repair Collagen Mask 23g | 2 | 18.00 | 36.00 |
| **Total** | | **16** | | **2,201.00** |

## Script

`scripts/moysklad-create-refresh-clinic-commission-demand-20260607.js`

Dry-run verified stock availability and totals before posting live.
