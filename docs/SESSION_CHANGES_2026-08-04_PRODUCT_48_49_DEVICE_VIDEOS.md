# Products 48 and 49 device videos — 2026-08-04

## What

Added portrait product videos for:

- **Hair-GENTRON (product 48)** → `/videos/gentron.mp4`
- **GENO-LED IR II (product 49)** → `/videos/led.mp4`

## Compression

Both source files were 1080×1920 H.264/AAC and were compressed for web and
mobile delivery with ffmpeg: `scale=720:-2`, H.264 CRF 28, slow preset,
AAC 96 kbps, and `faststart`.

- `gentron.mp4`: 47.0 MB / 10.0 s → 438 KB / 720×1280
- `led.mp4`: 38.3 MB / 16.3 s → 623 KB / 720×1280

Full decode checks completed without errors.

## Integration

- Database `videoUrl` fields are set for products 48 and 49.
- `data/productConfig.ts` supplies each video to the pricing engine.
- `lib/products.ts` contains matching fallback values.
- Web, PWA, and the native mobile app receive the videos through the existing
  product APIs; no mobile release is required.

## Verification

- Both production video URLs return HTTP 200 after deployment.
- Product APIs return the matching `videoUrl`.
- Product 48 and 49 PDPs expose their respective video players.
