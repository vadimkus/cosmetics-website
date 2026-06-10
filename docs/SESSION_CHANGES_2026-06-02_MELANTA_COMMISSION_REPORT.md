# Melanta Poly Clinic — Commissioner Report (May 2026)

**Date:** 2026-06-02 (UAE)

## Customer / Contract

| Field | Value |
|--------|--------|
| Customer | **Melanta Poly Clinic L.L.C** |
| Counterparty ID | `c3908257-ccdd-11ef-0a80-11a10053430e` |
| Agreement | **14** — `ca7a8aa6-ccdd-11ef-0a80-18080052ee1c` |
| Commission period | **2026-05-01 → 2026-05-31** |

## Posted Document

| Type | Number | Sum | Units | Lines | ID |
|------|--------|-----|-------|-------|-----|
| Отчет комиссионера | **01368** | **2,801.00 AED** | 19 | 14 | `97a0d5dc-5e55-11f1-0a80-1d61001609a6` |

- [Report 01368](https://online.moysklad.ru/app/#commissionreport/edit?id=97a0d5dc-5e55-11f1-0a80-1d61001609a6)

Report only — no shipment.

## Line mapping

| User request | Code | Product | Qty | Line AED |
|--------------|------|---------|----:|---------:|
| Eye peptide gel patch (box) | `00053` | EyeCell Eye Peptide Gel Patch (box) | 4 | 760.00 |
| Ultra Shield SPF50 | `54457` | Ultra Shield Sun Cream SPF50 50g | 2 | 250.00 |
| BB Cushion Beige | `00144` | Skin Caring Blemish Balm Cushion #2 Biege | 2 | 300.00 |
| BB Cushion Ivory | `00143` | Skin Caring Blemish Balm Cushion #1 Ivory | 1 | 150.00 |
| PDRN mask pack | `54467` | Skin Reboot PDRN mask Pack | 1 | 200.00 |
| Snow O₂ Cleanser 180ml | `00021` | Snow O₂ Cleanser 180ml | 1 | 165.00 |
| Eye contour cream | `00055` | EyeCell Eye Contour Cream 20ml | 1 | 185.00 |
| Eye contour serum | `00054` | EyeCell Eye Contour Serum 10ml | 1 | 185.00 |
| Snow Booster Toner | `00022` | Snow Booster Toner 200ml | 1 | 130.00 |
| Collagen mask (16g label) | `00063` | Intensive Repair Collagen Mask 23g | 1 | 18.00 |
| Sea algae mask (16g label) | `00140` | Soothing Bomb Sea Algae Mask 23g | 1 | 18.00 |
| Overnight cream mask | `00189` | Skin Rescue Overnight Cream Mask 100g | 1 | 170.00 |
| EGF Oxymask cream | `00042` | EGF Repair Oxymask Cream 50ml | 1 | 145.00 |
| EPI peeling gel | `00129` | EPI Turnover Boosting Peeling Gel 100g | 1 | 125.00 |

## Notes

- Sheet **“Cushion #2 Ivory”** → MoySklad **`00143` #1 Ivory** (Beige = `00144` #2).
- Mask weights on sheet (16g) → standard MoySklad sheet SKUs **`00063` / `00140` (23g)**.

## Script

`scripts/moysklad-create-melanta-commission-report-20260602.js`

```bash
node --import dotenv/config scripts/moysklad-create-melanta-commission-report-20260602.js --commit
```
