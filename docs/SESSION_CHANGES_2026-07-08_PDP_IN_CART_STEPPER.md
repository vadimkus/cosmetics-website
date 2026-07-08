# Session Changes — 2026-07-08 — PDP In-Cart Stepper (Web)

## Request

When clicking "Add to Cart" on the website product page, the button should turn
into a `[-] [qty] [+]` stepper showing the item is in the cart — same behaviour
as the mobile app shop grid (`In Bag (N)` stepper) and the website's own
product-grid cards (which already had this pattern via `ProductActions.tsx`).

The PDP was the only surface still showing a static "Add to Cart" button after
adding.

## What Changed

### 1. `components/product/ProductQuantityCart.tsx` (desktop PDP purchase block)

- New props: `inCartQty` (total units of this product in the cart, all
  variants) and `onDecrementFromCart`.
- When `inCartQty > 0 && inStock && user`:
  - The standalone "Quantity:" selector row is hidden (the stepper controls
    the cart line directly, so a second qty control would be confusing).
  - The red "Add to Cart" button is replaced by a green full-width stepper:
    `[-] ✓ In Cart (N) [+]` — identical style to the grid-card stepper
    (`bg-green-600`, white `/15` step buttons).
  - `+` adds exactly 1 unit (reuses `onAddToCart(1)`, so GA4 `add_to_cart`
    still fires); `-` calls `onDecrementFromCart`.
- Uses `product.inBag` label in PWA/mobile-web ("In Bag"), `product.inCart`
  on desktop — keys already existed in en/ar/ru.

### 2. `app/products/[id]/ProductPageClientRefactored.tsx`

- `useCart()` now also pulls `items` and `decrementProductById`.
- `inCartQty` computed the same way as `useProductCard.ts` (sum of all cart
  lines for the product id, across variants).
- `handleDecrementFromCart` → `decrementProductById(product.id)` (removes one
  unit from the newest line; deletes the line at zero) — same tested store
  logic the grid cards use.
- Desktop: `inCartQty`/`onDecrementFromCart` passed into `ProductQuantityCart`.
- Mobile web sticky footer: when the item is in the cart, the qty picker +
  "Add to Bag" button are replaced by the same full-width green stepper
  (`[-] ✓ In Bag (N) [+]`); heart button stays. At zero it reverts to the
  original picker + button.

## Behaviour Notes

- The stepper reflects the total across variants (matches grid-card
  behaviour); `+` adds one more of the currently selected variant.
- Guests and out-of-stock products never see the stepper (Add to Cart /
  Login-gated flow unchanged).
- Price-on-request products unchanged (WhatsApp quote button).

## Verification

- `tsc --noEmit` and ESLint clean on both files.
- Verified live on localhost (desktop + 390px mobile emulation) with a
  disposable account (`ui-stepper-test@example.com`, deleted afterwards):
  add → stepper (1), `+` → 2, `-` → 1, `-` → 0 reverts to Add to Cart;
  header cart badge stayed in sync the whole time.
- No Jest tests reference `ProductQuantityCart` — no test updates needed.

## Files Touched

- `components/product/ProductQuantityCart.tsx`
- `app/products/[id]/ProductPageClientRefactored.tsx`
