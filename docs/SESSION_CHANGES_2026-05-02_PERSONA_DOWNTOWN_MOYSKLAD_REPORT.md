# Persona Downtown MoySklad Sales Report and Shipment

Date: 2026-05-02

## Request

Create a MoySklad sales report for `Persona Downtown`, and create an `Отгрузка` under the same Persona Downtown contract for only the HR3 hair items.

## Customer / Contract

- Customer in MoySklad: `First Person Ladies Salon (Downtown)`
- Persona label/address note: `Persona Image Lab`, South Ridge Tower 1, Downtown
- Counterparty ID: `19f661fb-b43b-11ee-0a80-0d3b00075ace`
- Contract: `00077`
- Contract ID: `2092d415-b43b-11ee-0a80-095a000715c8`

## Created Documents

- `Полученный отчет комиссионера`: `01337`
  - ID: `31177937-4626-11f1-0a80-03c5005767d1`
  - Total: `610.00 AED` VAT-inclusive
  - Lines: `3`
  - Quantity: `4`
  - UI: `https://online.moysklad.ru/app/#commissionreport/edit?id=31177937-4626-11f1-0a80-03c5005767d1`

- `Отгрузка`: `06073`
  - ID: `31972e47-4626-11f1-0a80-08a8005712a5`
  - Total: `460.00 AED` VAT-inclusive
  - Lines: `2`
  - Quantity: `3`
  - UI: `https://online.moysklad.ru/app/#demand/edit?id=31972e47-4626-11f1-0a80-08a8005712a5`

## Sales Report Lines

| Code | Product | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `00144` | Genosys Skin Caring Blemish Balm Cushion #2 Biege | 1 | 150.00 | 150.00 |
| `00051` | Genosys HR³ Matrix Hair Tonic 70ml | 2 | 145.00 | 290.00 |
| `00052` | Genosys HR³ Matrix Scalp & Hair Shampoo 300ml | 1 | 170.00 | 170.00 |

## Shipment Lines

| Code | Product | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `00051` | Genosys HR³ Matrix Hair Tonic 70ml | 2 | 145.00 | 290.00 |
| `00052` | Genosys HR³ Matrix Scalp & Hair Shampoo 300ml | 1 | 170.00 | 170.00 |

## Implementation

Created one-use script:

`scripts/moysklad-create-persona-downtown-sales-20260502.js`

The script:

- Resolves products from the MoySklad stock report by code.
- Uses current MoySklad sale prices.
- Creates the report with all 3 sold lines.
- Creates the shipment with only the 2 HR3 stock-movement lines requested.
- Uses duplicate protection via date + marker in description.

## Verification

Readback confirmed:

- Report `01337` uses counterparty `First Person Ladies Salon (Downtown)` and contract `00077`.
- Shipment `06073` uses the same counterparty and contract, and warehouse `Genosys Warehouse`.
- Report total recomputes to `610.00 AED`, with `3` lines and `4` units.
- Shipment total recomputes to `460.00 AED`, with `2` lines and `3` units.
