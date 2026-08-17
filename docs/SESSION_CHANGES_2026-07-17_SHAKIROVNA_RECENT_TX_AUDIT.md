# Shakirovna — recent transactions audit (2026-07-17)

Scope: all Shakirovna counterparties, docs since **2026-06-01**.

## Already fixed

| Issue | Docs | Fix |
|-------|------|-----|
| EZ mask clinic chain on **00030** | SO GENCardM2607078417 / inv **04779** / ship **06491** / pay **05923** | Cleared contract (pay cleared 2026-07-17 after audit) |

## Still wrong / suspicious

### 1. Mist double-booked (12 Jun) — HIGH

Same day, mist `00188` ×2 @ 80 = **160 AED** booked **twice**:

| Path | Docs |
|------|------|
| Retail warehouse | SO GENCardM2606129407 → inv **04661** → ship **06345** + cashin |
| Consignment sold | Report **01379** + paymentin **05758** (on **00030**) |

Known in `SESSION_CHANGES_2026-06-12_SHAKIROVNA_LADIES_MIST_COMMISSION_REPORT.md`. One path should be voided.

### 2. Demand **06415** (27 Jun) — CONFIRMED OK (2026-07-17)

| Field | Value |
|-------|--------|
| Demand | **06415** / 300 AED / contract **00030** |
| Line | `54475` BIO-MESO PDRN Homecare Ampoule 5000 ×2 @ 150 |
| Matching report | none (not sold-report replenishment) |

User confirmed: intentional consign placement; **paid separately** (not the Expert PDRN clinic chain **06416** / 600 AED). Leave as-is.

## Looks correct

| Item | Notes |
|------|--------|
| Report **01378** + demand **06331** | Matched replenishment |
| Report **01402** + demand **06556** | Matched (backfill today) |
| Report **01379** | Report-only OK if mist was already on consign; problem is the parallel retail chain |
| Admin Shakirovna | All clinic chains contract **NONE** |
| Elite / Esthetic | Own contracts; report↔demand pairs match |
| Payments **05771** / **05919** | Legitimate consign report payments |
