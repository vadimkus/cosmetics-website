# Fayy Health FZCO — Peptide Gel Mask SO ×50

**Date:** 2026-07-09  
**Customer:** Fayy Health FZCO (`ee20d7e3-d46d-11ed-0a80-0df400228557`)  
**Phone:** +971 50 634 7171  
**Address:** One Central, The Offices 2, 6th Floor, Unit 6.02, Dubai, UAE  
**TRN:** 104022825400003 (in counterparty address comment)

## Request

Sales order only (no invoice/shipment yet) — same item as invoice **04232**, **50 pcs** instead of 100.

## Order created

| Field | Value |
|-------|-------|
| **SO** | `GENCardM260709FAYY50` |
| **MoySklad ID** | `d6b7cecc-7b6b-11f1-0a80-04c400118cbf` |
| **Line** | `00012` Genosys Peptide Gel Mask 39g ×50 @ 38.00 AED |
| **Total** | **1,900.00 AED** VAT-incl. |
| **Prior ref** | Invoice 04232 (05/03/2026) — 100 × 38 = 3,800 AED |

## PDF

- Template: `Genosys_Invoice_PROFORMA`
- Path: `~/Desktop/orders/GENOSYS_Fayy_Health_GENCardM260709FAYY50.pdf`

## Script

```bash
node --import dotenv/config scripts/moysklad-create-fayy-health-peptide-order-20260709.js --commit
```

## Pending

- Invoice, shipment, payment when customer confirms / pays
