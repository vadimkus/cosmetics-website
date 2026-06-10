# Viktoriia Klymenko MoySklad Commission Report and Shipment

Date: 2026-05-04

## Request

Create one more MoySklad `Полученный отчет комиссионера` and matching `Отгрузка` in the agreement for `Viktoriia Klimenko`.

## Customer / Agreement

- Customer in MoySklad: `Viktoriia Klymenko`
- Note: user wrote `Klimenko`; MoySklad matching customer is spelled `Klymenko`
- Counterparty ID: `fadad040-1090-11f1-0a80-00c800748f51`
- Agreement / Contract: `33`
- Agreement / Contract ID: `419cb77b-1091-11f1-0a80-103000292afc`

## Created Documents

- `Полученный отчет комиссионера`: `01342`
  - ID: `11f2cc92-479a-11f1-0a80-0413002cba3d`
  - Total: `780.00 AED` VAT-inclusive
  - Lines: `5`
  - Quantity: `6`
  - UI: `https://online.moysklad.ru/app/#commissionreport/edit?id=11f2cc92-479a-11f1-0a80-0413002cba3d`

- `Отгрузка`: `06089`
  - ID: `12a718e2-479a-11f1-0a80-0c3d002cdee9`
  - Total: `780.00 AED` VAT-inclusive
  - Lines: `5`
  - Quantity: `6`
  - Warehouse: `Genosys Warehouse`
  - UI: `https://online.moysklad.ru/app/#demand/edit?id=12a718e2-479a-11f1-0a80-0c3d002cdee9`

## Lines

| Code | Product | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `00143` | Genosys Skin Caring Blemish Balm Cushion #1 Ivory | 1 | 150.00 | 150.00 |
| `00144` | Genosys Skin Caring Blemish Balm Cushion #2 Biege | 1 | 150.00 | 150.00 |
| `54464` | Genosys Skin Caring Blemish Balm Cushion #3 Camel | 1 | 150.00 | 150.00 |
| `00188` | Genosys Microbiome Energy Infusing Mist 80ml | 2 | 80.00 | 160.00 |
| `00189` | Genosys Skin Rescue Overnight Cream Mask 100g | 1 | 170.00 | 170.00 |

## Implementation

Created one-use script:

`scripts/moysklad-create-viktoriia-klymenko-sales-20260504.js`

The script:

- Resolves products from the MoySklad stock report by code.
- Uses current MoySklad sale prices.
- Creates both the received commissioner report and shipment with the same 5 lines.
- Checks sufficient stock before creating the shipment.
- Uses duplicate protection via date + marker in each document description.

## Verification

Readback confirmed:

- Report `01342` uses counterparty `Viktoriia Klymenko` and agreement `33`.
- Shipment `06089` uses the same counterparty, agreement `33`, and warehouse `Genosys Warehouse`.
- Both documents recompute to `780.00 AED`, with `5` lines and `6` units.
