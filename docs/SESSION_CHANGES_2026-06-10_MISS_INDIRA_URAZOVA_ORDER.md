# Miss Indira Urazova — retail SO + invoice + shipment (2026-06-10)

**Customer:** Miss Indira Urazova (`a9accc82-64e2-11f1-0a80-1ba800250eb6`)  
**Phone:** +971585922075  
**Address:** Arabian Ranches, Mirador St 1, Villa 75, Dubai

## Created documents

| Doc | Number | Sum (AED) | ID |
|-----|--------|----------:|-----|
| Order | **GENCardM2606102075** | 966.00 | `ac23363e-64e2-11f1-0a80-17c40024c598` |
| Invoice | **04652** | 966.00 | `ac783f9c-64e2-11f1-0a80-0c0300257d59` |
| Shipment | **06336** | 966.00 | `ad4f0df1-64e2-11f1-0a80-082000247a1b` |

- [Order](https://online.moysklad.ru/app/#customerorder/edit?id=ac23363e-64e2-11f1-0a80-17c40024c598)
- [Invoice](https://online.moysklad.ru/app/#invoiceout/edit?id=ac783f9c-64e2-11f1-0a80-0c0300257d59)
- [Shipment](https://online.moysklad.ru/app/#demand/edit?id=ad4f0df1-64e2-11f1-0a80-082000247a1b)

**PDF:** `~/Desktop/orders/GENOSYS_Miss_Indira_Urazova_04652.pdf`

Pricing: **clinic list** (MoySklad `salePrice`, VAT incl.). No delivery line.

## Lines

| Code | Product | Qty | Unit | Line |
|------|---------|----:|-----:|-----:|
| `00144` | Blemish Balm Cushion #2 Beige | 2 | 150.00 | 300.00 |
| `54467` | Skin Reboot PDRN mask Pack | 1 | 200.00 | 200.00 |
| `54457` | Ultra Shield Sun Cream SPF50 50g | 1 | 125.00 | 125.00 |
| `00188` | Microbiome Energy Infusing Mist 80ml | 1 | 80.00 | 80.00 |
| `00140` | Soothing Bomb Sea Algae Mask 23g | 1 | 18.00 | 18.00 |
| `00063` | Intensive Repair Collagen Mask 23g | 1 | 18.00 | 18.00 |
| `00037` | Skin Barrier Protecting Cream 100g | 1 | 225.00 | 225.00 |

## Script

`scripts/moysklad-create-miss-indira-urazova-order-invoice-demand-20260610.js`

```bash
node --import dotenv/config scripts/moysklad-create-miss-indira-urazova-order-invoice-demand-20260610.js
node --import dotenv/config scripts/moysklad-create-miss-indira-urazova-order-invoice-demand-20260610.js --commit
```
