# Session Changes — 2026-07-23 — BB Cushion product video

## What

Added the product video on **SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++] (product 41)**
from Dropbox source `cushion.mp4`.

## How

- Source: `public/videos/cushion.mp4` (Dropbox, **24 MB**, 1080×1920, ~11.6 s).
- Compressed with ffmpeg (`scale=720:-2`, x264 CRF 28, preset slow, faststart, AAC 96k)
  → **727 KB**, replaced in place.
- DB: product 41 `videoUrl` → `/videos/cushion.mp4` via `scripts/set-product-video.ts`.
- Config: `data/productConfig.ts` product 41 `videoUrl` → `/videos/cushion.mp4`
  (config wins over DB in the pricing engine merge).
- Fallback: `lib/products.ts` product 41 `videoUrl` → `/videos/cushion.mp4`.

## Verify

- `https://genosys.ae/videos/cushion.mp4` → 200 after deploy
- PDP `https://genosys.ae/products/41` shows the video player
- Mobile API `products/41` returns `videoUrl: /videos/cushion.mp4`
