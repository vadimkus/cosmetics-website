# Wio AED statements — May + Jun refresh (2026-06-26)

Ingested two fresh Wio CSV exports from Desktop **Genosys → Company_Legal → Bank Account → Statements** and refreshed the H1 2026 AED summary.

## Source

| | |
|---|---|
| **Original folder** | `/Users/vadimkus/Desktop/Drive/Genosys/Company_Legal/Bank Account/Statements` |
| **Files ingested** | `statement(May 1, 2026 - May 31, 2026).csv` (unchanged vs prior copy) |
| | `statement(Jun 1, 2026 - Jun 26, 2026).csv` (replaces partial Jun 1–14 export) |
| **Repo copy** | `data/wio-statements-2026-h1/` |
| **Account** | GENOSYS MIDDLE EAST FZ-LLC, IBAN AE110860000009833011607 (AED current) |
| **Period** | 2026-01-02 → **2026-06-26** |

## Balances (AED current)

| | AED |
|---|---:|
| Opening (1 Jan 2026) | 54,281.84 |
| Closing (**26 Jun 2026**) | **3,628.92** |
| H1 net movement | **-50,652.92** |

Prior ingest (through 14 Jun) showed closing **26,363.36** — the extra 12 days of June added large **AED→USD** conversions (Korea funding) and pulled cash down by ~**22.7K AED**.

Month-end closing: Jan 6,854.28 → Feb 117,882.85 → Mar 47,091.25 → Apr 2,041.02 → May 6,994.79 → Jun **3,628.92**.

**Continuity check:** all five Jan→Jun month boundaries OK. **Duplicate ref numbers:** 0.

## Monthly totals (AED current)

| Month | In (AED) | Out (AED) | Net (AED) | Txns | Slider # | Slider AED |
|---|---:|---:|---:|---:|---:|---:|
| Jan 2026 | 160,513.38 | 207,940.94 | -47,427.56 | 137 | 25 | 697.86 |
| Feb 2026 | 152,272.54 | 41,243.97 | +111,028.57 | 126 | 32 | 886.64 |
| Mar 2026 | 113,583.48 | 184,375.08 | -70,791.60 | 183 | 84 | 1,885.19 |
| Apr 2026 | 123,889.67 | 168,939.90 | -45,050.23 | 164 | 66 | 1,411.22 |
| May 2026 | 150,463.80 | 145,510.03 | +4,953.77 | 191 | 82 | 1,772.27 |
| Jun (through 26th) | 167,467.62 | 170,833.49 | -3,365.87 | 195 | 103 | 2,277.72 |
| **H1 total** | **868,190.49** | **918,843.41** | **-50,652.92** | **996** | **392** | **8,930.90** |

## Notable June additions (vs partial export)

| Date | Ref | Amount (AED) | Notes |
|---|---|---:|---|
| 2026-06-06 | 257314438 | -56,931.50 | AED→USD (largest single outflow in H1) |
| 2026-06-26 | — | — | Samadhi Yoga paymentout booked in MoySklad same day |

## Slider / Stripe (H1 rollup)

| Metric | Value |
|---|---:|
| Slider card charges | 392 / **8,930.90 AED** |
| Stripe/NI inflows | 106 transfers / **275,530.35 AED** |

## Script change

`scripts/ingest-wio-slider-2026-statements.js` — June filename updated to `statement(Jun 1, 2026 - Jun 26, 2026).csv`.

```bash
node scripts/ingest-wio-slider-2026-statements.js
```

| Output | Path |
|---|---|
| JSON summary | `data/wio-statements-2026-h1/wio-slider-2026-summary.json` |
| Prior doc | `SESSION_CHANGES_2026-06-14_SLIDER_2026_WIO_STATEMENTS_INGEST.md` |

## Follow-up

- Re-run `scripts/reconcile-aed-bank-vs-moysklad-h1-2026.js` if MoySklad recon JSON needs refresh for late-June txns.
- Jun is still partial (through 26th, not month-end).
