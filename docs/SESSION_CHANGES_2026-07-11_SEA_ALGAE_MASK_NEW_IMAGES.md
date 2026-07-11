# Session — Sea Algae Mask New Imagery (2026-07-11)

## Context

Vadim dropped a new image set into `public/images/sea_algae/` (Main.jpeg +
S1–S6.jpeg, 1024×1024) and asked to replace product 36's images and delete the
old ones.

## What was done

1. **Recompressed** S1–S6 to ≤ ~270 KB each (were up to 666 KB); Main was
   already 426 KB. All ≤ 500 KB per the gallery rule.
2. **Committed + deployed** the new files first (commit `c75aa329`), waited for
   Vercel, verified all 7 URLs return 200.
3. **DB product `36`**:
   - `image` → `/images/sea_algae/Main.jpeg`
   - `images` → `["S1".."S6"]` (main NOT included — web + app prepend it)
   - `data/productConfig.ts` has no `images` for '36', so DB gallery wins. ✓
4. **Repointed 281 historical `orderItem` rows** whose `image` was
   `/images/SEA.jpg` → `/images/sea_algae/Main.jpeg` so old order thumbnails
   don't 404 after deletion.
5. **Code references updated** from `/images/SEA.jpg`:
   - web: `lib/products.ts`, `components/profile/OrderHistory.tsx`,
     `components/FreeMaskPromotion.tsx`,
     `app/animation/components/ProductCardDemo.tsx`
   - app: `contexts/CartContext.js`, `app/(tabs)/bag.js` (promo images)
6. **Deleted old files** `public/images/SEA.jpg` and
   `public/images/Second/green.jpeg` (commit `6051cb0c`) after confirming no
   remaining code/DB references.
7. **App OTA** published (update group `cc92f24d-8cb5-4e70-9e63-f4ea98baa707`,
   commit `ad4591b`) for the promo image references. Product/gallery images in
   the app are API-driven and updated instantly.

## Verified live

- All 7 `/images/sea_algae/*.jpeg` URLs → HTTP 200
- Product 36 API serves new `image` + 6-slide gallery

## Note

Old `/images/SEA.jpg` is cached immutable (1 year) in browsers/PWA caches of
repeat visitors — they may still *display* it from cache wherever it was seen
before, but all live references now point at the new set.
