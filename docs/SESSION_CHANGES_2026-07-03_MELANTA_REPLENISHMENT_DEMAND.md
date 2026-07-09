# Melanta Poly Clinic — replenishment demand (2026-07-03)

**Customer:** Melanta Poly Clinic L.L.C · **contract 14**
**Script:** `scripts/moysklad-create-melanta-replenishment-demand-20260703.js --commit`

## Lines

| Code | Product | Qty | Unit (AED) | Line |
|------|---------|----:|-----------:|-----:|
| `00144` | Skin Caring Blemish Balm Cushion #2 Beige | 4 | 150.00 | 600.00 |
| `54475` | BIO-MESO PDRN Homecare Ampoule 5000 | 2 | 150.00 | 300.00 |
| `54484` | CERABARRIER Biome Gel Cleanser 200ml | 2 | 190.00 | 380.00 |
| | | | **Total** | **1,280.00** |

Note: initially posted as Expert 60000 (`54470`); corrected to Homecare 5000 (`54475`) same day.

## Posted

- Demand **06469** — **1,280.00 AED** · state Отгружен
- [Open in MoySklad](https://online.moysklad.ru/app/#demand/edit?id=2693ebea-76f6-11f1-0a80-1c6d00226868)

## PDF

`~/Desktop/orders/GENOSYS_Melanta_06469_Consignment_Stock_Note.pdf`

Re-export: `node --import dotenv/config scripts/moysklad-export-melanta-consignment-stock-note.js 06469`
