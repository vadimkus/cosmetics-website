# Session Changes — 2026-07-05 — Product 51 Main Image Swap

## Request

For https://genosys.ae/products/51 (BIO-FERMENT AGE DEFYING POWDER MASK):
- Use the new studio shot `public/images/bio_ferment/bferment_main.jpg`
  (1024×1024, 412 KB) as the main image.
- Remove the crossed-out gallery image (plain white jar render
  `/images/Second/ferment_big.jpg`).

## Changes

### DB (`scripts/update-product-51-main-image.ts`)

- `image`: `/images/BFAD.png` → `/images/bio_ferment/bferment_main.jpg`
- `images`: was `null` (gallery previously lived in `data/productConfig.ts`) →
  `["/images/BFAD.png","/images/Third/Ferment_3.jpeg","/images/Third/ferment_high.jpeg"]`
- Gallery = main + 3 images (4 thumbnails). Note: DB row for 51 has no
  `productNumber` set — lookup needs `OR: [{ productNumber: '51' }, { id: '51' }]`.

### Code

- `data/productConfig.ts` — removed the legacy `images` array for '51'
  (config wins over DB; gallery migrated to DB-only per the gallery rule).
- `lib/products.ts` — product 51 static fallback `image` updated.
- `/images/BFAD.png` kept — now a gallery image (jar + bowl scene).
- `/images/Second/ferment_big.jpg` kept in repo (immutable-cache habit),
  no longer referenced by any code.

### Mobile app (separate repo)

- `data/productConfig.js` '51' fallback images synced (API-driven, no OTA).
