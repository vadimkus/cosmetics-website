# Miss Valeriya — Cushion Beige retail paid order (2026-07-06)

**Customer:** Miss Valeriya (`74932015-eaca-11f0-0a80-08de007a1ccf`)  
**Phone:** +971585207755 (was `0585207755`)  
**Address:** The Royal Atlantis Residence, app 1201, Dubai  
**Script:** `scripts/moysklad-create-miss-valeriya-cushion-order-invoice-demand-paymentin-20260706.js --commit`

**Note:** Two MoySklad cards share phone `0585207755` — used the older card with Royal Atlantis address (`74932015…`). Duplicate `9efda634…` (Atlantis Residence) left unchanged.

## Chain

| Doc | Number | AED | Status |
|-----|--------|----:|--------|
| Sales order | **GENCardM2607067755** | 345.00 | **Доставлен** |
| Invoice | **04773** | 345.00 | paid |
| Shipment | **06484** | 345.00 | paid |
| Payment in | **05894** | 345.00 | linked to 06484 |

- [Order](https://online.moysklad.ru/app/#customerorder/edit?id=23cec5e2-791d-11f1-0a80-103200798dbf)
- [Invoice 04773](https://online.moysklad.ru/app/#invoiceout/edit?id=240c7851-791d-11f1-0a80-1a690078f5b0)
- [Shipment 06484](https://online.moysklad.ru/app/#demand/edit?id=251682eb-791d-11f1-0a80-103200798df8)
- [Payment in 05894](https://online.moysklad.ru/app/#paymentin/edit?id=2582dda7-791d-11f1-0a80-1f210078232b)

## Lines

| Code | Product | Qty | Unit | Line |
|------|---------|----:|-----:|-----:|
| 00144 | Cushion #2 Beige | 1 | 300.00 | 300.00 |
| 00089 | Excellent Delivery Dubai | 1 | 45.00 | 45.00 |
| | | | **Total** | **345.00** |

PDF (retail template): `~/Desktop/orders/GENOSYS_Miss_Valeriya_04773.pdf`
