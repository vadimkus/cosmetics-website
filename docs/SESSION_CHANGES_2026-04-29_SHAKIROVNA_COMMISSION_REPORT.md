# Shakirovna MoySklad Commission Report and Shipment

Date: 2026-04-29

## Request

Create a MoySklad `Полученный отчет комиссионера` for `Shakirovna Ladies Beauty Saloon` from the supplied product table photo, and create a matching `Отгрузка` for the same customer and same contract.

## Customer / Contract

- Customer: `Shakirovna Ladies Beauty Saloon`
- Counterparty ID: `93775ae5-d18d-11ea-0a80-02e00008417d`
- Contract: `00030`
- Contract ID: `f5a1958d-c3ca-11eb-0a80-048e0027cbcb`

## Created Documents

- `Полученный отчет комиссионера`: `01332`
  - ID: `bdd73287-43a1-11f1-0a80-14b600119131`
  - Total: `1,598.00 AED` VAT-inclusive
  - Lines: `11`
  - Quantity: `12`
  - UI: `https://online.moysklad.ru/app/#commissionreport/edit?id=bdd73287-43a1-11f1-0a80-14b600119131`

- `Отгрузка`: `06051`
  - ID: `be7bb4de-43a1-11f1-0a80-0fb50010c84a`
  - Total: `1,598.00 AED` VAT-inclusive
  - Lines: `11`
  - Quantity: `12`
  - UI: `https://online.moysklad.ru/app/#demand/edit?id=be7bb4de-43a1-11f1-0a80-0fb50010c84a`

## Lines

| Code | Product | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `00031` | Genosys Intensive Hydro Soothing Cream 50g | 1 | 145.00 | 145.00 |
| `00122` | Genosys Multi-Vita Radiance Cream 50g | 1 | 145.00 | 145.00 |
| `00188` | Genosys Microbiome Energy Infusing Mist 80ml | 1 | 80.00 | 80.00 |
| `54457` | Genosys Ultra Shield Sun Cream SPF50/PA++++ 50g | 1 | 125.00 | 125.00 |
| `00195` | Genosys Moisture Replenishing Hyaluron Serum 30ml | 1 | 165.00 | 165.00 |
| `00140` | Genosys Soothing Bomb Sea Algae Mask 23g | 1 | 18.00 | 18.00 |
| `00145` | Genosys Problem Control Toner 200ml | 1 | 130.00 | 130.00 |
| `00041` | Genosys Multi Sun Cream SPF40/PA++ 40g | 1 | 105.00 | 105.00 |
| `00189` | Genosys Skin Rescue Overnight Cream Mask 100g | 1 | 170.00 | 170.00 |
| `00021` | Genosys Snow O2 Cleanser 180ml | 2 | 165.00 | 330.00 |
| `00055` | Genosys EyeCell Eye Contour Cream 20ml | 1 | 185.00 | 185.00 |

## Verification

Readback confirmed:

- Both documents use customer `Shakirovna Ladies Beauty Saloon`.
- Both documents use contract `00030`.
- Both documents total `1,598.00 AED`.
- Both documents have `11` lines and `12` total units.
- Stock was sufficient at dry-run time.
