# Session changes - 30 Sep 2026 - Campaign review fixes

Review feedback passed on by Vadim (22:41): campaigns must tell the product's story so it sticks,
creative must work with marketing and not for taste. Liked: the Eye Roller (69) and the LED lamp (49).
Criticised: the towel slide on 49, needles and tools shown to buyers, the cushion (41) "not about the
cushion at all", and a hero (product card) that lost its clean packshot.

## Rule

`.cursor/rules/campaign-slides-conceptual.mdc` rewritten as "Product Story First": one through-line
with a real benefit, every slide must explain the product, and hard rules: clean hero on white, never
needles or instruments, no marketplace lifestyle shots, no Dubai images, do not redo a live set unless
asked. Real packs are composited or re-shot so labels stay exact.

## Fixes (commit `9669aa6ae`, DB via `scripts/update-campaign-review-fixes-20260930.ts --apply`)

| Product | Change |
|---|---|
| 49 GENO-LED IR II | s9 (woman in a towel on a spa bed, "AFTER THE NEEDLE.") out of the gallery: main + 11 slides |
| 53 Collagen Mask | main back to the clean `collagen_mask/Main.jpeg` (the campaign main had gel drops); cut-out map back to `cutout/53.webp` |
| 41 BB Cushion | "Covered." set kept (Vadim's choice). s4 multi-tool -> **s4b**: the real open compact and puff composited on black ("ONE PRESS. THREE JOBS."); s5 gold pins -> **s5b**: a formula swipe on nude ("STAYS IN PLACE."). 13 slides |
| 69 Eye Roller | s3 sewing needle -> **s3b**: a strand of pearls ("60 FINE NEEDLES."); only slide changed (Vadim) |

New files under new names (cache rule): `cushion_art/{,ru/,ar/}s4b.jpg, s5b.jpg`,
`eyeroller_art/{,ru/,ar/}s3b.jpg`. Old files stay on disk, out of the galleries. Registry, fallbacks,
page slide map (69 "why" uses s3b) and the product 41 / 49 / 69 gallery scripts updated.

Workspaces: `cushion41/campaign` (prompts b4n, b5n; `c41_b4_compose.py`; previous picks kept as
`picks/b4_v1.png`, `b5_v1.png`), `eyeroller69/campaign` (prompt d3b; previous pick `picks/d3_v1.png`).

## Checks

- Live: 49 has no s9; 41 and 69 galleries serve s4b/s5b and s3b, no old s3/s4/s5; 53 page uses the clean
  main. Mobile API: 69 `ar/s3b`, 41 `ru/s4b` + `ru/s5b`, 49 main + 11, 53 clean main.
- Tests: 150 suites, 1615 passed.

## Flagged, not changed (older sets that show instruments or needles)

- 60 Bio-Meso: s2 caliper, s3 microscope.
- 1 Microneedle Roller: needle macros (s2, s4) and a model with the roller on her face (s7).
- 67 Microneedle Stamp: needle close-ups.
