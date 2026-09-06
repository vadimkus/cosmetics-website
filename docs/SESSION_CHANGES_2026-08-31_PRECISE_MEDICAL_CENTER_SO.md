# PRECISE MEDICAL CENTER L.L.C — new clinic + SO

**Date:** 2026-08-31  
**Script:** `scripts/moysklad-create-precise-medical-center-so-20260831.js --commit`  
**Source:** DET Trading License scan (license 922438, registration 917026)

## Customer

| Field | Value |
|---|---|
| **Name** | PRECISE MEDICAL CENTER L.L.C |
| **Arabic** | مركز المتقن الطبي ذ.م.م |
| **MoySklad ID** | `958a6535-a533-11f1-0a80-0fb500d3e92c` |
| **UI** | https://online.moysklad.ru/app/#company/edit?id=958a6535-a533-11f1-0a80-0fb500d3e92c |
| **Type** | Legal entity |
| **Email** | `922438` (license no. — Face Room pattern) |
| **Phone** | +971 50 668 4025 |
| **Address** | 8F35+Q32 - Muwaileh Commercial - Industrial Area, Sharjah |
| **TRN** | TBC |

License issued 18-08-2025. Expiry printed on the scan: 18-08-2026.

## Sales order (SO only)

| Field | Value |
|---|---|
| **Name** | GENCardM260831PMC |
| **ID** | `9a08c3b9-a533-11f1-0a80-1ecb00d00a73` |
| **UI** | https://online.moysklad.ru/app/#customerorder/edit?id=9a08c3b9-a533-11f1-0a80-1ecb00d00a73 |
| **State** | Новый |
| **Total** | **2,857.00 AED** unpaid (clinic list, VAT included) |
| **PDF** | `~/Desktop/orders/GENOSYS_Precise_Medical_Center_GENCardM260831PMC.pdf` |

No invoice, shipment, or payment.

## Lines

| Code | Product | Qty | Clinic AED | Line |
|---|---|---:|---:|---:|
| 00024 | Snow O₂ Cleanser 500ml | 1 | 255 | 255 |
| 00022 | Snow Booster Toner 200ml | 1 | 130 | 130 |
| 00145 | Problem Control Toner 200ml | 1 | 130 | 130 |
| 00129 | EPI Turnover Boosting Peeling Gel 100g | 2 | 125 | 250 |
| 00015 | SRS 2ml vial | 10 | 40.50 | 405 |
| 00020 | Power Solution SWS 2ml vial | 10 | 29 | 290 |
| 00011 | EZ CO₂ Mask professional box | 2 | 230 | 460 |
| 00013 | Hydro Cool Modeling Mask 1kg | 1 | 300 | 300 |
| 54467 | Skin Reboot PDRN Mask Pack 30 sheets | 1 | 200 | 200 |
| 54460 | Moisture Replenishing Hyaluron Cream 250g | 1 | 210 | 210 |
| 00038 | Soothing Repair Post Cream 20g | 1 | 102 | 102 |
| 54473 | Revita Glow BB Cream #02 Natural 50g | 1 | 125 | 125 |
| | **Total** | | | **2,857** |

**31 Aug amend:** 54458 hyaluron 50g @145 → **54460** hyaluron 250g @210. Script `scripts/moysklad-amend-precise-medical-hyaluron-250g-20260831.js`. Proforma reissued.

**31 Aug contact:** phone **+971506684025**, address **8F35+Q32 Muwaileh Commercial Industrial Area, Sharjah**. Script `scripts/moysklad-update-precise-medical-phone-address-20260831.js`. SO shipment + proforma updated.

**31 Aug later:** INV **05000** `aa723e67-a555-11f1-0a80-181f005c6a6d` + SHIP **06771** `d8a2496e-a55a-11f1-0a80-1051005cba26` (invoice-only demand).

**1 Sep paymentin:** **06156** `6c3e1f67-a602-11f1-0a80-0fbb003b9d51` / **2,857 AED** @ SHIP **06771**. SO → **Доставлен**.  
Script: `scripts/moysklad-create-precise-medical-paymentin-05000-20260901.js --commit`

## Not done

- Delivery line
- Print
