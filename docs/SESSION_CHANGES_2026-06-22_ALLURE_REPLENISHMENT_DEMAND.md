# Allure — отгрузка по договору 00045 (2026-06-22)

**Customer:** Allure (`9e0a2de1-b31e-11ec-0a80-05e20009d062`)  
**Agreement:** 00045 (`c1165028-bbc8-11ec-0a80-03f80018fdc3`)

| Doc | Number | Sum | ID |
|-----|--------|-----|-----|
| Отгрузка | **06396** | **2,490.00 AED** | `a43a430a-6e08-11f1-0a80-1d59007a9faa` |

[Open in MoySklad](https://online.moysklad.ru/app/#demand/edit?id=a43a430a-6e08-11f1-0a80-1d59007a9faa)

Replenishment only — same day commission report **01382** (sold items) is separate.

## Lines (MoySklad list prices, VAT incl.)

| Code | Product | Qty | Unit | Line |
|------|---------|----:|-----:|-----:|
| `00035` | Intensive Problem Control Cream 50g | 1 | 145 | 145 |
| `00122` | Multi-Vita Radiance Cream 50g | 3 | 145 | 435 |
| `00190` | Multi Functional Anti-Wrinkle Cream 50g | 2 | 145 | 290 |
| `00055` | EyeCell Eye Contour Cream 20ml | 2 | 185 | 370 |
| `00054` | EyeCell Eye Contour Serum 10ml | 2 | 185 | 370 |
| `54457` | Ultra Shield Sun Cream SPF50 50g | 2 | 125 | 250 |
| `00144` | BB Cushion #2 Beige | 1 | 150 | 150 |
| `00143` | BB Cushion #1 Ivory | 1 | 150 | 150 |
| `00194` | Multi Vita Radiance Serum 30ml | 2 | 165 | 330 |

**Total:** 2,490 AED (16 pcs × 9 lines)

## Mapping notes

- Problem control **cream** = `00035` (not serum `00029`).
- Eye **cream** = `00055`; eye **serum** = `00054`.
- Cushion Ivory = `00143` #1; Beige = `00144` #2.

## Script

`scripts/moysklad-create-allure-replenishment-demand-20260622.js --commit`
