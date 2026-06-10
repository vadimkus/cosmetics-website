# Love My Body — Commissioner Report Only (May 2026)

**Date:** 2026-06-02 (UAE)

## Customer / Contract

| Field | Value |
|--------|--------|
| Customer | **LOVE MY BODY LADIES SPA CLUB L.L.C** |
| Counterparty ID | `9c78fe86-be3b-11f0-0a80-007f0036b570` |
| Agreement | **27** — `aaee7975-be3b-11f0-0a80-173e00383194` |
| Commission period | **2026-05-01 → 2026-05-31** |

## Posted Documents

| Type | Number | Sum | Units | Lines | ID |
|------|--------|-----|-------|-------|-----|
| Отчет комиссионера | **01367** | **2,729.00 AED** | 28 | 15 | `4c0e3e04-5e2a-11f1-0a80-147f000cdc74` |
| Отгрузка (2× report) | **06266** | **9,460.00 AED** | 73 | 23 | `ceb46886-5e2b-11f1-0a80-17ad000c5991` |

- [Report 01367](https://online.moysklad.ru/app/#commissionreport/edit?id=4c0e3e04-5e2a-11f1-0a80-147f000cdc74)
- [Shipment 06266](https://online.moysklad.ru/app/#demand/edit?id=ceb46886-5e2b-11f1-0a80-17ad000c5991)

## Shipment add-on (same day, appended to 06266)

| Code | Product | Qty | Line AED |
|------|---------|----:|---------:|
| `00051` | HR³ Matrix Hair Tonic 70ml | 2 | 290.00 |
| `00052` | HR³ Matrix Shampoo 300ml | 2 | 340.00 |
| `00122` | Multi-Vita Radiance Cream 50g | 2 | 290.00 |
| `00022` | Snow Booster Toner 200ml | 2 | 260.00 |
| `00188` | Microbiome Mist 80ml | 3 | 240.00 |
| `00143` | BB Cushion Ivory | 2 | 300.00 |
| `00037` | Skin Barrier Protecting Cream 100g | 2 | 450.00 |
| `00145` | Problem Control Toner 200ml | 2 | 260.00 |

**Add-on:** +17 pcs / +2,430 AED → shipment total **9,460 AED** (23 lines).

Script: `scripts/moysklad-add-love-my-body-demand-lines-20260602.js`

## Shipment (2× report quantities)

All report 01367 lines doubled for replenishment:

| Code | Report qty | Shipment qty |
|------|----------:|-------------:|
| `00053` | 3 | **6** |
| `00012` | 7 | **14** |
| `00054` | 2 | **4** |
| `00063` | 2 | **4** |
| `00055` | 1 | **2** |
| `00031` | 1 | **2** |
| `54458` | 1 | **2** |
| `00144` | 1 | **2** |
| `00041` | 1 | **2** |
| `00140` | 4 | **8** |
| `54472` | 1 | **2** |
| `00195` | 1 | **2** |
| `54457` | 1 | **2** |
| `54461` | 1 | **2** |
| `00129` | 1 | **2** |

## Report lines (sold)

| User wording | Code | Product | Qty | Line AED |
|--------------|------|---------|----:|---------:|
| Peptide gel patch | `00053` | EyeCell Eye Peptide Gel Patch (box) | 3 | 570.00 |
| Peptide mask | `00012` | Peptide Gel Mask 39g | 7 | 266.00 |
| Eye contour serum | `00054` | EyeCell Eye Contour Serum 10ml | 2 | 370.00 |
| Collagen mask | `00063` | Collagen Mask 23g | 2 | 36.00 |
| Eye contour cream | `00055` | EyeCell Eye Contour Cream 20ml | 1 | 185.00 |
| Intensive hydro soothing cream 50g | `00031` | Intensive Hydro Soothing Cream 50g | 1 | 145.00 |
| Hyaluron cream 50g | `54458` | Moisture Replenishing Hyaluron Cream 50g | 1 | 145.00 |
| Blemish balm cushion | `00144` | Skin Caring Blemish Balm Cushion #2 Biege | 1 | 150.00 |
| SPF 40 | `00041` | Multi Sun Cream SPF40/PA++ 40g | 1 | 105.00 |
| Sea algae | `00140` | Soothing Bomb Sea Algae Mask 23g | 4 | 72.00 |
| Revita glow bright | `54472` | Revita Glow BB #01 Bright 50g | 1 | 125.00 |
| Hyaluron serum | `00195` | Moisture Replenishing Hyaluron Serum 30ml | 1 | 165.00 |
| SPF 50 | `54457` | Ultra Shield Sun Cream SPF50 50g | 1 | 125.00 |
| Defender remover | `54461` | Skin Defender Lip & Eye Makeup Remover 200ml | 1 | 145.00 |
| EPI boosting peeling gel | `00129` | EPI Turnover Boosting Peeling Gel 100g | 1 | 125.00 |

## Scripts

- Report: `scripts/moysklad-create-love-my-body-commission-report-20260602.js`
- Shipment (2×): `scripts/moysklad-create-love-my-body-consignment-demand-20260602.js`

```bash
node --import dotenv/config scripts/moysklad-create-love-my-body-consignment-demand-20260602.js --commit
```
