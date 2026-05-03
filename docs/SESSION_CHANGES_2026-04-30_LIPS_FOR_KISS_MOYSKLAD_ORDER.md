# Lips for Kiss MoySklad Customer Order

Date: 2026-04-30

## Request

Create a new MoySklad `Заказ покупателя` for `Lips for Kiss`:

- Post-treatment cream, small x5 pcs
- Excellent Delivery x45 AED

## Created Order

- MoySklad customer: `Lips for Kiss Clinic`
- Counterparty ID: `9038b70d-c52f-11f0-0a80-0bc5000a2226`
- Order: `GENCardM2604308783`
- Order ID: `842c80c7-4488-11f1-0a80-03c50017ddf6`
- Moment: `2026-04-30 15:35:00`
- State: `New`
- Product quantity: `5`
- Total: `555.00 AED` VAT-inclusive
- UI: `https://online.moysklad.ru/app/#customerorder/edit?id=842c80c7-4488-11f1-0a80-03c50017ddf6`

## Lines

| Code | Product / Service | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `00038` | Genosys Soothing Repair Post Cream 20g | 5 | 102.00 | 510.00 |
| `00089` | Excellent Delivery Dubai | 1 | 45.00 | 45.00 |

## Verification

Dry-run and readback confirmed:

- Counterparty matched exactly as `Lips for Kiss Clinic`.
- No same-day Lips for Kiss customer order existed before creation.
- Post-treatment cream used the small `20g` SKU (`00038`), not the box SKU.
- Prices were VAT-inclusive.
- Free stock for `00038` was `19` at creation time.
- Readback confirmed `vatIncluded=true`, `2` lines, and total sum `555.00 AED`.
