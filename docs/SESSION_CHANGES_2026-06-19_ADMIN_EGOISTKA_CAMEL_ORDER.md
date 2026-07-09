# Admin Egoistka Salon — clinic full chain (2026-06-19)

## Customer (new)

- **Name:** Admin Egoistka Salon
- **MoySklad ID:** `d6fad5c5-6bbb-11f1-0a80-194000153d94`
- **Address:** Delphine Tower, Shop 2, Dubai Marina, Dubai

## Documents

| Step | Doc | Number | Amount AED | ID |
|---|---|---|---:|---|
| Order | SO | **GENCardM260619EGOK** | 600.00 | `d7c8f0cb-6bbb-11f1-0a80-151100141ee9` |
| Invoice | Счёт | **04700** | 600.00 | `d7f8824a-6bbb-11f1-0a80-00ad00144c68` |
| Shipment | Отгрузка | **06386** | 600.00 | `d9dc63dd-6bbb-11f1-0a80-1a5d00148f1e` |
| Payment in | Входящий | **05794** | 600.00 | `dad032e2-6bbb-11f1-0a80-112d0015296a` |

## Lines (clinic / оптовая)

| Code | Product | Qty | Price AED |
|---|---|---:|---:|
| 54464 | Skin Caring Blemish Balm Cushion #3 Camel | 4 | 150 |

**Total:** 600.00 AED — fully paid. No delivery line.

## PDF

`~/Desktop/orders/GENOSYS_Admin_Egoistka_Salon_04700.pdf`

## Script

```bash
node --import dotenv/config scripts/moysklad-create-admin-egoistka-camel-order-invoice-demand-paymentin-20260619.js --commit
```
