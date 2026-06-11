# MoySklad customer balance audit (2026-06-11)

## Question

User sees MoySklad sometimes showing **Genosys owes the customer** — are there booking mistakes?

## Answer (verified)

**Mostly no** — on consignment accounts the UI shows unpaid **отгрузки** (stock replenishment). That is **normal**; money is settled via **commission reports**, not each shipment.

**Real settlement balance** (invoices + commission reports only):

| Direction | Count | Notes |
|-----------|------:|-------|
| **We owe customer** (overpaid) | **0** (was **2**, fixed 2026-06-07) | Small retail cases cleared |
| **Customer owes us** | **23** | Unpaid invoices / reports |

## We owe customer (fix or credit note)

| Customer | Amount | Status |
|----------|-------:|--------|
| ~~Miss Angelina Tarasova~~ | ~~54 AED (invoice 03533)~~ | **Fixed 2026-06-07** — see [SESSION_CHANGES_2026-06-07_MOYSKLAD_OVERPAYMENT_FIX.md](./SESSION_CHANGES_2026-06-07_MOYSKLAD_OVERPAYMENT_FIX.md) |
| ~~Marapo Beauty Salon~~ | ~~30 AED (invoice 04044)~~ | **Fixed 2026-06-07** — same doc |

No remaining small retail overpayments from this audit slice.

## Duplicate invoice + shipment (open AR — wait for payment)

**Not urgent.** Mediclinic, Brau Ladies, Fayy Health etc. are **unpaid until customer pays** — user marks paid when payment received.

Examples (still open):
- Mediclinic: 04614 + 06289 @ 1,900 AED
- Brau Ladies Salon: several pairs (760–1,520 AED)
- Fayy Health: 04511 + 06153 @ 3,800 AED

**When payment arrives:** mark **invoice** paid and **linked shipment** paid together (one settlement, not two).

## Zheteyeva Ella — 8,225 AED (closed 2026-06-11)

- Returned all goods; **no longer a customer**.
- Posted **sales return 00298** (2022-12-19) **8,225 AED** vs отгрузка **01738** / invoice **01476** — see [SESSION_CHANGES_2026-06-11_ZHETEYEVA_ELLA_SALESRETURN_01476.md](./SESSION_CHANGES_2026-06-11_ZHETEYEVA_ELLA_SALESRETURN_01476.md).
- Audit script now counts **salesreturn** credits; 01476 pair nets to **0**. Older return **00064** (3,525 AED) may still show small credit balance.

## Consignment UI “unpaid”

**67** consignment customers have отгрузки with `payedSum < sum`. This is **expected** — not Genosys debt to customer.

## Artifacts

- Report: `docs/MOYSKLAD_CUSTOMER_BALANCE_AUDIT_2026-06-11.md`
- JSON: `docs/MOYSKLAD_CUSTOMER_BALANCE_AUDIT_2026-06-11.json`
- Script: `scripts/moysklad-audit-customer-balances-20260611.js`

```bash
node --import dotenv/config scripts/moysklad-audit-customer-balances-20260611.js
```
