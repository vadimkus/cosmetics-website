# Dr. Valeria Borscheva — clinic order + invoice + shipment (2026-07-16)

**Customer:** Dr. Valeria Borscheva (`bcdf8073-9b47-11ee-0a80-13620011e787`) · 0525829446  
**Ship:** Garden View Apartments, building 82, app 7, Dubai  
**Pricing:** Clinic list 2026

## Documents

| Step | Ref | Amount (AED) |
|------|-----|--------------|
| Sales order | **GENCardM2607169446** | 372.00 |
| Invoice | **04828** | 372.00 |
| Shipment | **06551** | 372.00 |
| Payment in | **05949** | 372.00 |

Fully paid (372 / 372). Order → **Доставлен**.

## Lines

| Code | Product | Qty | Clinic (AED) | Line |
|------|---------|-----|--------------|------|
| 00041 | Multi Sun Cream SPF40/PA++ 40g | 1 | 105.00 | 105.00 |
| 00140 | Soothing Bomb Sea Algae Mask 23g | 3 | 18.00 | 54.00 |
| 00063 | Intensive Repair Collagen Mask 23g | 1 | 18.00 | 18.00 |
| 00144 | Cushion + Refiller #02 Beige | 1 | 150.00 | 150.00 |
| — | Excellent Delivery Dubai | 1 | 45.00 | 45.00 |
| | | | **Total** | **372.00** |

**Note:** “Cushion + Refiller / Color: #02 BEIGE” → MoySklad `00144` (box includes cushion + refiller).

## IDs

- Order: `602b5898-80ee-11f1-0a80-0820001445c2`
- Invoice: `6067985f-80ee-11f1-0a80-15c00013b505`
- Shipment: `611f8ddb-80ee-11f1-0a80-1b5900149534`
- Payment in: `b3bae194-80f4-11f1-0a80-1b590015e311`

## PDF

`~/Desktop/orders/GENOSYS_Valeriya_Borscheva_04828.pdf`

## Scripts

- Order chain: `scripts/moysklad-create-valeriya-borscheva-order-invoice-demand-20260716.js --commit`
- Payment: `scripts/moysklad-create-valeriya-borscheva-paymentin-04828-20260716.js --commit`
