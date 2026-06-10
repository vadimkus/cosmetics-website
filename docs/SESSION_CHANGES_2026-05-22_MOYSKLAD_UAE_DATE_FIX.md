# MoySklad scripts — UAE current date fix (2026-05-22)

## Problem

Order/invoice/commission scripts used **hardcoded** `moment: '2026-05-21 …'` from the day the script was written. When run the next calendar day in UAE, MoySklad documents showed **yesterday's date**.

## Fix

Shared helper: `scripts/lib/moysklad-uae-date.js`

| Function | Use |
|----------|-----|
| `uaeToday()` | `YYYY-MM-DD` duplicate filters, markers |
| `uaeTodayDmy()` | `DD/MM/YYYY` payment notes |
| `uaeShortDate()` | `YYMMDD` in order names (`GENCardM…`) |
| `uaeMomentNow()` | MoySklad `moment` on create |
| `uaeMomentAddMinutes(n)` | e.g. demand 5 min after report |

Timezone: **Asia/Dubai** (not UTC, not machine local if abroad).

## Updated scripts

All `moysklad-create-*order*invoice*.js` plus:

- `moysklad-create-anishyna-nataliia-commission-demand-20260521.js`

## Rule for new scripts

```js
const { uaeToday, uaeMomentNow, uaeShortDate } = require('./lib/moysklad-uae-date')

const ORDER = {
  name: `GENCardM${uaeShortDate()}5210`,
  moment: uaeMomentNow(),
  marker: `Customer order ${uaeToday()}`,
}
```

Never hardcode calendar dates in `moment` fields.

## Retroactive moment fix (2026-05-22)

Script: `scripts/moysklad-fix-document-moments-20260522.js`

PATCH only `moment` (+ Hortman description text) — **invoice/order numbers unchanged**.

| Doc | Number | Before | After | Status |
|-----|--------|--------|-------|--------|
| Aryna invoice | **04559** | 2026-05-22 | — | Already fixed manually ✓ |
| Aryna order | GENCardM2605215210 | 2026-05-21 | **2026-05-22** | Fixed via API |
| Hortman invoice | **04557** | 2026-05-21 | **2026-05-22** | Fixed via API |
| Hortman order | CODM2605216482 | 2026-05-21 | **2026-05-22** | Fixed via API |
| Anishyna report | **01360** | 2026-05-21 | **2026-05-22** | Fixed via API |
| Anishyna demand | **06211** | 2026-05-21 | **2026-05-22** | Fixed via API |

Left unchanged: Valeria **04554** / GENCardM2605213847 (created correctly on 2026-05-21).
