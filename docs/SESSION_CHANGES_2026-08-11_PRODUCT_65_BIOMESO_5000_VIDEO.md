# Product 65 Bio-Meso PDRN Homecare Ampoule 5000 video — 2026-08-11

## Change
Attached product video to **Bio-Meso PDRN Homecare Ampoule 5000** (`/products/65`).

- Asset: `public/videos/5000.mp4` (14.5 MB → **437 KB**, 720×1280)
- Compression: `ffmpeg scale=720:-2`, x264 CRF 28, preset slow, faststart, AAC 96k
- DB `videoUrl`: `/videos/5000.mp4`
- `data/productConfig.ts` product `65.videoUrl`
- `lib/products.ts` product `65.videoUrl`

## Verify
- https://genosys.ae/products/65 — “Watch product video” should play `/videos/5000.mp4`
- Mobile API returns `videoUrl` from DB (no OTA needed)
