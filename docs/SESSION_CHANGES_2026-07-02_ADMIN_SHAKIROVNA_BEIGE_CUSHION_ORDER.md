# Session: Admin Shakirovna — beige cushion order (SO + invoice + shipment)

**Date:** 2026-07-02 (amended same day)  
**Counterparty:** Admin Shakirovna Salon (`8619c8a7-eb46-11ed-0a80-00cb00846a48`)

## Documents

| Type | № | Sum (incl. VAT) | Link |
|------|---|-----------------|------|
| Заказ покупателя | **GENCardM260702SHKB** | **630.00 AED** | https://online.moysklad.ru/app/#customerorder/edit?id=357a3252-75e8-11f1-0a80-066c00397f9b |
| Счёт покупателю | **04749** | **630.00 AED** | https://online.moysklad.ru/app/#invoiceout/edit?id=35d3e64e-75e8-11f1-0a80-1b130039778e |
| Отгрузка | **06451** | **630.00 AED** | https://online.moysklad.ru/app/#demand/edit?id=367e29a1-75e8-11f1-0a80-04b10038361c |

## Lines (amended)

| Code | Product | Qty | Unit AED |
|------|---------|----:|---------:|
| `00144` | Skin Caring Blemish Balm Cushion #2 Beige | 1 | 150.00 |
| `00189` | Skin Rescue Overnight Cream Mask 100g | 1 | 170.00 |
| `00191` | Multi Functional Anti-Wrinkle Serum 30ml | 1 | 165.00 |
| `00022` | Snow Booster Toner 200ml | 1 | 130.00 |
| *(service)* | Excellent Delivery Dubai | 1 | 15.00 |
| **Total** | | | **630.00** |

## PDF

Retail print template → `~/Desktop/orders/GENOSYS_Admin_Shakirovna_04749.pdf` (reissued after amendment)

## Scripts

- Created: `scripts/moysklad-create-admin-shakirovna-beige-cushion-order-invoice-demand-20260628.js --commit`
- Amended: `scripts/moysklad-fix-admin-shakirovna-shkb-add-lines-20260702.js --commit`
