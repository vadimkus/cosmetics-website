# Allure — отчёт комиссионера (28.05.2026)

**Customer:** Allure (`9e0a2de1-b31e-11ec-0a80-05e20009d062`)  
**Agreement:** 00045 (`c1165028-bbc8-11ec-0a80-03f80018fdc3`)  
**Sales period:** 06.05 – 25.05.2026 | **Calculation:** 28.05.2026

## Document

| Type | Number | Sum | ID |
|------|--------|-----|-----|
| Полученный отчёт комиссионера | **01362** | **1,480.00 AED** | `cf973978-5a5a-11f1-0a80-0fa6000f799f` |

**Pricing:** MoySklad list (`salePrice`) — not handwritten notebook prices.  
Updated 28.05 after user request (was 1,490 with manual MVita @150; system list for 00122 is 145 → **1,480**).

[Open in MoySklad](https://online.moysklad.ru/app/#commissionreport/edit?id=cf973978-5a5a-11f1-0a80-0fa6000f799f)

Report only — no replenishment shipment (user request).

## Line mapping (handwritten notebook → MoySklad)

| Date(s) | Notebook | Code | Product | Qty | Unit AED |
|---------|----------|------|---------|-----|----------|
| 06.05 | Multi Functional AW cream | 00190 | Anti-Wrinkle Cream 50g | 1 | 145 |
| 06.05 | cushion n2 | 00144 | Blemish Balm Cushion #2 Beige | 1 | 150 |
| 06.05, 19.05, 25.05 | Cream MVita | 00122 | Multi-Vita Radiance Cream 50g | 3 | **145** (list) |
| 06.05 | Boosting Peeling | 00129 | EPI Turnover Boosting Peeling Gel | 1 | 125 |
| 06.05, 21.05 | Sun Cream 50 / SPF 50+ | 54457 | Ultra Shield SPF50 50g | 2 | 125 |
| 06.05 | Serum MVita | 00194 | Multi Vita Radiance Serum 30ml | 1 | 165 |
| 25.05 | SPF 40+ ×2 | 00041 | Multi Sun Cream SPF40 40g | 2 | 105 |

**Total:** 1,480 AED (11 pcs × MoySklad list prices)

## Scripts

- `scripts/moysklad-create-allure-commission-report-20260528.js` — create (list prices)
- `scripts/moysklad-fix-allure-report-01362-system-prices.js` — corrected live report 01362
