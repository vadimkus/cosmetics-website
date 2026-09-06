# DM GME 260827 — devices PO (2026-09-02)

DTS MG proforma **2026-08-27**. PO only. Not received. DHL delivery paid **00695**.

| Field | Value |
|---|---|
| **PO name** | **DM GME 260827** |
| **ID** | `4a177a90-a67d-11f1-0a80-1db30014403d` |
| **Link** | https://online.moysklad.ru/app/#purchaseorder/edit?id=4a177a90-a67d-11f1-0a80-1db30014403d |
| **Moment** | 2026-08-27 |
| **ETA** | 2026-09-01 (est. dispatch on PI) |
| **USD** | **830.00** |
| **AED** | **3,048.17** (USD × 3.6725, line-level) |
| **Supplier** | DTS MG `3a0a3f28-33cf-11ea-0a80-043f000b9859` |
| **Terms** | FOB Incheon · T/T in advance |

| Inv | Code | Product | Qty | USD | AED |
|---|---|---|---:|---:|---:|
| GMPS05 | 00077 | GENO-LED IR II | 1 | 630 | 2,313.67 |
| HGHY01 | 00078 | Hair Gentron | 1 | 200 | 734.50 |
| | | **Total** | **2** | **830** | **3,048.17** |

buyPrice updated: `00077` 2,312.00 → 2,313.67 · `00078` 734.00 → 734.50.

Positions marked in transit. Receive when the devices land.

## DHL delivery (2026-09-02)

Paymentout **00695** / **276.75 AED** → DHL Express. CCAvenue **115081380942**. See `docs/SESSION_CHANGES_2026-09-02_DHL_260827_PAYMENTOUT.md`.

Script: `scripts/moysklad-create-po-dm-gme-260827-20260902.js --commit`
