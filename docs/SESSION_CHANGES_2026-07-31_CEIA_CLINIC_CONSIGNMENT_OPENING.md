# CEIA CLINIC L.L.C — consignment agreement + opening demand (31 Jul 2026)

**Customer:** CEIA CLINIC L.L.C (`d7af76af-8cc5-11f1-0a80-08f4001604b7`)  
**Script:** `scripts/moysklad-create-ceia-clinic-consignment-opening-20260731.js --commit`  
**No SO / invoice** — demand linked to commission agreement only.

## Posted

| Type | Number | Sum | Units | Lines |
|------|--------|----:|------:|------:|
| Commission agreement | **38** | — | — | — |
| Отгрузка (demand) | **06611** | **9,595.00 AED** | 80 | 30 |

- Agreement: https://online.moysklad.ru/app/#contract/edit?id=2b623037-8ccb-11f1-0a80-1d1a001698e4
- Demand: https://online.moysklad.ru/app/#demand/edit?id=2ca84e15-8ccb-11f1-0a80-17ba00174adf
- Stock note PDF: `~/Desktop/orders/GENOSYS_CEIA_Clinic_Consignment_Stock_Note_06611.pdf`
- Agreement PDF (New You Star layout):  
  `~/Desktop/Drive/Genosys/Contract_Customers/CEIA/Genosys_Consignment_Agreement_CEIA_38.pdf`  
  (+ `.md` / `.html`; copy also in `~/Desktop/orders/GENOSYS_CEIA_Consignment_Agreement_38.pdf`)  
  Script: `scripts/moysklad-export-ceia-clinic-consignment-agreement-pdf-20260731.js`

## Opening lines (clinic list)

| Code | Product | Qty | Unit | Line |
|------|---------|----:|-----:|-----:|
| 00021 | Snow O₂ Cleanser 180ml | 3 | 165 | 495 |
| 00188 | Microbiome Mist 80ml | 3 | 80 | 240 |
| 54484 | CERABARRIER Biome Gel Cleanser 200ml | 3 | 190 | 570 |
| 00022 | Snow Booster Toner 200ml | 3 | 130 | 390 |
| 00031 | Hydro Soothing Cream 50g | 2 | 145 | 290 |
| 00035 | Problem Control Cream 50g | 2 | 145 | 290 |
| 00040 | Intensive Blemish Balm Cream 50g | 2 | 125 | 250 |
| 54472 | Revita Glow BB #01 Bright 50g | 2 | 125 | 250 |
| 54473 | Revita Glow BB #02 Natural 50g | 2 | 125 | 250 |
| 00122 | Multi-Vita Radiance Cream 50g | 2 | 145 | 290 |
| 00190 | Multi Functional Anti-Wrinkle Cream 50g | 2 | 145 | 290 |
| 54458 | Hyaluron Cream 50g | 2 | 145 | 290 |
| 00037 | Skin Barrier Protecting Cream 100g | 2 | 225 | 450 |
| 00189 | Overnight Cream Mask 100g | 2 | 170 | 340 |
| 00129 | EPI Peeling Gel 100g | 2 | 125 | 250 |
| 00194 | Multi Vita Radiance Serum 30ml | 2 | 165 | 330 |
| 00029 | Problem Control Serum 30ml | 2 | 165 | 330 |
| 00195 | Hyaluron Serum 30ml | 2 | 165 | 330 |
| 00191 | Multi Functional Anti-Wrinkle Serum 30ml | 2 | 165 | 330 |
| 00030 | All For Sensitive Serum 30ml | 2 | 165 | 330 |
| 00140 | Sea Algae Mask (green) | 10 | 18 | 180 |
| 00063 | Collagen Mask | 10 | 18 | 180 |
| 00144 | Cushion #2 Beige | 2 | 150 | 300 |
| 00143 | Cushion #1 Ivory | 2 | 150 | 300 |
| 54464 | Cushion #3 Camel | 2 | 150 | 300 |
| 00053 | Eye Peptide Gel Patch | 2 | 190 | 380 |
| 00054 | Eye Contour Serum 10ml | 2 | 185 | 370 |
| 00055 | Eye Contour Cream 20ml | 2 | 185 | 370 |
| 00052 | Scalp & Hair Shampoo 300ml | 2 | 170 | 340 |
| 00051 | Hair Tonic 70ml | 2 | 145 | 290 |
| | **TOTAL** | **80** | | **9,595** |


## 2026-08-06 — CEIA Basil (accountant) CSN vs tax invoice

Basil (accountant) asked for tax invoice not CSN; said no payment without tax invoice. Drafted WhatsApp explaining consignment Agreement No. 38: CSN = stock placement (title Genosys); tax invoice after sold+reported; pro/paid stock separate with tax invoice. Contact Kathreena / owners for confirmation.

## 2026-08-17 — Basil VAT / total mismatch on CSN

Basil wrote that CSN totals and VAT “show some mismatch”, and again asked for a tax invoice not CSN.

Checked MoySklad demand **06611** (31.07.2026, agreement **38**) and re-exported official CSN:

`~/Desktop/orders/GENOSYS_CEIA_Clinic_Consignment_Stock_Note_06611.pdf`

| Check | Result |
|-------|--------|
| 30 lines × clinic VAT-incl prices | **9,595.00** |
| Sum of printed line “Total incl. VAT” | **9,595.00** |
| Sum of printed line “Subtotal excl. VAT” | **9,138.12** |
| Sum of printed line “VAT 5%” | **456.88** |
| Footer | 9,138.12 + 456.88 = **9,595.00** |
| Document `vatSum` | 456.88 |
| No tax invoice on this demand | correct for consignment |

There is **no arithmetic error** on CSN 06611. Likely confusion:

1. **Unit Price column is VAT-inclusive.** Qty × unit = Total incl. VAT, not the excl. column. 3 × 165 = 495, not 471.43.
2. If only ticked / uncrossed lines 1–19 are summed: **6,255**, not 9,595. Footer is the full 30-line placement (lines 20–30 = 3,340).
3. VAT on the document total by 5/105 rounds to **456.90**; the print uses **line-rounded VAT** which sums to **456.88** (2 fils). Footer matches the line sum.

Do **not** convert 06611 into a tax invoice unless owners buy the stock. Tax invoices already issued for paid/pro stock: **04886** (1,995 paid) and **04927** (210 unpaid, cream only).
