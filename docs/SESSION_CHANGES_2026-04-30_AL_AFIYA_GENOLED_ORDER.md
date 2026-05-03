# Al Afiya MoySklad GENO-LED Customer Order

Date: 2026-04-30

## Request

Create a new MoySklad `Заказ покупателя` for a GENO-LED lamp for a new customer:

- Customer: `AL AFIYA CENTER FOR HAMAM AND SALOON`
- Address: `16th Street - Al Khalidiyah - W9 - Abu Dhabi`
- Phone: `02 665 9659`
- Item: GENO-LED lamp x1

## Created Counterparty

- MoySklad customer: `AL AFIYA CENTER FOR HAMAM AND SALOON`
- Counterparty ID: `77bfe944-448d-11f1-0a80-1dfb001a00d3`
- Phone stored: `026659659`
- Address stored in structured `actualAddressFull` and `legalAddressFull`.

## Created Order

- Order: `GENCardM2604308784`
- Order ID: `7823a30f-448d-11f1-0a80-0d80001983aa`
- Moment: `2026-04-30 16:15:00`
- State: `New`
- Total quantity: `1`
- Total: `5,500.00 AED` VAT-inclusive
- UI: `https://online.moysklad.ru/app/#customerorder/edit?id=7823a30f-448d-11f1-0a80-0d80001983aa`

## Lines

| Code | Product | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `00077` | Genosys Led Lamp GENO-LED | 1 | 5,500.00 | 5,500.00 |

## Verification

Dry-run and readback confirmed:

- No existing Al Afiya counterparty was found before creation.
- Counterparty was created with the supplied Abu Dhabi address and phone.
- SKU `00077` resolved to `Genosys Led Lamp GENO-LED`.
- Price used the MoySklad `оптовая` price type.
- Free stock was `1` at creation time.
- Readback confirmed `vatIncluded=true`, `1` line, `1` unit, and total sum `5,500.00 AED`.
