# MoySklad overpayment fix — Tarasova + Marapo (2026-06-07)

## Goal

Clear **“Genosys owes customer”** settlement balance on two retail accounts flagged in [SESSION_CHANGES_2026-06-11_MOYSKLAD_CUSTOMER_BALANCE_AUDIT.md](./SESSION_CHANGES_2026-06-11_MOYSKLAD_CUSTOMER_BALANCE_AUDIT.md) (audit run 2026-06-11).

## Root cause (both cases)

**Payment `paymentin` was linked to the shipment (`demand`) total, but the shipment sum did not match the invoice (`invoiceout`) sum.**

| Customer | Invoice | Problem | Overpaid |
|----------|---------|---------|----------|
| **Miss Angelina Tarasova** | **03533** | Shipment **04738** had **10×** collagen mask @ 18 AED; invoice/order had **7×** → payment **04328** linked **325** AED vs invoice **271** AED | **54 AED** |
| **Marapo Beauty Salon, The Face Only BlueWaters** | **04044** | Shipment **05523** had **4×** Snow O₂ Cleanser @ 255; invoice had **1×** cleanser + **3×** Snow Booster Toner @ 245 → payment **05095** linked **1,020** vs invoice **990** | **30 AED** |

MoySklad settlement: `payedSum > sum` on invoice → positive balance → we owe the customer.

## Fix applied

Script: `scripts/moysklad-fix-invoice-overpayment-20260607.js`

1. **Align shipment lines with invoice** (demand positions PUT).
2. **PUT `paymentin`**: `sum` and `operations[].linkedSum` = invoice `sum` (after line sync).

For **Tarasova**, MoySklad also synced invoice lines to the shipment (10× mask); final state matches what was shipped and paid (**325 AED** all docs). Customer order **03296** still shows 7× on the order doc (unchanged).

For **Marapo**, demand **05523** now mirrors invoice **04044** (1× cleanser + 3× toner); payment reduced **1,020 → 990 AED**.

```bash
node --import dotenv/config scripts/moysklad-fix-invoice-overpayment-20260607.js --commit
```

## Document IDs

| Customer | Agent ID | Invoice | Demand | Payment |
|----------|----------|---------|--------|---------|
| Miss Angelina Tarasova | `8ea1a7fc-4f79-11f0-0a80-00c500235347` | **03533** `b85417a3-4f7a-11f0-0a80-11e90021fa56` | **04738** `d7798ae1-4f7b-11f0-0a80-10370022e61a` | **04328** `0a62561a-4f7c-11f0-0a80-18910023e478` |
| Marapo Beauty Salon | `a25f2da0-4acd-11ed-0a80-03d90007967b` | **04044** `aaf32223-f2d7-11f0-0a80-1af5000eba69` | **05523** `b79da02c-f2d7-11f0-0a80-1077000e91cb` | **05095** `00dbb937-02b0-11f1-0a80-04fe00000eb0` |

## Verification (API readback after fix)

| Invoice | sum AED | payedSum AED | delta |
|---------|--------:|-------------:|------:|
| **03533** | 325.00 | 325.00 | **0.00** |
| **04044** | 990.00 | 990.00 | **0.00** |

Shipment and payment totals match each invoice. Settlement balance **0** for both customers (no receivable credit).

**Note (Tarasova):** Invoice **03533** and shipment **04738** are aligned at **325 AED** (10× collagen mask shipped/paid). Customer order **03296** still lists **7×** mask — order doc was not modified; only settlement docs were reconciled.

## Prevention

When posting retail paid chains: **payment `linkedSum` must match invoice `sum`**, not a higher shipment total. If shipment qty differs from invoice, fix lines before linking payment.
