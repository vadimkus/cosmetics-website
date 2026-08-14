# Product 10 Snow O₂ Cleanser main image — 2026-08-15

## Scope

Main-image-only replacement for product 10, SNOW O₂ CLEANSER.

- Old main: `/images/cleanser/Main.jpg`
- New main: `/images/cleanser/main_clean.jpeg`
- Gallery before and after: S1–S6, unchanged
- `Main.jpg` stays on disk. Historical emails already sent still point at it.

The old packshot had generator garbage on both labels. The new file is the
2048 × 2048 studio shot Vadim selected (`main_clean.jpeg`, 798 KB), shipped
under a new name because `/images/*` is immutable for a year.

## Safe deployment

1. Commit and push `main_clean.jpeg` plus the static fallbacks.
2. Wait until `https://genosys.ae/images/cleanser/main_clean.jpeg` returns 200.
3. Then run:

```bash
npx tsx --env-file=.env.local scripts/update-product-10-main-image-20260815.ts --apply
```

The script HEADs the live asset first and refuses to write while it 404s.
It updates only `product.image`, preserves the gallery string byte-for-byte,
and repoints historical order items plus the one blog that still named
`Main.jpg` (`uae-summer-skincare-survival-guide-2026`).

## Repository fallbacks

- `lib/products.ts`
- `lib/routineStepImages.ts`
- `components/profile/OrderHistory.tsx`
- `app/animation/components/ProductCardDemo.tsx`

`data/productConfig.ts` has no gallery override for product 10.
