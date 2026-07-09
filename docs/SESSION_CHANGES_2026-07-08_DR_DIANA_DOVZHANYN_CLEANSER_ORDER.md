# Dr. Diana Dovzhanyn — Snow cleanser repeat order (2026-07-08)

**Customer:** Dr. Diana Dovzhanyn (`6b910982-535f-11f1-0a80-1ad600095dc5`)  
**Phone:** +971558552397  
**Ship:** Park Ridge Tower C, app 902, Dubai Hills  
**Script:** `scripts/moysklad-create-dr-diana-dovzhanyn-cleanser-order-invoice-demand-paymentin-20260708.js --commit`

Repeat of prior invoice pattern (04541): cleanser 500ml + paid delivery. **Clinic list** (not retail).

## Order chain

| Doc | Number | AED |
|---|---|---|
| Sales order | **GENCardM2607082397** | 300.00 |
| Invoice | **04786** | 300.00 |
| Shipment | **06500** | 300.00 |
| Payment in | **05903** | 300.00 |

**Lines (clinic salePrice, VAT incl.):**

| Code | Product / service | Qty | Unit | Line |
|---|---|---:|---:|---:|
| `00024` | Snow O₂ Cleanser 500ml | 1 | 255.00 | 255.00 |
| — | Excellent Delivery Dubai | 1 | 45.00 | 45.00 |

Order status: **Доставлен** · Shipment fully paid (300 / 300 AED).

## Price correction (2026-07-08)

Initially posted at retail (510 + 45 = 555). Corrected to clinic list via `scripts/moysklad-fix-dr-diana-dovzhanyn-clinic-price-20260708.js --commit` — cleanser **255**, payment **05903** adjusted to **300 AED**, PDF re-exported.

## PDF

`~/Desktop/orders/GENOSYS_Dr_Diana_Dovzhanyn_04786.pdf`

## Links

- SO: https://online.moysklad.ru/app/#customerorder/edit?id=4aa9824c-7ac0-11f1-0a80-153f001a7576
- Invoice: https://online.moysklad.ru/app/#invoiceout/edit?id=4afb6bfe-7ac0-11f1-0a80-078b0019c9d8
- Shipment: https://online.moysklad.ru/app/#demand/edit?id=4bb000e0-7ac0-11f1-0a80-0da50019e526
- Payment in: https://online.moysklad.ru/app/#paymentin/edit?id=4bf6afec-7ac0-11f1-0a80-04c0001964a1
