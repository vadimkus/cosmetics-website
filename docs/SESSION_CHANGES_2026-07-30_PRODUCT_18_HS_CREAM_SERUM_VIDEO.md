# Session Changes — 2026-07-30 — Moisture Replenishing Hyaluron Serum product video

## What

Added product video on **MOISTURE REPLENISHING HYALURON SERUM (product 18)** as
`/videos/hs_cream_serum.mp4`. No previous video on this product.

## How

- Source: `public/videos/hs_cream_serum.mp4` (dropped by user, **42 MB**, 1080×1920, ~19 s).
- Compressed with ffmpeg (`scale=720:-2`, x264 CRF 28, preset slow, faststart, AAC 96k)
  → **1.4 MB** as `public/videos/hs_cream_serum.mp4` (720×1280).
- DB: product 18 `videoUrl` → `/videos/hs_cream_serum.mp4`.
- Config: `data/productConfig.ts` product 18 `videoUrl` → `/videos/hs_cream_serum.mp4`.
- Fallback: `lib/products.ts` product 18 `videoUrl` → `/videos/hs_cream_serum.mp4`.

## Verify

- `https://genosys.ae/videos/hs_cream_serum.mp4` → 200 after deploy
- PDP `https://genosys.ae/products/18` shows the new video player
- Mobile API `products/18` returns `videoUrl: /videos/hs_cream_serum.mp4`
