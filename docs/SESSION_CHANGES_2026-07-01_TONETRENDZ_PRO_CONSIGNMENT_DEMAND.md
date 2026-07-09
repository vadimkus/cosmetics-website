# TONETRENDZ — professional consignment replenishment (2026-07-01)

**Customer:** TONETRENDZ LADIES COSMETIC & PERSONAL CARE CENTER L.L.C (`74aa75cb-63db-11f1-0a80-111d001bbe72`)  
**Agreement:** 36 (`7a5e3023-63dc-11f1-0a80-1ba4001ce87b`)  
**Script:** `scripts/moysklad-create-tonetrendz-pro-consignment-demand-20260701.js --commit`  
**Status:** Posted 2026-07-01. Pumps **excluded** per user.

## Posted

| | |
|--|--|
| **Shipment** | **06445** |
| **Sum** | **2,015.00 AED** |
| **Units** | 9 lines |
| **ID** | `628dfeb0-7563-11f1-0a80-09f10024411b` |
| **PDF** | `~/Desktop/orders/GENOSYS_TONETRENDZ_06445_Consignment_Stock_Note.pdf` |

[Open shipment](https://online.moysklad.ru/app/#demand/edit?id=628dfeb0-7563-11f1-0a80-09f10024411b)

## Lines (9 pcs, professional sizes)

| Code | Product | Qty | Clinic price |
|------|---------|-----|-------------:|
| 54465 | Soothing Repair Post Cream 100g (SRP) | 1 | 220 |
| 00183 | Problem Control Toner 500ml (PCT) | 1 | 245 |
| 00025 | Snow Booster Toner 1000ml (SBT) | 1 | 245 |
| 00024 | Snow O₂ Cleanser 500ml (SOC) | 1 | 255 |
| 54460 | Moisture Replenishing Hyaluron Cream 250g (MHC) | 1 | 210 |
| 00034 | Multi Functional Anti-Wrinkle Cream 250g (MFC) | 1 | 210 |
| 00123 | Multi-Vita Radiance Cream 230g (MVC) | 1 | 210 |
| 00036 | Intensive Problem Control Cream 250g (PCC) | 1 | 210 |
| 00032 | Intensive Hydro Soothing Cream 250g (HSC) | 1 | 210 |

**Expected total:** 2,015.00 AED

## Run

```bash
cd /Users/vadimkus/cosmetics-website
node --import dotenv/config scripts/moysklad-create-tonetrendz-pro-consignment-demand-20260701.js
node --import dotenv/config scripts/moysklad-create-tonetrendz-pro-consignment-demand-20260701.js --commit
```
