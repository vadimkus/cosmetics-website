# Cosmiden / Lilyne — August consignment sales (2026-08-31)

**Customer:** COSMIDEN MEDICAL CENTER L.L.C (`d7b0a67f-d5a2-11ef-0a80-16cd0019b6b8`)  
**Agreement:** 15 (`69b01872-d7dd-11ef-0a80-0725003ffada`)  
**Period:** 2026-08-01 → 2026-08-31 (sheet as of 30.08.2026)  
**Script:** `scripts/moysklad-create-cosmiden-commission-sales-20260831.js --commit`

## Posted

| Type | Number | Sum | Units | Lines | Status |
|------|--------|----:|------:|------:|--------|
| Отчет комиссионера | **01448** | **1,237.00 AED** | 18 | 7 | Not paid |

PDF: `~/Desktop/orders/GENOSYS_Cosmiden_Lilyne_Consignment_Sales_01448.pdf` (not printed)

Report: https://online.moysklad.ru/app/#commissionreport/edit?id=debcdbe2-a539-11f1-0a80-091700d459f5

## Lines @ clinic list

| Code | Product | Qty | Unit AED | Line AED |
|------|---------|----:|---------:|---------:|
| 00122 | Multi-Vita Radiance Cream 50g | 1 | 145 | 145 |
| 00190 | Multi Functional Anti-Wrinkle Cream 50g | 1 | 145 | 145 |
| 00143 | Cushion #1 Ivory (sold Aug 6) | 1 | 150 | 150 |
| 00063 | Collagen mask | 6 | 18 | 108 |
| 00140 | Sea algae mask | 3 | 18 | 54 |
| 54457 | Ultra Shield SPF50 50g | 1 | 125 | 125 |
| 00038 | Post Cream 20g (sold Aug 18 / 27 / 29) | 5 | 102 | 510 |
| | **Total** | **18** | | **1,237** |

Masks labelled 16g on the sheet → MoySklad **00063** / **00140**.

## Matching demand (31 Aug)

| Type | Number | Sum | Status |
|------|--------|----:|--------|
| Отгрузка into agr. **15** | **06770** | **925.00 AED** | shipped |

Skipped ivory cushion + both masks. Post cream **×5**.

| Code | Product | Qty | Unit AED | Line AED |
|------|---------|----:|---------:|---------:|
| 00122 | Multi-Vita Radiance Cream 50g | 1 | 145 | 145 |
| 00190 | Multi Functional Anti-Wrinkle Cream 50g | 1 | 145 | 145 |
| 54457 | Ultra Shield SPF50 50g | 1 | 125 | 125 |
| 00038 | Post Cream 20g | 5 | 102 | 510 |
| | **Total** | **8** | | **925** |

Stock note: `~/Desktop/orders/GENOSYS_Cosmiden_Consignment_Stock_Note_06770.pdf`

Demand: https://online.moysklad.ru/app/#demand/edit?id=4fd036db-a53a-11f1-0a80-15de00d6b9d6

Script: `scripts/moysklad-create-cosmiden-matching-demand-01448-20260831.js --commit`

## Not done

- Ivory / collagen / sea algae restock (they still have stock)
- Payment on report **01448**
