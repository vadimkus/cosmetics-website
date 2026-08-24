# Product 8 (POWER SOLUTION SWS) — new slide set

Date: 2026-08-24

## What changed

The page ran on three slides (`sws-hero.jpg` plus two `Second/sws_big*.jpg`
packshots). It now runs the `public/images/sws_0/` set: a hero plus nine slides,
ten square slides in the rail.

Rail order is the narrative order Vadim set, not filename order: concern,
positioning, actives, format, exclusions, protocol, then the shop card and the
peptide note.

| # | Slide | Content |
|---|---|---|
| — | `Main.jpeg` | Box and vial with the ×10 mark (hero) |
| 1 | `S4.jpeg` | The concern: pigmentation, uneven tone |
| 2 | `S2.jpeg` | "The vial for pigment" |
| 3 | `S5.jpeg` | 2% arbutin, principal ingredient |
| 4 | `S6.jpeg` | 17.71% humectant base |
| 5 | `S3.jpeg` | One vial, one treatment — 2 ml, 10 per box |
| 6 | `S7.jpeg` | 5-Free |
| 7 | `S8.jpeg` | Cleanse, open, apply, absorb |
| 8 | `Closing.jpeg` | POWER SOLUTION SWS, spec row and shop marks |
| 9 | `S9.jpeg` | sh-Polypeptide-7 |

`S1.jpeg`, the open box with the ten vials, is on disk but deliberately not in
the rail: the hero already shows the box, and the peptide panel it photographs
is covered by `S9`.

## Claim verification

Checked against `Registration DOC/Formula_up/Formula-GENOSYS POWER SOLUTION
SWS.pdf` (DTS MG, the current formula, not the 2018 COTDE sheet):

- Arbutin **2.000000%** — matches the 2% on S5
- Butylene glycol **10.224030%** + glycerin **7.485950%** = **17.70998%** —
  matches the 17.71% on S6

Both figures already ship in the EN, RU and AR copy, so the slides and the body
text now state the same numbers. The older `Ingredient lists_old` sheet gives
10.4% / 7.5%; that is the superseded 2018 formula and is not what the page uses.

`S9` carries the sh-Polypeptide-7 wording — recombinant protein, structure and
function similar to human growth hormone, produced through microbial
fermentation. That is the text printed inside the box lid, photographed on `S1`,
and the peptide is in the formula at 0.000660%.

## Hero framing

`Main.jpeg` arrived at 1122×1402 and the gallery stage is square. It was padded
to 1402×1402 by replicating the edge columns, which is seamless because the
background is a smooth vertical gradient. Plain white padding would have left a
visible seam against that gradient.

## Wiring

- **DB** `image` and `images` for product 8 — `scripts/update-product-8-sws-slides.ts`
- **`lib/products.ts`** static fallback updated to match
- **`data/productConfig.ts`** legacy `images` for `'8'` removed, so the DB is the
  only gallery source (mobile falls back to it)
- **`swsCopy.ts`** `blendGallerySlides` emptied and `heroOnWhite` set true. The
  old pair was multiplied down to a cool-grey stage; the new slides are all
  near-white with two full-bleed portraits, so blending some and not others
  would change the card colour mid-rail.
- **`powersolution.css`** `.ps-sws` stage moved from `#e2e1e6` to `#fbfaf9` to
  meet the new slides. `--ps-figure-stage` stays tinted: the two inline figures
  are still the old `Second/sws_big*.jpg` shots on pure white and are still
  multiplied.
- **`lib/productCutouts.ts`** remapped to the new hero, and
  `public/images/cutout/8.webp` rebuilt from it.

## Cut-out note

Vision returns the vial alone from this hero: the box is white on a near-white
sweep, so there is no edge for the mask to find. The vial reads larger and
cleaner in the closing band than the old wide box-and-flask composition did, and
it matches how `Closing.jpeg` composes the product, so it was kept.

## Localisation

No AR or RU slides exist for this set yet, so all three locales serve the
English slides. Nothing was registered in `lib/localizedProductImages.ts`.
