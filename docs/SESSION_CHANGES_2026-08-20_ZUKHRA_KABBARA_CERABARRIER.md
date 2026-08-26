# Miss Zukhra Kabbara — CERABARRIER + pic items clinic (2026-08-20)

**Customer:** Miss Zukhra Kabbara · +971 50 560 3505  
**Address:** Al Salam Tower, office 36th floor, Metropolitan, Dubai  
**Agent:** `a9077506-505d-11f1-0a80-0fd30010b5cb`

| Doc | Number | Amount |
|-----|--------|-------:|
| SO | **GENCardM2608203505** | **705** |
| INV | **04953** | **705** |
| SHIP | **06713** | **705** |
| PAY | **06100** | **705** |

**Status:** **Доставлен**. Paid. Invoice-only shipment.

Opened with CERABARRIER 200ml only (190). Then added the other three items from the product pic.

| Code | Product | Qty | Clinic AED |
|------|---------|----:|----------:|
| 54484 | CERABARRIER Biome Gel Cleanser 200ml | 1 | 190 |
| 00055 | EyeCell Eye Contour Cream 20ml | 1 | 185 |
| 00037 | Skin Barrier Protecting Cream 100g | 1 | 225 |
| 00041 | Multi Sun Cream SPF40/PA++ 40g | 1 | 105 |
| — | Delivery Dubai | 1 | free |
| | | | **705** |

PDF: `~/Desktop/orders/GENOSYS_Miss_Zukhra_Kabbara_04953.pdf` (not printed)

**Address duplicate on invoice:** Legal_TAX concatenates `city + street + addInfo`. Her card still had the old full line in `addInfo`, so the street printed twice. Cleared `addInfo`. Invoice reissued.

Scripts:
- `scripts/moysklad-create-zukhra-kabbara-cerabarrier-20260820.js --commit`
- `scripts/moysklad-amend-zukhra-04953-pic-items-20260820.js --commit`
- `scripts/moysklad-fix-zukhra-04953-address-dup-20260820.js --commit`
- `scripts/moysklad-create-zukhra-kabbara-paymentin-04953-20260820.js --commit`
