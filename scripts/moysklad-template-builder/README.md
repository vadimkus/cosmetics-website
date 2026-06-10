# MoySklad invoice template builder (Awwwards-style)

Restyle `Genosys_Invoice_Legal_TAX.xls` (`invoiceout` print template on
MoySklad) without breaking the strict JXLS / Jasper validator.

## Why this exists

Earlier attempts using Python `xlwt` / `xlutils.copy` produced files that
MoySklad rejected with **«Некорректный шаблон печатной формы»**. The
round-trip stripped:

- merged cells (46 → 0)
- number formats (45 → 1)
- `formatter.adjustRowHeight` row hooks
- the cellxf table

LibreOffice preserves all of that on `.xls` round-trip, so MoySklad accepts
the result.

## Requirements

```bash
brew install --cask libreoffice
```

LibreOffice 26+ verified working.

## Layout

```
moysklad-template-builder/
├── README.md         (this file)
├── build.sh          (orchestrator)
├── Module1.xba       (Basic macro: the actual restyle)
├── script.xlc        (LO library registry)
├── dialog.xlc
├── script.xlb        (Standard library descriptor)
└── dialog.xlb
```

## Usage

```bash
# 1. Make sure the source baseline is on the desktop:
#    ~/Desktop/Genosys_Invoice_Legal_TAX_backup_original.xls
# 2. Run:
./build.sh
```

Output: `~/Desktop/Genosys_Invoice_Legal_TAX_AWWARDS.xls` (Excel 97-2004),
ready to upload to MoySklad as the print template for "Счёт покупателю".

The script validates the output with `xlrd` before declaring success — it
fails loudly if any structural property regresses vs the baseline.

## Design language

Inspired by Awwwards Honorable Mention "Invoice Builder by Tola"
(<https://www.awwwards.com/sites/invoice-builder-by-tola>) and CSS Design
Awards reference invoices. Distilled into a print spec:

| Token       | Value             | Purpose                       |
|-------------|-------------------|-------------------------------|
| Font body   | Helvetica Neue    | macOS-system stack            |
| Ink         | `#1D1D1F` rgb(29,29,31)   | Headings + values     |
| Muted       | `#6E6E73` rgb(110,110,115) | Field labels + notes  |
| Rule        | `#D2D2D7` rgb(210,210,215) | Hairline rules        |
| Header bar  | `#000000`         | Black row 28 table head       |
| Title size  | 22 pt bold        | "TAX INVOICE No …"            |
| Section h.  | 13 pt bold        | "Supplier:" / "Buyer:"        |
| Body        | 11 pt regular     | Values                        |
| Labels      | 9 pt regular muted | "Phone:" / "TRN:" etc.        |
| TOTAL row   | 14 pt bold        | "TOTAL (AED):"                |

## Iterating

Edit `Module1.xba`, re-run `./build.sh`. To preview without uploading:

```bash
soffice --headless --convert-to pdf \
        ~/Desktop/Genosys_Invoice_Legal_TAX_AWWARDS.xls \
        --outdir ~/Desktop/
open ~/Desktop/Genosys_Invoice_Legal_TAX_AWWARDS.pdf
```

Note: the static PDF preview shows the unresolved `${o.name}`, `<jx:forEach>`
template tokens — that is expected. MoySklad evaluates them at print time.

## Hard constraints (don't break these)

The macro must NOT touch:

1. Cell text content (`${...}`, `<jx:forEach>`, `</jx:forEach>`, `$[SUM(...)]`)
2. Cell formulas
3. Merged regions (46 of them)
4. Sheet name (`Sheet1`)
5. The hidden state of column M (VAT amount, hidden when payerVat=true)

Only visual properties are safe to change: `CharFontName`, `CharHeight`,
`CharWeight`, `CharColor`, `CellBackColor`, `HoriJustify`, `VertJustify`,
`Rows[i].Height`, `Columns[i].Width`, border lines, page setup.
