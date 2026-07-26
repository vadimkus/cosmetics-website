# Session Changes — 2026-07-26 — Multi Vita Radiance Cream product video

## What

Added product video on **MULTI VITA RADIANCE CREAM (product 31)** as
`/videos/radiance.mp4`.

## How

- Source: `public/videos/radiance.mp4` (dropped by user, **32 MB**, 1080×1920, ~22 s).
- Compressed with ffmpeg (`scale=720:-2`, x264 CRF 28, preset slow, faststart, AAC 96k)
  → **721 KB** as `public/videos/radiance.mp4`.
- DB: product 31 `videoUrl` → `/videos/radiance.mp4`.
- Config: `data/productConfig.ts` product 31 `videoUrl` → `/videos/radiance.mp4`.
- Fallback: `lib/products.ts` product 31 `videoUrl` → `/videos/radiance.mp4`.

## Verify

- `https://genosys.ae/videos/radiance.mp4` → 200 after deploy
- PDP `https://genosys.ae/products/31` shows the video player
- Mobile API `products/31` returns `videoUrl: /videos/radiance.mp4`
