# Session: DTS supplier PO — rectified 28 lines (replaces DM GME 260430)

**Date:** 2026-05-08  
**MoySklad:** Purchase order **DM GME 260508**  
**id:** `2386ed8d-4a90-11f1-0a80-17c5002db578`  
**Link:** https://online.moysklad.ru/app/#purchaseorder/edit?id=2386ed8d-4a90-11f1-0a80-17c5002db578  

## Context

- Previous PO **DM GME 260430** was deleted (issues). New doc uses rectified screenshot list only: no samples/FOC blocks, no 30 ml shampoo line, no merged Revita workaround.

## Script

- `scripts/moysklad-create-po-dts-260508-rectified.js`
- Dates: `moment` 2026-05-08, `deliveryPlannedMoment` 2026-05-29
- **GCMA02:** invoice qty **100** = 100 Peptide Gel Mask **kits** → **500** pcs SKU `00012` (5 masks per kit); noted in PO description

## Totals (commit output)

- **28 lines**, **1600** units, sum at buy prices: **47241.50 AED**
