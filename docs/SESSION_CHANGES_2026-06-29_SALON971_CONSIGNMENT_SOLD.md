# Salon 971 — consignment sold recon (2026-06-29)

**Customer:** Salon 971 · agreement **35** · opening demand **06288** (2,930 AED total on doc after add-on)  
**Script:** `scripts/moysklad-create-salon971-commission-demand-20260629.js`

## Remaining stock (photo 2026-06-29)

Salon 971 shared shelf photo — counts used as remaining consignment:

| Code | Product | Remaining |
|------|---------|----------:|
| `00021` | Snow O₂ Cleanser 180ml | 2 |
| `00053` | EyeCell Eye Peptide Gel Patch (box) | 1 |
| `54464` | Cushion #3 Camel | 2 |
| `00144` | Cushion #2 Beige | 2 |
| `54467` | Skin Reboot PDRN mask Pack | 0 *(not on photo)* |

## Delta (opening 06288 − remaining = **sold**)

| Code | Opening | Remaining | **Sold** | Unit AED | Line AED |
|------|--------:|----------:|---------:|---------:|---------:|
| `00144` | 3 | 2 | **1** | 150.00 | 150.00 |
| `54464` | 3 | 2 | **1** | 150.00 | 150.00 |
| `00053` | 3 | 1 | **2** | 190.00 | 380.00 |
| `54467` | 2 | 0 | **2** | 200.00 | 400.00 |
| `00021` | 2 | 2 | **0** | 165.00 | — |
| | | | **6 pcs** | | **1,080.00** |

Period on report: **2026-06-05 → 2026-06-29**.

## Posted documents

| Type | Number | Sum (AED) | ID |
|------|--------|----------:|-----|
| Отчёт комиссионера | **01385** | **1,080.00** | `1ac3aa3a-7385-11f1-0a80-17870072ecb8` |
| Отгрузка (invoice settlement) | **06430** | **1,080.00** | `1b3c713d-7385-11f1-0a80-012d0071c61d` |

- [Report 01385](https://online.moysklad.ru/app/#commissionreport/edit?id=1ac3aa3a-7385-11f1-0a80-17870072ecb8)
- [Demand 06430](https://online.moysklad.ru/app/#demand/edit?id=1b3c713d-7385-11f1-0a80-012d0071c61d)

Report and demand lines/prices verified match.

## PDF

`~/Desktop/orders/GENOSYS_Salon971_Consignment_Sales_01385.pdf`  
Template: **Invoice_Consignment_Sales_Genosys**.

## Note

Miss Liza retail order **04650 / 06330** (785 AED, 2026-06-10) was a **separate warehouse sale** to counterparty Miss Liza — not included in this consignment recon.

## Related

- Opening setup: `docs/SESSION_CHANGES_2026-06-05_SALON971_CONSIGNMENT.md`
