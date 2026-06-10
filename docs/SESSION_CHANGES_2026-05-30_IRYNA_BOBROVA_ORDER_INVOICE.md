# Iryna Bobrova — Retail Order + Invoice

**Date:** 2026-05-30 (UAE)

## Request

New retail customer:

- **Name:** Iryna Bobrova
- **Phone:** +971 555 89 78 22 (`+971555897822`)
- **Address:** Discovery Gardens, Dubai

**Lines (retail / list prices):**

| Item | Qty |
|------|-----|
| Eye peptide gel patches (box) | 1 |
| BB Cushion #2 Beige | 1 |

No delivery line requested.

## Customer (created)

| Field | Value |
|--------|--------|
| Name | Iryna Bobrova |
| ID | `162e4269-5c35-11f1-0a80-0188003f6588` |
| Phone | +971555897822 |
| Address | Discovery Gardens, Dubai |
| Type | Individual |

## Order

| Field | Value |
|--------|--------|
| Заказ покупателя | **GENCardM2605307822** |
| ID | `17562431-5c35-11f1-0a80-0b680040267c` |
| Sum | **340.00 AED** VAT-inclusive |
| State | Новый |
| [Open order](https://online.moysklad.ru/app/#customerorder/edit?id=17562431-5c35-11f1-0a80-0b680040267c) |

## Invoice

| Field | Value |
|--------|--------|
| Счёт покупателю | **04590** |
| ID | `18066f99-5c35-11f1-0a80-041e0040afe5` |
| Sum | **340.00 AED** |
| [Open invoice](https://online.moysklad.ru/app/#invoiceout/edit?id=18066f99-5c35-11f1-0a80-041e0040afe5) |

## Lines

| Code | Product | Qty | Unit (retail) | Line |
|------|---------|-----|---------------|------|
| `00053` | Genosys EyeCell Eye Peptide Gel Patch (box) | 1 | 190.00 | 190.00 |
| `00144` | Genosys Skin Caring Blemish Balm Cushion #2 Beige | 1 | 150.00 | 150.00 |
| | | | **Total** | **340.00 AED** |

Prices from MoySklad `salePrice` (retail list).

## Script

`scripts/moysklad-create-iryna-bobrova-order-invoice-20260529.js`

```bash
node --import dotenv/config scripts/moysklad-create-iryna-bobrova-order-invoice-20260529.js
node --import dotenv/config scripts/moysklad-create-iryna-bobrova-order-invoice-20260529.js --commit
```
