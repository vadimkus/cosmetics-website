# DM GME 260810 — Korea PO booked (no receive) — 2026-08-25

**Source of truth:** `/Users/vadimkus/Desktop/18082029/DM GME 260810_Shipping Invoice (value).pdf`  
**Not received into warehouse.** Cargo is in transit this week. Positions marked **in transit**.

## Document

| Field | Value |
|---|---|
| **PO name** | **DM GME 260810** |
| **ID** | `418b0120-a05c-11f1-0a80-0bb40027d136` |
| **Link** | https://online.moysklad.ru/app/#purchaseorder/edit?id=418b0120-a05c-11f1-0a80-0bb40027d136 |
| **Moment** | 2026-08-18 |
| **ETA** | 2026-08-29 |
| **USD** | **4,709.00** (47 invoice lines, 2,644 invoice units) |
| **AED** | **17,293.55** (line-level USD × 3.6725; BOE printed 17,293.80) |
| **PO units** | **2,914** (GCMA10 30 Box → 00140 ×300 sheets) |
| **Supplier** | DTS MG `3a0a3f28-33cf-11ea-0a80-043f000b9859` |
| **AWB / BOE / CPIP** | 176-2056-4025 / 101-01485535-26 / CPIP-240826-087435 |

## New MoySklad products (created)

| Code | Name | Invoice |
|---|---|---|
| 54490 | Genosys Facial Treatment Leaflet (Folded) | GMBR09 |
| 54491 | Genosys Eyecell Kit Leaflet (Folded) | GMBR10 |
| 54492 | Genosys HR3 Matrix Leaflet (Folded) | GMBR11 |
| 54493 | Genosys Roller Leaflet (Folded) | GMBR07 |
| 54494 | Genosys Needle Pen-K Leaflet (Folded) | GMBR32 |
| 54495 | Genosys HairGen Booster Leaflet | GMBR29 |
| 54496 | Genosys Hair Gentron Leaflet | HGBR01 |
| 54497 | Genosys Trial Kit | GCST00 |
| 54498 | Samples Intensive Blemish Balm Cream 2g×100 box | GCCR10 |
| 54499 | Samples Soothing Repair Post Cream 2g×100 box | GCCR36 |
| 54500 | Samples Ultra Shield Sun Cream 4g×50 box | GCCR38 |

Reused existing: **54469** catalogue, **54486** bags (incl. GMBR13 ×20), **00134** radiance cream samples (GCCR32), **00002** standard 0.50mm roller (GRFS050).

## Value vs commercial PDF

Same total **USD 4,709**. Differences that matter:

- **Beige GCFO02:** value **$8.30 / $830** · commercial **$14.00 / $1,400**. PO uses value PDF. Product buyPrice on `00144` left at **51.42 AED** ($14).
- **Support / Derma block:** value PDF has small USD prices (shampoo $3, leaflets $0.10). Commercial marks those FOC. PO uses value PDF so the $4,709 still balances.
- **GCCR10:** value + packing list = **2g×100**. Commercial PDF says 2g×50. Created **54498** as 2g×100.

## Core incoming (in transit)

| Code | Product | WH now | In transit |
|---|---|---:|---:|
| 00002 | Roller 0.50mm | 103 | 30 |
| 00013 | Hydro Cool 1kg | 97 | 30 |
| 00140 | Sea algae 25g | 901 | 300 |
| 00063 | Collagen mask | 1,371 | 300 |
| 54475 | PDRN 5000 | 18 | 30 |
| 00041 | SPF40 40g | 135 | 20 |
| 54457 | SPF50 50g | 224 | 30 |
| 00144 | Cushion Beige | 358 | 100 |
| 00048 | Hair Solution Alpha box | 33 | 10 |

No supply / no paymentout. Receive when cargo is released.

## Post Cream 20g (user correction)

Warehouse `00038` = **29** loose tubes is not the full 20g position. Same store also has **`00039` Post Cream Box ×20**. Do **not** put 20g on the September PO. This shipment has **no** sellable 20g line — only tester `GCCR36` / `54499` (2g×100 boxes ×2).

Script: `scripts/moysklad-create-po-dm-gme-260810-20260825.js`  
CSV: `docs/DM_GME_260810_Shipping_Invoice_normalized.csv`

## MOFA attestation (2026-09-02)

Paymentout **00694** / **302.15 AED**. Attestation **AECI1056219107091964354**. See `docs/SESSION_CHANGES_2026-09-02_MOFA_ATTESTATION_260810.md`.
