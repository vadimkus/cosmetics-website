# ANJANA SPA - FZE — masks SO + invoice + shipment

**Date:** 2026-08-30  
**Customer:** ANJANA SPA - FZE (`d5532af5-6356-11f1-0a80-08090090f8b4`)  
**Script:** `scripts/moysklad-create-anjana-spa-masks-20260830.js --commit`

Same clinic mask deal as 2026-06-08 and 2026-08-04: list 18 → 14.50 net, free delivery, 1,450 AED. Paid 2026-08-30.

## Documents

| Doc | Name | Amount |
|-----|------|-------:|
| Sales order | **GENCardM260830ANJ** | 1,450.00 |
| Invoice | **04990** | 1,450.00 |
| Shipment | **06758** | 1,450.00 |

SO → **Доставлен** · demand invoice-only · Legal_TAX · VAT included · **paid**

## Paymentin

| Doc | Name | Amount |
|-----|------|-------:|
| Payment in | **06146** | 1,450.00 |

Linked to shipment **06758**. No incoming bank ref. Org bank.

- Paymentin: https://online.moysklad.ru/app/#paymentin/edit?id=409f5ab6-a456-11f1-0a80-18200092fa10
- Script: `scripts/moysklad-create-anjana-spa-paymentin-04990-20260830.js --commit`

Ship: **Anjana Spa at Rixos The Palm, Jumeirah, Dubai, UAE**

## Lines (list 18 → 14.50 net, disc 19.4444%)

| Code | Product | Qty | Net/pc | Line |
|------|---------|----:|-------:|-----:|
| 00063 | Intensive Repair Collagen Mask (red) | 50 | 14.50 | 725 |
| 00140 | Soothing Bomb Sea Algae Mask (green) | 50 | 14.50 | 725 |
| | **Total** | **100** | | **1,450** |

## Links

- Order: https://online.moysklad.ru/app/#customerorder/edit?id=57757798-a447-11f1-0a80-1820008dc4f2
- Invoice: https://online.moysklad.ru/app/#invoiceout/edit?id=57a5a04b-a447-11f1-0a80-0889008a087d
- Shipment: https://online.moysklad.ru/app/#demand/edit?id=58920014-a447-11f1-0a80-1372008eebe4

## PDF

`~/Desktop/orders/GENOSYS_ANJANA_SPA_Invoice_04990.pdf` (Legal_TAX, not printed)
