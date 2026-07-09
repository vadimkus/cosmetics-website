# Desktop folder `26062026` — full ingest — 2026-06-26

**Source folder:** `/Users/vadimkus/Desktop/26062026/`  
**Shipment:** Korea air import **DM GME 260616** (Jun-16 order → Jun-23 commercial invoice → Jun-29 dispatch)  
**Customs declaration:** **1010113202326**  
**CPIP (DM pre-clearance):** **CPIP-160626-081300**
**Buyer:** GENOSYS Middle East FZ-LLC → Cordoba Residences, Knowledge Village, Dubai  
**Supplier:** DTS MG Co., LTD, Seoul  
**Customs broker:** CP WORLD LLC — DCL 745 (Calogi)  
**Related MoySklad PO:** `DM GME 260616 ship` — see [SESSION_CHANGES_2026-06-23_KOREA_PO_DM_GME_260616_SHIPPING.md](./SESSION_CHANGES_2026-06-23_KOREA_PO_DM_GME_260616_SHIPPING.md)

## Folder contents (9 files)

| File | Type | Purpose |
|---|---|---|
| `DM GME 260616_Shipping Invoice.pdf` | Commercial invoice | **38 lines**, USD **15,098.80**, dated **2026-06-23** |
| `DM GME 260616_Packing list.pdf` | Packing list | **23 cartons**, **1,618 units**, **324.36 kg**, **1.299 CBM** |
| `CHECK AWB 607-5410 8224.PDF` | Air waybill | MAWB **607-54108224**, Etihad Crystal Cargo, ICN→AUH→DXB, dispatch **2026-06-29**, freight prepaid |
| `AUTH_letter_PC.pdf` | Signed authorization | DNATA clearance auth for **CP WORLD LLC DCL 745**, dated **2026-06-29**, signed Vadim Sagatdinov |
| `DNATA ALL STAFF -.docx` | Letter template | Same auth text (unsigned blanks for name/designation) + CP staff ID list |
| `Codes.xlsx` | Barcode lookup | **128 rows** — Product Name + Barcode (trimmed export catalogue) |
| `Air.xlsx` | Montaji consignment | Template populated — **18 cosmetic lines** for Montaji upload (see below) |
| `screen.png` | Qty screenshot | Source list for Montaji subset (18 products + quantities) |

## Normalized outputs (repo)

| File | Lines | Description |
|---|---:|---|
| `docs/DM_GME_260616_Shipping_Invoice_normalized.csv` | 38 | Full invoice: item code, product, qty, unit, USD price/amount, MFG/LOT, barcode |
| `docs/DM_GME_260616_Montaji_Consignment_normalized.csv` | 18 | Montaji subset: item code, product, qty, barcode |

**Invoice total check:** CSV recalc **USD 15,098.80** ✓ (matches PDF footer)

## Air waybill (607-54108224)

| Field | Value |
|---|---|
| Shipper | DTS MG Co., LTD, Seoul |
| Consignee | GENOSYS Middle East FZ-LLC, Cordoba Residences, Dubai |
| Agent | Korea Total Logistics Co., Ltd. |
| Carrier | Etihad (EY823 ICN→AUH, EY→DXB) |
| Commodity | Skincare cosmetics HS **3304.99.1000** |
| Dispatch | **29 Jun 2026** |
| Packages | **23** |
| Freight | Prepaid (PP) |
| **Declaration number** | **1010113202326** |

## Montaji consignment (`Air.xlsx` — 18 lines)

Populated from `screen.png` → barcodes from export orderform / `Codes.xlsx`.  
Columns: **A** = Product ID/Barcode, **B** = Items Quantity (rows 3–20).

