# Session: Rise UP — consignment sold recalc (stock remainder method)

**Date:** 2026-07-02 (updated)  
**Customer:** Rise UP | Agreement **34** | Shipment **06255** only

## Method

**Продано = МойСклад − остаток у клиники.**  
Если позиции нет в их списке → остаток **0** → всё продано.

## Totals

| | AED | Pcs |
|---|----:|----:|
| Отгрузка MS (06255) | **11,561** | **103** |
| Остаток у клиники (их список) | **6,557** | **62** |
| **Продано (отчёт комиссионера)** | **5,004** | **41** |

- Из **их списка:** 2,304 AED / 23 pcs  
- **Не упомянули** (остаток 0): 2,700 AED / 18 pcs  

## Peptide Gel Mask (`00012`)

| MS | Остаток | **Продано** |
|---:|--------:|------------:|
| 7 | 1 | **6 × 38 = 228 AED** |

## Sold lines (41 pcs / 5,004 AED)

| Code | Product | MS | Stock | Sold | AED |
|------|---------|---:|------:|-----:|----:|
| 00012 | Peptide Gel Mask | 7 | 1 | **6** | 228 |
| 00144 | Cushion Beige | 3 | 1 | 2 | 300 |
| 00188 | Microbiome Mist | 6 | 3 | 3 | 240 |
| 54457 | Ultra Shield SPF50 | 4 | 0 | 4 | 500 |
| 00041 | Multi Sun SPF40 | 4 | 0 | 4 | 420 |
| 00037 | Skin Barrier Cream | 2 | 0 | 2 | 450 |
| 00189 | Overnight Cream Mask | 2 | 0 | 2 | 340 |
| 00191 | Anti-Wrinkle Serum | 2 | 0 | 2 | 330 |
| 00194 | Multi Vita Radiance Serum | 2 | 0 | 2 | 330 |
| 00129 | EPI Peeling Gel | 2 | 1 | 1 | 125 |
| 00051 | HR³ Hair Tonic | 2 | 1 | 1 | 145 |
| 00031 | Hydro Soothing Cream | 2 | 1 | 1 | 145 |
| 00190 | Anti-Wrinkle Cream | 2 | 1 | 1 | 145 |
| 54458 | Hyaluron Cream | 2 | 1 | 1 | 145 |
| 00122 | Radiance Cream | 1 | 0 | 1 | 145 |
| 00055 | Eye Contour Cream | 1 | 0 | 1 | 185 |
| 00053 | Eye Patch box | 4 | 3 | 1 | 190 |
| 00054 | Eye Contour Serum | 3 | 2 | 1 | 185 |
| 00029 | Problem Control Serum | 2 | 1 | 1 | 165 |
| 00145 | Problem Control Toner | 2 | 1 | 1 | 130 |
| 54473 | Revita BB Natural | 2 | 1 | 1 | 125 |
| 00140 | Sea Algae Mask | 10 | 9 | 1 | 18 |
| 00063 | Collagen Mask | 10 | 9 | 1 | 18 |

**10 lines OK** (sold 0): 00022, 00030, 00035, 00040, 00052, 00143, 00195, 54461, 54464, 54472

## Settlement

- **Rise UP owes Genosys (consignment sold):** **5,004 AED** → report **01394** posted 2026-07-02

## Posted document

| Type | № | Sum | Pcs | Lines | PDF |
|------|---|-----|----:|------:|-----|
| Отчёт комиссионера | **01394** | **5,004 AED** | 41 | 23 | `~/Desktop/orders/GENOSYS_Rise_UP_Consignment_Sales_01394.pdf` |

[Open report](https://online.moysklad.ru/app/#commissionreport/edit?id=625a700a-75f7-11f1-0a80-1f1c003c0789)

Script: `scripts/moysklad-create-rise-up-commission-report-20260702.js --commit`
