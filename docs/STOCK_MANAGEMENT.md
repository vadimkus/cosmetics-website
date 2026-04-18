# Stock Management — Variant-Level Availability

Runbook for temporarily blocking ordering of a specific product variant
(size or color) while keeping other variants of the same product
buyable.

## When to use this

- A specific size/color is out of stock but others are available
- You want a fast, reversible block (not a permanent delete)
- The block needs to apply to both web + mobile app

For **whole-product** sold-out states, use
`scripts/mark-product-sold-out.ts` instead — it flips `Product.inStock`
which is a simpler code path.

## The three-layer architecture (read this first)

Variant availability is enforced at **three places** for historical
reasons. You need to touch all three for a block to actually work
end-to-end.

| Source of truth | Used by | Enforcement |
|---|---|---|
| `ProductVariant.available` (DB) | Mobile app API, bundle builder, cart / checkout availability filters | `lib/pricingEngine.ts` → `generateProductVariants()`; `CheckoutClient.tsx`; `CartItem.tsx` |
| `Product.size` + `Product.price` (DB, parent row) | Product listing **card** (grid page + all category/concern pages) — displays "Size: X" label and base price, and the card's quick "Add to Cart" passes `product.price` with an empty size to the cart | `components/ProductCard/ProductInfo.tsx`, `ProductCard/ProductPrice.tsx`, `ProductCard/hooks/useProductCard.ts` |
| Hardcoded lists in `utils/productPricing.ts` | Website product **detail page** size picker | `ProductPageClientRefactored` → `ProductVariantSelector` |

**A DB-variant-only change is invisible to the listing card.**
**A listing-card-only change is invisible to the detail page.**
**A code-only change is invisible to the mobile API.**
**All three must be aligned.**

The listing-card gotcha is the subtle one: when a customer clicks
"Add to Cart" directly from the grid, the card calls
`addItem(product, 1, '', '')` — empty size. The cart stores the item
at `product.price` with no size. If `Product.price` still equals the
*blocked* variant's price (e.g., 290 AED for 50g), the customer pays
the wrong amount for a product we can't ship.

Fix: whenever you block a variant, also update the parent `Product`
row's `size` and `price` to match the **new default variant**.

(Migration note: new products should prefer DB variants as the single
source of truth, with `Product.price` / `Product.size` derived from
the default variant at write-time. The hardcoded-list path is legacy
and should be retired when someone has time.)

## Procedure

### 1. Identify the product + variant

```bash
set -a && source .env.local && set +a
```

Write a one-off finder (or copy from
`scripts/set-hyaluron-cream-availability.ts`) that prints the product
and its variants so you know the IDs you're touching:

```ts
import { prisma } from '../lib/prisma'

const products = await prisma.product.findMany({
  where: { name: { contains: 'YOUR_PRODUCT_NAME', mode: 'insensitive' } },
  include: { variants: true },
})
```

You're looking for:
- The product's numeric `productNumber` (or CUID `id`)
- Each variant's `size`, `color`, current `available`, and current `isDefault`

### 2. Update the DB

Write a script following the pattern of
`scripts/set-hyaluron-cream-availability.ts`. The essential operation
touches **three** rows: two variants + the parent product:

```ts
await prisma.$transaction([
  prisma.productVariant.update({
    where: { id: blockedVariantId },
    data: { available: false, isDefault: false },
  }),
  prisma.productVariant.update({
    where: { id: keptVariantId },
    data: { available: true, isDefault: true }, // promote to default
  }),
  // Also update parent Product row so the listing card shows the
  // new default variant's size + price. Without this the grid card
  // will still display the blocked variant and its quick Add-to-Cart
  // will add the blocked item at the blocked price.
  prisma.product.update({
    where: { id: productId },
    data: {
      size: '<kept variant size>',   // e.g., '250g'
      price: <kept variant price>,   // e.g., 420
    },
  }),
])
```

Key invariants:
- **Exactly one variant should be `isDefault: true`** at any time. If
  you block the current default, pick the most-sensible remaining
  variant to become the new default.
