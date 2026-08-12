# Product 56 Skin Brightening Beauty Box main image v3 — 2026-08-12

## Scope

Main-image-only replacement for product 56, SKIN BRIGHTENING BEAUTY BOX.

- Old main: `/images/bbbox_brightening/main2.png`
- New main: `/images/bbbox_brightening/main3.jpeg`
- DB gallery before and after: `null`

## Asset

- 1024 × 1024 JPEG, 455,371 bytes
- SHA-256 `0587728e3276b0f5d03fb7a58afb3967755d1340ae2366b570fbeae63c24eb4d`

## Steps

1. Deploy `main3.jpeg` (new cache-safe filename)
2. Update product 56 `image` + repoint order/blog refs
3. Delete obsolete `main2.png` after dead-image audit

## Script

`scripts/update-product-56-main-image.ts`
