# SESSION CHANGES — 2026-06-14 — H1 Recon Fixes: 00588, Qatar Airways, Sundry Card Spend

## Context

Action items #2–#4 from the [H1 AED bank ↔ MoySklad reconciliation](./SESSION_CHANGES_2026-06-14_AED_BANK_MOYSKLAD_RECON_H1.md).
Item #1 (office rent) was resolved separately as
[owner-funded → Partners' Current Account](./SESSION_CHANGES_2026-06-14_PARTNERS_CURRENT_ACCOUNT_RENT_H1.md).

All bookings are **backdated** to the real transaction dates.
Script: `scripts/moysklad-fix-recon-items-00588-qatar-sundry-20260614.js` (idempotent, `--commit`).

## (2) Fixed zero-value paymentout 00588

Data-entry error: paymentout **00588** (agent **MOFA**, expense item *Invoices Attestation*,
memo "304.41 AED") was booked as **AED 0.00**.

- `PUT /entity/paymentout/2c22dc70-43a5-11f1-0a80-0fb40007aaa2` → `sum: 30441`
- Now **AED 304.41**, date unchanged (2026-04-29). Matches bank MOFA card charge 2026-04-30.

## (3) Booked Qatar Airways — NET of refund = AED 740.00

The single biggest H1 bank outflow with **no** MoySklad match (Card, 2026-01-05).
Qatar Airways counterparty already existed (`3c7aae78-e6ca-11f0-0a80-15ae00577181`),
but had 0 paymentouts.

**Refund check (post-booking, owner-prompted):** the bank statement shows the charge was
**largely refunded** —

| Date | Ref | Desc | AED |
|------|-----|------|-----|
| 2026-01-05 | 197978870 | Qatar Airways | −29,570.00 |
| 2026-01-27 | 206088291 | Qatar air (refund) | +28,830.00 |
| **Net** |  |  | **−740.00** |

So the real travel cost was **AED 740.00** (cancellation/change fee), not 29,570.

- Created paymentout **00620**, then **corrected sum 29,570.00 → 740.00** (net of refund).
- 2026-01-05 — agent **Qatar Airways** — expense item **Business Travel (conference)**.
- Payment purpose records both bank refs and the netting math.
- Marker `[RECON-QATAR-20260105]` in payment purpose (idempotency guard).
- The reconciliation originally missed the refund because it is an *inflow* and was not
  linked back to the Qatar outflow.

## (4) Monthly aggregates for small operational card spend

Booked the small Wio-card operational spend as **month-end aggregate paymentouts**
(same pattern as the Slider monthly bookings), so the books are complete without
hundreds of micro-entries.

New entities:
- Counterparty **Sundry Card Expenses (Wio AED)** (`a59beb0f-681d-11f1-0a80-05c6008a865d`)
- Expense item **Sundry operating expenses** (`a55fd2c4-681d-11f1-0a80-082c008aa9d9`)

| Doc   | Month   | Date       | AED      | Items |
|-------|---------|------------|----------|-------|
| 00621 | Jan 2026 | 2026-01-31 | 455.61   | 10 |
| 00622 | Feb 2026 | 2026-02-28 | 388.44   | 6  |
| 00623 | Mar 2026 | 2026-03-31 | 342.11   | 6  |
| 00624 | Apr 2026 | 2026-04-30 | 1,015.46 | 8  |
| 00625 | May 2026 | 2026-05-31 | 20.99    | 1  |
| **Total** |     |            | **2,222.61** | **31** |

Vendor composition (recorded per-month in each paymentout's purpose):
DU 538.99, Quiqup 342.30, Uber 283.91, Dubai Municipality 250.00, Twilio 185.00,
Talabat 163.10, Samadhi wellness 139.00, Careem 120.31, Tamm 100.00, Smart Dubai Government 100.00.

### Deliberately EXCLUDED (no double-count)

- **Slider** card charges → already booked as monthly aggregates **00614–00619**.
- **Wio subscription fee** (AED 99/mo) → already covered by yearly Wio fee paymentout **00508** (1,188).
- **FX transaction fees** (AED 12.08 total) → immaterial bank charges, left with bank fees.
- **Bonuses / transfers** ("To Vadim", "To Iryna", SALDO) → owner/staff comp & accounting, out of scope here.
- **Office rent** → Partners' Current Account (owner-funded, separate doc).
- **MOFA 304.41** → handled in (2) above.
- **Qatar Airways** → handled in (3) above.

## Refund / reversal scan across all H1 outflows

After the Qatar catch, ran a full scan (`scripts/scan-wio-refunds-h1-2026.js`,
output `data/wio-statements-2026-h1/refund-scan-h1-2026.json`) matching every outflow to
later inflows by merchant name and by amount (±2%, ≤90 days). 948 txns scanned.

Of 94 raw hits, only **2 are genuine third-party merchant refunds**; the rest are noise:
- 23 owner/staff self-transfer round-trips ("To Vadim" → "From Vadim") — Partners' CA / treasury, not expense refunds
- 18 FX conversion legs ("AED to USD" ↔ "USD to AED") — not refunds
- ~50 coincidental amount-matches against unrelated customer receipts ("From <clinic>") — false positives

Genuine merchant refunds:

| Merchant | Charge | Refund | Net | Status |
|----------|--------|--------|-----|--------|
| Qatar Airways | −29,570.00 (Jan 5) | +28,830.00 (Jan 27) | **−740.00** | ✅ corrected in 00620 |
| Quiqup (QUIQUP DELIVERY LLC) | −342.30 (3 card charges, booked in 00621/00622/00624) | +737.70 (Mar 9, INV 124818) | n/a | ✅ NOT a refund — see below |

**Quiqup is a COD courier (owner-confirmed):** it collected cash from customers on delivery
and remitted it back **net of its delivery fee**. Therefore:
- **+737.70 = customer sales cash (gross COD − Quiqup fee)** = cash *settlement* of receivables,
  NOT a refund and NOT other income.
- **Owner confirmed the underlying COD orders are already recorded as sales in MoySklad**, so
  the 737.70 must **not** be booked again as revenue (would double-count). It is the cash
  collection of those already-booked sales.
- The three card charges (342.30) are Quiqup **delivery fees** on non-COD/prepaid orders →
  legitimate delivery cost, correctly expensed (left in Sundry at this materiality).

Conclusion: **no expense is overstated by a refund.** Only the Qatar correction was material.
The Quiqup +737.70 is COD cash settlement of already-booked sales — no action required.

## H1 punch-list — final status

| # | Item | Status |
|---|------|--------|
| 1 | Office rent ~AED 82.7K not in Wio AED | ✅ Owner-funded → Partners' CA (Due to Vadim 82,665.20) |
| 2 | `00588` zero-value | ✅ Fixed → AED 304.41 |
| 3 | Qatar Airways AED 29,570 unbooked | ✅ Booked → 00620, then corrected to **net AED 740** (28,830 refunded 2026-01-27) |
| 4 | Small operational card spend | ✅ Booked → 00621–00625 (AED 2,222.61) |
| 5 | DM GME 260605 USD 15,294 | ⏳ Book when goods land (owner convention) |

## Notes

- The Sundry aggregate lumps mixed VAT treatments (government fees vs. taxable card spend)
  into one expense line for operational simplicity. Amounts are immaterial (≈AED 2.2K H1).
  Per-month vendor breakdown is preserved in each paymentout's payment purpose if a finer
  split is ever needed.
- Spend sits on the **company** Wio card → company-funded paymentouts (not Partners' CA).
  If any line (e.g. personal Uber/Talabat/Samadhi) should be owner drawings, reclassify to
  Partners' CA later.
