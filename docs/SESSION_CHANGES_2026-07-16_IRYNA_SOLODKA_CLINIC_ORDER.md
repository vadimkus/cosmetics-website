# Iryna Solodka — clinic order + invoice + shipment (2026-07-16)

**Customer:** Miss Irina Solodkaya (MoySklad) / Iryna Solodka · +380 67 380 5770  
**Ship:** Emar South, GreenView 1, Villa 6, Dubai  
**Pricing:** Clinic list 2026

## Documents

| Step | Ref | Amount (AED) |
|------|-----|--------------|
| Sales order | **GENCardM2607165770** | 855.00 |
| Invoice | **04827** | 855.00 |
| Shipment | **06550** | 855.00 |
| Payment in | **05948** | 855.00 |

Fully paid (855 / 855). Order → **Доставлен**.

## Lines

| Code | Product | Qty | Clinic (AED) | Line |
|------|---------|-----|--------------|------|
| 00021 | Snow O₂ Cleanser 180ml | 1 | 165.00 | 165.00 |
| 00144 | Cushion #2 Beige | 2 | 150.00 | 300.00 |
| 00035 | Intensive Problem Control Cream 50g | 1 | 145.00 | 145.00 |
| 54467 | Skin Reboot PDRN Mask Pack | 1 | 200.00 | 200.00 |
| — | Excellent Delivery Dubai | 1 | 45.00 | 45.00 |
| | | | **Total** | **855.00** |

## IDs

- Order: `37b7953a-80ed-11f1-0a80-173400148844`
- Invoice: `38011d04-80ed-11f1-0a80-04d10013eea3`
- Shipment: `38cb8db5-80ed-11f1-0a80-082000140959`
- Payment in: `ca55f82b-80ef-11f1-0a80-173400151f54`

## PDF

`~/Desktop/orders/GENOSYS_Iryna_Solodka_04827.pdf`

## Scripts

- Order chain: `scripts/moysklad-create-iryna-solodka-order-invoice-demand-20260716.js --commit`
- Payment: `scripts/moysklad-create-iryna-solodka-paymentin-04827-20260716.js --commit`
