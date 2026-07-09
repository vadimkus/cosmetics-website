# First Person Marina — June 2026 consignment sold (2026-07-02)

**Customer:** First Person Ladies Salon (Marina) (`af21a79a-63cd-11ea-0a80-02b2000e2aeb`)  
**Agreement:** **00024** (`56ca0166-c388-11eb-0a80-093a001d1ee0`)  
**Period:** June 2026  
**Script:** `scripts/moysklad-create-persona-marina-commission-demand-20260702.js --commit`

## Posted

| | |
|--|--|
| **Report** | **01391** |
| **Demand** | **06450** |
| **Sum** | **590.00 AED** (amended 2026-07-02 — was 3,033 / 17 lines) |
| **Lines / pcs** | 17 / 25 |

- [Report 01391](https://online.moysklad.ru/app/#commissionreport/edit?id=d0da86e5-75dd-11f1-0a80-01340035511f)
- [Demand 06450](https://online.moysklad.ru/app/#demand/edit?id=d217daf2-75dd-11f1-0a80-0ecd0037009d)

## PDFs (`~/Desktop/orders/`)

| Doc | File |
|-----|------|
| Consignment sales | `GENOSYS_Persona_Marina_Consignment_Sales_01391.pdf` |
| Stock note (demand) | `GENOSYS_Persona_Marina_Consignment_Stock_Note_06450.pdf` |

## Demand 06450 — amended (2026-07-02)

User correction: replenishment is **3 lines only** (not the full June sold list).

| Code | Product | Qty | Unit AED |
|------|---------|----:|---------:|
| `00145` | Problem Control Toner 200ml | 1 | 130.00 |
| `00041` | Multi Sun Cream SPF40 40g | 2 | 105.00 |
| `54457` | Ultra Shield Sun Cream SPF50 50g | 2 | 125.00 |
| **Total** | | **5 pcs** | **590.00** |

Script: `scripts/moysklad-fix-persona-marina-demand-06450-20260702.js --commit`  
Stock note PDF refreshed: `GENOSYS_Persona_Marina_Consignment_Stock_Note_06450.pdf`

**Note:** Report **01391** stays as the original June sold list (17 lines / 3,033 AED). Demand **06450** corrected separately — user confirmed report unchanged.

## Report 01391 — original June sold lines (unchanged)

| Code | Product | Qty | Unit AED |
|------|---------|----:|---------:|
| `00041` | Multi Sun Cream SPF40 40g | 1 | 105.00 |
| `00063` | Intensive Repair Collagen Mask 23g | 2 | 18.00 |
| `54457` | Ultra Shield Sun Cream SPF50 50g | 1 | 125.00 |
| `00129` | EPI Turnover Boosting Peeling Gel 100g | 1 | 125.00 |
| `00055` | EyeCell Eye Contour Cream 20ml | 1 | 185.00 |
| `54467` | Skin Reboot PDRN Mask Pack | 3 | 200.00 |
| `00040` | Intensive Blemish Balm Cream 50g | 1 | 125.00 |
| `00051` | HR³ Matrix Hair Tonic 70ml | 2 | 145.00 |
| `00022` | Snow Booster Toner 200ml | 2 | 130.00 |
| `54464` | Skin Caring Blemish Balm Cushion #3 Camel | 1 | 150.00 |
| `00052` | HR³ Matrix Scalp & Hair Shampoo 300ml | 2 | 170.00 |
| `00044` | ND Cell Neck & Décolleté Cream 50g | 1 | 185.00 |
| `00012` | Peptide Gel Mask 39g | 2 | 38.00 |
| `00188` | Microbiome Energy Infusing Mist 80ml | 1 | 80.00 |
| `00021` | Snow O₂ Cleanser 180ml | 1 | 165.00 |
| `00140` | Soothing Bomb Sea Algae Mask 23g | 2 | 18.00 |
| `00144` | Skin Caring Blemish Balm Cushion #2 Beige | 1 | 150.00 |

**Mappings:** Matrix tonic → `00051`; ND anti wrinkle cream → `00044` ND Cell; EyeCell cream → `00055`.

## Run

```bash
cd /Users/vadimkus/cosmetics-website
node --import dotenv/config scripts/moysklad-create-persona-marina-commission-demand-20260702.js --commit
```
