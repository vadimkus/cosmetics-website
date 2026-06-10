# Shakirovna Ladies Beauty Saloon — полученный отчёт комиссионера

**Date:** 2026-05-12

## Request

`Полученный отчёт комиссионера` для **Shakirovna Ladies Beauty Saloon** (таблица со скрина: 13 товаров).

## MoySklad

| Field | Value |
|--------|--------|
| Customer | Shakirovna Ladies Beauty Saloon `93775ae5-d18d-11ea-0a80-02e00008417d` |
| Contract | **00030** `f5a1958d-c3ca-11eb-0a80-048e0027cbcb` |
| Report | **01354** |
| ID | `090baff7-4e08-11f1-0a80-03d400c3c950` |
| Sum | **2,490.00 AED** VAT-inclusive |
| Lines / qty | 13 positions / **29 pcs** |
| Moment | 2026-05-12 18:00:00 |

[Open report](https://online.moysklad.ru/app/#commissionreport/edit?id=090baff7-4e08-11f1-0a80-03d400c3c950)

## Mapping (screenshot → codes)

| Qty | Code | Product |
|----:|------|---------|
| 1 | 54458 | Moisture Replenishing Hyaluron Cream 50g |
| 1 | 00037 | Skin Barrier Protecting Cream 100g |
| 1 | 54467 | Skin Reboot PDRN mask Pack |
| 3 | 00012 | Peptide Gel Mask 39g (screen 38g) |
| 1 | 00144 | BB Cushion #2 Beige |
| 2 | 00190 | Multi Functional Anti-Wrinkle Cream 50g |
| 1 | 00035 | Intensive Problem Control Cream 50g |
| 2 | 00041 | Multi Sun SPF40 |
| 1 | 00189 | Skin Rescue Overnight Cream Mask 100g |
| 3 | 00029 | Problem Control Serum 30ml |
| 3 | 00140 | Soothing Bomb Sea Algae Mask 23g (screen 25g) |
| 9 | 00063 | Intensive Repair Collagen Mask 23g |
| 1 | 00022 | Snow Booster Toner 200ml |

## Screenshot reference

`/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/Screenshot_2026-05-12_at_5.37.14_PM-c093da39-b2d7-4afc-aa24-de07bf9fd76d.png`

## Script

`scripts/moysklad-create-shakirovna-ladies-salon-commission-report-20260512.js`

---

## Отгрузка (те же позиции что 01354)

**Request:** отгрузка в договор комиссии тем же составом, что отчёт **01354**.

| Field | Value |
|--------|--------|
| Отгрузка | **06133** |
| ID | `5f8259f1-4e08-11f1-0a80-063600c51041` |
| Sum | **2,490.00 AED** |
| State | Отгружен |
| Moment | 2026-05-12 18:45:00 |

[Open Отгрузку](https://online.moysklad.ru/app/#demand/edit?id=5f8259f1-4e08-11f1-0a80-063600c51041)

Script: `scripts/moysklad-create-shakirovna-ladies-salon-demand-20260512.js`

---

## Stock reconciliation (2026-05-29)

Salon physical count vs books on contract **00030** — variances on 5 SKUs; shortages confirmed **lost** (not sold).

- **Docs:** возврат **00296** + списание **90.30 AED** buy + отгрузка **06247**
- **Full record:** [SESSION_CHANGES_2026-05-29_SHAKIROVNA_LADIES_STOCK_RECON.md](./SESSION_CHANGES_2026-05-29_SHAKIROVNA_LADIES_STOCK_RECON.md)
- **Playbook:** [CONSIGNMENT_STOCK_RECONCILIATION.md](./CONSIGNMENT_STOCK_RECONCILIATION.md)
- **Script:** `scripts/moysklad-create-shakirovna-ladies-salon-stock-recon-20260529.js`
