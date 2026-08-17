# Session — Miss Vlada beige cushion order (31 Jul 2026)

## Find

Multiple “Miss Vlada” CPs in MoySklad. Used Marina Plaza match:

| Field | Value |
|-------|--------|
| Counterparty | Miss Vlada |
| ID | `1fea28d7-f507-11f0-0a80-17d90029b4df` |
| Phone | 0544382968 |
| Prior address | Marina Plaza office **2310** |
| Updated to | Marina Plaza Building, Office **2301**, Dubai Marina, Dubai |

(Other Miss Vladas exist, e.g. Arjan / +971585843363 — not used.)

## Order

| Doc | Number | Amount |
|-----|--------|--------|
| Customer order | GENCardM2607312968 | 315.00 AED |
| Invoice | 04873 | 315.00 AED |
| Shipment | 06609 | 315.00 AED |

### Lines

- `00144` Genosys Skin Caring Blemish Balm Cushion #2 Biege ×1 @ 300 AED −10% → **270.00**
- Delivery Dubai ×1 @ **45.00**
- **Total 315.00 AED** — unpaid

## PDF

`~/Desktop/orders/GENOSYS_Miss_Vlada_04873.pdf`

## Script

`scripts/moysklad-create-miss-vlada-beige-order-20260731.js`

## Amended — 50% product discount (full chain)

Paymentin **06003** was posted at 315. Then products set to **50%** (delivery full 45), same pattern as Miss Nadezhda.

| Doc | Was | Now |
|-----|----:|----:|
| Order GENCardM2607312968 | 315 | **195** |
| Invoice 04873 | 315 | **195** |
| Shipment 06609 | 315 | **195** |
| Paymentin 06003 | 315 | **195** |

- Cushion @300 −50% → **150** + delivery **45** = **195 AED**
- Script: `scripts/moysklad-fix-miss-vlada-50pct-discount-20260731.js --commit`
- PDF refreshed: `~/Desktop/orders/GENOSYS_Miss_Vlada_04873.pdf`
