# Korea PO — DM GME 260616 shipping invoice ingest — 2026-06-23

**Source folder:** `~/Desktop/26062026/`
- `DM GME 260616_Shipping Invoice.pdf` (commercial/shipping invoice dated **2026-06-23**)
- `DM GME 260616_Packing list.pdf`
- `CHECK AWB 607-5410 8224.PDF`

**Invoice:** DM GME 260616 | **USD 15,098.80** | **38 lines** | FOB Incheon | T/T | CPIP-160626-081300

## New PO (authoritative for this air shipment)

| Field | Value |
|---|---|
| **Name** | `DM GME 260616 ship` |
| **Sum** | **55,453.23 AED** (USD × 3.6725) |
| **Lines** | **38** |
| **ETA** | **2026-07-15** |
| **Id** | `5f77462f-6ed1-11f1-0a80-076300a0934e` |
| **Edit** | https://online.moysklad.ru/app/#purchaseorder/edit?id=5f77462f-6ed1-11f1-0a80-076300a0934e |

**Script:** `scripts/moysklad-create-po-dts-260616-shipping-20260623.js --commit`

## vs old partial PO

| | Old proforma PO | New shipping PO |
|---|---:|---:|
| Name | `DM GME 260616` | `DM GME 260616 ship` |
| USD | 7,600 | **15,098.80** |
| AED | 27,911.19 | **55,453.23** |
| Lines | 22 | **38** |
| Status | **deleted** 2026-06-23 (`applicable=false`) | posted |
| Id | `dd395756-6ae8-11f1-0a80-03670038bbd3` | `5f77462f-6ed1-11f1-0a80-076300a0934e` |

The June-18 proforma PO was a **partial** order (USD 7,600). **Deleted by user 2026-06-23 09:32 UAE** — MoySklad soft-delete (`deleted` timestamp set). The **shipping invoice** is the full Jun-16 Korea air shipment — use **`DM GME 260616 ship`** for receive/payment.

## New / reactivated SKUs

| Code | Invoice | Product | Buy AED |
|---|---|---|---:|
| **54484** | GCCL05 | CERABARRIER Biome Gel Cleanser 200ml | 25.71 ($7) | clinic **190** / retail **380** |
| **54485** | GCCL06 | CERABARRIER Biome Gel Cleanser 600ml | 36.73 ($10) | clinic **310** / retail **620** |
| **54486** | GMAC05 | Non Woven Bag (S) | 2.57 ($0.70) |
| **54487** | GCCR48 | Samples Revita Glow BB #01 Bright 2g×50 | 146.90 ($40) |
| **54488** | GCCR49 | Samples Revita Glow BB #02 Natural 2g×50 | 146.90 ($40) |
| **54489** | GCSE16 | Samples Multi Vita Radiance Serum 2ml×100 | 132.21 ($36) |
| **00120** ↻ | GCCR24 | Samples Skin Barrier Protecting Cream 2g×100 | 11.02 ($3 support) |

## Mapping notes

| Invoice | MoySklad | Note |
|---|---|---|
| GCMA09 ×3 bulk box | **00140 ×300** | 100 sheets/box @ $0.90/sheet |
| GCPS05 ×6 box | **00069 ×6** | CTS box price on vial SKU (same as prior Korea POs) |
| Support block | GCCR24, GCEX02, GCMA12, GCHR21 | Invoice support USD ($3 / $3 / $3 / $1) |

## Verification

- PO line USD total recalc: **$15,098.80** — matches invoice footer ✓
- PO AED sum: **55,453.23** = 15,098.80 × 3.6725 ✓
- All 38 invoice commodity lines present on PO ✓

## Next steps

1. ~~Receive **supply** when shipment lands (Jul 2026)~~ — **done 2026-07-03** supply **00187** — see [SESSION_CHANGES_2026-07-03_KOREA_PO_260616_RECEIVE.md](./SESSION_CHANGES_2026-07-03_KOREA_PO_260616_RECEIVE.md)
2. Book supplier **invoicein + paymentout** when T/T paid.
3. ~~Old unposted PO `DM GME 260616`~~ — **deleted 2026-06-23** ✓
