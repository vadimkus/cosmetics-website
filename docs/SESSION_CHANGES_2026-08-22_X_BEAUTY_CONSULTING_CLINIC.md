# X Beauty Consulting — clinic basket (2026-08-22)

**Customer:** X BEAUTY CONSULTING - F.Z.C `03c174b0-4581-11ea-0a80-01f80012b189`  
**Script:** `scripts/moysklad-create-x-beauty-consulting-clinic-20260822.js --commit`

Clinic list. Unpaid. Chain: SO → INV → SHIP (invoice-only). SO **Доставлен - Ждем оплату**.

Mist qty was blank on the request — posted **×1**.

## Update — item 6 swap (same day)

Dropped `54475` Homecare 5000 @150. Added `54467` Skin Reboot PDRN mask Pack ×1 @200 clinic. Total **900 → 950**.

Script: `scripts/moysklad-amend-xbc-04963-pdrn-mask-20260822.js --commit`

| Line | Qty | Unit | Sum |
|------|----:|-----:|----:|
| 54461 Skin Defender Remover 200ml | 1 | 145 | 145 |
| 00021 Snow O₂ Cleanser 180ml | 1 | 165 | 165 |
| 00188 Microbiome Mist 80ml | 1 | 80 | 80 |
| 00122 Multi-Vita Radiance Cream 50g | 1 | 145 | 145 |
| 00189 Overnight Cream Mask 100g | 1 | 170 | 170 |
| 54467 Skin Reboot PDRN mask Pack | 1 | 200 | 200 |
| Delivery Dubai | 1 | 45 | 45 |
| **Total** | | | **950 AED** |

| Doc | Number | Sum | ID |
|-----|--------|----:|----|
| SO | **GENCardM260822XBC** | 950 | `af2ffaad-9e1a-11f1-0a80-14c1005d37fc` |
| Invoice | **04963** | 950 unpaid | `af8ced8a-9e1a-11f1-0a80-1eb700600be5` |
| Shipment | **06725** | 950 | `b0700c34-9e1a-11f1-0a80-1a67005f4a97` |

Ship: Office - BLV - 6F - SF60836, Ajman Boulevard-A Building, Ajman (`addInfo` empty).

PDF: `~/Desktop/orders/GENOSYS_X_Beauty_Consulting_04963.pdf`  
Not printed.

## Update — paymentin 22 Aug 2026

Full bank paymentin **06110** / **950 AED** linked to SHIP **06725**. SO → **Доставлен**.

| Doc | Number | Sum | Status |
|-----|--------|----:|--------|
| Paymentin | **06110** | 950 | posted |
| Order | **GENCardM260822XBC** | 950 | **Доставлен** |
| Invoice | **04963** | 950 | paid |
| Shipment | **06725** | 950 | paid |

https://online.moysklad.ru/app/#paymentin/edit?id=ea8025c7-9e52-11f1-0a80-1360006f63e9

Script: `scripts/moysklad-create-xbc-paymentin-04963-20260822.js --commit`
