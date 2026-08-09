# Product 56 Skin Brightening Beauty Box main image — 2026-08-09

## Scope

Main-image-only replacement for product 56, SKIN BRIGHTENING BEAUTY BOX.

- Old main: `/images/beauty_boxes/Skin_brightening_box.jpeg`
- New main: `/images/bbbox_brightening/main.jpeg`
- DB gallery before and after: `null`
- No gallery image was added, removed, replaced, or reordered.
- Quick Facts, box contents, descriptions, pricing, routines, API behavior and
  every other Beauty Box were left unchanged.
- No native-app OTA was required because product images are API-driven.

## Safe deployment

1. Confirmed `bbbox_brightening/main.jpeg` had never appeared in Git history.
2. Inspected the supplied art at its exact path before use. It is a 1024 × 1024
   baseline JPEG, 589,345 bytes, SHA-256
   `73cc19850f4c3165f6e43160559180fa93af5415064f7c02dffbe03f845fc1ad`.
3. Deployed the supplied JPEG without recompression so the approved artwork was
   not degraded.
4. Waited for production deployment `dpl_FJ2hLjb6qVjiHhHmmWiqiTHfiuiK`
   to become Ready.
5. Verified the production URL returned HTTP 200, `image/jpeg`, the expected
   dimensions, byte size and exact SHA-256 hash.
6. Updated only product 56's DB `image` field while preserving `images` exactly.
7. Repointed 9 historical order-item images. No database blog record referenced
   the old main.

## Repository references

Product 56 is a newer database-backed CUID product. It has no image fallback in
`lib/products.ts` or `data/productConfig.ts`, and repository search found no
static/admin/order-history/email fallback using the former path. No synthetic
static catalog or config-gallery override was introduced.

Reusable idempotent dry-run/apply migration:

`scripts/update-product-56-main-image.ts`

The script handles relative, `genosys.ae`, and `www.genosys.ae` order and blog
references and rewrites `featuredImage`, `content`, `contentAr`, and `contentRu`.

## Old asset disposition

After migration, the former image had zero product-main, product-gallery,
order-item, blog, or static fallback references. The dead-order-image audit also
reported zero repairable and zero unresolved rows, so the obsolete tracked asset
was deleted.

## Deployment

- Asset commit: `1c921ff8` (`Deploy Skin Brightening Beauty Box image`)
- Asset deployment: `dpl_FJ2hLjb6qVjiHhHmmWiqiTHfiuiK` — Ready
- Final migration commit and deployment are recorded in the deployment handoff.
