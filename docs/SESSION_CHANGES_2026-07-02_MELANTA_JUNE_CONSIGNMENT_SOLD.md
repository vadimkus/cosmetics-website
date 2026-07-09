# Melanta Poly Clinic — Commissioner Report (June 2026)

**Date:** 2026-07-02 (UAE)

## Customer / Contract

| Field | Value |
|--------|--------|
| Customer | **Melanta Poly Clinic L.L.C** |
| Counterparty ID | `c3908257-ccdd-11ef-0a80-11a10053430e` |
| Agreement | **14** — `ca7a8aa6-ccdd-11ef-0a80-18080052ee1c` |
| Commission period | **2026-06-01 → 2026-06-30** |

## Posted Document

| Type | Number | Sum | Units | Lines | ID |
|------|--------|-----|-------|-------|-----|
| Отчет комиссионера | **01396** | **1,734.00 AED** | 14 | 8 | `45ee0eda-7609-11f1-0a80-1f1c0040ad22` |

- [Report 01396](https://online.moysklad.ru/app/#commissionreport/edit?id=45ee0eda-7609-11f1-0a80-1f1c0040ad22)
- PDF: `~/Desktop/orders/GENOSYS_Melanta_Consignment_Sales_01396.pdf`

Report only — no demand.

## Line mapping

| User request | Code | Product | Qty | Line AED |
|--------------|------|---------|----:|---------:|
| Collagen mask (16g label) | `00063` | Intensive Repair Collagen Mask 23g | 1 | 18.00 |
| Blemish Balm Cream 50g | `00040` | Intensive Blemish Balm Cream 50g | 1 | 125.00 |
| Sea algae mask (16g label) | `00140` | Soothing Bomb Sea Algae Mask 23g | 2 | 36.00 |
| Snow O₂ Cleanser 180ml | `00021` | Snow O₂ Cleanser 180ml | 1 | 165.00 |
| Overnight cream mask | `00189` | Skin Rescue Overnight Cream Mask 100g | 2 | 340.00 |
| PDRN mask pack | `54467` | Skin Reboot PDRN mask Pack | 1 | 200.00 |
| Ultra Shield SPF50 | `54457` | Ultra Shield Sun Cream SPF50/PA++++ 50g | 2 | 250.00 |
| BB Cushion Beige | `00144` | Skin Caring Blemish Balm Cushion #2 Biege | 4 | 600.00 |

## Notes

- Mask weights on sheet (16g) → standard MoySklad sheet SKUs **`00063` / `00140` (23g)** — same convention as May report **01368**.

## Script

`scripts/moysklad-create-melanta-commission-report-20260702.js`

```bash
node --import dotenv/config scripts/moysklad-create-melanta-commission-report-20260702.js --commit
```
