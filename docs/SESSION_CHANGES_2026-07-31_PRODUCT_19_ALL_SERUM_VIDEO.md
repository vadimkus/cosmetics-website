# Session Changes — 2026-07-31 — All For Sensitive Serum product video

## What

Added product video on **ALL FOR SENSITIVE SERUM (product 19)** as
`/videos/all_serum.mp4`. File existed as unused `allserum.mp4` earlier; this
wires the new compressed drop.

## How

- Source: `public/videos/all_serum.mp4` (dropped by user, **22 MB**, 1080×1920, ~17 s).
- Compressed with ffmpeg (`scale=720:-2`, x264 CRF 28, preset slow, faststart, AAC 96k)
  → **1.3 MB** as `public/videos/all_serum.mp4` (720×1280).
- DB: product 19 `videoUrl` → `/videos/all_serum.mp4`.
- Config: `data/productConfig.ts` product 19 `videoUrl` → `/videos/all_serum.mp4`.
- Fallback: `lib/products.ts` product 19 `videoUrl` → `/videos/all_serum.mp4`.

## Verify

- `https://genosys.ae/videos/all_serum.mp4` → 200 after deploy
- PDP `https://genosys.ae/products/19` shows the new video player
- Mobile API `products/19` returns `videoUrl: /videos/all_serum.mp4`
