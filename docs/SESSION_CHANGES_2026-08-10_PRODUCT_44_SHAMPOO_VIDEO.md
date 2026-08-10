# Product 44 shampoo video — 2026-08-10

## Change
Attached product video to **HR³ MATRIX MEDI SCALP SHAMPOO α** (`/products/44`).

- Asset: `public/videos/shamp.mp4` (~1.7 MB, 405×720)
- DB `videoUrl`: `/videos/shamp.mp4`
- `data/productConfig.ts` product `44.videoUrl`
- `lib/products.ts` product `44.videoUrl`

## Verify
- https://genosys.ae/products/44 — “Watch product video” should play `/videos/shamp.mp4`
- Mobile API returns `videoUrl` from DB (no OTA needed)