| Item code | Product | Qty | Barcode |
|---|---|---:|---|
| GCCL02 | SNOW O₂ Cleanser 500ml | 40 | 8809205630263 |
| GCCL05 | CERABARRIER Biome Gel Cleanser 200ml | 98 | 8809849809834 |
| GCCL06 | CERABARRIER Biome Gel Cleanser 600ml | 30 | 8809849809841 |
| GCTN01 | Snow Booster Toner 200ml | 80 | 8809205628642 |
| GCTN02 | Snow Booster Toner 1000ml | 20 | 8809205630256 |
| GCTN03 | Intensive Problem Control Toner 200ml | 30 | 8809579274438 |
| GCMA05 | Hydro Cool Modeling Mask | 10 | 8809392232011 |
| GCMA09 | Soothing Bomb Sea Algae Mask (bulk) | 3 | 8809579273974 |
| GCMA06 | Intensive Repair Collagen Mask | 300 | 8809392232042 |
| GCPS05 | CTS Power Solution | 6 | 8809046298677 |
| GCMA01 | CO₂ Face Mask Kit | 50 | 8809205627355 |
| GCMA11 | Skin Rescue Overnight Cream Mask 100g | 20 | 8809639177464 |
| GCAP02 | Bio-Meso PDRN Expert Ampoule 60000 | 110 | 8809849808189 |
| GCAP01 | Bio-Meso PDRN Homecare Ampoule 5000 | 80 | 8809849808110 |
| GCCR07 | Soothing Repair Postcream 20g×12 | 10 | 8809046298684 |
| GCCR43 | Soothing Repair Postcream 100g | 40 | 8809367898143 |
| GCFO02 | Cushion + Refill #02 Beige | 100 | 8809639176368 |
| GCEC00 | EyeCell Kit | 10 | 8809046298035 |

**Note:** Montaji file covers the **cosmetic customs subset only**. Rollers, Hairgen, sample sachets, bags, etc. are on the full invoice but not in this Montaji upload.

## Invoice lines NOT in Montaji (20 lines)

Rollers/stamps (GRFS150, GRME025), Snow O₂ 180ml (GCCL01), Hairgen + hairstamp (GAHR01, CCVS03), non-woven bags (GMAC05), all promotional/sample SKUs (GCCL03, GCCR42/48/49/20/22, GCSP-CB01, GCSE18, GCCR41, GCSE16, GCCR24, GCEX02, GCMA12, GCHR21).

Sample/promo lines have **no retail barcodes** in the export orderform (marketing-material SKUs) — Montaji may need Montaji Product IDs instead if those are declared separately.

## Packing list summary

- **23 cartons** (mixed 45×45×25 and 45×45×35 cm)
- **Total weight:** 324.36 kg | **CBM:** 1.299
- Largest single lines by carton: Collagen mask 300 pcs (cartons 14–15), Cushion Beige 100 box (carton 17), Bio-Meso Expert 110 box (split cartons 7+15)

## DNATA authorization

- **AUTH_letter_PC.pdf** — signed, dated 29.06.2026, authorizes CP WORLD LLC DCL 745 for DO collection + clearance
- **CP representatives:** Qaseer, Tajudheen Anjillath, Mohamed Farooq, Sanjay Katkam, Avinasha Naik (Emirates IDs in letter)
- **DNATA ALL STAFF -.docx** — unsigned template (same body text)

## Codes.xlsx (folder copy)

Simplified **128-product** barcode table (Product Name | Barcode) — same trim as `~/Desktop/Exer/Codes.xlsx`. Master reference remains `docs/GENOSYS_Export_Orderform_Codes_2026_normalized.csv` (184 lines incl. marketing/LED).

## Cross-references

- CPIP / DM import fee: [SESSION_CHANGES_2026-06-16_DM_IMPORT_FEE_CPIP_160626.md](./SESSION_CHANGES_2026-06-16_DM_IMPORT_FEE_CPIP_160626.md)
- MOFA attestation: [SESSION_CHANGES_2026-06-21_MOFA_ATTESTATION_260616.md](./SESSION_CHANGES_2026-06-21_MOFA_ATTESTATION_260616.md)
- MoySklad PO posted: [SESSION_CHANGES_2026-06-23_KOREA_PO_DM_GME_260616_SHIPPING.md](./SESSION_CHANGES_2026-06-23_KOREA_PO_DM_GME_260616_SHIPPING.md)

## Next steps

1. Upload `Air.xlsx` to Montaji / Calogi for cosmetic consignment clearance.
2. Submit signed `AUTH_letter_PC.pdf` to DNATA (CP WORLD DCL 745 account).
3. Receive MoySklad supply against **`DM GME 260616 ship`** when cargo lands (~Jul 2026).
4. Book supplier T/T payment (USD 15,098.80 → ~55,453 AED @ 3.6725).
5. **Done 2026-07-02:** `HS CODE SUMMERY SHEET  - 2 (1).xlsx` populated — see [SESSION_CHANGES_2026-07-02_HS_CODE_SUMMARY_DM_GME_260616.md](./SESSION_CHANGES_2026-07-02_HS_CODE_SUMMARY_DM_GME_260616.md)
