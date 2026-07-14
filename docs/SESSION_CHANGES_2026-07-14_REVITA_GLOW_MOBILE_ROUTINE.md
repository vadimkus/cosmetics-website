# Session — Revita Glow mobile Recommended Routine (2026-07-14)

## Problem
Revita Glow BB Cream (#63) showed Recommended Routine on desktop only
(`hidden md:block` hardcoded block). Mobile web had no routine.

## Fix
1. Added `REVITA_GLOW_ROUTINE` to `ProductRoutineCard` (same steps/copy as the
   old desktop block; mirrors `lib/mobileProductRoutines.ts`).
2. Removed the hardcoded #63 block from `ProductPageClientRefactored.tsx`.
3. Desktop still uses `<ProductRoutineCard className="hidden md:block mt-4" />`;
   mobile already had `<ProductRoutineCard className="md:hidden …" />` after
   Product Details in `ProductContentDisplay`.

## Verify
- `/products/63` mobile web: Description → Product Details → Recommended Radiant Glow Routine.
- Desktop: same routine in left column.
