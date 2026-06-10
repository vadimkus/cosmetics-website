# Miss Anna Sakhugova — customer order, invoice, PDF (Genosys_Invoice_Legal_TAX)

**Date:** 2026-05-11

## Request

- Customer: **Miss Anna Sakhugova**
- Items: overnight mask ×1, eye serum ×1, eye cream ×2, Excellent Delivery Dubai ×1
- Sales order + **Счет покупателю** + PDF to Desktop using template **Genosys_Invoice_Legal_TAX**, print invoice

## MoySklad

| Field | Value |
|--------|--------|
| **Counterparty** | `Miss Anna Sakhugova` (created) `c57cb51f-4dd6-11f1-0a80-093500b68314` |
| **Order** | `GENCardM2605116924` `c755dbc8-4dd6-11f1-0a80-1d2600b49c38` |
| **Invoice** | `04494` `c7b40bba-4dd6-11f1-0a80-0c4600b3359e` |
| **Sum** | **770.00 AED** VAT-inclusive |
| **Invoice UI** | https://online.moysklad.ru/app/#invoiceout/edit?id=c7b40bba-4dd6-11f1-0a80-0c4600b3359e |

## Lines

| Code | Product / service | Qty | Unit AED | Line AED |
|------|-------------------|-----|----------|----------|
| 00189 | Genosys Skin Rescue Overnight Cream Mask 100g | 1 | 170.00 | 170.00 |
| 00054 | Genosys EyeCell Eye Contour Serum 10ml | 1 | 185.00 | 185.00 |
| 00055 | Genosys EyeCell Eye Contour Cream 20ml | 2 | 185.00 | 370.00 |
| *(service)* | Excellent Delivery Dubai | 1 | 45.00 | 45.00 |

Retail list prices from stock report + delivery 45 AED (same service UUID as other Dubai retail orders).

## PDF + print

- Template **Genosys_Invoice_Legal_TAX** UUID (from `GET …/entity/invoiceout/metadata/customtemplate`): **`5e56cd7d-ce85-4db5-8771-d7531f9ffd71`** — the older doc ID `e7b91d0b-…` is **not** valid on this account and returns 404.
- Saved: **`~/Desktop/GENOSYS_Anna_Sakhugova_04494.pdf`**
- **Print:** sent to default printer via `lp` (EPSON queue).

## Script

`scripts/moysklad-create-anna-sakhugova-order-invoice-20260511.js` — dry-run / `--commit` / `--no-print`  
Also updated **`scripts/moysklad-create-bianco-jge-order-invoice-20260509.js`** to use the same template UUID.
