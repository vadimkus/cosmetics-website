# NEW YOU STAR — Consignment Onboarding

**Date:** 2026-07-14 (UAE)

## Request

Ingest legal docs from `Contract_Customers/New_YOU_STAR`, create MoySklad customer + commission agreement (5-day payment term), post opening consignment demand (retail bestsellers ×2 each) for shipment tomorrow, export PDFs to Desktop `orders/`.

## Document Ingest

Source: `/Users/vadimkus/Desktop/Drive/Genosys/Contract_Customers/New_YOU_STAR`

| File | Extracted |
|---|---|
| Trade License -2026-New You sta.pdf | License **985526**, Poly Clinic, expires **22 Sep 2026**, Shop 21 The Mall Umm Suqeim 3 |
| VAT Registration Certificate | TRN **100619066200003** |
| DHA License 2025.pdf | DHA **5938656**, expires **07 Sep 2026** |
| Corporate Tax Registration Certificate | Supporting doc |

Summary: `New_YOU_STAR/INGEST_SUMMARY_2026-07-14.md`

## Customer / Contract

| Field | Value |
|--------|--------|
| Customer | **NEW YOU STAR BEAUTY HEALTH CLINIC L.L.C** — `69e1db3e-7fa4-11f1-0a80-0283002585b0` |
| Owner / Manager | Tetiana Boiko |
| Medical Director | Madina Budakova |
| Phone | +971503359777 (alt +971505040272) |
| Address | The Mall, Shop 21, Umm Suqeim Third, Jumeirah St, Dubai |
| TRN | 100619066200003 |
| Agreement | **37** — `6a2aabf3-7fa4-11f1-0a80-0283002585c9` |
| Payment term | **5 days** after monthly sales report |

[Open customer](https://online.moysklad.ru/app/#company/edit?id=69e1db3e-7fa4-11f1-0a80-0283002585b0) · [Open contract](https://online.moysklad.ru/app/#contract/edit?id=6a2aabf3-7fa4-11f1-0a80-0283002585c9)

## Posted Document

| Type | Number | Sum AED | Lines | Units | ID | Status |
|------|--------|---------|-------|-------|-----|--------|
| Отгрузка (consignment) | ~~**06541**~~ | ~~2,280.00~~ | 8 | 16 | `6f288c62-7fa4-11f1-0a80-115c00258a40` | **DELETED 2026-07-15** — superseded by **06544** (full photo inventory) |

**Active consignment shipment:** **06544** — see `SESSION_CHANGES_2026-07-15_NEW_YOU_STAR_PHOTO_REPLENISHMENT_DEMAND.md`

## Lines Posted (retail ×2 each)

| Code | Product | Qty | Unit AED | Line AED |
|------|---------|----:|---------:|---------:|
| 00144 | Cushion #2 Beige | 2 | 150.00 | 300.00 |
| 54464 | Cushion #3 Camel | 2 | 150.00 | 300.00 |
| 00188 | Microbiome Mist 80ml | 2 | 80.00 | 160.00 |
| 54458 | Hyaluron Cream 50g | 2 | 145.00 | 290.00 |
| 00194 | Radiance Serum 30ml | 2 | 165.00 | 330.00 |
| 54467 | PDRN mask Pack (30 sheets) | 2 | 200.00 | 400.00 |
| 54473 | Revita Glow BB #02 Natural 50g | 2 | 125.00 | 250.00 |
| 54457 | Ultra Shield SPF50 50g | 2 | 125.00 | 250.00 |

## PDF Outputs

| Document | Path |
|----------|------|
| Consignment agreement (contract folder) | `~/Desktop/Drive/Genosys/Contract_Customers/New_YOU_STAR/Genosys_Consignment_Agreement_NEW_YOU_STAR_37.pdf` |
| Consignment agreement (orders) | `~/Desktop/orders/GENOSYS_NEW_YOU_STAR_Consignment_Agreement_37.pdf` |
| Consignment stock note | `~/Desktop/orders/GENOSYS_NEW_YOU_STAR_06541_Consignment_Stock_Note.pdf` |

Agreement PDF includes `Header.png` + `Stamp.png` from `~/Desktop/orders/` — **2-page readable layout** (10.5pt, party boxes, clauses 1–3 on page 1, 4–8 + signatures on page 2).

## Script

`scripts/moysklad-create-new-you-star-consignment-onboarding-20260714.js`

```bash
node --import dotenv/config scripts/moysklad-create-new-you-star-consignment-onboarding-20260714.js --commit
```

Re-export agreement PDF only (header + stamp):

`scripts/moysklad-export-new-you-star-consignment-agreement-pdf-20260714.js`

```bash
node scripts/moysklad-export-new-you-star-consignment-agreement-pdf-20260714.js
```
