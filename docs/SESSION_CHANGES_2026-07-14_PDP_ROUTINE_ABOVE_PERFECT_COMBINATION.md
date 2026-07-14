# Session — PDP Routine above Perfect Combination (2026-07-14)

## Request
Website only: Perfect Combination block should sit below Recommended
Routine on product pages (e.g. `/products/37`).

## Change
In `app/products/[id]/ProductPageClientRefactored.tsx`, moved all
desktop (`hidden md:block`) `ProductRecommendation` blocks to render
**after** the bespoke + data-driven routine cards in the left column.

Mobile was already correct (routine in left column stacks above
Perfect Combination in the right column).
