# Family Class Polyclinic — SO + invoice + shipment (2026-06-22)

**Date:** 2026-06-22  
**Script:** `scripts/moysklad-create-family-class-polyclinic-hair-order-invoice-demand-20260622.js --commit`

## Customer

**FAMILY CLASS POLY CLINIC L.L.C** (`e363e797-fcf1-11f0-0a80-05360009081f`)

## Lines (MoySklad list prices, VAT incl.)

| Code | Product | Qty | Unit | Line |
|------|---------|----:|-----:|-----:|
| `00052` | HR³ Matrix Scalp & Hair Shampoo 300ml | 1 | 170 | 170 |
| `00051` | HR³ Matrix Hair Tonic 70ml | 1 | 145 | 145 |
| `00048` | HR³ Matrix Hair Solution Professional Box (8pcs) | 1 | 370 | 370 |
| `00050` | HR³ Matrix Scalp Peeling 100ml | 1 | 145 | 145 |
| — | Excellent Delivery Dubai | 1 | 45 | 45 |

**Total:** 875.00 AED *(corrected from 1,705 — all product qty set to 1)*

**Fix script:** `scripts/moysklad-fix-family-class-polyclinic-hair-qty1-20260622.js --commit`

## Documents

| Step | Name | ID |
|------|------|-----|
| Order | **GENCardM260622FCPH** | `ed51f0f4-6e0a-11f1-0a80-16ec0078962e` |
| Invoice | **04708** | `ee151bc9-6e0a-11f1-0a80-1d59007b283f` |
| Shipment | **06397** | `ef5004f7-6e0a-11f1-0a80-00ad00781b28` |

- Invoice state: **Выписан**
- Shipment state: **Отгружен**
- No paymentin (awaiting payment)

## Mapping notes

- **Scalp shampoo** → `00052` (300ml Medi shampoo)
- **Matrix hair solution** → `00048` professional box (8 vials/box). Single loose vial would be `00049`.

Prior order same customer: [2026-06-08 patches/collagen](./SESSION_CHANGES_2026-06-08_FAMILY_CLASS_POLY_CLINIC_ORDER.md).
