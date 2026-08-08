# Olga Pikina previous paid order import (2026-08-08)

## Outcome

An authoritative paid and delivered MoySklad transaction was found and mirrored
into Olga Pikina's production website account. MoySklad was read-only: no
MoySklad document was created or changed.

- Website account: `olgaku4eryava@gmail.com`
- Website order: `GENCardM2606166868`
- Website order ID: `cmskngsim00009a8ovtxy6fnq`
- Website state: `DELIVERED` / `paid`
- Source channel: `X BEAUTY CONSULTING - F.Z.C`
- Source MoySklad counterparty UUID: `03c174b0-4581-11ea-0a80-01f80012b189`
- Existing MoySklad SO UUID: `3d182dbb-698b-11f1-0a80-036400250fc0`
- Existing chain: invoice `04688`, shipment `06378`, payment in `05787`
- Order date: 2026-06-16
- Shipment/payment date: 2026-06-18
- Products: AED 745
- Dubai delivery: AED 45
- Total paid: AED 790

## Authoritative attribution

The SO description identifies `Оля` and gives the same Fairways East,
Apartment 1804 delivery address as Olga's later direct order, plus the phone
stored by this import. The SO, invoice, shipment and payment all use the same
X Beauty Consulting counterparty and AED 790 total.

Olga described the intermediary as Alena, but the authoritative X Beauty
counterparty has no MoySklad contact-person record naming Alena. The import
therefore records X Beauty Consulting as the verified source channel and does
not assign the order to Dudareva Alena or any other personal Alena
counterparty/account.

Olga's website link to her own MoySklad counterparty
`0555788f-90db-11f1-0a80-040c001fd737` was preserved. It was not replaced with
the X Beauty source counterparty.

## Exact lines

| Code | Website product | Qty | Unit AED | MoySklad discount |
|---|---|---:|---:|---:|
| `54458` | Moisture Replenishing Hyaluron Cream 50g | 1 | 145 | 0% |
| `00188` | Microbiome Energy Infusing Mist 80ml | 1 | 80 | 0% |
| `54465` | Soothing Repair Postcream 100g | 1 | 220 | 0% |
| `54470` | Bio Meso PDRN Ampoule 60000, 3ml × 4 | 1 | 300 | 0% |
| `00089` | Excellent Delivery Dubai | 1 | 45 | 0% |

The transaction used clinic unit prices with zero line discounts in MoySklad.
The website mirror therefore stores the exact paid product prices and zero
order discount rather than inventing a retail discount percentage. Canonical
website product IDs and current server-side product images are used.

## Paid and delivered evidence

- SO `GENCardM2606166868`: state `Доставлен`; AED 790 paid, invoiced and shipped.
- Invoice `04688`: linked to the SO; exact same five lines and AED 790 total.
- Shipment `06378`: state `отгружен`; linked to invoice `04688`.
- Payment in `05787`: posted for AED 790 and linked in full to shipment `06378`.
- A 2020-present product intersection found this as the only MoySklad customer
  order containing Mist + Postcream + PDRN Expert together.

## GENOSYS Rewards

The normal retail rewards rule awarded **745 points**:

- Products-only basis: AED 790 total minus AED 45 delivery = AED 745.
- Historical tier before this June order: `MEMBER` (1×).
- Birthday multiplier: none; no birthday is stored.
- One `ORDER_EARN` ledger row linked to the website order.
- Previous balance: 270 points.
- New ledger and materialized balance: **1,015 points**.
- Lifetime website totals: AED 1,105, 2 delivered orders, `SILVER`.

The order creation, ledger award, lifetime totals, tier, materialized balance
and authoritative phone update were committed in one database transaction.

## Email

No customer or admin email was sent. The script contains no email path.

## Script and verification

Script:

`scripts/import-olga-pikina-x-beauty-order-20260808.ts`

Commands:

```bash
# Read-only preview
npx tsx --env-file=.env --env-file=.env.local scripts/import-olga-pikina-x-beauty-order-20260808.ts

# Production import and points award
npx tsx --env-file=.env --env-file=.env.local scripts/import-olga-pikina-x-beauty-order-20260808.ts --commit
```

Final production checks:

- Website order count by `orderNumber`: 1
- Website order count by MoySklad SO UUID: 1
- Order item count: 4
- `ORDER_EARN` rows for order: 1
- Ledger balance = materialized user balance = 1,015
- Order is linked by Olga's email and visible through her normal order-history query
- Authoritative phone stored on the user and order
- Rerun: `created=false`, `awarded=false`
- No email and no printing
