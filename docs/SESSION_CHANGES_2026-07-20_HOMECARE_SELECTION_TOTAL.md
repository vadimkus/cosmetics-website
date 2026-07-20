# Homecare Scripts — selection patient total

Date: 2026-07-20

## Change

On Create/Update recommendation, the footer now shows:

- count of selected retail lines
- **Patient total** in AED (sum of listed retail unit prices × qty)

Uses the same retail prices shown in the product list (patient-facing, not clinic −50%).

File: `app/partner-portal/homecare/page.tsx`
