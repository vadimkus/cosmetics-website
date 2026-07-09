# Miss Heike Lutz — retail sales order (2026-06-18)

## Customer

- **Name:** Miss Heike Lutz
- **Phone:** 0507757940
- **MoySklad ID:** `4365dad0-a58d-11ef-0a80-0bc200331eaf`
- **Address:** Green Community, Villa 111, Motor City, UAE

## Order

| Field | Value |
|---|---|
| **SO** | **GENCardW2606187940** |
| **ID** | `15b04148-6b0d-11f1-0a80-08550042a7d7` |
| **Total** | **1,870.00 AED** VAT incl. |
| **Status** | SO only — invoice/shipment pending |

[Open in MoySklad](https://online.moysklad.ru/app/#customerorder/edit?id=15b04148-6b0d-11f1-0a80-08550042a7d7)

## Lines (retail prices)

| Code | Product | Qty | Price AED |
|---|---|---:|---:|
| 00042 | EGF Repair Oxymask Cream 50ml | 1 | 290 |
| 00189 | Skin Rescue Overnight Cream Mask 100g | 1 | 340 |
| 00191 | Multi Functional Anti-Wrinkle Serum 30ml | 1 | 330 |
| 00195 | Moisture Replenishing Hyaluron Serum 30ml | 1 | 330 |
| 00190 | Multi Functional Anti-Wrinkle Cream 50g | 1 | 290 |
| 54458 | Moisture Replenishing Hyaluron Cream 50g | 1 | 290 |
| 00089 | Excellent Delivery Dubai | 1 | 45 (**100% discount**) |

## Script

```bash
node --import dotenv/config scripts/moysklad-create-heike-lutz-order-20260618.js --commit
```

## Notes

- Retail pricing matches prior order **GENCardW2603279212** (Mar 2026).
- Free delivery via 100% line discount on Excellent Delivery Dubai (same pattern as other retail orders).
