# Yula Beauty — consignment sales — 2026-09-02

**Customer:** Yula Beauty Salon LLC `bfe39f3a-6c0f-11ef-0a80-10ba0004368c`  
**Agreement:** **12** `f7304b4a-6cfa-11ef-0a80-0c23001f2f8c`  
**Period:** 2026-07-17 (day after last report **01407**) → 2026-09-02  
**Source:** Vadim sold list. Clinic list.

| | |
|---|---|
| Report | **01456** `be94ba2a-a6fd-11f1-0a80-06d70000d78b` / **335 AED** / 2 pcs |
| Matching demand | **06795** `bef36b9d-a6fd-11f1-0a80-18280000e80e` / **525 AED** / 3 pcs |
| Payment in | **06179** `f30519f0-a703-11f1-0a80-1fcb00028b29` / **335 AED** |
| Pay status | **Paid** |
| Sales PDF | `~/Desktop/orders/GENOSYS_Yula_Beauty_Consignment_Sales_01456.pdf` |
| Stock note | `~/Desktop/orders/GENOSYS_Yula_Beauty_Consignment_Stock_Note_06795.pdf` |

**Report 01456 (sold):**

| Code | Product | Qty | Unit | Line |
|---|---|---:|---:|---:|
| 00051 | HR³ Matrix Hair Tonic 70ml | 1 | 145 | 145 |
| 00053 | EyeCell Eye Peptide Gel Patch (box) | 1 | 190 | 190 |
| | | **2** | | **335** |

**Demand 06795 (replenish):** tonic ×1 + patches ×2.

| Code | Product | Qty | Unit | Line |
|---|---|---:|---:|---:|
| 00051 | HR³ Matrix Hair Tonic 70ml | 1 | 145 | 145 |
| 00053 | EyeCell Eye Peptide Gel Patch (box) | 2 | 190 | 380 |
| | | **3** | | **525** |

Demand on agr. **12**. Shipped. Paymentin on the report (335), not the demand (525). Not printed.

Scripts:
- `scripts/moysklad-create-yula-beauty-consignment-sales-20260902.js --commit`
- `scripts/moysklad-amend-yula-beauty-demand-06795-patches-x2-20260902.js --commit` (patches 1 → 2 on demand only)
- `scripts/moysklad-create-yula-beauty-paymentin-01456-20260902.js --commit`
