# Admin Shakirovna MoySklad Customer Order

Date: 2026-04-30

## Request

Create a new MoySklad `Заказ покупателя` for `Admin Shakirovna` using wholesale (`оптовая`) prices:

- Mist x1
- Ivory x1
- Biege x1

## Created Order

- MoySklad customer: `Admin Shakirovna Salon`
- Counterparty ID: `8619c8a7-eb46-11ed-0a80-00cb00846a48`
- Order: `GENCardM2604308781`
- Order ID: `29373f1b-4469-11f1-0a80-013a0010d413`
- Moment: `2026-04-30 11:55:00`
- State: `New`
- Total quantity: `3`
- Total: `380.00 AED` VAT-inclusive
- UI: `https://online.moysklad.ru/app/#customerorder/edit?id=29373f1b-4469-11f1-0a80-013a0010d413`

## Lines

| Code | Product | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `00188` | Genosys Microbiome Energy Infusing Mist 80ml | 1 | 80.00 | 80.00 |
| `00143` | Genosys Skin Caring Blemish Balm Cushion #1 Ivory | 1 | 150.00 | 150.00 |
| `00144` | Genosys Skin Caring Blemish Balm Cushion #2 Biege | 1 | 150.00 | 150.00 |

## Verification

Dry-run and readback confirmed:

- Counterparty matched exactly as `Admin Shakirovna Salon`.
- No same-day duplicate customer order existed before creation.
- Prices used the MoySklad `оптовая` price type.
- Free stock was sufficient at creation time:
  - Mist: `126`
  - Ivory: `51`
  - Biege: `258`
- Readback confirmed `vatIncluded=true`, `3` lines, `3` units, and total sum `380.00 AED`.
