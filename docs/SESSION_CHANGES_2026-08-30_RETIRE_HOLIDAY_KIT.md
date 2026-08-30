# Holiday Kit retired — 30 Aug 2026

Product 54, the seasonal gift box. Not coming back.

## Hidden, not deleted

`isHidden: true` on the row, the same treatment products 2 (Needle Pen-K) and
26 (EGF Repair Oxymask Cream) already had. Deleting would leave anything that
still points at the product resolving to nothing.

In this case it had **0 order items and 1 wishlist row**, so a delete would
have been survivable, but there is no reason to make this one an exception to
how the other two were handled. The wishlist API already skips hidden products
and keeps the row, so it simply drops out of that person's list.

## What this switches off by itself

`isHidden` is honoured in 42 files, so most surfaces need no change:
the products grid, search, sitemap, the product XML feed, `llms-full.txt`,
`ai-products.txt`, the chatbot catalogue, concern counts, home data, the bundle
builder, homecare, the partner portal, and every mobile API route.

The mobile app needs no OTA. Its category chips are the allowed order
intersected with the categories actually present in the API response, and the
API no longer returns this one, so "Holiday Kits" disappears on its own.

## What had to be changed by hand

- **`lib/products.ts`** — the static fallback the site serves during a database
  outage. It is a separate copy of the catalogue and does not read the flag
  from the database.
- **`app/products/ProductsPageClient.tsx`** — the category filter list is
  written out by hand rather than derived from stock, and product 54 was the
  only thing in the kits category. Left alone it would have offered a Holiday
  kits filter that returned an empty grid. The partner portal does drop empty
  groups, so it needed nothing.
- **`components/product/ProductImageGallery.tsx`** — 75 lines of falling stars
  and sparkles that only ever ran for this product, keyed on its id, its
  product number and its category. Removed along with the now-unused `useMemo`
  import. The `animate-sparkle` keyframes stay: the power-animal game uses them.

## Left in place deliberately

The translations, quick facts, MoySklad mapping and the app's name-based
holiday badge. All of it is either needed to render a name for an existing
reference or is generic enough to apply to a future seasonal box.

## Note

The static fallback in `lib/products.ts` is not what the live site reads. The
July retirement of product 26 set the flag there, and it was the database write
that actually took it out of the listings. Both need doing.
