# Miss Laura Abizova — retail order — 05-Jul-2026

**Script:** `scripts/moysklad-create-laura-abizova-retail-order-invoice-demand-20260705.js --commit`

## Customer

| Field | Value |
|-------|-------|
| Name | Miss Laura Abizova |
| ID | `a90bd5e1-7580-11ef-0a80-18b7002017fc` |
| Phone | +971503596596 |
| Ship | Al Zhahiya Street, Waterfront Towers, Tower A, apartment 509, Abu Dhabi |

## Order lines (retail, VAT incl.)

| Code | Product | Qty | Price |
|------|---------|----:|------:|
| 00195 | Moisture Replenishing Hyaluron Serum 30ml | 1 | 330 |
| 54471 | HR³ Matrix Scalp Brush | 1 | 50 |
| 00035 | Intensive Problem Control Cream 50g | 1 | 290 |
| 00052 | HR³ Scalp & Hair Shampoo 300ml | 1 | 340 |
| 00144 | Cushion #2 Beige | 1 | 300 |
| | **Total** | **5** | **1,310 AED** |

Delivery Abu Dhabi: **FREE** (order > 1,000 AED — no delivery line).

## Documents

| Doc | Number | ID | Amount |
|-----|--------|----|-------:|
| Sales order | GENCardM2607059596 | `968fa8d2-786f-11f1-0a80-1148005d1576` | 1,310 |
| Invoice | **04769** | `96c78c35-786f-11f1-0a80-04b6005ab0c1` | 1,310 |
| Shipment | **06480** | `97664408-786f-11f1-0a80-0b5500592da3` | 1,310 |
| Payment in | **05890** | `e3872bbb-786f-11f1-0a80-0556005af26e` | 1,310 |

**Script (payment + print):** `scripts/moysklad-create-laura-abizova-paymentin-reprint-04769-20260705.js --commit`

## PDF

- `~/Desktop/orders/GENOSYS_Laura_Abizova_04769.pdf` (retail invoice template)
- Reprinted + sent to **EPSON_L3260_Series** via `lp` (2026-07-05)

## Links

- [Order GENCardM2607059596](https://online.moysklad.ru/app/#customerorder/edit?id=968fa8d2-786f-11f1-0a80-1148005d1576)
- [Invoice 04769](https://online.moysklad.ru/app/#invoiceout/edit?id=96c78c35-786f-11f1-0a80-04b6005ab0c1)
- [Shipment 06480](https://online.moysklad.ru/app/#demand/edit?id=97664408-786f-11f1-0a80-0b5500592da3)
- [Payment 05890](https://online.moysklad.ru/app/#paymentin/edit?id=e3872bbb-786f-11f1-0a80-0556005af26e)

## Notes

- Duplicate counterparty `b6af6514-e80a-11ee-0a80-080b00038ad1` exists — this order uses **`a90bd5e1…`** (Abu Dhabi address, matches prior invoice 04001).
- Paymentin **05890** posted 1,310.00 AED → shipment **06480** fully paid; order **Доставлен**.
