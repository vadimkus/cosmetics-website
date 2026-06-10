# Refresh Clinic MoySklad Commission Report and Shipment

Date: 2026-05-04

## Request

Create a MoySklad `Полученный отчет комиссионера` for `Refresh Clinic`, and create a matching `Отгрузка` in the same agreement for the same items and quantities.

## Customer / Agreement

- Customer in MoySklad: `REFRESH BIOHACKING CLINIC L.L.C`
- Counterparty ID: `a6e52a6a-a2d6-11f0-0a80-03b9004ee0de`
- Agreement / Contract: `24`
- Agreement / Contract ID: `dc3ad805-a2d6-11f0-0a80-0d1c0051970b`

## Created Documents

- `Полученный отчет комиссионера`: `01341`
  - ID: `0aacb861-478a-11f1-0a80-1a3b002936c7`
  - Total: `2,643.00 AED` VAT-inclusive
  - Lines: `13`
  - Quantity: `21`
  - UI: `https://online.moysklad.ru/app/#commissionreport/edit?id=0aacb861-478a-11f1-0a80-1a3b002936c7`

- `Отгрузка`: `06087`
  - ID: `0b633178-478a-11f1-0a80-1a3b002936ff`
  - Total: `2,643.00 AED` VAT-inclusive
  - Lines: `13`
  - Quantity: `21`
  - Warehouse: `Genosys Warehouse`
  - UI: `https://online.moysklad.ru/app/#demand/edit?id=0b633178-478a-11f1-0a80-1a3b002936ff`

## Lines

| Code | Product | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `00021` | Genosys Snow O₂ Cleanser 180ml | 2 | 165.00 | 330.00 |
| `00037` | Genosys Skin Barrier Protecting Cream 100g | 2 | 225.00 | 450.00 |
| `00054` | Genosys EyeCell Eye Contour Serum 10ml | 1 | 185.00 | 185.00 |
| `00055` | Genosys EyeCell Eye Contour Cream 20ml | 1 | 185.00 | 185.00 |
| `00063` | Genosys Intensive Repair Collagen Mask 23g | 3 | 18.00 | 54.00 |
| `00122` | Genosys Multi-Vita Radiance Cream 50g | 1 | 145.00 | 145.00 |
| `00140` | Genosys Soothing Bomb Sea Algae Mask 23g | 3 | 18.00 | 54.00 |
| `00144` | Genosys Skin Caring Blemish Balm Cushion #2 Biege | 3 | 150.00 | 450.00 |
| `00145` | Genosys Problem Control Toner 200ml | 1 | 130.00 | 130.00 |
| `00191` | Genosys Multi Functional Anti-Wrinkle Serum 30ml | 1 | 165.00 | 165.00 |
| `54458` | Genosys Moisture Replenishing Hyaluron Cream 50g | 1 | 145.00 | 145.00 |
| `54464` | Genosys Skin Caring Blemish Balm Cushion #3 Camel | 1 | 150.00 | 150.00 |
| `54467` | Genosys Skin Reboot PDRN mask Pack (30 sheets) 350g | 1 | 200.00 | 200.00 |

## Implementation

Created one-use script:

`scripts/moysklad-create-refresh-clinic-sales-20260504.js`

The script:

- Resolves products from the MoySklad stock report by code.
- Uses current MoySklad sale prices.
- Creates both the received commissioner report and shipment with the same 13 lines.
- Checks sufficient stock before creating the shipment.
- Uses duplicate protection via date + marker in each document description.

## Verification

Readback confirmed:

- Report `01341` uses counterparty `REFRESH BIOHACKING CLINIC L.L.C` and agreement `24`.
- Shipment `06087` uses the same counterparty, agreement `24`, and warehouse `Genosys Warehouse`.
- Both documents recompute to `2,643.00 AED`, with `13` lines and `21` units.
