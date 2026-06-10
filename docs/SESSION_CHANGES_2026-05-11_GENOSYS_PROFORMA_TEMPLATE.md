# Genosys MoySklad Proforma Template Rework

Date: 2026-05-11

## Output

Reworked the proforma invoice template into the newer clean GENOSYS invoice format.

- Source: `/Users/vadimkus/Desktop/invoice_ART/Proforma/Genosys_Invoice_PROFORMA.xls`
- New template: `/Users/vadimkus/Desktop/invoice_ART/Proforma/Genosys_Invoice_PROFORMA_CLEAN.xls`
- Preview PDF: `/Users/vadimkus/Desktop/invoice_ART/Proforma/Genosys_Invoice_PROFORMA_CLEAN.pdf`
- Preview PNG: `/Users/vadimkus/Desktop/invoice_ART/Proforma/Genosys_Invoice_PROFORMA_CLEAN_preview.png`

## Changes

- Applied the clean GENOSYS header with logo on the left and legal/bank details on the right.
- Removed the old boxed supplier block and `Delivered with Love` tagline.
- Changed the title block to a clean centered `PROFORMA INVOICE`.
- Added separate centered number/date and `Proforma invoice` subtitle lines.
- Preserved buyer fields based on `sourceAgentRequisite`.
- Fixed buyer address to use `${o.sourceAgentRequisite.actualAddress}` instead of `${o.sourceAgentRequisite.legalAddress}`, so customer actual addresses render in MoySklad output.
- Enabled wrapping on the buyer address row.
- Kept buyer `TRN #` and `License #` rows visible.
- Reworked the VAT line-item table with gray header, clearer column labels, and accounting money formats.
- Removed the digital stamp/print image.
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

- `/tmp/genosys-proforma-builder/Module1.xba`
- `/tmp/genosys-proforma-builder/build.sh`

