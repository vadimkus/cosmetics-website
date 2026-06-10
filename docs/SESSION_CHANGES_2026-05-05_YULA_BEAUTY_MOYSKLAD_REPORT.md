# Yula Beauty Salon MoySklad Commission Report and Shipment

Date: 2026-05-05

## Request

Create `Полученный отчет комиссионера` for Yula Beauty Salon: blemish balm cream x1, radiance cream 50g x1.

Create `Отгрузка` under the same agreement: radiance cream 50g x2, blemish balm cream x1.

## Customer / Agreement

- Customer in MoySklad: `Yula Beauty Salon LLC`
- Counterparty ID: `bfe39f3a-6c0f-11ef-0a80-10ba0004368c`
- Agreement / Contract: `12`
- Agreement / Contract ID: `f7304b4a-6cfa-11ef-0a80-0c23001f2f8c`

## Created Documents

- `Полученный отчет комиссионера`: `01344`
  - ID: `0d3aa703-487a-11f1-0a80-1b52001e5e0a`
  - Total: `270.00 AED` VAT-inclusive
  - Lines: `2` | Quantity: `2`
  - UI: `https://online.moysklad.ru/app/#commissionreport/edit?id=0d3aa703-487a-11f1-0a80-1b52001e5e0a`

- `Отгрузка`: `06091`
  - ID: `0da9e64d-487a-11f1-0a80-17ba001ef1fb`
  - Total: `415.00 AED` VAT-inclusive
  - Lines: `2` | Quantity: `3`
  - UI: `https://online.moysklad.ru/app/#demand/edit?id=0da9e64d-487a-11f1-0a80-17ba001ef1fb`

## Report lines (sales)

| Code | Product | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `00040` | Genosys Intensive Blemish Balm Cream 50g | 1 | 125.00 | 125.00 |
| `00122` | Genosys Multi-Vita Radiance Cream 50g | 1 | 145.00 | 145.00 |

## Shipment lines

| Code | Product | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `00122` | Genosys Multi-Vita Radiance Cream 50g | 2 | 145.00 | 290.00 |
| `00040` | Genosys Intensive Blemish Balm Cream 50g | 1 | 125.00 | 125.00 |

## Implementation

Script: `scripts/moysklad-create-yula-beauty-sales-20260505.js`

## Verification

Readback: report `01344` and demand `06091` use `Yula Beauty Salon LLC`, agreement `12`; sums and line quantities match above.
