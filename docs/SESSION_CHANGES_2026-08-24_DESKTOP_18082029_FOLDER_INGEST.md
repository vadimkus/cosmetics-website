# Desktop folder `18082029` — DM GME 260810 ingest — 2026-08-24

**Source folder:** `/Users/vadimkus/Desktop/18082029/`  
**Shipment:** Korea air import **DM GME 260810** (invoice 2026-08-18 → AWB 2026-08-22 → BOE 2026-08-24)  
**Buyer:** GENOSYS Middle East FZ-LLC, Cordoba Residences, Knowledge Village, Dubai  
**Supplier:** DTS MG Co., LTD, Seoul  
**Broker:** CP WORLD LLC (BOE)

## Airway bill

| Field | Value |
|---|---|
| **MAWB** | **176-2056-4025** (`17620564025`) |
| **Date** | **22 Aug 2026** |
| **Carrier** | Emirates **EK323** ICN → DXB |
| **Packages** | **13** (9 × 45×45×35 + 4 × 45×45×25) |
| **Weight** | **175 kg** (packing list 173.92 kg) |
| **Freight** | Prepaid (PP) |
| **Invoice on AWB** | DM GME 260810 |
| **HS** | 3304.99 |
| **Agent** | JS International Korea |

## Customs / BOE

| Field | Value |
|---|---|
| **Declaration** | **101-01485535-26** (file `1010148553526.pdf`) |
| **BOE date** | **24 Aug 2026** |
| **Packages / weight** | 13 / 175 kg |
| **Invoice USD** | **4,709.00** (BOE split: rollers **240** + cosmetics **4,469**) |
| **AED CIF-ish total** | **17,293.80** @ 3.6725 |
| **Duty** | 985 AED + fees (RGCH 50 / KDID 20 / ARCH 5) |
| **Inspection** | MOHAP (rollers) + **DM Health & Safety** (cosmetics) |

## Folder files

| File | Purpose |
|---|---|
| `AIRbill.pdf` | Emirates MAWB **176-2056-4025** |
| `1010148553526.pdf` | Bill of entry / declaration **101-01485535-26** |
| `DELIVERY ORDER.pdf` | DNATA delivery order (image-only scan) |
| `DM GME 260810_Shipping Invoice.pdf` | Commercial/shipping invoice — **USD 4,709** / **2,644 units** |
| `DM GME 260810_Shipping Invoice (value).pdf` | Value version of same invoice |
| `DM GME 260810_Commercial Invoice.pdf` | Same invoice dated 2026-08-18 |
| `DM GME 260810_Packing list.pdf` | **2,644 units**, **0.840 CBM**, **173.92 kg** |

## Invoice snapshot

**Paid commodity (core + priced testers/marketing):** USD **4,709.00** ✓  
**Units (all lines including FOC / Derma extras):** **2,644**

Notable sellable:
- Cushion Beige **100**
- Collagen mask **300**
- Roller 0.5 mm **30**
- Hydro Cool Modeling Mask **30**, Sea algae homecare **30**
- PDRN Homecare 5000 **30**, USC SPF50 **30**, MSC SPF40 **20**
- HR³ Hair Solution Alpha **10**

Large FOC block marked **Dubai Derma Exhibition — NOT FOR SALE** (catalogues, leaflets, extra testers, trial kit).

Normalized CSV (value-PDF prices): `docs/DM_GME_260810_Shipping_Invoice_normalized.csv`

## DM import fee (same day)

Paymentout **00685** / **70 AED** — **CPIP-240826-087435** / voucher **RSSFYS202600631895**. See `docs/SESSION_CHANGES_2026-08-24_DM_IMPORT_FEE_CPIP_240826.md`.

## Next

PO **DM GME 260810** booked 25 Aug (`418b0120-a05c-11f1-0a80-0bb40027d136`), positions in transit. Receive supply vs that PO when cargo is released; book T/T vs USD 4,709 if not already paid. See `docs/SESSION_CHANGES_2026-08-25_DM_GME_260810_PO.md`.
