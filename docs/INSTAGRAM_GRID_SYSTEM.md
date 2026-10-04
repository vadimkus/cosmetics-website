# Instagram Grid System (@genosys.uae)

Approved 4 Oct 2026. Covers every new feed post and reel, starting from the next post. It replaces the
"post = product, reel = face" rule tried earlier the same day. Earlier plan and post logs: `2026-09-29_instagram-grid-plan.md`.

## Decisions (Vadim, 4 Oct 2026)

1. **Campaign rows.** One product is one row of three tiles, all in that campaign's two colours.
2. **Existing posts stay.** The 12 live tiles keep their place. Only their six reel covers are re-laid in the template.
   Rows start above them with the next campaign.
3. **Collabs go to Stories.** Remove ourselves from new clinic collab posts, so the post stays on the partner's grid, and share
   it in Stories and a Clinics highlight.

4. **No prices on Instagram.** No prices in captions, on slides or on covers. Point to genosys.ae, the app and DM /
   WhatsApp instead.
5. **HOOK reels are shot in CapCut.** Dreamina Seedance 2.5 in CapCut's AI video panel, 20 s, 9:16. Never a
   slideshow of the campaign slides.

## Standards this follows (2026)

- The profile grid shows **3:4 tiles** (since Jan 2025). A 1080×1440 post shows uncropped; a square post loses its sides.
- A reel cover is 1080×1920. The grid shows **y 240–1680**. The Reel icon sits top-right and the view count bottom-left, so no type goes in those corners.
- **One cover template:** same font, same type position, 3–6 words, readable at 120 px wide.
- **Layouts:** row themes suit campaign-led brands; colour trios are the Aesop and Kérastase pattern; puzzle grids are for launches only.
- **Formats:** carousels lead engagement by reach (about 12.9% median, against 9.1% for single images). Reels reach non-followers.

## The row

Newest row on top, read left to right:

| Left | Middle | Right |
|---|---|---|
| **HOOK**: the reel | **PROOF**: a carousel | **PRODUCT**: a carousel |
| The campaign line (WASHED. STILL SOFT.) over the reel's strongest metaphor frame | One giant real number as the cover (5 CERAMIDES, +82%, 50+, 830 NM); slides are the doses and figures | The pack on the campaign colour, with sizes; slides are the product story, how-to, SHOP |

- **Posting order:** PRODUCT first, then PROOF, then HOOK, all within about an hour, so the row is never left half-built.
- **Colour:** all three tiles use the campaign's pack colour and concept colour (`campaign-slides-conceptual.mdc`). No white packshot tiles in new rows.
- **Contrast:** alternate a light-dominant row with a dark-dominant row. Never put two rows from the same colour family next to each other.
- **Source material:** the 12-slide campaign set splits into the two carousels (numbers, then story and pack), re-laid at 3:4. The reel is the campaign reel.
- **Pins:** pin 0 or exactly 3 posts (a full brand row). Any other number shifts every row below it.
- **Volume:** 100 tiles is 33 rows, which is 33 products. That's about 4 months at 2 rows a week.

## Template

Spec sheet: `~/Desktop/Insta_Olga/grid/plan/TEMPLATE_safe_zones.jpg`.

- **Type:** Manrope Regular caps at x 72, with 72 px margins.
  - Headline: 120 px, 2 lines at most, 3 words per line at most.
  - Product line: 36 px, wrapped so it never crosses the subject.
  - Optional kicker: 34 px.
