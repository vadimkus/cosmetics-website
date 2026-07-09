# VAT Q2 2026 — folder preparation

**Date:** 2026-07-05  
**Folder:** `/Users/vadimkus/Desktop/Drive/Genosys/Company_Legal/Tax/VAT/2026/Q2/`  
**Reference:** Q1 folder ingested as template  

## Q1 structure learned

| Item | Q1 contents |
|------|-------------|
| Bank statements | 3× WIO CSV (Jan–Mar) |
| Standard invoices | Monthly PDF folders from MoySklad `Genosys_Invoice_Legal_TAX` |
| Consignment | `Consignment_invoices_All_Q1/` PDF + Excel; zip optional |
| Customs | 4× declaration PDFs in `Declarations/` |
| Notes | `VAT_Q1_2026_VALIDATION_NOTES.md` with confirmed FTA figures |

## Q2 work done

### Folders created

- `Declarations/` — populated
- `Invoices_April_2026/`, `Invoices_May_2026/`, `Invoices_June_2026/` — **413 PDFs exported**
- `Consignment_invoices_All_Q2/` — Excel + summary PDF + 80 individual PDFs
- `Bank_StatementsQ2_2026/` — already had Apr/May/Jun CSV

### Customs declarations copied (from DTSMG Orders/2026)

| Declaration | Date | Shipment | Source |
|-------------|------|----------|--------|
| 1010063271226 | 07-Apr-2026 | DM GME 260323 | 07042026 |
| 1010069751926 | 20-Apr-2026 | DM GME 260408 | 16042026 |
| 1010083853126 | 14-May-2026 | DM GME 260430 | 07052026/BOE.pdf |
| 1010087991326 | 21-May-2026 | DM GME 260513 | 14052026/BOE.pdf |
| 1010103399626 | 16-Jun-2026 | DM GME 260605 | 09062026 |

Import totals (base × 1.05 / × 0.05): **219,615.52 AED** taxable, **10,457.88 AED** VAT.

### MoySklad draft (05-Jul-2026)

- Standard 04xxx: 413 invoices, 04327→04741, 340,551.41 AED incl VAT
- Consignment 01308→01387: 80 reports, 123,218.50 AED incl VAT
- Slider input VAT Q2: ~214.50 AED (Apr–Jun partial)
- Saldo Q2 prep fee paid 01-Jul-2026 → likely Q3 expense

### Files added

- `Q2/VAT_Q2_2026_PREP_NOTES.md` — draft figures + checklist
- `scripts/vat-q2-2026-validation.js` — MoySklad cross-check script
- `scripts/vat-q2-2026-export-pack.js` — bulk PDF + consignment export

## Export completed (05-Jul-2026)

Script: `scripts/vat-q2-2026-export-pack.js`

| Output | Count / size |
|--------|----------------|
| Standard invoice PDFs (Apr/May/Jun) | **413** (117 + 149 + 147) |
| Consignment commission PDFs | **80** (01308–01387) |
| `Consignment_sales_report.xlsx` | ✅ |
| `Consignment_Inv_All.pdf` | ✅ (LibreOffice from Excel) |
| `Invoice_Consignment_Sales_ALL.zip` | ✅ |
| `Standard_sales_report.xlsx` | ✅ 413 rows / 340,551.41 AED |

## Still TODO

1. Full Slider June tax invoice (current payment covers 1–14 Jun only)
2. Send package to Anamta; update prep notes → `VAT_Q2_2026_VALIDATION_NOTES.md` when confirmed
3. FTA payment before **28-Jul-2026**
