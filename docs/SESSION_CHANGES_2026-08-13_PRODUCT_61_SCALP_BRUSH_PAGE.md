# Product 61 (HR³ MATRIX SCALP BRUSH) - claim cleanup and bespoke page

Date: 2026-08-13
Status: shipped locally, all three locales verified. Not deployed.

Sixth bespoke PDP, after 60, 63, 64, 65 and 66. Two halves to this one: the
product's existing content was largely unsourced and had to be corrected first,
then the page was built on what remains.

## The source problem

There is exactly one manufacturer document for this product, a four-slide DTS MG
deck at `public/documents/PPT/GENOSYS HR3 MATRIX SCALP BRUSH.pdf`. It is short
enough to quote in full, and the whole of it is:

| Slide | Content |
|---|---|
| Concept | "A scalp brush that provides gentle scalp cleansing and massage effects without irritation" |
| How to use | "After wetting hair with lukewarm water, apply shampoo to create sufficient lather. Massage scalp with the brush." |
| Feature 1 | Rich foam, "when used with HR³ MATRIX SCALP SHAMPOO α" |
| Feature 2 | Deeper scalp cleansing: oil, dead skin cells, product buildup, without irritation |
| Feature 3 | Improved blood circulation, "can help prevent hair thinning" |
| Feature 4 | Increased hair volume, through the deep cleansing effect |
| Design | "Stable grip", "Soft silicone brush ... without scratch" |

Against that, the live content claimed a **+50% absorption uplift**,
**medical-grade silicone**, **hypoallergenic**, **dandruff** control, **prep for
microneedling**, **daily use wet or dry**, and paired the brush with the
**KFDA-approved Hair Tonic α**. None of it is in the deck. The KFDA functional
approval belongs to MEDI SCALP SHAMPOO α (product 44), not to the tonic, and the
deck names the shampoo, at wash time, not the tonic.

## Corrections made before building anything

| Where | Fix |
|---|---|
| DB record | `scripts/fix-product-61-scalp-brush-claims-20260813.ts` rewrote description, benefits, ingredients, howToUse, directions and productDetails; `perfectCombination` re-pointed from the tonic to the shampoo |
| AR + RU translations | `scripts/fix-product-61-translations-20260813.ts` replaced the whole product 61 entry in both files to match the corrected English |
| `ProductRecommendation.tsx` | Removed the hardcoded 61+43 pairing block that repeated the absorption and KFDA claims |
| `messages/{en,ar,ru}.json` | Removed the nine `pc61*` keys that fed it; rewrote `routineScalpBrushDesc` to drop the absorption claim |
| `lib/productRoutines.ts` | Reordered to Peeling (optional) → Shampoo → Brush → Tonic, so the brush sits at wash time as documented instead of after the tonic |

Both scripts refuse to write content containing the removed terms, so the claims
cannot come back through the same path.

## The page

- `components/product/scalpbrush/scalpBrushCopy.ts` - EN/AR/RU copy, with the
  full deck quoted in the header and an explicit list of what must not be added
  back without a document.
- `components/product/scalpbrush/scalpbrush.css` - slate-teal palette over the
  shared cerabarrier design system, so it does not read as a second graphite
  device page next to the hair stamp.
- `components/product/scalpbrush/ScalpBrushProductPage.tsx` - the layout.
- Registered in `components/product/bespokePdp.tsx` and added to the allow-list
  in all three `products/[id]/page.tsx` routes.

Sections: hero, stats, four documented effects, the two design decisions, four
how-to steps, care and cautions, routine strip, spec table with barcode, FAQ,
reviews.

Deliberately **not** on this page, because a 50 AED moulded silicone object has
no such source: an ingredients or INCI section, a lab or quality section, a
clinical figure, a brochure download (the deck's fourth slide says "Thank You"),
a size selector. The correct answer to thin source material is a shorter page.

## The artwork still disagrees, on purpose

`s1.jpg` and `s2.jpg` still print "+50% Product Absorption", "Soft Medical-Grade
Silicone", "Daily Use - Wet or Dry" and the tonic/KFDA pairing. Keeping those
images was a considered call; repeating their claims in text was not. Only
`s4.jpg` was promoted to large inline art, since `s3.jpg` also has a garbled
shampoo label. Do not re-sync the copy to the artwork - the artwork is the
unsupported side.

## Verification

- `tsc --noEmit` clean, eslint clean, 488 tests pass.
- All three locales render 200 with no console errors; every rendered page was
  scanned for the removed terms and none appear in visible text.
- Barcode 8800065000357 shows in the spec table, LTR-isolated under Arabic.
- `CeraReveal` gained `ul` and `ol` to its tag union so the care lists could stay
  semantic lists. Additive only, no effect on the other pages.
