# Bespoke page copy — selling tone sweep

**Date:** 14 August 2026
**Scope:** every bespoke product page copy module, English / Arabic / Russian
**Commits:** `2b4b92fb`, `07cc5b40` (local only — the bespoke pages are not deployed yet)

## What was wrong

The copy had drifted into an audit register. It kept describing *where a claim is
printed* instead of making the claim, and it kept shrinking a claim in the sentence
right after making it. Two examples that triggered the review:

> The registered piece. Five UV filters take it to SPF50+ PA++++, and the same formula
> carries niacinamide at 2% and adenosine at 0.04%, which are the two ingredients its
> Korean licence names for brightening and for wrinkles.

> The cleanser, toner, cushion and remover all carry a dermatological test mark on their
> cartons.

Both are accurate. Neither sells anything. The first opens on a filing status, the second
describes the location of a printed mark rather than saying the products are
dermatologically tested.

## The rule applied

1. **Lead with what the product does for the customer.** Regulatory facts become the proof
   behind the claim, never the headline.
2. **Never cite the packaging as a source in body copy.** "Its carton says it can go over
   make-up" becomes "light enough to go straight over make-up". Exception: `fullInciNote`
   and the precautions note, where "as printed on the carton" tells the buyer the list on
   screen matches the pack in their hand. That is a trust signal and it stays.
3. **No dossier vocabulary in customer-facing strings.** "Declared", "assayed", "batch pH",
   "certificate of analysis", "paperwork", "test mark" are all gone from body copy.
4. **Never undercut a claim in the following clause.** Removed: "which is a real but modest
   dose", "which is a tolerance test rather than a promise about your particular skin",
   "at best, and only as support", "than a story about them".
5. **Keep verification where it sells.** The 2% niacinamide assay figures on box 58 stayed,
   reworded from "98.65% of declared" to "tested to prove it … 98.65% of that figure".
   A number a customer can check is a reason to buy; the word "assayed" is not.

## Files changed

| File | Product | Changes |
|---|---|---|
| `components/product/beautybox/copy/charmingLook.ts` | 57 | 29 + 12 strings |
| `components/product/beautybox/copy/antiAging.ts` | 58 | 37 + 10 strings |
| `components/product/beautybox/copy/deepMoisturizing.ts` | 59 | 15 strings |
| `components/product/revitaglow/revitaGlowCopy.ts` | 63 | 5 strings |
| `components/product/scalpbrush/scalpBrushCopy.ts` | 61 | 3 strings |

Products 64, 65 and 66 were swept in the previous session and re-checked clean here.

## Fact chips

Eight of the ten beauty box item cards opened their chip row with a QC value —
`pH 5.86`, `Batch pH 6.51`, `Batch pH 7.24`. Every `Batch pH` chip is deleted; "batch" is
QC language and the number means nothing at the point of sale. Where pH genuinely
differentiates, as on the acid-balanced cleanser, the number stays but sits behind a
benefit chip. Freed slots went to purchase-relevant facts: **Three shades** on the cushion,
**Goes over make-up** on the toner, **Left on overnight** on the sleeping mask.

## Accuracy preserved

Nothing here loosened a claim. The dermatological testing lines still name exactly the
products that carry it — four of five in box 57, four of five in box 59, all five in box 58
— they just say "are all dermatologically tested" instead of describing a printed mark.

## Verification

`tsc --noEmit` and `eslint components/product` both clean. All three locales of products
57, 58 and 59 rendered and the changed sections read back correct.
