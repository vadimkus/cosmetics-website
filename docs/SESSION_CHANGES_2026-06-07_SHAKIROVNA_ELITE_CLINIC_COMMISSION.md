# Shakirovna Elite + Esthetic Clinic — Commissioner Reports (2026-06-07)

## Request

Create `Полученный отчет комиссионера` for sold items **11.05.2026–06.06.2026** from user spreadsheet (Salon + Clinic blocks).

## Period

`2026-05-11 00:00:00` → `2026-06-06 23:59:59`

## Created Documents

| Customer | Contract | Report | Sum | Lines | Units | ID |
|----------|----------|--------|-----|-------|-------|-----|
| ELITE SHAKIROVNA LADIES SALON L.L.C | **21** | **01374** | 1,545.00 AED | 7 | 14 | `d37cba36-628d-11f1-0a80-1ba10067f08e` |
| SHAKIROVNA ESTHETIC CLINIC L.L.C | **26** | **01375** | 905.00 AED | 6 | 6 | `d46467ec-628d-11f1-0a80-08090068a6d8` |

- [01374 Elite](https://online.moysklad.ru/app/#commissionreport/edit?id=d37cba36-628d-11f1-0a80-1ba10067f08e)
- [01375 Clinic](https://online.moysklad.ru/app/#commissionreport/edit?id=d46467ec-628d-11f1-0a80-08090068a6d8)

## Elite Salon Lines

| Code | Product | Qty |
|------|---------|-----|
| `00053` | EyeCell Eye Peptide Gel Patch (box) | 1 |
| `00189` | Skin Rescue Overnight Cream Mask 100g | 1 |
| `00144` | Skin Caring Blemish Balm Cushion #2 Beige | 3 |
| `54464` | Skin Caring Blemish Balm Cushion #3 Camel | 1 |
| `00021` | Snow O₂ Cleanser 180ml | 3 |
| `00063` | Intensive Repair Collagen Mask 23g | 1 |
| `00140` | Soothing Bomb Sea Algae Mask 23g | 4 |

Table had sea mask **25g** → posted as catalog **23g** (`00140`), same as other Shakirovna reports.

## Clinic Lines

| Code | Product | Qty |
|------|---------|-----|
| `00122` | Multi-Vita Radiance Cream 50g | 1 |
| `00144` | Skin Caring Blemish Balm Cushion #2 Beige | 1 |
| `54464` | Skin Caring Blemish Balm Cushion #3 Camel | 1 |
| `00021` | Snow O₂ Cleanser 180ml | 1 |
| `00145` | Problem Control Toner 200ml | 1 |
| `00029` | Problem Control Serum 30ml | 1 |

## Script

`scripts/moysklad-create-shakirovna-elite-clinic-commission-20260607.js`
