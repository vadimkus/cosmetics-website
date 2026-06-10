# Persona Palm Jumeirah (Nakheel Mall) — Commissioner Sales Report (May 2026)

**Date:** 2026-06-01 (UAE)

## Request

Create **Полученный отчет комиссионера** for **Persona Nakheel Mall Palm Jumeirah** from sold-items list.

## Customer / Contract

| Field | Value |
|--------|--------|
| Customer | **First Person Ladies Salon LLC (Palm Jumeirah)** |
| Counterparty ID | `fd850df7-1cff-11ef-0a80-082e0017fa70` |
| Location | Nakheel Mall, Palm Jumeirah |
| Agreement | **00078** — `393d4076-1d00-11ef-0a80-028700179a4e` |
| Commission period | **2026-05-01 → 2026-05-31** |

## Posted Document

| Type | Number | Sum | Units | Lines | ID |
|------|--------|-----|-------|-------|-----|
| Отчет комиссионера | **01365** | **7,608.00 AED** | 68 | 19 | `73acd3e9-5db9-11f1-0a80-147b0081c60f` |

[Open report](https://online.moysklad.ru/app/#commissionreport/edit?id=73acd3e9-5db9-11f1-0a80-147b0081c60f)

## Lines

| Code | Product | Qty | Unit AED | Line AED |
|------|---------|----:|---------:|---------:|
| `00063` | Collagen Mask 23g | 11 | 18.00 | 198.00 |
| `00140` | Sea Algae Mask 23g | 10 | 18.00 | 180.00 |
| `00129` | EPI Turnover Peeling Gel 100g | 1 | 125.00 | 125.00 |
| `00053` | Eye Peptide Gel Patch (box) | 6 | 190.00 | 1,140.00 |
| `00144` | Cushion #2 Beige | 8 | 150.00 | 1,200.00 |
| `00051` | HR³ Matrix Hair Tonic 70ml | 5 | 145.00 | 725.00 |
| `00052` | HR³ Matrix Shampoo 300ml | 6 | 170.00 | 1,020.00 |
| `00188` | Microbiome Mist 80ml | 3 | 80.00 | 240.00 |
| `54457` | Ultra Shield SPF50 50g | 3 | 125.00 | 375.00 |
| `54473` | Revita Glow BB Natural 50g | 1 | 125.00 | 125.00 |
| `54472` | Revita Glow BB Bright 50g | 1 | 125.00 | 125.00 |
| `54464` | Cushion #3 Camel | 4 | 150.00 | 600.00 |
| `00042` | EGF Repair Oxymask Cream 50ml | 1 | 145.00 | 145.00 |
| `00050` | HR³ Matrix Scalp Peeling 100ml | 1 | 145.00 | 145.00 |
| `00048` | HR³ Hair Solution Professional Box (8pcs) | 1 | 370.00 | 370.00 |
| `00041` | Multi Sun SPF40 | 1 | 105.00 | 105.00 |
| `00021` | Snow O₂ Cleanser 180ml | 2 | 165.00 | 330.00 |
| `54467` | PDRN mask pack | 1 | 200.00 | 200.00 |
| `00022` | Snow Booster Toner 200ml | 2 | 130.00 | 260.00 |

## Mapping notes

- **Hair solution professional** → `00048` box (8pcs); single vial would be `00049`.
- **PDRN** → `54467` full pack (no single-sheet SKU).

## Script

`scripts/moysklad-create-persona-palm-jumeirah-commission-report-20260601.js`

```bash
node --import dotenv/config scripts/moysklad-create-persona-palm-jumeirah-commission-report-20260601.js --commit
```

## Matching shipment (+10 peptide masks replenishment)

| Type | Number | Sum | Units | Lines | ID |
|------|--------|-----|-------|-------|-----|
| Отгрузка | **06261** | **7,988.00 AED** | 78 | 20 | `b0a66847-5db9-11f1-0a80-16af00812e9f` |

[Open shipment](https://online.moysklad.ru/app/#demand/edit?id=b0a66847-5db9-11f1-0a80-16af00812e9f)

Same 19 lines as report **01365**, plus **Peptide Gel Mask (`00012`) ×10** @ 38 = **380 AED** replenishment (not on sales report).

Script: `scripts/moysklad-create-persona-palm-jumeirah-consignment-demand-20260601.js`
