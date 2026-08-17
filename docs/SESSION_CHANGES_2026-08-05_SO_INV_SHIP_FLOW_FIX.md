# MoySklad flow fix — SO → INV → SHIP (2026-08-05)

## Correct retail chain

```text
Sales order (заказ)
  → Invoice (счёт)          ← linked via invoice.customerOrder
    → Shipment (отгрузка)   ← linked via demand.invoicesOut ONLY
      → Paymentin / cashin  ← operations on the demand
```

**Do not** set `customerOrder` on the demand when `invoicesOut` is set — that makes the UI show SO→SHIP in parallel with SO→INV.

Consignment replenishment demands (agreement only, no invoice) are a separate pattern and unchanged.

## Live docs fixed (recreated demand, kept numbers)

| Demand | Customer | Amount | Payments re-linked |
|--------|----------|-------:|--------------------|
| 06633 | Brau Ladies (Springs Souk) | 380 | — |
| 06634 | Brau Ladies (Abu Dhabi) | 760 | — |
| 06597 | Brau Ladies (Springs Souk Jul 28) | 380 | — |
| 06600 | Miss Viktoria Ezugbaia | 675 | paymentin 05993 |
| 06521 | X BEAUTY CONSULTING | 885 | paymentin 05916 |
| 06408 | Elizaveta Nabiieva | 1,085 | paymentin 05816 |

YTD dual-link scan after fix: **0 remaining**.

## Scripts

- Repair tool: `scripts/moysklad-fix-demand-so-inv-ship-flow.js`
- Create scripts updated (removed `customerOrder` on demand when posting with `invoicesOut`): Brau Springs/ADU templates + Viktoria Ezugbaia + Elizaveta + X Beauty amend (7 files).

## Verify Brau today

- INV **04889** → SO GENCardM260805BRAUSP10 → demand **06633**
- INV **04890** → SO GENCardM260805BRAUADUP20 → demand **06634**
- Demands have **no** direct SO link
