# First Person Marina — «Баланс (мы должны): 882 AED» investigation (2026-06-26)

## Question

On **Входящий платеж 05819** (550 AED) for **First Person Ladies Salon (Marina)**, MoySklad shows green text:

**«Баланс (мы должны): 882,00 AED»**

What does it mean? Is it a booking error?

## Short answer

| Label | Meaning |
|-------|---------|
| **«мы должны»** | **Genosys owes the salon** — customer has **credit** on mutual settlements |
| **882 AED** | **Unapplied credit** from **two old sales returns** (2020 + 2021) |
| **550 AED payment** | **Correct** — closes retail chain for cushion order; **does not clear the 882** because payment is linked to **отгрузка 06411**, not to returns |

**Not a mistake on payment 05819.** The 882 is **legacy return credit** sitting on the counterparty.

---

## What «мы должны» / «нам должны» means in MoySklad

| UI text | Direction |
|---------|-----------|
| **Баланс (мы должны)** | Company **owes** the customer (overpayment / return credit / advance) |
| **Баланс (нам должны)** | Customer **owes** the company (unpaid invoice / commission report) |

Opposite of what casual reading might suggest: **«мы должны» = our debt to them**, not theirs to us.

---

## Today’s 550 AED chain (verified OK)

| Step | Doc | Amount | Status |
|------|-----|-------:|--------|
| Order | **GENCardM260626SHKR1** | 550 | Delivered / paid |
| Invoice | **04722** | 550 | Paid |
| Shipment | **06411** (retail, no contract) | 550 | Paid |
| Payment | **05819** | 550 | Paid → linked to **06411** |

Product: cushion **00101 Beige** ×1 @ 505 + delivery (550 VAT-incl).

Payment **05819** has one operation: **demand 06411** for 550.00 AED. Invoice **04722** shows payed 550 via shipment link. **No overpayment on this sale.**

*(UI workflow may show order name truncated; API order name is `GENCardM260626SHKR1`.)*

---

## Where 882 AED comes from (exact match)

**882.00 = 740.00 + 142.00** — two **Возврат покупателя** with full amount still as customer credit (`payedSum = 0`):

| Return | Date | Credit AED | Notes |
|--------|------|----------:|-------|
| **00002** | 2020-04-28 | 740.00 | Early COVID-era return |
| **00006** | 2021-12-22 | 142.00 | |
| **Total** | | **882.00** | Shown as «мы должны» |

Additional returns since 2022 total **4,486 AED** credit (21 documents). Those are part of the wider settlement picture but the **882 figure on the payment screen matches only the pre-2022 return pair.**

---

## Full settlement balance (API audit method)

Using the same method as `moysklad-audit-customer-balances-20260611.js`:

**Settlement balance = Σ (`payedSum` − `sum`) on `invoiceout` + `commissionreportin` + (`sum` − `payedSum`) on `salesreturn`**

| Component | AED |
|-----------|----:|
| Unpaid retail invoices (9 docs, **2020–2021 only**) | **−23,769.00** |
| Commission reports (66 docs, all paid) | 0.00 |
| Sales returns (21 docs, all unapplied credit) | **+5,368.00** |
| **Net settlement balance** | **−18,401.00** |

**Interpretation:** On strict invoice+report+return math, **Marina owes Genosys 18,401 AED** — driven by **legacy open invoices**, not by today’s 550 sale.

Largest open invoices:

| Invoice | Date | Unpaid AED |
|---------|------|----------:|
| 00910 | 2021-06-02 | 13,971.00 |
| 01099 | 2021-11-25 | 2,710.00 |
| 00473 | 2020-11-02 | 2,651.00 |
| 01073 | 2021-11-01 | 2,282.00 |
| + 5 smaller | 2020–2021 | 2,155.00 |

These likely predate the current **consignment contract 00024** workflow (duplicate-era retail invoices). Worth a separate cleanup review — not urgent for daily ops if commission reports are the real settlement path.

---

## Consignment (separate from 882)

| Item | Value |
|------|------:|
| Contract | **00024** |
| Unpaid consignment отгрузки | **~223,240 AED** (70+ shipments, `payedSum = 0`) |
| Commission reports | All paid through **01364** (Jun 2026) |

Consignment shipments show **«Не оплачено»** in UI — **normal**. Money is collected via **Полученный отчет комиссионера**, not per shipment. This is **not** the 882 «мы должны» line.

Today’s consignment replenishment **06412** (1,545 AED) is also unpaid on shipment — expected until the next commission report.

---

## Why the payment screen shows +882 while net balance is −18,401

The payment form highlights **customer credit (мы должны)** — here the **882 AED return balance** — without netting the **2020–2021 invoice receivables** in the same green line.

For full picture use **Отчёты → Взаиморасчеты** on counterparty **First Person Ladies Salon (Marina)**.

Today’s **550 AED incoming payment does not increase the 882**; it settles the new retail shipment only. The **882 stays** until return credit is applied or refunded.

---

## Recommended actions (optional)

1. ~~**Do nothing urgent** on 882~~ **Done 2026-06-26** — legacy invoices + returns 00002/00006 unposted; see [SESSION_CHANGES_2026-06-26_PERSONA_MARINA_LEGACY_BALANCE_FIX.md](./SESSION_CHANGES_2026-06-26_PERSONA_MARINA_LEGACY_BALANCE_FIX.md).
2. ~~**Optional follow-up:** settlement still shows **+4,486 AED** from **2022+ sales returns**~~ **Done 2026-06-26** — 19 returns voided; settlement **0.00 AED**.
3. **Apply credit:** link return balance against next **commission report** or retail invoice when agreed with salon.
4. **Refund:** if they want cash, **Исходящий платеж** with note linking returns.

~~4. **Separate cleanup project:** review invoices **00910** …~~ **Closed 2026-06-26** — all 9 legacy invoices unposted.

---

## Artifacts

- Script: `scripts/moysklad-investigate-persona-marina-balance-20260626.js`
- Prior audit: `docs/MOYSKLAD_CUSTOMER_BALANCE_AUDIT_2026-06-11.md` (Marina **−18,401** at that date)
- Related: `docs/SESSION_CHANGES_2026-06-26_PERSONA_MARINA_CONSIGNMENT_REPLENISHMENT.md`

```bash
node --import dotenv/config scripts/moysklad-investigate-persona-marina-balance-20260626.js
```
