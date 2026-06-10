# ARFI Nails Barsha — Commissioner Report + Shipment (May 2026)

**Date:** 2026-06-02 (UAE)

## Customer / Contract

| Field | Value |
|--------|--------|
| Customer | **ARFI NAILS BEAUTY SALON** (Barsha) |
| Counterparty ID | `39a1aa83-a5a6-11f0-0a80-1cbc00050fea` |
| Agreement | **25** — `739936aa-a809-11f0-0a80-07ba002a8e67` |
| Commission period | **2026-05-01 → 2026-05-31** |

## Posted Documents

| Type | Number | Sum | Units | Lines | ID |
|------|--------|-----|-------|-------|-----|
| Отчет комиссионера | **01371** | **2,268.00 AED** | 15 | 11 | `b8c4e2ef-5ea7-11f1-0a80-0b76002a5229` |
| Отгрузка | **06274** | **2,268.00 AED** | 15 | 11 | `b93662c6-5ea7-11f1-0a80-0661002a22c9` |

- [Report 01371](https://online.moysklad.ru/app/#commissionreport/edit?id=b8c4e2ef-5ea7-11f1-0a80-0b76002a5229)
- [Shipment 06274](https://online.moysklad.ru/app/#demand/edit?id=b93662c6-5ea7-11f1-0a80-0661002a22c9)

## Lines (report = shipment)

| Code | Product | Qty | Line AED |
|------|---------|----:|---------:|
| `00022` | Snow Booster Toner 200ml | 1 | 130.00 |
| `00063` | Intensive Repair Collagen Mask 23g | 1 | 18.00 |
| `54467` | Skin Reboot PDRN mask Pack | 2 | 400.00 |
| `00190` | Multi Functional Anti-Wrinkle Cream 50g | 1 | 145.00 |
| `00144` | BB Cushion #2 Biege | 1 | 150.00 |
| `00053` | EyeCell Eye Peptide Gel Patch (box) | 2 | 380.00 |
| `54464` | BB Cushion #3 Camel | 1 | 150.00 |
| `00031` | Intensive Hydro Soothing Cream 50g | 1 | 145.00 |
| `54458` | Moisture Replenishing Hyaluron Cream 50g | 3 | 435.00 |
| `00143` | BB Cushion #1 Ivory | 1 | 150.00 |
| `00021` | Snow O₂ Cleanser 180ml | 1 | 165.00 |

## Script

`scripts/moysklad-create-arfi-barsha-commission-demand-20260602.js`

```bash
node --import dotenv/config scripts/moysklad-create-arfi-barsha-commission-demand-20260602.js --commit
```
