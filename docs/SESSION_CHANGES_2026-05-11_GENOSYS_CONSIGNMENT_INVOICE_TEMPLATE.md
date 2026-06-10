# Genosys MoySklad Consignment Invoice Template Rework

Date: 2026-05-11

## Output

Reworked the consignment sales invoice template into the newer clean GENOSYS invoice format.

- Source: `/Users/vadimkus/Desktop/invoice_ART/Consignment/Cons_INV/Invoice_Consignment_Sales_Genosys.xls`
- New template: `/Users/vadimkus/Desktop/invoice_ART/Consignment/Cons_INV/Invoice_Consignment_Sales_Genosys_CLEAN.xls`
- Preview PDF: `/Users/vadimkus/Desktop/invoice_ART/Consignment/Cons_INV/Invoice_Consignment_Sales_Genosys_CLEAN.pdf`
- Preview PNG: `/Users/vadimkus/Desktop/invoice_ART/Consignment/Cons_INV/Invoice_Consignment_Sales_Genosys_CLEAN_preview.png`

## Changes

- Applied the clean GENOSYS header with logo on the left and legal/bank details on the right.
- Removed the old boxed supplier block and `Delivered with Love` tagline.
- Kept the invoice title flow with invoice number and date, and added `Consignment sales` subtitle.
- Made the `Consignment sales` subtitle bold, black, and placed directly under the `TAX INVOICE` line.
- Preserved consignment buyer fields based on `sourceAgentRequisite`.
- Kept buyer `TRN #` and `License #` rows visible.
- Reworked the VAT line-item table with gray header, clearer column labels, and accounting money formats.
- Removed the digital stamp/print image from the signature area after review.
- Forced A4 landscape print layout for better table spacing.

## Validation

LibreOffice macro build validation:

- Old file size: `45,056`
- New file size: `46,592`
- Rows: old `43`, new `47`
- Columns: old `18`, new `18`
- Required MoySklad/JXLS placeholders preserved: `8/8`
- Verdict: `OK — safe to upload to MoySklad`

## Builder

Temporary builder used during the session:

- `/tmp/genosys-consignment-invoice-builder/Module1.xba`
- `/tmp/genosys-consignment-invoice-builder/build.sh`

