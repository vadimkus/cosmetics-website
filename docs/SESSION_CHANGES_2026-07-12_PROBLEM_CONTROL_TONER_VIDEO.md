# Session Changes — 2026-07-12 — Problem Control Toner product video

## What

Added a product video to **Intensive Problem Control Toner (product 15)**,
same pattern as bio/sea_mask/mist/reboot/overnight videos.

## How

- Source: `problem.mp4` (Dropbox download, 38.4 MB, 1080×1920, 17.5 s) —
  user had already dropped it into `public/videos/`.
- Compressed with ffmpeg (`scale=720:-2`, x264 CRF 28, faststart, AAC 96k)
  → **1.06 MB**, replaced the uncompressed file in place (was never
  committed, so no cache concern).
- DB: product 15 `videoUrl` → `/videos/problem.mp4` (API-driven — web PDP
  and mobile app pick it up with no app update).
- Commit `d3a49ecd`, pushed to main, Vercel deploy.

## Verify

- `https://genosys.ae/videos/problem.mp4` returns 200 after deploy.
- PDP `https://genosys.ae/products/15` shows the play button on the main
  image; player auto-collapses when the video ends (existing behavior).
