# Persona Downtown — consignment sales — 2026-09-03

**Customer:** First Person Ladies Salon (Downtown) `19f661fb-b43b-11ee-0a80-0d3b00075ace`  
**Agreement:** **00077** `2092d415-b43b-11ee-0a80-095a000715c8`  
**Period:** 2026-08-01 (after July report **01421**) → 2026-09-03  
**Source:** WhatsApp sold list + bring-us. Clinic list.

| | |
|---|---|
| Report | **01457** `14ee05da-a75e-11f1-0a80-0de6001b9378` / **873 AED** / 10 pcs |
| Demand | **06797** `1579bc9e-a75e-11f1-0a80-17d5001a4ffe` / **1,630 AED** / 17 pcs |
| Paymentin | **06185** / **873 AED** (on report) |
| Pay status | Report **Paid** |
| Sales PDF | `~/Desktop/orders/GENOSYS_Persona_Downtown_Consignment_Sales_01457.pdf` |
| Stock note | `~/Desktop/orders/GENOSYS_Persona_Downtown_Consignment_Stock_Note_06797.pdf` |

**Report 01457 (sold):**

| Code | Product | Qty | Unit | Line |
|---|---|---:|---:|---:|
| 00012 | Peptide Gel Mask 39g | 4 | 38 | 152 |
| 00140 | Soothing Bomb Sea Algae Mask | 1 | 18 | 18 |
| 00144 | BB Cushion #2 Beige | 1 | 150 | 150 |
| 00051 | HR³ Matrix Hair Tonic 70ml | 1 | 145 | 145 |
| 54467 | Skin Reboot PDRN Mask Pack | 1 | 200 | 200 |
| 00063 | Intensive Repair Collagen Mask | 1 | 18 | 18 |
| 00053 | EyeCell Eye Peptide Gel Patch (box) | 1 | 190 | 190 |
| | | **10** | | **873** |

**Demand 06797** (bring-us minus EGF):

| Code | Product | Qty | Unit | Line |
|---|---|---:|---:|---:|
| 00053 | EyeCell Eye Peptide Gel Patch (box) | 5 | 190 | 950 |
| 00012 | Peptide Gel Mask 39g | 10 | 38 | 380 |
| 00144 | BB Cushion #2 Beige | 2 | 150 | 300 |
| | | **17** | | **1,630** |

EGF `00042` skipped (discontinued). Demand on agr. **00077**. Shipped. No SO, no invoice. Not printed.

Paymentin **06185** posted 2026-09-03 on report **01457** (873 AED sold). Report → **Paid**. Demand **06797** left unpaid (replenishment).

Scripts:
- `scripts/moysklad-create-persona-downtown-consignment-20260903.js --commit`
- `scripts/moysklad-amend-persona-downtown-demand-06797-20260903.js --commit` (peptide ×10 + beige ×2)
- `scripts/moysklad-create-persona-marina-downtown-paymentins-20260903.js --commit`
