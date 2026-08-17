# Desktop folder `16072026` — DM GME 260710 ingest + Montaji Air — 2026-07-24

**Source folder:** `/Users/vadimkus/Desktop/16072026/`  
**Shipment:** Korea air import **DM GME 260710** (invoice 2026-07-15 → AWB 2026-07-23 → BOE 2026-07-24)  
**Buyer:** GENOSYS Middle East FZ-LLC → Cordoba Residences, Knowledge Village, Dubai  
**Supplier:** DTS MG Co., LTD, Seoul  
**Customs broker:** CP WORLD LLC (BOE)

## Key shipment refs

| Field | Value |
|---|---|
| **Invoice** | **DM GME 260710** |
| **Invoice date** | **2026-07-15** |
| **Invoice total** | **USD 13,383.00** (~AED 49,149 @ 3.6725) |
| **AWB (MAWB)** | **176-6176-3914** |
| **AWB date** | **23 Jul 2026** |
| **Carrier** | Emirates SkyCargo **EK323** ICN→DXB |
| **Packages** | **14** |
| **Weight** | **212–213 kg** |
| **BOE / declaration** | **101-01290285-26** (also listed **111115638614**) |
| **BOE date** | **24 Jul 2026** |
| **HS** | **3304.99.10** skincare cosmetics |
| **Packing list** | **14 cartons**, **1,411 units**, **211 kg**, **0.850 CBM** |

## Folder contents

| File | Purpose |
|---|---|
| `DM GME 260710_Shipping Invoice.pdf` | Commercial/shipping invoice — **35 lines**, USD **13,383.00** |
| `DM GME 260710_Commercial Invoice.pdf` | Same invoice content (dated 2026-07-16 on cover) |
| `DM GME 260710_Packing list.pdf` | 14 cartons / 1,411 units |
| `DM GME 260710_CIPL.pdf` | Combined invoice + packing list |
| `DM GME 260710_COO.pdf` | Certificate of origin |
| `176-6176 3914.PDF` | Air waybill |
| `BOE.pdf` | Bill of entry / declaration |
| `TAX INVOICE.pdf` | Broker tax invoice |
| `DELIVERY ORDER.pdf` | Delivery order |
| `Auth Letter EK (2).docx` | Emirates/DNATA auth letter |
| **`Air.xlsx`** | **Montaji consignment — 20 core lines (populated)** |

## Normalized outputs (repo)

| File | Lines |
|---|---:|
| `docs/DM_GME_260710_Shipping_Invoice_normalized.csv` | 35 (full invoice; `montaji=core` or `tester_manual`) |
| `docs/DM_GME_260710_Montaji_Consignment_normalized.csv` | 20 core only |

**Invoice total check:** CSV recalc **USD 13,383.00** ✓

## What's being shipped (summary)

**Core sellable (Montaji-ready) — 20 lines / 1,017 units:**
- Makeup remover 70; Sea algae homecare 15; PDRN mask pack **90**
- Power solutions: SWS 30 + CTS 20
- Serums (5 SKUs): anti-wrinkle / multi-vita / problem control / hyaluron / AFS — 140 pcs total
- Creams: PCC 50g×50, barrier 100g×20, MSC SPF40×50, **USC SPF50×230**, Revita BB #01×20 + #02×40, postcream box×7
- Cushions: Beige **100** + Camel **110**
- HR³ Hair Solution Alpha professional ×25

**Testers / samples / bags — left for manual Montaji (15 lines):**
- Non-woven bags ×300
- Sample sachets: SOC 4g, BBC, Revita BB, HSC, PCC, anti-wrinkle duo, hyaluron serum/cream, multi-vita serum, barrier cream, EPI, overnight mask
- HR³ Medi Scalp Shampoo 30ml ×50

## Montaji `Air.xlsx` (20 core lines)

Template from `~/Desktop/Codes/Air.xlsx`, populated into `~/Desktop/16072026/Air.xlsx`.  
Columns: **A** = Product ID/Barcode, **B** = Items Quantity (rows 3–22).

**Fix 2026-07-24 (Montaji “mandatory fields” on lines 3–22):**
1. Rebuilt from last **successful** Air template (`DTSMG Orders/2026/26062026/Air.xlsx`) preserving cell styles (`B` qty style `s="14" t="n"`, colB `style="4"`). Openpyxl “General” override had broken numeric validation.
2. Filled **Batch / Production / Expiry** from invoice MFG/LOT (e.g. `20290604/RF120` → batch `RF120`, expiry `04/06/2029`, production estimated expiry−3y) — needed for DM Health & Safety inspection on this BOE.
3. Checklist: `Air_VERIFY.csv`. Invoice typo GCCR07 `20g*120pcs` → barcode for **12pcs box** `8809046298684` @ $54.50.

| Item code | Product | Qty | Barcode |
|---|---|---:|---|
| GCMR02 | Skin Defender Lip & Eye Makeup Remover 200ml | 70 | 8809975190530 |
| GCMA10 | Soothing Bomb Sea Algae Mask (Homecare) | 15 | 8809579274179 |
| GCMA14 | Skin Reboot PDRN Mask Pack | 90 | 8809849807809 |
| GCPS02 | SWS Power Solution | 30 | 8809046298653 |
| GCPS05 | CTS Power Solution | 20 | 8809046298677 |
| GCSE13 | Multi Functional Anti-Wrinkle Serum 30ml | 20 | 8809579274704 |
| GCSE14 | Multi Vita Radiance Serum 30ml | 20 | 8809639178614 |
| GCSE03 | Problem Control Serum 30ml | 20 | 8809205624873 |
| GCSE17 | Moisture Replenishing Hyaluron Serum 30ml | 60 | 8809639178775 |
| GCSE05 | All For Sensitive Serum 30ml | 20 | 8809392232035 |
| GCCR44 | Problem Control Cream 50g | 50 | 8800250592247 |
| GCCR23 | Skin Barrier Protecting Cream 100g | 20 | 8809392232066 |
| GCCR09 | Multi Sun Cream SPF40 40g | 50 | 8809205627386 |
| GCCR37 | Ultra Shield Sun Cream SPF50+ 50g | 230 | 8809849803436 |
| GCCR46 | Revita Glow BB #01 Bright 50g | 20 | 8809783013113 |
| GCCR47 | Revita Glow BB #02 Natural 50g | 40 | 8809783013120 |
| GCCR07 | Soothing Repair Postcream 20g×12 | 7 | 8809046298684 |
| GCFO02 | Cushion + Refill #02 Beige | 100 | 8809639176368 |
| GCFO03 | Cushion + Refill #03 Camel | 110 | 8800250590366 |
| GCHR18 | HR³ Matrix Hair Solution Alpha (Professional) | 25 | 8809518823871 |

## Next steps

1. Upload `~/Desktop/16072026/Air.xlsx` to Montaji for core cosmetics.
2. Add tester/sample lines manually (as planned).
3. Receive MoySklad supply when cleared (if PO exists for DM GME 260710 — confirm separately).
4. Book T/T vs invoice USD 13,383 when paid.
