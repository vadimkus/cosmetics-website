# Slider_2026 — Wio bank statement ingest (2026-06-14)

Ingested six monthly Wio CSV exports from Desktop folder **Slider_2026** for GENOSYS AED current account analysis (card merchant **Slider**).

## Source

| | |
|---|---|
| **Original folder** | `/Users/vadimkus/Desktop/Slider_2026` |
| **Repo copy** | `data/wio-statements-2026-h1/` (6 CSVs + JSON summary) |
| **Account** | GENOSYS MIDDLE EAST FZ-LLC |
| **IBAN** | AE110860000009833011607 |
| **Account number** | 9833011607 |
| **Currency / type** | AED current |
| **Period** | 2026-01-02 → 2026-06-14 (Jun partial through 14th) |

Each monthly CSV also contains **USD current** rows (IBAN AE890860000009333280268); primary tables below are **AED only**.

## Balances (AED current)

| | AED |
|---|---:|
| Opening (1 Jan 2026, before first txn) | 54,281.84 |
| Closing (14 Jun 2026) | 26,363.36 |
| Net movement (sum of amounts) | -27,918.48 |

Month-end closing balances: Jan **6,854.28** → Feb **117,882.85** → Mar **47,091.25** → Apr **2,041.02** → May **6,994.79** → Jun **26,363.36**.

**Continuity check:** all five Jan→Jun month boundaries match (closing = next opening). **Duplicate ref numbers:** 0 across 948 unique rows (908 AED + 40 USD).

## Monthly totals (AED current)

| Month | In (AED) | Out (AED) | Net (AED) | Txns | Slider # | Slider AED |
|---|---:|---:|---:|---:|---:|---:|
| Jan 2026 | 160,513.38 | 207,940.94 | -47,427.56 | 137 | 25 | 697.86 |
| Feb 2026 | 152,272.54 | 41,243.97 | +111,028.57 | 126 | 32 | 886.64 |
| Mar 2026 | 113,583.48 | 184,375.08 | -70,791.60 | 183 | 84 | 1,885.19 |
| Apr 2026 | 123,889.67 | 168,939.90 | -45,050.23 | 164 | 66 | 1,411.22 |
| May 2026 | 150,463.80 | 145,510.03 | +4,953.77 | 191 | 82 | 1,772.27 |
| Jun (partial) | 104,160.66 | 84,792.09 | +19,368.57 | 107 | 55 | 1,256.75 |
| **H1 total** | **804,883.53** | **832,802.01** | **-27,918.48** | **908** | **344** | **7,909.93** |

## Slider spend (why folder is named Slider_2026)

Wio card charges with merchant description exactly **"Slider"** (344 hits in H1):

| Metric | Value |
|---|---:|
| Total charges | 344 |
| Total spend | **7,909.93 AED** |
| Avg per charge | ~23.0 AED |
| Peak month | Mar 2026 — 84 charges / 1,885.19 AED |

Pattern: frequent small card debits (~20–40 AED), consistent with a SaaS/subscription meter (likely **Cursor Slider** or similar dev-tool billing on the company Wio card).

## Stripe / Network International inflows

Online card settlements via **NETWORK INTERNATIONAL LLC** (notes reference **STRIPE**):

| Month | Transfers | Inflow (AED) |
|---|---:|---:|
| Jan | 16 | 30,431.07 |
| Feb | 20 | 49,652.39 |
| Mar | 17 | 36,833.81 |
| Apr | 18 | 35,654.29 |
| May | 16 | 53,933.27 |
| Jun (partial) | 10 | 29,956.64 |
| **Total** | **97** | **236,461.47** |

## Transaction type breakdown (AED, H1)

| Type | Count | In | Out | Net |
|---|---:|---:|---:|---:|
| Transfers | 452 | 741,456.03 | 508,269.55 | +233,186.48 |
| Card | 411 | 28,830.00 | 77,518.05 | -48,688.05 |
| Currency exchange | 23 | 6,623.50 | 246,408.33 | -239,784.83 |
| Cash | 6 | 17,990.00 | 0 | +17,990.00 |
| Cheque | 7 | 9,984.00 | 0 | +9,984.00 |
| Fees | 9 | 0 | 606.08 | -606.08 |

Large **AED→USD** exchanges fund Korea supplier payments on the USD Wio account (DTS MG Co LTD).

## Notable other transactions

| Category | Examples |
|---|---|
| **Payroll / bonus (Vadim Sagatdinov)** | Monthly salary ~25k; multiple sales bonuses (largest single: -40,000 AED 2026-03-08) |
| **CP World (sea freight)** | Jan -10,781; May -13,295; May -9,496 AED |
| **FTA VAT** | Apr -29,744.83 AED (ref 804955) |
| **Qatar Airways** | Jan -29,570 AED |
| **Saldo Accounting** | Jan -1,260 AED (EST-SAL-792) |
| **Wio subscription** | -99 AED/month (Essential plan), Jan–Jun |
| **Amazon / DU / Uber** | Recurring card spend |
| **Cordoba office rent** | **Not found** in these Wio AED CSVs (May rent was booked in MoySklad paymentout 00601/00613 — may use different bank rail or counterparty label) |

## USD account (secondary, same CSV exports)

| | |
|---|---:|
| IBAN | AE890860000009333280268 |
| Transactions (H1) | 40 |
| Net USD movement | -3,200.00 |

Includes DTS MG Korea invoices (USD out) and AED↔USD conversions.

## Data quality notes

1. **Mixed accounts per file** — each monthly CSV bundles AED + USD rows; script filters by IBAN for AED analysis.
2. **No duplicate ref numbers** across the six files.
3. **Balance continuity** — perfect across all month boundaries.
4. **Jun is partial** — only through 2026-06-14; monthly in/out for Jun are not comparable to full months.
5. **Opening 54,281.84** matches prior audit closing (2025 Wio AED per `SESSION_CHANGES_2026-06-12_GENOSYS_2025_FULL_AUDIT_SUBMISSION_PREP.md`).

## Script & outputs

```bash
node scripts/ingest-wio-slider-2026-statements.js
# optional: --dir data/wio-statements-2026-h1 --iban AE110860000009833011607
```

| Output | Path |
|---|---|
| Source CSVs | `data/wio-statements-2026-h1/statement(...).csv` |
| JSON summary | `data/wio-statements-2026-h1/wio-slider-2026-summary.json` |
| Ingest script | `scripts/ingest-wio-slider-2026-statements.js` |
