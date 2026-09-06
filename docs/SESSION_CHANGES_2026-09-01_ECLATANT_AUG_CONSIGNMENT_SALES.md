# Eclatant — August consignment sales (2026-09-01)

**Customer:** ECLATANT&CO TRADING CO L.L.C (`0df9bafd-1a99-11f0-0a80-08b100073e9f`)  
**Agreement:** 18 (`132684fd-1a99-11f0-0a80-071f0006a1ec`)  
**Period:** 2026-08-01 → 2026-08-31  
**Script:** `scripts/moysklad-create-eclatant-commission-sales-20260901.js --commit`

## Posted

| Type | Number | Sum | Units | Lines | Status |
|------|--------|----:|------:|------:|--------|
| Отчет комиссионера | **01449** | **2,951.00 AED** | 43 | 13 | Not paid |

PDF: `~/Desktop/orders/GENOSYS_Eclatant_Consignment_Sales_01449.pdf` (not printed)

Report: https://online.moysklad.ru/app/#commissionreport/edit?id=fd9f2cb9-a5cc-11f1-0a80-089900297544

## Lines @ clinic list

| Code | Product | Qty | Unit AED | Line AED |
|------|---------|----:|---------:|---------:|
| 00144 | Cushion #2 Beige | 7 | 150 | 1,050 |
| 00012 | Peptide Gel Mask 39g | 9 | 38 | 342 |
| 00053 | Eye Peptide Gel Patch (box) | 1 | 190 | 190 |
| 00052 | HR³ Scalp & Hair Shampoo 300ml | 1 | 170 | 170 |
| 00021 | Snow O₂ Cleanser 180ml | 1 | 165 | 165 |
| 00140 | Sea Algae Mask | 10 | 18 | 180 |
| 54472 | Revita Glow BB #01 Bright | 1 | 125 | 125 |
| 54473 | Revita Glow BB #02 Natural | 1 | 125 | 125 |
| 54457 | Ultra Shield SPF50 | 1 | 125 | 125 |
| 00063 | Collagen Mask | 8 | 18 | 144 |
| 00143 | Cushion #1 Ivory | 1 | 150 | 150 |
| 00188 | Microbiome Energy Infusing Mist 80ml | 1 | 80 | 80 |
| 00084 | Eye Roller 0.25mm | 1 | 105 | 105 |
| | **Total** | **43** | | **2,951** |

Sheet “Eye Zone Care Gel Patch (box)” → `00053`. “Eye Beauty roller” → `00084`.

## Replenishment demand (1 Sep)

| Type | Number | Sum | Units | Lines | Status |
|------|--------|----:|------:|------:|--------|
| Отгрузка into agr. **18** | **06776** | **2,620.00 AED** | 43 | 6 | shipped |

Stock note: `~/Desktop/orders/GENOSYS_Eclatant_Consignment_Stock_Note_06776.pdf`

Demand: https://online.moysklad.ru/app/#demand/edit?id=364cd140-a5cf-11f1-0a80-182200242c7d

Script: `scripts/moysklad-create-eclatant-replenish-demand-20260901.js --commit`

| Code | Product | Qty | Unit AED | Line AED |
|------|---------|----:|---------:|---------:|
| 00144 | Cushion #2 Beige | 10 | 150 | 1,500 |
| 00140 | Sea Algae Mask | 10 | 18 | 180 |
| 00063 | Collagen Mask | 10 | 18 | 180 |
| 00012 | Peptide Gel Mask | 10 | 38 | 380 |
| 00143 | Cushion #1 Ivory | 2 | 150 | 300 |
| 00188 | Microbiome Energy Infusing Mist 80ml | 1 | 80 | 80 |
| | **Total** | **43** | | **2,620** |

Agreement-only. No SO / invoice / payment. Qtys are the restock list, not 1:1 with report **01449**.

## Not done

- Payment on report **01449**
