# Product 10 Snow O₂ Cleanser video — 2026-08-11

## Change
Replaced product video on **SNOW O₂ CLEANSER** (`/products/10`).

- New asset: `public/videos/cleanser.mp4` (47 MB → **1.6 MB**, 720×1280)
- Compression: `ffmpeg scale=720:-2`, x264 CRF 28, preset slow, faststart, AAC 96k
- Previous: `/videos/cleanser_1607.mp4` (kept in repo; no longer linked)
- DB `videoUrl`: `/videos/cleanser.mp4`
- `data/productConfig.ts` product `10.videoUrl`
- `lib/products.ts` product `10.videoUrl`

## Verify
- https://genosys.ae/products/10 — “Watch product video” should play `/videos/cleanser.mp4`
- Mobile API returns `videoUrl` from DB (no OTA needed)
