# In-page quantity stepper on product grid (web)

_Last updated: 2026-04-17_

## Problem

Two related bugs on the products listing page (mobile web + desktop):

1. **Multi-size products never showed the green "In Bag (N)" state.** For a
   product with sizes (e.g. Snow O2 Cleanser 180ml / 500ml), the old
   computation counted only the `selectedSize === ''` cart line. Because the
   cart line for a sized product is stored with its actual size, the count
   was always 0 and the button stayed red.
2. **No in-place way to reduce quantity.** A user who tapped "Add to Bag"
   twice by mistake had to open the bag to correct it.

## Fix

### 1. Sum across all variants (already correct)

`useProductCard` already computed `inCartQty` by summing every cart row
with a matching `product.id`, regardless of size/colour. That's unchanged.
The visible symptom on web therefore only manifested before this summation
was introduced; the fix here is primarily about (2).

### 2. Replace the single pill with a `[-] [N in Bag] [+]` stepper

When `inCartQty > 0` and the product is in stock, `ProductActions` now
renders a green stepper instead of the "In Bag (N)" button:

- `+` fires `handleAddToCart` — same behaviour as the original button, adds
  one more unit of the default variant.
- `-` fires `handleDecrementFromCart`, which calls a new cart-store action
  `decrementProductById(productId)` that:
  - finds the most recently added non-bundle line for that product,
  - decrements `quantity` by 1,
  - removes the line entirely when `quantity` hits 0.
- The stepper keeps the same 44px min-height as the previous button so the
  card's vertical rhythm doesn't shift when state flips.

The out-of-cart state still renders the original "Add to Bag/Cart" button,
unchanged.

## Files touched

- `types/index.ts` — added `decrementProductById(productId: string)` to
  `CartState`.
- `lib/cartStore.ts` — implemented `decrementProductById`. Picks the last
  non-bundle matching line so a `-` tap undoes the most recent `+` tap.
- `components/ProductCard/types.ts` — added `onDecrementFromCart` to
  `ProductActionsProps` and `handleDecrementFromCart` to
  `UseProductCardReturn`.
- `components/ProductCard/hooks/useProductCard.ts` — destructure
  `decrementProductById` from `useCart()`; added `handleDecrementFromCart`
  handler (fires a light haptic, no-ops when `inCartQty <= 0`).
- `components/ProductCard/ProductActions.tsx` — branched render: stepper
  when `inCartQty > 0 && product.inStock`, original button otherwise.
- `components/ProductCard/index.tsx` — forwarded the new handler.

Translation keys `cart.decreaseQuantity` / `cart.increaseQuantity` already
exist in `messages/{en,ar,ru}.json` and are reused for the stepper's
accessibility labels.

## Manual test plan

- English, Arabic, Russian locales.
- Desktop + mobile web + PWA.
- Single-variant product (e.g. sheet mask): tap Add → green stepper shows
  `In Bag (1)`; tap `+` → `(2)`; tap `-` → `(1)`; tap `-` again → button
  reverts to `Add to Bag`.
- Multi-variant product (cleanser/cream) navigated via PDP with a chosen
  size: after adding, stepper shows total units across variants; `+` adds
  default variant; `-` removes the last line's unit.
- Out-of-stock product: stepper never appears, disabled grey button only.
- Price-on-request product: WhatsApp CTA unchanged.
- Unauthenticated user: "Login to see price" CTA unchanged.
