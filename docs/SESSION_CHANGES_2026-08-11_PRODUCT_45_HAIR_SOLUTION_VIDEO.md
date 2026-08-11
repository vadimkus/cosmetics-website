# Product 45 HR³ MATRIX HAIR SOLUTION α video — 2026-08-11

## Change
Attached product video to **HR³ MATRIX HAIR SOLUTION α** (`/products/45`).

- Asset: `public/videos/hairs.mp4` (12 MB → **1.1 MB**, 720×1280)
- Compression: `ffmpeg scale=720:-2`, x264 CRF 28, preset slow, faststart, AAC 96k
- DB `videoUrl`: `/videos/hairs.mp4`
- `data/productConfig.ts` product `45.videoUrl`
- `lib/products.ts` product `45.videoUrl`

## Verify
- https://genosys.ae/products/45 — “Watch product video” should play `/videos/hairs.mp4`
- Mobile API returns `videoUrl` from DB (no OTA needed)
