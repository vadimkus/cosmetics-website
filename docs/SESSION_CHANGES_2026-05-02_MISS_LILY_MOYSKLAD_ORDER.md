# Miss Lily MoySklad Customer Order

Date: 2026-05-02

## Request

Create a new MoySklad `Заказ покупателя` for a new customer:

- Customer: `Miss Lily`
- Phone: `+971 58 537 8705`
- Address: `JLT, Cluster V, Building Coldcrest Views, Floor 6, Apartment 0603`
- Item: SPF 40 x1
- Delivery: `45 AED`

## Created Counterparty

- MoySklad customer: `Miss Lily`
- Counterparty ID: `d5d6e800-463d-11f1-0a80-03c5005bd107`
- Phone stored: `+971585378705`
- Address stored in structured `actualAddressFull` and `legalAddressFull`.

## Created Order

- Order: `GENCardM2605028790`
- Order ID: `d64b4bc4-463d-11f1-0a80-196e005f93c8`
- Moment: `2026-05-02 19:45:00`
- State: `New`
- Total quantity: `2` lines/units including delivery service
- Total: `150.00 AED` VAT-inclusive
- UI: `https://online.moysklad.ru/app/#customerorder/edit?id=d64b4bc4-463d-11f1-0a80-196e005f93c8`

## Lines

| Code | Product / Service | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `00041` | Genosys Multi Sun Cream SPF40/PA++ 40g | 1 | 105.00 | 105.00 |
| `00089` | Excellent Delivery Dubai | 1 | 45.00 | 45.00 |

## Verification

Dry-run and readback confirmed:

- No existing counterparty was found for phone `+971585378705`; a new counterparty was created.
- Next free manual order number `GENCardM2605028790` was used.
- Product stock before order: `84` available units of `00041`.
- Readback confirmed `vatIncluded=true`, `2` lines, total sum `150.00 AED`.
- The building name was stored exactly as provided: `Coldcrest Views`.
