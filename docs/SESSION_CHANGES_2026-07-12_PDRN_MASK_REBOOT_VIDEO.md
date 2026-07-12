# Session — PDRN Mask New Video (2026-07-12)

## Request
Replace the video on https://genosys.ae/products/52 (Skin Reboot PDRN
Mask Pack) with the new `reboot.mp4`; delete the old video.

## What was done
- Source `public/videos/reboot.mp4` was 49 MB (1080×1920, 21.9 s) —
  compressed in place with `ffmpeg -crf 28 -preset slow` → **1.8 MB**,
  same resolution and duration.
- `videoUrl` on product 52 switched from `/videos/pdrn.mp4` to
  `/videos/reboot.mp4` via `scripts/set-product-video.ts` (drives web
  PDP and mobile app, no OTA).
- Old `public/videos/pdrn.mp4` deleted (no other references; the new
  filename also respects the immutable-cache rule).
- Commit `e19dc483`, pushed, Vercel deployed.

## Verified live
- `https://genosys.ae/videos/reboot.mp4` → HTTP 200
- Mobile API `products/52` returns `videoUrl: /videos/reboot.mp4`
- PDP HTML references `reboot.mp4`, zero references to old `pdrn.mp4`
