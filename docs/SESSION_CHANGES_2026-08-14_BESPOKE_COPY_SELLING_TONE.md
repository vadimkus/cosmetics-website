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

---

# Second pass — page-by-page read

The first sweep was pattern-driven, so it caught the phrases it was looking for and missed
whatever it was not. This pass read all nine bespoke pages in full, one at a time, in all
three languages.

## What the full read found that a pattern search could not

**Two contract manufacturers named on the page.** Box 58 listed *"Serum and cream by GENIC
Co., Ltd., mask by SLC Co., Ltd."* in its Origin row. Same problem as the CNF mention that
was pulled from product 65 — we are selling GENOSYS, not advertising who else touched it.
The row now reads *"Made in Korea for DTS MG Co., Ltd., Seoul"*. DTS MG stays everywhere it
appears: it owns the brand, so it is heritage, not outsourcing.

**Two section headers that advertised their own limits.** "What is actually measured" over
"The numbers we can stand behind" implies there are numbers we cannot, and box 59's "The
part that was tested" says out loud that the rest was not. They are now "What is in it /
The numbers behind it" and "The clinical results / Measured on real skin".

**A lab dump at the end of box 57's evidence band.** *"Batch certificates on file: cushion
pH 6.51, overnight mask pH 5.71, cleanser pH 5.86, toner pH 6.08."* Deleted. Four pH values
in a row sell nothing.

**"We will not invent a number" and "we will not tell you it is pain-free."** Box 59's
shelf-life answer and product 65's stinging answer were both arguing with an imaginary
sceptic. Both now answer the question and stop.

**Fifteen more "the manufacturer" constructions**, mostly on the hair stamp: *the
manufacturer records / describes / specifies / has not recommended*. Every one of them put
a third party between us and the reader on a claim we are happy to make ourselves.

**One Russian string the first sweep missed entirely** — the triple-function answer on box
57 still said the three functions were "printed on the Korean side of the packaging" long
after the English and Arabic had been fixed. Also fixed a Russian case error in the same
file (*в креме*, not *в крем*).

**Two apostrophe-avoidance bugs** that read as broken English: "the skin own water-transport
channels" (box 59) and "the manufacturer Anti-aging Peptide 6 complex" (box 58).

## Second-pass counts

| File | Product | Strings |
|---|---|---|
| `components/product/beautybox/copy/charmingLook.ts` | 57 | 29 |
| `components/product/beautybox/copy/antiAging.ts` | 58 | 38 |
| `components/product/beautybox/copy/deepMoisturizing.ts` | 59 | 29 |
| `components/product/biomeso/biomesoExpertCopy.ts` | 60 | 9 |
| `components/product/scalpbrush/scalpBrushCopy.ts` | 61 | 14 |
| `components/product/revitaglow/revitaGlowCopy.ts` | 63 | 9 |
| `components/product/hairstamp/hairstampCopy.ts` | 64 | 21 |
| `components/product/biomeso/biomesoCopy.ts` | 65 | 15 |
| `components/product/cerabarrier/cerabarrierCopy.ts` | 66 | 12 |

Product 66 needed the least work and product 58 the most, which tracks: 66 was written as
sales copy from the start, 58 was written straight out of the Intertek dossier.

## What was deliberately kept

Honest guidance that protects the buyer is not the same as undercutting a claim, so these
stayed:

- The SPF caveat on 57 and 63 — a tinted base is rated at a heavier layer than anyone wears,
  so a beach day needs sunscreen underneath. Says so plainly.
- "Sunscreen is the one thing this routine assumes and does not contain" on 58 and 59.
- Product 60's downtime timeline, day by day, including the peeling.
- Every "look elsewhere if" list, including "you never wear base make-up — the cushion is a
  third of the value of this box".
- `fullInciNote` and the precautions notes, which still say "as printed on the carton".

## Verification

`tsc --noEmit` clean, `eslint` clean on all nine modules. Products 57, 58, 59, 60 and 65
rendered locally and the rewritten bands read back correct.
