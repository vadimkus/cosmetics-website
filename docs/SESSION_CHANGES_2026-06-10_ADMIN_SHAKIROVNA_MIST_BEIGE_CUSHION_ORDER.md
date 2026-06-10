# Admin Shakirovna — Mist + Beige Cushion Order (2026-06-10)

**Date:** 2026-06-10 (UAE)

## Request

Existing customer **Admin Shakirovna Salon** — retail chain:

| Step | Document |
|------|----------|
| 1 | Заказ покупателя |
| 2 | Счёт покупателю |
| 3 | Отгрузка |

**Lines (genosys.ae retail, VAT incl.):**

| Code | Product | Qty | Unit AED | Line AED |
|------|---------|-----|----------|----------|
| `00188` | Genosys Microbiome Energy Infusing Mist 80ml | 1 | 80.00 | 80.00 |
| `00144` | Genosys Skin Caring Blemish Balm Cushion #2 Beige | 1 | 150.00 | 150.00 |
| (service) | Excellent Delivery Dubai | 1 | 10.00 | 10.00 |
| **Total** | | | | **240.00 AED** |

Landscape retail invoice PDF → `~/Desktop/orders/`.

## Customer

| Field | Value |
|--------|--------|
| Name | Admin Shakirovna Salon |
| ID | `8619c8a7-eb46-11ed-0a80-00cb00846a48` |

## Documents (posted)

| Step | Type | Number | Sum AED | ID |
|------|------|--------|---------|-----|
| Order | Заказ покупателя | **GENCardM260610SHK** | 240.00 | `31d33ad7-648e-11f1-0a80-1ccc000fe713` |
| Invoice | Счёт покупателю | **04648** | 240.00 | `3210093a-648e-11f1-0a80-026e000f6a1d` |
| Shipment | Отгрузка | **06328** | 240.00 | `32febb34-648e-11f1-0a80-1ba8000f86f8` |

**Chain:** order → invoice → **shipment from invoice only** (no direct order link on отгрузка).

**Payment:** not posted (unpaid shipment).

Links:

- [Order](https://online.moysklad.ru/app/#customerorder/edit?id=31d33ad7-648e-11f1-0a80-1ccc000fe713)
- [Invoice 04648](https://online.moysklad.ru/app/#invoiceout/edit?id=3210093a-648e-11f1-0a80-026e000f6a1d)
- [Shipment 06328](https://online.moysklad.ru/app/#demand/edit?id=32febb34-648e-11f1-0a80-1ba8000f86f8)

## PDF

| File | Size |
|------|------|
| `~/Desktop/orders/GENOSYS_Admin_Shakirovna_04648.pdf` | 89,771 bytes |

Template: **Genosys_Invoice_Legal_TAX_RETAIL_PRINT** (horizontal / landscape).

## Script

`scripts/moysklad-create-admin-shakirovna-mist-beige-cushion-order-invoice-20260610.js`

```bash
node --import dotenv/config scripts/moysklad-create-admin-shakirovna-mist-beige-cushion-order-invoice-20260610.js
node --import dotenv/config scripts/moysklad-create-admin-shakirovna-mist-beige-cushion-order-invoice-20260610.js --commit
```

Marker: `ADMIN-SHAKIROVNA-MIST-BEIGE-CUSHION-2026-06-10`.

## Price correction (same day)

Initial post used mist @ **160 AED** (wrong — confused with clinic list / “80ml” label). Correct genosys.ae retail is **80 AED**. Amended order **04648** / shipment **06328** to **240 AED** total; PDF re-exported.

```bash
node --import dotenv/config scripts/moysklad-create-admin-shakirovna-mist-beige-cushion-order-invoice-20260610.js --fix-existing-prices
```
