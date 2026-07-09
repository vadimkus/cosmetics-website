# Serene Skin Beauty — consignment stock reconciliation (2026-07-03)

**Customer:** Serene Skin Beauty Salon LLC (`993395aa-8da2-11ec-0a80-006b0038cd99`)  
**Contract:** **00060** (`dc5c469a-d943-11ed-0a80-05bd0013eb27`)  
**Script:** `scripts/moysklad-create-serene-skin-stock-recon-20260703.js --commit`  
**Playbook:** [CONSIGNMENT_STOCK_RECONCILIATION.md](./CONSIGNMENT_STOCK_RECONCILIATION.md)

Salon confirmed missing units were **not sold** and **not on shelf** → lost path (return + loss), not commissioner report.

## Posted documents

| # | Type | Number | Sum | ID |
|---|------|--------|----:|-----|
| 1 | Возврат покупателя | **00302** | 1,225.00 list | `fe8e89c8-76b3-11f1-0a80-0d9f001185f2` |
| 2 | Списание | **00008-00458** | **316.02 buy** | `fee06b58-76b3-11f1-0a80-08c20010d53e` |
| 3 | Отгрузка (SPF40 surplus) | **06466** | 105.00 list | `ff188de6-76b3-11f1-0a80-0c6400116710` |

- [Return 00302](https://online.moysklad.ru/app/#salesreturn/edit?id=fe8e89c8-76b3-11f1-0a80-0d9f001185f2)
- [Loss 00008-00458](https://online.moysklad.ru/app/#loss/edit?id=fee06b58-76b3-11f1-0a80-08c20010d53e)
- [Demand 06466](https://online.moysklad.ru/app/#demand/edit?id=ff188de6-76b3-11f1-0a80-0c6400116710)

**Marker:** `SERENE-SKIN-STOCK-RECON-2026-07-03`

## A) Lost — virtual return 00302

| Code | Product | Qty | List AED |
|------|---------|----:|---------:|
| `00021` | Snow O₂ Cleanser 180ml | 3 | 495.00 |
| `00035` | Intensive Problem Control Cream 50g | 2 | 290.00 |
| `00040` | Intensive Blemish Balm Cream 50g | 1 | 125.00 |
| `00144` | BB Cushion #2 Beige | 1 | 150.00 |
| `00195` | Moisture Replenishing Hyaluron Serum 30ml | 1 | 165.00 |
| | **Total** | **8** | **1,225.00** |

## B) Lost — write-off 00008-00458 @ buyPrice

| Code | Qty | Buy AED |
|------|----:|--------:|
| `00021` | 3 | 121.20 |
| `00035` | 2 | 72.00 |
| `00040` | 1 | 31.40 |
| `00144` | 1 | 51.42 |
| `00195` | 1 | 40.00 |
| | **8** | **316.02** |

**P&L:** 316.02 AED COGS. **Not billed** to Serene.

## C) Surplus — demand 06466

| Code | Product | Qty | List AED |
|------|---------|----:|---------:|
| `00041` | Multi Sun Cream SPF40/PA++ 40g | 1 | 105.00 |

Books were 0, shelf 1 → consignment replen to align.

## Verified balances (post-commit)

| Code | Book | Salon target | Status |
|------|-----:|-------------:|--------|
| `00021` | 1 | 1 | OK |
| `00035` | 1 | 1 | OK |
| `00040` | 1 | 1 | OK |
| `00041` | 1 | 1 | OK |
| `00144` | 1 | 1 | OK |
| `00195` | 0 | 0 | OK |
| `54457` | 1 | 1 | OK |

## PDF

**Goods on Consignment Report** (contract **00060**, ledger-correct export):

`~/Desktop/orders/GENOSYS_Serene_Skin_Consignment_Report_00060.pdf`

Template: **Invoice_Consignment_Report_Genosys** (`26c9d8c4-999b-407b-8038-4d6400eb6322`) · exported from contract **00060** (2026-07-03).

Stock note from replen demand **06466** (if needed separately): template **Genosys_Consignment_Stock_Note** (`09ef2604-…`).

Prior investigation: [SESSION_CHANGES_2026-07-03_SERENE_SKIN_CONSIGNMENT_COUNT_INVESTIGATION.md](./SESSION_CHANGES_2026-07-03_SERENE_SKIN_CONSIGNMENT_COUNT_INVESTIGATION.md)
