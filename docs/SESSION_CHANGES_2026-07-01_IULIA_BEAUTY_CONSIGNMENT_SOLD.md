# IULIA Beauty Salon — consignment sold report + demand (2026-07-01)

**Customer:** IULIA BEAUTY SALON LLC (`96500719-c90e-11f0-0a80-19c8002d2932`)  
**Agreement:** **28** (`f2dad83f-c91f-11f0-0a80-09d3003136c5`) — City Walk  
**Script:** `scripts/moysklad-create-iulia-beauty-commission-demand-20260701.js --commit`  
**All lines:** retail sizes (clinic list / salePrice, VAT incl.)

## Posted

| | |
|--|--|
| **Report** | **01390** |
| **Demand** | **06447** |
| **Sum** | **2,572.00 AED** |
| **Lines / pcs** | 17 / 25 |

- [Report 01390](https://online.moysklad.ru/app/#commissionreport/edit?id=d2ae01ef-756f-11f1-0a80-1f1c0027635b)
- [Demand 06447](https://online.moysklad.ru/app/#demand/edit?id=d367d070-756f-11f1-0a80-0ffa002739ff)

## PDFs (`~/Desktop/orders/`)

| Doc | File |
|-----|------|
| Consignment sales | `GENOSYS_IULIA_Beauty_Consignment_Sales_01390.pdf` |
| Stock note (demand) | `GENOSYS_IULIA_Beauty_Consignment_Stock_Note_06447.pdf` |

## Lines

| Code | Product | Qty | Unit AED |
|------|---------|----:|---------:|
| `00031` | Intensive Hydro Soothing Cream 50g | 1 | 145.00 |
| `00194` | Multi Vita Radiance Serum 30ml | 1 | 165.00 |
| `00189` | Skin Rescue Overnight Cream Mask 100g | 1 | 170.00 |
| `00021` | Snow O₂ Cleanser 180ml | 1 | 165.00 |
| `00041` | Multi Sun Cream SPF40/PA++ 40g | 1 | 105.00 |
| `00054` | EyeCell Eye Contour Serum 10ml | 1 | 185.00 |
| `00191` | Multi Functional Anti-Wrinkle Serum 30ml | 1 | 165.00 |
| `00063` | Intensive Repair Collagen Mask 23g | 3 | 18.00 |
| `00143` | Skin Caring Blemish Balm Cushion #1 Ivory | 1 | 150.00 |
| `54457` | Ultra Shield Sun Cream SPF50/PA++++ 50g | 1 | 125.00 |
| `00030` | All For Sensitive Serum 30ml | 2 | 165.00 |
| `00122` | Multi Vita Radiance Cream 50g | 2 | 145.00 |
| `00188` | Microbiome Energy Infusing Mist 80ml | 1 | 80.00 |
| `00012` | Peptide Gel Mask 39g | 2 | 38.00 |
| `00052` | HR³ Matrix Scalp & Hair Shampoo 300ml | 1 | 170.00 |
| `00140` | Soothing Bomb Sea Algae Mask 23g | 4 | 18.00 |
| `00040` | Intensive Blemish Balm Cream 50g | 1 | 125.00 |

## Run

```bash
cd /Users/vadimkus/cosmetics-website
node --import dotenv/config scripts/moysklad-create-iulia-beauty-commission-demand-20260701.js
node --import dotenv/config scripts/moysklad-create-iulia-beauty-commission-demand-20260701.js --commit
```
