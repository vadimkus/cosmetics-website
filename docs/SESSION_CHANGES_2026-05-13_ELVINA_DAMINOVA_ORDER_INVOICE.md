# Elvina Daminova — MoySklad Retail Order + Invoice

**Date:** 2026-05-13

## Request

Create a new retail sales order with invoice for **Elvina Daminova**:

- Hair Tonic × 7 pcs
- Eye patches × 2 pcs
- Save retail invoice PDF to Desktop
- Print using retail invoice template

## MoySklad Result

| Field | Value |
|-------|-------|
| Counterparty | **Miss Elvina Daminova** `c1674a89-0690-11f1-0a80-064600136cbe` |
| Customer order | **GENCardM2605131770** |
| Order ID | `1e3d5b15-4e91-11f1-0a80-1650000f0c59` |
| Invoice | **04500** |
| Invoice ID | `1e79e892-4e91-11f1-0a80-0fcc001009a0` |
| Total | **1,395.00 AED** VAT-inclusive |
| Template | `Genosys_Invoice_Legal_TAX` retail invoice |
| PDF | `/Users/vadimkus/Desktop/GENOSYS_Elvina_Daminova_04500.pdf` |
| Print | Sent to default printer via `lp` (`EPSON_L3260_Series`) |

## Lines

| Code | Product | Qty | Unit AED | Total AED |
|------|---------|----:|---------:|----------:|
| `00051` | Genosys HR³ Matrix Hair Tonic 70ml | 7 | 145.00 | 1,015.00 |
| `00053` | Genosys EyeCell Eye Peptide Gel Patch (box) | 2 | 190.00 | 380.00 |

## Links

- [Open customer order](https://online.moysklad.ru/app/#customerorder/edit?id=1e3d5b15-4e91-11f1-0a80-1650000f0c59)
- [Open invoice](https://online.moysklad.ru/app/#invoiceout/edit?id=1e79e892-4e91-11f1-0a80-0fcc001009a0)

## Script

`scripts/moysklad-create-elvina-daminova-hair-tonic-eye-patches-invoice-20260513.js`
