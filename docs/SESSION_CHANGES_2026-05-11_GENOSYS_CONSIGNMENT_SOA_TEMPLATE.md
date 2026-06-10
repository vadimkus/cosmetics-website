# Genosys MoySklad Consignment SOA Template Rework

Date: 2026-05-11

## Output

Reworked the consignment delivered / not paid SOA template into the same clean GENOSYS portrait format used for the updated SOA templates.

- Source: `/Users/vadimkus/Desktop/invoice_ART/consignment/SOA_Deliv_NotPaid_NEW2.xls`
- New template: `/Users/vadimkus/Desktop/invoice_ART/consignment/Genosys_Consignment_SOA_CLEAN.xls`
- Preview PDF: `/Users/vadimkus/Desktop/invoice_ART/consignment/Genosys_Consignment_SOA_CLEAN.pdf`
- Preview PNG: `/Users/vadimkus/Desktop/invoice_ART/consignment/Genosys_Consignment_SOA_CLEAN_preview.png`

## Changes

- Replaced the old boxed supplier block with the clean GENOSYS header and legal/bank details.
- Changed the title to `CONSIGNMENT SALES REPORT`.
- Kept the consignment-specific customer placeholder: `${row.sourceAgentRef.name}`.
- Reworked the table to portrait A4 with columns: `Invoice #`, `Customer`, `Invoice date`, `Amount AED`, `Paid AED`, `Balance AED`.
- Removed `Currency`, `Status`, and row-level `pending payment` text to avoid overlap in long generated statements.
- Added `AED` to final totals labels.
- Removed old leftover body/signature text from the source template before writing the new layout.

## Validation

LibreOffice macro build validation:

- Old file size: `39,424`
- New file size: `120,832`
- Rows: old `39`, new `43`
- Columns: old `12`, new `12`
- Merged regions: old `21`, new `22`
- Required MoySklad/JXLS placeholders preserved: `9/9`
- Verdict: `OK — SOA placeholders preserved`

## Builder

Temporary builder used during the session:

- `/tmp/genosys-consignment-soa-builder/Module1.xba`
- `/tmp/genosys-consignment-soa-builder/build.sh`

