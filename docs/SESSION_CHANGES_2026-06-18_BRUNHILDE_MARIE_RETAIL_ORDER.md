# Brunhilde Marie — retail full chain (2026-06-18)

## Customer (new)

- **Name:** Brunhilde Marie
- **Phone:** +971502911388
- **MoySklad ID:** `5dd619d0-6b2e-11f1-0a80-193b004cb31a`
- **Address:** Al Noor tower, Apartment 1902, Business Bay, Dubai

## Documents

| Step | Doc | Number | Amount AED | ID |
|---|---|---|---:|---|
| Order | SO | **GENCardM2606181388** | 333.00 | `5ed8e7e7-6b2e-11f1-0a80-1004004aed4c` |
| Invoice | Счёт | **04697** | 333.00 | `5f615236-6b2e-11f1-0a80-1e05004ca266` |
| Shipment | Отгрузка | **06383** | 333.00 | `60165a66-6b2e-11f1-0a80-00a9004c1d45` |
| Payment in | Входящий | **05791** | 333.00 | `606aab40-6b2e-11f1-0a80-1a5a004c0df1` |

- [Order](https://online.moysklad.ru/app/#customerorder/edit?id=5ed8e7e7-6b2e-11f1-0a80-1004004aed4c)
- [Invoice](https://online.moysklad.ru/app/#invoiceout/edit?id=5f615236-6b2e-11f1-0a80-1e05004ca266)
- [Shipment](https://online.moysklad.ru/app/#demand/edit?id=60165a66-6b2e-11f1-0a80-00a9004c1d45)
- [Payment in](https://online.moysklad.ru/app/#paymentin/edit?id=606aab40-6b2e-11f1-0a80-1a5a004c0df1)

## Lines (retail)

| Code | Product | Qty | Price AED |
|---|---|---:|---:|
| 00063 | Intensive Repair Collagen Mask 23g | 6 | 36 |
| 00140 | Soothing Bomb Sea Algae Mask 23g | 2 | 36 |
| 00089 | Excellent Delivery Dubai | 1 | 45 |

**Total:** 216 + 72 + 45 = **333.00 AED** VAT incl. — fully paid.

## PDF

`~/Desktop/orders/GENOSYS_Brunhilde_Marie_04697.pdf`

## Script

```bash
node --import dotenv/config scripts/moysklad-create-brunhilde-marie-order-invoice-demand-paymentin-20260618.js --commit
```
