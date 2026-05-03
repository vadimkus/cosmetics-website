# Eclatant MoySklad Shipment

Date: 2026-05-02

## Request

Create the same `Отгрузка` for `Eclatant` as the shown customer order, using the same items and quantities, and attach it to the agreement.

Follow-up: the first linked shipment was deleted in MoySklad, and the user had created a separate `19 AED` shipment manually. A new standalone shipment was then created under agreement `18`, leaving the user's `19 AED` document untouched.

## Customer / Contract

- Customer in MoySklad: `ECLATANT&CO TRADING CO L.L.C`
- Counterparty ID: `0df9bafd-1a99-11f0-0a80-08b100073e9f`
- Contract: `18`
- Contract ID: `132684fd-1a99-11f0-0a80-071f0006a1ec`
- Reference customer order: `GENCardM2604308782`
- Customer order ID: `b07eaf4d-4485-11f1-0a80-08a8001734f7`

## Created Shipment

- `Отгрузка`: `06076`
- ID: `6a8e11f8-462e-11f1-0a80-0c380059c142`
- Total: `3,135.00 AED` VAT-inclusive
- Lines: `4`
- Quantity: `38`
- UI: `https://online.moysklad.ru/app/#demand/edit?id=6a8e11f8-462e-11f1-0a80-0c380059c142`

## Deleted / Manual Documents Context

- First created linked shipment `06076` / `a6f687aa-462d-11f1-0a80-11330058b182` was later found marked `deleted` in MoySklad.
- User-created shipment `06077` / `f6531904-462d-11f1-0a80-17a00027a4f0` for `19.00 AED` was left untouched.
- The final visible shipment is the standalone `06076` / `6a8e11f8-462e-11f1-0a80-0c380059c142`.

## Lines

| Code | Product | Qty | Unit AED | Line AED |
|---|---|---:|---:|---:|
| `00012` | Genosys Peptide Gel Mask 39g | 25 | 38.00 | 950.00 |
| `54467` | Genosys Skin Reboot PDRN mask Pack (30 sheets) 350g | 5 | 200.00 | 1,000.00 |
| `00144` | Genosys Skin Caring Blemish Balm Cushion #2 Biege | 5 | 150.00 | 750.00 |
| `54458` | Genosys Moisture Replenishing Hyaluron Cream 50g | 3 | 145.00 | 435.00 |

## Implementation

Created one-use script:

`scripts/moysklad-create-eclatant-demand-20260502.js`

The script:

- Resolves products from the MoySklad stock report by code.
- Uses current MoySklad sale prices, matching the existing customer order total.
- Creates the shipment under contract `18`.
- Creates the shipment as standalone under agreement `18`.
- Checks sufficient stock and duplicate shipment marker before writing.

## Verification

Readback confirmed:

- Shipment `06076` uses counterparty `ECLATANT&CO TRADING CO L.L.C`.
- Contract matches `18`.
- Warehouse matches `Genosys Warehouse`.
- Total recomputes to `3,135.00 AED`, with `4` lines and `38` units.
- Eclatant demand list for `2026-05-02` shows both the user's `06077` for `19.00 AED` and final standalone `06076` for `3,135.00 AED`.
