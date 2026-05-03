# LODY ANA.SPA. LLC MoySklad Customer Order

Date: 2026-05-01

## Request

Create a new MoySklad `Заказ покупателя` for `Lodyana Spa`, later amended to legal name `LODY ANA.SPA. LLC`:

- Matrix Hair Solution x1 box
- SWS x10 ampules
- CTS x10 ampules

## Created Order

- MoySklad customer: `LODY ANA.SPA. LLC`
- Counterparty ID: `5746700f-455a-11f1-0a80-03c5003a244c`
- Order: `GENCardM2605018787`
- Order ID: `577c8dfe-455a-11f1-0a80-08a8003a1614`
- Moment: `2026-05-01 16:40:00`
- State: `Новый`
- Total quantity: `21`
- Total: `950.00 AED` VAT-inclusive
- UI: `https://online.moysklad.ru/app/#customerorder/edit?id=577c8dfe-455a-11f1-0a80-08a8003a1614`

## Lines

| Code | Product | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `00048` | Genosys HR³ Matrix Hair Solution - Professional Box (8pcs) | 1 | 370.00 | 370.00 |
| `00020` | Genosys Power Solution SWS 1 Vial 2ml | 10 | 29.00 | 290.00 |
| `00069` | Genosys Power Solution CTS 1 Vial 2ml | 10 | 29.00 | 290.00 |

## Verification

Dry-run and readback confirmed:

- No existing counterparty was found for `Lodyana Spa`, `Lodyana`, `Lodiyana`, or `Ladyana`; a new counterparty was created.
- Counterparty legal name was amended from `Lodyana Spa` to `LODY ANA.SPA. LLC` after user correction.
- SWS and CTS were entered as individual ampoule/vial SKUs x10 each.
- Free stock was sufficient at creation time:
  - HR³ Matrix Hair Solution Professional Box: `27`
  - SWS 1 Vial: `190`
  - CTS 1 Vial: `94`
- Readback confirmed customer `LODY ANA.SPA. LLC`, state `Новый`, 3 lines, 21 units, and total sum `950.00 AED`.
