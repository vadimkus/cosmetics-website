# Wio USD account ingest + Korea (DTS MG) reconciliation — 2026-06-14

## Source
`~/Desktop/Slider_2026/statement(Jun 14, 2025 - Jun 14, 2026).csv` → copied to
`data/wio-statements-usd-2025-2026/`. This is the **USD current account 9333280268**
(IBAN `AE890860000009333280268`), a 1-year statement. Complements the AED H1 ingest
(`SESSION_CHANGES_2026-06-14_SLIDER_2026_WIO_STATEMENTS_INGEST.md`).

## What the USD account is
A **pass-through for Korea supplier (DTS MG Co LTD) payments**. The cycle each time:
`AED → USD (fund)` → `To DTS MG Co LTD (pay)` → `USD → AED (sweep leftover)`. The
balance returns to ~0 after each cycle, so it carries almost no standing balance.

| Flow | Count | USD |
|---|---:|---:|
| Korea payments (To DTS MG Co LTD) | 27 | **163,237.35** |
| AED→USD funding inflows | 68 | 166,633.85 |
| USD→AED dust sweep | 25 | 3,014.30 |
| Swift fees | 26 | 382.20 |
| Transactions total | 146 | — |

Korea USD 163,237.35 ≈ **AED ~599,489 @ 3.6725 peg** (more with Wio's FX spread).

## Korea (DTS MG) reconciliation vs MoySklad

| | Value |
|---|---|
| Bank — Korea USD paid (Jun’25–Jun’26) | USD **163,237.35** (~AED 599,489 @ peg) |
| MoySklad — DTSMG Genosys paymentouts (same window) | **32 docs, AED 529,191.54** |
| Gap | ~**AED 70,298** (−13.3% at peg; larger with real FX spread) |

- Only **one** Korea counterparty exists in MoySklad ("DTSMG Genosys", `3a0a3f28-33cf-11ea-0a80-043f000b9859`) — the gap is **not** a second/missing counterparty.
- MoySklad implied rate = 529,192 / 163,237 = **3.24 AED/USD**, which is *below* the 3.6725 peg — i.e. MoySklad records less AED than the USD actually cost. So the gap is real, not just rounding.

### Most likely explanation (consistent with the 2025 audit memo)
The audit memo (`SESSION_CHANGES_2026-06-12_GENOSYS_2025_FULL_AUDIT_SUBMISSION_PREP.md`)
notes: *“Korea prepayment ~AED 161K paid to DTS MG above invoiced purchases — 2026 goods
in transit; absorbed in Partners’ CA correction.”* So some Korea cash is treated as
**prepayment / goods-in-transit**, not all as DTSMG `paymentout`. Combined with the FX
spread (peg understates real AED cost), this accounts for the direction and size of the gap.

## Alignment verdict (AED + USD vs MoySklad)
- **AED account:** reconciles to MoySklad within ~AED 3–4K for January once the Korea/USD leg is separated (see prior session doc).
- **USD account:** clean internal pass-through; Korea cash out = USD 163,237.
- **Residual to close precisely** requires: (a) the **full-year AED currency-exchange lines** (actual AED debited per AED→USD, to get the true FX cost vs peg), and (b) confirming how the large **sea-shipment down payments** are booked in MoySklad (paymentout vs prepayment/invoicein).

## Files
- Data: `data/wio-statements-usd-2025-2026/statement(Jun 14, 2025 - Jun 14, 2026).csv`
- Summary JSON: `data/wio-statements-usd-2025-2026/wio-usd-2025-2026-summary.json`
- Script: `scripts/ingest-wio-usd-statement-2025-2026.js` (read-only; runs MoySklad recon if creds present)

```bash
node --import dotenv/config scripts/ingest-wio-usd-statement-2025-2026.js
```

No git commit made.
