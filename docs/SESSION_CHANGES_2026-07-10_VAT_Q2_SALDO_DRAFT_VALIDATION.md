# VAT Q2 2026 — Saldo draft validation

**Date:** 2026-07-10  
**Accountant:** Shruti Gulati, Saldo Accounting  
**Net VAT payable (draft):** **21,585.78 AED**

## Result

Cross-checked Saldo draft vs MoySklad API + 7 customs declarations (10-Jul-2026).

| Line | Saldo | MoySklad / declarations | Match |
|------|-------|-------------------------|-------|
| Output taxable (sales) | 441,685.63 | 441,685.63 | ✅ |
| Output VAT (sales) | 22,084.28 | 22,084.30 | ✅ (0.02 rounding) |
| Imports taxable | 290,480.49 | 290,480.50 | ✅ |
| Import VAT | 14,524.02 | 14,524.02 (5% × line) | ✅ |
| Net payable | 21,585.78 | A−B verified | ✅ |
| Expenses taxable | 9,970.11 | ~4,536 min (Slider+MoySklad) | ⚠️ ask schedule |

## Notes

- Import VAT on FTA return = 5% of import **line** value (same as Q1 filed return), not customs base × 0.05 alone.
- ~285 AED lower net vs our internal draft explained by Saldo claiming **498.51** input VAT on expenses vs our **~214.50** Slider-only estimate.
- Red-highlighted invoices: need Saldo attachment — likely VAT rounding on MoySklad PDF template (Q1 same issue).

## Files

- Validation notes: `Company_Legal/Tax/VAT/2026/Q2/VAT_Q2_2026_VALIDATION_NOTES.md`
- Script: `scripts/vat-q2-2026-validation.js`
