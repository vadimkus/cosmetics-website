# Product 41 — BB Cushion — page rework and selling-tone rewrite

**Date:** 16 Aug 2026
**Page:** https://genosys.ae/products/41
**Follows:** `SESSION_CHANGES_2026-08-16_PRODUCT_41_BB_CUSHION_DOSSIER_AUDIT.md`

## What Vadim asked

Two things, on the same page.

1. The lead paragraph read *"Korea licenses this one cushion for three things at
   once: protection from UV, help with tone, and help with wrinkles. Most base
   makeup is licensed for none of them."* — "not user friendly, not selling".
2. Rework the page to follow the design of the other bespoke product pages.

Both were fair. The sentence led with the regulator instead of the buyer, which
is exactly what the selling-tone rule prohibits, and the page itself was a
365-line one-column layout where every other bespoke page runs 1,100–1,400
lines on the shared editorial system.

## The rewrite

**Before**

> Korea licenses this one cushion for three things at once: protection from UV,
> help with tone, and help with wrinkles. Most base makeup is licensed for none
> of them.

**After** — headline plus lead

> **One press covers you, shields you and treats you.**
>
> Press, pat, and you are done: even coverage that still reads as skin, the
> highest sun rating Korea awards, and two skincare actives working underneath
> it all day. Korea licenses this cushion for all three at once — sun, tone and
> wrinkles — which is a licence almost no base makeup holds.

The licence did not get dropped. It moved to where proof belongs: after the
claim, as the reason to believe it. Same treatment in Arabic and Russian.

## The page

`components/product/bbcushion/BbCushionProductPage.tsx` rebuilt on the same
system as products 63, 64, 65 and 66: `cerabarrier.css` for structure, the Cera
primitives, `CeraGallery`, `CeraClosingCta`, with `bbcushion.css` restating the
palette in camel.

Section order:

| Section | Content |
|---|---|
| Hero | Breadcrumb, gallery with lightbox, shade picker, price, quantity, favourites, share, trust badges |
| Stats strip | SPF50+ · 5 filters · 2% niacinamide · 30 g |
| Three jobs | The three licensed functions plus the instant tone card |
| Why it lasts | Essence base, pigment and filters together, three fixing polymers |
| The filters | Five-row table, mineral and chemical, with the butyloctyl salicylate note |
| Three shades | Shade guide (s4) wide above three cards, each selecting the shade |
| The puff (s2) | Waterdrop tip, fourth waterproof layer, refill in the box |
| How to use (s3) | Four steps plus the product video, and the honest reapplication note |
| The formula | Actives from the record, full INCI in an accordion |
| Quality | Dermatological test, pH, purity, shelf life, Dubai Municipality |
| Precautions | Including the two the Korean panel prints and the English one omits |
| Routine | Cleanse → mist → cream → cushion, all addable to the bag |
| Specification | Size, SPF, actives, shades, finish, skin, origin, PAO, storage, barcodes per shade |
| FAQ | Six, led by shade choice |
| Reviews, closing band, sticky bar | As every sibling page |

What was gained over the old layout: the gallery and lightbox, the sticky
add-to-bag, the closing CTA band, reviews, the routine cross-sell, the
specification table with the per-shade barcodes, the brochure download, the
breadcrumb, favourites and share, and the product video.

**Shades are no longer defaulted.** The old page pre-selected Beige. A base in
the wrong depth is a return, so the CTA now stays locked and scrolls back to
the swatches if someone taps it early — the same rule as product 63.

## Copy

`bbCushionCopy.ts` rewritten end to end in all three languages, roughly 150
strings per locale. Arabic shade codes normalised to the Latin `#01 Ivory` form
that is printed on the box, wrapped in left-to-right marks so bidi cannot
reorder them mid-sentence.

## Record fixes

`scripts/update-product-41-bb-cushion-selling-copy-20260816.ts`, applied:

- `productDetails.technology` said **"60% moisture essence with 40% peptide
  complex"**. The named ingredients sum to ~73.6%, which puts water at about a
  quarter, and the nine peptides run 640 ppb down to 10 ppb. Replaced with the
  filter and active statement.
- The **Glutathione** entry credited it with blocking tyrosinase and helping
  cystic acne, at 100 ppm. Reworded to an antioxidant present at trace level,
  with the tone claim moved to niacinamide 2% where it belongs.
- **Adenosine 0.04%** — the registered wrinkle active — was missing from the
  actives list entirely, so the page could not show it. Added, along with the
  five filters and the three fixing polymers.
- All three descriptions rewritten to the new benefit-led lead.

Also updated `lib/productQuickFactsCatalog.ts` for product 41: "Licensed for
three things" became "Covers, shields and treats", and the refill fact dropped
the stale "refill-only packs are also available" line.

`lib/productsDb.ts` cache key bumped `v36 → v37`, since the row was edited
outside admin.

## Gallery

Untouched, per the gallery rule. Slides s5 and s6 still carry the "60%+
MOISTURE ESSENCE" bullet; that was already logged for re-export as `s5b`/`s6b`
in `~/Desktop/genosys-artwork-corrections.html` during the audit pass, together
with the "9 REGENERATING PEPTIDES" wording. The slides stay on the page until
corrected versions exist under new filenames.

## Verified

- `tsc --noEmit` clean, `next build` clean, no lint errors.
- Rendered locally at `/products/41`, `/ru/products/41` and `/ar/products/41`:
  all sections render, all images resolve, shade selection works, Arabic
  mirrors correctly and the filter percentages and shade codes survive bidi.

## Still open

- Confirm whether the Ivory refill is now sold separately; the deck note is
  from 2025 and no current claim about refill-only packs is on the page.
- Re-export s5 and s6 without the 60% figure, then repoint the gallery.
