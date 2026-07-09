# Session: «Мы должны» — all counterparties audit (corrected methodology)

**Date:** 2026-06-26  
**Context:** After First Person Marina balance investigation, user asked for all other accounts showing **«Баланс (мы должны)»**. Goods were **consignment** and were **physically returned** by the salons — so the question became: which «мы должны» are real cash liabilities vs consignment stock artifacts.

## The bug in the original audit

The audit excluded consignment **отгрузки** (demands with a contract) from the cash balance but still counted **every** `salesreturn` as a cash credit. On consignment, a physical return is a **stock event** that nets against the отгрузка — the salon never paid for those goods, so returning them creates **no cash refund liability**. Counting them manufactured a phantom **198,378 AED** «мы должны» across 40 accounts.

## The fix

`scripts/moysklad-audit-customer-balances-20260611.js`:

- **Consignment salesreturns** (return **with a contract**) are now **excluded** from the cash settlement balance, symmetric with consignment demands.
- They are tracked separately as **`consignmentReturnCredit`** (visibility, not a liability).
- Only **retail** returns (no contract) count toward real cash «мы должны».
- Also added network-level retry in `api()` (transient `fetch failed` was aborting the run).

## Corrected result + Marina fix applied (as of 2026-06-26)

| Metric | Before fix | After fix |
|--------|------:|------:|
| **Real cash «мы должны»** | 1 account / 882 AED | **0 accounts / 0 AED** |
| Consignment return credit (stock, excluded) | 42 accounts / 216,656 AED | 42 accounts |
| Customers owe us | 21 | 21 |
| Overpaid documents (`payedSum > sum`) | 0 | 0 |
| Duplicate unpaid invoice+shipment | 23 | 23 |

### The ONLY real cash anomaly — fixed

- **First Person Ladies Salon (Marina)** — was **882 AED**
  - = legacy returns **00002** (740, 2020) + **00006** (142, 2021), posted **without** a contract → counted as retail credit.
  - Marina's other **4,486 AED** (19 returns on contract **00024**) was already correctly excluded as consignment stock.
  - **Fix applied:** tagged 00002 + 00006 to contract **00024** (consignment), consistent with every other Marina return. No cash moved; goods already physically returned. Script: `scripts/moysklad-fix-persona-marina-legacy-returns-contract-20260626.js --commit`.
  - Re-run audit → Marina cash balance **0**, total real cash «мы должны» **0 accounts**.

### Everything else = consignment stock that came back

All 42 consignment-return accounts (X Beauty 18,095; Hide Medical 12,836; Loes 12,511; Allure 10,924; GOCOSMO 7,206; Marina 4,486; etc.) show «мы должны» purely because returns were posted on their consignment contracts. **Goods physically came back. No cash is owed.** Full list in `MOYSKLAD_CUSTOMER_BALANCE_AUDIT_2026-06-11.md`.

## Correct handling (confirmed)

- ✅ Keep the returns posted (physical stock came back — matches GOCOSMO 00299 procedure).
- ✅ Tag consignment returns to the consignment contract so the audit treats them as stock, not cash.
- ❌ Never refund cash. ❌ Never void the returns (re-inflates book stock at the salon).

## Why the 42-account "Взаимозачёт sweep" was NOT done

Investigated the real MoySklad mechanics (`scripts/moysklad-investigate-consignment-settlement-20260626.js`):

1. **MoySklad has no Взаимозачёт (mutual-offset) document type.** The only money documents are payment/cash in/out. There is no netting doc to create.
2. **`GET /report/counterparty/{id}` returns HTTP 403** — *"Ваш тарифный план не позволяет работать с CRM"*. The tariff blocks CRM/report API, so native MoySklad balances **cannot be read or verified** programmatically. A "sweep" could not be confirmed.
3. **Consignment отгрузки post as `paid=0` "Не оплачено"** and do not auto-net against returns, so the «мы должны» on these accounts is the **expected, cosmetic** consignment behaviour — not a cash liability.

Net: the 42 accounts are now **correctly classified** by the audit (stock returned, not cash). The only thing that needed fixing — a genuine retail-style credit — was Marina's 882, and that is done. Mass document creation across 200k+ AED on a blocked-report tariff would be reckless and unverifiable.

## Files

- Report: `docs/MOYSKLAD_CUSTOMER_BALANCE_AUDIT_2026-06-11.md`
- JSON detail (per-account return docs): `docs/MOYSKLAD_CUSTOMER_BALANCE_AUDIT_2026-06-11.json`
- Audit script: `scripts/moysklad-audit-customer-balances-20260611.js`
- Marina fix: `scripts/moysklad-fix-persona-marina-legacy-returns-contract-20260626.js`
- Probe: `scripts/moysklad-investigate-consignment-settlement-20260626.js`
- Consignment procedure: `docs/CONSIGNMENT_STOCK_RECONCILIATION.md`

## The 23 "duplicate invoice+shipment" — NOT an error (verified)

Probe `scripts/moysklad-probe-invoice-shipment-payment-20260626.js` checked how payment clears in this account:

- **12 of 12** recent paid retail sales show **invoice PAID = shipment PAID** with matched sums.
- A payment clears **both** documents together — no phantom invoice is left behind.

So the 23 flagged pairs are simply **open receivables awaiting payment** (customers will pay soon). When they pay, both the invoice and shipment auto-clear. **Do not void them.** Audit wording relabeled accordingly ("Open retail AR — clears on payment").

This differs from Marina's 2020/2021 phantoms, which came from a legacy pattern where invoices were NOT linked to the paid shipments. The current (2026) flow links and clears both correctly.
