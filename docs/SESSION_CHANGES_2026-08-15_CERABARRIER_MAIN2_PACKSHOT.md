# Cerabarrier main2 packshot rebuild — 2026-08-15

## File
`/Users/vadimkus/Desktop/fixes/WhatsApp Unknown 2026-08-14 at 10.44.09/main2.jpeg`

Backup of the previous AI packshot: `main2_orig.jpeg` in the same folder.
Lossless master: `main2_master.png` (2048²).

## Product
**CERABARRIER BIOME GEL CLEANSER** (not Wine Bomb — the old 1024 AI hero was too soft to read). Line code **CGC**. Two pump bottles: 600ml left, 200ml right.

## What changed
Rebuilt the two-bottle hero so both bottles read as the same clean white and the label copy is readable.

Copy on both bottles (Intertek artwork + WhatsApp pack refs):

- CERABARRIER BIOME / GEL CLEANSER
- A daily cleanser powered by Pink Ceramide and Microbiome, supporting a long-lasting moisture barrier for a soft, hydrated finish.
- DERMATOLOGICALLY TESTED
- CGC PROFESSIONAL
- GENOSYS is a compound word of Gene Re-birth System

## Sources
- WhatsApp bottle photos in the same folder (09.36.09 / 09.36.09 (1) / 09.36.09 (2) / 09.36.10)
- `docs/SESSION_CHANGES_2026-07-02_CERRABAR_FOLDER_INGEST.md` (official EN artwork claim)
- Website size cards: `public/images/cera/cerabar_200ml.jpeg`, `cerabar_600ml.jpeg`

## Check — 2026-08-15 02:15
User reviewed the first rebuild. Remaining issues: small-bottle body still softer than the 600ml, slight cool/gray cast on the 200ml.

Second pass: new studio rebuild (v6) + 2048 sharpen + plastic-only white match. Pixel type overlay on the small bottle ghosted (old glyphs + new type) and was discarded again.

Still true: 200ml paragraph is readable but not as hard as the 600ml at 100%. Overlaying Helvetica on the bottle keeps creating a patch or double text.

## Further pass — 2026-08-15 02:30
New two-bottle rebuild (v8) + 2048 sharpen + plastic-only white match.

Measured body white (plastic, sat < 0.08): left RGB 239.46 / right RGB 239.43, luminance delta **0.04**. That was the remaining color gap.

Tried and discarded (all ghosted, boxed, or overflowed onto the derm pill):
- Helvetica redraw after clone-wipe
- Stretched stamp from a full-frame 200ml
- Uniform-scale coral stamp
- Full 200ml bottle composite

Standalone sharp 200ml kept beside the hero:
`/Users/vadimkus/Desktop/fixes/WhatsApp Unknown 2026-08-14 at 10.44.09/cerabarrier_200ml_sharp.png`

Limit: in the two-bottle frame the 200ml label is fewer pixels. In-frame gens stay a bit soft; type overlays keep wrecking the plastic.

## Shape pass — 2026-08-15 10:50
User: text is OK; restore original tube shapes from `main2_orig.jpeg`.

The previous rebuild had gone tall and slim (capsule). Original is a **wide stout cylinder**: flatter tight shoulders, broader rounded base under the black ring, chunkier pumps.

Shipped: shape v2 (original silhouette + current official copy), 2048, whites matched.
Tried and discarded: geometric widen (ghosted pumps/type); shape v3 (over-rounded into egg/pill bottles).

## Shadow lift — 2026-08-15 11:10
User: remove the shadow on the left (600ml) bottle. Text and tube shape stay.

The grey band is the **right flank** of the 600ml (center L ≈ 252–255, flank was L ≈ 218–229). Not the floor drop, not the 200ml.

Lifted low-chroma plastic only, ink dilated and locked (coral + black + red sun, delta 0). 200ml pixels unchanged. Thin rim kept so the silhouette does not melt into the background.

After: flank L ≈ 246–252. Files overwritten: `main2_master.png`, `main2.jpeg`.

## Revert — 2026-08-15 11:11
User rejected the shadow lift. Restored `main2.jpeg` + `main2_master.png` from the shape-v2 ship script (same 2048 LANCZOS + white match). File sizes match the 10:53 versions (629873 / 3154918). Flank L back to ~218–229.

## Coral type match + sharpen — 2026-08-15 11:20
User: same color text on both tubes, and make it very sharp. Refs were the three 11:12 screenshots (all-coral on white, not the grey body on the official dieline).

Target ink from screenshot 1 core: **RGB 217, 130, 108**.

Discarded: coverage-harden + UnsharpMask (haloed / outlined glyphs).

Shipped: wipe name+rule+body with cylinder-matched plastic (sun + derm pill left alone), then redraw both labels at 2× Helvetica Neue Bold / Medium, same TARGET, LANCZOS down. Backup kept as `main2_master_pre_text.png` / `main2_pre_text.jpeg`.

After: L coral 222/139/118, R 223/141/121 (delta ~0.4 / 2.5 / 3.1). Black type not redrawn.

## Type scale — 2026-08-15 11:28
User: redraw was smaller than the original. First pass used HN Bold 31/22 (cap ~23/16). Original pre-text caps were ~29px (600ml) and ~20px (200ml), same width.

Bumped to 36/28 name and 21/15 body, tracking fitted to original name width. 200ml stays smaller than 600ml because the bottle is smaller — same ratio as the original.

## Title spacing — 2026-08-15 11:32
User: title letters overlapping; body OK. Removed the fit-to-width squeeze. Titles now use normal Helvetica spacing plus a double word gap, more line gap, and the rule sits under GEL CLEANSER instead of through it. Body copy unchanged.

## CGC lift off the ring — 2026-08-15 11:40
User: text too close to the divider; should sit a bit higher.

Lifted DNA + CGC + PROFESSIONAL only (derm pill, coral body, black ring, footer slogan left alone). Wipe the old block with side-sampled plastic, then paste the stamp higher. First ink-only shifts left a white hole / ghost and were discarded.

| Bottle | Shift | PROFESSIONAL → ring (center) |
|---|---|---|
| 600ml | 22px up | 31px → 52px |
| 200ml | 16px up | 20px → 36px |

Backup of the pre-lift master: `main2_master_pre_cgc_lift.png` in the same folder.

## Title off the coral rule — 2026-08-15 11:45
User: first two screenshots are the original label crop. Image 3 is how the redraw was done. The tight gap is **GEL CLEANSER vs the coral rule**, not CGC vs the black ring.

Reverted the CGC lift (back on `main2_master_pre_text.png` + type redraw). Lifted both title lines 12px / 10px. Vertical bar still meets the rule (original L). Body nudged down a few px so the rule has air on both sides.

| Bottle | GEL CLEANSER → coral rule |
|---|---|
| 600ml | 11px → 23px |
| 200ml | ~8px → 19px |
