# Clinic Points — admin UI fix

Date: 2026-07-20

## Context

Admin customer profile showed Clinic Points with a broken adjustment row: amount + reason + Apply in one narrow grid caused the Apply button to overflow the amber box and truncated the reason placeholder.

## What Clinic Points do

Separate ledger from retail GENOSYS Rewards:

- Clinics earn **5% of eligible VAT-exclusive product value** when patients buy retail products attributed to a Homecare Script.
- Points sit **pending for 14 days**, then become available.
- Clinics redeem on partner orders at **1 point = AED 1**.
- **Not** usable on consignment stock orders.
- Refunds/cancellations reverse or restore points proportionally.
- Admin can manually adjust with a signed reason (this panel).

## UI fix

File: `components/CustomerProfile.tsx`

- Stacked form: amount + Apply on one row; reason full-width below.
- Short in-panel explanation of earn/redeem rules.
- `min-w-0` / `overflow-hidden` on the sidebar card so the amber box no longer clips.
