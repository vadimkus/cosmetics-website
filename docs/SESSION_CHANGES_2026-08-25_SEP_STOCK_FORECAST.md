# Stock forecast — September Korea order (2026-08-25)

**Verdict: small targeted air in the first week of September. Not a full restock.**

Source: MoySklad `report/profit/byproduct` (net sold) Jan 2025–Aug 2026 + warehouse turnover 30/90d + stock 25 Aug.

**Update same day:** PO **DM GME 260810** is now open and **in transit** (not received). Value invoice USD 4,709. See `docs/SESSION_CHANGES_2026-08-25_DM_GME_260810_PO.md`.

**Post Cream 20g:** drop from the Sep order. `00038` = 29 loose tubes, but `00039` Post Cream Box = **20** in the same warehouse. User confirmed they have more than 29. 260810 does not add 20g sellable stock.

## Company units

| | 2025 | 2026 | YoY |
|--|-----:|-----:|----:|
| Jan–Jul | 8,339 | 11,236 | **+35%** |
| Jun | 877 | 1,758 | +100% |
| Jul | 1,043 | 1,799 | +72% |
| Aug | 927 | 1,342 MTD (25d) | run-rate ~1,664 |

Last year Sep was the trough (957) then Oct 1,589 / Nov 1,764. This year already runs at that Q4 pace.

## Recommended PO (296 units)

| Code | Avail | In transit | Cover | 30d WH out | Order |
|------|------:|-----------:|------:|-----------:|------:|
| 54475 PDRN 5000 | 18 | 30 | 16d on shelf | 34 | 60 |
| 00037 Barrier 100g | 28 | 0 | 34d | 11 | 50 |
| 00122 Radiance Cream 50g | 42 | 0 | 37d | 34 | 50 |
| 00015 SRS | 222 | 0 | 42d | 160 | 100 |
| 00059 Eye Zone Kit | 12 | 0 | 45d | 8 | 10 |
| 00030 AFS Serum | 32 | 0 | 53d | 18 | 20 |
| 00032 Hydro 250g | 7 | 0 | 53d | 4 | 6 |

Optional +100 if one air should cover through November: Ivory 20, Hyaluron cream 50g 30, EyeCell cream/serum 15+15, PCS 20.

## Do not order

**00038 Post Cream 20g** (29 loose + **00039 ×20 boxes**), beige (358 + 100 in transit), collagen (1,371 + 300), peptide (1,251), SPF50 (224 + 30), SPF40 (135 + 20), Snow 180 (211), sea algae (901 + 300).

Scripts: `scripts/moysklad-stock-forecast-sep-20260825.js` · `scripts/moysklad-merge-turnover-sep-forecast-20260825.js`  
Data: `docs/STOCK_FORECAST_SEP_2026-08-25.json`
