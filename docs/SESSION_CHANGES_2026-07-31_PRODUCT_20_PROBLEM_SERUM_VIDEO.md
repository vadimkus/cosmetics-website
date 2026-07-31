# Session Changes — 2026-07-31 — Problem Control Serum product video

## What

Added product video on **PROBLEM CONTROL SERUM (product 20)** as
`/videos/problem_serum.mp4`.

## How

- Source: `public/videos/problem_serum.mp4` (user drop, **22.5 MB**, 1080×1920, ~14 s).
- Compressed with ffmpeg (`scale=720:-2`, x264 CRF 28, preset slow, faststart, AAC 96k)
  → **793 KB** as `public/videos/problem_serum.mp4` (720×1280).
- DB: product 20 `videoUrl` → `/videos/problem_serum.mp4`.
- Config: `data/productConfig.ts` product 20 `videoUrl` → `/videos/problem_serum.mp4`.
- Fallback: `lib/products.ts` product 20 `videoUrl` → `/videos/problem_serum.mp4`.

## Verify

- `https://genosys.ae/videos/problem_serum.mp4` → 200 after deploy
- PDP `https://genosys.ae/products/20` shows the video player
- Mobile API `products/20` returns `videoUrl: /videos/problem_serum.mp4`
