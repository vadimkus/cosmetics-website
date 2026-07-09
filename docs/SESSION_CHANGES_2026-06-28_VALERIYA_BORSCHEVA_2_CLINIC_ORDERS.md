# Dr. Valeria Borscheva — 2 clinic full cycles (2026-06-28)

**Customer:** Dr. Valeria Borscheva (`bcdf8073-9b47-11ee-0a80-13620011e787`) — existing, clinic prices, phone 0525829446
**Script:** `scripts/moysklad-create-valeriya-borscheva-2orders-clinic-paymentin-20260628.js --commit`
Prices = clinic `salePrice` from `/report/stock/all` (same basis as her EZ mask order).

## Order 1 — GENCardM2606289446A · 475 AED

| Doc | Number | AED | Link |
|-----|--------|----:|------|
| Order | **GENCardM2606289446A** | 475.00 | [order](https://online.moysklad.ru/app/#customerorder/edit?id=10e89fa6-72c6-11f1-0a80-00c00051aa00) |
| Invoice | **04727** | 475.00 | [invoice](https://online.moysklad.ru/app/#invoiceout/edit?id=1123f30d-72c6-11f1-0a80-012d0053428b) |
| Shipment | **06418** | 475.00 | [demand](https://online.moysklad.ru/app/#demand/edit?id=11daf070-72c6-11f1-0a80-0c520051117a) |
| Payment in | **05824** | 475.00 | [paymentin](https://online.moysklad.ru/app/#paymentin/edit?id=1222281e-72c6-11f1-0a80-012d005342b4) |

| Code | Product | Qty | Clinic | Line |
|------|---------|----:|----:|----:|
| `54457` | Ultra Shield Sun Cream SPF50 50g | 1 | 125 | 125 |
| `00144` | Skin Caring BB Cushion #2 Beige | 1 | 150 | 150 |
| `54467` | Skin Reboot PDRN Mask Pack | 1 | 200 | 200 |
| | | | **Total** | **475** |

## Order 2 — GENCardM2606289446B · 1,535 AED (3 lines 100% off)

| Doc | Number | AED | Link |
|-----|--------|----:|------|
| Order | **GENCardM2606289446B** | 1535.00 | [order](https://online.moysklad.ru/app/#customerorder/edit?id=16c5d473-72c6-11f1-0a80-1b04005209ec) |
| Invoice | **04728** | 1535.00 | [invoice](https://online.moysklad.ru/app/#invoiceout/edit?id=17076cd1-72c6-11f1-0a80-113c00514b55) |
| Shipment | **06419** | 1535.00 | [demand](https://online.moysklad.ru/app/#demand/edit?id=17ae3c2a-72c6-11f1-0a80-04a90050cb66) |
| Payment in | **05825** | 1535.00 | [paymentin](https://online.moysklad.ru/app/#paymentin/edit?id=1809ed6f-72c6-11f1-0a80-089b0050f0fc) |

| Code | Product | Qty | Clinic | Disc | Line |
|------|---------|----:|----:|----:|----:|
| `00059` | EyeCell Eye Zone Care Kit (box) | 1 | 490 | – | 490 |
| `00030` | All For Sensitive Serum 30ml | 1 | 165 | – | 165 |
| `54457` | Ultra Shield Sun Cream SPF50 50g | 4 | 125 | – | 500 |
| `00189` | Skin Rescue Overnight Cream Mask 100g | 1 | 170 | – | 170 |
| `00034` | Multi Functional Anti-Wrinkle Cream **250g** | 1 | 210 | – | 210 |
| `00140` | Soothing Bomb Sea Algae Mask 23g | 1 | 18 | 100% | 0 |
| `00063` | Intensive Repair Collagen Mask 23g | 1 | 18 | 100% | 0 |
| *(service)* | Excellent Delivery Dubai | 1 | 45 | 100% | 0 |
| | | | **Total** | | **1,535** |

Both shipments verified `payedSum` = `sum` (fully paid); orders set to **Delivered**.

## PDFs

- `~/Desktop/orders/GENOSYS_Valeriya_Borscheva_04727.pdf`
- `~/Desktop/orders/GENOSYS_Valeriya_Borscheva_04728.pdf`

## Notes

- "Anti-wrinkle cream 250 ml" mapped to `00034` Multi Functional Anti-Wrinkle Cream **250g** (professional size); the 50g homecare is `00190`.
- Order 1 had no delivery line in the request, so none was added.
- Sea algae + collagen masks + delivery in order 2 booked at full clinic price with 100% discount → line total 0 (kept on the invoice as gifts, stock still moves).
- Probe used: `scripts/moysklad-probe-borscheva-products-20260628.js`.
