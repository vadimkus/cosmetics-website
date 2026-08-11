# Product 16 Snow Booster video — 2026-08-11

## Change
Attached product video to **SNOW BOOSTER** (`/products/16`).

- Asset: `public/videos/booster.mp4` (19 MB → **456 KB**, 720×1280)
- Compression: `ffmpeg scale=720:-2`, x264 CRF 28, preset slow, faststart, AAC 96k
- DB `videoUrl`: `/videos/booster.mp4`
- `data/productConfig.ts` product `16.videoUrl`
- `lib/products.ts` product `16.videoUrl`

## Verify
- https://genosys.ae/products/16 — “Watch product video” should play `/videos/booster.mp4`
- Mobile API returns `videoUrl` from DB (no OTA needed)
