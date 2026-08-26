# Le Ciel — beige cushion ×2 (2026-08-21)

**Customer:** LE CIEL BEAUTY SPOT Perfumes & Cosmetics Trading CO. L.L.C S.O.C  
**Script:** `scripts/moysklad-create-le-ciel-beige-cushion-x2-20260821.js --commit`

Clinic list. Unpaid. Chain: SO → INV → SHIP (invoice-only). SO **Доставлен - Ждем оплату**.

| Line | Qty | Unit | Sum |
|------|----:|-----:|----:|
| 00144 Beige cushion | 2 | 150 | 300 |
| Delivery Dubai | 1 | 45 | 45 |
| **Total** | | | **345 AED** |

| Doc | Number | Sum |
|-----|--------|----:|
| SO | **GENCardM260821CIELBG2** | 345 |
| Invoice | **04959** | 345 unpaid |
| Shipment | **06721** | 345 |

Ship: Al Wasl Rd, Block A, 1107, Dubai.

PDF: `~/Desktop/orders/GENOSYS_Le_Ciel_04959.pdf`  
Not printed.

## Update — paymentin 21 Aug 2026

| Doc | Number | Sum | Status |
|-----|--------|----:|--------|
| Paymentin | **06106** | 345 | posted |
| Order | **GENCardM260821CIELBG2** | 345 | **Доставлен** |
| Invoice | **04959** | 345 | paid |
| Shipment | **06721** | 345 | paid |

https://online.moysklad.ru/app/#paymentin/edit?id=adb8f32b-9d6d-11f1-0a80-1a6700339ff0

Script: `scripts/moysklad-create-le-ciel-paymentin-04959-20260821.js --commit`
