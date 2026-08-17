# Session — Miss Bella Manacherova paid order (08 Aug 2026)

## Request
Recreate same order as tax invoice 04430 (27.04.2026): Intensive Blemish Balm Cream 50g @ 250 + Excellent Delivery Dubai @ 45 = **295 AED**, customer paid, print invoice landscape.

## Created
| Doc | Number | Amount |
|---|---|---|
| Customer order | GENCardM2608081507 | 295 AED |
| Invoice | **04905** | 295 AED |
| Shipment | 06652 | 295 AED |
| Payment in | 06055 | 295 AED |

- Counterparty: Miss Bella Manacherova (`3d8c6c2c-425c-11f1-0a80-0d5b0084dbab`)
- Phone: 0564371507
- Address: La Cote 3, 305 app, Dubai
- Lines: `00040` ×1 @ 250 + Delivery Dubai ×1 @ 45
- Order state: Delivered
- PDF: `~/Desktop/orders/GENOSYS_Miss_Bella_Manacherova_04905.pdf`
- Print: `lp -o orientation-requested=4` (EPSON_L3260_Series)

## Script
`scripts/moysklad-create-bella-manacherova-blemish-cream-paid-20260808.js`
