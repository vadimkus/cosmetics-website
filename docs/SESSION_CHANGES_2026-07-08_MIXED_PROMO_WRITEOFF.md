# Mixed warehouse write-off — roller, masks, PDRN, SWS, SRS

**Date:** 2026-07-08  
**Type:** MoySklad `Списание` @ **buyPrice**

## Lines

| Code | Product | Qty | buyPrice | Line |
|------|---------|-----|----------|------|
| 00001 | Standard Detachable Manual Roller 0.25mm | 1 | 31.90 | 31.90 |
| 54466 | Bio-Ferment Age Defying Powder Mask 300g | 1 | 34.00 | 34.00 |
| 54470 | BIO-MESO PDRN Expert Ampoule 60000 | 3 | 84.47 | 253.41 |
| 54475 | BIO-MESO PDRN Homecare Ampoule 5000 | 1 | 34.15 | 34.15 |
| 00012 | Peptide Gel Mask 39g | 10 | 10.06 | 100.60 |
| 00020 | Power Solution SWS 1 Vial 2ml | 10 | 8.22 | 82.20 |
| 00015 | SRS 1 Vial 2ml | 20 | 13.40 | 268.00 |

**Total:** 804.26 AED | 46 pcs

## Document

| Ref | Amount (AED) |
|-----|--------------|
| **00008-00465** | 804.26 |

ID: `48bff9ea-7a7c-11f1-0a80-114f000ae73a`

## SKU mapping notes

- Roller 0.25mm → `00001` (not stamp `00074`)
- PDRN 60000 → `54470` Expert ampoule box
- PDRN 5000 → `54475` homecare ampoule
- SWS → loose vials `00020` (not box `00019`)
- SRS → vials `00015`

## Script

`scripts/moysklad-create-mixed-promo-writeoff-20260708.js`
