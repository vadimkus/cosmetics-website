# Product 66 Cerabarrier main image — 2026-08-15

## Scope

Main-image-only replacement for product 66, CERABARRIER BIOME GEL CLEANSER.

- Old main: `/images/cera/main2.jpeg`
- New main: `/images/cera/main3.jpeg` (2000 × 2000, 368 KB)
- Source: Finder `cera/main3.png` (2048 × 2048, 3.2 MB). PNG is not shipped.
- Gallery before and after: S1–S5, unchanged. New main is not in `images`.
- `main2.jpeg` and `main.jpeg` stay on disk. Historical emails already sent still point at `main2`.

The new file is the two-bottle packshot Vadim selected (600 ml left, 200 ml right). It ships under a new name because `/images/*` is immutable for a year.

## Safe deployment

1. Commit and push `main3.jpeg` plus the static fallbacks.
2. Wait until `https://genosys.ae/images/cera/main3.jpeg` returns 200.
3. Then run:

```bash
npx tsx --env-file=.env.local scripts/update-product-66-main-image-20260815.ts --apply
```

The script HEADs the live asset first and refuses to write while it 404s.
It updates only `product.image`, preserves the gallery string byte-for-byte,
and repoints historical order items plus any blog that still names `main2.jpeg`.

4. Out-of-band Prisma writes do not `revalidateTag('products')`. After apply,
   bump `product-by-id-v4` → `product-by-id-v5` in `lib/productsDb.ts` and push.

## Repository fallbacks

- `lib/routineStepImages.ts`
- `lib/seoLandingPages.ts`
- `lib/seoLandingPagesAr.ts`
- `lib/seoLandingPagesRu.ts`
- `__tests__/components/ProductOptionDialog.test.tsx`

Training thumbs stay on `/images/cera/main.jpeg`.
`data/productConfig.ts` has no gallery override for product 66.

## Applied

Pending the live 200 and `--apply`.
