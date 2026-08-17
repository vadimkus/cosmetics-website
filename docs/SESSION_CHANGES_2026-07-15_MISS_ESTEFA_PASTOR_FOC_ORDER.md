# Session: Miss Estefa Pastor — FOC Bio-Meso 5000 + collagen masks (on existing order)

**Date:** 2026-07-15  
**Counterparty:** Miss Estefa Pastor (`f2fa9b0a-13f0-11f1-0a80-036d0022f88f`) · **+971559976917**  
**Address (MS):** Two Towers B 2103 Tecom, Dubai  

## Order chain (amended existing website order)

| Doc | № | Sum | Link |
|-----|---|-----|------|
| Customer order | **GENCardM2607155574** | **320.00 AED** | https://online.moysklad.ru/app/#customerorder/edit?id=2e351945-801c-11f1-0a80-1c840036dd67 |
| Invoice | **04822** | **320.00 AED** | https://online.moysklad.ru/app/#invoiceout/edit?id=2e70c9fd-801c-11f1-0a80-0b9900361ef0 |
| Shipment | **06545** | **320.00 AED** | https://online.moysklad.ru/app/#demand/edit?id=2ee5ca08-801c-11f1-0a80-0c9c0037cc3b |
| Payment | **05941** | **320.00 AED** | (unchanged) |

**PDF:** `~/Desktop/orders/GENOSYS_Miss_Estefa_Pastor_04822.pdf`  
**Marker:** `MISS-ESTEFA-FOC-PDRN-COLLAGEN-2026-07-15`

## All lines

| Item | Code | Qty | Price | Discount | Line total |
|------|------|-----|-------|----------|------------|
| Soothing Bomb Sea Algae Mask 23g | 00140 | 5 | 18 | — | 90 |
| Multi Vita Radiance Serum 30ml | 00054 | 1 | 185 | — | 185 |
| Excellent Delivery Dubai | 00089 | 1 | 45 | — | 45 |
| **Genosys BIO-MESO PDRN Homecare Ampoule 5000** | **54475** | **1** | **150** (clinic) | **100%** | **0** |
| **Genosys Intensive Repair Collagen Mask 23g** | **00063** | **5** | **18** (clinic) | **100%** | **0** |
| | | | | **Total** | **320.00** |

## Correction

Initially a separate zero-AED chain was created by mistake (**GENCardM2607156917** / inv **04823** / ship **06546**). Removed; FOC lines added to the existing delivered order from the screenshot instead.

## Script

- `scripts/moysklad-amend-miss-estefa-pastor-add-foc-lines-20260715.js`
- `scripts/moysklad-fix-miss-estefa-pastor-foc-clinic-price-20260715.js` — corrected FOC list from retail (300/36) to clinic (150/18); paid total unchanged.
