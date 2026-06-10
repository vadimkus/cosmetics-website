# Genosys MoySklad Working Invoice Template

Date: 2026-05-10

## Output

Created a new MoySklad-ready Excel 97-2004 invoice template on Desktop:

- `/Users/vadimkus/Desktop/Genosys_Invoice_Legal_TAX_MOYSKLAD_WORKING.xls`
- Preview PDF: `/Users/vadimkus/Desktop/Genosys_Invoice_Legal_TAX_MOYSKLAD_WORKING.pdf`
- Preview PNG: `/Users/vadimkus/Desktop/Genosys_Invoice_Legal_TAX_MOYSKLAD_WORKING_preview.png`

Second pass after visual review and user approval to touch placeholders:

- `/Users/vadimkus/Desktop/Genosys_Invoice_Legal_TAX_REDESIGNED.xls`
- Preview PDF: `/Users/vadimkus/Desktop/Genosys_Invoice_Legal_TAX_REDESIGNED.pdf`
- Preview PNG: `/Users/vadimkus/Desktop/Genosys_Invoice_Legal_TAX_REDESIGNED_preview.png`

Third pass after screenshot review:

- `/Users/vadimkus/Desktop/Genosys_Invoice_Legal_TAX_CLEAN.xls`
- Preview PDF: `/Users/vadimkus/Desktop/Genosys_Invoice_Legal_TAX_CLEAN.pdf`
- Preview PNG: `/Users/vadimkus/Desktop/Genosys_Invoice_Legal_TAX_CLEAN_preview.png`

## Source

Used the known-good original:

- `/Users/vadimkus/Desktop/Genosys_Invoice_Legal_TAX_backup_original.xls`

## Changes

- Added a top GENOSYS legal header with real Excel text, not a header image.
- Embedded the provided GENOSYS professional logo image.
- Used the supplied company, address, contact, TRN, bank, IBAN, and account-number details.
- Updated visible line-item labels to a clearer UAE VAT sequence:
  - `No`
  - `Description`
  - `Qty`
  - `Unit Price incl. VAT`
  - `UOM`
  - `Discount %`
  - `Subtotal excl. VAT`
- Preserved all MoySklad/JXLS placeholders and formulas.
- Hid helper columns outside the print area so preview/export is page-width and does not expose internal tokens.

Second pass changes:

- Removed the long invoice title placeholder from the hero line; title is now simply `TAX INVOICE`.
- Moved invoice number to a compact right-side meta block.
- Made VAT amount column visible and changed the line table sequence to:
  - `No`
  - `Description`
  - `Qty`
  - `Unit Price incl. VAT`
  - `Discount %`
  - `Subtotal excl. VAT`
  - `VAT 5%`
  - `Total incl. VAT`
- Updated subtotal total formula from `$[SUM(L30)@0]` to `$[SUM(K30)@0]` to match the redesigned column order.
- Cleared the leaked header helper cell and visually hid the JXLS loop control rows.

## Validation

LibreOffice macro build validation:

- Rows preserved: `43`
- Columns preserved: `18`
- Merged regions preserved: `46`
- MoySklad/JXLS tokens preserved: `8/8`
- Output verdict: safe to upload to MoySklad as a custom print template.

Manual validation for redesigned file:

- Rows preserved: `43`
- Columns preserved: `18`
- Merged regions preserved: `46`
- Required dynamic tokens preserved: `8/8`
- Corrected subtotal formula present: `$[SUM(K30)@0]`

Third pass validation:

- Rows preserved: `43`
- Columns preserved: `18`
- Merged regions changed from `46` to `58` intentionally, to create clean text spans for the legal header, invoice metadata, and buyer placeholder cells.
- Removed the visible `formatter.adjustRowHeight` helper from the print area; manual critical-token check is `7/7`.
- Critical dynamic tokens preserved: `${o.name}`, `<jx:forEach`, `</jx:forEach>`, `${position.printName}`, `$[SUM(K30)`, `formatter.calcVat`, `formatter.allAmount`.
- This pass removes old embedded artwork and inserts only the supplied logo image.

Fourth polish after visual markup:

- Removed the crossed-out supplier labels on the left.
- Removed the `SUPPLIER` section label as well, since it sat in the marked label column.
- Shifted supplier details left into a clean text block under the title:
  - `Genosys Middle East FZ-LLC`
  - `TRN: 104229886700003 | Trade License: I14330AT`
  - `sales@genosys.ae | +971 58 548 76 65`
  - `Compass Coworking Centre, Genosys ME, Ras Al Khaimah, UAE`
  - `WIO Bank P.J.S.C. | IBAN: AE110860000009833011607`
- Regenerated the files inside `/Users/vadimkus/Desktop/invoice_ART/`.

Fifth polish after visual markup:

