# Rise UP — Consignment Agreement

**Date:** 2026-06-01 (UAE)

## Request

Create commission consignment agreement (договор комиссии) for **Rise UP**.

## Customer

| Field | Value |
|--------|--------|
| Name | Rise UP |
| Counterparty ID | `b83e0d80-5d8f-11f1-0a80-065d0075240c` |

See also: [SESSION_CHANGES_2026-06-01_RISE_UP_CUSTOMER.md](./SESSION_CHANGES_2026-06-01_RISE_UP_CUSTOMER.md)

## Agreement

| Field | Value |
|--------|--------|
| Number | **34** |
| ID | `c91330fa-5d90-11f1-0a80-1af00073b7c8` |
| Type | Commission (consignment) |
| Organization | Genosys Middle East FZ-LLC |
| Reward | PercentOfSales @ **0%** |
| Currency | AED |
| State | Retail>>deferred payment |

[Open agreement](https://online.moysklad.ru/app/#contract/edit?id=c91330fa-5d90-11f1-0a80-1af00073b7c8)

## Script

`scripts/moysklad-create-rise-up-consignment-contract-20260601.js`

```bash
node --import dotenv/config scripts/moysklad-create-rise-up-consignment-contract-20260601.js --commit
```

Use contract **34** / ID `c91330fa-5d90-11f1-0a80-1af00073b7c8` for future отгрузки and отчёты комиссионера.

## Legal agreement (Desktop + docs)

Print/sign-ready **Consignment Agreement No. 34** (Markdown):

| File | Path |
|------|------|
| **PDF (signing copy)** | `~/Desktop/RiseUP/Genosys_Consignment_Agreement_Rise_UP.pdf` |
| **Markdown (Desktop)** | `~/Desktop/RiseUP/Genosys_Consignment_Agreement_Rise_UP.md` |
| **Markdown (repo)** | `docs/Rise_UP_Consignment_Agreement_34_Genosys_Middle_East_FZ-LLC.md` |

PDF ingested 2026-06-03 — see [SESSION_CHANGES_2026-06-03_RISE_UP_CONSIGNMENT_AGREEMENT_INGEST.md](./SESSION_CHANGES_2026-06-03_RISE_UP_CONSIGNMENT_AGREEMENT_INGEST.md).

**Reporting obligation:** Rise UP must send **Monthly Sales Report** (sold items + stock reconciliation) on **days 1–5 of each month** for the prior calendar month (Clause 4.3).

**Before signing:** fill Rise UP Trade License, TRN on agreement PDF. Opening stock is in separate **Consignment Stock Note** (shipment **06255**), not attached to Agreement No. 34.
