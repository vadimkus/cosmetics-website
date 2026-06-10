# Session — Audit: отгрузки missing commission agreement

**Date:** 2026-06-06  
**Tool:** `scripts/moysklad-audit-demands-missing-contract.js --since=2024-01-01`  
**Output:** `docs/MOYSKLAD_DEMANDS_MISSING_AGREEMENT_AUDIT.txt`

## What we checked

For each counterparty with a **Commission** contract in MoySklad, all **Отгрузки** (demands) since 2024-01-01 where:

- The agent has consignment activity (some demands with contract **or** commission reports with contract), but
- This specific demand has **no** `contract` field set.

Same failure mode as **Ulbossyn 06044** → replenishment not on consignment books → red остаток on reports.

## Headline numbers (first pass — no payment filter)

| Window | Flagged demands | Approx AED |
|--------|-----------------|------------|
| Since 2024 | **647** | **743,629** |
| Since 2025 | 363 | 429,744 |
| 2026 YTD | 109 | 103,104 |

**Wrong agreement** (demand linked to non-commission contract): **0**

## Payment re-classification (2026-06-06) — **critical correction**

Many commission counterparties also buy **retail** (invoice → отгрузка → оплата). Those отгрузки correctly have **no** commission agreement.

Rule used on all 647 flagged IDs (`expand=invoicesOut,payments`):

| Category | Count | AED | Meaning |
|----------|-------|-----|---------|
| **paid_retail** | **633** | 721,475 | `payedSum` = full sum and/or linked cashin/paymentin — **normal sale** |
| **unpaid_invoice_retail** | **7** | 14,300 | Linked счёт, not paid yet — **retail on invoice**, not consignment |
| **consignment_like** | **7** | **7,854** | No payment **and** no invoice — **true missing agreement** |

Detail file: `docs/MOYSKLAD_DEMANDS_MISSING_AGREEMENT_BY_PAYMENT.tsv`

### True consignment gaps (link agreement 000xx)

| Demand | Date | AED | Counterparty | Expected agreement |
|--------|------|-----|--------------|-------------------|
| 04553 | 2025-05-01 | 2,828 | First Person Palm Jumeirah | 00068 |
| 04858 | 2025-08-11 | 1,805 | Serene Skin | 00051 |
| **06152** | 2026-05-14 | 1,140 | ARFI Nails | 25 |
| 03247 | 2024-04-13 | 770 | X Consulting | 00036 |
| 05320 | 2025-12-02 | 600 | First Person Marina | 00024 |
| 03159 | 2024-03-15 | 426 | Tatiana Aniskina | 00025 |
| **06287** | 2026-06-03 | 285 | Eclatant&Co | 18 |

### Ulbossyn — revised

| Demand | Payment | Invoice | Agreement | Verdict |
|--------|---------|---------|-----------|---------|
| **06044** | none | none | fixed 00043 | Was real consignment bug |
| **05712** | **paid 210** | 04180 | none | **Retail sale — OK** |
| **04977** | **paid 125** | 03692 | none | **Retail sale — OK** |

## Already OK (not flagged)

Recent scripted consignment docs with agreement set:

- Cosmiden **06286** (agreement 15)
- Salon 971 **06288** (agreement 35)
- Ulbossyn **06295**, **06044** (fixed — agreement 00043)

## Ulbossyn — only 06044 was consignment

After payment check: **05712** and **04977** are paid retail (invoice + paymentin) — no agreement needed.

Only **06044** was unpaid consignment replenishment without agreement (fixed).

## Worst accounts (2025+, by count missing agreement on demand)

| Counterparty | Demands | With agr | **Missing** | Reports w/ agr |
|--------------|---------|----------|-------------|----------------|
| Marapo BlueWaters | 64 | 2 | **62** | 0 |
| X Consulting | 78 | 40 | **38** | 36 |
| Evolution Aesthetics | 36 | 0 | **36** | 1 |
| Face Room | 32 | 1 | **31** | 2 |
| My Skin Story | 51 | 12 | **39** | 9 |
| First Person Marina | 70 | 58 | **12** | 22 |
| Shakirovna Ladies | 98 | 86 | **12** | 75 |
| Cosmiden | 31 | 19 | **12** | 15 |

**Never** put agreement on any demand (2025+) but reports use contract: Evolution, Yelizaveta Nabieva, Lafamilia.

## 2026 — largest single misses

| Demand | AED | Counterparty |
|--------|-----|--------------|
| 05519 | 4,990 | Face Room |
| 06280 | 3,505 | Evolution |
| 05476 | 3,520 | Evolution |
| 06173 | 3,630 | Bianco Cedre |
| 06099 | 3,180 | My Skin Story |
| 05658 | 3,425 | Iulia Beauty |
| 05493 | 4,280 | Bianco JGE Ladies |

## Recommended next steps

1. Fix **Ulbossyn 05712 + 04977** (same PUT contract as 06044).
2. Pick 2–3 high-volume agents (Evolution, Face Room, X Consulting) and bulk-link agreement on open demands.
3. Add `contract` to all new consignment demand scripts (already done for recent ones).
4. Optional: bulk-fix script `moysklad-fix-demands-link-contract.js` per agent.

## Re-run audit

```bash
cd cosmetics-website
node --import dotenv/config scripts/moysklad-audit-demands-missing-contract.js --since=2024-01-01
```
