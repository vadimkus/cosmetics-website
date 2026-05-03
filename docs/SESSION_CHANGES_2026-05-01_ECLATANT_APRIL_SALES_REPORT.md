# Eclatant April 2026 Sales Report

Date: 2026-05-01

## Request

Read `/Users/vadimkus/Desktop/Genosys sales april.xlsx` and create a MoySklad sales report for customer `Eclatant`.

Workbook structure:

- Sheet: `Sales summary`
- Columns: `Item`, `Items sold`
- The workbook has no separate customer column, so the full sheet was treated as Eclatant's April sales list.

## Created Document

- MoySklad customer: `ECLATANT&CO TRADING CO L.L.C`
- Counterparty ID: `0df9bafd-1a99-11f0-0a80-08b100073e9f`
- Contract: `18`
- Contract ID: `132684fd-1a99-11f0-0a80-071f0006a1ec`
- `Полученный отчет комиссионера`: `01336`
- Report ID: `b1155a6a-4550-11f1-0a80-162600385f1e`
- Moment: `2026-05-01 15:30:00`
- Commission period: `2026-04-01 00:00:00` to `2026-04-30 23:59:59`
- State: `Not paid`
- Total quantity: `31`
- Total: `3,169.00 AED` VAT-inclusive
- UI: `https://online.moysklad.ru/app/#commissionreport/edit?id=b1155a6a-4550-11f1-0a80-162600385f1e`

## Lines

| Code | Product | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `54467` | Genosys Skin Reboot PDRN mask Pack (30 sheets) 350g | 3 | 200.00 | 600.00 |
| `00051` | Genosys HR³ Matrix Hair Tonic 70ml | 4 | 145.00 | 580.00 |
| `00012` | Genosys Peptide Gel Mask 39g | 10 | 38.00 | 380.00 |
| `54457` | Genosys Ultra Shield Sun Cream SPF50/PA++++ 50g | 2 | 125.00 | 250.00 |
| `00144` | Genosys Skin Caring Blemish Balm Cushion #2 Biege | 2 | 150.00 | 300.00 |
| `00031` | Genosys Intensive Hydro Soothing Cream 50g | 1 | 145.00 | 145.00 |
| `00122` | Genosys Multi-Vita Radiance Cream 50g | 1 | 145.00 | 145.00 |
| `00022` | Genosys Snow Booster Toner 200ml | 1 | 130.00 | 130.00 |
| `00041` | Genosys Multi Sun Cream SPF40/PA++ 40g | 1 | 105.00 | 105.00 |
| `00052` | Genosys HR³ Matrix Scalp & Hair Shampoo 300ml | 1 | 170.00 | 170.00 |
| `00035` | Genosys Intensive Problem Control Cream 50g | 1 | 145.00 | 145.00 |
| `00140` | Genosys Soothing Bomb Sea Algae Mask 23g | 2 | 18.00 | 36.00 |
| `00063` | Genosys Intensive Repair Collagen Mask 23g | 1 | 18.00 | 18.00 |
| `00021` | Genosys Snow O₂ Cleanser 180ml | 1 | 165.00 | 165.00 |

## Verification

Readback from MoySklad confirmed:

- Report `01336`
- Customer `ECLATANT&CO TRADING CO L.L.C`
- Contract `18`
- State `Not paid`
- 14 lines, 31 total units
- Total sum `3,169.00 AED`
- No Eclatant received commission report existed for May 2026 before creation.
