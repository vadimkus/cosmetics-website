# Genosys MoySklad Consignment Stock Note Template Rework

Date: 2026-05-11

## Output

Reworked the consignment stock note template into the newer clean GENOSYS note/invoice format.

- Source: `/Users/vadimkus/Desktop/invoice_ART/Consignment/Stock/Genosys_Consignment_Stock_Note.xls`
- New template: `/Users/vadimkus/Desktop/invoice_ART/Consignment/Stock/Genosys_Consignment_Stock_Note_CLEAN.xls`
- Preview PDF: `/Users/vadimkus/Desktop/invoice_ART/Consignment/Stock/Genosys_Consignment_Stock_Note_CLEAN.pdf`
- Preview PNG: `/Users/vadimkus/Desktop/invoice_ART/Consignment/Stock/Genosys_Consignment_Stock_Note_CLEAN_preview.png`

## Changes

- Applied the clean GENOSYS header with logo on the left and legal/bank details on the right.
- Removed the old boxed supplier block and `Delivered with Love` tagline.
- Changed the title to `CONSIGNMENT STOCK NOTE`.
- Added bold centered `Consignment stock` subtitle directly under the title.
- Kept stock note number and date on a smaller line below the subtitle.
- Preserved stock-note buyer fields based on `targetAgentRequisite`.
- Kept buyer `TRN #` and `License #` rows visible.
- Reworked the VAT line-item table with gray header, clearer column labels, and accounting money formats.
- Removed the digital stamp/print image.
- Forced A4 landscape print layout for better table spacing.

## Validation

LibreOffice macro build validation:

- Old file size: `45,056`
- New file size: `46,080`
- Rows: old `43`, new `47`
- Columns: old `18`, new `18`
- Required MoySklad/JXLS placeholders preserved: `8/8`
- Verdict: `OK — safe to upload to MoySklad`

## Builder

Temporary builder used during the session:

- `/tmp/genosys-consignment-stock-builder/Module1.xba`
- `/tmp/genosys-consignment-stock-builder/build.sh`

