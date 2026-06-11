# Shakirovna Elite Salon + Esthetic Clinic — Commissioner Demand (01374 / 01375)

**Date:** 2026-06-10 (UAE)

## Request

Screenshots 2026-06-07: matching **Отгрузка** (demand) for existing commissioner reports **01374** (Elite) and **01375** (Clinic). Sales period **11.05.2026–07.06.2026**; prices from `report/stock/all` salePrice; VAT included; state **Отгружен**.

Reports already in MoySklad (verified via API before create):

| Report | Customer | Agreement | Sum (AED) | Lines | Pcs | Report ID |
|--------|----------|-----------|----------:|------:|----:|-----------|
| **01374** | ELITE SHAKIROVNA LADIES SALON L.L.C | **21** | **1,545.00** | 7 | 14 | `d37cba36-628d-11f1-0a80-1ba10067f08e` |
| **01375** | SHAKIROVNA ESTHETIC CLINIC L.L.C | **26** | **905.00** | 6 | 6 | `d46467ec-628d-11f1-0a80-08090068a6d8` |

API `commissionPeriodEnd` on both reports: `2026-06-06 23:59:00` (UI/screenshot may show 07.06).

## Posted shipments (demand only)

| Customer | Report | Отгрузка | Sum (AED) | Lines | Pcs | Demand ID |
|----------|--------|----------|----------:|------:|----:|-----------|
| Elite Salon | 01374 | **06334** | **1,545.00** | 7 | 14 | `dccc1c34-64db-11f1-0a80-1ccc00237b9c` |
| Esthetic Clinic | 01375 | **06335** | **905.00** | 6 | 6 | `de3c0b8a-64db-11f1-0a80-1ccc00237bcf` |

- [Report 01374](https://online.moysklad.ru/app/#commissionreport/edit?id=d37cba36-628d-11f1-0a80-1ba10067f08e)
- [Demand 06334 (Elite)](https://online.moysklad.ru/app/#demand/edit?id=dccc1c34-64db-11f1-0a80-1ccc00237b9c)
- [Report 01375](https://online.moysklad.ru/app/#commissionreport/edit?id=d46467ec-628d-11f1-0a80-08090068a6d8)
- [Demand 06335 (Clinic)](https://online.moysklad.ru/app/#demand/edit?id=de3c0b8a-64db-11f1-0a80-1ccc00237bcf)

**Verification:** script compared qty + unit price per SKU against report positions — OK for both.

## Contracts

| Site | Contract name | Contract ID |
|------|---------------|-------------|
| Elite | **21** | `c24b0b09-5e34-11f0-0a80-1b1c0008232a` |
| Clinic | **26** | `d08f670e-b993-11f0-0a80-19750031f04a` |

Clinic agent ID (fallback): `a187255f-a9b6-11f0-0a80-09900022125b`.

Org `e18525a4-33c5-11ea-0a80-043f000b2738`, store `e186d449-33c5-11ea-0a80-043f000b273a`, shipped state `50d70717-4582-11ea-0a80-05e3001273a2`.

## Lines

### Elite (01374 → 06334)

| Code | Qty |
|------|----:|
| `00053` | 1 |
| `00189` | 1 |
| `00144` | 3 |
| `54464` | 1 |
| `00021` | 3 |
| `00063` | 1 |
| `00140` | 4 |

### Clinic (01375 → 06335)

| Code | Qty |
|------|----:|
| `00122` | 1 |
| `00144` | 1 |
| `54464` | 1 |
| `00021` | 1 |
| `00145` | 1 |
| `00029` | 1 |

## Script

`scripts/moysklad-create-shakirovna-elite-clinic-commission-demand-20260610.js`

```bash
node --import dotenv/config scripts/moysklad-create-shakirovna-elite-clinic-commission-demand-20260610.js
node --import dotenv/config scripts/moysklad-create-shakirovna-elite-clinic-commission-demand-20260610.js --commit
node --import dotenv/config scripts/moysklad-create-shakirovna-elite-clinic-commission-demand-20260610.js --commit --report=elite
```

- Duplicate guard: description marker `Shakirovna ELITE+CLINIC commission demand matching report 01374/01375 2026-06-10 — report 01374|01375`
- Default: verifies report lines/prices via API (`--skip-verify` to disable)

## Related

- Reports created: `scripts/moysklad-create-shakirovna-elite-clinic-commission-20260607.js`
- Prior shipment pattern: `scripts/moysklad-create-shakirovna-elite-clinic-shipments-invoice-lines-20260512.js`
