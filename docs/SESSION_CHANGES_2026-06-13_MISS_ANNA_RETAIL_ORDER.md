# Miss Anna — retail order + invoice + shipment (2026-06-13)

## Customer

| | |
|---|---|
| **Name** | Miss Anna |
| **Phone** | +971589863623 |
| **Address** | Al Qusais industrial area 5, BlueDiamond building 704, Dubai |
| **Counterparty** | `98a6f84e-46ea-11f1-0a80-03cb00049ccc` (existing) |

## Documents

| Doc | Number | Sum | Link |
|-----|--------|----:|------|
| Order | **GENCardM2606133623** | 345.00 | [order](https://online.moysklad.ru/app/#customerorder/edit?id=9fb0dbf6-672d-11f1-0a80-009900667847) |
| Invoice | **04665** | 345.00 | [invoice](https://online.moysklad.ru/app/#invoiceout/edit?id=9feb2796-672d-11f1-0a80-16d900643041) |
| Shipment | **06349** | 345.00 | [demand](https://online.moysklad.ru/app/#demand/edit?id=a0832a85-672d-11f1-0a80-16d900643066) |

## Lines

| Code | Product | Qty | Unit | Line |
|------|---------|----:|-----:|-----:|
| `00144` | BB Cushion #2 Beige | 1 | 300.00 | 300.00 |
| *(service)* | Excellent Delivery Dubai | 1 | 45.00 | 45.00 |
| | | | **Total** | **345.00** |

VAT incl. · PDF → `~/Desktop/orders/GENOSYS_Miss_Anna_04665.pdf`

## Script

`scripts/moysklad-create-miss-anna-order-invoice-demand-20260613.js`
