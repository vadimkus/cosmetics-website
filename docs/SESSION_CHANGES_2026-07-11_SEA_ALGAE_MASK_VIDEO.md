# Session — Product Video: Soothing Bomb Sea Algae Mask (2026-07-11)

## What was done

Added a product video to https://genosys.ae/products/36 (SOOTHING BOMB SEA
ALGAE MASK).

- Source: Vadim dropped `sea_mask.mp4` (33 MB, 1080×1920, 15s, 18 Mbps H.264,
  from Dropbox) into `public/videos/`
- Re-encoded with ffmpeg (libx264 CRF 22, slow preset, faststart, AAC 128k) →
  **3.1 MB @ 1.7 Mbps** — in line with the other product videos (1.5–10 MB)
- Set `videoUrl = /videos/sea_mask.mp4` on product `36` via the existing
  `scripts/set-product-video.ts` helper
- Committed the video (`62ff1b29`) and pushed; verified live:
  - `https://genosys.ae/videos/sea_mask.mp4` → HTTP 200
  - product 36 API returns `videoUrl: /videos/sea_mask.mp4`

## Notes

- Product videos live on the `videoUrl` DB field; web PDP gallery and mobile
  app pick it up automatically (API-driven — no OTA needed).
- Videos under `/videos/` are cached immutable — if the clip ever changes,
  use a NEW filename (same rule as `/images/*`).
