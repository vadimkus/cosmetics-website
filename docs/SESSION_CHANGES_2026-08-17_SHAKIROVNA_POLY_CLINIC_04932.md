# SESSION CHANGES — 2026-08-17 — Shakirovna Poly Clinic invoice 04932

## Request
Add catalogue ticks to existing SO **GENCardM260812MAR1912**, keep old lines, change owner to Shakirovna Polyclinic, export invoice.

## Result

| Field | Value |
|-------|--------|
| Customer | **SHAKIROVNA POLY CLINIC L.L.C** (`932f00c5-96e0-11f1-0a80-0d9b001a5a79`) |
| Was | Shakirovna Ladies Beauty Saloon (Marina) |
| SO | **GENCardM260812MAR1912** |
| Invoice | **04932** |
| Shipment | **06685** |
| Sum | **2,395 AED** (was 2,640 after catalogue add; Snow Booster dropped 18 Aug) |
| Status | Доставлен - Ждем оплату — unpaid |
| Address | Wharf 1, Marina Promenade, Shop S8, Dubai Marina |
| PDF | `~/Desktop/orders/GENOSYS_SHAKIROVNA_POLY_CLINIC_04932.pdf` |

Clinic purchase. No consignment agreement. Demand stays invoice-only.

## Kept (old 920)

| Code | Product | Qty | Unit | Line |
|------|---------|----:|-----:|-----:|
| 00024 | Snow O₂ Cleanser 500ml | 1 | 255 | 255 |
| 00025 | Snow Booster Toner 1000ml | 1 | 245 | 245 |
| 00011 | EZ CO₂ MASK kit | 1 | 230 | 230 |
| 00012 | Peptide Gel Mask 39g | 5 | 38 | 190 |

Already on the order, so cleanser / EZ CO₂ / peptide were not duplicated.

## Added (catalogue ticks)

| Code | Product | Qty | Unit | Line |
|------|---------|----:|-----:|-----:|
| 54461 | Skin Defender 200ml | 1 | 145 | 145 |
| 00183 | Problem Control Toner 500ml | 1 | 245 | 245 |
| 00140 | Sea Algae Mask 25g | 10 | 18 | 180 |
| 54465 | Soothing Repair Post Cream 100g | 1 | 220 | 220 |
| 54460 | Hyaluron Cream 250g | 1 | 210 | 210 |
| 00036 | Problem Control Cream 250g | 1 | 210 | 210 |
| 00041 | Multi Sun Cream SPF40 | 1 | 105 | 105 |
| 00015 | SRS vial 2ml | 10 | 40.5 | 405 |

Not added: Cerabarrier 600ml (not ticked). Snow Booster 1000 was already on the order.

## Script
`scripts/moysklad-amend-shakirovna-1912-poly-clinic-20260817.js --commit`

## 2026-08-18 — dropped Snow Booster

Removed **00025** Snow Booster Toner 1000ml ×1 @ 245 from SO / INV / SHIP.

New sum: **2,395 AED** unpaid.

Script: `scripts/moysklad-amend-shakirovna-04932-drop-snow-booster-20260818.js --commit`
