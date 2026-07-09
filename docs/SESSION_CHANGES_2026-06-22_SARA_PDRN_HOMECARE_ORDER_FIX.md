# Sara — PDRN Homecare 54475 mapping + order line fix (2026-06-22)

**Date:** 2026-06-22  
**Script:** `scripts/moysklad-fix-sara-order-add-pdrn-homecare-20260622.js --commit`

## Context

Website Stripe order **GENCardM2606225559** (Miss Sarayounesskin Sara) pushed to MoySklad with note:

`Unmapped items: Bio-Meso PDRN Homecare Ampoule 5000`

Product **already existed** in MoySklad from Korea PO ingest (16 Jun 2026); only the website→MoySklad mapping was missing.

## Product (no new SKU created)

| Field | Value |
|-------|-------|
| Code | **54475** |
| Name | Genosys BIO-MESO PDRN Homecare Ampoule 5000 |
| ID | `3706b193-6ae8-11f1-0a80-16e5003a85d3` |
| Clinic (wholesale) | 150 AED |
| Retail | 300 AED |

**Created earlier by:** `scripts/moysklad-create-po-dts-260616.js`

## Code change

Added to `lib/moysklad.ts` `PRODUCT_MAP`:

```ts
'Bio-Meso PDRN Homecare Ampoule 5000': '3706b193-6ae8-11f1-0a80-16e5003a85d3'
```

Future website pushes will map this item automatically.

## Order fix

| Field | Value |
|-------|-------|
| Customer | Miss Sarayounesskin Sara |
| Order | **GENCardM2606225559** |
| ID | `1ad4a2e7-6e3d-11f1-0a80-1767008667c0` |
| Before | 905.00 AED (6 lines, homecare missing) |
| After | **1,205.00 AED** (+54475 ×1 @ 300 retail) |

- Added position: **54475** ×1 @ 300.00 AED  
- Removed unmapped note from description  
- Status: **Paid — awaiting delivery**

## Related documents (aligned 22 Jun 2026)

| Step | Name | ID | Before | After |
|------|------|-----|-------:|------:|
| Invoice | **04712** | `1b1c9615-6e3d-11f1-0a80-086500850076` | 905 | **1,205** |
| Shipment | **06401** | `1bb36b82-6e3d-11f1-0a80-0bf30084416b` | 905 | **1,205** |
| Payment | **05808** | `1c121593-6e3d-11f1-0a80-05fb0086cc78` | 905 | **1,205** |

**Fix script:** `scripts/moysklad-fix-sara-invoice-demand-payment-54475-20260622.js --commit`

### Stock note

54475 had **zero warehouse stock** (Korea PO DM GME 260616 not yet received). Shipment edit required a backdated **enter 00010-00118** @ 2026-06-22 16:15 (before shipment moment 16:20). Partial PO supply **00185** also posted (1 pc vs PO line 50).

## Full order lines (after fix)

| Code | Product | Qty | Unit | Line |
|------|---------|----:|-----:|-----:|
| 00022 | Snow Booster Toner 200ml | 1 | 130 | 130 |
| 00029 | Problem Control Serum 30ml | 2 | 165 | 330 |
| 54470 | BIO-MESO PDRN Expert Ampoule 60000 | 1 | 300 | 300 |
| 00035 | Intensive Problem Control Cream 50g | 1 | 145 | 145 |
| 00063 | Intensive Repair Collagen Mask 23g | 1 | 0 (100% disc) | 0 |
| 00140 | Soothing Bomb Sea Algae Mask 23g | 1 | 0 (100% disc) | 0 |
| **54475** | **BIO-MESO PDRN Homecare Ampoule 5000** | **1** | **300** | **300** |

**Total:** 1,205.00 AED
