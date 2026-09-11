# DM GME 260827 — devices PO (2026-09-02)

DTS MG proforma **2026-08-27**. PO created 2026-09-02. **Fully received 2026-09-10**.

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

| Inv | Code | Product | Qty | USD | AED | Receive |
|---|---|---|---:|---:|---:|---|
| GMPS05 | 00077 | GENO-LED IR II | 1 | 630 | 2,313.67 | Supply **00191** (10 Sep) |
| HGHY01 | 00078 | Hair Gentron | 1 | 200 | 734.50 | Supply **00190** (10 Sep → Evolution 05050) |
| | | **Total** | **2** | **830** | **3,048.17** | both shipped 1/1 |

buyPrice updated: `00077` 2,312.00 → 2,313.67 · `00078` 734.00 → 734.50.

## DHL delivery (2026-09-02)

Paymentout **00695** / **276.75 AED** → DHL Express. CCAvenue **115081380942**. See `docs/SESSION_CHANGES_2026-09-02_DHL_260827_PAYMENTOUT.md`.

## Receive (2026-09-10)

- Gentron first (needed for Evolution sale): supply **00190** / **734.50 AED**
- LED aligned same day: supply **00191** / **2,313.67 AED**
- Scripts: `moysklad-finish-evolution-gentron-05050-20260910.js`, `moysklad-receive-dm-gme-260827-led-20260910.js --commit`

Script (PO create): `scripts/moysklad-create-po-dm-gme-260827-20260902.js --commit`
