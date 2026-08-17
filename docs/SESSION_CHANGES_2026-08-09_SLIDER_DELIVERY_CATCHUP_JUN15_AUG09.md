# Session — Slider delivery catch-up Jun 15 → Aug 9 (09 Aug 2026)

## Source folder
`/Users/vadimkus/Desktop/Drive/Genosys/Company_Legal/Tax/Slider_2026/August_20026/`
- Tax invoice `#13171-20260809-1255` (2026-01-01 → 2026-08-09): **473 orders · paid 10,795.99 AED**
- Wio CSVs: Jun full, Jul, Aug 1–9

Prior folder `Jan_Aug_2026` / invoice `#13171-20260614-2110` already booked as **00614–00619 = 8,072.51 AED**.

## Double-book check
All six prior markers present and untouched:
`SLIDER-DELIV-2026-01` … `2026-06` → 00614–00619 Σ **8,072.51**. No re-post.

## Delta posted (new only)
Invoice paid 10,795.99 − prior 8,072.51 = **2,723.48 AED** (122 orders · net 2,593.78 · VAT 129.70).

Monthly split by Wio “Slider” card AED share (no monthly tax PDFs in folder):

| Period | Wio card | Paid (alloc) | VAT | Paymentout |
|---|---:|---:|---:|---|
| Jun 15–30 | 1,223.74 | 1,306.90 | 62.24 | **00672** |
| Jul 2026 | 1,051.71 | 1,123.18 | 53.49 | **00673** |
| Aug 1–9 | 274.73 | 293.40 | 13.97 | **00674** |
| **Total** | **2,550.18** | **2,723.48** | **129.70** | |

Markers: `SLIDER-DELIV-2026-06b` / `2026-07` / `2026-08`  
Expense item: Last-mile delivery · agent SLIDER DELIVERY SERVICE  
All Slider paymentouts now: **9 docs / Σ 10,795.99 AED** (= new tax invoice).

## Script
`scripts/moysklad-create-slider-delivery-paymentouts-jun15-aug09-20260809.js` (idempotent by marker)
