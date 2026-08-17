# GENOSYS UAE Price List Clinics 2026 — July Folder Ingest

**Date ingested:** 2026-07-13
**Source folder:** `/Users/vadimkus/Desktop/Drive/Genosys/Price_list/2026/July/`
**Excel:** `GENOSYS_UAE_PriceList_Clinics_2026.xlsx`
**PDF:** `GENOSYS_UAE_PriceList_Clinics_2026.pdf`
**Prior ingest:** `docs/SESSION_CHANGES_2026-06-09_GENOSYS_UAE_PRICELIST_CLINICS_INGEST.md`
**Normalized CSV (unchanged):** `docs/GENOSYS_UAE_PriceList_Clinics_2026_normalized.csv`

## Summary

- Both July files ingested and cross-checked against the existing June 2026 ingest.
- **July Excel and PDF are byte-identical to the June copies** (same MD5 `e59216352bbbe5408a818e1cf861107b`; file timestamps 2026-06-09 15:13).
- Full extraction from July Excel: **100 priced line items**, **25 categories**, AED **10–5500**, one **N/A** line (`NEEDLE PEN-K NEEDLE CARTRIDGE (10 PCS)`).
- No product additions, removals, or price changes vs the normalized CSV already in the repo.
- Workbook sheet tab still named `Genosys UAE Price list 2024`; document title `Price List Clinics: 2026 United Arab Emirates`.
- PDF: **5 pages** (compact export); premium v2 PDF from June ingest remains the recommended customer-facing version.
- Embedded product images in column D: **123** anchors (100 product rows mapped in prior workflow).

## Minor source quirks (unchanged)

- Category header has double space: `GENOSYS  Peeling & Power Solution`
- EZ CO₂ MASK quantity cell contains a line break between tube and sheet specs
- `SOOTHING REPAIR POSTCREAM` professional 100g has blank unit cell; price 220 AED
- `CUSHION: BIEGE` spelling preserved from source

## Excel update — Bio Meso + roller merge (2026-07-13)

**Backup:** `GENOSYS_UAE_PriceList_Clinics_2026.before_20260713_bio_meso_roller_merge.xlsx` (same July folder)

### Bio Meso rows populated (2026-07-13, user-edited workbook)

User reserved two merged product blocks (prices pre-filled) between rollers and masks:

| Row | Product | Description | Spec | Unit | Clinic AED |
|---:|---|---|---|---|---:|
| 27 | BIO-MESO PDRN Homecare Ampoule 5000 | Homecare BIO-MESO™ PDRN ampoule for maintenance between professional treatments | 50ml | Pcs | **150** |
| 29 | BIO-MESO PDRN Expert Ampoule 60000 | Expert bio-meso treatment ampoule · professional / clinic use only | 3ml x 4 ampoules | Box | **300** |

- Section header **R26** set to `GENOSYS Bio Meso PDRN`
- Expert line unit corrected from `Pcs` → `Box`
- Product photos added in column D from website assets
- **Normalized CSV refreshed:** 99 priced lines

### Merged — Standard/Narrow roller pairs (same price)

| Before (2 lines) | After (1 line) | AED |
|---|---|---:|
| Standard + Narrow Detachable Manual Roller | Detachable Manual Roller — Standard or Narrow · Needle length 0.25–2.00mm | 115 |
| Standard + Narrow Manual Roller | Manual Roller — Standard or Narrow · Needle length 0.25–2.00mm | 105 |

Vibrating roller replacement heads kept as 2 lines (200 vs 205 AED).

### Count

- **Before:** 100 priced lines
- **After:** 100 priced lines (+2 Bio Meso, −2 narrow rollers = net 0)
- **Script:** `scripts/update-pricelist-bio-meso-20260713.py` (unmerge-safe edit)
- **Normalized CSV updated:** `docs/GENOSYS_UAE_PriceList_Clinics_2026_normalized.csv`

### CERABARRIER — GENOSYS Cosmetics block (2026-07-13)

User reserved two merged rows under **GENOSYS Cosmetics** (before Bio Meso). Filled in place — no row insert/delete.

| Row | Product | Description | Spec | Unit | Clinic AED |
|---:|---|---|---|---|---:|
| 21 | CERABARRIER BIOME GEL CLEANSER | Daily biome gel cleanser / Personal use | 200ml | Pcs | **190** |
| 23 | (same product name) | Professional biome gel cleanser | 600ml | Pcs | **310** |

- MoySklad: 54484 (GCCL05) / 54485 (GCCL06)
- Photos: `cerabar_200ml.jpeg`, `cerabar_600ml.jpeg`
- **Script:** `scripts/fill-pricelist-cerabarrier-cosmetics-20260713.py`
- **Normalized CSV:** **100 priced lines**

### CERABARRIER cleanser lines — reverted (2026-07-13)

Earlier attempt inserted Cerabarrier in the **GENOSYS CLEANSER** section (after SNOW O₂) — **reverted** on user request. Current placement is the Cosmetics block above Bio Meso only.

- **Revert script:** `scripts/revert-pricelist-cerabarrier-20260713.py`

### Next

- Rebuild premium PDF: `python3 scripts/build_genosys_pricelist_pdf.py` (update `SOURCE_XLSX` path to July folder first)
- Re-extract whitened thumbnails if PDF photos needed: `scripts/extract_and_whiten_images.py`
