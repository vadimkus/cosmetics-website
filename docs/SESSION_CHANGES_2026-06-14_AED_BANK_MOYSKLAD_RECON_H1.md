# H1 2026 reconciliation — Wio AED account ↔ MoySklad — 2026-06-14

## Scope
Transaction-level reconciliation of Wio AED current account (`9833011607`, IBAN
`AE110860000009833011607`) vs MoySklad paymentouts/paymentin for 2026-01-01 → 2026-06-14.
Korea (DTSMG) is USD-funded (see USD ingest doc) and currency-exchange lines are treasury
moves — both treated as labelled reconciling buckets, not errors.

Script: `scripts/reconcile-aed-bank-vs-moysklad-h1-2026.js` (read-only)
JSON: `data/wio-statements-2026-h1/reconciliation-aed-vs-moysklad-h1-2026.json`

## Totals

| | H1 2026 (AED) |
|---|---:|
| Bank AED outflows (ex-FX) | 586,393.68 |
| Bank currency-exchange out (funds USD/Korea) | 246,408.33 |
| Bank AED inflows (ex-FX) | 798,260.03 |
| MoySklad paymentout — all | 954,273.62 |
| — Korea (DTSMG, USD-funded) | 320,951.03 |
| — non-Korea (AED rail) | 633,322.59 |
| MoySklad paymentin | 911,566.04 |

Crude matcher (exact amount ±12d, then ±1% ±15d): 87 matched, 400 bank-unmatched
(AED 95,922 — mostly Slider micro-charges + small card spend), 25 MoySklad-unmatched (AED 142,822).

## Explained (no action)
- **Slider micro-charges (~7,910)** — 340 tiny bank lines vs 6 monthly MoySklad lumps (`00614`–`00619`). Same money, aggregated.
- **Wio 99/mo subscription** — one annual lump `00508` ("Yearly WIO Fee 99×12=1188").
- **Korea/DTSMG** — USD-funded, reconciled in USD ingest.
- **Owner bonuses** — lumpy granularity; present both sides, not 1:1.

## Actionable findings
1. **Office rent NOT paid from this Wio AED account.** Monthly rent paymentouts exist in MoySklad
   (`00536` 12,916 Jan, `00550` 12,916 Feb, `00570/00586/00601/00613` 14,208.30 Mar–Jun ≈ **AED 82,665 H1**)
   with **no matching Wio AED outflow** → rent leaves via a different account/cheque. That account must be
   ingested for a complete tie-out.
2. **Data error: paymentout `00588` booked as AED 0.00** (memo "304.41 AED", MOFA). Fix the amount.
3. **Qatar Airways AED 29,570 (05 Jan)** — biggest bank outflow with no MoySklad match; confirm it is booked (travel).
4. **Small operational card spend not in MoySklad** — Uber, Careem, Talabat, Quiqup, Dubai Municipality, Twilio,
   Tamm, DU, MOFA. Individually trivial; decide whether to book monthly aggregates (like Slider).

## Side observation
- Several **VisionDrive IoT costs** (LoRaWAN/parking sensors, Dragino samples, type-approval/certificate fees:
  `00514/00515/00520/00522/00523/00524/00525/00532`) are booked in the GENOSYS MoySklad and paid from elsewhere.
  Entity-separation point between GENOSYS and VisionDrive.

## Bottom line
Books are sound. Main gap to a full tie-out is **rent paid from another account (~AED 82.7K H1)** plus one
zero-value data error (`00588`) and confirming the Qatar Airways travel booking. No git commit made.
