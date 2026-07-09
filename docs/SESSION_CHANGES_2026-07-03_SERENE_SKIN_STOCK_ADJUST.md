# Serene Skin — stock adjust to physical count (2026-07-03)

**Customer:** Serene Skin Beauty Salon LLC · contract **00060**  
**Script:** `scripts/moysklad-fix-serene-skin-stock-adjust-20260703.js --commit`

Salon re-count confirmed physical stock; books were wrong after erroneous bulk report and morning recon.

## Physical count (salon)

| Product | Code | Qty |
|---------|------|----:|
| Snow O₂ Cleanser 180ml | `00021` | 3 |
| Intensive Problem Control Cream | `00035` | 2 |
| Intensive Blemish Balm Cream | `00040` | 1 |
| Multi Sun Cream SPF40 | `00041` | 1 |
| BB Cushion #2 Beige | `00144` | 2 |
| Moisture Replenishing Hyaluron Serum | `00195` | 0 |
| Ultra Shield SPF50 | `54457` | 1 |

## Root cause

1. **Erroneous report 01399** (8628 AED, 29 lines) posted 2026-07-03 — zeroed consignment balances.
2. **Morning return 00302 + loss 00008-00458** assumed items missing; salon still had cleanser, PCC, cushion, etc.

## Fix posted

| Action | Doc | Detail |
|--------|-----|--------|
| Delete | Old report **01399** | Erroneous bulk sale |
| Delete | Return **00302** | Wrong morning recon |
| Delete | Loss **00008-00458** | Matching wrong recon |
| Report | **01399** (new) | Sold: `00021`×1, `00035`×1, `00040`×1 — **435 AED** |
| Return | **00302** (new) | Lost hyaluron `00195`×1 |
| Loss | **00008-00458** (new) | Buy **40 AED** — not billed |

