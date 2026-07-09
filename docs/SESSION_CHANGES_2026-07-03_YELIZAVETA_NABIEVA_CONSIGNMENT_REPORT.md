# Yelizaveta Nabieva — consignment report + partial payment (2026-07-03)

**Customer:** Yelizaveta Nabieva Cosmetologist · **contract 00038**  
**Script:** `scripts/moysklad-create-yelizaveta-nabieva-commission-report-payment-20260703.js --commit`

## Request

Consignment sales report; **1,050 AED paid today**; keep balance open (full payment soon).

## Posted

| Doc | Number | Amount | Status |
|-----|--------|-------:|--------|
| Полученный отчет комиссионера | **01399** | **2,580.00 AED** | Partially paid |
| Входящий платеж | **05881** | **1,050.00 AED** | Linked to 01399 |

- Report UI: https://online.moysklad.ru/app/#commissionreport/edit?id=c27710c9-7705-11f1-0a80-103200267920
- Payment UI: https://online.moysklad.ru/app/#paymentin/edit?id=c2cb47fd-7705-11f1-0a80-0b550024a49d
- **Open balance:** **1,530.00 AED**

## Sold lines (full consignment remainder on books — 14 SKUs / 18 pcs)

| Code | Product | Qty | Unit | Line |
|------|---------|----:|-----:|-----:|
| 00012 | Peptide Gel Mask 39g | 5 | 38.00 | 190.00 |
| 00026 | Biphasic Makeup Remover 200ml | 1 | 145.00 | 145.00 |
| 00035 | Intensive Problem Control Cream 50g | 1 | 145.00 | 145.00 |
| 00044 | ND Cell Anti-Wrinkle Cream 50ml | 1 | 185.00 | 185.00 |
| 00053 | EyeCell Eye Peptide Gel Patch (box) | 1 | 190.00 | 190.00 |
| 00054 | EyeCell Eye Contour Serum 10ml | 1 | 185.00 | 185.00 |
| 00055 | EyeCell Eye Contour Cream 20ml | 1 | 185.00 | 185.00 |
| 00059 | EyeCell Eye Zone Care Kit (box) | 1 | 490.00 | 490.00 |
| 00122 | Multi-Vita Radiance Cream 50g | 1 | 145.00 | 145.00 |
| 00188 | Microbiome Energy Infusing Mist 80ml | 1 | 80.00 | 80.00 |
| 00190 | Multi Functional Anti-Wrinkle Cream 50g | 1 | 145.00 | 145.00 |
| 00191 | Multi Functional Anti-Wrinkle Serum 30ml | 1 | 165.00 | 165.00 |
| 00194 | Multi Vita Radiance Serum 30ml | 1 | 165.00 | 165.00 |
| 00195 | Moisture Replenishing Hyaluron Serum 30ml | 1 | 165.00 | 165.00 |
| | | | **Total** | **2,580.00** |

Prior report **01353** (2026-05-12, 3,917.50 AED) was paid in full via **05654**.

## PDF

`~/Desktop/orders/GENOSYS_Yelizaveta_Nabieva_Consignment_Sales_01399.pdf`

## Notes

- Sold qty = ledger on-hand (shipped − reported − returned) on contract 00038; no separate sold-item list provided.
- `commissionPeriodStart` / `commissionPeriodEnd` set to document moment (same-day cutoff).
- When she pays the **1,530 AED** balance, post another paymentin linked to report **01399**.
