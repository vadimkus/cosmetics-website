# Session Changes — 2026-07-31 — Revita Glow BB Cream product video

## What

Added product video on **REVITA GLOW BLEMISH BALM CREAM (product 63)** as
`/videos/revita.mp4`.

## How

- Source already web-sized: **767 KB**, 720×1280, ~13 s (no further compress).
- DB: product 63 `videoUrl` → `/videos/revita.mp4`.
- Config: `data/productConfig.ts` product 63 `videoUrl` → `/videos/revita.mp4`.
- Fallback: `lib/products.ts` product 63 `videoUrl` → `/videos/revita.mp4`.

## Verify

- `https://genosys.ae/videos/revita.mp4` → 200 after deploy
- PDP `https://genosys.ae/products/63` shows the video player
- Mobile API `products/63` returns `videoUrl: /videos/revita.mp4`
