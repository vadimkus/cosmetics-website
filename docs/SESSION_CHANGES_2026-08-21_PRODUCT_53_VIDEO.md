# Product 53 video

**Date:** 21 August 2026

## Change

- Added the supplied 10-second vertical MP4 for INTENSIVE REPAIR COLLAGEN MASK.
- Public asset: `/videos/redmask.mp4`
- Product 53 database `videoUrl`: `/videos/redmask.mp4`
- The database field supplies both the website product page and the native
  mobile product API, so no app OTA is required.
- Added the missing player to product 53's bespoke collagen-mask page. The
  generic PDP already rendered `videoUrl`, but this bespoke renderer did not.
- The vertical promotional clip now appears below the How to use section at
  its native 9:16 ratio with browser controls and the localized "Watch product
  video" label.

## Media verification

- Container: MP4
- Video: H.264, 720 × 1280
- Audio: AAC stereo
- Duration: 10.005 seconds
- Size: 2,305,576 bytes
- Full decode check: passed.
- Live asset returns HTTP 200 with `video/mp4`.
- Product API returns `/videos/redmask.mp4`.
- Regression test requires the bespoke product page to render `product.videoUrl`.
