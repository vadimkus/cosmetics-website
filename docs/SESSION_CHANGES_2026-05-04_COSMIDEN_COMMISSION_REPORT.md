# Cosmiden MoySklad Commission Report

Date: 2026-05-04

## Request

Create a MoySklad `Полученный отчет комиссионера` only for `Cosmiden`.

## Customer / Agreement

- Customer in MoySklad: `COSMIDEN MEDICAL CENTER L.L.C`
- Counterparty ID: `d7b0a67f-d5a2-11ef-0a80-16cd0019b6b8`
- Agreement / Contract: `15`
- Agreement / Contract ID: `69b01872-d7dd-11ef-0a80-0725003ffada`

## Created Document

- `Полученный отчет комиссионера`: `01343`
  - ID: `f4db5bc4-47d6-11f1-0a80-1972003bc653`
  - Total: `964.00 AED` VAT-inclusive
  - Lines: `6`
  - Quantity: `28`
  - UI: `https://online.moysklad.ru/app/#commissionreport/edit?id=f4db5bc4-47d6-11f1-0a80-1972003bc653`

## Lines

| Code | Product | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `00022` | Genosys Snow Booster Toner 200ml | 1 | 130.00 | 130.00 |
| `00143` | Genosys Skin Caring Blemish Balm Cushion #1 Ivory | 1 | 150.00 | 150.00 |
| `00144` | Genosys Skin Caring Blemish Balm Cushion #2 Biege | 1 | 150.00 | 150.00 |
| `00063` | Genosys Intensive Repair Collagen Mask 23g | 11 | 18.00 | 198.00 |
| `00140` | Genosys Soothing Bomb Sea Algae Mask 23g | 13 | 18.00 | 234.00 |
| `00038` | Genosys Soothing Repair Post Cream 20g | 1 | 102.00 | 102.00 |

## Implementation

Created one-use script:

`scripts/moysklad-create-cosmiden-commission-report-20260504.js`

The script:

- Resolves products from the MoySklad stock report by code.
- Uses current MoySklad sale prices.
- Creates only the received commissioner report, with no matching `Отгрузка`.
- Uses duplicate protection via date + marker in description.

## Verification

Readback confirmed:

- Report `01343` uses counterparty `COSMIDEN MEDICAL CENTER L.L.C` and agreement `15`.
- Report total recomputes to `964.00 AED`, with `6` lines and `28` units.
- User wrote Collagen/Sea Algae masks as `16g`; MoySklad active mask SKUs are catalogued as `23g`, so report uses `00063` and `00140`.
