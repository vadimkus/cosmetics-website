# Partners' Current Account — Cordoba office rent (owner-funded)

**Standing note — keep updated when rent is booked.**  
Do not lose: rent is paid from Vadim’s **personal** account; MoySklad paymentout only records expense.

## Accounting

```
Dr  Rent expense                 (P&L — MoySklad paymentout to Cordoba)
Cr  Partners' Current Account     (Due to Vadim — owner-funded)
```

- **Not** a company-cash / Wio AED outflow.
- GENOSYS has **0 bank accounts** in MoySklad; paymentouts have no `organizationAccount`.
- MoySklad = expense recorder here, not cash ledger.
- Same idea as the 2025 Partners’ CA correction (AED 100,919).

## Due to Vadim — rent only (running)

| Doc   | Date       | AED        |
|-------|------------|------------|
| 00536 | 2026-01-24 | 12,916.00  |
| 00550 | 2026-02-23 | 12,916.00  |
| 00570 | 2026-03-29 | 14,208.30  |
| 00586 | 2026-04-23 | 14,208.30  |
| 00601 | 2026-05-20 | 14,208.30  |
| 00613 | 2026-06-12 | 14,208.30  |
| 00666 | 2026-07-28 | 14,208.30  |
| 00689 | 2026-08-26 | 14,208.30  |
| **YTD through Aug 2026** | | **111,081.80** |

- H1 2026 subtotal (Jan–Jun): **82,665.20**
- Rent stepped up 12,916.00 → 14,208.30 from March 2026.

## Counterparty / expense (MoySklad)

| Field | Value |
|-------|--------|
| Agent | Cordoba Residence (`beb1ce0a-a91d-11f0-0a80-0ec60014fd48`) |
| Expense item | Office monthly rent (`102351bb-be0a-11eb-0a80-0060000abc0e`) |
| Typical sum | 14,208.30 AED |
| Description pattern | `14 208, 30 AED Monthly office rent` |

## Rules

1. When company later pays Vadim for this → Wio “To Vadim” = **Partners’ CA settlement**, not new rent/bonus/salary expense (avoid double-count).
2. Salary/bonus to Vadim stay separate (compensation ≠ rent repayment).
3. Other personal-paid company costs → same Partners’ CA bucket; keep one “Due to Vadim” year schedule.

## Related

- [SESSION_CHANGES_2026-06-14_PARTNERS_CURRENT_ACCOUNT_RENT_H1.md](./SESSION_CHANGES_2026-06-14_PARTNERS_CURRENT_ACCOUNT_RENT_H1.md) — original H1 write-up
- [SESSION_CHANGES_2026-07-28_CORDOBA_OFFICE_RENT.md](./SESSION_CHANGES_2026-07-28_CORDOBA_OFFICE_RENT.md) — July paymentout 00666
- [SESSION_CHANGES_2026-08-26_CORDOBA_OFFICE_RENT.md](./SESSION_CHANGES_2026-08-26_CORDOBA_OFFICE_RENT.md) — August paymentout 00689
- Script pattern: `scripts/moysklad-create-cordoba-office-rent-paymentout-*.js`
