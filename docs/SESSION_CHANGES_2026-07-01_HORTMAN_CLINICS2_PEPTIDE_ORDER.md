# Hortman Clinics 2 — Peptide masks ×100 (SO + invoice + shipment)

**Date:** 2026-07-01  
**Customer:** HORTMAN CLINICS 2 L.L.C (`1ac006c7-2687-11f0-0a80-094f001f888f`)  
**Phone:** 0522542623  
**Address:** 450 Jumeira St, Jumeirah 3, Dubai  

## Lines

| Code | Product | Qty | Unit (ex VAT) | Line base | Total (VAT incl.) |
|------|---------|-----|---------------|-----------|-------------------|
| 00012 | Genosys Peptide Gel Mask 39g | 100 | 38.00 AED | 3,800.00 | **3,990.00 AED** |

**Payment terms:** 90 days from 01/07/2026  
**VAT:** clinic list **ex-VAT** — 5% added on top (`vatIncluded: false`). Same as all prior Hortman orders.

| | Ex-VAT | VAT 5% | Total |
|--|--------|--------|-------|
| 100 × 38 AED | 3,800.00 | 190.00 | **3,990.00** |

## Documents created

| Step | Type | Name | Sum (AED) | ID |
|------|------|------|-----------|-----|
| 1 | Customer order | CODM2607016482 | 3,990.00 | `62ecdd21-7511-11f1-0a80-0ffa0010eaa2` |
| 2 | Invoice out | 04744 | 3,990.00 | `6328f705-7511-11f1-0a80-077e001082cc` |
| 3 | Shipment (demand) | 06439 | 3,990.00 | `63d1fce5-7511-11f1-0a80-1b130010d761` |

- Invoice state: **Выписан**
- Shipment state: **Отгружено**
- Chain: order → invoice → shipment (same pricing as prior Hortman peptide order May 2025)

## PDF

| Template | File |
|----------|------|
| Genosys_Invoice_Legal_TAX_RETAIL_PRINT | `~/Desktop/orders/GENOSYS_Hortman_Clinics2_04744.pdf` |
| **Genosys_Invoice_Legal_TAX** (no retail print) | `~/Desktop/orders/GENOSYS_Hortman_Clinics2_04744_Legal.pdf` |

## Script

`scripts/moysklad-create-hortman-clinics2-peptide-order-invoice-demand-20260701.js`
