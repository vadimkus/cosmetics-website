# Session — X Beauty Consulting MoySklad retail order (2026-05-13)

- **Script:** `scripts/moysklad-create-x-consulting-retail-order-invoice-20260513.js` — counterparty **`X BEAUTY CONSULTING - F.Z.C`** (exact MoySklad name).
- **Agent (correct):** **X BEAUTY CONSULTING - F.Z.C**, id `03c174b0-4581-11ea-0a80-01f80012b189`.
- **Earlier fix:** Documents were re-linked from mistaken **X Consulting** counterparty; duplicate counterparty removed from MoySklad.
- **Visibility:** API had `shared: false` (only owner saw the docs). **Updated to `shared: true`** on order + invoice so everyone in the MoySklad account sees them.
- **Order:** `GENCardM2605136274`, `2115.00` AED, id `e282c601-4f7a-11f1-0a80-1ad000179300`
- **Invoice:** **04508**, `2115.00` AED, id `e2e9be25-4f7a-11f1-0a80-075600178ab4`
- **Pricing:** genosys.ae retail (`lib/products.ts`); delivery **Excellent Delivery Dubai** 45 AED.
- **Run:** `--commit --no-pdf` (no PDF, no print).
- **SKU note:** “GENOSYS Intensive Sleeping Mask” posted as **Skin Rescue Overnight Cream Mask** `00189` (MoySklad name).
