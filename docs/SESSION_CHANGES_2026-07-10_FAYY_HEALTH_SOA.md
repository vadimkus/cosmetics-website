# Fayy Health FZCO — Statement of Account export

**Date:** 2026-07-10 (updated — Genosys_SOA template + orders folder)  
**Customer:** Fayy Health FZCO (`ee20d7e3-d46d-11ed-0a80-0df400228557`)

## Output (`~/Desktop/orders/`)

| File | Description |
|------|-------------|
| `GENOSYS_Fayy_Health_SOA.pdf` | Statement of account — **Genosys_SOA_CLEAN_NO_STAMP** (MoySklad XLS template) |
| `GENOSYS_Fayy_Health_SOA.xlsx` | Filled workbook (audit copy) |
| `GENOSYS_Fayy_Health_04511.pdf` | Open invoice — Peptide ×100 @ 3,800 AED |
| `GENOSYS_Fayy_Health_04795.pdf` | Open invoice — Peptide ×50 @ 1,900 AED |

## Outstanding debt

**Total due: 5,700.00 AED**

| Invoice | Date | Balance |
|---------|------|---------|
| 04511 | 14/05/2026 | 3,800.00 |
| 04795 | 09/07/2026 | 1,900.00 |

## Templates

- **SOA:** `Genosys_SOA_CLEAN_NO_STAMP.xls` from `~/Desktop/Drive/Genosys/Print_forms/2026/invoice_ART/SOA/` — filled via `scripts/fill-genosys-soa-clean-xls.py` (same layout as MoySklad print menu)
- **Invoices:** MoySklad **Genosys_Invoice_Legal_TAX** (`5e56cd7d-ce85-4db5-8771-d7531f9ffd71`)

## Scripts

```bash
node --import dotenv/config scripts/moysklad-export-fayy-health-soa.js
# fills template: scripts/fill-genosys-soa-clean-xls.py
```
