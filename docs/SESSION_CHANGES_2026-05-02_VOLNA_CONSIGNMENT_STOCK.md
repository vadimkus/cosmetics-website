# Volna Consignment Stock Snapshot

Date: 2026-05-02

## Context

User requested the full current consignment stock for `Salon Volna` in English.

## Calculation Method

Live MoySklad read-only calculation for counterparty `Volna Beauty Salon L.L.C`:

- Starting from `2023-01-01`
- `Current consignment stock = Отгрузки - Полученные отчеты комиссионера - Возвраты покупателей`
- Documents included:
  - `15` demand documents
  - `11` received commissioner reports
  - `0` sales returns

## Important Finding

Today's demand `06075` currently contains one extra line not present in the sold-items report:

- `00012` Genosys Peptide Gel Mask 39g — `5 pcs`, `190 AED`

The live stock snapshot includes this line because it exists in MoySklad as of the read.

## Totals

- Current consignment quantity: `100 pcs`
- Current consignment value at MoySklad sales prices: `9,937 AED`
- If excluding the unexpected Peptide Gel Mask line from `06075`: `95 pcs`, `9,747 AED`

## Current Stock Lines

| Code | Product | Current pcs | Value AED |
|---|---|---:|---:|
| `00140` | Genosys Soothing Bomb Sea Algae Mask 23g | 24 | 432 |
| `00063` | Genosys Intensive Repair Collagen Mask 23g | 10 | 180 |
| `00021` | Genosys Snow O₂ Cleanser 180ml | 6 | 990 |
| `00012` | Genosys Peptide Gel Mask 39g | 5 | 190 |
| `00143` | Genosys Skin Caring Blemish Balm Cushion #1 Ivory | 4 | 600 |
| `00144` | Genosys Skin Caring Blemish Balm Cushion #2 Biege | 4 | 600 |
| `54457` | Genosys Ultra Shield Sun Cream SPF50/PA++++ 50g | 4 | 500 |
| `00040` | Genosys Intensive Blemish Balm Cream 50g | 3 | 375 |
| `00145` | Genosys Problem Control Toner 200ml | 3 | 390 |
| `00030` | Genosys All For Sensitive Serum 30ml | 2 | 330 |
| `00042` | Genosys EGF Repair Oxymask Cream 50ml | 2 | 290 |
| `00129` | Genosys EPI Turnover Boosting Peeling Gel 100g | 2 | 250 |
| `00055` | Genosys EyeCell Eye Contour Cream 20ml | 2 | 370 |
| `00054` | Genosys EyeCell Eye Contour Serum 10ml | 2 | 370 |
| `00053` | Genosys EyeCell Eye Peptide Gel Patch (box) | 2 | 380 |
| `54458` | Genosys Moisture Replenishing Hyaluron Cream 50g | 2 | 290 |
| `00041` | Genosys Multi Sun Cream SPF40/PA++ 40g | 2 | 210 |
| `54472` | Genosys Revita Glow BB Cream #01 Bright 50g | 2 | 250 |
| `54473` | Genosys Revita Glow BB Cream #02 Natural 50g | 2 | 250 |
| `00022` | Genosys Snow Booster Toner 200ml | 2 | 260 |
| `00031` | Genosys Intensive Hydro Soothing Cream 50g | 1 | 145 |
| `00035` | Genosys Intensive Problem Control Cream 50g | 1 | 145 |
| `00188` | Genosys Microbiome Energy Infusing Mist 80ml | 1 | 80 |
| `00195` | Genosys Moisture Replenishing Hyaluron Serum 30ml | 1 | 165 |
| `00190` | Genosys Multi Functional Anti-Wrinkle Cream 50g | 1 | 145 |
| `00191` | Genosys Multi Functional Anti-Wrinkle Serum 30ml | 1 | 165 |
| `00194` | Genosys Multi Vita Radiance Serum 30ml | 1 | 165 |
| `00122` | Genosys Multi-Vita Radiance Cream 50g | 1 | 145 |
| `00029` | Genosys Problem Control Serum 30ml | 1 | 165 |
| `00037` | Genosys Skin Barrier Protecting Cream 100g | 1 | 225 |
| `54464` | Genosys Skin Caring Blemish Balm Cushion #3 Camel | 1 | 150 |
| `54461` | Genosys Skin Defender Lip & Eye Makeup Remover 200ml | 1 | 145 |
| `54467` | Genosys Skin Reboot PDRN mask Pack (30 sheets) 350g | 1 | 200 |
| `00189` | Genosys Skin Rescue Overnight Cream Mask 100g | 1 | 170 |
| `54465` | Genosys Soothing Repair Post Cream 100g | 1 | 220 |
