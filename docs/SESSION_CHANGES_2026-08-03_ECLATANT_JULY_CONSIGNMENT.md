# Eclatant — July consignment sales + matching demand (2026-08-03)

**Customer:** ECLATANT&CO TRADING CO L.L.C  
**Agreement:** 18  
**Period:** 2026-07-01 → 2026-07-31  
**Sum:** **2,701 AED** (14 lines / 36 pcs)

| Doc | Number | Sum |
|-----|--------|----:|
| Consignment sales | **01423** | 2,701 |
| Demand (replenish) | **06622** | 2,701 |

PDFs:
- `~/Desktop/orders/GENOSYS_Eclatant_Consignment_Sales_01423.pdf`
- `~/Desktop/orders/GENOSYS_Eclatant_Consignment_Stock_Note_06622.pdf`

Script: `scripts/moysklad-create-eclatant-commission-sales-demand-20260803.js`

## Follow-up — EGF discontinued (same day)

- EGF removed from demand **06622** (was ×1 @ 145 AED)
- Demand **06622** now **2,556 AED** (was 2,701)
- Write-off **00008-00488**: EGF × **12** @ buy 44.40 = **532.80 AED**
- Stock note PDF re-exported: `~/Desktop/orders/GENOSYS_Eclatant_Consignment_Stock_Note_06622.pdf`
- Script: `scripts/moysklad-fix-eclatant-remove-egf-writeoff-20260803.js`
- Sales report **01423** still includes EGF ×1 sold (315 portion of 2,701) — not changed unless asked

## Follow-up — Eye Roller ×4 on demand 06622

- Added **00084** Genosys Eye Roller 0,25mm × **4** @ **105** clinic = **420 AED**
- Demand **06622** now **2,976 AED** (was 2,556 after EGF removal)
- Stock note PDF refreshed: `~/Desktop/orders/GENOSYS_Eclatant_Consignment_Stock_Note_06622.pdf`
- Script: `scripts/moysklad-add-eclatant-eye-roller-demand-06622-20260803.js`
