# Product 51 studio slides

Date: 22 August 2026

## Scope

New studio set for product 51, BIO-FERMENT AGE DEFYING POWDER MASK, replacing a
three-image gallery that had never been a proper slide deck.

## What shipped

`public/images/bio_ferment2/`, resized to 1024 px and compressed to 73–185 KB:

| File | Slide |
|---|---|
| `main.jpeg` | Packshot, no overlaid text |
| `s1.jpeg` | Mix it fresh. Peel it off. |
| `s2.jpeg` | 2.8x skin moisture, 17.27 → 48.513 |
| `s3.jpeg` | Powder : water 1 : 1.5 |
| `s4.jpeg` | Hydrate. Cool. Peel. |
| `s5.jpeg` | 41.79% diatomaceous earth, 15% algin, 6% calcium sulfate |
| `s6.jpeg` | 35% glucose, 0.2% collagen, 0.1% allantoin, four ferments |
| `s7.jpeg` | Three scoops, water, 15–20 min |
| `Closing.jpeg` | Spec card, 300 g, about 7 treatments |

Gallery order is `s1`–`s7` then `Closing`; the main image is prepended by both
the web gallery and the mobile payload, so it is not listed in `images`.

## s8 not published

The delivered `s8` is a cropped duplicate of `s4`: same artwork, headline
clipped at the top, case-study footnote cut off at the bottom, and 1260×1020
rather than square. It was not committed.

## Claim check

Every figure on the slides matches the verified page copy in
`components/product/bioferment/bioFermentCopy.ts`, including the composition
percentages, the 5–10 minute set from the COA, and the −10 to −11 °C cooling
with its two-case-study footnote. `s2` states the hydration lift as **2.8x,
17.27 → 48.513**, which is the corrected framing from the same day's
`SESSION_CHANGES_2026-08-22_PRODUCT_51_HYDRATION_CLAIM.md`; the withdrawn
218% figure appears nowhere in the set.

The retired `ferment_high.jpeg` led on six growth-factor peptides, a claim this
page does not make. Dropping it from the gallery closes the note left in
`BioFermentProductPage`.

## Other changes

- Inline figures repointed: the complex section now shows the composition slide
  (`s5`) and the how-to shows the mixing slide (`s7`).
- `lib/products.ts` static fallback and `lib/routineStepImages.ts` follow the new
  packshot.
- Database updated with
  `scripts/update-product-51-bio-ferment2-images-20260822.ts`, run after the
  assets were confirmed serving on genosys.ae.

## Arabic and Russian slides (23 August)

Translated exports added under `public/images/bio_ferment2/ar/` and `ru/`,
resized to 1024 px and compressed to 113–212 KB, and registered in
`lib/localizedProductImages.ts`. The database is untouched: the swap happens at
render, and the mobile routes read the same manifest through `x-locale`.
`BioFermentProductPage` now localizes the gallery and both inline figures.

`main.jpeg` has no text on it and is not translated.

Four files were held back on the first pass and fell back to English: `ru/s7`
and `ar/s7` had garbled headlines (Russian stranded "ВОДА." mid-sentence and
added "создавая окклюзию", a claim the English slide does not make; Arabic
repeated "قشري"), and both `Closing` shots rendered the jar label as nonsense
Latin.

## Corrected s7 and Closing (24 August)

Reissued exports cover all four slots and the full set is now registered in
both languages. They ship as `s7b.jpeg` and `Closingb.jpeg`: the original names
were already cached at the edge under a one-year immutable header, so replacing
them in place left the old artwork on the page. The manifest now accepts a
`[default, localized]` tuple for exactly this case, which keeps the English
filenames in the product record unchanged. The headlines read correctly, the invented Russian occlusion
claim is gone, and the jar label is legible.

One deviation remains in `ar/Closing`: the spec line reads
"مُختبر من قبل أطباء الجلدية", tested by dermatologists, where the pack claim and
the English card say dermatologically tested. Published at Vadim's instruction;
worth correcting on the next export.

Everything else was checked figure by figure against the English set: the
composition percentages, 1 : 1.5, 5–10 minute set, −10 to −11 °C with the
two-case-study footnote, and 2.8x / 17.27 → 48.513 all carry over intact.

## Verification

- `npx tsc --noEmit` passed.
- Assets confirmed 200 before the database write.
