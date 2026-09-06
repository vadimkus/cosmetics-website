# Shakirovna Marina — consignment sales 01440 — 2026-08-27

**Customer:** Shakirovna Ladies Beauty Saloon `93775ae5-d18d-11ea-0a80-02e00008417d`  
**Agreement:** **00030**  
**Source:** spreadsheet Товар / Количество (10 pcs). Clinic list.

| | |
|---|---|
| Report | **01440** |
| Payment in | **06175** / **2,144 AED** |
| Pay status | **Paid** |
| Matching demand | **06786** |
| Sum | **2,144.00 AED** (was 1,072) |
| Pay status | Not Paid |
| Sales PDF | `~/Desktop/orders/GENOSYS_Shakirovna_Marina_Consignment_Sales_01440.pdf` |
| Stock note | `~/Desktop/orders/GENOSYS_Shakirovna_Marina_Consignment_Stock_Note_06786.pdf` |

| Code | Product | Qty | Unit | Line |
|---|---|---:|---:|---:|
| 00190 | Multi Functional Anti-Wrinkle Cream 50g | 2 | 145 | 290 |
| 00194 | Multi Vita Radiance Serum 30ml | 2 | 165 | 330 |
| 00189 | Skin Rescue Overnight Cream Mask 100g | 4 | 170 | 680 |
| 00144 | BB Cushion #2 Beige | 2 | 150 | 300 |
| 54467 | Skin Reboot PDRN Mask Pack | 2 | 200 | 400 |
| 00140 | Soothing Bomb Sea Algae Mask 25g | 8 | 18 | 144 |
| | | **20** | | **2,144** |

## Combined 2026-09-02

Vadim: same Товар / Количество sheet, add to last open report. **01440** already had this 10-pc list from 27 Aug. Added the same qty again (combine, no new report).

27 Aug 10 pcs / 1,072 + 2 Sep 10 pcs / 1,072 = **20 pcs / 2,144 AED**. Still unpaid. Period end → 2 Sep.

Script: `scripts/moysklad-amend-shakirovna-marina-01440-add-sheet-20260902.js --commit`

## Matching demand 2026-09-02

Vadim: match with demand into agreement.

Demand **06786** on agr. **00030**. Same 6 SKU / 20 pcs / **2,144 AED**. Shipped. No SO, no invoice, no paymentin. Not printed.

Script: `scripts/moysklad-create-shakirovna-marina-01440-matching-demand-20260902.js --commit`

https://online.moysklad.ru/app/#demand/edit?id=2e96d76f-a6c5-11f1-0a80-1a970034c454

https://online.moysklad.ru/app/#commissionreport/edit?id=8c0a3995-a1e8-11f1-0a80-087b005afcb7

Script: `scripts/moysklad-create-shakirovna-marina-consignment-sales-20260827.js`

## Date fix 2026-09-03

Invoice date was 27.08.2026. Set **moment + period end → 31 Aug 2026**. Reissued PDF to `~/Desktop/orders/GENOSYS_Shakirovna_Marina_Consignment_Sales_01440.pdf`. Still **Paid** / 2,144 AED.

Script: `scripts/moysklad-fix-shakirovna-marina-01440-date-20260903.js --commit`
