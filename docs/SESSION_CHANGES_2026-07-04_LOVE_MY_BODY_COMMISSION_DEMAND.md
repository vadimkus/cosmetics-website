# Love My Body Salon — June 2026 consignment sold (2026-07-04)

**Customer:** LOVE MY BODY LADIES SPA CLUB L.L.C (`9c78fe86-be3b-11f0-0a80-007f0036b570`)  
**Agreement:** **27** (`aaee7975-be3b-11f0-0a80-173e00383194`)  
**Period:** 2026-06-01 → 2026-06-30  
**Script:** `scripts/moysklad-create-love-my-body-commission-demand-20260704.js --commit`

Report and demand use **same lines and quantities** (not 2× demand).

## Posted

| Type | Number | Sum | Units | Lines |
|------|--------|----:|------:|------:|
| Отчет комиссионера | **01400** | **2,660.00 AED** | 27 | 13 |
| Отгрузка | **06474** | **2,640.00 AED** | 27 | 13 |

**Amended 2026-07-05:** Consignment note only — shipped **SPF 40** (`00041`) ×1, not SPF 50. **Sales report 01400 stays SPF 50 sold** (`54457`). Script: `scripts/moysklad-fix-love-my-body-report-spf50-demand-spf40-20260705.js --commit`

- [Report 01400](https://online.moysklad.ru/app/#commissionreport/edit?id=f71a7d09-77cd-11f1-0a80-1c6d0044629f)
- [Demand 06474](https://online.moysklad.ru/app/#demand/edit?id=f781359f-77cd-11f1-0a80-1a6900452413)

## PDFs (`~/Desktop/orders/`)

| Doc | File |
|-----|------|
| Consignment sales | `GENOSYS_Love_My_Body_Consignment_Sales_01400.pdf` |
| Stock note | `GENOSYS_Love_My_Body_Consignment_Stock_Note_06474.pdf` |

## Lines @ clinic list (VAT incl.)

| Code | Product | Qty | Unit AED | Line AED |
|------|---------|----:|---------:|---------:|
| `54457` | Ultra Shield Sun Cream SPF50 50g | 1 | 125.00 | 125.00 |
| `00144` | Skin Caring Blemish Balm Cushion #2 Beige | 1 | 150.00 | 150.00 |
| `00140` | Soothing Bomb Sea Algae Mask 23g | 3 | 18.00 | 54.00 |
| `00063` | Intensive Repair Collagen Mask 23g | 2 | 18.00 | 36.00 |
| `00012` | Peptide Gel Mask 39g | 10 | 38.00 | 380.00 |
| `54458` | Moisture Replenishing Hyaluron Cream 50g | 2 | 145.00 | 290.00 |
| `00195` | Moisture Replenishing Hyaluron Serum 30ml | 2 | 165.00 | 330.00 |
| `00189` | Skin Rescue Overnight Cream Mask 100g | 1 | 170.00 | 170.00 |
| `00188` | Microbiome Mist 80ml | 1 | 80.00 | 80.00 |
| `00037` | Skin Barrier Protecting Cream 100g | 1 | 225.00 | 225.00 |
| `00059` | EyeCell Eye Zone Care Kit (box) | 1 | 490.00 | 490.00 |
| `54461` | Skin Defender Lip & Eye Makeup Remover 200ml | 1 | 145.00 | 145.00 |
| `00054` | EyeCell Eye Contour Serum 10ml | 1 | 185.00 | 185.00 |
| | **TOTAL** | **27** | | **2,660.00** |

## Consignment note 06474 — SPF line only

| Code | Product | Qty | Unit AED | Line AED |
|------|---------|----:|---------:|---------:|
| `00041` | Multi Sun Cream SPF40/PA++ 40g | 1 | 105.00 | 105.00 |

*(All other lines match report 01400; demand total **2,640.00 AED** because SPF40 shipped instead of SPF50.)*
