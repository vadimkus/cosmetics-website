# Genosys Invoice Legal TAX — “award-grade” layout (MoySklad-safe path)

Date: 2026-05-09

## Why we are not auto-patching the `.xls`

MoySklad validates **JXLS / Jasper** Excel templates strictly. Files re-saved with **xlwt** / **xlutils.copy** (even without merged cells) often trigger:

`Некорректный шаблон печатной формы`

**Working baseline:** `Genosys_Invoice_Legal_TAX_backup_original.xls` on Desktop — re-upload this to MoySklad to restore printing, then apply styling **inside Microsoft Excel** and **Save as Excel 97–2004 Workbook (.xls)**.

## Design references (“best case” online)

| Source | Why it matters | Link |
|--------|----------------|------|
| **Invoice Builder by Tola** | **Awwwards Honorable Mention** (Jan 2024). Minimal chrome, typography-led, confident whitespace, demo-first product. | [awwwards.com — Invoice Builder by Tola](https://www.awwwards.com/sites/invoice-builder-by-tola) |
| **Tola Invoices (One Page Love)** | Single-page product storytelling; **Monument Grotesk** + restraint; good model for “premium SaaS invoice” mood. | [onepagelove.com — Tola Invoices](https://onepagelove.com/tola-invoices) |
| **Speedy** | **CSS Design Awards**; strong typographic UI for invoicing/payments. | [cssdesignawards.com — Speedy](https://www.cssdesignawards.com/sites/speedy/40253/) |
| **Behance — minimal invoice UI** | Broad modern invoice layout patterns (grid, hierarchy). Search “Minimal Modern Invoice” on Behance for boards. | [behance.net search](https://www.behance.net/search/projects/minimal%20invoice%20template) |

We do **not** copy their HTML/assets (licensing). We **translate** the pattern: calm type, clear hierarchy, one strong accent (header bar), no clutter.

## Visual system (translate to Excel)

Open `reference/invoice-legal-tax-visual-target.html` in a browser for a **static mock** of the target (print to PDF if you want a side-by-side while editing Excel).

| Element | Spec |
|---------|------|
| **Body font** | **Helvetica Neue** or **Arial**, **10 pt** regular; labels **9–10 pt** |
| **Primary text** | Near-black `#1D1D1F` (Apple-style) |
| **Secondary** | Gray `#6E6E73` for labels (Supplier, Buyer, column hints) |
| **Sheet** | White background; turn **off gridlines** (View → Gridlines off) for print |
| **Invoice title** (your row **19**) | **14–16 pt semibold**, tight letter-spacing; optional **1 pt** bottom border spanning columns A–L |
| **Section labels** (“Supplier:”, “Buyer:”) | **9 pt bold**, color `#6E6E73`, ALL CAPS optional (Tola-like) |
| **Table header** (row **28**) | Fill `#1D1D1F`, **white** text, **10 pt bold**; row height ~**22–26 pt**; **center** numeric columns |
| **Line template** (row **30**) | **10 pt**; wrap text; light bottom border `#D2D2D7` |
| **Totals** (rows **32–34**) | Labels right-aligned **medium** gray; **TOTAL (AED)** **13–15 pt bold** black |
| **Whitespace** | Increase row heights slightly on rows **19–24** (buyer block) so it breathes like Tola / Apple |

### Column widths (starting point)

Adjust to fit your strings without clipping:

| Col | Purpose | Suggested width (chars) |
|-----|---------|-------------------------|
| A | No. | 5–6 |
| B | Description | 42–48 |
| H | Qty | 10–11 |
| I | Unit price | 14–16 |
| J | UOM | 10–12 |
| K | Disc % | 10–11 |
| L | Amount ex-VAT | 15–18 |

## Row map (your current `Genosys_Invoice_Legal_TAX` template)

Do **not** move or delete cells that contain **`${…}`** or **`<jx:forEach>`** or **`$[SUM(…)]`**.

| Rows | Block |
|------|--------|
| 0–4 | Keep empty (MoySklad-safe) OR later add **one** subtle logo in A1 only after MoySklad accepts a test upload |
| 5–17 | Supplier + banking — apply label/value styles above |
| 19 | Tax invoice title — hero typography |
| 21–26 | Buyer — section label style |
| 28 | Table header — dark fill |
| 29–31 | JX loop — **do not edit** placeholder syntax |
| 30 | Line row — borders + wrap |
| 32–34 | Subtotal / VAT / Total |
| 37+ | Notes / signatory |

## Implementation checklist (Excel, not Python)

1. Copy `Genosys_Invoice_Legal_TAX_backup_original.xls` → work file `Genosys_Invoice_Legal_TAX_v2.xls`.
2. Open in **Excel for Mac** (prefer over Numbers for `.xls`).
3. Apply **Format → Format Cells** per section above; use **Themes** off (custom colors).
4. **Page Layout → Print Area** if you use one; margins moderate; **Scale to fit** off unless needed.
5. **Save As → Excel 97–2004 Workbook (.xls)**.
6. Upload to MoySklad as a **new** print template; print one **Счет покупателю** smoke test.
7. If upload fails: undo last visual change, re-save, retry (binary format is fragile).

## Repo artifacts

| File | Purpose |
|------|---------|
| `docs/reference/invoice-legal-tax-visual-target.html` | Visual target (browser / print) |
| `scripts/stylize-moysklad-invoice-legal-tax-xls.py` | **Experimental only** — do **not** rely on uploads to MoySklad |

## Optional: API PDF without custom upload

You already have a working cloud template **Genosys_Invoice_Legal_TAX** (UUID in MoySklad metadata). Use API export with that template for PDFs while the Desktop `.xls` is refined in Excel.

---

**Bottom line:** The “award” look is **typography + restraint + dark table header**. The safe implementation path is **Excel manual styling** on `backup_original.xls`, not Python `.xls` writers.
