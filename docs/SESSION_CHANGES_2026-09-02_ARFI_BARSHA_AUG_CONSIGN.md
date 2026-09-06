# ARFI Nails Barsha — August 2026 consignment sold — 2026-09-02

**Customer:** ARFI NAILS BEAUTY SALON (Barsha) `39a1aa83-a5a6-11f0-0a80-1cbc00050fea`  
**Agreement:** **25**  
**Period:** 2026-08-01 → 2026-08-31  
**Source:** clinic MoySklad sold table (5 lines / 7 pcs). Clinic list.

| | |
|---|---|
| Report | **01453** |
| Matching demand | **06788** |
| Report sum | **1,030.00 AED** |
| Demand sum | **885.00 AED** (no EGF — warehouse 0) |
| Pay status | **Paid** — paymentin **06196** / Mashreq **033IPP403940330** |
| Sales PDF | `~/Desktop/orders/GENOSYS_ARFI_Nails_Barsha_Consignment_Sales_01453.pdf` |
| Stock note | `~/Desktop/orders/GENOSYS_ARFI_Nails_Barsha_Consignment_Stock_Note_06788.pdf` |

| Code | Product | Qty | Unit | Report | Demand |
|---|---|---:|---:|---:|:---:|
| 00042 | EGF Repair Oxymask Cream 50ml | 1 | 145 | 145 | skipped |
| 00122 | Multi-Vita Radiance Cream 50g | 1 | 145 | 145 | yes |
| 54473 | Revita Glow BB #02 Natural 50g | 1 | 125 | 125 | yes |
| 00144 | BB Cushion #2 Beige | 3 | 150 | 450 | yes |
| 00021 | Snow O₂ Cleanser 180ml | 1 | 165 | 165 | yes |
| | | **7** | | **1,030** | **885** |

Demand on agr. **25**. Shipped. No SO, no invoice, no paymentin. Not printed.

`00042` EGF is discontinued and warehouse stock is 0, so MoySklad rejected a 1:1 demand. Sold line stays on the report only.

Script: `scripts/moysklad-create-arfi-barsha-aug-consignment-20260902.js --commit`

https://online.moysklad.ru/app/#commissionreport/edit?id=343eb3eb-a6cc-11f1-0a80-08a90037e017  
https://online.moysklad.ru/app/#demand/edit?id=881a1efa-a6cc-11f1-0a80-08a900380cd0
