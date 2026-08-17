# EyeCell Eye Peptide Gel Patch — Final Slides Delivered — 2026-08-05

## Request

Create six finished marketing slides from the verified product-33 brief in:

- `~/Desktop/patches/SESSION_CHANGES_2026-08-04_EYE_PEPTIDE_GEL_PATCH_6_SLIDES.md`

Reference: the prior six-image product carousel structure shown by Vadim.

## Deliverables

Folder: `~/Desktop/patches/`

- `s1.jpeg` — hero / product hook
- `s2.jpeg` — thermo-sensitive hydrogel mechanism
- `s3.jpeg` — four eye-contour concerns
- `s4.jpeg` — Intertek-verified ingredient doses
- `s5.jpeg` — 20–40 minute ritual and Eye Contour Serum pairing
- `s6.jpeg` — closing packshot / shop CTA
- `main.jpeg` — hero image copy
- `Main.png` — lossless hero image copy
- `COMPARE_6_SLIDES.jpeg` — 3×2 visual QA sheet

All carousel slides are square, 1024×1024 px, matching the established product-gallery format.

## Creative direction

- New rose-lilac / pearl-silver EyeCell identity
- Exact GENOSYS jar composited from the real product packshot
- Distinct layouts for each story; no cloning of previous serum/cream slides
- Original concepts: crescent-water hero, three-state thermo mechanism, model application, ingredient lab flat-lay, ritual tray, illuminated closing pedestal

## Accuracy controls

Copy was checked against the source brief, current API, current Intertek Formula_up, artwork, COA NL009, and brand PPT.

Used:

- Niacinamide **2%**
- Adenosine **0.04%**
- Acetyl Hexapeptide-8 **46.5 ppb**
- **20–40 minutes**
- **101g / 60 patches**
- Thermo-sensitive hydrogel
- Brightening + wrinkle-care functional cosmetic wording
- Dermatologically tested / Made in Korea

Avoided:

- Fragrance-free claim
- Legacy formula percentages
- Invented clinical improvement percentages
- Drug or medical-cure wording
- “High-dose peptide” language

## QA

- Visually reviewed all six full-resolution slides and the comparison sheet
- Corrected S1 metric spacing
- Corrected S4 Made White™ typography collision
- Confirmed no text clipping or overlapping elements
- Renderer diagnostics: no linter errors

## Reproduction

Renderer:

- `scripts/render-eye-patch-slides.py`
- `scripts/render-eye-patch-slides-v2.py` — final GENOSYS-style redesign

Generated visual backgrounds are stored in the Cursor project assets as:

- `patches_s1_bg.png` through `patches_s6_bg.png`

## 07:00 review revision

Vadim requested a strict second review and a European model.

Corrections applied slide by slide:

1. **S1 Hero**
   - Replaced ambiguous `2× functional actives` with consumer-readable `2 verified actives`
   - Retained the exact product packshot and corrected metric spacing
2. **S2 Mechanism**
   - Changed the middle stage from generic `ADHERE` to the source-accurate `FLUID`
   - Copy now states that the hydrogel becomes fluid for closer contact
3. **S3 Benefits**
   - Replaced the Korean model with a European woman aged approximately 35
   - Confirmed two crescent patches are correctly positioned beneath the eyes
4. **S4 Formula**
   - Replaced potentially overclaiming `Clinical actives` with `What's inside. Verified.`
   - Removed the internal editorial note about invented claims
   - Added consumer-facing COA verification and dermatologically tested / Made in Korea text
5. **S5 Ritual**
   - Added the artwork/PPT-supported optional placement of two additional patches at the brow bones
   - Retained 20–40 minute timing, spoon use, sealed-lid storage, and Eye Contour Serum pairing
6. **S6 Closing**
   - Corrected the awkward `calm · moisturize` wording to `cooling · moisturizing`

All six slides and the comparison sheet were regenerated and reviewed again at full resolution.

Selected model source:

- `/Users/vadimkus/Desktop/Barrier/genosys-lady-face-for-hyper3d.png`
- Adapted slide background: `patches_s3_selected_model_bg.png`

## 11:03 GENOSYS visual-system redesign

The first corrected set was accurate, but it remained too editorial/minimal compared with the established GENOSYS six-slide language. The live Problem Control Serum carousel was inspected slide by slide and used to extract the visual system without copying its layouts.

System applied:

- Avenir Next sans-serif hierarchy with Didot editorial accent
- Consistent plum EyeCell accent color
- Custom circular line icons instead of generic bullets
- Fine rules, numbered stages, product metadata, and restrained CTA treatment
- Higher information density with clear separation between headline, proof, usage, and footer
- Exact product-33 jar on hero and closing slides
- Exact Eye Contour Serum 17 packshot in the S5 pairing card

Final slide structure:

1. **S1 Hero** — `COOL. SOOTHE. BRIGHTEN.` with four icon-led verified benefits
2. **S2 Mechanism** — body heat → fluid state → cooling, with connected numbered cards
3. **S3 Concerns** — European model and four icon-led eye-contour targets
4. **S4 Formula** — five numbered Intertek formula rows and a separate COA proof card
5. **S5 Ritual** — five-step vertical timeline, optional brow-bone placement, and exact product pairing
6. **S6 Closing** — large exact jar, two functional pillars, size/origin metadata, and shop CTA

Final QA:

- All six outputs verified at **1024×1024**
- Full-resolution review completed for typography, icon consistency, spacing, clipping, product cutouts, and claim accuracy
- S3 display line resized to remain inside the information panel
- S4 Niacinamide wording aligned with the verified source brief
- S5 wording specifies `optional +2 on brow bones`
- No linter diagnostics in the final renderer

## 11:13 selected-model and hydrogel-color revision

- Replaced the prior S3 model with Vadim's exact selected GENOSYS portrait
- Reframed the portrait to keep the model on the right of the information panel
- Added two custom clear crescent hydrogel patches beneath the eyes
- Corrected an overly milky first pass: skin now remains visible through the gel, with only a thin low-opacity glossy edge and minimal shadow
- Refined their width, spacing, rotation, opacity, edge softness, and shadow so they read as transparent hydrogel rather than white strips
- Neutralized the S1 hero patch from saturated lilac to clear/white with only a faint reflected tint
- Retained functional heat/cool color coding on S2 because those colors represent mechanism stages, not the physical patch color
- Regenerated all six slides, hero copies, and the comparison sheet at 1024×1024

## 11:33 final S3 retouch

Vadim supplied the final S3 retouch with photorealistic transparent hydrogel:

- Source: `s3-b39430de-8d62-419c-a1ef-3a05ecc07722.png`
- Correct clear-gel refraction, wet gloss, thickness, and skin visibility
- Locked as the final S3 source in `render-eye-patch-slides-v2.py`
- Regenerated `s3.jpeg` and `COMPARE_6_SLIDES.jpeg`
