# Product 58 Anti-Aging Beauty Box main image — 2026-08-08

## Scope

Main-image-only replacement for product 58, ANTI-AGING BEAUTY BOX.

- Old main: `/images/beauty_boxes/Anti_aging_box.jpeg`
- New main: `/images/bbox_age/main.jpg`
- DB gallery before and after: `null`
- No gallery image was added, removed, replaced, or reordered.
- Quick Facts, box contents, descriptions, pricing, routines, API behavior and
  every other Beauty Box were left unchanged.
- No native-app OTA was required because product images are API-driven.

## Safe deployment

1. Confirmed `bbox_age/main.jpg` had never appeared in Git history.
2. Deployed only the new 1408 × 1408 baseline JPEG asset (326,654 bytes,
   SHA-256 `0000adc00e270a5d4335d92a3c959a35462a2c1df7e714138379a9b6ac19986d`).
3. Waited for production deployment `dpl_49tZitZJRGpx1DyNny8WY6MokNXP`
   to become Ready.
4. Verified the production URL returned HTTP 200, `image/jpeg`, the expected
   dimensions and exact SHA-256 hash.
5. Updated only product 58's DB `image` field while preserving `images` exactly.
6. Repointed 39 historical order-item images. No database blog record referenced
   the old main.

## Repository references

Product 58 is a newer database-backed CUID product. It has no entry in
`lib/products.ts` or `data/productConfig.ts`, and repository search found no
static/admin/order-history/email fallback using the former path. No synthetic
static catalog or config-gallery override was introduced.

Reusable idempotent dry-run/apply migration:

`scripts/update-product-58-main-image.ts`

The script handles relative, `genosys.ae`, and `www.genosys.ae` order and blog
references and rewrites `featuredImage`, `content`, `contentAr`, and `contentRu`.

## Old asset disposition

After migration, the former image had zero product-main, product-gallery,
order-item, blog, or code references. The dead-order-image audit also reported
zero repairable and zero unresolved rows, so the obsolete tracked asset was
deleted.

## Deployment

- Asset commit: `6b44ae7b` (`Deploy Anti-Aging Beauty Box image`)
- Asset deployment: `dpl_49tZitZJRGpx1DyNny8WY6MokNXP` — Ready
- Final migration commit and deployment are recorded in the deployment handoff.
