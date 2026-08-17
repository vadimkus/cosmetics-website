# SESSION CHANGES — 2026-06-14 — Office Rent → Partners' Current Account (owner-funded)

> **Living schedule:** [PARTNERS_CURRENT_ACCOUNT_RENT.md](./PARTNERS_CURRENT_ACCOUNT_RENT.md)  
> Update that note when each month’s Cordoba rent is booked (July 00666 already included).

## Context

Follow-up to the [H1 AED bank ↔ MoySklad reconciliation](./SESSION_CHANGES_2026-06-14_AED_BANK_MOYSKLAD_RECON_H1.md).
That reconciliation flagged that the monthly Cordoba office-rent paymentouts in MoySklad
have **no matching outflow in the Wio AED account** (`9833011607`).

Owner (Vadim) clarified: **rent is paid from his personal account — no company bank
statement exists, and the company does NOT reimburse him.** He absorbs it.

## Verification (MoySklad)

- GENOSYS has **0 bank accounts configured** in MoySklad.
- The rent paymentouts carry **no `organizationAccount`** (`orgAccount: NONE`).
- → MoySklad is being used here as an **expense/transaction recorder, not a cash-balance
  ledger**. It records *that* rent was paid, not *from which account*. So there is no
  silent "MoySklad cash" drift; cash truth lives in the bank statements + a compiled
  Partners' Current Account.

## Accounting treatment

Because the owner pays personally and is **not** reimbursed, each rent paymentout is:

```
Dr  Rent expense                 (P&L — already captured in MoySklad ✓)
Cr  Partners' Current Account     (Due to Vadim — owner-funded)
```

It is **not** a company-cash outflow → correctly absent from the Wio AED statement.
This is the **same mechanism** as the accountant's 2025 Partners' Current Account
correction (AED 100,919 reclassified out of overstated Cash). Now tracked deliberately
rather than discovered at year-end.

## Due to Vadim — rent only (running schedule)

| Doc   | Date       | AED        |
|-------|------------|------------|
| 00536 | 2026-01-24 | 12,916.00  |
| 00550 | 2026-02-23 | 12,916.00  |
| 00570 | 2026-03-29 | 14,208.30  |
| 00586 | 2026-04-23 | 14,208.30  |
| 00601 | 2026-05-20 | 14,208.30  |
| 00613 | 2026-06-12 | 14,208.30  |
| **H1 subtotal** | | **82,665.20** |
| 00666 | 2026-07-28 | 14,208.30  |
| **YTD through Jul** | | **96,873.50** |

Rent stepped up from AED 12,916.00/mo to 14,208.30/mo in March 2026.

July **00666** booked 28 Jul 2026 (same Cordoba / Office monthly rent pattern). See [SESSION_CHANGES_2026-07-28_CORDOBA_OFFICE_RENT.md](./SESSION_CHANGES_2026-07-28_CORDOBA_OFFICE_RENT.md).

## Rules to keep books clean going forward

1. **Any future company repayment to Vadim** will appear in Wio AED as a "To Vadim"
   transfer — tag it as a **Partners' CA settlement**, NOT bonus/salary/expense, or the
   cost double-counts (expense once + reimbursement again).
2. The existing "To Vadim Sagatdinov" bonus/salary transfers in Wio AED remain owner
   compensation — owner confirmed he absorbs the rent, so there is **no overlap** with
   reimbursement.
3. **Every other company cost paid from personal funds** (personal-card Uber/Careem/
   Talabat, personally-paid flights, etc.) belongs in the **same Partners' CA bucket**.
   Maintain one running "Due to Vadim" schedule for the year.

## Status

- Rent reconciling item: **RESOLVED — explained, no statement to ingest, not an error.**
- Partners' Current Account (rent, H1 2026): **AED 82,665.20 due to owner.**
- Partners' Current Account (rent, YTD through Jul 2026): **AED 96,873.50 due to owner.**
- July add: paymentout **00666** / 14,208.30 AED (schedule update 2026-07-28).
- Original 14 Jun step: no MoySklad records changed (advisory + documentation only).
