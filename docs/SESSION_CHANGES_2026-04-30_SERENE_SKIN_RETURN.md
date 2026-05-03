# Serene Skin Beauty MoySklad Customer Return

Date: 2026-04-30

## Request

Create a MoySklad `Возврат покупателя` for `Serene Skin Beauty Salon LLC` from the returned-products photo, plus one additional Hair Tonic.

Photo reference:

- `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/WhatsApp_Image_2026-04-30_at_14.47.41-c88e92c8-3766-438a-8b3a-60332fb6eb2b.png`

## Created Return

- MoySklad customer: `Serene Skin Beauty Salon LLC`
- Counterparty ID: `993395aa-8da2-11ec-0a80-006b0038cd99`
- `Возврат покупателя`: `00294`
- Return ID: `a6b4693b-4482-11f1-0a80-013a00167d9a`
- Moment: `2026-04-30 14:55:00`
- State: `Возврат`
- Total quantity: `8`
- Total: `1,260.00 AED` VAT-inclusive
- UI: `https://online.moysklad.ru/app/#salesreturn/edit?id=a6b4693b-4482-11f1-0a80-013a00167d9a`

## Lines

| Code | Product | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `00028` | Genosys Skin Whitening Serum 30ml | 2 | 165.00 | 330.00 |
| `00027` | Genosys Anti-Wrinkle Serum 30ml | 1 | 165.00 | 165.00 |
| `00030` | Genosys All For Sensitive Serum 30ml | 2 | 165.00 | 330.00 |
| `00031` | Genosys Intensive Hydro Soothing Cream 50g | 1 | 145.00 | 145.00 |
| `00050` | Genosys HR³ Matrix Scalp Peeling 100ml | 1 | 145.00 | 145.00 |
| `00051` | Genosys HR³ Matrix Hair Tonic 70ml | 1 | 145.00 | 145.00 |

## Verification

Dry-run and readback confirmed:

- Counterparty matched exactly as `Serene Skin Beauty Salon LLC`.
- No April 2026 customer returns existed for Serene before creation.
- No same-day duplicate return with the session marker existed before creation.
- Prices used the MoySklad `оптовая` price type and were VAT-inclusive.
- Readback confirmed `vatIncluded=true`, `6` SKU lines, `8` total units, and total sum `1,260.00 AED`.
- The return was created standalone, not linked to demand `06024`, because the returned items did not match the same lines from that shipment.

## Amendment

After creation, Vadim clarified the first line should be `Skin Whitening Serum x2`, not `Multi Vita Radiance Serum x2`. The live MoySklad return `00294` was amended by replacing:

- `00194` Genosys Multi Vita Radiance Serum 30ml x2

with:

- `00028` Genosys Skin Whitening Serum 30ml x2

Readback after amendment confirmed the final document lines shown above, `8` units total, and unchanged total `1,260.00 AED`.

## Second Amendment

Vadim clarified the photo/product list meant the old `Anti-Wrinkle Serum`, not `Multi Functional Anti-Wrinkle Serum`. Serene's consignment movement history was checked before editing:

- `00027` Genosys Anti-Wrinkle Serum 30ml: shipped `3`, returned `0`, net `3`
- `00191` Genosys Multi Functional Anti-Wrinkle Serum 30ml: not the intended return line

The live return `00294` was amended again by replacing:

- `00191` Genosys Multi Functional Anti-Wrinkle Serum 30ml x1

with:

- `00027` Genosys Anti-Wrinkle Serum 30ml x1

Readback after the second amendment confirmed the final document lines shown above, no `00191` line, `8` units total, and unchanged total `1,260.00 AED`.
