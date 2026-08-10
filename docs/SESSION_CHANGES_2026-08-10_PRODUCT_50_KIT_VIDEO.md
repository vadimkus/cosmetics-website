# Product 50 kit video — 2026-08-10

## Change
Attached product video to **EyeCell EYE ZONE CARE KIT** (`/products/50`).

- Asset: `public/videos/kit.mp4` (1080×1920, ~25 MB)
- DB `videoUrl`: `/videos/kit.mp4`
- `data/productConfig.ts` product `50.videoUrl`
- `lib/products.ts` product `50.videoUrl`

## Verify
- https://genosys.ae/products/50 — “Watch product video” should play `/videos/kit.mp4`
- Mobile API returns `videoUrl` from DB (no OTA needed)
