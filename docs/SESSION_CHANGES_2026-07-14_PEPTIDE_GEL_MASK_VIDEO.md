# Session — Peptide Gel Mask Product Video (2026-07-14)

## Request
Add `public/videos/peptide.mp4` to the PEPTIDE GEL MASK product page
(same flow as overnight / mist / problem videos).

## What was done
- Source `peptide.mp4` was **39 MB** (1080×1920, ~17.7 s) — compressed
  in place with `ffmpeg -crf 28 -preset slow` → **2.0 MB**, same
  resolution/duration.
- Set `videoUrl = /videos/peptide.mp4` on product **37** via
  `scripts/set-product-video.ts` (drives web PDP + mobile app, no OTA).
- No previous video on this product.

## Paths
- File: `public/videos/peptide.mp4`
- Live: `https://genosys.ae/videos/peptide.mp4`
- Product: `https://genosys.ae/products/37`
