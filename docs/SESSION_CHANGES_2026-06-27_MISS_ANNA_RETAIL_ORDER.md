# Miss Anna — full retail cycle (2026-06-27)

Repeat of the 2026-06-13 order (same customer, same items), this time the **full cycle including payment**.

## Customer

| | |
|---|---|
| **Name** | Miss Anna |
| **Phone** | +971 50 505 1583 |
| **Address** | Al Qusais industrial area 5, BlueDiamond building 704, Dubai |
| **Counterparty** | `98a6f84e-46ea-11f1-0a80-03cb00049ccc` (existing, reused) |

## Documents (order → invoice → shipment → paymentin)

| Doc | Number | Sum | Link |
|-----|--------|----:|------|
| Order | **GENCardM2606271583** | 345.00 | [order](https://online.moysklad.ru/app/#customerorder/edit?id=471edd34-723a-11f1-0a80-152200401b05) |
| Invoice | **04726** | 345.00 | [invoice](https://online.moysklad.ru/app/#invoiceout/edit?id=476672ba-723a-11f1-0a80-00c0003fc9ae) |
| Shipment | **06417** | 345.00 | [demand](https://online.moysklad.ru/app/#demand/edit?id=481fe3de-723a-11f1-0a80-1787004192fd) |
| Payment in | **05823** | 345.00 | [paymentin](https://online.moysklad.ru/app/#paymentin/edit?id=486ce194-723a-11f1-0a80-1da60040c614) |

Shipment `payedSum` verified **345.00 / 345.00** — fully paid. Order set to **Delivered**.

## Lines

| Code | Product | Qty | Unit | Line |
|------|---------|----:|-----:|-----:|
| `00144` | Genosys Skin Caring Blemish Balm Cushion #2 Beige | 1 | 300.00 | 300.00 |
| *(service)* | Excellent Delivery Dubai | 1 | 45.00 | 45.00 |
| | | | **Total** | **345.00** |

VAT incl. · Payment to bank account · PDF → `~/Desktop/orders/GENOSYS_Miss_Anna_04726.pdf`

## Script

`scripts/moysklad-create-miss-anna-order-invoice-demand-paymentin-20260627.js`

## Notes

- The 2026-06-13 doc recorded the phone as +971589863623; the actual MoySklad record holds **+971 50 505 1583** (matches the latest invoice screenshot). No phone change was needed.
- Same Beige BB cushion code `00144` as the prior order. Stock checked before posting.
