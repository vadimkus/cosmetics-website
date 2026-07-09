# Eclatant — Consignment Sales Report (June 2026)

**Date:** 2026-07-01  
**Customer:** ECLATANT&CO TRADING CO L.L.C (`0df9bafd-1a99-11f0-0a80-08b100073e9f`)  
**Contract:** 18 (`132684fd-1a99-11f0-0a80-071f0006a1ec`)  
**Commission period:** 2026-06-01 → 2026-06-30  

**Report only — no demand (отгрузка).**

## Posted document

| Type | Number | Sum | Units | Lines | ID |
|------|--------|-----|-------|-------|-----|
| Отчет комиссионера | **01388** | **1,498.00 AED** | 15 | 8 | `fdd071a2-7542-11f1-0a80-0134001c388e` |
| Входящий платёж | **05896** | **1,498.00 AED** | — | — | `b1c7a1d6-7937-11f1-0a80-1b2500801e83` |

**Status:** paid in full (2026-07-06). MoySklad report state may still show “Not paid” in UI while `payedSum` = full — same as other consignment settlements.

- [Payment in 05896](https://online.moysklad.ru/app/#paymentin/edit?id=b1c7a1d6-7937-11f1-0a80-1b2500801e83)
- **Payment script:** `scripts/moysklad-create-eclatant-paymentin-01388-20260706.js --commit`

## Lines

| Code | Product | Qty | Unit | Line |
|------|---------|-----|------|------|
| 00021 | Snow O₂ Cleanser 180ml | 2 | 165.00 | 330.00 |
| 54457 | Ultra Shield Sun Cream SPF50 50g | 2 | 125.00 | 250.00 |
| 54467 | Skin Reboot PDRN mask pack | 1 | 200.00 | 200.00 |
| 00144 | Cushion #2 Beige | 2 | 150.00 | 300.00 |
| 00129 | EPI Turnover Boosting Peeling Gel 100g | 1 | 125.00 | 125.00 |
| 00012 | Peptide Gel Mask 39g | 4 | 38.00 | 152.00 |
| 00041 | Multi Sun Cream SPF40 40g | 1 | 105.00 | 105.00 |
| 00140 | Soothing Bomb Sea Algae Mask 23g | 2 | 18.00 | 36.00 |

## Mapping notes

- **PDRN mask 1 piece** → `54467` full pack (same as prior Eclatant reports).
- Screenshot total row showed 14 units; line items sum to **15** — posted per line items.

## PDF

`~/Desktop/orders/GENOSYS_Eclatant_Consignment_Sales_01388.pdf`

## Script

`scripts/moysklad-create-eclatant-commission-report-20260701.js`

## Link

https://online.moysklad.ru/app/#commissionreport/edit?id=fdd071a2-7542-11f1-0a80-0134001c388e
