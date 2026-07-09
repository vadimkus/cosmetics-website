# TONETRENDZ — merge consignment demands into single shipment

**Date:** 2026-06-21  
**Customer:** TONETRENDZ LADIES COSMETIC & PERSONAL CARE CENTER L.L.C  
**Contract:** **36**  
**Script:** `scripts/moysklad-merge-tonetrendz-demands-06326-06394-20260621.js`

## Action

Merged **06326** (opening) + **06394** (replenishment) → **single shipment 06326**. **06394 deleted.**

| Field | Value |
|-------|-------|
| Surviving shipment | **06326** (`7b63d1d7-63dc-11f1-0a80-0d66001d1a9f`) |
| Total | **8,345.00 AED** |
| Lines | **24** |
| Units | **96 pcs** |

## Merged lines (from 06326 + 06394)

| Code | Product | Qty |
|------|---------|----:|
| `00012` | Peptide Gel Mask 39g | 5 |
| `00021` | Snow O₂ Cleanser 180ml | 3 |
| `00022` | Snow Booster Toner 200ml | 3 |
| `00031` | Intensive Hydro Soothing Cream 50g | 3 |
| `00040` | Intensive Blemish Balm Cream 50g | 2 |
| `00041` | Multi Sun Cream SPF40 40g | 3 |
| `00053` | EyeCell Eye Peptide Gel Patch (box) | 2 |
| `00063` | Collagen Mask 23g | 20 |
| `00122` | Multi-Vita Radiance Cream 50g | 2 |
| `00129` | EPI Peeling Gel 100g | 2 |
| `00140` | Sea Algae Mask 23g | 20 |
| `00143` | BB Cushion #1 Ivory | 2 |
| `00144` | BB Cushion #2 Beige | 4 |
| `00188` | Microbiome Mist 80ml | 4 |
| `00189` | Skin Rescue Overnight Cream Mask 100g | 2 |
| `00190` | Anti-Wrinkle Cream 50g | 2 |
| `00194` | Multi Vita Radiance Serum 30ml | 2 |
| `00195` | Hyaluron Serum 30ml | 2 |
| `54457` | Ultra Shield SPF50 50g | 2 |
| `54458` | Hyaluron Cream 50g | 2 |
| `54461` | Lip & Eye Makeup Remover 200ml | 2 |
| `54464` | BB Cushion #3 Camel | 3 |
| `54465` | Soothing Repair Post Cream 100g | 2 |
| `54467` | PDRN mask Pack | 2 |

## PDF

`/Users/vadimkus/Desktop/orders/GENOSYS_TONETRENDZ_06326_Consignment_Stock_Note.pdf` (regenerated after merge)

## Link

- [Shipment 06326](https://online.moysklad.ru/app/#demand/edit?id=7b63d1d7-63dc-11f1-0a80-0d66001d1a9f)

## Note

Former **06394** (`7341ace5-6d59-11f1-0a80-1511005c5ae1`) removed — consignment book unchanged net (same 96 pcs / 8,345 AED on one document).

## Update 2026-06-21 — hair / eye lines (+2,350 AED)

Added to **06326**: `00052`×2, `00055`×2, `00054`×2, `00051`×2, `00059`×2 → **10,695 AED** / **29 lines** / **106 pcs**. Script `moysklad-add-tonetrendz-consignment-lines-20260621.js`.

## Repair 2026-06-21 — MoySklad UI drift (physically delivered)

**Problem:** MoySklad showed **06326** at **7,375 AED / 21 lines / 86 pcs** while the consignment stock note PDF and physical delivery were **10,695 AED / 29 lines / 106 pcs**.

**Fix:** Rebuilt all positions from the full delivered list (unposted → cleared 21 lines → posted 29 lines → re-posted).

| Field | Before | After |
|-------|--------|-------|
| Total | 7,375.00 AED | **10,695.00 AED** |
| Lines | 21 | **29** |
| Units | 86 pcs | **106 pcs** |

**Script:** `scripts/moysklad-repair-tonetrendz-demand-06326-20260621.js --commit`

**PDFs regenerated:**
- `/Users/vadimkus/Desktop/Drive/Genosys/Contract_Customers/Toner_Trends/Genosys_Consignment_Stock_Note_06326_TONETRENDZ.pdf`
- `/Users/vadimkus/Desktop/orders/GENOSYS_TONETRENDZ_06326_Consignment_Stock_Note.pdf`
