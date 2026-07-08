# Session Changes — 2026-07-08 — PDP Polish Pass

## Request

Design/formatting review of https://genosys.ae/products/63 → implement the
agreed improvements ("go").

## Bug Fixed First (shipped separately, commit 9baa7606)

Quantity stepper number and +/− icons were **white-on-white** for visitors
whose OS is in dark mode (page body inherits `--color-text-primary: #fff`
from the dark-mode block in `globals.css`; the stepper had no explicit text
color). Explicit `text-gray-900` / `text-gray-600` added.

## Polish Pass

### 1. Routine cards deep-link every step (`lib/routineStepLinks.ts` — new)

- Map of all `product.routine*Title` i18n keys → product IDs, **verified
  against the live catalog** (the legacy `getProductLink` name-map had wrong
  IDs for All For Sensitive Serum→19 not 21, Skin Barrier Cream→27 not 31,
  Collagen Mask→53 not 36; EGF Oxymask=26).
- `routineTitle()` helper added to `ProductPageClientRefactored.tsx` and
  `ProductContentDisplay.tsx`; all 63 routine step titles across every
  product's routine card now link to the step's PDP (underlined, red on
  hover). Self-links are skipped (e.g. step 5 on the Revita Glow page).

### 2. Description de-clutter (`ProductContentDisplay.tsx`)

`stripIngredientDump()` removes the trailing "Key ingredients: …" INCI dump
from single-paragraph descriptions **only when the Key Ingredients accordion
has data** (EN/AR/RU markers; stops at the "Effects:" sentence). No
information lost — the accordion presents the ingredients properly.

### 3. Unified card styling (was blue/pink/rose patchwork)

- Product Details, Available Colors (41), Available Shades (63),
  Documentation boxes → neutral `gray-50` cards, `gray-900` labels,
  `gray-600` text (blue link-looking non-links removed).
- Documentation buttons: View PDF → `gray-900` primary, Download → white
  outline.
- All routine cards (rose/blue/cyan/orange/pink/red tints across products
  55-63) → white cards with gray borders, `gray-900` step number badges,
  brand-red sparkles icon.

### 4. Reviews empty state (`ProductReviews.tsx`)

When there are no reviews: stars outline + "No reviews yet" + "Be the first
to share your experience" + CTA — "Write a Review" (logged in, opens form)
or "Login to write a review" (guest). Previously the section was a bare
heading.

### 5. Actionable guest CTA

The disabled grey "Add to Cart" for logged-out visitors is now an enabled
red **"Login to Shop"** button (desktop purchase block + mobile sticky
footer). The existing page handlers already route guests to /login.

### i18n

New keys in en/ar/ru: `product.noReviewsYet`, `product.beFirstToReview`,
`product.loginToReview`, `product.loginToShop`.

## Verification

- tsc clean (after clearing stale `.next` types referencing the test/debug
  routes deleted by commit 6765c4e3), ESLint clean, locale JSON valid.
- Verified live on localhost /products/63: routine links resolve to
  /products/10/16/21/29, description ends cleanly at the Effects line,
  neutral cards, reviews empty state, enabled "Login to Shop".

## Files Touched

`lib/routineStepLinks.ts` (new), `app/products/[id]/ProductPageClientRefactored.tsx`,
`components/product/ProductContentDisplay.tsx`, `components/product/ProductReviews.tsx`,
`components/product/ProductQuantityCart.tsx`, `messages/{en,ar,ru}.json`
