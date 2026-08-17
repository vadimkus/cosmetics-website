# Miss Nadezhda — retail SO + invoice + shipment (2026-07-14)

## Customer

| | |
|---|---|
| **Name** | Miss Nadezhda (updated from Miss Nadi, same phone) |
| **Phone** | +971521667701 |
| **Address** | Beach Resort, JBR, Tower 1, apt 904, Dubai |
| **ID** | `52990f1a-665c-11f1-0a80-1f27004459e1` |

## Documents

| Doc | Number | Sum | Link |
|---|---|---:|---|
| Sales order | **GENCardM2607146701** | 760.00 AED | [edit](https://online.moysklad.ru/app/#customerorder/edit?id=96baba31-7f73-11f1-0a80-0b990019a0f7) |
| Invoice | **04817** | 760.00 AED | [edit](https://online.moysklad.ru/app/#invoiceout/edit?id=97170c8b-7f73-11f1-0a80-115c0019dfb6) |
| Shipment | **06538** | 760.00 AED | [edit](https://online.moysklad.ru/app/#demand/edit?id=981d1a68-7f73-11f1-0a80-1b4f001ad8c4) |

**PDF:** `~/Desktop/orders/GENOSYS_Miss_Nadezhda_04817.pdf`

No paymentin posted.

## Lines

| Code | Product | Qty | Retail | Disc | Net |
|---|---|---:|---:|---:|---:|
| 00188 | Microbiome Energy Infusing Mist 80ml | 1 | 160.00 | 50% | 80.00 |
| 54473 | Revita Glow BB Cream #02 Natural 50g | 1 | 250.00 | 50% | 125.00 |
| 00194 | Multi Vita Radiance Serum 30ml | 1 | 330.00 | 50% | 165.00 |
| 54458 | Moisture Replenishing Hyaluron Cream 50g | 1 | 290.00 | 50% | 145.00 |
| 54467 | Skin Reboot PDRN mask Pack | 1 | 400.00 | 50% | 200.00 |
| — | Excellent Delivery Dubai | 1 | 45.00 | — | 45.00 |

**Total: 760.00 AED** (updated 2026-07-14 — 50% off products only; delivery not discounted)

## Scripts

- Create: `scripts/moysklad-create-miss-nadezhda-retail-order-invoice-demand-20260714.js --commit`
- 50% discount fix: `scripts/moysklad-fix-miss-nadezhda-50pct-discount-20260714.js --commit`
