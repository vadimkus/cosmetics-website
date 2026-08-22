# Product 51 — the 218% hydration claim is not reproducible

**Date:** 22 August 2026
**Product:** 51, BIO-FERMENT AGE DEFYING POWDER MASK
**Trigger:** claim review of the live English page at `/products/51`

## Finding

The DTS MG deck prints **"218% improvement in skin hydration"** directly beside the two
values it was measured from: **17.27 before** and **48.513 after**.

Those two values do not produce 218%:

| Reading | Value |
|---|---|
| After ÷ before | 2.81× |
| Percentage increase | **180.9%** |
| After as a percentage of before | 280.9% |

For 218% the after value would have to be 54.92, or 37.65 if read as a proportion of
baseline. Neither figure appears anywhere in the deck. The number looks like a
transposition of **281%**, which is the after value expressed as a percentage of the before
value.

The error originates in DTS MG's own slide. Our page inherited it and printed the derived
percentage next to the two source values, so the page contradicted itself.

## Corrections applied

The measured pair is kept and the derived percentage dropped. English now reads that skin
moisture nearly tripled, 17.27 to 48.513.

Surfaces changed:

- `components/product/bioferment/bioFermentCopy.ts` — subheadline, hero bullet, stats card,
  Hydrate card, proof headline, proof note
- `lib/productQuickFactsCatalog.ts` — the English quick-fact title
- `lib/chatbot/config.ts` — product entry, with an explicit instruction never to quote 218%
- `lib/products.ts` — static fallback description
- Production database, via `scripts/fix-product-51-hydration-claim-20260822.ts` —
  `description` and `benefits`

Two further corrections in the same pass:

- The Cool card presented the −10°C and −11°C readings as a trial-wide result. The deck
  labels that slide **[Case Study]** and shows two individual subjects, so the copy now says
  two case studies.
- The proof attribution read "Satisfaction panel: 21 women aged 30 to 59" directly beneath
  the hydration chart. In the deck those 21 women belong to a separate **Product
  Satisfaction Survey** slide. The hydration trial states no sample size at all, so the two
  are now clearly separated.

## Checked and found correct

- Every formula percentage matches `Formula-GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK.pdf`
  exactly: diatomaceous earth 41.79%, glucose 35%, algin 15%, calcium sulfate 6%, hydrolyzed
  collagen 0.2%, allantoin 0.1%, menthol 0.02%, Chamaecyparis obtusa water 0.093%, and six
  sh-peptides at 0.0000001% each. Total 100.00%.
- Declared functions match the copy: glucose is the humectant, calcium sulfate the coagulant,
  Chamaecyparis obtusa water a fragrance ingredient, which is why the page answers "no" on
  fragrance-free.
- Mix ratio 1 : 1.5, three scoops of powder to four and a half of water, 15–20 minutes,
  peel off, keep clear of eyes and eyebrows, 300g giving about seven 40g treatments,
  dermatologically tested, six months after opening. All match the artwork and COA.
- The individual case figures of 327% and 323% match the deck's 327.066% and 322.971%, and
  the −10°C and −11°C readings match their stated skin types.

## Correction to an earlier reading of this deck

An initial pass reported that the cooling slides had no untreated comparator. That was
wrong: the Before Use / After Use labels belong to the hydration slides. The cooling slides
do carry a comparator, **"Product not-applied area"** against **"Product applied area"**,
read before heating the face, after heating, and after application. The page's description
of treated against untreated skin is accurate and was left unchanged.

## Open item

The whole proof section is gated to `locale === 'en'` in `BioFermentProductPage.tsx`, so
Russian and Arabic customers do not see these figures at all. English and the other two
languages therefore make different claims for the same product. Worth a decision.
