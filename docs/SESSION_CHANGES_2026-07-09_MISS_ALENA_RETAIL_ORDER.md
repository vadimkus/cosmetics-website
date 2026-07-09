# Miss Alena — retail SO → invoice → shipment

**Date:** 2026-07-09  
**Phone:** +971561110511  
**Address:** DIFC, Damac Park Towers A, apt 908, Dubai  
**Counterparty:** Miss Alena (`51cf4b2d-7b83-11f1-0a80-0edd0016e300`) — created

## Pricing

Retail VAT-incl. with **15% discount** on each product; delivery **100% off**.

| Code | Product | Qty | Retail | Disc | Net |
|------|---------|-----|--------|------|-----|
| `00144` | Cushion #2 Beige | 1 | 300 | 15% | 255.00 |
| `00021` | Snow O₂ Cleanser 180ml | 1 | 330 | 15% | 280.50 |
| `54458` | Hyaluron Cream 50g | 1 | 290 | 15% | 246.50 |
| `00195` | Hyaluron Serum 30ml | 1 | 330 | 15% | 280.50 |
| `00022` | Snow Booster Toner 200ml | 1 | 260 | 15% | 221.00 |
| — | Excellent Delivery Dubai | 1 | 45 | 100% | 0.00 |

**Total: 1,283.50 AED** *(updated 2026-07-09 — added Snow Booster)*

## Documents

| Doc | Number |
|-----|--------|
| SO | `GENCardM2607090511` |
| Invoice | **04794** |
| Shipment | **06510** |

**PDF:** `~/Desktop/orders/GENOSYS_Miss_Alena_04794.pdf`

## Script

Create (initial):
```bash
node --import dotenv/config scripts/moysklad-create-miss-alena-retail-order-invoice-demand-20260709.js --commit
```

Add Snow Booster (update):
```bash
node --import dotenv/config scripts/moysklad-update-miss-alena-add-snow-booster-20260709.js --commit
```
