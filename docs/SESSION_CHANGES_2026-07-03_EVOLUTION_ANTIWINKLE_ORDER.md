# Evolution Aesthetics Clinic — anti-wrinkle cream order (2026-07-03)

**Customer:** Evolution Aesthetics Clinic (`89d4bfbd-81d1-11ed-0a80-0ffb0008d1c5`)  
**Phone:** 052 736 86 77  
**Address:** 49 Umm Al Sheif Rd, Jumeirah 3, Dubai  

Replaces deleted consignment demand **06461** (agreement 00052) — posted as normal retail chain.

**Script:** `scripts/moysklad-create-evolution-antiwinkle-order-invoice-demand-20260703.js --commit`

## Documents

| Step | Type | Name | Sum (AED) | ID |
|------|------|------|----------:|-----|
| 1 | Customer order | **GENCardM260703EVOL** | 1,710.00 | `d822ba66-76a5-11f1-0a80-0d9f000e4bd9` |
| 2 | Invoice | **04756** | 1,710.00 | `d8a9f1a9-76a5-11f1-0a80-1032000ede93` |
| 3 | Shipment | **06461** | 1,710.00 | `da32cf7f-76a5-11f1-0a80-1a69000e66cc` |

- [Order](https://online.moysklad.ru/app/#customerorder/edit?id=d822ba66-76a5-11f1-0a80-0d9f000e4bd9)
- [Invoice 04756](https://online.moysklad.ru/app/#invoiceout/edit?id=d8a9f1a9-76a5-11f1-0a80-1032000ede93)
- [Shipment 06461](https://online.moysklad.ru/app/#demand/edit?id=da32cf7f-76a5-11f1-0a80-1a69000e66cc)

## Lines @ clinic list (VAT incl.)

| Code | Product | Qty | Unit AED | Line AED |
|------|---------|----:|---------:|---------:|
| `00190` | Multi Functional Anti-Wrinkle Cream 50g | 3 | 145.00 | 435.00 |
| `54457` | Ultra Shield Sun Cream SPF50 50g | 3 | 125.00 | 375.00 |
| `00144` | Cushion #2 Beige | 4 | 150.00 | 600.00 |
| `00143` | Cushion #1 Ivory | 2 | 150.00 | 300.00 |
| | **Total** | | | **1,710.00** |

**Amend (2026-07-03):** added SPF + cushions to order/invoice/shipment; re-exported PDF.  
Script: `scripts/moysklad-fix-evolution-add-lines-04756-20260703.js --commit`

## PDF

`~/Desktop/orders/GENOSYS_Evolution_04756.pdf` (Genosys_Invoice_Legal_TAX) — reissued 2026-07-03
