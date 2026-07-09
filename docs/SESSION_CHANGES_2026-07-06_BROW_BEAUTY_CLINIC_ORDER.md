# BROW AND BEAUTY AESTHETIC CLINIC L.L.C — new customer + PO (2026-07-06)

**Customer:** BROW AND BEAUTY AESTHETIC CLINIC L.L.C (`30c42b43-7913-11f1-0a80-04b600753af5`)  
**License:** 1582255 (exp 11/12/2026) | DCCI 659950 | Register 2770128  
**Phone:** +971585717075 | **Email:** jdurazov@gmail.com  
**Address:** Villa No. 266, Jumeira First, Dubai  
**Script:** `scripts/moysklad-create-brow-beauty-clinic-order-20260706.js --commit`  
**Counterparty layout:** `scripts/moysklad-update-brow-beauty-counterparty-face-room-20260706.js --commit`

## Counterparty fields (Face Room pattern)

| Field | Value | Purpose |
|-------|-------|---------|
| `email` | `1582255` | License # on PROFORMA / invoice |
| `fax` | `1582255` | License # on consignment stock note |
| `legalAddress` / `actualAddress` | UAE, Villa No. 266, Jumeira First, Dubai | Single-line address (no duplicate) |
| `legalAddressFull.comment` | *(empty)* | No VAT TRN on trade license |
| `description` | Contact `jdurazov@gmail.com`, DCCI/Reg | Real email not in `email` field |

Reference: **FACE ROOM BEAUTY SALON CO** (`12b051b0-4e21-11ee-0a80-063e000814cc`).

## Sales order

| Doc | Number | AED | Status |
|-----|--------|----:|--------|
| Sales order | **GENCardM260706BBAC** | 17,885.00 | Новый |

- [Order GENCardM260706BBAC](https://online.moysklad.ru/app/#customerorder/edit?id=31dc1301-7913-11f1-0a80-1e2300783264)
- [Counterparty](https://online.moysklad.ru/app/#company/edit?id=30c42b43-7913-11f1-0a80-04b600753af5)

## Lines (clinic list prices, VAT included)

| Code | Product | Qty | Unit | Line |
|------|---------|----:|-----:|-----:|
| 00037 | Skin Barrier Protecting Cream 100g | 5 | 225.00 | 1,125.00 |
| 00188 | Microbiome Energy Infusing Mist 80ml | 5 | 80.00 | 400.00 |
| 00144 | Cushion #2 Beige | 10 | 150.00 | 1,500.00 |
| 54464 | Cushion #3 Camel | 10 | 150.00 | 1,500.00 |
| 54467 | PDRN mask Pack (30 sheets) | 30 | 200.00 | 6,000.00 |
| 00035 | Problem Control Cream 50g | 10 | 145.00 | 1,450.00 |
| 54457 | Ultra Shield SPF50 50g | 10 | 125.00 | 1,250.00 |
| 00041 | Multi Sun Cream SPF40 40g | 5 | 105.00 | 525.00 |
| 54473 | Revita Glow BB #02 Natural | 5 | 125.00 | 625.00 |
| 54472 | Revita Glow BB #01 Bright | 5 | 125.00 | 625.00 |
| 00140 | Sea Algae Mask 23g | 20 | 18.00 | 360.00 |
| 00063 | Collagen Mask 23g | 20 | 18.00 | 360.00 |
| 00021 | Snow O₂ Cleanser 180ml | 5 | 165.00 | 825.00 |
| 00053 | EyeCell Eye Peptide Gel Patch (box) | 5 | 190.00 | 950.00 |
| 00022 | Snow Booster Toner 200ml | 3 | 130.00 | 390.00 |
| | | | **Total** | **17,885.00** |

## Notes

- **PDRN** → `54467` × **30 packs** (corrected 2026-07-06; was 1 pack). Script: `scripts/moysklad-update-brow-beauty-pdrn-qty-20260706.js`.
- **Booster** → qty **3** per user request (not 5).
- PO only — no invoice/shipment/payment yet.
- **PDF:** `~/Desktop/orders/GENOSYS_Brow_and_Beauty_GENCardM260706BBAC.pdf` (PROFORMA export).
- **License:** `~/Desktop/orders/Brow_and_Beauty_License_1582255.png`
- Source: Dubai DET commercial license (Poly Clinic, LLC-SO).
