# Eclatant MoySklad Customer Order

Date: 2026-04-30

## Request

Create a new MoySklad `Заказ покупателя` for `Eclatant`:

- Gel Peptide Mask x25 pcs
- PDRN Mask x5 boxes
- Cushion Biege x5 pcs
- Hyaluron Cream x3 pcs

## Created Order

- MoySklad customer: `ECLATANT&CO TRADING CO L.L.C`
- Counterparty ID: `0df9bafd-1a99-11f0-0a80-08b100073e9f`
- Order: `GENCardM2604308782`
- Order ID: `b07eaf4d-4485-11f1-0a80-08a8001734f7`
- Moment: `2026-04-30 15:15:00`
- State: `New`
- Total quantity: `38`
- Total: `3,135.00 AED` VAT-inclusive
- UI: `https://online.moysklad.ru/app/#customerorder/edit?id=b07eaf4d-4485-11f1-0a80-08a8001734f7`

## Lines

| Code | Product | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `00012` | Genosys Peptide Gel Mask 39g | 25 | 38.00 | 950.00 |
| `54467` | Genosys Skin Reboot PDRN mask Pack (30 sheets) 350g | 5 | 200.00 | 1,000.00 |
| `00144` | Genosys Skin Caring Blemish Balm Cushion #2 Biege | 5 | 150.00 | 750.00 |
| `54458` | Genosys Moisture Replenishing Hyaluron Cream 50g | 3 | 145.00 | 435.00 |

## Verification

Dry-run and readback confirmed:

- Counterparty matched exactly as `ECLATANT&CO TRADING CO L.L.C`.
- No same-day Eclatant customer order existed before creation.
- Prices used the MoySklad `оптовая` price type.
- Free stock was sufficient at creation time:
  - Peptide Gel Mask 39g: `1,314`
  - PDRN Mask Pack: `151`
  - BB Cushion #2 Biege: `257`
  - Hyaluron Cream 50g: `55`
- Readback confirmed `vatIncluded=true`, `4` lines, `38` total units, and total sum `3,135.00 AED`.
