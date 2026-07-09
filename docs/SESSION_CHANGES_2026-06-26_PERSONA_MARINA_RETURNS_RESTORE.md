# First Person Marina — restore voided sales returns (2026-06-26)

## Why

Returns **00002 … 00194** (21 docs, **5,368 AED**) were wrongly unposted during settlement cleanup. They are **consignment stock documents** (contract **00024**) for goods received back from the salon — not phantom credits.

Per [CONSIGNMENT_STOCK_RECONCILIATION.md](./CONSIGNMENT_STOCK_RECONCILIATION.md):

```text
Qty at salon = Σ Отгрузки − Σ Commission reports − Σ Возвраты
```

Unposting returns **inflated** book stock at Marina.

## Action

Re-conducted all **21** returns: `applicable → true`.

| Batch | Returns | AED |
|-------|---------|----:|
| 2020–2021 | 00002, 00006 | 882 |
| 2022–2025 | 00007 … 00194 (19) | 4,486 |
| **Total** | **21** | **5,368** |

**Unchanged:** 9 legacy invoices stay **voided** (phantom AR, 23,769 AED) — that part remains correct.

## Result

| Metric | Value |
|--------|------:|
| Applicable returns | **21** |
| Settlement balance (invoice + report + return) | **+5,368 AED** |
| Payment form | May show return credit — **ignore for consignment billing**; money flow = commission reports |

## Script

```bash
node --import dotenv/config scripts/moysklad-restore-persona-marina-returns-20260626.js --commit
```

## Going forward

- **Physical return** → keep **Возврат покупателя** posted on **00024**
- **Sold** → **commission report** only
- **Do not void returns** to fix «мы должны» — void phantom **invoices** only, or apply credit when settling a report
