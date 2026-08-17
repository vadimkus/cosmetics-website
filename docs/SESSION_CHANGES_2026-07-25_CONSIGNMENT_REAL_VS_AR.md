# Consignment: unpaid shipments ≠ stock on shelves (2026-07-25)

## Mistake

Summing unpaid commission **demands** (~2.12M) is **accounts-receivable noise**, not physical consignment stock.

Placement shipments often stay `payedSum=0` forever; sold goods are settled via **commission reports** + paymentin on those reports, which does **not** clear the original demand “Не оплачено”.

## Correct book balance (per agent / contract)

```
Qty at agent = Σ demands (commission contract)
             − Σ commissionreportin
             − Σ salesreturn
```

Value = residual qty × clinic/list price on lines.

## Shakirovna Ladies Beauty Saloon (Marina) check

| Metric | AED |
|---|---:|
| Unpaid demands (what UI AR showed) | **186,874** |
| **Book residual stock (real)** | **~24,201** |

Matches salon-side ~24k check. Residual qty ~232 pcs across SKUs.

Script pattern: `docs/CONSIGNMENT_STOCK_RECONCILIATION.md`, ledger like `scripts/moysklad-arfi-consignment-analysis.js`.
