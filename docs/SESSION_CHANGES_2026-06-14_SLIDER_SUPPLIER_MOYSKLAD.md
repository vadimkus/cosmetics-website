# Slider Delivery Service — supplier created in MoySklad (2026-06-14)

## Counterparty

| | |
|---|---|
| **Name** | SLIDER DELIVERY SERVICE |
| **Type** | Legal (supplier) |
| **TRN** | **105010526900003** (stored in MoySklad `inn` field + description) |
| **Phone** | +971 2 666 5512 |
| **Email** | accounting@slider-app.com |
| **Country / City** | UAE / Abu Dhabi |
| **MoySklad ID** | `618d9654-6814-11f1-0a80-009900893877` |
| **Link** | https://online.moysklad.ru/app/#company/edit?id=618d9654-6814-11f1-0a80-009900893877 |

The 15-digit UAE TRN was accepted directly in the standard `inn` tax-id field (verified on the created record).

## Source

Slider **tax invoice #13171-20260614-2110**, date range **2026-01-01 → 2026-06-14**:
- From: SLIDER DELIVERY SERVICE, UAE, TRN 105010526900003
- To: Genosys Middle East FZ-LLC, TRN 104229886700003
- **351 orders · Total order cost 6,862.97 AED · VAT 384.54 AED · Total paid 8,072.51 AED**

Note: the consolidated invoice total (8,072.51 AED, 351 orders) is slightly higher than the Wio "Slider" card-charge total in the H1 ingest (7,909.93 AED, 344 charges) — expected, since the invoice includes the period 2026-01-01 and a few orders/refunds may settle on the card on different dates. Reconcile per month when booking.

## Expense item

Created expense item **"Last-mile delivery"** — `08733615-6815-11f1-0a80-072500887d34` (separate from existing "Shipment Cost", which is inbound freight).

## Monthly delivery expense booked (H1 2026 catch-up)

Six `paymentout` docs against Slider, one per month. Sum = Slider tax-invoice **Total Paid Amount** (full cash cost = delivery fees + any platform/subscription fee). Net + VAT recorded in each description for input-VAT recovery.

| Month | Tax invoice | Orders | Net (AED) | VAT (AED) | Paid (AED) | Paymentout |
|---|---|---:|---:|---:|---:|---|
| Jan 2026 | #…-2111 | 27 | 485.96 | 35.82 | 751.78 | **00614** |
| Feb 2026 | #…-2112 | 33 | 637.98 | 43.42 | 911.40 | **00615** |
| Mar 2026 | #…-2113 | 85 | 1,540.93 | 90.80 | 1,906.73 | **00616** |
| Apr 2026 | #…-2113 | 68 | 1,281.69 | 68.62 | 1,440.31 | **00617** |
| May 2026 | #…-2114 | 78 | 1,615.89 | 80.82 | 1,696.71 | **00618** |
| Jun 2026 (1–14) | #…-2114 | 60 | 1,300.52 | 65.06 | 1,365.58 | **00619** |
| **Total** | | **351** | **6,862.97** | **384.54** | **8,072.51** | |

Reconciles exactly to consolidated invoice #13171-20260614-2110. Each paymentout dated at month-end (Jun at 14th), state = Paid, expense item "Last-mile delivery".

### Amount note (for accountant)
- **Total Paid > Net + VAT** in early months: Jan +230, Feb +230, Mar +275, Apr +90; May/Jun nil. Looks like a fixed monthly platform/subscription fee phased out by May. Booked within the delivery expense (still a real cost).
- **Recoverable input VAT** = the "Total VAT Amount" column (384.54 AED total). Claim on the relevant FTA quarter; some quarters (Q1/Q2 2026) may already be filed — accountant to decide timing/correction per FTA rules.
- **Bank cross-check:** Wio "Slider" card charges in H1 ingest = 7,909.93 AED (344 charges) vs invoice Total Paid 8,072.51 (351 orders). ~162.58 AED / 7-order timing difference — reconcile if needed; tax invoice is the authoritative document.

## Scripts

```bash
# Supplier (idempotent — dedupes by phone/name/search)
node --import dotenv/config scripts/moysklad-create-slider-supplier-20260614.js --commit

# Monthly delivery expense (idempotent — skips months already posted via SLIDER-DELIV-YYYY-MM marker)
node --import dotenv/config scripts/moysklad-create-slider-monthly-delivery-paymentouts-20260614.js --commit
```

## Going forward
End of each month: get Slider's monthly tax invoice, then add one line to the `MONTHS` array (or a follow-up script) and post a single paymentout to Slider under "Last-mile delivery". ~10 min/month; keeps bank reconciled and input VAT supported.
