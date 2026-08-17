# Ilmira Hairulina — consignment sales + return (2026-07-14)

**Customer:** Ilmira Hairulina (`a7c023a6-4681-11ea-0a80-067800209158`)  
**Agreement:** **00003** (`4c3b2437-80e3-11ea-0a80-05d4001412ae`)  
**Script:** `scripts/moysklad-create-ilmira-hairulina-consignment-sales-return-20260714.js --commit`

Source: customer WhatsApp (2026-07-14).

## Consignment sales report

| Doc | Number | AED |
|---|---|---:|
| Commissioner report | **01406** | **231.00** |

| Code | Product | Qty | Price | Line |
|---|---|---:|---:|---:|
| 00063 | Collagen mask 23g | 5 | 18.00 | 90.00 |
| 00140 | Sea algae mask 25g (“Aloe mask”) | 2 | 18.00 | 36.00 |
| 00041 | Multi Sun SPF40 40g | 1 | 105.00 | 105.00 |

- [Report 01406](https://online.moysklad.ru/app/#commissionreport/edit?id=aec1374d-7f53-11f1-0a80-115c00123230)
- **PDF:** `~/Desktop/orders/GENOSYS_Ilmira_Hairulina_Consignment_Sales_01406.pdf`

No payment in posted (report only).

**Combined sales PDF (01406 + 01407):** `~/Desktop/orders/GENOSYS_Ilmira_Hairulina_Consignment_Sales_01406-01407.pdf` — **473.00 AED** total.

## Consignment return

| Doc | Number | List value AED |
|---|---|---:|
| Sales return | **00304** | 2,132.00 |

| Code | Product | Qty |
|---|---|---:|
| 00145 | Problem Control Toner 200ml | 3 |
| 00035 | Problem Control Cream 50g | 1 |
| 00036 | Problem Control Cream 250g | 1 |
| 00029 | Problem Control Serum 30ml | 3 |
| 54457 | Ultra Shield SPF50 50g | 2 |
| 00021 | Snow O₂ Cleanser 180ml | 1 |
| 00188 | Microbiome Mist 80ml | 1 |
| 00189 | Overnight Cream Mask 100g | 1 |
| 00129 | EPI Turnover Boosting Peeling Gel | 1 |
| 00038 | Soothing Repair Post Cream 20g | 1 |

- [Return 00304](https://online.moysklad.ru/app/#salesreturn/edit?id=b16f981b-7f53-11f1-0a80-028300120fed)
- **PDF:** `~/Desktop/orders/GENOSYS_Ilmira_Hairulina_Consignment_Return_00304.pdf`

## Book consignment remainder AFTER posting (MoySklad)

| Code | Book qty | Customer keep qty | Status |
|---|---:|---:|---|
| 00012 | 5 | 5 (peptide mask = 1 box) | OK |
| 00021 | 1 | 1 | OK |
| 00031 | 1 | 1 | OK |
| 00034 | 1 | 1 (multi function 250g) | OK |
| 00035 | 1 | 1 | OK |
| 00036 | 1 | 1 | OK |
| 00038 | 1 | 1 (soothing repair post 20g) | OK |
| 00041 | 1 | 1 | OK |
| 00188 | 1 | 1 | OK |
| 00190 | 1 | 1 (multi function 50g) | OK |
| **00063** | **14** | **10** | **MISMATCH −4** |
| **00140** | **13** | **15** | **MISMATCH +2** |
| 00053 | 1 | — | Eye peptide patch box still on book (not on customer lists) |
| 00189 | 1 | — | Overnight mask still on book (1 returned, 1 remains) |

### Reconciliation notes

1. **Collagen 00063:** MoySklad book shows **14** after reporting 5 sold; customer counts **10** on shelf → likely **4 pcs sold earlier without a commissioner report** (would need report +4 to align). Last big consignment shipment **06120** (2026-05-10) added collagen ×15 + algae ×15.
2. **Sea algae 00140:** Book **13** after 2 sold; customer keep list **15** — confirm whether the 2 “Aloe mask” sales are correct or physical count includes unsold units.
3. **Extra on book not on customer keep list:** `00053` (EyeCell peptide patch box), `00189` (overnight mask ×1 remaining after return of 1).

No payment in for report **01406** yet.

## Corrections (2026-07-14, customer confirmation)

| Doc | Number | AED / action |
|---|---|---|
| Commissioner report | **01407** | **242.00** (collagen catch-up ×4 @ 72 + overnight sold ×1 @ 170) |
| Consignment demand | **06535** | Sea algae `00140` ×2 replenishment (+36 list) |

- [Report 01407](https://online.moysklad.ru/app/#commissionreport/edit?id=25b0fa07-7f5b-11f1-0a80-1b4f0014e9ee)
- **Sales PDF:** `~/Desktop/orders/GENOSYS_Ilmira_Hairulina_Consignment_Sales_01407.pdf`
- [Demand 06535](https://online.moysklad.ru/app/#demand/edit?id=287b83b8-7f5b-11f1-0a80-1b4f0014ea93)
- **Stock note PDF:** `~/Desktop/orders/GENOSYS_Ilmira_Hairulina_Consignment_Stock_06535.pdf`

**Book after corrections:** collagen **10**, sea algae **15**, overnight **0**, peptide patch box **1** (confirmed OK on shelf).

**Script:** `scripts/moysklad-create-ilmira-hairulina-consignment-corrections-20260714.js --commit`

Outstanding payment: reports **01406** (231) + **01407** (242) = **473 AED** total sold (not yet paid in). Send customer the combined PDF above.
