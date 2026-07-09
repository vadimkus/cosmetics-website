# First Person Marina — legacy 2020–2021 balance fix (2026-06-26)

**Customer:** First Person Ladies Salon (Marina) · `af21a79a-63cd-11ea-0a80-02b2000e2aeb`  
**Context:** [Balance investigation](./SESSION_CHANGES_2026-06-26_PERSONA_MARINA_BALANCE_INVESTIGATION.md) — «**мы должны: 882 AED**» on pay **05819**

## What was wrong

| Issue | Amount | Cause |
|-------|-------:|-------|
| Phantom retail **invoices** (2020–2021) | **23,769 AED** | Invoices left open while consignment **отгрузки** (or paid retail shipment) already covered the sale |
| Legacy **returns** 00002 + 00006 | **882 AED** | Unapplied customer credit from 2020–2021 |
| **Net settlement before fix** | **−18,401 AED** | Looked like Marina owed us; payment UI showed **+882** credit |

Consignment stock movements and commission reports were **not** changed.

## Fix applied

Unposted (`applicable → false`) with marker `LEGACY-VOID-PERSONA-MARINA-2026-06-26`:

### Invoices (9)

| Invoice | Date | AED | Note |
|---------|------|----:|------|
| 00473 | 2020-11-02 | 2,651 | Retail demand **00506** already paid |
| 00910 | 2021-06-02 | 13,971 | Duplicate of consignment demand **00918** |
| 00979 | 2021-08-09 | 290 | Duplicate of demand **01014** |
| 00985 | 2021-08-13 | 730 | Duplicate of demand **01020** |
| 01033 | 2021-10-02 | 490 | Duplicate of demand **01070** |
| 01037 | 2021-10-07 | 210 | Duplicate of demand **01074** |
| 01073 | 2021-11-01 | 2,282 | Duplicate of demand **01113** |
| 01088 | 2021-11-14 | 435 | Duplicate of demand **01130** |
| 01099 | 2021-11-25 | 2,710 | Duplicate of demand **01141** |

### Returns (2)

| Return | Date | AED |
|--------|------|----:|
| **00002** | 2020-04-28 | 740 |
| **00006** | 2021-12-22 | 142 |

## Result

| Metric | Before | After |
|--------|-------:|------:|
| Settlement balance | **−18,401** | **+5,368** (return credits; invoices voided) |
| Open applicable invoices | 9 | **0** |
| 2020–2021 return credit (00002/00006) | 882 | **0** |

**882 AED «мы должны» is cleared.**

Remaining **+4,486 AED** = **19 sales returns from 2022–2025** still posted (consignment-era returns, not touched — outside 2020–2021 scope). Payment screen may show this instead of 882 if MoySklad sums all return credits. Say if you want those cleared too.

## Follow-up (same day) — 2022+ returns cleared — **REVERTED**

~~Voided **19** applicable sales returns (**4,486 AED**).~~ **Restored 2026-06-26** — all **21** returns re-conducted (`applicable → true`). See [SESSION_CHANGES_2026-06-26_PERSONA_MARINA_RETURNS_RESTORE.md](./SESSION_CHANGES_2026-06-26_PERSONA_MARINA_RETURNS_RESTORE.md).

Voiding returns was wrong for consignment stock (see `CONSIGNMENT_STOCK_RECONCILIATION.md`). **Only the 9 phantom invoices stay voided.**

| Settlement after restore | **+5,368 AED** return credits (expected in Взаиморасчеты) |
| Consignment stock | Returns again reduce salon book balance |

## Script

```bash
node --import dotenv/config scripts/moysklad-fix-persona-marina-legacy-balance-20260626.js --commit
```

Idempotent: skips docs already `applicable: false`.

## Verify

```bash
node --import dotenv/config scripts/moysklad-investigate-persona-marina-balance-20260626.js
```
