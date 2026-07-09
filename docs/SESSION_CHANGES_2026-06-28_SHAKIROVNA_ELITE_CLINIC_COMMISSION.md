# Shakirovna Elite + Esthetic Clinic — Commissioner Reports (07.06–27.06.2026)

**Date:** 2026-06-28 (UAE)  
**Site:** Business Bay — consignment sales spreadsheet **07.06.2026–27.06.2026**

## Posted Documents

| Customer | Contract | Report | Demand | Sum (AED) | Lines | Pcs |
|----------|----------|--------|--------|----------:|------:|----:|
| ELITE SHAKIROVNA LADIES SALON L.L.C | **21** | **01383** | **06428** | **1,367.00** | 8 | 18 |
| SHAKIROVNA ESTHETIC CLINIC L.L.C | **26** | **01384** | **06429** | **340.00** | 2 | 2 |
| **Total** | | | | **1,707.00** | 10 | 20 |

- [Report 01383 Elite](https://online.moysklad.ru/app/#commissionreport/edit?id=941e5d8c-7320-11f1-0a80-17870065299d)
- [Demand 06428 Elite](https://online.moysklad.ru/app/#demand/edit?id=94ddb79c-7320-11f1-0a80-0c520062a228)
- [Report 01384 Clinic](https://online.moysklad.ru/app/#commissionreport/edit?id=959a035e-7320-11f1-0a80-178700652c4d)
- [Demand 06429 Clinic](https://online.moysklad.ru/app/#demand/edit?id=960f2e30-7320-11f1-0a80-178700652c5b)

**Period:** `2026-06-07 00:00:00` → `2026-06-27 23:59:59`

Report and demand lines/prices verified match before post.

## PDFs (Desktop/orders)

| Site | Sales (report) | Stock note (demand) |
|------|----------------|---------------------|
| Elite Salon | `GENOSYS_Shakirovna_Elite_Salon_Consignment_Sales_01383.pdf` | `GENOSYS_Shakirovna_Elite_Salon_Consignment_Stock_Note_06428.pdf` |
| Esthetic Clinic | `GENOSYS_Shakirovna_Esthetic_Clinic_Consignment_Sales_01384.pdf` | `GENOSYS_Shakirovna_Esthetic_Clinic_Consignment_Stock_Note_06429.pdf` |

All under `~/Desktop/orders/`. Sales template: **Invoice_Consignment_Sales_Genosys**; stock note template: **Consignment Stock Note**.

Script: `scripts/moysklad-export-shakirovna-elite-clinic-commission-pdfs-20260628.js` (refreshed 2026-07-01)

## Elite Salon Lines (01383 / 06428)

| Code | Product | Qty | Unit AED |
|------|---------|----:|---------:|
| `54473` | Revita Glow BB Cream #02 Natural 50g | 2 | 125.00 |
| `00012` | Peptide Gel Mask 39g | 1 | 38.00 |
| `00129` | EPI Turnover Boosting Peeling Gel 100g | 1 | 125.00 |
| `00144` | Skin Caring Blemish Balm Cushion #2 Beige | 2 | 150.00 |
| `00041` | Multi Sun Cream SPF40 40g | 2 | 105.00 |
| `00140` | Soothing Bomb Sea Algae Mask 23g | 3 | 18.00 |
| `00063` | Intensive Repair Collagen Mask 23g | 5 | 18.00 |
| `54464` | Skin Caring Blemish Balm Cushion #3 Camel | 2 | 150.00 |

## Clinic Lines (01384 / 06429)

| Code | Product | Qty | Unit AED |
|------|---------|----:|---------:|
| `00144` | Skin Caring Blemish Balm Cushion #2 Beige | 1 | 150.00 |
| `00053` | EyeCell Eye Peptide Gel Patch (box) | 1 | 190.00 |

## Script

`scripts/moysklad-create-shakirovna-elite-clinic-commission-20260628.js`

```bash
node --import dotenv/config scripts/moysklad-create-shakirovna-elite-clinic-commission-20260628.js --commit
```

## Related

- Prior batch: reports **01374** / **01375** (11.05–07.06.2026) — `docs/SESSION_CHANGES_2026-06-07_SHAKIROVNA_ELITE_CLINIC_COMMISSION.md`
