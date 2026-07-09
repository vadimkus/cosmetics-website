# MoySklad product names — Genosys prefix normalization — 2026-06-18

**Task:** All active products should start with `Genosys` + product name (e.g. `Genosys BIO-MESO PDRN Homecare Ampoule 5000`). Delivery / Excellent Delivery left unchanged.

**Script:** `scripts/moysklad-rename-products-genosys-prefix.js --commit`

## Result

- **Scanned:** 154 active products  
- **Renamed:** 49  
- **Skipped:** Delivery Abu Dhabi, Al Ain, Sharjah, Fujairah, Fedex, EMS, RAK, Excellent Delivery Dubai, etc.

## Notable normalizations

| Code | Before | After |
|---|---|---|
| 54475 | (already OK) | Genosys BIO-MESO PDRN Homecare Ampoule 5000 |
| 00039 | SOOTHING REPAIR POSTCREAM Box | Genosys Soothing Repair Post Cream Box |
| 00014 | SKIN RENEWAL PEELING SYSTEM (SRS) Box | Genosys Skin Renewal Peeling System (SRS) Box |
| 00017–00070 | POWER SOLUTION * Box | Genosys Power Solution * Box |
| 00142 | GENOSYS HAIRGEN BOOSTER DEVICE | Genosys HairGen Booster Device |
| 00141 | HAIR STAMP for HAIRGEN BOOSTER | Genosys Hair Stamp for HairGen Booster (8pcs) |
| 00111 | Samples Snow 02 box | Genosys Samples Snow O₂ box |
| 00119/00120 | samples skin … | Genosys Samples Skin … (title case) |

## Re-run

Dry-run only: `node --import dotenv/config scripts/moysklad-rename-products-genosys-prefix.js`
