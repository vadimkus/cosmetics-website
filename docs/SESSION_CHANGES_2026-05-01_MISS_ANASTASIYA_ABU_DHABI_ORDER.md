# Miss Anastasiya Abu Dhabi MoySklad Customer Order

Date: 2026-05-01

## Request

Create a new MoySklad `Заказ покупателя` for a new customer:

- Name: `Miss Anastasiya`
- Phone: `+971 50 298 6293`
- Address: `Abu Dhabi, Khalifa City A, Al Rayyana complex, Building Arjwan 4, apartment 302`

Items:

- Snow O2 Cleanser 180ml x1
- Snow Booster 200ml x1
- Multi Vita Radiance Serum x1
- Multi Vita Radiance Cream 50g x1
- Overnight Mask x1
- EyeCell Eye Contour Cream x1
- Skin Caring Blemish Balm Cushion SPF50, color Beige x1
- Delivery to Abu Dhabi x70 AED

## Created Order

- MoySklad customer: `Miss Anastasiya`
- Counterparty ID: `a37e3168-456f-11f1-0a80-1133003e2faf`
- Phone: `+971502986293`
- Order: `GENCardM2605018789`
- Order ID: `a3b0a44d-456f-11f1-0a80-196e00413bb5`
- Moment: `2026-05-01 19:10:00`
- State: `Новый`
- Total quantity: `7` products + `1` delivery service
- Total: `2,290.00 AED` VAT-inclusive
- UI: `https://online.moysklad.ru/app/#customerorder/edit?id=a3b0a44d-456f-11f1-0a80-196e00413bb5`

## Lines

Retail (`розничная`) prices were used because this is a residential new-customer order.

| Code | Product / Service | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `00021` | Genosys Snow O₂ Cleanser 180ml | 1 | 330.00 | 330.00 |
| `00022` | Genosys Snow Booster Toner 200ml | 1 | 260.00 | 260.00 |
| `00194` | Genosys Multi Vita Radiance Serum 30ml | 1 | 330.00 | 330.00 |
| `00122` | Genosys Multi-Vita Radiance Cream 50g | 1 | 290.00 | 290.00 |
| `00189` | Genosys Skin Rescue Overnight Cream Mask 100g | 1 | 340.00 | 340.00 |
| `00055` | Genosys EyeCell Eye Contour Cream 20ml | 1 | 370.00 | 370.00 |
| `00144` | Genosys Skin Caring Blemish Balm Cushion #2 Biege | 1 | 300.00 | 300.00 |
| `00090` | Delivery Abu Dhabi | 1 | 70.00 | 70.00 |

## Verification

Dry-run and readback confirmed:

- No existing counterparty matched phone `+971502986293`.
- Several older `Miss Anastasiya` counterparties exist with different phone numbers, so a new counterparty was created per request.
- Initial manual order number `GENCardM2605018788` was already taken; next free manual number `GENCardM2605018789` was used.
- Delivery address was added to both the counterparty card and order `shipmentAddressFull`.
- BB cushion was mapped to color Beige SKU `00144`.
- Readback confirmed customer `Miss Anastasiya`, state `Новый`, 8 positions, and total sum `2,290.00 AED`.
