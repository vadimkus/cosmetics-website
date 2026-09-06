# 2026-09-06: Product 44 extra slide; Needle Pen-K card leak

## Product 44 (HR3 MATRIX MEDI SCALP SHAMPOO)
- New slide `public/images/shampoo_o/S7a.jpeg` ("These are 3 minutes you actually want to stay in"), placed after S7. The three-minute dwell is on the Russian panel and already in `mediShampooCopy.ts`.
- Gallery updated in DB (`scripts/set-product-44-slides-20260906.ts --apply`), `lib/products.ts`, cache key bumped to `product-by-id-v71`.
- Lesson repeated: never `os.remove('s7a.jpeg')` after writing `S7a.jpeg` on macOS; the original on `~/Desktop/Insta_Olga/shampoo_o/` saved the day.

## Needle Pen-K (product 2) on the grid
Hidden in the database since August, but `lib/products.ts` (the static catalogue served on a DB outage or Neon cold-start timeout) never got `isHidden: true`. Observed live: `/products` served 56 items including Needle Pen-K for about a minute, then the 63-item DB list.

Two fixes:
1. `isHidden: true` on the static row.
2. `getProductsListCached` no longer caches a fallback. The `unstable_cache` entry now wraps only the DB read; the static fallback is applied outside it, so a single failed read costs one request instead of poisoning the shared 60-second entry for all locales.

Commits `45949cf8`, plus the cache change.