- Removed the crossed-out top-center legal/header text entirely.
- Kept the top area logo-only plus the red divider line.
- Removed the `Currency` / `AED` metadata from the right-side invoice block.
- Regenerated:
  - `/Users/vadimkus/Desktop/invoice_ART/Genosys_Invoice_Legal_TAX_CLEAN.xls`
  - `/Users/vadimkus/Desktop/invoice_ART/Genosys_Invoice_Legal_TAX_CLEAN.pdf`
  - `/Users/vadimkus/Desktop/invoice_ART/Genosys_Invoice_Legal_TAX_CLEAN_preview.png`

Sixth polish:

- Added `/Users/vadimkus/Desktop/invoice_ART/genosys-uae-app-qr.png` as a small app QR in the top header area.
- Added a subtle caption: `Scan to shop in the GENOSYS UAE app`.
- Kept QR away from totals/payment/VAT zones so it does not look like a payment or compliance QR.
- Regenerated the clean `.xls`, `.pdf`, and preview PNG in `invoice_ART`.

Seventh polish:

- Moved invoice metadata into the title line:
  - `TAX INVOICE No ${o.name}`
  - followed by `Dated ${formatter.format(...)}`
- Removed the separate right-side invoice metadata block.
- Regenerated the clean `.xls`, `.pdf`, and preview PNG in `invoice_ART`.

Eighth polish:

- Swapped the header/body roles based on visual markup:
  - Legal/supplier company information now lives in the header next to the logo and before the app QR.
  - `BILL TO` moved to the left side under the invoice title.
- Fixed old merged cells so the header legal text and bill-to placeholder values are visible in the preview.
- Regenerated the clean `.xls`, `.pdf`, and preview PNG in `invoice_ART`.

Ninth polish:

- Removed underline styling from the header/legal text.
- Removed red styling from the header bank line and divider; header now uses neutral ink/gray.
- Changed QR caption to `Download Genosys UAE App`.
- Tuned totals typography: smaller subtotal/VAT rows and stronger but cleaner `TOTAL (AED)` row.
- Regenerated the clean `.xls`, `.pdf`, and preview PNG in `invoice_ART`.

Tenth polish:

- Moved the header legal/company text further to the right.
- Moved the QR block further right.
- Repositioned the QR caption so `Download Genosys UAE App` sits under the QR code instead of floating to the side.
- Regenerated the clean `.xls`, `.pdf`, and preview PNG in `invoice_ART`.

Eleventh polish:

- Fixed the `BILL TO` phone row alignment so `Phone` and `${o.targetAgentRequisite.agent.contact.phones}` sit on the same row.
- Removed the extra blank-looking row under the phone field.
- Regenerated the clean `.xls`, `.pdf`, and preview PNG in `invoice_ART`.

Twelfth polish:

- Fixed the hidden original multi-row merge that caused `Phone` to render lower than the phone placeholder.
- Moved the QR image further right so it is visually aligned above `Download Genosys UAE App`.
- Regenerated the clean `.xls`, `.pdf`, and preview PNG in `invoice_ART`.

Thirteenth polish:

- Restored the buyer field order from `Genosys_Invoice_Legal_TAX_backup_original.xls`:
  - `Name`
  - `Phone`
  - `Address`
  - `TRN #`
  - `License #`
- Added the license placeholder `${o.targetAgentRequisite.agent.contact.faxes}`.
- Regenerated the clean `.xls`, `.pdf`, and preview PNG in `invoice_ART`.

Fourteenth polish:

- Tightened buyer value placement so buyer values sit closer to labels.
- Removed the redundant `Total to pay in AED` boxed row under the totals/notes area.
- Simplified totals styling by removing the awkward empty bordered area around subtotal/VAT rows.
- Regenerated the clean `.xls`, `.pdf`, and preview PNG in `invoice_ART`.

Fifteenth polish:

- Forced the print/export layout to A4 landscape so printed output is materially larger.
- Tightened print margins and print area.
- Restored both `Company Seal` and `Authorized Signatory` within the landscape print area.
- Renamed table header `Unit Price incl. VAT` to `Unit Price` to avoid repeating `incl. VAT` alongside `Total incl. VAT`.
- Regenerated the clean `.xls`, `.pdf`, and preview PNG in `invoice_ART`.

Sixteenth polish:

- Removed the GENOSYS app QR from the top header area.
- Repositioned the QR into the lower signature block, next to the `Authorized Signatory` area, so the header stays focused on logo and supplier legal information.
- Kept `Company Seal` and `Authorized Signatory` labels visible in the A4 landscape preview.
- Regenerated the clean `.xls`, `.pdf`, and preview PNG in `invoice_ART`.

Seventeenth polish:

- Removed the GENOSYS app QR completely from the invoice template.
- Moved supplier/legal header text to the far-right side of the header and right-aligned it.
- Kept the logo on the left and preserved the A4 landscape print/export layout.
- Regenerated the clean `.xls`, `.pdf`, and preview PNG in `invoice_ART`.

