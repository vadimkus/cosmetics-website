# HS Code Summary Sheet — DM GME 260616 — 2026-07-02

**Request:** CP WORLD (Karthik) — split **weight** and **value** across 3 HS codes for customs declaration **1010113202326**.

**Source folder:** `/Users/vadimkus/Desktop/26062026/`  
**Output file:** `/Users/vadimkus/Desktop/26062026/HS CODE SUMMERY SHEET  - 2 (1).xlsx`  
**Normalized CSV:** `docs/DM_GME_260616_HS_CODE_Summary_normalized.csv`

## How value and weight are differentiated

### Value (from shipping invoice)

**Source:** `DM GME 260616_Shipping Invoice.pdf` → `docs/DM_GME_260616_Shipping_Invoice_normalized.csv`

Each invoice line is assigned to one HS code by product type:

| HS code | Category | Invoice item codes | Rule |
|---|---|---|---|
| **3304.99.1000** | Skincare Cosmetics | All cosmetic SKUs (cleansers, toners, masks, ampoules, creams, cushion, samples, bags, shampoo, etc.) | Default category |
| **9019.10.2000** | Roller | `GRFS150` (Manual Detachable Roller 1.5mm), `GRME025` (Eye Roller) | Microneedle roller apparatus |
| **8516.32.0000** | Hairgen booster | `GAHR01` (Hairgen Booster LED), `CCVS03` (Hairstamp for Hairgen) | Electrothermic hair device + dedicated stamp |

**Value = sum of invoice line amounts (USD) per HS code.**

### Weight (from packing list)

**Source:** `DM GME 260616_Packing list.pdf` — **23 cartons, 324.36 kg gross total**

Method:
1. Map each packing-list product description to invoice item code.
2. For **single-product cartons** → full carton weight goes to that product's HS code.
3. For **mixed cartons** (e.g. carton 3, 6, 8, 9, 10, 12, 14, 16, 20, 23) → allocate carton gross weight **pro-rata by quantity** (pieces/boxes) within the carton.
4. Roll up allocated kg by HS code.

This is standard customs practice when the packing list does not show per-HS-code weights separately.

## Summary (populated in Excel)

| S No. | HS code | Description | Origin | Gross Weight (kg) | Value (USD) | Quantity |
|---:|---|---|---|---:|---:|---:|
| 1 | 3304.99.1000 | Skincare Cosmetics | Republic of Korea | **303.97** | **13,698.80** | **1,573** |
| 2 | 9019.10.2000 | Roller | Republic of Korea | **12.83** | **180.00** | **25** |
| 3 | 8516.32.0000 | Hairgen booster | Republic of Korea | **7.56** | **1,220.00** | **20** |
| | | **TOTAL** | | **324.36** | **15,098.80** | **1,618** |

**Invoice number on sheet:** `DM GME 260616`

### Value check

- Invoice total: **USD 15,098.80** ✓
- HS split: 13,698.80 + 180.00 + 1,220.00 = **15,098.80** ✓

### Weight check

- Packing list total: **324.36 kg** ✓
- HS split: 303.97 + 12.83 + 7.56 = **324.36 kg** ✓

### Quantity note

Quantity = sum of invoice qty per HS code (mixed units: Pcs, Box, Unit, Pouch as on invoice). Total **1,618** matches packing list total units.

## Line-level detail for Karthik

### 9019.10.2000 — Roller (USD 180.00 / 12.83 kg)

| Code | Product | Qty | Unit | USD |
|---|---|---:|---|---:|
| GRFS150 | Manual Detachable Roller 1.5mm | 5 | Box | 40.00 |
| GRME025 | Eye Roller | 20 | Box | 140.00 |

### 8516.32.0000 — Hairgen booster (USD 1,220.00 / 7.56 kg)

| Code | Product | Qty | Unit | USD |
|---|---|---:|---|---:|
| GAHR01 | Hairgen Booster (LED Lamp) | 5 | Unit | 800.00 |
| CCVS03 | Hairstamp for Hairgen Booster | 15 | Box | 420.00 |

### 3304.99.1000 — Skincare Cosmetics (USD 13,698.80 / 303.97 kg)

All remaining **34 invoice lines** — see `docs/DM_GME_260616_Shipping_Invoice_normalized.csv` excluding GRFS150, GRME025, GAHR01, CCVS03.

## Cross-references

- Folder ingest: [SESSION_CHANGES_2026-06-26_DESKTOP_26062026_FOLDER_INGEST.md](./SESSION_CHANGES_2026-06-26_DESKTOP_26062026_FOLDER_INGEST.md)
- Shipping invoice CSV: `docs/DM_GME_260616_Shipping_Invoice_normalized.csv`
- HS codes master: [SESSION_CHANGES_2026-06-16_GENOSYS_EXPORT_ORDERFORM_CODES_INGEST.md](./SESSION_CHANGES_2026-06-16_GENOSYS_EXPORT_ORDERFORM_CODES_INGEST.md)

## Reply text for CP WORLD (optional)

> Value split is from shipping invoice DM GME 260616 (USD 15,098.80 total).  
> Weight split is from packing list (324.36 kg total) — each carton's gross weight allocated to products inside, then grouped by HS code.  
> Rollers GRFS150 + GRME025 → 9019.10.2000. Hairgen GAHR01 + CCVS03 → 8516.32.0000. All other lines → 3304.99.1000.  
> HS summary sheet attached with 3 rows + totals.