- **`Product.size` + `Product.price` must match the new default
  variant**. These are what the listing card displays (and what the
  card's quick Add-to-Cart uses).

Run it:

```bash
set -a && source .env.local && set +a
npx tsx scripts/YOUR_SCRIPT.ts block-<variant>
```

Verify the output shows the expected post-change state.

### 3. Update the website UI

Two files, same product-number split pattern.

**`utils/productPricing.ts`** — three functions:

```ts
// Before (shared group):
if (['30', '29', '32', '28'].includes(productId)) {
  return [
    { value: '50g', label: '50g' },
    { value: '250g', label: '250g' },
  ]
}

// After (product 29 split out to its own branch with only the
// available sizes):
if (productId === '29') {
  return [{ value: '250g', label: '250g' }]
}
if (['30', '32', '28'].includes(productId)) {
  return [
    { value: '50g', label: '50g' },
    { value: '250g', label: '250g' },
  ]
}
```

Also update `getPriceForSize()` so that if the blocked size somehow
gets passed (stale cart state from before the change), you return the
*remaining* variant's price rather than the blocked one's:

```ts
if (pid === '29') {
  return 420 // 250g price — 50g temporarily blocked
}
```

**`components/product/ProductInfo.tsx`** (legacy component, but still
mounted by `ProductPageClientOptimized` which is dynamically imported
by `ProductPageClientDynamic`, which isn't in the active route tree
today — but keep it consistent as defense-in-depth):

1. Split the product out of the shared `getPriceForSize` branch,
   same pattern as above.
2. Split the product out of the shared size-button render block.
3. Update the size badge label (line ~162) from `'50g/250g'` to just
   `'250g'`.

Leave `hasProductSizeVariants()` unchanged — the product still has
variants conceptually, just one is hidden. Removing it from that list
would cause the UI to fall back to `product.price` (often the wrong
price) and skip variant-aware behaviour.

### 4. Always add restore markers

Every code branch you add gets a comment like:

```ts
// Product 29: 50g temporarily out of stock → only 250g listed.
// Restore by adding back to the shared group + running
// `scripts/set-hyaluron-cream-availability.ts restore-50g`
```

This way `git grep 'temporarily out of stock'` surfaces every site
that needs reverting.

### 5. Build + commit + push

```bash
npm run build
git add <touched files> scripts/<your new script>
git commit -m "feat(stock): temporarily block <variant> on <product>"
git push origin main
```

Vercel redeploys in ~90 seconds. Website UI change is instant on
deploy. Mobile API picks up the DB change within 5 minutes (the
`unstable_cache` tag `products` has `revalidate: 300`), or immediately
on the first admin mutation that fires `revalidateTag('products')`.

## Caveats

### Stale cart items can still check out

`CheckoutClient.tsx` filters the *variants shown to the user for
selection* against `available !== false`, but does **not** validate the
already-selected cart item's variant against current availability. A
customer who added the blocked variant to their cart at 2pm can still
complete checkout at 3pm, paying for something we can't ship.

In practice:
- Cart contents churn fast (most people don't leave items in cart
  for hours)
- The block stops *new* additions because the UI won't offer the
  size/color
- Any legacy-cart order that slips through → handle manually (refund
  or ship the available size with apology)

If closing this gap becomes worthwhile, add a server-side check in
`app/api/orders/create/route.ts` (or the equivalent) that reads each
order item's `productId + selectedSize + selectedColor` and rejects
the order if `ProductVariant.available === false` for that combination.

### Product description copy

`lib/products.ts` often has marketing blurbs mentioning both sizes
(e.g., `'50g (Homecare) / 250g (Professional)'`). You don't need to
touch this for a temporary stock-out — it's ad copy, not ordering
surface. The size picker itself won't offer the blocked size, so
customers can't act on it.

For long-term stock-outs (weeks+) consider updating the description
to avoid confusion.

### Cache lag on mobile

Mobile app users still see the blocked variant as available for up to
5 minutes after the DB change. Acceptable for a planned stock-out;
less acceptable for an emergency block. If you need instant
propagation to the mobile app:

1. Flip the DB via script
2. Hit any admin endpoint that calls `revalidateTag('products')` —
   e.g., save any product in the admin panel with no real change
3. The mobile app's next fetch gets fresh data

## Restore procedure

When stock is replenished:

```bash
# 1. Flip DB flags back
set -a && source .env.local && set +a
npx tsx scripts/<your script>.ts restore-<variant>

# 2. Revert the commit that blocked it (or manually remove the
#    product-specific temp branches you added)
git revert <commit-sha>
git push origin main
```

The restore script should set the previously-blocked variant back to
`available=true` and re-select whichever variant was previously default
(or leave the promoted variant as the new default if stock levels
suggest that's correct going forward).

## Reference implementation

- **Script**: `scripts/set-hyaluron-cream-availability.ts`
- **Commit**: `58eeb5ca` (block 50g) — see
  `docs/SESSION_CHANGES_2026-04-18.md` § Stock management: hyaluron
  cream 50g
- **DB schema**: `prisma/schema.prisma` → `ProductVariant` model
