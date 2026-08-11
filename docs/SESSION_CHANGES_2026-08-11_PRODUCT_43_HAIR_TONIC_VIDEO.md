# Product 43 HR³ MATRIX HAIR TONIC α video — 2026-08-11

## Change
Attached product video to **HR³ MATRIX HAIR TONIC α** (`/products/43`).

- Asset: `public/videos/hairt.mp4` (8.9 MB → **907 KB**, 720×1280)
- Compression: `ffmpeg scale=720:-2`, x264 CRF 28, preset slow, faststart, AAC 96k
- DB `videoUrl`: `/videos/hairt.mp4`
- `data/productConfig.ts` product `43.videoUrl`
- `lib/products.ts` product `43.videoUrl`

## Verify
- https://genosys.ae/products/43 — “Watch product video” should play `/videos/hairt.mp4`
- Mobile API returns `videoUrl` from DB (no OTA needed)
