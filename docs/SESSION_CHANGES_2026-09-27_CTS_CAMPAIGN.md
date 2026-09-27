# Product 6, POWER SOLUTION CTS: "Back to smooth." campaign

Date: 2026-09-27. Main + 12 slides in EN, RU and AR; selling copy on every surface; dossier voice removed.

## Images

`public/images/cts_campaign/`: `main.jpg` + `s1.jpg`-`s12.jpg` (1600 px, q88), with `ru/` and `ar/` sets
registered in `lib/localizedProductImages.ts`. Sources and scripts: `~/Desktop/cts_ps/campaign/`
(`_scripts/cts_main_build.py`, `cts_composite.py`, `cts_slides.py`, `cts_copy.py`, `contact.py`).

- **Main**: the Power Solution family angle (HES 4, PCS 7, SWS 8): closed carton angled left, one vial
  front right, grey "x10", pure white. The generated render carried PCS print, so the carton face was
  rebuilt from the real CTS artwork (`POWER SOLUTION CTS_outer box.png`) warped onto the face with its
  own paper shading, and the real vial PNG replaced the rendered one.
- **Product slides** (s1 open box, s3 vial on deep teal, s9 ten vials, s11 vial on water, s12 carton +
  vial) are the real PNGs composited onto generated empty plates, so every label is the actual print.
  On dark plates the bare glass is multiplied over the plate so it reads clear, not frosted.
- **Scene slides** (s2, s4-s8, s10) are generated.

| # | EN headline | Claim |
|---|---|---|
| 1 | BACK TO SMOOTH. | Ten vials of peptide concentrate for rough skin that lost its bounce |
| 2 | SMOOTHER TEXTURE. | Refines texture, helps keep natural elasticity and strength (carton function + English panel) |
| 3 | ONE VIAL. ONE USE. | 2 ml sealed in glass, every treatment starts fresh |
| 4 | FOUR PEPTIDES. | Copper tripeptide-1 212 ppm, the largest peptide dose in the range |
| 5 | 2.5% SOY FERMENT. | Largest active by weight, conditions skin |
| 6 | SILK IN A VIAL. | Glides and sinks in as you pat it |
| 7 | 28% MOISTURE. | Glycerin + butylene glycol 28.06% |
| 8 | GRAPE & ROSE. | Callus cultures, hyaluronic acid, collagen |
| 9 | TEN TREATMENTS. | Ten sealed 2 ml vials |
| 10 | PAT IT IN. | Cleanse, open, apply, pat until absorbed |
| 11 | MADE IN KOREA. | Dermatologically tested, DTS MG |
| 12 | BACK TO SMOOTH. | Spec card + shop lines |

All type passes the clearance check (0 busy px) in all three languages.

## Copy

- `components/product/powersolution/ctsCopy.ts`: EN rewritten in selling voice ("Back to smooth."). Out:
  "the carton says / no other claim / not the engine", the Korean-licence FAQ, the roller FAQ, "5-Free"
  (its fifth exclusion is artificial surfactant and polysorbate 60 is on the list, so the page names the
  four exclusions the list bears out), specific gravity, the batch pH note under the INCI. Kept: every
  formula percentage, pH 7.61 inside 6.00 to 8.00, pregnancy / fish-allergy / hinoki (not fragrance-free)
  guidance. The unused `LEGACY_CTS_RU_COPY` / `LEGACY_CTS_AR_COPY` (540 lines) are deleted.
- `ctsLocalizedCopy.ts`: RU and AR rebuilt to mirror EN. Range table names fixed (were "Hyaluronic Essence
  Solution" and "Snow White Solution"), 28,0648% shown as 28,06%, specific gravity and the dermaroller FAQ
  removed, the fragrance note now names the hinoki water.
- `data/productLocalizedCopyAudit.ts` product 6 RU/AR: selling description, 28,06%, specific gravity,
  measured fill and microbiology rows removed.
- `messages/en.json` `pc6*` (roller pairing block on the generic PDP) rewritten from carton voice.
- `__tests__/data/productLocalizedCopyAudit.test.ts`: requires 28,06% and pH; now forbids 28,0648%, 1,041,
  2,06 ml and dermaroller.

## Page

`PowerSolutionProductPage.tsx`: gallery slides localize through `localizeProductImage` for all six vials
(no-op where no set is registered). New optional variant flag `figureSlides`: the two inline figures take
campaign slides (square, cover, no multiply, localized). CTS uses s2 and s6, `heroOnWhite: true`, no
blended slides. `.ps-cts` stage and shot tint moved from the old grey sweep (#d9d7dd) to the plates'
pale aqua (#daedee).

## Elsewhere

- `lib/products.ts` fallback, `lib/routineStepImages.ts` ('6' was still `/images/CTS.jpg`).
- Cut-out `public/images/cutout/6-v2.webp` (REVISION 2). Vision dropped the vial and "x10" (PARTS, as
  product 7) and tore the carton's lower corner where it meets the vial: the face is 243-251 on a 255
  sweep. Restored with a REPAIR rectangle inside the known face quad.
- DB: `scripts/update-product-6-campaign-gallery.ts` (image, 12-slide gallery, EN fields, descriptionRu/Ar
  from the central copy). Refuses `--apply` until all 37 images and the cut-out return 200.
- Old `cts-hero.jpg`, `CTS.jpg`, `Second/cts_big*.jpg` stay on disk for order history.

## Slide 10 reissued as s10b (same day)

The serum on the model's cheek in "PAT IT IN." read as an opaque blue-grey paste. On skin CTS
goes on colourless, so the plate was redrawn with the serum as a clear wet sheen only
(`_gen/gi/cts_10_clear_a.png`; the first plate is kept as `picks/_s10_opaque_serum.png`). Copy
unchanged. Shipped as `s10b.jpg` in EN, `ru/`, `ar/`; the registry, `lib/products.ts` and the
campaign DB script point at it, and the record was swapped with the new generic
`scripts/swap-gallery-slide.ts` (checks the new file and its localized twins are live first).

## Product slides reissued as one photograph (same evening)

Slides 1, 3, 9, 11 and 12 read as the real carton and vials pasted on a plate. Each is now one
photograph re-shot in the CapCut desktop app with the composite as the reference image
(`~/Desktop/cts_ps/campaign/_prompts/s<N>_solid.txt`), keeping the layout and the real print, with
real contact, reflection and light. Type clears in EN, RU and AR (0 busy px); slide 9 still shows
ten vials. Composites kept in `picks/_comp/`. Shipped as `s1b s3b s9b s11b s12b` (EN, `ru/`,
`ar/`) alongside the earlier `s10b`; gallery, section slides, registry, `lib/products.ts` and the
campaign DB script point at them; DB records swapped with `scripts/swap-gallery-slide.ts`. Tooling
is described in the AWS campaign note.
