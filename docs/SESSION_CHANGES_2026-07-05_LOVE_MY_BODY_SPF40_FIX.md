# Love My Body — report vs demand SPF correction (2026-07-05)

**Amends:** [SESSION_CHANGES_2026-07-04_LOVE_MY_BODY_COMMISSION_DEMAND.md](./SESSION_CHANGES_2026-07-04_LOVE_MY_BODY_COMMISSION_DEMAND.md)  
**Script:** `scripts/moysklad-fix-love-my-body-report-spf50-demand-spf40-20260705.js --commit`

## What was wrong

First fix incorrectly changed **both** report and demand to SPF40. Correct split:

| Doc | What it records | SPF line | Total |
|-----|-----------------|----------|------:|
| Report **01400** | **Sold** at salon | SPF **50** (`54457`) ×1 @ 125 | **2,660** |
| Demand **06474** | **Shipped** to replenish | SPF **40** (`00041`) ×1 @ 105 | **2,640** |

Salon sold SPF 50; warehouse shipped SPF 40 on the consignment note.

## PDFs (`~/Desktop/orders/`)

- `GENOSYS_Love_My_Body_Consignment_Sales_01400.pdf` — SPF50 on sales report
- `GENOSYS_Love_My_Body_Consignment_Stock_Note_06474.pdf` — SPF40 on stock note (printed landscape)

## Superseded

- `scripts/moysklad-fix-love-my-body-spf40-not-spf50-20260705.js` — reverted report side via this fix
