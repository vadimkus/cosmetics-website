# Product 30 Intensive Problem Control Cream video — 2026-08-05

## Change

- Added a portrait product video for **INTENSIVE PROBLEM CONTROL CREAM**
  (product 30) at `/videos/problem_cream.mp4`.
- Compressed the supplied 1080 × 1920 H.264/AAC source from 29.1 MB to
  913 KB at 720 × 1280.
- Used H.264 CRF 28, slow preset, AAC 96 kbps, `yuv420p`, and `faststart` for
  browser and mobile compatibility.
- Set the matching `videoUrl` in the database, `data/productConfig.ts`, and
  `lib/products.ts`.

## Verification

- Full decode check completed without errors.
- Production video URL returns HTTP 200.
- Product 30 API returns `/videos/problem_cream.mp4`.
- Live product page exposes the video player and loads the video successfully.
- Web, PWA, and native mobile app receive the same API-backed video.
