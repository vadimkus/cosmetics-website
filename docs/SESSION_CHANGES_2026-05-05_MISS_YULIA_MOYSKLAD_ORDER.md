# MoySklad — Miss Yulia customer order (2026-05-05)

## Customer

- **Name in MoySklad:** `Miss Yulia (0505509051)` — suffix avoids collision with an existing `Miss Yulia` counterparty on a different phone (+971 54 358 68 88).
- **Phone:** `+971505509051` (from `0505509051`).
- **Shipment address:** Park Island, Fairfield, Apartment 605 — Dubai, UAE.

## Order

- **Document name:** `GENCardM2605051058`
- **Counterparty ID:** `2e66213f-487c-11f1-0a80-1646001e635a`
- **Order ID:** `23df93c1-487c-11f1-0a80-1b52001ef651`
- **Edit URL:** https://online.moysklad.ru/app/#customerorder/edit?id=23df93c1-487c-11f1-0a80-1b52001ef651

## Lines (VAT-inclusive AED, 5% VAT on lines)

| Code  | Product                                      | Qty | Unit list | Discount | Line total |
|-------|----------------------------------------------|-----|-----------|----------|------------|
| 00021 | Genosys Snow O₂ Cleanser 180ml               | 1   | 360       | 10%      | 324        |
| 00188 | Genosys Microbiome Energy Infusing Mist 80ml | 1   | 160       | 10%      | 144        |
| —     | Excellent Delivery Dubai (service)           | 1   | 45        | 0%       | 45         |

**Document sum:** **513.00 AED** VAT-inclusive.

## Script

`scripts/moysklad-create-miss-yulia-order-20260505.js`

- Dry-run: `node scripts/moysklad-create-miss-yulia-order-20260505.js`
- Commit (will fail if order name already exists): `node scripts/moysklad-create-miss-yulia-order-20260505.js --commit`

## Ops note

First API commit briefly attached the order to the wrong `Miss Yulia` by name match; a new counterparty was created and the order **agent** was updated via PUT to the correct phone/address record.
