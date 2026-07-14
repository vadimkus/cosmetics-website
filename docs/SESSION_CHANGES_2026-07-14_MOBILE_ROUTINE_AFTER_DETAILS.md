# Session — Mobile web: Recommended Routine after Product Details (2026-07-14)

## Request
Mobile web only: move Recommended Routine below Product Details / Key Benefits.
Do not change desktop layout or the native mobile app.

## Cause
Data-driven routine (and Cerabarrier 66) lived in the PDP left column with no
`hidden md:block`, so on a single-column phone layout it appeared above
description and details.

## Fix
1. **`ProductRoutineCard`** — shared card for `PRODUCT_ROUTINES` + product 66.
2. **Desktop left column** — `<ProductRoutineCard className="hidden md:block mt-4" />`.
3. **Mobile content** — same card with `md:hidden` in `ProductContentDisplay`
   immediately after Product Details.
4. Native app untouched.

## Verify
- `/products/27` mobile: Description → Product Details → Recommended Routine.
- Desktop: routine still in left column beside content.
