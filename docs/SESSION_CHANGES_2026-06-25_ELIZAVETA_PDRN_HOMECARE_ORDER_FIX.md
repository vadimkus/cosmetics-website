# Elizaveta — PDRN Homecare 54475 order fix (2026-06-25)

**Date:** 2026-06-25  
**Script:** `scripts/moysklad-fix-elizaveta-order-add-pdrn-homecare-20260625.js --commit`

## Context

Website COD order **CODM2606256271** (Elizaveta Nabiieva) was pushed to MoySklad with note:

`Unmapped items: Bio-Meso PDRN Homecare Ampoule 5000`

Mapping for **54475** was added to `lib/moysklad.ts` on 2026-06-22 (Sara fix) but this push ran against a partial sync path / pre-deploy build — order was created at **935 AED** without the homecare line.

## Product (existing SKU)

| Field | Value |
|-------|-------|
| Code | **54475** |
| Name | Genosys BIO-MESO PDRN Homecare Ampoule 5000 |
| ID | `3706b193-6ae8-11f1-0a80-16e5003a85d3` |
| Website line price | **150 AED** (clinic) |
| Retail | 300 AED |

## Code change (routing aliases)

Added to `lib/moysklad.ts` `PRODUCT_MAP`:

```ts
'Bio Meso PDRN Homecare Ampoule 5000': '3706b193-6ae8-11f1-0a80-16e5003a85d3', // alias
'54475': '3706b193-6ae8-11f1-0a80-16e5003a85d3',                               // code fallback
```

Primary key `'Bio-Meso PDRN Homecare Ampoule 5000'` unchanged since 22 Jun.

## Order fix

| Field | Value |
|-------|-------|
| Customer | Elizaveta Nabiieva |
| Phone | +971525536091 |
| Address | Rimal 6, apartment 901, Dubai |
| Order | **CODM2606256271** |
| ID | `5a363151-708a-11f1-0a80-1012001a2ce8` |
| Before | **935.00 AED** (5 paid lines + 2 free promos; homecare missing) |
| After | **1,085.00 AED** (+54475 ×1 @ 150) |

- Added position: **54475** ×1 @ 150.00 AED  
- Removed unmapped note from description  
- Payment: **Cash on Delivery** (pending)  
- Invoice / shipment: **not yet created** — can re-push from admin once COD delivered, or create manually

## Invoice + shipment (2026-06-25)

**Script:** `scripts/moysklad-create-elizaveta-invoice-demand-20260625.js --commit`

| Doc | Name | ID | Sum |
|-----|------|-----|----:|
| Invoice | **04719** | `756bd0b5-708f-11f1-0a80-0b26001bbc37` | **1,085.00 AED** |
| Shipment | **06408** | `76666014-708f-11f1-0a80-1e10001b53a0` | **1,085.00 AED** |

**PDF:** `~/Desktop/orders/GENOSYS_Elizaveta_Nabiieva_04719.pdf`

COD payment not yet posted — record **paymentin** when cash collected on delivery.

## Full order lines (after fix)

| Code | Product | Qty | Unit | Disc | Line |
|------|---------|----:|-----:|-----:|-----:|
| 00029 | Problem Control Serum 30ml | 1 | 165 | 0 | 165 |
| 00144 | BB Cushion #2 Beige | 4 | 150 | 0 | 600 |
| 00189 | Skin Rescue Overnight Cream Mask | 1 | 170 | 0 | 170 |
| **54475** | **BIO-MESO PDRN Homecare Ampoule 5000** | **1** | **150** | **0** | **150** |
| 00063 | Intensive Repair Collagen Mask | 1 | 36 | 100% | 0 |
| 00140 | Soothing Bomb Sea Algae Mask | 1 | 36 | 100% | 0 |

**Total:** 1,085.00 AED (matches website total incl. 50% promo discount structure)

## Stock note

54475 may have limited warehouse stock (Korea PO received 22 Jun). If shipment fails on stock, backdate an **enter** before demand — same pattern as Sara fix (`scripts/moysklad-fix-sara-invoice-demand-payment-54475-20260622.js`).
