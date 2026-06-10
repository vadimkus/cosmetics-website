# ARFI Nails Jumeirah — Commissioner Report + Shipment (May 2026)

**Date:** 2026-06-02 (UAE)

## Customer / Contract

| Field | Value |
|--------|--------|
| Customer | **ARFI NAILS BEAUTY SALON 2** (Jumeirah) |
| Counterparty ID | `dc883e47-f051-11f0-0a80-0f7100059e21` |
| Agreement | **30** — `383ebfbb-f052-11f0-0a80-0035000650e3` |
| Commission period | **2026-05-01 → 2026-05-31** |

## Posted Documents

| Type | Number | Sum | Units | Lines | ID |
|------|--------|-----|-------|-------|-----|
| Отчет комиссионера | **01370** | **1,610.00 AED** | 11 | 10 | `075db71e-5ea7-11f1-0a80-0259002ac540` |
| Отгрузка | **06273** | **1,610.00 AED** | 11 | 10 | `07d5dd78-5ea7-11f1-0a80-0cb9002ab24d` |

- [Report 01370](https://online.moysklad.ru/app/#commissionreport/edit?id=075db71e-5ea7-11f1-0a80-0259002ac540)
- [Shipment 06273](https://online.moysklad.ru/app/#demand/edit?id=07d5dd78-5ea7-11f1-0a80-0cb9002ab24d)

## Lines (report = shipment)

| Code | Product | Qty | Line AED |
|------|---------|----:|---------:|
| `00189` | Skin Rescue Overnight Cream Mask 100g | 2 | 340.00 |
| `00031` | Intensive Hydro Soothing Cream 50g | 1 | 145.00 |
| `00042` | EGF Repair Oxymask Cream 50ml | 1 | 145.00 |
| `00191` | Multi Functional Anti-Wrinkle Serum 30ml | 1 | 165.00 |
| `54458` | Moisture Replenishing Hyaluron Cream 50g | 1 | 145.00 |
| `00022` | Snow Booster Toner 200ml | 1 | 130.00 |
| `00021` | Snow O₂ Cleanser 180ml | 1 | 165.00 |
| `00122` | Multi-Vita Radiance Cream 50g | 1 | 145.00 |
| `00040` | Intensive Blemish Balm Cream 50g | 1 | 125.00 |
| `00041` | Multi Sun Cream SPF40/PA++ 40g | 1 | 105.00 |

## Script

`scripts/moysklad-create-arfi-jumeirah-commission-demand-20260602.js`

```bash
node --import dotenv/config scripts/moysklad-create-arfi-jumeirah-commission-demand-20260602.js --commit
```
