# Persona Dubai Marina MoySklad Commission Report

Date: 2026-05-04

## Request

Create a MoySklad `Полученный отчет комиссионера` for `Persona Dubai Marina` from the supplied sold-items list.

## Customer / Contract

- Customer in MoySklad: `First Person Ladies Salon (Marina)`
- Persona label/address note: `UNIQUE PERSONA, Dubai Marina`
- Counterparty ID: `af21a79a-63cd-11ea-0a80-02b2000e2aeb`
- Contract: `00024`
- Contract ID: `56ca0166-c388-11eb-0a80-093a001d1ee0`

## Created Document

- `Полученный отчет комиссионера`: `01340`
  - ID: `bbb818f8-4782-11f1-0a80-02b300270d2e`
  - Total: `2,654.00 AED` VAT-inclusive
  - Lines: `16`
  - Quantity: `20`
  - UI: `https://online.moysklad.ru/app/#commissionreport/edit?id=bbb818f8-4782-11f1-0a80-02b300270d2e`

## Lines

| Code | Product | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `00144` | Genosys Skin Caring Blemish Balm Cushion #2 Biege | 1 | 150.00 | 150.00 |
| `54467` | Genosys Skin Reboot PDRN mask Pack (30 sheets) 350g | 3 | 200.00 | 600.00 |
| `00063` | Genosys Intensive Repair Collagen Mask 23g | 1 | 18.00 | 18.00 |
| `00012` | Genosys Peptide Gel Mask 39g | 1 | 38.00 | 38.00 |
| `00122` | Genosys Multi-Vita Radiance Cream 50g | 2 | 145.00 | 290.00 |
| `00052` | Genosys HR³ Matrix Scalp & Hair Shampoo 300ml | 1 | 170.00 | 170.00 |
| `00051` | Genosys HR³ Matrix Hair Tonic 70ml | 1 | 145.00 | 145.00 |
| `00022` | Genosys Snow Booster Toner 200ml | 1 | 130.00 | 130.00 |
| `00074` | Genosys Stamp 0.25mm | 1 | 100.00 | 100.00 |
| `54457` | Genosys Ultra Shield Sun Cream SPF50/PA++++ 50g | 1 | 125.00 | 125.00 |
| `00041` | Genosys Multi Sun Cream SPF40/PA++ 40g | 1 | 105.00 | 105.00 |
| `00044` | Genosys ND Cell Anti-Wrinkle Cream 50ml | 1 | 185.00 | 185.00 |
| `00035` | Genosys Intensive Problem Control Cream 50g | 2 | 145.00 | 290.00 |
| `00190` | Genosys Multi Functional Anti-Wrinkle Cream 50g | 1 | 145.00 | 145.00 |
| `00140` | Genosys Soothing Bomb Sea Algae Mask 23g | 1 | 18.00 | 18.00 |
| `00031` | Genosys Intensive Hydro Soothing Cream 50g | 1 | 145.00 | 145.00 |

## Implementation

Created one-use script:

`scripts/moysklad-create-persona-marina-commission-report-20260504.js`

The script:

- Resolves products from the MoySklad stock report by code.
- Uses current MoySklad sale prices.
- Creates only the received commissioner report, with no matching `Отгрузка`.
- Uses duplicate protection via date + marker in description.

## Verification

Readback confirmed:

- Report `01340` uses counterparty `First Person Ladies Salon (Marina)` and contract `00024`.
- Report total recomputes to `2,654.00 AED`, with `16` lines and `20` units.
- The PDRN line follows the existing Persona Marina mapping: `54467` `Genosys Skin Reboot PDRN mask Pack (30 sheets) 350g`.
