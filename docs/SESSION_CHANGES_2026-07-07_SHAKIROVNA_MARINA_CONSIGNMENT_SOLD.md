# Shakirovna Marina — consignment sold report (2026-07-07, updated 2026-07-10)

**Customer:** Shakirovna Ladies Beauty Saloon (Altegio: Shakirovna Beauty Center, Dubai Marina)  
**Contract:** **00030**  
**Source:** Altegio «Анализ продаж» **10.06.2026–09.07.2026**  
**Document:** Полученный отчёт комиссионера **01402** — **3,913.00 AED** (35 pcs, 17 lines)  
**Status:** **Paid** — paymentin **05919** (2026-07-12).  
**Matching отгрузка:** **06556** — same moment / lines / **3,913 AED** (booked 2026-07-17 backfill). See [SESSION_CHANGES_2026-07-17_SHAKIROVNA_MARINA_01402_MATCHING_DEMAND.md](./SESSION_CHANGES_2026-07-17_SHAKIROVNA_MARINA_01402_MATCHING_DEMAND.md).

## Update 2026-07-10

Altegio refresh — only change vs prior booking:

| Code | Product | Was | Now |
|------|---------|----:|----:|
| 54458 | Hyaluron Cream 50ml | 2 | **3** |

- Period end: **09.07.2026** (was 08.07)
- Total: **3,913.00 AED** (was 3,768.00)
- Script: `scripts/moysklad-update-shakirovna-marina-commission-report-01402-20260710.js --commit`

## PDF

`~/Desktop/orders/GENOSYS_Shakirovna_Marina_Consignment_Sales_01402.pdf` (refreshed 2026-07-16)

## Lines

| Code | Product | Qty |
|------|---------|----:|
| 00035 | Problem Control Cream 50ml | 1 |
| 00029 | Problem Control Serum 30ml | 1 |
| 54458 | Hyaluron Cream 50ml | **3** |
| 00012 | Peptide Gel Mask 39g | 1 |
| 00055 | EyeCell Eye Contour Cream 20ml | 2 |
| 00190 | Multi Functional Anti-Wrinkle Cream 50g | 2 |
| 00054 | Eye Contour Serum 10ml | 1 |
| 00195 | Hyaluron Serum 30ml | 1 |
| 00191 | Multi Functional Anti-Wrinkle Serum 30ml | 1 |
| 00021 | Snow O₂ Cleanser 180ml | 1 |
| 54457 | Ultra Shield SPF50 50g | 2 |
| 00188 | Microbiome Mist 80ml | 1 |
| 00189 | Skin Rescue Overnight Cream Mask 100g | 2 |
| 00144 | Cushion #2 Beige | 5 |
| 00140 | Sea Algae Mask 23g | 7 |
| 00063 | Collagen Mask 23g | 3 |
| 00053 | EyeCell Eye Peptide Gel Patch (box) | 1 |

Altegio 25g algae → **00140** (23g). Peptide 38g → **00012** (39g).

## Scripts

- Create (original): `scripts/moysklad-create-shakirovna-marina-commission-report-20260707.js`
- Update: `scripts/moysklad-update-shakirovna-marina-commission-report-01402-20260710.js`
- PDF export: `scripts/moysklad-export-shakirovna-marina-consignment-report-01402-20260716.js`
