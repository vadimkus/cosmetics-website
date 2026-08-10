# Product 35 Hydro Cool Modeling Mask video — 2026-08-10

## Change
Attached product video to **HYDRO COOL MODELING MASK** (`/products/35`).

- Asset: `public/videos/hydro.mp4` (19.6 MB → **698 KB**, 720×1280)
- Compression: `ffmpeg scale=720:-2`, x264 CRF 28, preset slow, faststart, AAC 96k
- DB `videoUrl`: `/videos/hydro.mp4`
- `data/productConfig.ts` product `35.videoUrl`
- `lib/products.ts` product `35.videoUrl`

## Verify
- https://genosys.ae/products/35 — “Watch product video” should play `/videos/hydro.mp4`
- Mobile API returns `videoUrl` from DB (no OTA needed)
