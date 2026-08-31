# Product videos were being cropped on 25 pages (Aug 31, 2026)

Noticed on product 35: the new mixing video played as a horizontal band across
the middle of the bowl. It turned out not to be a product 35 problem.

## What was wrong

Every product clip in `public/videos` is a 9:16 phone export. Most bespoke pages
wrapped them in

```
aspect-square overflow-hidden rounded-[28px] sm:aspect-video
```

with `object-cover` on the `<video>`. On desktop that is a 16:9 box, so a
portrait clip lost roughly two thirds of its height to the crop. On mobile the
square box lost less, but still cut the top and bottom.

Three pages (BioMeso, Cerabarrier, Scalp Brush) used a plain `aspect-square`,
cropping the same way on every screen size.

Two pages already had it right — BioFerment, and Hydro Cool as of earlier
today — which is where the corrected markup came from.

## Scope

31 pages. Audited with `scripts/audit-product-video-aspect.ts`, which maps every
product number through `bespokePdp.tsx` to the page that renders it and probes
the video file it resolves to.

All 34 clips reachable from a bespoke page are portrait. Not one landscape
video is played by a product page, so there was no case needing a 16:9 box.
The three landscape files that exist (`allserum.mp4`, `barrier.mp4`,
`hydrocream.mp4`) are not referenced by any page.

Six pages (BB Cushion, GenoLed, HairGentron, MultiSun, SeaAlgae, UltraShield)
put no ratio on the container at all. I first read that as safe, on the
assumption the video would fall back to its own aspect. It does not: the
`<video>` carries `h-full w-full object-cover`, so it stretches to whatever
height the grid row gives the container and crops to that. Measured live they
were 513x513 on four pages and 513x355 on GenoLed, against a 720x1280 source —
the worst crops on the site. Fixed in a second pass, and the test was tightened
to require the ratio be stated rather than merely not wrong.

31 pages in total.

## The change

```diff
- aspect-square overflow-hidden rounded-[28px] sm:aspect-video
+ mx-auto aspect-[9/16] w-full max-w-[340px] overflow-hidden rounded-[28px]
```

340px wide gives a 604px tall box, matching what BioFerment already used. The
width cap keeps it from outgrowing the column of text beside it.

Applied with `scripts/fix-product-video-aspect.py`, which rewrites only the div
that directly wraps a `<video>`. The same class string is used on image tiles on
these pages, so a find-and-replace would have reshaped those too.

## Guard

`__tests__/components/productVideoAspect.test.ts` fails if any bespoke page puts
a video in an `aspect-square` or `aspect-video` container, and also fails if a
landscape clip is added to `public/videos` — in that case the page playing it
needs a 16:9 container and the shared assumption no longer holds.

Verified it fails by reverting one page before committing.

## Verify

Desktop width, the video sections on:

- https://genosys.ae/products/34 — "Watch the ritual"
- https://genosys.ae/products/60 — "See it work"
- https://genosys.ae/products/66 — "In motion"

Container should measure about 340 x 604, centred, with nothing cropped.

## Left for later

Each of these 25 pages carries its own copy of the video block — the container,
the `<video>`, the eyebrow label and the `product.videoUrl` guard. That is why
one wrong ratio survived across the whole catalogue. A shared `ProductVideo`
component taking a per-page class hook (`hc-video`, `bf-video`, which supply the
per-page border and backdrop) would make the next change one edit instead of 25.
