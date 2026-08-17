# CEIA CLINIC — SO + invoice + shipment (2026-08-13)

**Customer:** CEIA CLINIC L.L.C (`d7af76af-8cc5-11f1-0a80-08f4001604b7`)  
**Ship:** Villa No. 2, Al Manara, Dubai  
**Pricing:** Clinic list (оптовая). Unpaid. No delivery.

First post used **54459** Intensive Multi Functional Cream 250g (0 stock). Shipment 412. Replaced with **00034** Multi Functional Anti-Wrinkle Cream 250g, then shipped.

## Documents

| Step | Ref | Amount (AED) |
|------|-----|--------------|
| Sales order | **GENCardM260813CEIA** | 725.00 |
| Invoice | **04927** | 725.00 |
| Shipment | **06680** | 725.00 |

Links: SO → INV 04927 → SHIP 06680. No `demand.customerOrder`. No payment.

## Lines

| Code | Product | Qty | Clinic (AED) | Line |
|------|---------|-----|--------------|------|
| 00034 | Multi Functional Anti-Wrinkle Cream 250g | 1 | 210.00 | 210.00 |
| 00050 | HR³ Matrix Scalp Peeling 100ml | 1 | 145.00 | 145.00 |
| 00048 | HR³ Matrix Hair Solution Professional Box (8pcs) | 1 | 370.00 | 370.00 |
| | | | **Total** | **725.00** |

## IDs

- Order: `9d5de526-96fe-11f1-0a80-134b00249fb7`
- Invoice: `9db35090-96fe-11f1-0a80-0b8e002473fc`
- Shipment: `2add44e0-9700-11f1-0a80-0d9b00264b1e`

## PDF

`~/Desktop/orders/GENOSYS_CEIA_Clinic_04927.pdf` (Legal_TAX, not printed)

## Scripts

- `scripts/moysklad-create-ceia-clinic-order-invoice-demand-20260813.js --commit`
- `scripts/moysklad-amend-ceia-clinic-00034-ship-20260813.js --commit`

## 2026-08-17 — cream only

Removed scalp peeling **00050** and hair solution pro **00048** from SO / INV **04927** / SHIP **06680**.

Left: **00034** Multi Functional Anti-Wrinkle Cream 250g ×1 @ 210.

**210 AED** unpaid. State still Доставлен - Ждем оплату. No payment. No print.

PDF re-exported: `~/Desktop/orders/GENOSYS_CEIA_Clinic_04927.pdf`

Script: `scripts/moysklad-amend-ceia-clinic-cream-only-04927-20260817.js --commit`
