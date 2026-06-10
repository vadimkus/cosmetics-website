# Admin Shakirovna — Fully Paid Retail Chain

**Date:** 2026-05-30 (UAE)

## Request

Existing customer **Admin Shakirovna Salon** — full retail chain with **cash payment**:

| Step | Document |
|------|----------|
| 1 | Заказ покупателя |
| 2 | Счёт покупателю |
| 3 | Отгрузка |
| 4 | Входящий платёж (наличные) |

**Line:** Ivory BB cushion × **1** @ **150 AED**.

## Customer

| Field | Value |
|--------|--------|
| Name | Admin Shakirovna Salon |
| ID | `8619c8a7-eb46-11ed-0a80-00cb00846a48` |

## Documents (posted)

| Step | Type | Number | Sum AED | ID |
|------|------|--------|---------|-----|
| Order | Заказ покупателя | **GENCardM2605307390** | 150.00 | `4c4accf9-5c39-11f1-0a80-159b00418069` |
| Invoice | Счёт покупателю | **04592** | 150.00 | `4c919231-5c39-11f1-0a80-0b680041073c` |
| Shipment | Отгрузка | **06251** | 150.00 | `afe60951-5c3c-11f1-0a80-0b68004184fe` |
| Cash in | Входящий платёж | **00166** | 150.00 | `b04eec92-5c3c-11f1-0a80-07fe0041d44b` |

**Chain (correct):** order → invoice → **shipment from invoice** (no direct order link on отгрузка) → **cash from shipment**.

**Payment status:** all documents fully paid (150 / 150 AED). Order state **Доставлен**.

Links:

- [Order](https://online.moysklad.ru/app/#customerorder/edit?id=4c4accf9-5c39-11f1-0a80-159b00418069)
- [Invoice 04592](https://online.moysklad.ru/app/#invoiceout/edit?id=4c919231-5c39-11f1-0a80-0b680041073c)
- [Shipment 06251](https://online.moysklad.ru/app/#demand/edit?id=afe60951-5c3c-11f1-0a80-0b68004184fe)
- [Cash in 00166](https://online.moysklad.ru/app/#cashin/edit?id=b04eec92-5c3c-11f1-0a80-07fe0041d44b)

### Chain fix (2026-05-31)

Initial API post linked shipment to order + invoice and cash to invoice. Recreated shipment/cash so UI matches standard flow: invoice-only отгрузка, cash linked to demand (`operations[].type = demand`).

## Lines

| Code | Product | Qty | Unit AED | Line AED |
|------|---------|-----|----------|----------|
| `00143` | Genosys Skin Caring Blemish Balm Cushion #1 Ivory | 1 | 150.00 | 150.00 |

## Script

`scripts/moysklad-create-admin-shakirovna-ivory-cushion-paid-20260530.js`

```bash
node --import dotenv/config scripts/moysklad-create-admin-shakirovna-ivory-cushion-paid-20260530.js
node --import dotenv/config scripts/moysklad-create-admin-shakirovna-ivory-cushion-paid-20260530.js --commit
```

Marker: `ADMIN-SHAKIROVNA-IVORY-CUSHION-PAID-2026-05-30`.
