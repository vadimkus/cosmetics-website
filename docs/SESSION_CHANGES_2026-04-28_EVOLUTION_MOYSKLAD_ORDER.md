# Evolution MoySklad Customer Order

Date: 2026-04-28

## Context

Vadim requested creating a new MoySklad `Заказ покупателя` for Evolution with the following items:

- Hair Matrix Shampoo x2
- Hair Tonic x1
- Snow O2 180ml x2
- Intensive Hydra Soothing Cream 50g x1
- Multi Vita Radiance Cream 50g x2
- SPF 50 Ultra Shield x4
- Eye Contour Cream x2
- Eye Contour Serum x2

## Resolution

Created live MoySklad customer order for:

- Counterparty: `Evolution Aesthetics Clinic`
- State: `Новый`
- MoySklad order: `GENCardM2604288778`
- MoySklad ID: `994cf534-42ec-11f1-0a80-1df300a1a3da`
- Moment: `2026-04-28 14:25:00`
- Total quantity: `16`
- Total: `2490.00 AED` VAT-inclusive
- UI: `https://online.moysklad.ru/app/#customerorder/edit?id=994cf534-42ec-11f1-0a80-1df300a1a3da`

## Lines

| Code | Product | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `00052` | Genosys HR3 Matrix Scalp & Hair Shampoo 300ml | 2 | 170.00 | 340.00 |
| `00051` | Genosys HR3 Matrix Hair Tonic 70ml | 1 | 145.00 | 145.00 |
| `00021` | Genosys Snow O2 Cleanser 180ml | 2 | 165.00 | 330.00 |
| `00031` | Genosys Intensive Hydro Soothing Cream 50g | 1 | 145.00 | 145.00 |
| `00122` | Genosys Multi-Vita Radiance Cream 50g | 2 | 145.00 | 290.00 |
| `54457` | Genosys Ultra Shield Sun Cream SPF50/PA++++ 50g | 4 | 125.00 | 500.00 |
| `00055` | Genosys EyeCell Eye Contour Cream 20ml | 2 | 185.00 | 370.00 |
| `00054` | Genosys EyeCell Eye Contour Serum 10ml | 2 | 185.00 | 370.00 |

## Verification

Readback from MoySklad confirmed:

- `vatIncluded=true`
- `8` product lines
- `16` units total
- Total sum `2490.00 AED`
