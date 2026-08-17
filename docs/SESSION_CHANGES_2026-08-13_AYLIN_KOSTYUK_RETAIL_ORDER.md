# Miss Aylin Kostyuk retail order — 2026-08-13

## Customer (new)

- **Miss Aylin Kostyuk** (`e12735de-96d9-11f1-0a80-0cb3001972c2`)
- Phone: **+971 52 800 8725**
- Address: Liv Marina 3603, Al Emreef street, Dubai
- Individual retail card

## Order (unpaid)

| Doc | Name | Amount |
|---|---|---|
| SO | **GENCardM2608138725** | 995 AED |
| INV | **04925** | 995 AED |
| SHIP | **06677** | 995 AED |

Chain: **SO → INV → SHIP**. Invoice linked to SO. Shipment linked to invoice only (no `demand.customerOrder`). **No paymentin.**

### Lines

| Code | Item | Qty | Price | Sum |
|---|---|---|---|---|
| 00191 | Multi Functional Anti-Wrinkle Serum 30ml | 2 | 330 | 660 |
| 54458 | Moisture Replenishing Hyaluron Cream 50g | 1 | 290 | 290 |
| — | Delivery Dubai | 1 | 45 | 45 |
| | **Total** | | | **995** |

## PDF

`~/Desktop/orders/GENOSYS_Miss_Aylin_Kostyuk_04925.pdf` (retail invoice template, not printed)

Script: `scripts/moysklad-create-aylin-kostyuk-order-invoice-demand-20260813.js`
