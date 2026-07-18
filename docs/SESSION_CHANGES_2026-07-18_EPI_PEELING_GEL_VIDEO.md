# Session Changes — 2026-07-18 — EPI Peeling Gel product video

## What

Added a product video to **EPI TURNOVER BOOSTING PEELING GEL (product 12)**,
same pattern as remover / overnight / mist / peptide videos.

## How

- Source: `public/videos/epi.mp4` (Dropbox, **2.7 MB**, 405×720, portrait).
- DB: product 12 `videoUrl` → `/videos/epi.mp4` via `scripts/set-product-video.ts`
  (drives web PDP + mobile app, no OTA).

## Verify

- `https://genosys.ae/videos/epi.mp4` → 200 after deploy
- PDP `https://genosys.ae/products/12` shows the video player
- Mobile API `products/12` returns `videoUrl: /videos/epi.mp4`
