# Iryna Solodka — clinic order + invoice + shipment (2026-08-13)

**Customer:** Miss Irina Solodkaya (existing) / Iryna Solodka · +380 67 380 5770  
**Ship:** Emar South, GreenView 1, Villa 6, Dubai  
**Pricing:** Clinic list (оптовая), same as May 28 / Jul 16. Unpaid.

## Documents

| Step | Ref | Amount (AED) |
|------|-----|--------------|
| Sales order | **GENCardM2608135770** | 758.00 |
| Invoice | **04926** | 758.00 |
| Shipment | **06679** | 758.00 |

Links: SO → INV 04926 → SHIP 06679. No `demand.customerOrder`. No payment.

## Lines

| Code | Product | Qty | Clinic (AED) | Line |
|------|---------|-----|--------------|------|
| 00188 | Microbiome Energy Infusing Mist 80ml | 6 | 80.00 | 480.00 |
| 00040 | Intensive Blemish Balm Cream 50g | 1 | 125.00 | 125.00 |
| 00063 | Intensive Repair Collagen Mask 23g | 6 | 18.00 | 108.00 |
| — | Excellent Delivery Dubai | 1 | 45.00 | 45.00 |
| | | | **Total** | **758.00** |

## IDs

- Customer: `fe9bcf0c-ab69-11ed-0a80-0cad00322ed0`
- Order: `a13827a4-96f8-11f1-0a80-134b00226c71`
- Invoice: `a18bf30f-96f8-11f1-0a80-1cee00226b72`
- Shipment: `a23223fb-96f8-11f1-0a80-171f00226662`

## PDF

`~/Desktop/orders/GENOSYS_Iryna_Solodka_04926.pdf` (not printed)

## Script

`scripts/moysklad-create-iryna-solodka-order-invoice-demand-20260813.js --commit`
