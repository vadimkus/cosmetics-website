# Volna MoySklad Sales Report and Shipment

Date: 2026-05-02

## Request

Create a MoySklad `Полученный отчет комиссионера` for `Salon Volna` from the attached sold-items screenshot, and create a matching `Отгрузка` for the same items and quantities.

## Customer / Contract

- Customer in MoySklad: `Volna Beauty Salon L.L.C`
- Counterparty ID: `aeaaf63a-2985-11f0-0a80-0dfc0049a5f1`
- Contract: `19`
- Contract ID: `40556e6d-2986-11f0-0a80-03d10049fb5c`

## Created Documents

- `Полученный отчет комиссионера`: `01338`
  - ID: `824f70e1-462a-11f1-0a80-0b9900584111`
  - Total: `402.00 AED` VAT-inclusive
  - Lines: `4`
  - Quantity: `6`
  - UI: `https://online.moysklad.ru/app/#commissionreport/edit?id=824f70e1-462a-11f1-0a80-0b9900584111`

- `Отгрузка`: `06075`
  - ID: `82dbb510-462a-11f1-0a80-0d8000586d85`
  - Total: `402.00 AED` VAT-inclusive
  - Lines: `4`
  - Quantity: `6`
  - UI: `https://online.moysklad.ru/app/#demand/edit?id=82dbb510-462a-11f1-0a80-0d8000586d85`

## Lines

| Code | Product | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `00195` | Genosys Moisture Replenishing Hyaluron Serum 30ml | 1 | 165.00 | 165.00 |
| `00063` | Genosys Intensive Repair Collagen Mask 23g | 2 | 18.00 | 36.00 |
| `00029` | Genosys Problem Control Serum 30ml | 1 | 165.00 | 165.00 |
| `00140` | Genosys Soothing Bomb Sea Algae Mask 23g | 2 | 18.00 | 36.00 |

## Implementation

Created one-use script:

`scripts/moysklad-create-volna-sales-20260502.js`

The script:

- Resolves products from the MoySklad stock report by code.
- Uses current MoySklad sale prices.
- Creates both the received commissioner report and shipment with the same 4 lines.
- Checks sufficient stock for the shipment.
- Uses duplicate protection via date + marker in description.

## Verification

Readback confirmed:

- Report `01338` uses counterparty `Volna Beauty Salon L.L.C` and contract `19`.
- Shipment `06075` uses the same counterparty and contract, and warehouse `Genosys Warehouse`.
- Both documents recompute to `402.00 AED`, with `4` lines and `6` units.
