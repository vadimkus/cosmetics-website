# Shakirovna Marina — matching demand for report 01402

**Date booked:** 2026-07-17 (backfill)  
**Customer:** Shakirovna Ladies Beauty Saloon (Marina)  
**Contract:** **00030**  
**Script:** `scripts/moysklad-create-shakirovna-marina-01402-matching-demand-20260717.js --commit`

## Context

Report **01402** (7 Jul) was posted report-only. Physical replenishment was delivered but not booked. Matching отгрузка created with the **same moment** as the report.

## Documents

| Type | Number | Moment | Sum AED | Lines / pcs |
|------|--------|--------|--------:|-------------|
| Report (existing) | **01402** | 2026-07-07 12:14 | 3,913.00 | 17 / 35 |
| Отгрузка (new) | **06556** | 2026-07-07 12:14 | 3,913.00 | 17 / 35 |

- [Demand 06556](https://online.moysklad.ru/app/#demand/edit?id=265fc29a-81b3-11f1-0a80-0f9b00106091)
- Stock note PDF: `~/Desktop/orders/GENOSYS_Shakirovna_Marina_Consignment_Stock_Note_06556.pdf`

## Beige `00144`

Books were **2** after report-only 01402 (−5). After demand **06556** (+5): expected book **7** — matches salon physical count.
