# Fayy Health — Stripe 3,800 paymentin on May invoice 04511

**Date:** 2026-08-24  
**Customer:** Fayy Health FZCO (`ee20d7e3-d46d-11ed-0a80-0df400228557`)  
**Source:** WhatsApp from Muhammad Usman (`muhammad.usman@fayy.health`) + Stripe receipt Mastercard ••••1465 / **3,800.00 AED** to Genosys ME FZ-LLC.

## Which invoice?

Stripe has no invoice number. Two open 3,800 invoices existed:

| Invoice | Date | What | Shipment | Status before payment |
|---------|------|------|----------|------------------------|
| **04511** | **14 May 2026** | Peptide ×100 | **06153** | unpaid |
| 04960 | 21 Aug 2026 | Peptide ×100 | 06722 | unpaid |

Applied to **May 04511** (oldest unpaid 3,800, user-confirmed). **04960 stays unpaid.**

## Booked

| Doc | Name | Id |
|-----|------|----|
| Paymentin | **06116** | `af76b338-9f87-11f1-0a80-0e3800b66730` |
| Invoice | 04511 | `a0de441b-4f8d-11f1-0a80-0c4e000fa39a` |
| Shipment | 06153 | `5fe2d91f-4f8f-11f1-0a80-0ef1000f6d08` |
| Order | GENCardW2605147962 | `9ed98b01-4f8d-11f1-0a80-1c9700105788` → **Доставлен** |

Paymentin linked to the **demand** only (`linkedSum` 380000). Demand is invoice-only (no `customerOrder`).

## Still open at Fayy (after this)

| Invoice | Date | Due |
|---------|------|----:|
| 04938 | 17 Aug | 1,220 |
| 04960 | 21 Aug | 3,800 |

July 04795 (1,900) was already paid.

## Script

```bash
node --import dotenv/config scripts/moysklad-create-fayy-health-paymentin-04511-20260824.js --commit
```
