# Session Changes — 2026-07-28 — Multi Functional Anti-Wrinkle Serum product video

## What

Added product video on **MULTI FUNCTIONAL ANTI-WRINKLE SERUM (product 22)** as
`/videos/multif_serum.mp4`. No previous video on this product.

## How

- Source: `public/videos/multif_serum.mp4` (dropped by user, **33.8 MB**, 1080×1920, ~15 s).
- Compressed with ffmpeg (`scale=720:-2`, x264 CRF 28, preset slow, faststart, AAC 96k)
  → **865 KB** as `public/videos/multif_serum.mp4`.
- DB: product 22 `videoUrl` → `/videos/multif_serum.mp4`.
- Config: `data/productConfig.ts` product 22 `videoUrl` → `/videos/multif_serum.mp4`.
- Fallback: `lib/products.ts` product 22 `videoUrl` → `/videos/multif_serum.mp4`.

## Verify

- `https://genosys.ae/videos/multif_serum.mp4` → 200 after deploy
- PDP `https://genosys.ae/products/22` shows the new video player
- Mobile API `products/22` returns `videoUrl: /videos/multif_serum.mp4`
