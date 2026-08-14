# Skin Brightening Beauty Box (56) — claims audit, copy fixes, bespoke page

Date: 14 Aug 2026

## What this box is

Six products, the largest in the range. Cleanser 180ml, EPI Turnover Boosting
Peeling Gel 100g, Snow Booster toner 200ml, Soothing Bomb Sea Algae Mask 25g,
Multi Vita Radiance Serum 30ml, Multi Vita Radiance Cream 50g.

The premise stands on two of the six. The serum and the cream are both Korean
whitening functional cosmetics (미백 기능성 화장품), and both certificates name
niacinamide at 2% as the functional active. Nothing else in the catalogue has
two licensed brighteners in one purchase.

## What was wrong

### 1. The cream paragraph was a verbatim copy of the serum paragraph

The English record credited the Multi Vita Radiance Cream with MELAZERO®,
3-O-ethyl ascorbic acid, glutathione and a panthenol-rich formula. The cream
formula contains none of them: no Eriobotrya Japonica, no Mentha Viridis, no
ethyl ascorbic acid, and panthenol at 0.1 ppm against the serum's 1%, a factor
of ten thousand. Rewritten to what the cream actually holds: niacinamide at 2%
(assayed at 2.04% and 2.03% on two lots), the VITA12SOME premix, astaxanthin,
ceramide NP and squalane.

### 2. Weights printed as volumes

The cream is 50g and the peeling gel is 100g on their cartons. Both were listed
in ml, in English and in both translations.

### 3. Ingredient names against the label INCI

| Was | Is | Where |
|---|---|---|
| Hyaluronic Acid | Sodium Hyaluronate | peeling gel |
| Moringa Pterygosperma | Moringa Oleifera Seed Extract | peeling gel |
| Custanea Crenata | Castanea Crenata (Chestnut) Shell Extract | sea algae mask, boxes 55 and 56 |
| Hamamelis Virginiana Extract | Hamamelis Virginiana (Witch Hazel) Leaf Extract | sea algae mask, boxes 55 and 56 |
| Anti-inflammatory Herb Complex | U-active®P10 anti-inflammatory herb complex | serum |

Moringa Pterygosperma is an older synonym for the same plant and appears that
way in the DTS MG deck, but the label INCI is Oleifera, so the label wins.

`scripts/tmp/scan56.ts` swept the whole catalogue for each of these strings so
the fixes landed everywhere they occurred, not only inside box 56. That is how
box 55 came into scope.

## Files changed

- `scripts/fix-skin-brightening-box-56-claims-20260814.ts` — English database
- `scripts/tmp/locales56.mjs` — 18 replacements in Arabic, 6 in Russian
- `components/product/beautybox/copy/skinBrightening.ts` — new copy module
- `components/product/beautybox/beautyBoxes.ts` — box registered on `bb-amber`
- `components/product/beautybox/beautybox.css` — `bb-amber` palette
- `components/product/bespokePdp.tsx` and the three `products/[id]/page.tsx`
  route files — 56 added to the bespoke allow-list

The Arabic file carries two entries for this box, one keyed by CUID and one by
product number, which is why several replacement counts there are doubled.

## Palette

`bb-amber`, accent `#b4762a`. The serum is the only dark object in the
photograph and it is amber glass full of visibly golden liquid, which is also
the premise of the box. RevitaGlow (63) already holds a gold, but that one is a
pale desaturated beige-gold at `#c2955f` and the two do not read as the same
page.

## Claims that must not come back without a new document

- MELAZERO® in the cream. Serum only.
- "Panthenol-rich" for the cream. 1% in the serum, 0.1 ppm in the cream.
- A wrinkle claim for either Multi Vita product. Both licences read 미백 alone.
- Exfoliation from the gluconolactone. 10 ppb and 50 ppm respectively.
- Any efficacy figure for the sea algae mask or the peeling gel. Neither has a
  study. The mask carries two before-and-after photographs and no protocol, and
  its own safety assessment warns against transferring ingredient literature to
  the finished product.
- "Hyaluronic acid" in the peeling gel. The formula has Sodium Hyaluronate.
- Papain as an ingredient. It is the manufacturer's description of what the
  papaya extract does, not an INCI entry, and there is no activity assay.
- A duration for the box. Nothing documents how long six products last, so the
  page gives pack sizes and lets the reader do the arithmetic.

## Artwork

Ten rows added to `~/Desktop/genosys-artwork-corrections.html`, in two groups.

**Render defects in the box hero** (`/images/bbbox_brightening/main3.jpeg`),
which need the image regenerated rather than a reprint: the serum carries the
code YAJA/VAJA instead of MVS, the cream MKC instead of MVC, the cleanser reads
SNOW O3 instead of SNOW O₂, the DNA icon is malformed, the body copy is garbled
on three cartons, the DERMATOLOGICALLY TESTED badge is corrupted, and two brand
wordmarks are incomplete.

**Real carton errors** for the next print run: the serum's Arabic panel calls it
a cream, the serum carton uses NET WT. for a volume, vitamin K appears in the
serum roster and not in the formula, the cream's Russian panel gives the volume
in ml, the peeling gel has an English typo ("skim") and a stray Russian
character, the sea algae 10-pack weight conversion is wrong, and the menthol
warning required in Saudi is missing from the mask.

## Verification

- `npx tsc --noEmit` clean
- `__tests__/lib/productRoutines.test.ts` 8 passed
- All three locales walked end to end at 1440×1000. Item sizes, barcodes and
  the saving are read live from the catalogue, so the database fixes are visible
  on the page rather than duplicated into the copy module.
- Arabic needed U+2066/U+2069 isolates on MELAZERO®, Eucalace®, the ethyl
  ascorbic acid name and the DTS MG address, each of which begins or ends on a
  bidi-neutral character.
