# Melanta MoySklad Sales Report and Shipment

Date: 2026-05-02

## Request

Create a MoySklad `Полученный отчет комиссионера` for `Melanta` and create the same `Отгрузка` into the agreement.

## Customer / Contract

- Customer in MoySklad: `Melanta Poly Clinic L.L.C`
- Counterparty ID: `c3908257-ccdd-11ef-0a80-11a10053430e`
- Contract: `14`
- Contract ID: `ca7a8aa6-ccdd-11ef-0a80-18080052ee1c`

Note: MoySklad also has `Dr. Andreea Melanta Clinic`, but that counterparty has no agreement. Prior Melanta consignment reports and shipments use `Melanta Poly Clinic L.L.C` / contract `14`.

## Created Documents

- `Полученный отчет комиссионера`: `01339`
  - ID: `82965782-4630-11f1-0a80-103a005ab1cc`
  - Total: `1,385.00 AED` VAT-inclusive
  - Lines: `7`
  - Quantity: `8`
  - UI: `https://online.moysklad.ru/app/#commissionreport/edit?id=82965782-4630-11f1-0a80-103a005ab1cc`

- `Отгрузка`: `06078`
  - ID: `8336449e-4630-11f1-0a80-08a800591e63`
  - Total: `1,385.00 AED` VAT-inclusive
  - Lines: `7`
  - Quantity: `8`
  - UI: `https://online.moysklad.ru/app/#demand/edit?id=8336449e-4630-11f1-0a80-08a800591e63`

## Lines

| Code | Product | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `00055` | Genosys EyeCell Eye Contour Cream 20ml | 1 | 185.00 | 185.00 |
| `00144` | Genosys Skin Caring Blemish Balm Cushion #2 Biege | 1 | 150.00 | 150.00 |
| `00189` | Genosys Skin Rescue Overnight Cream Mask 100g | 1 | 170.00 | 170.00 |
| `54464` | Genosys Skin Caring Blemish Balm Cushion #3 Camel | 1 | 150.00 | 150.00 |
| `00054` | Genosys EyeCell Eye Contour Serum 10ml | 1 | 185.00 | 185.00 |
| `00042` | Genosys EGF Repair Oxymask Cream 50ml | 1 | 145.00 | 145.00 |
| `54467` | Genosys Skin Reboot PDRN mask Pack (30 sheets) 350g | 2 | 200.00 | 400.00 |

## Implementation

Created one-use script:

`scripts/moysklad-create-melanta-sales-20260502.js`

The script:

- Resolves products from the MoySklad stock report by code.
- Uses current MoySklad sale prices.
- Creates both the received commissioner report and shipment with the same 7 lines.
- Checks sufficient stock for the shipment.
- Uses duplicate protection via date + marker in description.

## Verification

Readback confirmed:

- Report `01339` uses counterparty `Melanta Poly Clinic L.L.C` and contract `14`.
- Shipment `06078` uses the same counterparty and contract, and warehouse `Genosys Warehouse`.
- Both documents are applicable and not deleted.
- Both documents recompute to `1,385.00 AED`, with `7` lines and `8` units.
