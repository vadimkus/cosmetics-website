# Clinic customer — full cycle (cushion Beige, paid)

**Date:** 2026-07-08  
**Counterparty:** Clinic customer (`cb52343e-80b6-11eb-0a80-00fc00324b17`)

Same repeat as 2026-07-01 (GENCardM260701CLINIC / 04745).

## Documents

| Step | Ref | Amount (AED) |
|------|-----|--------------|
| Sales order | **GENCardM260708CLINIC** | 165.00 |
| Invoice | **04788** | 165.00 |
| Shipment | **06504** | 165.00 |
| Payment in | **05904** | 165.00 |

Shipment fully paid (165 / 165).

**Fix (same day):** Delivery corrected 30 → **15 AED** (Clinic customer standard). Total 180 → **165 AED**; paymentin adjusted; PDF re-exported.

## Lines

| Code | Product | Qty | Price |
|------|---------|-----|-------|
| 00144 | Cushion #2 Beige | 1 | 150 |
| — | Excellent Delivery Dubai | 1 | **15** |

## IDs

- Order: `af575d9a-7adb-11f1-0a80-0eda001ff442`
- Invoice: `af93e86c-7adb-11f1-0a80-0da50020e5a9`
- Shipment: `b03efbf0-7adb-11f1-0a80-1e2a00208d05`
- Payment in: `b09d3c03-7adb-11f1-0a80-08e8001fbbb9`

## PDF

`~/Desktop/orders/GENOSYS_Clinic_Customer_04788.pdf` (not printed)

## Script

- Create: `scripts/moysklad-create-clinic-customer-cushion-order-full-cycle-20260701.js` (delivery **15** AED)
- Fix 04788: `scripts/moysklad-fix-clinic-customer-delivery-15-04788-20260708.js`
