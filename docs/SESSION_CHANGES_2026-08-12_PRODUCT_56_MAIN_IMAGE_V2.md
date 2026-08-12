# Product 56 Skin Brightening Beauty Box main image v2 — 2026-08-12

## Scope

Main-image-only replacement for product 56, SKIN BRIGHTENING BEAUTY BOX.

- Old main: `/images/bbbox_brightening/main.jpeg`
- New main: `/images/bbbox_brightening/main2.png`
- DB gallery before and after: `null`
- No gallery image was added, removed, replaced, or reordered.
- Logo + BEAUTY BOX caption only (no cardboard box panel); product labels kept from the sharp source photo.

## Safe deployment

1. New filename (`main2.png`) — never replaced `main.jpeg` in place (immutable CDN cache).
2. Asset: 1024 × 1024 PNG, RGB, 616,865 bytes, SHA-256
   `1fea25f0ba6475411578e249fed05292bb52ea7c618f0d1a26fab2cc0ddf1ccf`.
3. Deploy asset to production first, then update only product 56 `image`.
4. Repoint historical order-item images from `main.jpeg` → `main2.png`.
5. Delete obsolete `main.jpeg` after references are cleared and dead-image audit is clean.

## Script

`scripts/update-product-56-main-image.ts` (idempotent dry-run / `--apply`)

## Done

- Asset commit: `84f239e8` — live at `https://genosys.ae/images/bbbox_brightening/main2.png` (HTTP 200, hash match)
- DB: product 56 `image` → `/images/bbbox_brightening/main2.png`; gallery still `null`
- Repointed 9 order items; blogs 0; dead-image audit 0/0
- Deleted `main.jpeg` in commit `750624f1`
