# Q2 VAT — Standard sales Excel for accountant

**Date:** 2026-07-06  
**Request from:** Saldo Accounting — normal sales report Excel  

## File (final)

`/Users/vadimkus/Desktop/Drive/Genosys/Company_Legal/Tax/VAT/2026/Q2/Standard_sales_report.xlsx`

| Metric | Value |
|--------|-------|
| Invoices | **413** (04xxx series) |
| Range | **04327 → 04741** (gaps: 04349, 04739 — not issued) |
| Total incl. VAT | **340,551.41 AED** |
| Period | 01-Apr-2026 — 30-Jun-2026 |
| Customer names | **413/413 populated** (222 unique counterparties) |

Format matches `Consignment_invoices_All_Q2/Consignment_sales_report.xlsx` (company header + invoice table).

## Fix applied (same day)

First export had blank **Customer** column — MoySklad drops `expand=agent` names on `limit=1000` pages. Script updated to resolve counterparties via href cache (same pattern as `moysklad-q1-report.js`), then regenerated.

## Script

`node --import dotenv/config scripts/vat-q2-2026-standard-sales-xlsx.js`

## Reply draft

> Hi Anamta,
>
> Please find attached **Standard_sales_report.xlsx** in the Q2 VAT folder — 413 standard sales invoices (04327–04741), total 340,551.41 AED incl. VAT.
>
> Path: `Company_Legal/Tax/VAT/2026/Q2/Standard_sales_report.xlsx`
>
> Best regards,  
> Vadim
