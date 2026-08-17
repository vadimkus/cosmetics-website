# RAKEZ — facility downgrade processing fee paymentout (2026-07-10)

## Context

Visa **2 → 1** and **facility downgrade** per RAKEZ request (signed facility form submitted earlier — see [SESSION_CHANGES_2026-06-30_RAKEZ_FACILITY_FORM_SIGNED_SUBMISSION.md](./SESSION_CHANGES_2026-06-30_RAKEZ_FACILITY_FORM_SIGNED_SUBMISSION.md)).

## RAKEZ quotation

| Field | Value |
|-------|-------|
| Quotation | **6100080026** |
| Date | 10/07/2026 |
| Reference | **SR-1835150** |
| Customer | 0000925854 |
| Item | Facility Application Processing fee |
| Amount | **1,000.00 AED** |

## Payment

| Doc | Number | Sum | Date | Link |
|-----|--------|----:|------|------|
| paymentout | **00648** | **1,000.00 AED** | 2026-07-10 | [edit](https://online.moysklad.ru/app/#paymentout/edit?id=22bcec0b-7c36-11f1-0a80-0dad001350ff) |

- **Agent:** RAKEZ
- **Expense:** Company/Trade License Cost
- **Purpose:** Facility application processing fee — visa 2→1 + facility downgrade (Quotation 6100080026 / SR-1835150)
- **Paid from:** Wio corporate AED account (company card)

## Script

`scripts/moysklad-create-rakez-facility-downgrade-paymentout-20260710.js --commit`

Related: [RAKEZ amendment / Iryna KYC](./SESSION_CHANGES_2026-06-02_RAKEZ_IRYNA_KYC_BLOCKER.md), [Iryna visa cancel paymentout](./SESSION_CHANGES_2026-07-07_RAKEZ_IRYNA_VISA_CANCEL_PAYMENTOUT.md)
