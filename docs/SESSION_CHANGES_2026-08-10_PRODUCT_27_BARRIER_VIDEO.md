# Product 27 barrier cream video replace — 2026-08-10

## Change
Replaced product video on **SKIN BARRIER PROTECTING CREAM** (`/products/27`).

- New asset: `public/videos/barrier2.mp4` (~18.5 MB, 1080×1920)
- Previous: `/videos/barrier.mp4` (kept in repo; no longer linked to product 27)
- DB `videoUrl`: `/videos/barrier2.mp4`
- `data/productConfig.ts` product `27.videoUrl`
- `lib/products.ts` product `27.videoUrl`

## Verify
- https://genosys.ae/products/27 — “Watch product video” plays `/videos/barrier2.mp4`
- Mobile API returns updated `videoUrl` from DB
