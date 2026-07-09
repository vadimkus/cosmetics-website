# Miss Vlada — retail order (SO + invoice + shipment)

**Date:** 2026-07-08  
**Customer:** Miss Vlada | +971585843363  
**Ship:** Arjan, Damac Lincoln Park Westside, flat 630, Dubai  
**Counterparty:** `00ed91fd-42ee-11f1-0a80-012e00a0e7b5` (existing)

## Documents

| Doc | Number | ID |
|-----|--------|-----|
| Sales order | **GENCardM2607086363** | `5080340c-7aae-11f1-0a80-0da500157237` |
| Invoice | **04784** | `50d9bae9-7aae-11f1-0a80-175e0014e915` |
| Shipment | **06498** | `51b02414-7aae-11f1-0a80-056700149ff3` |

**PDF:** `~/Desktop/orders/GENOSYS_Miss_Vlada_04784.pdf`

## Lines (retail, VAT incl.)

| Code | Product | Qty | List | Discount | Net |
|------|---------|-----|------|----------|-----|
| `00024` | Snow O₂ Cleanser 500ml | 1 | 510.00 | — | 510.00 |
| `00144` | Cushion #2 Beige | 1 | 300.00 | — | 300.00 |
| `54460` | Moisture Replenishing Hyaluron Cream **250g** | 1 | 420.00 | — | 420.00 |
| `00063` | Intensive Repair Collagen Mask 23g | 1 | 36.00 | 100% | 0.00 |
| `00140` | Soothing Bomb Sea Algae Mask 23g | 1 | 36.00 | 100% | 0.00 |
| — | Excellent Delivery Dubai | 1 | 45.00 | 100% | 0.00 |

**Total: 1,230.00 AED** (no paymentin posted)

## Notes

- User requested “Hyaluron cream **230g**” — no 230g hyaluron SKU in MoySklad; mapped to **`54460`** (250g pro tub) @ retail **420 AED** (website 250g retail).
- Free masks and delivery via **100% line discount** at list retail price.
- Script: `scripts/moysklad-create-miss-vlada-retail-order-invoice-demand-20260708.js`
