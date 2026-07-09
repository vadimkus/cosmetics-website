# Serene Skin — consignment count investigation (2026-07-03)

**Customer:** Serene Skin Beauty Salon LLC · agreement **00060**  
**Trigger:** Printed consignment report vs clinic physical count — 7 SKU mismatches.

## Disputed lines (clinic claim = short vs printed report)

| Product | Code | Printed report | Clinic ~on shelf | Short vs report |
|---------|------|---------------:|-----------------:|----------------:|
| Snow O₂ Cleanser 180ml | `00021` | 4 | 1 | 3 |
| Intensive Problem Control Cream | `00035` | 3 | 1 | 2 |
| Intensive Blemish Balm Cream | `00040` | 2 | 1 | 1 |
| Multi Sun Cream SPF40 | `00041` | 2 | 1 | 1 |
| BB Cushion #2 Beige | `00144` | 3 | 1 | 2 |
| Moisture Replenishing Hyaluron Serum | `00195` | 2 | **0** | all missing |
| Ultra Shield SPF50 | `54457` | 2 | 1 | 1 |

## MoySklad ledger (correct method)

**Balance = replenishment demands on contract 00060 − commissioner reports − returns**  
Exclude billing-only settlement demands **06271** / **06436** (those mirror reports **01369** / **01387** — not new stock).

| Code | Replen IN | Sold (reports) | **Correct balance** | Printed | Clinic~ |
|------|----------:|---------------:|--------------------:|--------:|--------:|
| `00021` | 14 | 10 | **4** | 4 | 1 |
| `00035` | 12 | 9 | **3** | 3 | 1 |
| `00040` | 6 | 4 | **2** | 2 | 1 |
| `00041` | 19 | 19 | **0** | 2 | 1 |
| `00144` | 14 | 12 | **2** | 3 | 1 |
| `00195` | 1 | 0 | **1** | 2 | 0 |
| `54457` | 14 | 13 | **1** | 2 | 1 |

## Conclusions

### 1. Printed consignment report overstates several lines

The PDF totals match **all contract demands − reports**, which **adds settlement shipments back as stock**:

- **06271** (May sold / report **01369**) and **06464/06436** (June sold / **01387**) include SPF40, SPF50, cushion, etc.
- Treating those demands as IN inflates SPF40 by **+2**, SPF50 by **+1**, cushion by **+1** vs the true ledger.

**Not a warehouse shipping error** — report/export logic issue.

### 2. Hyaluron serum — our report is wrong; clinic count plausible

- Only **one** consignment shipment ever: demand **04858** (2025-08-11) ×1 (`00195`).
- Correct balance **1**; printed report shows **2** (phantom unit).
- Clinic has **0** → the single consigned unit is **missing** (sold without commissioner report, used internally, or lost). **Not a double-ship from our side.**

### 3. Cleanser / PCC cream / blemish balm — books match report; clinic is short

Ledger and printed report **agree** (4 / 3 / 2). Clinic counts ~1 each → **unreported sales or shrinkage at salon** (~3 / ~2 / ~1 units).

Notable: replenishment **06024** (2026-04-24) added **3 cleansers**; report **01330** same day sold only **1** → **+2** legitimately stayed on consignment per books.

### 4. SPF40 — books say zero; clinic still has one

Commission reports show **19 in / 19 sold → 0 on consignment**. Clinic reports **1 on shelf** → either one sale was reported too early, or the unit is non-consignment / old stock. **Worth clarifying with them.**

### 5. SPF50 — books match clinic; report wrong

Correct balance **1** (matches clinic ~1). Printed report **2** because settlement demand **06271** was counted as IN.

## Recommended actions

1. ~~Re-print stock using ledger logic~~ — **Done 2026-07-03:** [SESSION_CHANGES_2026-07-03_SERENE_SKIN_STOCK_RECON.md](./SESSION_CHANGES_2026-07-03_SERENE_SKIN_STOCK_RECON.md)
2. Fix consignment PDF export (settlement demands 06271/06436 must not count as IN).

## References

- Contract **00060** `dc5c469a-d943-11ed-0a80-05bd0013eb27`
- Agent `993395aa-8da2-11ec-0a80-006b0038cd99`
- Recent reports: **01369** (May), **01387** (June), **01330** (Apr replen + partial sales)
