# Miss Vlada MoySklad Customer Order

Date: 2026-04-28

## Context

Vadim requested creating a new MoySklad customer and a new `Заказ покупателя` for Miss Vlada.

Customer details:

- Name: `Miss Vlada`
- Phone: `+971 58 584 3363`
- Address: `Arjan, Damac Lincoln Park Westside, flat 630`

## Price Interpretation

The first four item values were treated as quantities (`1` each). The last three values were treated as custom AED unit prices, not quantities:

- PDRN mask: `400.00 AED`
- Eye cream: `390.00 AED`
- Eye serum: `390.00 AED`

## Created Records

- Counterparty: `Miss Vlada`
- Counterparty ID: `00ed91fd-42ee-11f1-0a80-012e00a0e7b5`
- Order: `GENCardM2604288779`
- Order ID: `02021da1-42ee-11f1-0a80-112400a0d477`
- State: `Новый`
- Total quantity: `7`
- Total: `1740.00 AED` VAT-inclusive
- UI: `https://online.moysklad.ru/app/#customerorder/edit?id=02021da1-42ee-11f1-0a80-112400a0d477`

## Lines

| Code | Product | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `54458` | Genosys Moisture Replenishing Hyaluron Cream 50g | 1 | 145.00 | 145.00 |
| `00030` | Genosys All For Sensitive Serum 30ml | 1 | 165.00 | 165.00 |
| `00189` | Genosys Skin Rescue Overnight Cream Mask 100g | 1 | 170.00 | 170.00 |
| `00188` | Genosys Microbiome Energy Infusing Mist 80ml | 1 | 80.00 | 80.00 |
| `54467` | Genosys Skin Reboot PDRN mask Pack (30 sheets) 350g | 1 | 400.00 | 400.00 |
| `00055` | Genosys EyeCell Eye Contour Cream 20ml | 1 | 390.00 | 390.00 |
| `00054` | Genosys EyeCell Eye Contour Serum 10ml | 1 | 390.00 | 390.00 |

## Verification

Readback from MoySklad confirmed:

- `vatIncluded=true`
- `7` product lines
- `7` units total
- Total sum `1740.00 AED`
