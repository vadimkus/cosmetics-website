# Product 35 — new mixing video (Aug 31, 2026)

Replaces the 8-second clip that shipped on Aug 10 with a 30-second cut of the
same shot: blue powder in a bowl, water poured in, mixed to a spreadable gel.

## Asset

| | old | new |
|---|---|---|
| file | `/videos/hydro.mp4` | `/videos/hydro-cool-modeling-mask-20260831.mp4` |
| source | 19.6 MB | 13.7 MB (`hydro_cool.mp4`, 1080×1920, 30 fps, no audio) |
| shipped | 698 KB | **2.5 MB** |
| dimensions | 720×1280 | 720×1280 |
| duration | 8.2 s | 30.1 s |
| bitrate | ~680 kbps | 699 kbps |

Encoded with `libx264 -preset slow -crf 25`, scaled with lanczos, audio
stripped (the source has no audio track), `+faststart` so it begins playing
before the whole file lands.

720×1280 rather than keeping the source's 1080×1920: at 1080 the same clip came
out 4.2 MB for an SSIM of 0.9919 against 0.9904 at 720 — 68% more bytes for a
0.0015 difference, on a clip the page crops to a square or 16:9 box anyway.
720×1280 at ~700 kbps is also what the previous video on this slot used.

New filename rather than overwriting: `/videos/*` is served
`Cache-Control: immutable, max-age=31536000`, so replacing in place would leave
repeat visitors watching the old 8-second cut for up to a year.

## Where it is wired

The bespoke page reads `product.videoUrl` off the product record, so the
database is what the live page actually uses. The other two are the fallback
path and the mobile app.

- DB `Product.videoUrl` — via `scripts/set-product-35-video-20260831.ts --apply`
- `lib/products.ts` — static fallback for a database outage
- `data/productConfig.ts` — the mobile app reads config first, DB second
  (`lib/pricingEngine.ts`, `mergedVideoUrl`)

No OTA needed: the app resolves the URL at request time.

## Rendering

Already built, no page changes were required. `HydroCoolProductPage.tsx` renders
the video inside the how-to section under `copy.howTo.videoTitle`, which is
already translated — "See it mixed" / "Как смешивают" / "شاهديه وهو يُخلط".

It uses `preload="metadata"`, so the 2.5 MB only downloads when someone presses
play; the page weight is unchanged for everyone else.

## Verify

- https://genosys.ae/products/35 — how-to section, video plays the full 30 s
- `/videos/hydro.mp4` is deleted; nothing outside this doc references it
