# Korea export orderform — clean rebuild from scratch (2026-07-08)

**File:** `~/Desktop/DTSMG_Export Orderform-2026_USD.xlsx` (tab **USD**, col **Order Qty.** K)  
**Backup:** `DTSMG_Export Orderform-2026_USD.before_korea_reorder_20260708_191115.xlsx`  
**Script:** `scripts/populate-korea-export-orderform-20260708.py`  
**Data:** Fresh MoySklad restock `docs/MOYSKLAD_RESTOCK_2026-07-08.txt` (19:10) + season buffers from `SESSION_CHANGES_2026-07-07_KOREA_REORDER_DOUBLECHECK.md`

**Action:** Cleared **all** prior Order Qty. cells; rebuilt **15 lines only** from live stock analysis.

## Korea PO — 15 lines (~$12,189 USD)

| Tier | Korea | MoySklad | Product | Qty | Unit |
|------|-------|----------|---------|----:|------|
| A | GCMR02 | 54461 | Makeup Remover 200ml | 50 | pcs |
| A | GCMA14 | 54467 | PDRN Mask Pack | 250 | pcs |
| A | GCCR37 | 54457 | Ultra Shield SPF50 | 230 | pcs |
| A | GCPS02 | 00020 | SWS Power Solution | 36 | boxes (360 vials) |
| B | GCFO03 | 54464 | Cushion #3 Camel | 110 | boxes |
| B | GCCR44 | 00035 | Problem Control Cream | 50 | pcs |
| B | GCSE17 | 00195 | Hyaluron Serum | 60 | pcs |
| B | GCCR07 | 00038 | Post Cream 20g | 7 | boxes (84 vials) |
| C | GCMA10 | 00140 | Sea Algae Mask | 15 | boxes (150 sheets) |
| C | GCFO02 | 00144 | Cushion #2 Beige | 100 | boxes |
| C | GCCR09 | 00041 | Multi Sun SPF40 | 40 | pcs |
| C | GCPS05 | 00069 | CTS Power Solution | 16 | boxes (160 vials) |
| C | GCCR47 | 54473 | Revita BB Natural | 40 | pcs |
| C | GCCR46 | 54472 | Revita BB Bright | 20 | pcs |
| C | GCCR23 | 00037 | Barrier Cream | 15 | pcs |

## Explicitly NOT on order

| Reason | Items |
|--------|--------|
| User preference | 54462 Holiday Kit #2 |
| 140+ days cover | Peptide mask, collagen mask, eye patch, microbiome mist, hair tonic, Snow cleanser/toner |
| Slow / launch stock | 54475 PDRN Homecare, 54484 Cerabarrier, 54470 PDRN Expert |
| Discontinued | 00042 EGF Oxymask |
| Old sheet noise removed | Snow cleanser/toner, PCT toner, SRS, powder mask, AFS serum, Postcream 100g jar, Eye Cell kit, HR3 brush, collagen sheets ×500 |

## PO pipeline

Nothing in transit. Order this week → ~mid-Aug landing.
