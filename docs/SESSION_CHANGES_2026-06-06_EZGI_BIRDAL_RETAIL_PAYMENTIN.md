# Miss Ezgi Birdal — retail SO → invoice → отгрузка → paymentin (2026-06-06)

## Customer
- **Name:** Miss Ezgi Birdal (existing counterparty — **not** a new "Ezgi Birdal")
- **ID:** `135b8a56-a1c3-11f0-0a80-10310075ebc2`
- **Phone:** 056 990 5756

**Correction (same day):** First run mistakenly created duplicate counterparty "Ezgi Birdal". All four documents were repointed to Miss Ezgi Birdal; duplicate counterparty deleted.

## Lines (genosys.ae retail, VAT incl. — not MoySklad clinic salePrice)
| Code | Product | Qty | Retail | Line |
|------|---------|-----|--------|------|
| 00041 | Multi Sun Cream SPF40/PA++ 40g | 1 | **210.00** | 210.00 |
| 00063 | Intensive Repair Collagen Mask 23g | 1 | **36.00** | 36.00 |
| (service) | Excellent Delivery Dubai | 1 | 45.00 | 45.00 |
| **Total** | | | | **291.00 AED** |

**Price correction:** First run used clinic `salePrice` (105 + 18 = 123 + 45 = 168). Amended same day to genosys.ae retail (210 + 36 + 45 = **291**). Order, invoice, shipment, paymentin all updated.

## Documents created
| Step | Type | Number | ID |
|------|------|--------|-----|
| 1 | Customer order | GENCardM260606EZGI | `b6eac078-61a5-11f1-0a80-0ba60040d3e1` |
| 2 | Invoice | 04630 | `b728802e-61a5-11f1-0a80-08090040b51c` |
| 3 | Shipment (отгрузка) | 06307 | `b7f6b4e3-61a5-11f1-0a80-191f0040f2af` |
| 4 | Incoming payment (paymentin) | 05716 | `b8483b11-61a5-11f1-0a80-1ba100402a8d` |

- Shipment fully paid: **291.00 / 291.00 AED**
- Order state: Доставлен
- Invoice PDF: `~/Desktop/orders/GENOSYS_Miss_Ezgi_Birdal_04630.pdf` (landscape retail template)

## Script
`scripts/moysklad-create-ezgi-birdal-order-invoice-demand-paymentin-20260606.js`
- Uses fixed `AGENT_ID` for Miss Ezgi Birdal (no auto-create)
- PDF saves to `Desktop/orders/` (folder created if missing)
