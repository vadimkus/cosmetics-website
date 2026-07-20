# Session Changes — 2026-07-20 — Ultra Shield Sun Cream product video

## What

Replaced the product video on **ULTRA SHIELD SUN CREAM [SPF 50+ PA++++] (product 39)**
with the new Dropbox source `ultra.mp4`.

## How

- Source: `public/videos/ultra.mp4` (Dropbox, **23 MB**, 1080×1920, ~11 s).
- Compressed with ffmpeg (`scale=720:-2`, x264 CRF 28, preset slow, faststart, AAC 96k)
  → **776 KB**, replaced in place.
- DB: product 39 `videoUrl` → `/videos/ultra.mp4` via `scripts/set-product-video.ts`.
- Config: `data/productConfig.ts` product 39 `videoUrl` → `/videos/ultra.mp4`
  (config wins over DB in the pricing engine merge).
- Fallback: `lib/products.ts` product 39 `videoUrl` → `/videos/ultra.mp4`.
- Deleted old file: `public/videos/spf50.mp4` (~5.5 MB).

## Verify

- `https://genosys.ae/videos/ultra.mp4` → 200 after deploy
- PDP `https://genosys.ae/products/39` shows the new video player
- Mobile API `products/39` returns `videoUrl: /videos/ultra.mp4`
- Old URL `https://genosys.ae/videos/spf50.mp4` → 404 after deploy