Eighteenth polish:

- Moved the `TAX INVOICE No ... Dated ...` title line one row lower.
- Centered the combined invoice title/date line across the full invoice width.
- Regenerated the clean `.xls`, `.pdf`, and preview PNG in `invoice_ART`.

Nineteenth polish:

- Increased the centered `TAX INVOICE No ... Dated ...` title font size.
- Removed the large empty gap in the buyer block by moving buyer values from column C to column B.
- Regenerated the clean `.xls`, `.pdf`, and preview PNG in `invoice_ART`.

Twentieth polish:

- Applied a two-decimal money number format to invoice money columns and totals so whole amounts render in accounting style instead of dropping decimals.
- Changed subtotal aggregate formatting from `$[SUM(K30)@0]` to `$[SUM(K30)@0.00]` so MoySklad keeps two decimal places.
- Regenerated the clean `.xls`, `.pdf`, and preview PNG in `invoice_ART`.

Twenty-first polish:

- Moved totals labels closer to the total amount column by merging/right-aligning the label area immediately before the amounts.
- Changed the table header/accent highlight from black to medium gray.
- Regenerated the clean `.xls`, `.pdf`, and preview PNG in `invoice_ART`.

Twenty-second polish:

- Redistributed table column widths so `Discount %`, `Subtotal excl. VAT`, `VAT 5%`, and `Total incl. VAT` have enough header space.
- Kept table headers centered while right-aligning numeric row values, especially the final `Total incl. VAT` amount column.
- Regenerated the clean `.xls`, `.pdf`, and preview PNG in `invoice_ART`.

Twenty-third polish:

- Widened the buyer label column so `Address` no longer runs into the customer address value.
- Slightly increased buyer block and table text size for better print readability while keeping the invoice on one A4 landscape page.
- Regenerated the clean `.xls`, `.pdf`, and preview PNG in `invoice_ART`.

Twenty-fourth polish:

- Added `Delivered with Love` below the GENOSYS logo in the header.
- Styled the tagline in muted italic text.
- Regenerated the clean `.xls`, `.pdf`, and preview PNG in `invoice_ART`.

Twenty-fifth polish:

- Added colons to the buyer block labels: `BUYER:`, `Name:`, `Phone:`, `Address:`, `TRN #:`, and `License #:`.
- Changed the total label from `TOTAL (AED):` to `TOTAL AED:`.
- Regenerated the clean `.xls`, `.pdf`, and preview PNG in `invoice_ART`.

Twenty-sixth polish:

- Widened the buyer label column so the colon in `License #:` is visible instead of clipped by the adjacent value cell.
- Regenerated the clean `.xls`, `.pdf`, and preview PNG in `invoice_ART`.

Twenty-seventh polish:

- Re-centered `Delivered with Love` under the GENOSYS logo by narrowing the merged tagline cell to the logo footprint.
- Regenerated the clean `.xls`, `.pdf`, and preview PNG in `invoice_ART`.

Twenty-eighth polish:

- Increased small/readability-critical fonts across the header legal text, buyer block, table header/body row, totals, notes, and signature labels.
- Slightly increased the data row height to support the larger table text while keeping the invoice on one A4 landscape page.
- Regenerated the clean `.xls`, `.pdf`, and preview PNG in `invoice_ART`.

Retail template copy:

- Created separate retail-customer template outputs:
  - `/Users/vadimkus/Desktop/invoice_ART/Genosys_Invoice_Legal_TAX_RETAIL.xls`
  - `/Users/vadimkus/Desktop/invoice_ART/Genosys_Invoice_Legal_TAX_RETAIL.pdf`
  - `/Users/vadimkus/Desktop/invoice_ART/Genosys_Invoice_Legal_TAX_RETAIL_preview.png`
- Removed buyer `TRN #` and `License #` rows for retail customers.
- Added the GENOSYS UAE app QR image and the digital signature stamp image to the right side of the signature/footer area.
- Kept the original clean/pro template separate.

Retail footer/header polish:

- Moved the retail app QR and digital signature stamp lower in the footer/signature area while keeping them fully visible inside the print area.
- Removed the temporary `www.genosys.ae` line under the logo tagline; retail header keeps only `Delivered with Love`.
- Extended the retail template print area from row 42 to row 46, reduced the bottom margin, and fit output to one A4 landscape page so footer images do not clip.
- Replaced the full app QR artwork with a cropped QR-only image (`genosys-uae-app-qr-only.png`) so the embedded small caption text is removed.
- Added `Download Genosys UAE App` as the only worksheet-cell caption directly under the retail app QR so it renders reliably in PDF/export.
- Reverted the retail app QR/caption experiment and removed the app QR plus caption completely; the digital signature stamp remains in the footer.
- Regenerated the retail `.xls`, `.pdf`, and preview PNG.

