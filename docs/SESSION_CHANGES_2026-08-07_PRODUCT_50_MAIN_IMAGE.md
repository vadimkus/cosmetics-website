# Product 50 EyeCell kit main image — 2026-08-07

## Scope

Main-image-only update for product 50, EyeCell EYE ZONE CARE KIT.

- Old main: `/images/EYEZ.jpg`
- New main: `/images/eye_kit/main.jpeg`
- DB gallery preserved exactly:
  `["/images/EYEZ.jpg","/images/Second/ekit_big.jpg"]`
- No new gallery images were added, replaced, reordered, or deleted.
- Product 33 EyeCell EYE PEPTIDE GEL PATCH was not changed.
- No mobile OTA was required because the mobile product data is API-driven.

## Safe deployment

1. Deployed only the new 1254 × 1254 progressive JPEG asset (150,386 bytes,
   SHA-256 `5de20c43540ead45649295911dca4f75b1491439ffbbc66c53f69d5a9bc553d6`).
2. Waited for production deployment Ready and verified the direct URL returned
   HTTP 200, `image/jpeg`, and the expected dimensions and hash.
3. Updated the product DB `image` field only and preserved the exact `images`
   string.
4. Removed the legacy product-config gallery override so the current DB main is
   prepended automatically while the unchanged DB gallery remains authoritative.
5. Updated static fallback and EN/RU/AR training/profile/mobile-training image
   references.
6. Repointed 8 historical order-item images. No database blog records referenced
   the old path.

## Asset retention

The old `/images/EYEZ.jpg` asset is retained because it remains an intentional
member of product 50's preserved DB gallery. `/images/Second/ekit_big.jpg` is
also retained. The dead-order-image audit reported zero repairable and zero
unresolved rows before the migration.

## Migration

Reusable dry-run/apply script:

`scripts/update-product-50-main-image.ts`

The script is idempotent, updates only the product main field, preserves the
gallery string byte-for-byte, handles relative and absolute `genosys.ae`
historical order references, and rewrites matching blog image references in
`featuredImage`, `content`, `contentAr`, and `contentRu`.