- **Reel cover (1080×1920):**
  - The frame is a clean reel frame with no type and no generator mark.
  - Headline zone y 330–650: headline baselines 450 / 575 (one line: 500), product line under it.
  - Above 240 and below 1680 is background only.
  - Built with `~/Desktop/Insta_Olga/grid/_scripts/reel_cover.py <key>`; frames go in `grid/frames/<key>.jpg`.
  - Clean frames come from the raw Seedance render at the same timestamp (labels don't matter on frames without a pack). Fill generator marks with `clean=(x0, y0, x1, y1)`.
- **Carousel cover (1080×1440):** the headline zone is the same position relative to the tile, y 90–410.
- **Check:** `grid_preview.py plan.txt out.jpg` (3:4 tiles, newest first) before anything posts.

## Live covers (4 Oct 2026)

`~/Desktop/Reel_Covers_Upload/01–06_*_cover.jpg` (source `grid/covers_v2/`), plus a mock-up in `GRID_after_cover_swap.jpg`.

| Reel | Frame | Headline |
|---|---|---|
| CERABARRIER | red silk under running water | WASHED. STILL SOFT. |
| MH Cream | rose sealed under a glass dome | SEALED FRESH. |
| Cushion | mashrabiya lattice light on sand | SHADE TO GO. |
| GENO-LED | dome glowing red in black | FIVE LIGHTS. ONE DOME. |
| PCT Toner | water crown on cobalt | OIL OFF. COOL ON. |
| Ultra Shield | violet filter over half the face, sun on the other half | THE SUN DOESN'T DO BOUNDARIES. WE DO. |

To swap a cover in the Instagram app (the web version can't change a live cover):
1. Open the reel and tap ⋯ → **Edit** → **Edit cover**.
2. Tap **Add from camera roll** and pick the cover.
3. Tap **Done**, then **Done** again.

## Removing a collab from our grid (app only)

Open the collab post in the app → ⋯ → **Stop sharing** → **Stop sharing**. The post stays on the partner's profile,
and we're no longer shown as an author. Instagram web shows the same button, but its `remove_coauthor_attribution` call returns
an HTML page and nothing changes (tried on tonetrendz `DeCRt1loEVp`, 4 Oct 2026). Then share the post to Stories
and add it to the Clinics highlight.

With tonetrendz gone, the 12 live tiles fall into a reel / white-post checkerboard
(`~/Desktop/Reel_Covers_Upload/GRID_after_cover_swap_no_collab.jpg`).

## Batch 1: rows for Eye Kit, Sea Algae, Glass Skin and Bio-Meso (built 4 Oct 2026)

Folder `~/Desktop/IG_Rows/` holds the slides, covers, reels, `README_POSTING.md` (order and all 12 captions) and
`GRID_preview.jpg`. Built by `~/Desktop/Insta_Olga/grid/_scripts/build_rows.py`, with the row config in `ROWS`.

| Post order | Row | Tone | HOOK (reel) | PROOF (cover) | PRODUCT (cover) |
|---|---|---|---|---|---|
| 1 | EyeCell Eye Kit 50 | black | RESTED EYES. | s7 20–40 MINUTES. | s11 ONE BOX. |
| 2 | Sea Algae Mask 36 | mint | CALM ON CONTACT. | s7 15–20 MINUTES. | s3 SEA ALGAE + CENTELLA. |
| 3 | Glass Skin Kit 68 | navy | FULL MOON GLOW. | s5 +82% | s11 A GIFT THAT GLOWS. |
| 4 | Bio-Meso 60 | salmon | NEEDLESS TO SAY. | s11 FOUR MONTHS IN ONE BOX. | s12 3 ML × 4 |

- **3:4 from square slides:** the slide sits centred. Above it, the backdrop colour and gradient are extrapolated; below it, a
  softened reflection of the floor fades out within about 100 px. Mirroring the top was rejected because it reflected
  the headlines.
- **HOOK reels:** the first versions were slideshows of the campaign slides. Vadim rejected them the same day; they're being re-shot in
  CapCut (Seedance 2.5, 20 s, 9:16). The notes below describe the rejected slideshow build, kept for reference only.
  - The hook runs 2.2 s, middle slides 1.5 s each, the closing card 2.8 s.
  - Slow 3.5% push-in, 0.12 s blends. 0.35 s crossfades were rejected because they ghosted two headlines together.
  - Silent track: add a trending sound in the app. The cover is the first frame.
- **Slides left out:** Eye Kit s5 (needle macro), Sea Algae s6 (spa towel), Bio-Meso s2–s3 (instruments)
  and s7–s9 (panel sizes).
- **Colour run from the top of the grid:** salmon, navy, mint, black, then the live rows.

## Highlights

Replace the five "🌟NEW🌟" highlights with 6–8 named groups (Cleanse, Hydrate, Sun, Eyes, Pro, Devices, Reviews,
Clinics), all with one cover style: Manrope caps on the brand colour.

## Per new row (checklist)

1. Pick the next product. Its row must contrast with the row above (light vs dark).
2. Build PRODUCT and PROOF at 1080×1440 from the campaign slides. Each first slide follows the template.
3. Take the HOOK frame from the reel, add it to `reel_cover.py`, and render.
4. Add the three tiles to the top of the plan file and run `grid_preview.py`.
5. Post PRODUCT, then PROOF, then HOOK, within about an hour. Upload the reel cover at posting time.
