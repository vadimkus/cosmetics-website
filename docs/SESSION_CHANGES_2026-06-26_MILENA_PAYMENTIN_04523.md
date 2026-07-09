# Milena — paymentin 04523 (2026-06-26)

Booked missing Wio bank receipt against MoySklad invoice **04523**.

## Bank source

| Field | Value |
|---|---|
| Date | 2026-06-05 |
| Wio ref | 256964648 |
| Payer | MILENA AESTHETIC CLINIC LLC |
| Amount | **540.00 AED** |
| Note | INV 04523 GENOSYS |

## MoySklad

| Doc | Value |
|---|---|
| Invoice | **04523** — 540.00 AED (was unpaid) |
| Paymentin created | **05820** — 540.00 AED |
| Link | https://online.moysklad.ru/app/#paymentin/edit?id=05572946-7186-11f1-0a80-1ff0002238b4 |

Milena customer balance should now be **0** (was -540 per audit 2026-06-11).

## Script

```bash
node --import dotenv/config scripts/moysklad-create-milena-paymentin-04523-20260626.js --commit
```

`scripts/moysklad-create-milena-paymentin-04523-20260626.js`
