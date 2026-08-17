# Q2 VAT — Saldo flagged invoices fixed (14)

**Date:** 2026-07-10  
**Source:** Saldo draft sales report (Shruti Gulati) — red-highlighted invoices  

## Script

`node --import dotenv/config scripts/moysklad-fix-vat-q2-saldo-flagged-invoices-20260710.js --commit`

## Fixes applied

| Invoice | Issue | Fix |
|---------|-------|-----|
| **04333** | BB Cream line had VAT off | Enabled 5% VAT on Revita Glow BB Cream (order + invoice + shipment) |
| **04348, 04362, 04618** | Delivery VAT missing | Enabled 5% VAT on paid delivery lines |
| **04390, 04436, 04537, 04671, 04695, 04728, 04731, 04732** | Free delivery showed 45/70 AED @ 0 VAT | Delivery line → price **0**, discount **0** (invoice + shipment; order where present) |
| **04382, 04562, 04618** | Per-line rounding (≤0.03 AED) | PDF re-export only — totals unchanged |

## PDF output

**14 files** in `~/Desktop/orders/`:

`GENOSYS_VAT_FIX_04333.pdf` … `GENOSYS_VAT_FIX_04732.pdf`

**Also overwritten** in Q2 VAT monthly batches:

`Company_Legal/Tax/VAT/2026/Q2/Invoices_{April,May,June}_2026/Genosys_Invoice_Legal_TAX-…/Genosys_Invoice_Legal_TAX-{invoice}.pdf`

## Post-fix VAT check (MoySklad vatSum vs Saldo)

| Invoice | Saldo VAT | After fix | Status |
|---------|-----------|-----------|--------|
| 04333 | 15.00 | 14.99 | ✅ |
| 04348 | 25.95 | 25.95 | ✅ |
| 04362 | 16.43 | 16.43 | ✅ |
| 04382 | 52.10 | 52.07 | ⚠️ 0.03 rounding |
| 04390 | 17.86 | 17.85 | ✅ |
| 04436 | 56.67 | 56.67 | ✅ |
| 04537 | 13.62 | 13.61 | ✅ |
| 04562 | 49.29 | 49.27 | ✅ (0.02) |
| 04618 | 33.19 | 33.17 | ✅ (0.02) |
| 04671–04732 | (match) | (match) | ✅ |

Example verified PDF **04348**: delivery now **42.86 + 2.14 VAT = 45.00**; footer **519.05 + 25.95 = 545.00**.

## Reply draft to Saldo

> Hi Shruti,
>
> We corrected the 14 flagged tax invoices in MoySklad and re-exported revised PDFs (delivery VAT / free-delivery lines / BB cream VAT on 04333). Files are in our Q2 folder and attached from `~/Desktop/orders/GENOSYS_VAT_FIX_*.pdf`.
>
> Invoice **04382** still shows a **0.03 AED** VAT rounding difference (1,041.93 + 52.07 vs your 1,041.90 + 52.10) — same MoySklad per-line rounding as Q1. Please confirm if acceptable or if you need a manual adjustment.
>
> Best regards,  
> Vadim
