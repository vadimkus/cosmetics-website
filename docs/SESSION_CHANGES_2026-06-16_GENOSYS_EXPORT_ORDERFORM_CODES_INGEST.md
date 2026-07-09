# GENOSYS Export Order Form (Codes.xlsx) — Ingest

**Date ingested:** 2026-06-16
**Source file:** `/Users/vadimkus/Desktop/Exer/Codes.xlsx` (8.8 MB)
**Workbook title (USD sheet):** `2026 GENOSYS Export Order Form` (dated 2026-05-15)
**Ingest script:** `/Users/vadimkus/cosmetics-website/scripts/ingest_genosys_export_orderform_codes_2026.py`
**Normalized CSV:** `/Users/vadimkus/cosmetics-website/docs/GENOSYS_Export_Orderform_Codes_2026_normalized.csv`

## What this is

This is the **GENOSYS factory export order form** — the master reference for
**item codes, barcodes (EAN-13), labeling codes, HS customs codes, pack sizes,
and USD wholesale prices**. It is the export/import (USD, factory) document and is
**distinct from** the UAE clinic AED price list
(`docs/GENOSYS_UAE_PriceList_Clinics_2026_normalized.csv`, ingested 2026-06-09).

Use this file for: customs/HS codes, barcodes, factory item codes, USD landed-cost
calculations, and order-form line items.

## Summary

- **184 line items** extracted across **4 worksheets**.
  - `USD` — **128** product items (the main catalogue)
  - `GENOSYS Marketing Material` — **53** items (brochures, banners, displays, uniforms, promo/starter sachets)
  - `LED` — **1** device (GENO-LED IR II, tiered pricing)
  - `HAIR-GENTRON` — **2** items
- USD product price range: **$0.8** (Intensive Repair Collagen Mask, GCMA06, min order 300pcs) to **$160** (HAIRGEN BOOSTER, GAHR01).
- USD sheet has **17 product categories**.

## USD categories (item counts)

| Category | Items |
|---|---|
| Detachable Manual Roller (autoclavable handle) | 10 |
| Vibrating Roller & Replacement Heads | 15 |
| Body Roller (detachable head), Stamp, Eye Roller | 15 |
| Manual Roller (one-body type) | 10 |
| GENOSYS Cleanser/Toner | 9 |
| MASKS | 9 |
| Peeling & Solution (Power Solutions) | 7 |
| Bio-Meso (PDRN) | 7 |
| Creams | 19 |
| Mist | 1 |
| Enzyme Peeling | 1 |
| Cushion | 7 |
| SNOWCELL Treatment | 1 |
| Eyecell Treatment | 4 |
| NDCell Treatment (Neck & Decollete) | 1 |
| HR³ Matrix (Hair Regrowth) | 10 |
| Automatic Needling Device (Needle Pen-K) | 2 |

## HS customs codes used (USD sheet)

| HS Code | Items | Product type |
|---|---|---|
| `3304.99.1000` | 71 | Cosmetics (creams, serums, masks, solutions, cleansers) |
| `9018.90.9080` | 50 | Rollers / stamps / needling heads (medical instruments) |
| `9019.10.2000` | 3 | Needle Pen-K, cartridges, hairstamp (massage/therapy apparatus) |
| `8516.32.0000` | 1 | HAIRGEN BOOSTER (electrothermic hair appliance) |
| (blank) | 3 | Accessory items: BB-cushion puff set, HR³ scalp brush, etc. |

## Normalized CSV columns

`sheet, category, itemCode, barcode, labeling, hsCode, description, shortCode, packSize, unit, priceUSD, notes`

- **labeling** — only present on the USD roller/stamp lines (e.g. `FB025SR`).
- **shortCode** — the GENOSYS internal abbreviation (e.g. `SOC`, `PEA`, `MFS Serum`, needle size for rollers).
- **priceUSD** — numeric for products; the LED device keeps its tiered string `630 (1-4u) / 580 (5-9u) / 525 (10u+)`.

## Source notes / data-quality flags

- Variant rows with a blank product-name cell inherit the previous product name (e.g. 500ml / 1000ml size variants), while keeping their own pack size and price.
- **GCMA06** (Intensive Repair Collagen Mask) has **no barcode** in the source; min order 300pcs, excluded from FOC.
- Source spellings preserved where meaningful (e.g. `SEA ALAGE`, `Blemish Blalm Cream`, `Foled`).
- **GENO-LED IR II (GMPS05)** uses tiered PO pricing: $630 (1–4 units) / $580 (5–9) / $525 (10+).
- Marketing-material "starter kit" sachets carry the note: orders for starter kits can't exceed 20% of whole order value; several are exempt from FOC grant.
- The `Amount`/`Order Qty.` columns in the source reflect a sample/working order and were **not** ingested (they are order-specific, not catalogue data).

## How to regenerate

```bash
cd ~/cosmetics-website
python3 scripts/ingest_genosys_export_orderform_codes_2026.py
```
