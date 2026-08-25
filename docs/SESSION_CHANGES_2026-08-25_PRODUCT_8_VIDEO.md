# Product 8 video — POWER SOLUTION SWS

Date: 2026-08-25

## What changed

Product 8 (POWER SOLUTION SWS) now carries a video on its product page:
<https://genosys.ae/products/8>.

- Asset: `public/videos/sws_v.mp4` — H.264 1080x1920 portrait, AAC stereo, 10s, 8.1 MB.
  Verified with a full `ffmpeg` decode pass before shipping.
- DB: `product.videoUrl` set to `/videos/sws_v.mp4` via
  `scripts/update-product-8-video-20260825.ts` (dry run first, then `--apply`,
  with a post-write read-back check).

## The layout fix

Setting `videoUrl` alone would not have shown anything. Products 4 to 9 all
render through the shared `PowerSolutionProductPage`, and that layout never read
`product.videoUrl` — the same gap that hid the product 53 clip earlier.

A video block was added to the end of the how-to section, gated on
`product.videoUrl`, so the other five ampoules are untouched until they get a
clip of their own.

- Frame held to `aspect-[9/16]`, capped at 340px. The export is 1080x1920, so a
  square or widescreen cover crop would throw away most of the height.
- Labelled `product.watchVideo` ("Watch product video"), not
  `product.watchHowToUse`. This is a promo clip of the vial, not a tutorial.
  Key present in `en`, `ru` and `ar`.
- `controls`, `playsInline`, `preload="metadata"`, plus an `aria-label` and the
  localized `product.videoNotSupported` fallback text.

## Verification

- `__tests__/components/PowerSolutionVideo.test.ts` — 3 passing: the clip renders
  when the record has one, the label is the product-video string and not the
  tutorial one, and the asset the SWS record points at exists on disk.
- `tsc --noEmit` clean for the powersolution directory.
- ESLint clean on the changed component.
