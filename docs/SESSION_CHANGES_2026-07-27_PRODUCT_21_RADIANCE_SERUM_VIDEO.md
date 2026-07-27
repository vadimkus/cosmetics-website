# Session Changes — 2026-07-27 — Multi Vita Radiance Serum product video

## What

Replaced product video on **MULTI VITA RADIANCE SERUM (product 21)** with
`/videos/radiance_serum.mp4`. Removed old `/videos/rserum.mp4`.

## How

- Source: `public/videos/radiance_serum.mp4` (dropped by user, **13.9 MB**, 1080×1920, ~12 s).
- Compressed with ffmpeg (`scale=720:-2`, x264 CRF 28, preset slow, faststart, AAC 96k)
  → **491 KB** as `public/videos/radiance_serum.mp4`.
- DB: product 21 `videoUrl` → `/videos/radiance_serum.mp4`.
- Config: `data/productConfig.ts` product 21 `videoUrl` → `/videos/radiance_serum.mp4`.
- Fallback: `lib/products.ts` product 21 `videoUrl` → `/videos/radiance_serum.mp4`.
- Deleted: `public/videos/rserum.mp4`.

## Verify

- `https://genosys.ae/videos/radiance_serum.mp4` → 200 after deploy
- PDP `https://genosys.ae/products/21` shows the new video player
- Mobile API `products/21` returns `videoUrl: /videos/radiance_serum.mp4`
- `https://genosys.ae/videos/rserum.mp4` → 404
