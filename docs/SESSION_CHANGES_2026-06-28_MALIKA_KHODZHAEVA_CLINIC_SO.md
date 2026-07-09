# Dr Malika Khodzhaeva — clinic sales order only (2026-06-28)

**Customer:** Dr Malika Khodzhaeva (`46484521-93c2-11ef-0a80-11430025628d`) — existing, phone 0528238573
**Scripts:**
- `scripts/moysklad-create-malika-khodzhaeva-so-clinic-20260628.js --commit`
- `scripts/moysklad-update-malika-khodzhaeva-so-discounts-20260628.js --commit` (delivery + free masks)

Prices = clinic `salePrice` from `/report/stock/all`.

## Document

| Doc | Number | AED | Link |
|-----|--------|----:|------|
| Sales order | **GENCardM2606288573** | **1820.00** | [order](https://online.moysklad.ru/app/#customerorder/edit?id=c4593895-72d2-11f1-0a80-077700542153) |

**SO only** — invoice / shipment / payment not posted yet.

## Lines (updated)

| Code | Product | Qty | Clinic | Disc | Line |
|------|---------|----:|----:|----:|----:|
| `00024` | Snow O₂ Cleanser 500ml | 1 | 255 | — | 255 |
| `00183` | Problem Control Toner 500 ml | 1 | 245 | — | 245 |
| `00022` | Snow Booster Toner 200ml | 1 | 130 | — | 130 |
| `54460` | Moisture Replenishing Hyaluron Cream 250g | 1 | 210 | — | 210 |
| `00011` | EZ CO₂ MASK Professional Box | 1 | 230 | — | 230 |
| `00015` | Skin Renewal Peeling System (SRS) 1 Vial | 10 | 40.50 | — | 405 |
| `00040` | Intensive Blemish Balm Cream 50g | 1 | 125 | — | 125 |
| `54465` | Soothing Repair Post Cream 100g | 1 | 220 | — | 220 |
| *(service)* | Excellent Delivery Dubai | 1 | 45 | **100%** | **0** |
| `00140` | Soothing Bomb Sea Algae Mask 23g | 1 | 18 | **100%** | **0** |
| `00063` | Intensive Repair Collagen Mask 23g | 1 | 18 | **100%** | **0** |
| `00012` | Peptide Gel Mask 39g | 1 | 38 | **100%** | **0** |
| | | | **Total** | | **1,820** |

## Mapping notes

- **Hyaluron 210g** → `54460` professional **250g** tub (clinic price 210 AED).
- **SRS 10 vials** → `00015` ×10 @ 40.50.
- Delivery + 3 masks at **100% discount** (free gifts, stock still reserved on SO).
