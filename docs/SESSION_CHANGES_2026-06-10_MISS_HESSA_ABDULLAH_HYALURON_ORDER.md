# Miss Hessa Abdullah — Hyaluron Retail Order (2026-06-10)

**Date:** 2026-06-10 (UAE)

## Correction (2026-06-10)

Invoice **04651** had been created with wrong lines (MoySklad link-only fallback pulled stale positions: sea algae + collagen masks, VAT-incl prices as ex-VAT). **Fixed:** invoice corrected first; then SO **GENCardM2606105536** and shipment **06332** synced from invoice via `--fix-chain`. All three docs now identical:

| Code | Qty | Unit ex-VAT | Line ex-VAT |
|------|-----|-------------|-------------|
| `54458` | 1 | 276.19 | 276.19 |
| `00195` | 1 | 314.29 | 314.29 |
| `00089` delivery | 1 | 45.00 | 45.00 |
| **Total VAT incl.** | | | **667.25 AED** |

PDF re-exported: `~/Desktop/orders/GENOSYS_Miss_Hessa_Abdullah_04651.pdf`.

Script flags: `--fix-invoice`, `--fix-chain` on `moysklad-create-miss-hessa-abdullah-hyaluron-order-invoice-demand-20260610.js`.

## Request

New customer **Miss Hessa Abdullah** — full retail chain (ex-VAT pricing, `vatIncluded: false`):

| Step | Document |
|------|----------|
| 1 | Контрагент (new) |
| 2 | Заказ покупателя |
| 3 | Счёт покупателю |
| 4 | Отгрузка (from invoice only, state Shipped) |

Landscape retail invoice PDF → `~/Desktop/orders/`.

## Customer (new)

| Field | Value |
|--------|--------|
| Name | Miss Hessa Abdullah |
| Phone | +971506445536 |
| Address | Kas Residence, Villa 11, Dubai, UAE |
| ID | `6e03d67a-64bd-11f1-0a80-1ccc001b2f1b` |

## Documents (posted)

| Step | Type | Number | Sum AED (VAT incl.) | ID |
|------|------|--------|---------------------|-----|
| Order | Заказ покупателя | **GENCardM2606105536** | 667.25 | `6ef3de64-64bd-11f1-0a80-1120001b425e` |
| Invoice | Счёт покупателю | **04651** | 667.25 | `6f3647eb-64bd-11f1-0a80-1120001b426f` |
| Shipment | Отгрузка | **06332** | 667.25 | `701ebe8d-64bd-11f1-0a80-1efa001c50d8` |

**Chain:** order → invoice → **shipment from invoice only** (no direct order link on отгрузка).

**Payment:** not posted (unpaid shipment).

Links:

- [Customer](https://online.moysklad.ru/app/#company/edit?id=6e03d67a-64bd-11f1-0a80-1ccc001b2f1b)
- [Order](https://online.moysklad.ru/app/#customerorder/edit?id=6ef3de64-64bd-11f1-0a80-1120001b425e)
- [Invoice 04651](https://online.moysklad.ru/app/#invoiceout/edit?id=6f3647eb-64bd-11f1-0a80-1120001b426f)
- [Shipment 06332](https://online.moysklad.ru/app/#demand/edit?id=701ebe8d-64bd-11f1-0a80-1efa001c50d8)

## Lines (ex-VAT — `vatIncluded: false`)

| Code | Product | Qty | Unit ex-VAT | Line ex-VAT | Retail incl. (÷1.05) |
|------|---------|-----|-------------|-------------|----------------------|
| `54458` | Moisture Replenishing Hyaluron Cream 50g | 1 | 276.19 | 276.19 | 290.00 |
| `00195` | Moisture Replenishing Hyaluron Serum 30ml | 1 | 314.29 | 314.29 | 330.00 |
| (service) | Excellent Delivery Dubai | 1 | 45.00 | 45.00 | — |
| **Subtotal** | | | | **635.48** | |
| VAT 5% | | | | **31.77** | |
| **Total** | | | | **667.25 AED** | |

## Stock at order time

| Code | Available |
|------|-----------|
| `54458` | 112 |
| `00195` | 61 |

## PDF

| File | Template | Size |
|------|----------|------|
| `~/Desktop/orders/GENOSYS_Miss_Hessa_Abdullah_04651.pdf` | Genosys_Invoice_Legal_TAX_RETAIL_PRINT (horizontal) | 89,142 bytes |

## Script

`scripts/moysklad-create-miss-hessa-abdullah-hyaluron-order-invoice-demand-20260610.js`

```bash
node --import dotenv/config scripts/moysklad-create-miss-hessa-abdullah-hyaluron-order-invoice-demand-20260610.js
node --import dotenv/config scripts/moysklad-create-miss-hessa-abdullah-hyaluron-order-invoice-demand-20260610.js --commit
```

Marker: `MISS-HESSA-ABDULLAH-HYALURON-2026-06-10`.
