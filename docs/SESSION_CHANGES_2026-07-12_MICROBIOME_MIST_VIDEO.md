# Session — Microbiome Mist Product Video (2026-07-12)

## Request
Add a video to https://genosys.ae/ru/products/14 (Microbiome Energy
Infusing Mist).

## What was done
- The `Mist.mp4` dropped into `public/videos/` was a broken partial copy
  (45 KB, 0.3 s). The real file (23 MB, 1080×1920, 10.3 s) was on the
  Desktop — deleted the stub and compressed the real one:
  `ffmpeg -crf 28 -preset slow` → **`public/videos/mist.mp4`, 1.2 MB**
  (lowercase filename for Vercel case-sensitivity).
- Set `videoUrl = /videos/mist.mp4` on product 14 via
  `scripts/set-product-video.ts` — drives the web PDP play button and the
  mobile app (API-driven, no OTA needed).
- Commit `0026c6e2`, pushed, Vercel deployed.

## Verified live
- `https://genosys.ae/videos/mist.mp4` → HTTP 200
- Mobile API `products/14` returns `videoUrl: /videos/mist.mp4`
- RU and EN PDP HTML both reference `mist.mp4` (after ISR refresh)
- Player auto-collapses on end (existing `onEnded` behavior)
