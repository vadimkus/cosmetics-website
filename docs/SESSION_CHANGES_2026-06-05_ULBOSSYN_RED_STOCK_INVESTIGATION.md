# Ulbossyn — red “остаток 0” on report 01372 (investigation)

## Symptom

Report **01372** (2026-06-05) shows **red** remainder **0** on:

| Code | Sold in 01372 |
|------|----------------|
| `00194` | 1 |
| `00129` | 1 |
| `00021` | 1 |
| `00063` | 7 |
| `00140` | 7 |

Lines with stock (black): `00122`, `00190`, `00145` — had positive остаток.

## Root cause — **confirmed: missing agreement on Отгрузка**

MoySklad consignment balance = **отгрузки on contract 00043** − **reports** − **returns**.

### Primary issue: **Отгрузка 06044 (2026-04-27) has NO agreement**

| Doc | Time | Agreement | Sum |
|-----|------|-----------|-----|
| Report **01331** | 21:05 | **00043** ✓ | 3,655 AED |
| Demand **06044** | 21:25 | **MISSING** ✗ | 3,655 AED |

Same replenishment intent (script included `contractId`), but live document **06044** has **no contract** in API.

**06044 off-contract qty (never credited to consignment books):**

| Code | Qty |
|------|-----|
| `00021` | 3 |
| `00063` | 10 |
| `00129` | 2 |
| `00140` | 10 |
| `00194` | 3 |

Report **01331** sold these on contract → books went **down**; **06044** did not put them back on contract.

### Secondary issue: **report 01372 before demand 06295 (same day)**

| Doc | Time (UAE) | Agreement |
|-----|------------|-----------|
| Report **01372** | 07:34 | 00043 |
| Demand **06295** | 07:39 | 00043 |

Report posted **5 minutes before** replenishment — MoySklad validates stock **at report moment**. Even with correct history, same-day order can show red if shipment follows report.

### All demands without agreement (7 total)

| Date | Demand | Sum |
|------|--------|-----|
| 2026-04-27 | **06044** | 3,655 |
| 2026-02-20 | 05712 | 210 |
| 2025-09-19 | 04977 | 125 |
| 2022-10-20 | 01792 | 230 |
| 2022-09-12 | 01708 | 210 |
| 2022-04-03 | 01348 | 210 |
| 2021-11-26 | 01143 | 1,112 |

**06044** is the material one for current red SKUs.

## Book balance @ contract 00043 (before report 01372)

| Code | Shipped (on contract) | Sold (all reports incl. 01331, excl. 01372) | Returned | Balance |
|------|----------------------|-----------------------------------------------|----------|---------|
| `00021` | 47 | 45 | 1 | **1** |
| `00063` | 89 | 82 | 0 | **7** |
| `00140` | 95 | 88 | 0 | **7** |
| `00129` | 37 | 35 | 1 | **1** |
| `00194` | 5 | 4 | 0 | **1** |

*Approximate — after 01331 Apr sales but **excluding** 06044 replenishment.*

If **06044** were linked to **00043**, balances before 01372 would be roughly:

| Code | Would-be balance |
|------|------------------|
| `00021` | +3 → **4** |
| `00063` | +10 → **17** |
| `00140` | +10 → **17** |
| `00129` | +2 → **3** |
| `00194` | +3 → **4** |

Enough to cover 01372 lines without red.

## Fix applied (2026-06-05)

1. **Demand 06044** — agreement **00043** linked via PUT (`ULBOSSYN-FIX-06044-CONTRACT-2026-06-05`).
2. **Report 01372** — deleted and reposted (same 8 lines / 1,127 AED; Revita lines were not on live 01372).
   - New ID: `994115eb-6091-11f1-0a80-1a46000c47f0`
3. Script: `scripts/moysklad-fix-ulbossyn-06044-contract-repost-01372.js`

Demand **06295** unchanged (post-report replenishment).

## Optional follow-up

Review **05712** / **04977** if those were consignment shipments (smaller, no contract).

## IDs

- Agent: `Ulbossyn Saparbayeva` — `a09d60ad-4eb7-11ec-0a80-08b3000e83a7`
- Contract **00043**: `b2b25665-af1a-11ec-0a80-03530002ffd7`
- Demand **06044**: `100b5414-425e-11f1-0a80-09740084906f`
- Report **01372**: `6c328275-608f-11f1-0a80-007b000beffe`
- Demand **06295**: `6cbf0b7e-608f-11f1-0a80-1ba1000c02c3`
