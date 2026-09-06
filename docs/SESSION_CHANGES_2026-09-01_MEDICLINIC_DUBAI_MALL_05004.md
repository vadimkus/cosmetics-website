# Mediclinic Dubai Mall — PO 5700568865 / inv 05004 (2026-09-01)

**Customer:** Mediclinic Clinics Investment LLC `5d9d720d-82e5-11ee-0a80-049f00115b8e`  
**PO:** 5700568865 · 31.08.2026 · released 01.09.2026 · Dubai Mall Dermatology  
**Pay:** 90 days month end · unpaid  

**Scripts:** create → round-to-1900 → `scripts/moysklad-amend-mediclinic-05004-match-po-20260901.js --commit`

## Posted (matches PO)

| Doc | Number | Sum | VAT |
|---|---|---:|---:|
| SO | GENCardM260901MDUM50 | **1,899.98** | 90.48 |
| INV | **05004** | **1,899.98** | 90.48 |
| SHIP | **06775** | **1,899.98** | 90.48 |

State: Доставлен - Ждем оплату. Invoice-only demand. `vatIncluded: false`.

| Code | Product | Qty | Ex-VAT | Line net |
|---|---|---:|---:|---:|
| 00012 | Peptide Gel Mask 39g | 50 | 36.19 | 1,809.50 |

PO: net **1,809.50** + tax 5% **90.48** = **1,899.98**. Same on SO / INV / SHIP.

First booking was this PO math. Mid-session rounded to 50 × 38 VAT-included = 1,900 (04614 style). Reissued 1 Sep to match the PO scan.

PDF: `~/Desktop/orders/GENOSYS_Mediclinic_Dubai_Mall_05004.pdf`

Ship: MEDICLINIC DUBAI MALL, Level 7, Fashion Parking, Dubai Mall, Dermatology. addInfo empty.
