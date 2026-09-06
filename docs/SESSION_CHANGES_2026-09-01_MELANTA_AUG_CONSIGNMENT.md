# Melanta — August consignment sales + matching demand (2026-09-01)

**Customer:** Melanta Poly Clinic L.L.C `c3908257-ccdd-11ef-0a80-11a10053430e`  
**Agreement:** 14 `ca7a8aa6-ccdd-11ef-0a80-18080052ee1c`  
**Period:** 2026-08-01 → 2026-08-31  
**Script:** `scripts/moysklad-create-melanta-aug-sales-demand-20260901.js --commit`

## Posted

| Type | Number | Sum | Units | Status |
|------|--------|----:|------:|--------|
| Отчет комиссионера | **01450** | **1,647.00 AED** | 12 | **Paid** |
| Отгрузка into agr. **14** | **06780** | **1,647.00 AED** | 12 | shipped |
| Paymentin | **06168** | **1,647.00 AED** | | linked to **01450** |

Same 8 lines. Agreement-only demand. Paymentin on the report only (not on demand **06780**).

- Report: https://online.moysklad.ru/app/#commissionreport/edit?id=8d5ddcaa-a607-11f1-0a80-0899004019a3
- Demand: https://online.moysklad.ru/app/#demand/edit?id=8dfda375-a607-11f1-0a80-14330040c502
- `~/Desktop/orders/GENOSYS_Melanta_Consignment_Sales_01450.pdf`
- `~/Desktop/orders/GENOSYS_Melanta_Consignment_Stock_Note_06780.pdf`

## Lines @ clinic list

| Code | Product | Qty | Unit | Line |
|------|---------|----:|-----:|-----:|
| 54467 | Skin Reboot PDRN mask Pack (1 box) | 1 | 200 | 200 |
| 00035 | Intensive Problem Control Cream 50g | 1 | 145 | 145 |
| 00144 | Cushion #2 Beige | 1 | 150 | 150 |
| 00063 | Collagen Mask (16g label → 23g SKU) | 2 | 18 | 36 |
| 00140 | Sea Algae Mask (16g label → 25g SKU) | 2 | 18 | 36 |
| 00059 | EyeCell Eye Zone Care Kit | 1 | 490 | 490 |
| 54457 | Ultra Shield SPF50 50g | 2 | 125 | 250 |
| 00189 | Overnight Cream Mask 100g | 2 | 170 | 340 |
| | **Total** | **12** | | **1,647** |

01419 (1 Aug WhatsApp, 255 AED) already paid 5 Aug. This is the August sheet they sent 1 Sep.

**1 Sep paymentin:** **06168** `5c8cd3e9-a619-11f1-0a80-13750044d2b0` / **1,647 AED** @ report **01450**.  
Script: `scripts/moysklad-create-melanta-paymentin-01450-20260901.js --commit`
