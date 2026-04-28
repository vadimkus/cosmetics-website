# Ulbossyn Saparbayeva Commission Report

Date: 2026-04-27

## Request

Create a MoySklad `Полученный отчет комиссионера` for commissioner `Ulbossyn Saparbayeva` with the listed GENOSYS consignment sales items.

Follow-up request: create an `Отгрузка` for the same customer, same agreement, and same item list.

## Created Document

- MoySklad entity: `commissionreportin`
- Document: `01331`
- ID: `724bb9c4-425b-11f1-0a80-11240084dadc`
- UI: `https://online.moysklad.ru/app/#commissionreport/edit?id=724bb9c4-425b-11f1-0a80-11240084dadc`
- Commissioner: `Ulbossyn Saparbayeva`
- Contract: `00043` / `b2b25665-af1a-11ec-0a80-03530002ffd7`
- Date/time: `2026-04-27 21:05:00`
- VAT: enabled, included
- State: `Not paid` (no payment document was requested or created)
- Total quantity: `43 pcs`
- Total sum: `3,655.00 AED`
- VAT sum per MoySklad: `174.01 AED`

## Created Shipment

- MoySklad entity: `demand`
- Document: `06044`
- ID: `100b5414-425e-11f1-0a80-09740084906f`
- UI: `https://online.moysklad.ru/app/#demand/edit?id=100b5414-425e-11f1-0a80-09740084906f`
- Customer: `Ulbossyn Saparbayeva`
- Contract: `00043` / `b2b25665-af1a-11ec-0a80-03530002ffd7`
- Warehouse: `Genosys Warehouse` / `e186d449-33c5-11ea-0a80-043f000b273a`
- Date/time: `2026-04-27 21:25:00`
- VAT: enabled, included
- State: `отгружен`
- Total quantity: `43 pcs`
- Total sum: `3,655.00 AED`
- VAT sum per MoySklad: `174.01 AED`

## Lines Added

| Code | Item | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `00021` | Genosys Snow O2 Cleanser 180ml | 3 | 165.00 | 495.00 |
| `00188` | Genosys Microbiome Energy Infusing Mist 80ml | 1 | 80.00 | 80.00 |
| `00190` | Genosys Multi Functional Anti-Wrinkle Cream 50g | 2 | 145.00 | 290.00 |
| `00122` | Genosys Multi-Vita Radiance Cream 50g | 1 | 145.00 | 145.00 |
| `00029` | Genosys Problem Control Serum 30ml | 2 | 165.00 | 330.00 |
| `00145` | Genosys Problem Control Toner 200ml | 1 | 130.00 | 130.00 |
| `00129` | Genosys EPI Turnover Boosting Peeling Gel 100g | 2 | 125.00 | 250.00 |
| `00040` | Genosys Intensive Blemish Balm Cream 50g | 2 | 125.00 | 250.00 |
| `00191` | Genosys Multi Functional Anti-Wrinkle Serum 30ml | 2 | 165.00 | 330.00 |
| `54457` | Genosys Ultra Shield Sun Cream SPF50/PA++++ 50g | 2 | 125.00 | 250.00 |
| `00041` | Genosys Multi Sun Cream SPF40/PA++ 40g | 1 | 105.00 | 105.00 |
| `00194` | Genosys Multi Vita Radiance Serum 30ml | 3 | 165.00 | 495.00 |
| `54458` | Genosys Moisture Replenishing Hyaluron Cream 50g | 1 | 145.00 | 145.00 |
| `00140` | Genosys Soothing Bomb Sea Algae Mask 23g | 10 | 18.00 | 180.00 |
| `00063` | Genosys Intensive Repair Collagen Mask 23g | 10 | 18.00 | 180.00 |

## Implementation

Created one-use script:

`scripts/moysklad-create-ulbossyn-commission-report-20260427.js`

Created follow-up one-use shipment script:

`scripts/moysklad-create-ulbossyn-demand-20260427.js`

The script:

- Uses `MOYSKLAD_LOGIN` and `MOYSKLAD_PASSWORD` from `.env`.
- Resolves current MoySklad stock report rows by product code.
- Uses MoySklad sale prices from the stock report.
- Includes duplicate protection for the same commissioner/date/description marker.
- Runs as dry run by default and only writes when called with `--commit`.
- The shipment script additionally checks sufficient stock and posts `/entity/demand` with contract `00043`, warehouse `Genosys Warehouse`, and state `отгружен`.

## Verification

After creation, the report was re-read from MoySklad:

- Document `01331` exists.
- Sum is `3,655.00 AED`.
- `vatEnabled=true` and `vatIncluded=true`.
- `payedSum=0`, matching that no linked payment was created.
- `positions=15`.
- Recomputed line total from positions equals `3,655.00 AED`.
- Script file has no IDE linter errors.
- Shipment `06044` was re-read from MoySklad:
  - `positions=15`
  - contract matches `00043`
  - store matches `Genosys Warehouse`
  - state is `отгружен`
  - recomputed line total equals `3,655.00 AED`
  - shipment script has no IDE linter errors.
