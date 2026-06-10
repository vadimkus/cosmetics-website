# Genosys MoySklad SOA Template Rework

Date: 2026-05-11

## Output

Reworked the old Statement of Account template into the new GENOSYS invoice visual format.

- Source: `/Users/vadimkus/Desktop/invoice_ART/SOA/SOA_old.xls`
- New template: `/Users/vadimkus/Desktop/invoice_ART/SOA/Genosys_SOA_CLEAN.xls`
- Preview PDF: `/Users/vadimkus/Desktop/invoice_ART/SOA/Genosys_SOA_CLEAN.pdf`
- Preview PNG: `/Users/vadimkus/Desktop/invoice_ART/SOA/Genosys_SOA_CLEAN_preview.png`

Additional copy without the digital stamp:

- New template: `/Users/vadimkus/Desktop/invoice_ART/SOA/Genosys_SOA_CLEAN_NO_STAMP.xls`
- Preview PDF: `/Users/vadimkus/Desktop/invoice_ART/SOA/Genosys_SOA_CLEAN_NO_STAMP.pdf`
- Preview PNG: `/Users/vadimkus/Desktop/invoice_ART/SOA/Genosys_SOA_CLEAN_NO_STAMP_preview.png`

## Changes

- Replaced the old boxed supplier block with a clean header: GENOSYS logo on the left, legal/company/bank details on the right.
- Added centered `STATEMENT OF ACCOUNT` title using the same clean typography as the new invoice templates.
- Moved statement metadata into a light-gray summary card.
- Reworked the invoice table with a gray header bar, clearer columns, and cleaner spacing.
- Reworked the long-statement table to portrait A4 and removed cramped `Currency` / `Status` columns.
- Changed row columns to `Invoice #`, `Customer`, `Invoice date`, `Amount AED`, `Paid AED`, and `Balance AED`.
- Stopped forcing the SOA to one page vertically, so long MoySklad statements can continue onto additional pages instead of shrinking/overlapping.
- Replaced line-level `pending payment` text with numeric paid/balance values to avoid table collisions.
- Widened the `Invoice #` and `Invoice date` columns and applied Excel date formatting to statement and invoice-date cells to prevent raw serial dates and `###` output after MoySklad rendering.
- Moved the explanatory sentence into the statement summary box as the fifth line and removed the separate right-side paragraph block.
- Added `AED` to the final totals labels: `Paid amount: AED` and `Pending payment: AED`.
- Fixed a portrait-header artifact where the bank line was clipped, leaving a stray fragment before `WIO Bank`; the bank line now uses a wider merged header range and shorter text.
- Moved totals to the right side with simpler labels for paid and pending amounts.
- Added a cleaner signature area and digital stamp placement below the table.
- Removed the `Delivered with Love` tagline from both SOA variants while keeping the logo/header layout.
- Forced A4 landscape print layout and single-page PDF export.

## Validation

LibreOffice macro build validation:

- Old file size: `39,424`
- New file size: `151,040`
- Rows: old `37`, new `43`
- Columns: old `12`, new `12`
- Merged regions: old `20`, new `26`
- Required MoySklad/JXLS placeholders preserved: `9/9`
- Verdict: `OK — SOA placeholders preserved`

No-stamp variant validation:

- Old file size: `39,424`
- New file size: `120,832`
- Rows: old `37`, new `43`
- Columns: old `12`, new `12`
- Merged regions: old `20`, new `26`
- Required MoySklad/JXLS placeholders preserved: `9/9`
- Verdict: `OK — SOA placeholders preserved`

## Builder

Temporary builder used during the session:

- `/tmp/genosys-soa-builder/Module1.xba`
- `/tmp/genosys-soa-builder/build.sh`

