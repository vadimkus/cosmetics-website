# Session — Korea PO DM GME 260710 + receive into stock

**Date:** 2026-07-26  
**Source:** packing list / `docs/DM_GME_260710_Shipping_Invoice_normalized.csv`  
**Script:** `scripts/moysklad-create-po-dm-gme-260710-and-receive-20260726.js`

## Conversions (user-confirmed)

| Invoice | MoySklad | Qty received | Unit USD |
|---|---|---:|---:|
| GCMA10 Sea Algae 15 Box @ $9.8 | **00140** | **150 pcs** | 0.98 |
| GCPS02 SWS 30 Box @ $21.3 | **00020** | **300 ampules** | 2.13 |
| GCPS05 CTS 20 Box @ $21.3 | **00069** | **200 ampules** | 2.13 |

## Result

- Invoice USD: **$13,383.00** (calc match, diff $0)
- FX: 3.6725 → PO/supply AED: **49,147.52**
- Lines: 35 | stock units: 1,996
- **PO:** DM GME 260710 — https://online.moysklad.ru/app/#purchaseorder/edit?id=ecf743fd-88c0-11f1-0a80-178f00551a81
- **Supply:** 00188 — https://online.moysklad.ru/app/#supply/edit?id=ee504f6f-88c0-11f1-0a80-15c30054dc93
- PO `receivedSum` = full (49,147.52 / 49,147.52)

## Buy price note

CTS vial **00069** buy was wrongly ~78 AED; updated to **7.82 AED** (~$2.13 × FX) from this invoice.

## Not done

- Invoicein / paymentout for T/T (not requested)
- AWB 176-6176-3914 / CPIP-240726-084798 logged on docs only
