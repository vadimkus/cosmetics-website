# Product 60 Bio Meso PDRN Ampoule 60000 video — 2026-08-11

## Change
Attached product video to **Bio Meso PDRN Ampoule 60000** (`/products/60`).

- Asset: `public/videos/60000.mp4` (12 MB → **429 KB**, 720×1280)
- Compression: `ffmpeg scale=720:-2`, x264 CRF 28, preset slow, faststart, AAC 96k
- DB `videoUrl`: `/videos/60000.mp4`
- `data/productConfig.ts` product `60.videoUrl`
- `lib/products.ts` product `60.videoUrl`

## Verify
- https://genosys.ae/products/60 — “Watch product video” should play `/videos/60000.mp4`
- Mobile API returns `videoUrl` from DB (no OTA needed)
