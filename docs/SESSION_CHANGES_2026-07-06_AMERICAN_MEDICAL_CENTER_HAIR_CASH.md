# American Medical Center DMCC — HR3 hair order, cash paid (2026-07-06)

**Customer:** AMERICAN MEDICAL CENTER DMCC (`cf16d027-17b1-11f1-0a80-1a7d000b8fe4`)  
**Phone:** 052 641 0764  
**Address:** Jumeirah Lakes Towers 101, First Floor Red Diamond Building, Opposite to Cluster Y — Dubai  
**Script:** `scripts/moysklad-create-american-medical-center-hair-order-invoice-demand-cashin-20260706.js --commit`

Completes PO **GENCardM260701AMC** (created 2026-07-01) — invoice + shipment + cash.

## Chain

| Doc | Number | AED | Status |
|-----|--------|----:|--------|
| Sales order | **GENCardM260701AMC** | 335.00 | **Доставлен** (restored from trash 2026-07-06) |
| Invoice | **04772** | 335.00 | paid |
| Shipment | **06483** | 335.00 | paid |
| Cash in | **00175** | 335.00 | linked to 06483 |

- [Order GENCardM260701AMC](https://online.moysklad.ru/app/#customerorder/edit?id=8c7b1cf1-7541-11f1-0a80-0c5e001c5941) — **Доставлен**
- [Invoice 04772](https://online.moysklad.ru/app/#invoiceout/edit?id=ce88ea88-790c-11f1-0a80-1a690074e21e)
- [Shipment 06483](https://online.moysklad.ru/app/#demand/edit?id=cf76c009-790c-11f1-0a80-1e230076437f)
- [Cash in 00175](https://online.moysklad.ru/app/#cashin/edit?id=cfdc76fa-790c-11f1-0a80-1148007658b0)

## Lines

| Code | Product | Qty | Unit | Line |
|------|---------|----:|-----:|-----:|
| 00051 | HR³ Matrix Hair Tonic 70ml | 1 | 145.00 | 145.00 |
| 00050 | HR³ Matrix Scalp Peeling 100ml | 1 | 145.00 | 145.00 |
| 00089 | Excellent Delivery Dubai | 1 | 45.00 | 45.00 |
| | | | **Total** | **335.00** |

Payment: **cash in** (not bank transfer).

PDF: `~/Desktop/orders/GENOSYS_American_Medical_Center_04772.pdf` (Genosys_Invoice_Legal_TAX).

## Restore (2026-07-06)

PO **GENCardM260701AMC** restored from MoySklad trash via UI (**Восстановить**), then status set to **Доставлен** via API. MoySklad does not expose trash-restore over JSON API.
