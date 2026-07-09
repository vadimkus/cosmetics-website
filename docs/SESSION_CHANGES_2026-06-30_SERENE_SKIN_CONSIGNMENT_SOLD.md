# Serene Skin Beauty — consignment sold (2026-06-30)

**Serene Skin Beauty Salon LLC** · agreement **00060** · report + matching demand

## Posted

| Type | # | Total | ID |
|------|---|------:|-----|
| Commissioner report | **01387** | **857.00 AED** | `09877bec-7480-11f1-0a80-0d980024c9db` |
| Demand | **06436** | **857.00 AED** | `0a10ab9d-7480-11f1-0a80-114000242922` |

- [Report 01387](https://online.moysklad.ru/app/#commissionreport/edit?id=09877bec-7480-11f1-0a80-0d980024c9db)
- [Demand 06436](https://online.moysklad.ru/app/#demand/edit?id=0a10ab9d-7480-11f1-0a80-114000242922)
- PDF: `~/Desktop/orders/GENOSYS_Serene_Skin_Consignment_Sales_01387.pdf`

## Lines (report = demand)

| User request | Code | Product | Qty | Line AED |
|--------------|------|---------|----:|---------:|
| Мультифункц крем 50g | `00190` | Multi Functional Anti-Wrinkle Cream 50g | 2 | 290.00 |
| Шампунь | `00052` | HR³ Matrix Scalp & Hair Shampoo 300ml | 1 | 170.00 |
| SPF 40 | `00041` | Multi Sun Cream SPF40/PA++ 40g | 1 | 105.00 |
| Post treatment cream 20g | `00038` | Soothing Repair Post Cream 20g | 1 | 102.00 |
| Патчи для глаз | `00053` | EyeCell Eye Peptide Gel Patch (box) | 1 | 190.00 |
| **TOTAL** | | | **6** | **857.00** |

## Script

`scripts/moysklad-create-serene-commission-demand-20260630.js`

```bash
node --import dotenv/config scripts/moysklad-create-serene-commission-demand-20260630.js --commit
```
