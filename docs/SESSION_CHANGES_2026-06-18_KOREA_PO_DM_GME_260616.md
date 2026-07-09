# Korea PO DM GME 260616 — invoice ingest + tester SKUs — 2026-06-18

**Commercial invoice:** DM GME 260616 (2026-06-16) — DTS MG Co., LTD → Genosys Middle East FZ-LLC  
**Invoice total:** USD 7,600.00 → **27,911.19 AED** (FX 3.6725)  
**Units:** 493 (22 lines)  
**Planned delivery:** 2026-07-07  
**Related:** DM import fee already booked — paymentout **00627** / 70 AED / CPIP-160626-081300

## MoySklad PO

| Field | Value |
|---|---|
| **Name** | `DM GME 260616` |
| **Sum** | 27,911.19 AED |
| **Id** | `dd395756-6ae8-11f1-0a80-03670038bbd3` |
| **Edit** | https://online.moysklad.ru/app/#purchaseorder/edit?id=dd395756-6ae8-11f1-0a80-03670038bbd3 |

**Script:** `scripts/moysklad-create-po-dts-260616.js --commit`

## New / reactivated products

| Code | Invoice | Name | Buy AED (USD×3.6725) | Sale |
|---|---|---|---:|---|
| **54475** | GCAP01 | BIO-MESO PDRN Homecare Ampoule 5000 | 34.15 ($9.30) | W 150 / R 300 |
| **54478** | GCSE18 | Samples Hyaluron Serum 2ml×100 box | 132.21 ($36) | 0 |
| **54479** | GCCR41 | Samples Hyaluron Cream 2g×100 box | 128.54 ($35) | 0 |
| **54476** | GCMA12 | Samples Overnight Cream Mask 2g×50 box | 88.14 ($24) | 0 |
| **00121** ↻ | GCHR21 | HR³ Matrix Medi Scalp Shampoo α 30ml (tester) | 5.88 ($1.60) | 0 — reactivated from archive |

Codes **00124 / 00128 / 00131 / 00136** were blocked (services or hidden archived SKUs); used **54478/54479** for new hyaluron sample boxes instead.

## Sample box buy prices updated (invoice-aligned)

| Code | Invoice | USD/box | Buy AED |
|---|---|---:|---:|
| 00111 | GCCL03 Snow O₂ 4g×30 | 35 | 128.54 |
| 00112 | GCCR42 Blemish 2g×50 | 25 | 91.81 |
| 00114 | GCCR20 Hydro soothing 2g×100 | 34 | 124.87 |
| 00116 | GCCR22 Problem control 2g×50 | 23 | 84.47 |
| 00118 | GCSP-CB01 Anti-wrinkle 2g×50 | 35 | 128.54 |
| 00135 | GCEX02 EPI peeling 2g×50 | 20 (cost) | 73.45 |

## FOC lines (PO price 0)

- **00135** GCEX02 EPI peeling 2g×50 ×2  
- **54476** GCMA12 overnight mask 2g×50 ×2  
- **00121** GCHR21 HR³ shampoo 30ml ×40  

## Standard lines (existing SKUs, buy refreshed)

GRFS150→00004, GCCL01→00021, GCCL02→00024, GCTN01→00022, GCMA01→00011, GCMA11→00189, GCAP02→54470, GCCR07→00039, GCCR43→54465, GAHR01→00142, CCVS03→00141.

## Next steps

1. Receive supply when shipment lands; reconcile qty vs invoice.  
2. Book Korea T/T payment against PO when paid.  
3. COGS hits June P&L on supply receipt (not on PO creation).
