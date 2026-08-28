# Product 42 - video

Date: 2026-08-28
Product: 42, INTENSIVE BLEMISH BALM CREAM [SPF 30 PA++]
Live: https://genosys.ae/products/42

## The asset

`public/videos/blemish_story.mp4` - H.264 1080x1920 portrait, AAC stereo,
30.1s, **4.30 MB**. Full ffmpeg decode pass clean, `moov` ahead of `mdat` so it
streams progressively, and the live URL answers range requests with 206 so
scrubbing works.

## Compression

The source was 11.08 MB at 2.74 Mbps video plus 200 kbps audio. Re-encoded at
CRF 26, preset slow, audio down to 128 kbps: **4.30 MB, 61% smaller**.

Measured rather than assumed:

| CRF | Size | SSIM | PSNR |
|---|---|---|---|
| 24 | 5.12 MB | 0.9941 | 49.9 dB |
| **26** | **4.10 MB** | **0.9931** | **48.8 dB** |
| 28 | 3.33 MB | 0.9918 | 47.8 dB |

SSIM and PSNR both miss the failure mode that matters here. The clip is mostly
soft peach gradient, and gradients fail by banding, which those metrics score as
near-identical. So banding was checked directly: distinct luma levels in a
gradient patch came out at 247 against the original's 246, mean per-pixel delta
0.64/255. A frame was also read back to confirm the small italic serif line on
the tube ("GENOSYS is a compound word of Gene Re-birth System") is still
legible, that being the finest detail in the shot.

The audio is real music, not silence - mean volume -15.7 dB - so it was kept,
just at a sane bitrate.

## The layout gap

Setting `videoUrl` alone would have shown nothing. `BlemishBalmProductPage`
never read the field, the same gap that hid the clips on products 8 and 53.

A video section was added after the how-to block, gated on `product.videoUrl`,
so nothing changes for records without a clip.

- Frame held to `aspect-[9/16]`, capped at 340px. The export is 1080x1920; a
  square or widescreen cover crop would throw away most of the height.
- `controls`, `playsInline`, `preload="metadata"`, poster from `product.image`,
  an `aria-label`, and a localized fallback string.
- New `video` copy section in `en`, `ru` and `ar`.

## One refactor

`_AR` and `_RU` in `blemishBalmCopy.ts` are pre-audit wording kept readable
rather than deleted; `auditedCopy` discards them and they never render. They
were typed `BlemishBalmCopy`, so adding a section to the live copy demanded
legacy text for it. They are now `Partial<BlemishBalmCopy>` - writing legacy
wording for a section that did not exist then would misrepresent what the page
used to say.

## Verification

- `__tests__/components/BlemishBalmVideo.test.ts` - 5 passing: the clip is
  gated on the field, the frame is portrait, the asset exists, all three
  languages carry video copy, and the three titles are distinct so none has
  silently fallen back to English.
- Full suite: 118 suites, 1377 passing.
- `tsc --noEmit` and ESLint clean.
- Live: asset 200 at 4,300,436 bytes as `video/mp4`, range request 206, and all
  three locale pages reference the clip with their own heading.
