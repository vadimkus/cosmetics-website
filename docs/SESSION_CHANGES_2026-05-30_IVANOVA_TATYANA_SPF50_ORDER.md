# Miss Ivanova Tatyana — Retail Order (No Invoice)

**Date:** 2026-05-30 (UAE)

## Request

New customer, **order only** (no invoice, no delivery):

| Field | Value |
|--------|--------|
| Name | Miss Ivanova Tatyana |
| Phone | +971 58 694 9943 (`+971586949943`) |
| Address | Beach Vista, Tower 2, Dubai |

**Line:** Ultra Shield SPF50 × **20** @ **250 AED** each.

## Customer (created)

| Field | Value |
|--------|--------|
| Name | Miss Ivanova Tatyana |
| ID | `fad878ab-5c37-11f1-0a80-0e1a003e979d` |
| Phone | +971586949943 |
| Address | Beach Vista, Tower 2, Dubai |

## Order

| Field | Value |
|--------|--------|
| Заказ покупателя | **GENCardM2605309943** |
| ID | `fc2914f4-5c37-11f1-0a80-110c0040b6d0` |
| Sum | **5,000.00 AED** VAT-inclusive |
| State | Новый |
| Invoice | **Not created** (per request) |
| [Open order](https://online.moysklad.ru/app/#customerorder/edit?id=fc2914f4-5c37-11f1-0a80-110c0040b6d0) |

## Lines

| Code | Product | Qty | Unit AED | Line AED |
|------|---------|-----|----------|----------|
| `54457` | Genosys Ultra Shield Sun Cream SPF50/PA++++ 50g | 20 | 250.00 | 5,000.00 |

Custom unit price **250 AED** (not default list 125 AED).

## Script

`scripts/moysklad-create-ivanova-tatyana-spf50-order-20260530.js`

```bash
node --import dotenv/config scripts/moysklad-create-ivanova-tatyana-spf50-order-20260530.js
node --import dotenv/config scripts/moysklad-create-ivanova-tatyana-spf50-order-20260530.js --commit
```
