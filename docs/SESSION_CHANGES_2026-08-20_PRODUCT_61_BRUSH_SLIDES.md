# Product 61 new studio set

Date: 20 August 2026

## Scope

Moved HR³ MATRIX SCALP BRUSH (product 61) from the July set in `/images/brush/`
to the August studio set in `/images/brush_o/`: a new main packshot and seven
slides, replacing a main packshot and four slides.

## Slide placement

| Slide | Headline | Placement |
|---|---|---|
| `Main2.jpeg` | Brush on white, no text | Main image |
| `s1.jpeg` | Soft on scalp. Serious about care. | Gallery + how-to section |
| `s2.jpeg` | Healthy hair starts with the scalp. | Gallery + effects section |
| `s3.jpeg` | Three actions. One scalp tool. | Gallery only |
| `s4.jpeg` | Engineered for the scalp. | Gallery only |
| `s5.jpeg` | Make scalp care a daily ritual. | Gallery only |
| `s6.jpeg` | Spec card | Gallery only |
| `s7.jpeg` | Designed to move with your scalp. | Gallery + design section |

`s7` is the strongest match on the page: it prints flexible silicone tips and an
ergonomic grip, which are the two construction lines the DTS MG deck documents.

## Claim audit

The August set drops the two worst claims the July set carried:

- the invented **"+50% Product Absorption"** figure, which had no study and no
  manufacturer mention
- the **"KFDA-Approved for Hair Loss"** badge, which belongs to MEDI SCALP
  SHAMPOO α (product 44), not to this brush or to the tonic

It also drops "Medical-Grade Silicone" and "Daily Use — Wet or Dry".

Three unsourced claims survive in `s3`–`s6` and are the reason those four slides
stay in the gallery and never headline a section:

1. **Absorption.** `s3` and `s4` say the brush helps scalp-care products absorb
   more effectively. Removing the percentage did not give the claim a source.
2. **Tonic pairing.** `s5` and `s6` name HR³ MATRIX HAIR TONIC α. The deck names
   the SHAMPOO, at wash time.
3. **Duration.** `s5` prescribes 2–3 minutes daily. No document specifies a
   duration, and the deck's only instruction is wet, with shampoo.

Shipping the set is still a net improvement, because every surviving claim is
milder than the slide it replaced and holding the set back would leave the
fabricated percentage and the misattributed KFDA badge live. No page text
changed; the sourcing rules in `scalpBrushCopy.ts` were updated to describe the
new artwork rather than the old.

## Second pass — main image and video

`Main.jpeg` shipped first and was replaced within the hour by `Main2.jpeg`: the
same brush shot square and evenly lit, with the HR³ MATRIX mark legible. The
first packshot was portrait, so the square grid on listing pages letterboxed it.
`Main.jpeg` stays on disk because it was live briefly and may appear in an order
email sent in that window.

`brush.mp4` was published to `/public/videos/` and attached to the record, and
`ScalpBrushProductPage` gained a video section with EN/AR/RU copy. The clip shows
the head and the flex in the silicone tips, so the copy describes the object
rather than claiming an effect.

The section keeps the page's default background with a top rule instead of taking
the white slot. Sections on this page alternate default/white, and a white video
block would have collided with the care section and forced a cascade of
background flips down the rest of the page.

### Why the app needs no release

Product 61 has no `videoUrl` override in `data/productConfig.ts`, so the record is
the only source and `pricingEngine`'s `configVideoUrl || product.videoUrl` merge
resolves to it. The chain is already dynamic on both sides:

| Step | Where |
|---|---|
| Record holds `/videos/brush.mp4` | database |
| `videoUrl` selected | `app/api/mobile/products/[id]/route.ts`, `app/api/mobile/products/route.ts` |
| Merged and returned | `lib/pricingEngine.ts` |
| Read from the API response | `getProductVideoUrl()` in the app's `data/productConfig.js` |
| Made absolute against `https://genosys.ae` | `toAssetUrl()` in the same file |
| Rendered | `<ProductVideo>` in the app's `app/product/[id].js` |

No app release and no OTA. Verified against the live mobile API with
`x-api-key`: it returns `image: /images/brush_o/Main2.jpeg` and
`videoUrl: /videos/brush.mp4`.

The video also serves correctly for native playback: `206 Partial Content` with
`accept-ranges: bytes` and `content-type: video/mp4`, which is what the player
needs to stream and seek.

## Order of operations

Assets and code were committed, pushed and confirmed serving 200 on genosys.ae
**before** the record was updated, in both passes, because the database is shared
with production. Commits `78ec5def` (slides) and `5ecfebed` (main image, video).

The July set in `/images/brush/` stays on disk: sent order emails reference the
old main image, and per `.cursor/rules/product-gallery-images.mdc` it only comes
off after `scripts/repair-dead-order-item-images.ts` runs clean. `lib/products.ts`
and `lib/routineStepImages.ts` still point at it as a static fallback, matching
how product 63 was handled.

## Verification

- `npx tsc --noEmit` passed on both passes.
- All nine assets and the video return 200 on the CDN.
- `/products/61`, `/ru/products/61` and `/ar/products/61` all reference the new
  paths, `Main2.jpeg` and `/videos/brush.mp4`, and none of the old ones.
- The live mobile API returns the new main image and the video.
- ISR cache key bumped `product-by-id-v60` → `v61` → `v62`.
