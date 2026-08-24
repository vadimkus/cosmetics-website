# Packshot cut-outs (24 August 2026)

## The problem

Vadim flagged that product photographs look wrong in the closing band of the
bespoke pages, and that it is every product, not one page.

The band paints itself with `--cera-shot`, a tint picked by hand per page to
match that shot's studio sweep, on the assumption the whole catalogue was
photographed on the same grey. It was not. Measured corner backgrounds run from
rgb(184) to pure white, while the tints were chosen separately, so wherever the
two disagree the photograph reads as a rectangle stamped on the panel.

Sampling every page where the photograph and its panel could be paired:

| Product | Photo background | Panel | Difference |
|---|---|---|---|
| 35 Hydro Cool | mid grey | `#e8f3f4` | 62 |
| 16 Booster | white | `#e6f2f7` | 25 |
| 13 SRS | white | `#e8eceb` | 22 |
| 51 Bio-Ferment | white | `#f3ebe6` | 21 |
| 38 EZ CO2 | white | `#e8f2f2` | 20 |

Ten of fifteen pages were off by 10 or more. Newer studio sets are shot on pure
white, so the gap widens with every fresh delivery.

A border was considered and rejected. The photograph is already a rectangle;
framing it adds a second one and turns the product into a sticker.

## The fix

Cut the sweep off the packshot. With no background in the file there is nothing
to match, the panel can be any colour, and the same asset works on any surface.

`scripts/cutout/RemoveBackground.swift` uses Vision's foreground instance mask,
the engine behind Preview's Remove Background. It runs offline, needs no model
download and no Python, and handles the soft edge where glass meets the sweep,
which is where a threshold-based matte falls apart. It keeps every instance in
frame, so a kit photograph does not lose half its contents.

`scripts/cutout/build-cutouts.py` runs it over all 66 products, then normalises
the frame: trim to the silhouette and re-pad to a square with a 7% margin, so a
tall bottle and a wide jar take up the same share of their stage instead of
being sized by whatever the photographer framed. Output is WebP with alpha.

All 66 built with no failures and nothing flagged for review. The full set is
2.5 MB, averaging 39 KB per product, lighter than the JPEGs they sit beside.

No shadow is baked in. `.cera-cutout` applies a CSS drop-shadow that follows the
silhouette, so a jar casts a jar-shaped shadow. That is what stops a cut-out
floating, and it stays adjustable.

## Where it is wired

- `CeraClosingCta` — the band Vadim screenshotted. A cut-out supersedes both
  older strategies, `cover` matching the band to the sweep and `blend`
  multiplying a white sweep away; each only worked for the shot it was picked
  for. Pages still pass `imageFit`, which now applies only as a fallback.
That band only. The hero gallery was wired up in the first pass and reverted at
Vadim's instruction: the stage, the thumbnail rail and the lightbox all keep the
original photograph on its own background. The hero is the shot a shopper
studies, and it stays as photographed.

Infographic slides are not in the manifest and come back unchanged, so a claim
card can never have its headline masked off.

## Not touched

- The database. Cut-outs live in `lib/productCutouts.ts`, keyed by the original
  path, and every surface falls back to the photograph when there is no entry.
- The mobile app, which reads image paths from the database.
- Product cards on listing pages and the skin-recommendation tile. Those crop
  with `object-cover`, which would slice a normalised cut-out; switching them is
  a layout decision, not a swap.

## Regenerating

```
python3 scripts/cutout/build-cutouts.py
python3 scripts/cutout/write-manifest.py
```

The build reads the product list dumped by
`scripts/cutout/dump-product-images.ts`. A new packshot needs both steps and a
commit of the generated `.webp`.

## Verification

- `npx tsc --noEmit` passed.
- `productCutouts` and `localizedProductImages` suites passed, 27 tests.
- Pages 51 and 13 rendered locally and confirmed on genosys.ae: the white block
  is gone from the closing band and the product sits on the tint with a
  silhouette shadow, while the hero gallery is unchanged.
