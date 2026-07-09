# Korea PO — GCAP01 / 54475 PDRN Homecare ×5 added (2026-06-22)

**Date:** 2026-06-22  
**Script:** `scripts/moysklad-add-korea-po-54475-gcap01-20260622.js --commit`

## Issue

PI **DM GME 260605** lists **GCAP01 — BIO-MESO PDRN Homecare Ampoule 5000 × 5 pcs**, but line was **skipped** when syncing PO on 2026-06-12 (no MoySklad SKU yet). Product **54475** was created later on Korea PO **DM GME 260616** (50 pcs line — separate shipment).

PO **Korea reorder 2026-06-03 T1+T2** had **30 lines / 57,958.60 AED** received via supply **00184** — without 54475.

## Fix

| Item | Value |
|------|-------|
| PO | **Korea reorder 2026-06-03 T1+T2** |
| PO ID | `61767a0d-5f3a-11f1-0a80-191700184737` |
| PI line | GCAP01 → **54475** × **5** @ **34.15 AED** (USD 9.30) |
| PO before | 57,958.60 AED / 30 lines |
| PO after | **58,129.35 AED** / **31 lines** (+170.75) |
| Receive | Supply **00186** / 2026-06-17 14:55 / **5 pcs received** |

**54475 on PO:** qty **5**, shipped **5** (Принято = 5).

## Note — Sara sale

1 pc was sold earlier today via Sara order **GENCardM2606225559** using ad-hoc stock enters before this PO line existed. Warehouse balance for 54475 may show **~4 pcs** on hand after the 5-pc PI receive minus that sale (plus any duplicate enters from the Sara fix — review if stock looks high).

## Stock reconcile (2026-06-22 evening)

System showed **7 available** (duplicate enters + supply 00185 from Sara fix). Physical count **4 pcs** (5 PI − 1 Sara).

| Action | Detail |
|--------|--------|
| Script | `moysklad-reconcile-54475-remove-duplicate-enters-20260622.js --commit` |
| Removed | Enter **00010-00118**, enter **00010-00117**, supply **00185** (wrong PO 260616) |
| Also removed | Loss **00008-00448** (posted but did not move stock) |
| Kept | Supply **00186** (PI 260605 ×5) + Sara shipment **06401** (−1) |
| Stock after | **4 pcs** |

## Invoice + payment alignment (2026-06-23)

After adding PO line + supply **00186**, PO showed mismatch:

| Column | Before | After |
|--------|-------:|------:|
| Sum | 58,129.35 | 58,129.35 |
| Invoiced | **57,958.60** | **58,129.35** |
| Paid | **57,958.60** | **58,129.35** |
| Received | 58,129.35 | 58,129.35 |

**Fix** (`scripts/moysklad-fix-korea-po-54475-invoice-payment-20260623.js --commit`):

| Doc | Change |
|-----|--------|
| Invoice **00172** | + **54475** ×5 @ 34.15 = **+170.75 AED** |
| Payment **00634** | **170.75 AED** → supply **00186** (same pattern as **00628** → **00184**) |

All four PO columns now **58,129.35 AED**.

## Related

- SKU created: `docs/SESSION_CHANGES_2026-06-18_KOREA_PO_DM_GME_260616.md`
- Original skip: `docs/SESSION_CHANGES_2026-06-12_KOREA_PO_PI_MISSING_LINES.md` (GCAP01 — no SKU)
- Sara order fix: `docs/SESSION_CHANGES_2026-06-22_SARA_PDRN_HOMECARE_ORDER_FIX.md`
