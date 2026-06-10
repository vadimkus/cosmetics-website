# Eclatant — Commissioner Sales Report (May 2026)

**Date:** 2026-06-01 (UAE)

## Request

Create **Полученный отчет комиссионера** for **ECLATANT&CO TRADING CO L.L.C** from sales summary screenshot.

## Customer / Contract

| Field | Value |
|--------|--------|
| Customer | **ECLATANT&CO TRADING CO L.L.C** |
| Counterparty ID | `0df9bafd-1a99-11f0-0a80-08b100073e9f` |
| Agreement | **18** — `132684fd-1a99-11f0-0a80-071f0006a1ec` |
| Commission period | **2026-05-01 → 2026-05-31** |

## Posted Document

| Type | Number | Sum | Units | Lines | ID |
|------|--------|-----|-------|-------|-----|
| Отчет комиссионера | **01363** | **2,838.00 AED** | 35 | 11 | `2014202e-5d9f-11f1-0a80-159b007a2021` |

[Open report](https://online.moysklad.ru/app/#commissionreport/edit?id=2014202e-5d9f-11f1-0a80-159b007a2021)

## Lines

| Code | Product (screenshot → MoySklad) | Qty | Unit AED | Line AED |
|------|----------------------------------|----:|---------:|---------:|
| `00144` | Cushion #2 Beige | 5 | 150.00 | 750.00 |
| `54462` | Glow Into the Holidays → Holiday Kit Skin Glow Coverage #2 | 1 | 285.00 | 285.00 |
| `00012` | Peptide Gel Mask | 10 | 38.00 | 380.00 |
| `00021` | Snow O₂ Cleanser 180ml | 2 | 165.00 | 330.00 |
| `00041` | Multi Sun Cream SPF40 | 2 | 105.00 | 210.00 |
| `54467` | PDRN mask 1 piece → PDRN mask pack (30 sheets) | 1 | 200.00 | 200.00 |
| `00053` | EyeCell Eye Peptide Gel Patch (box) | 1 | 190.00 | 190.00 |
| `00143` | Cushion #1 Ivory | 1 | 150.00 | 150.00 |
| `00035` | Intensive Problem Control Cream 50g | 1 | 145.00 | 145.00 |
| `00063` | Intensive Repair Collagen Mask 23g | 7 | 18.00 | 126.00 |
| `00140` | Soothing Bomb Sea Algae Mask 23g | 4 | 18.00 | 72.00 |

## Mapping notes

- **Glow Into the Holidays** → `54462` (only holiday “glow” kit in MoySklad; confirm with client if meant `54463` Base Kit instead).
- **PDRN mask 1 piece** → `54467` full pack (no single-sheet SKU; same approach as prior Eclatant reports).

## Script

`scripts/moysklad-create-eclatant-commission-report-20260601.js`

```bash
node --import dotenv/config scripts/moysklad-create-eclatant-commission-report-20260601.js --commit
```
