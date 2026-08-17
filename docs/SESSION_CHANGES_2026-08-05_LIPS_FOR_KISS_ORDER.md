# Lips for Kiss Clinic — order 1 SO + invoice + shipment (2026-08-05)

**Customer:** Lips for Kiss Clinic (`9038b70d-c52f-11f0-0a80-0bc5000a2226`)  
**Script:** `scripts/moysklad-create-lips-for-kiss-order-invoice-demand-20260805.js --commit`

| Doc | Number | Sum |
|-----|--------|----:|
| SO | **GENCardM260805LFK** | **7,095.00** |
| Invoice | **04894** | **7,095.00** |
| Shipment | **06640** | **7,095.00** |

| Code | Product | Qty | Unit | Line |
|------|---------|----:|-----:|-----:|
| 00041 | Multi Sun SPF40/PA++ | **5** | 105 | **525** |
| 54458 | Hyaluron Cream 50g | 5 | 145 | 725 |
| 00054 | Eye Contour Serum | 5 | 185 | 925 |
| 00055 | Eye Contour Cream | 5 | 185 | 925 |
| 00022 | Snow Booster 200ml | 5 | 130 | 650 |
| 00021 | Snow O₂ 180ml | 5 | 165 | 825 |
| 00038 | Post Cream 20g | 10 | 102 | 1,020 |
| 00144 | Cushion Beige | 5 | 150 | 750 |
| 54464 | Cushion Camel | 5 | 150 | 750 |

**Amend 2026-08-05:** SPF40 `00041` qty 10 → **5**. Script: `moysklad-amend-lips-for-kiss-order1-spf40-qty5-20260805.js`.

**Cleanup 2026-08-05 evening:** deleted duplicate 7,620 chain (`GENCardM260805LFK1` / inv `04894` / dem `06640`); renumbered keepers so order1 is now inv **04894** / dem **06640**. Script: `moysklad-delete-lips-for-kiss-7620-renumber-20260805.js`.

PDF: `~/Desktop/orders/GENOSYS_Lips_for_Kiss_04894.pdf`

---

## Order 2

**Script:** `scripts/moysklad-create-lips-for-kiss-order2-invoice-demand-20260805.js --commit`

| Doc | Number | Sum |
|-----|--------|----:|
| SO | **GENCardM260805LFK2** | 1,520.00 |
| Invoice | **04895** | 1,520.00 |
| Shipment | **06641** | 1,520.00 |

| Code | Product | Qty | Unit | Line |
|------|---------|----:|-----:|-----:|
| 00021 | Snow O₂ 180ml | 3 | 165 | 495 |
| 54458 | Hyaluron Cream 50g | 3 | 145 | 435 |
| 00129 | EPI Peeling Gel | 1 | 125 | 125 |
| 00143 | Cushion Ivory | 1 | 150 | 150 |
| 00041 | Multi Sun SPF40 | 3 | 105 | 315 |

PDF: `~/Desktop/orders/GENOSYS_Lips_for_Kiss_04895.pdf`  
(Renumbered from 04896/06642 after deleting the 7,620 duplicate chain.)