- [Report 01399](https://online.moysklad.ru/app/#commissionreport/edit?id=2aaa5ca5-76d4-11f1-0a80-078100199873)
- Demand **06466** (SPF40 +1 from earlier recon) — **kept**

**Marker:** `SERENE-SKIN-STOCK-ADJUST-2026-07-03`

## Verified book balance = physical

| Code | Book | Target |
|------|-----:|-------:|
| `00021` | 3 | 3 |
| `00035` | 2 | 2 |
| `00040` | 1 | 1 |
| `00041` | 1 | 1 |
| `00144` | 2 | 2 |
| `00195` | 0 | 0 |
| `54457` | 1 | 1 |

## PDF — why the native MoySklad report kept showing wrong numbers

The MoySklad native template `Invoice_Consignment_Report_Genosys` **over-counts** because it
re-adds the two settlement-mirror shipments (**06271** May, **06436** June) as stock-in and lists
already-settled SKUs. That is why the printed native report showed cleanser 4, PCC 3, blemish 2,
SPF40 3, cushion 3, hyaluron 1, SPF50 2 → **9,853 AED / 31 lines** while the true ledger is lower.
The contract-level export API also returns an **empty** template (dated 12.04.2023), so it can't be
used to hand the salon a correct sheet.

**Fix:** generate the report directly from the true consignment ledger:

```
On-hand = Σ demands (contract 00060, EXCLUDING settlement mirrors 06271/06436)
        − Σ commission reports − Σ sales returns
```

**Script:** `scripts/moysklad-export-serene-consignment-report-correct-20260703.js`
(cross-checks all 7 disputed SKUs against physical, aborts if any mismatch, then renders PDF).

**Output:** `~/Desktop/orders/GENOSYS_Serene_Skin_Consignment_Report_00060.pdf`
→ **25 SKUs · 55 pcs · 6,747.00 AED**, disputed lines now 3 / 2 / 1 / 1 / 2 / 0 / 1.

| Product | Native (wrong) | Corrected |
|---------|---------------:|----------:|
| Cleanser 180ml | 4 | **3** |
| Problem Control Cream | 3 | **2** |
| Blemish Balm Cream | 2 | **1** |
| SPF40 | 3 | **1** |
| Cushion #2 Beige | 3 | **2** |
| Hyaluron Serum | 1 | **0 (removed)** |
| SPF50 | 2 | **1** |
| **Total** | 9,853 | **6,747** |

Prior: [SESSION_CHANGES_2026-07-03_SERENE_SKIN_STOCK_RECON.md](./SESSION_CHANGES_2026-07-03_SERENE_SKIN_STOCK_RECON.md)

---

## FINAL correction (2026-07-03 PM) — full physical count from salon

**Mistake in the step above:** we excluded shipments **06271** (Jun 2) and **06436** (Jun 30)
as "settlement mirrors". They are **REAL shipments** — sea algae masks `00140` ×10, Revita BB
creams `54472`/`54473` ×3 each, makeup remover `54461`, microbiome mist `00188`. The corrected
PDF wrongly dropped them, and Miss Fatima flagged it ("в отчёте их меньше — добавьте").

**Fix:** use the **full ledger, no exclusions** (`scripts/moysklad-fix-serene-skin-final-recon-20260703.js`).
The full ledger matched physical on everything except 3 SKUs:

| Item | Code | Book | Physical | Action |
|------|------|-----:|---------:|--------|
| SPF40 | `00041` | 3 | 1 | delete phantom demand **06466** (+1) + report 1 sold |
| BB Cushion #2 Beige | `00144` | 3 | 2 | report 1 sold |
| SPF50 | `54457` | 2 | 1 | report 1 sold |

**Posted:**
- Deleted demand **06466** (phantom SPF40 surplus artifact from morning recon)
- Commission report **01400** — SPF40 ×1, cushion ×1, SPF50 ×1 = **380 AED** (unreported sales)
- [Report 01400](https://online.moysklad.ru/app/#commissionreport/edit?id=ad45b0b5-76de-11f1-0a80-08c2001c107a)

**Full physical count (salon, both messages) — all verified book = physical:**

| Code | Item | Qty |
|------|------|----:|
| `00021` | Cleanser 180ml | 3 |
| `00035` | Problem Control Cream | 2 |
| `00040` | Blemish Balm | 1 |
| `00041` | SPF40 | 1 |
| `00144` | BB Cushion #2 Beige | 2 |
| `00195` | Hyaluron Serum | 0 |
| `54457` | SPF50 | 1 |
| `54461` | Makeup Remover | 3 |
| `00188` | Microbiome Mist | 5 |
| `00140` | Sea Algae Mask | 10 |
| `54472` | Revita BB #01 Bright | 3 |
| `54473` | Revita BB #02 Natural | 3 |

**Report generator:** `scripts/moysklad-export-serene-consignment-report-correct-20260703.js`
(EXCLUDE_DEMANDS now empty → full ledger). Output:
`~/Desktop/orders/GENOSYS_Serene_Skin_Consignment_Report_00060.pdf` → **30 SKUs · 79 pcs · 8,734 AED**.

**Lesson:** never exclude documents to make numbers fit a partial count. Use the full ledger and
adjust only where the salon's physical count genuinely differs.

---

## Reclassified as SHRINKAGE (2026-07-03, ~17:30) — salon will not pay

Salon disputes having/selling the 6 missing units and refuses to pay. Reclassified from
"unreported sales" (commission reports = debt) to **shrinkage** (return + loss = no debt),
same treatment as the hyaluron earlier.

**Script:** `scripts/moysklad-serene-writeoff-instead-of-sales-20260703.js --commit`
**Marker:** `SERENE-SKIN-SHRINKAGE-WRITEOFF-2026-07-03`

| Action | Doc | Detail |
|--------|-----|--------|
| Delete | Report **01399** (435 AED) | was: cleanser/PCC/blemish "sold" |
| Delete | Report **01400** (380 AED) | was: SPF40/cushion/SPF50 "sold" |
| Return | **00303** — 815 AED | 6 units off consignment (contract 00060) |
| Loss | **00008-00459** — **223.82 AED @ buy** | our absorbed cost, not billed |

Shrinkage units: `00021`×1, `00035`×1, `00040`×1, `00041`×1, `00144`×1, `54457`×1
(+ hyaluron `00195`×1 from return 00302 / loss 00008-00458 earlier = 7 units total today,
absorbed cost 263.82 AED).

Consignment remainder unchanged (returns subtract exactly like reports did) — book still
equals physical on all 12 counted SKUs; printed report and generated PDF stay correct.
Serene owes **nothing** from this recon.

**Note (native report time cutoff):** the «Товары на реализации» screen books commission
reports at **commission period end**, not document moment. Scripts should always set
`commissionPeriodEnd` = document moment, otherwise the report ignores same-day documents
until midnight.
