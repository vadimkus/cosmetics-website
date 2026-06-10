# First Person Marina — Commissioner Sales Report (May 2026)

**Date:** 2026-06-01 (UAE)

## Request

Create **Полученный отчет комиссионера** for **First Person Ladies Salon (Marina)** / Persona Dubai Marina from sold-items list.

## Customer / Contract

| Field | Value |
|--------|--------|
| Customer | **First Person Ladies Salon (Marina)** |
| Counterparty ID | `af21a79a-63cd-11ea-0a80-02b2000e2aeb` |
| Agreement | **00024** — `56ca0166-c388-11eb-0a80-093a001d1ee0` |
| Commission period | **2026-05-01 → 2026-05-31** |

## Posted Document

| Type | Number | Sum | Units | Lines | ID |
|------|--------|-----|-------|-------|-----|
| Отчет комиссионера | **01364** | **3,369.00 AED** | 27 | 15 | `8ef8f0a3-5db6-11f1-0a80-065d007fab55` |

[Open report](https://online.moysklad.ru/app/#commissionreport/edit?id=8ef8f0a3-5db6-11f1-0a80-065d007fab55)

## Lines

| Code | Product | Qty | Unit AED | Line AED |
|------|---------|----:|---------:|---------:|
| `00035` | Problem Control Cream 50g | 2 | 145.00 | 290.00 |
| `00041` | Multi Sun SPF40 | 2 | 105.00 | 210.00 |
| `00188` | Microbiome Mist 80ml | 3 | 80.00 | 240.00 |
| `00052` | HR³ Matrix Shampoo 300ml | 1 | 170.00 | 170.00 |
| `00051` | HR³ Matrix Hair Tonic 70ml | 2 | 145.00 | 290.00 |
| `00040` | Blemish Balm Cream 50g | 2 | 125.00 | 250.00 |
| `00021` | Snow O₂ Cleanser 180ml | 4 | 165.00 | 660.00 |
| `00063` | Collagen Mask 23g | 2 | 18.00 | 36.00 |
| `00012` | Peptide Gel Mask 39g | 1 | 38.00 | 38.00 |
| `00022` | Snow Booster Toner 200ml | 1 | 130.00 | 130.00 |
| `54457` | Ultra Shield SPF50 50g | 3 | 125.00 | 375.00 |
| `00053` | Eye Peptide Gel Patch (box) | 1 | 190.00 | 190.00 |
| `00031` | Hydro Soothing Cream 50g | 1 | 145.00 | 145.00 |
| `00026` | Biphasic Makeup Remover 200ml | 1 | 145.00 | 145.00 |
| `54467` | PDRN mask pack | 1 | 200.00 | 200.00 |

## Mapping notes

- **Blemish balm** → Blemish Balm Cream 50g (`00040`), not cushion.
- **Matrix tonic** → HR³ Matrix Hair Tonic (`00051`).
- **PDRN mask** → full pack `54467` (no single-sheet SKU).

**Correction (2026-06-01):** Report **01364** line updated from Cushion #2 Beige (`00144` ×2 @ 150) to Blemish Balm Cream (`00040` ×2 @ 125). Total **3,369 AED**.

## Script

`scripts/moysklad-create-persona-marina-commission-report-20260601.js`

```bash
node --import dotenv/config scripts/moysklad-create-persona-marina-commission-report-20260601.js --commit
```
