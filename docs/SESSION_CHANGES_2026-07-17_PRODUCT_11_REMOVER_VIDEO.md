# Session Changes — 2026-07-17 — Skin Defender Remover product video

## What

Added a product video to **SKIN DEFENDER LIP & EYE MAKEUP REMOVER (product 11)**,
same pattern as cleanser / problem / overnight / mist videos.

## How

- Source: `public/videos/remover.mp4` (Dropbox, **30 MB**, 1080×1920, 14.5 s).
- Compressed with ffmpeg (`scale=720:-2`, x264 CRF 28, preset slow, faststart, AAC 96k)
  → **1.0 MB**, replaced in place.
- DB: product 11 `videoUrl` → `/videos/remover.mp4` (API-driven — web PDP and mobile app).

## Verify

- `https://genosys.ae/videos/remover.mp4` → 200 after deploy
- PDP `https://genosys.ae/products/11` shows the video player
