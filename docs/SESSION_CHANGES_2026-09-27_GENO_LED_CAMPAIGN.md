# Product 49, GENO-LED IR II: "Five lights. One dome." campaign

Date: 2026-09-27. Main + 12 slides in EN, RU and AR, gallery on the page and in the app.

## Sources

No new photography exists for the IR II. Everything real came from local files, now copied to
`~/Desktop/lamp/sources/`:

- `GENO-LED IR II_2025.pdf` (the official brochure, also on the site): the only IR II still,
  a 740 × 545 cutout with alpha (page 3), the operation panel, a client under the dome, and
  every figure used (dosimetry slides 5-7, effects slide 11, post-care slide 13, combination
  rules slide 15, hardware slide 4).
- `led.mp4` (the site video): the dome in profile, lit in each of the five modes.
- The Drive `Art_Work/Led_lamp` shots and the 2019 leaflet are the first-generation GENO-LED
  (red panel, 1,145 LEDs) and were not used.

## Images

`public/images/led_campaign/`: `main.jpg` + `s1.jpg`-`s12.jpg` (1600 px, q88), with `ru/` and
`ar/` sets registered in `lib/localizedProductImages.ts`. Scripts: `~/Desktop/lamp/campaign/_scripts/`
(`led_plates.py`, `led_slides.py`, `led_copy.py`, `contact.py`).

- Device renders (main, s1, s11, s12) were generated from the real cutout; the invented small
  print on their control panels was replaced with the real brochure panel (GENO-LED IR II logo,
  Power, IR, time bars, colour keys) by a SIFT + RANSAC homography, 46-67 inliers each.
- s2-s6 are one geometry (s3-s6 colour edits of s2, from the video frame); s7 is s2 and s3 split
  on a diagonal. Infrared is shown as the faint deep-red glow 830 nm gives, not the video's teal.
- Type passes the clearance check (0 busy px) in all three languages.

| # | EN headline | Source |
|---|---|---|
| 1 | FIVE LIGHTS. ONE DOME. | hardware, whole-body use |
| 2-6 | RED 640 / BLUE 423 / GREEN 532 / YELLOW 583 / INFRARED 830 NM | effects slide 11, dosimetry 5-7 |
| 7 | TWO AT ONCE. | combination rules |
| 8 | EVERY MODE, DOSED. | irradiance and standard dose, all five |
| 9 | AFTER THE NEEDLE. | post-care after needling or a peel (slide 13, cases) |
| 10 | NOTHING TO REORDER. | no consumables, no contact |
| 11 | ONE DOME. EVERY ROOM. | 520 × 220 × 315 mm, 2.6 kg |
| 12 | FIVE LIGHTS. ONE DOME. | spec card + shop lines |

Left off the slides on purpose: folding (not in the brochure), thread lifts and injections,
any timing after a procedure, circulation and irradiation-distance claims (the RU/AR page
boundary in `__tests__/data/product49LocalizedCopy.test.ts`), "1-10 min" for infrared (the panel
timer runs 5-30 minutes in 5-minute steps), the 2019 study, and "made in Korea".

## Site

- `GenoLedProductPage.tsx`: gallery localized; s7 beside the combining cards, s11 above the build points.
- `genoLedCopy.ts` EN: "foldable" removed (badge, stat, build point), the post-procedure row and
  FAQ no longer name injections or thread lifting, and two self-undercutting asides went. RU/AR
  (`SAFE_RU` / `SAFE_AR`) unchanged.
- `lib/products.ts` fallback, cut-out `public/images/cutout/49-v2.webp` (REVISION 2).
- DB: `scripts/update-product-49-campaign-gallery.ts` sets image, 12-slide gallery and the EN
  description / keyFeatures / benefits / howToUse / directions. The old EN fields said
  "medical-grade", "safe home treatments", "accelerates healing" and "all skin types".
  `descriptionRu` / `descriptionAr` untouched.
- `LEDD.jpg` stays on disk for order history.

## Open

RU/AR page and central copy (`data/product49LocalizedCopy.ts`) are still the August regulatory
hedge ("no IR II manual, DoC or classification on file"), enforced by the test above. Selling
voice there is a decision for Vadim.

## RU/AR page rewritten in selling voice (same evening)

The RU/AR page was the audit's hedge layer (`SAFE_RU` / `SAFE_AR` on top of older copy with
medical claims): "no manual in the archive", "the certificate belongs to the older 32 W unit", "we
do not carry over contraindications", "classification document missing". Both layers are replaced
by one `RU` and one `AR` object in `genoLedCopy.ts`, mirroring the EN structure and selling what the
brochure and the 21 Aug audit verify: 1,710 LEDs and their split, five wavelengths, irradiance and
dose per mode, colour + IR together, red alternating every three seconds, panel timer 5-30 min in
5-min steps and the 5-60 / 1-10 min dose table, voice prompt and auto-off, 70 W electrical, size and
weight, and the brochure's slide-4 comparison with GENO-LED IR (1,145 LEDs, 60 W, 380 × 220 × 280 mm,
1.9 kg). Still out, per the audit: any effect claim per wavelength, therapy or medical status, IR II
certification, contact / folding / coverage claims, post-procedure timing (left to the specialist),
and the 2019 paper as IR II evidence (it is framed as the earlier GENO-LED, IR II launched 2024).
Buyers are told to request the manual, DoC and classification for their serial number before purchase.

Same pass on the other RU/AR surfaces: `data/product49LocalizedCopy.ts` (description, directions,
panel timer, key features; `evidenceBoundary` removed), `messages/{ru,ar}.json` `pc49*` (Peptide Gel
Mask under red light, from the CTS/CVS/AWS sequences) and `lib/productQuickFactsCatalog.ts` '49'.
`__tests__/data/product49LocalizedCopy.test.ts` keeps every hardware and banned-claim check, no
longer requires the archive hedges, and now fails if archive or source-hedging language returns.
DB: `scripts/update-product-49-ru-ar-selling-copy-20260927.ts --apply` (descriptionRu/Ar only).
EN is unchanged.
