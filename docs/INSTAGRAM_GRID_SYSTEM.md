# Instagram Grid System (@genosys.uae)

Locked 4 Oct 2026. Applies to every feed post and reel from tile 1 onwards, for the next 100+ tiles.
Earlier plan and post logs: `2026-09-29_instagram-grid-plan.md`.

## The one rule

**Post = product. Reel = face.**

| Type | Grid tile shows | Background |
|---|---|---|
| Carousel / photo post | The clean product packshot (same as the site main image) | Pure white |
| Reel | A beauty face on the campaign colour, headline top-left | Campaign colour |

Each campaign ships as a pair: carousel first, then its reel. With 3 columns, the pairs create a white product /
colour face checkerboard, so the grid reads as one brand from a distance. A collab or third-party tile is
fine anywhere. It breaks the rhythm for one tile only.

Never a product on a reel cover, never a face on a post's first slide. Never a lifestyle shot, a needle or tool, or a Dubai location (campaign
rules in `.cursor/rules/campaign-slides-conceptual.mdc`).

## Geometry

- The profile grid shows **3:4 tiles**.
- Reel cover 1080×1920. The grid shows **y 240–1680**. Everything that matters sits in that band.
- Posts are square or 4:5 and show centre-cropped to 3:4, so keep the product centred with side margin.

## Reel cover template

Built by `~/Desktop/Insta_Olga/grid/_scripts/grid_cover.py`:

- The plate is a 1:1 CapCut face, scaled to 1440 and cropped to 1080 wide (`crop` 0 = left … 1 = right), filling the tile.
- Above the tile, the backdrop continues. Below it, the shoulders dissolve into the backdrop over 160 px (the Reels UI sits there).
- Type is Manrope Regular caps at x = 72:
  - Optional kicker at 34 px, baseline 360.
  - Headline at 104 px, baselines 430 / 540 (one line: 470).
  - Product name at 32 px, shrunk to fit the width.
- Ink is the campaign accent or white. On light backdrops it gets a white halo (`glow`); on dark ones, a soft shadow.
- The headline is the campaign through-line (the same words as the carousel's first slide/reel), never a new slogan.

## Face plate prompt (CapCut, GPT Image 2.5, 2k, 1:1, 4 takes)

`grid_prompts.py` keeps the shared blocks:

- **FRAME**: head and shoulders, face slightly right and low, top of the head about 32% down, the upper-left 40% empty backdrop.
- **SKIN**: real pores, minimal make-up, hair back, bare shoulders, no jewellery.
- **NEG**: no text, product, hands, towel, spa or city.
- **Per campaign**: the backdrop colour, the subject, and one light idea that carries the story (droplets for a cleanser, mist for the toner, a lattice shadow for the cushion, red LED glow for the LED, a diagonal sun for the SPF).

Rotate ethnicity and age across campaigns (East Asian, Arab, Mediterranean, South Asian, European) so the grid
looks like the UAE customer base. Takes usually come out more centred than asked, so set the crop to 0.4–0.55.

## Covers 1–12 (4 Oct 2026)

| # | Tile | Cover |
|---|---|---|
| 1 | CERABARRIER reel | cv1, blush, "WASHED. STILL SOFT." |
| 2 | CERABARRIER post | white packshot (unchanged) |
| 3 | tonetrendz collab | theirs (unchanged) |
| 4 | MH Cream reel | cv2, navy, "SEALED FRESH." |
| 5 | MH Cream post | white (unchanged) |
| 6 | Cushion reel | cv3, sand + lattice, "SHADE TO GO." |
| 7 | Cushion post | white (unchanged) |
| 8 | GENO-LED reel | cv4, black + red glow, "FIVE LIGHTS. ONE DOME." |
| 9 | GENO-LED post | white (unchanged) |
| 10 | PCT Toner reel | cv5, cobalt + mist, "OIL OFF. COOL ON." |
| 11 | PCT Toner post | white (unchanged) |
| 12 | Ultra Shield reel | cv6, violet + sun, "THE SUN DOESN'T DO BOUNDARIES. WE DO." |

Files: `~/Desktop/Reel_Covers_Upload/` (covers + `GRID_before_after.jpg`). Working folder: `~/Desktop/Insta_Olga/grid/`.

## Swapping a live reel cover (Instagram app, phone)

Open the reel → ⋯ → **Edit** → **Edit cover** → **Add from camera roll** → pick the cover → **Done** → **Done**.
The web version cannot change a cover after posting.

## Per new campaign (checklist)

1. Add a `cvN` prompt to `grid_prompts.py`: the campaign colour, a subject from the next ethnicity in the rotation, and one light idea.
2. `./grid_batch.sh cvN` (CapCut) and pick the best of the 4 takes.
3. Add `cvN` to `COVERS` with the plate, crop, ink, glow, headline and product name, then run `grid_cover.py cvN`.
4. Add both tiles to the top of `plan_after.txt` and run `grid_preview.py plan_after.txt covers/_grid_after.jpg`, so the grid is checked before posting.
5. Post the carousel (first slide = white main), then the reel with the cover uploaded at posting time.
