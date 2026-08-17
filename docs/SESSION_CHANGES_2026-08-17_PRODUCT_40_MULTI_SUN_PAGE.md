# Product 40 — Multi Sun Cream — bespoke editorial page

Seventh product onto the editorial system, and the one that completes the sun
pair. Source audit is in
`SESSION_CHANGES_2026-08-17_PRODUCT_40_MULTI_SUN_SOURCE_AUDIT.md`.

## The fact the page is built on

This cream carries **18.50% UV filter**. Its bigger sibling, product 39, carries
**17.10%** — and rates SPF50+ / PA++++ against this one's SPF40 / PA++.

Less filter, better grade. That looks like an error until you look at which
wavelengths the filters absorb. Three of the four here — octinoxate, octisalate
and amiloxate — are UVB absorbers, and the only UVA cover is titanium dioxide,
which reaches short UVA and stops. There is no dedicated long-UVA filter in the
tube. Ultra Shield has two.

Explaining that is a better sell than pretending the pair differ only in size,
so the page has a section called "The missing wavelength" that does exactly
that, and a two-column chooser at the end that tells people which tube is for
which day rather than pushing the expensive one.

## The thing that had to be said

**This product contains octinoxate at 7.50%**, and it is the largest filter in
the formula. Product 39's page — built yesterday, and which cross-sells to this
one — carries the claim "no oxybenzone, no octinoxate".

So the page has a bordered block headed "This one contains octinoxate" carrying
four verified points: the 10% European cap, the SCCS conclusion of June 2025
that it is safe at that level in a face cream, the same opinion's confirmation
that it is **endocrine-active**, and the fact that the SCCS **did not assess
environmental effects at all** — which is precisely the coral question people
are actually asking. It closes by telling anyone avoiding octinoxate to buy the
Ultra Shield instead, which is the more expensive tube.

I checked whether product 39 needed changing and concluded it does not: its
claim is accurate and scoped to itself, and its cross-reference to this product
mentions only UV index and weight, never composition. The disclosure belongs
where the person about to buy is standing.

## The best quality evidence in the range

The certificate of analysis for this product does something product 39's does
not: it **assays every filter** rather than merely restating the recipe.

| Filter | Declared | Found |
|---|---|---|
| Ethylhexyl Methoxycinnamate | 7.50% | 7.21% |
| Ethylhexyl Salicylate | 5.00% | 4.96% |
| Isoamyl p-Methoxycinnamate | 3.00% | 2.98% |
| Titanium Dioxide | 3.00% | 2.75% |

All four clear the 90%-of-declared specification. That got its own section,
because almost no brand publishes it and it is the difference between a number
on a box and a number somebody checked.

Also on the record: octisalate sits at **exactly its 5% European ceiling**. At
the limit, not over it. Caps verified against the consolidated Regulation (EC)
1223/2009 Annex VI, text as at 1 May 2026, not from memory.

## Corrections made

**The record had no INCI at all.** The `ingredients` field was empty — a
sunscreen whose whole argument is its composition was shipping without an
ingredient list. Transcribed from the registered artwork.

**"Mannan"** was sold as a key ingredient. It is not an INCI name and does not
appear in the formula; the nearest thing is konjac root extract at 100 ppm.

**"Lactobacillus/Soymilk Ferment Filtrate"** was also sold as a key ingredient.
The manufacturer's own quantitative formula declares it at **0.0000000%**.

**Palmitoyl Pentapeptide-4**, which the carton itself credits with the calming,
is at **0.0000001% — one part per billion**. Named on the page, with no effect
attached.

**"Suitable for sensitive skin"** came off. The product is fragranced at 0.25%
with five EU-declared allergens, so the page names all five with their
concentrations and says plainly that a fragrance-free sunscreen may suit
reactive skin better.

## Registration and record

- `MultiSunProductPage` registered for `'40'`;
  `BESPOKE_COMPANIONS['40'] = ['39', '16', '36', '13']`, Ultra Shield first by
  design. `'40'` added to all three locale allow-lists.
- `scripts/update-product-40-multi-sun-record-20260817.ts` rewrites the three
  descriptions, `keyFeatures`, `benefits`, `productDetails` and adds the
  `ingredients` array with the full INCI.
- `productsDb` cache key bumped `v40` → `v41`.
- `multisun.css` retints the shared tokens to burnt amber, taken from the warm
  daylight treatment of the carton and studio set, so it reads as related to
  product 39's violet without being the same page.

## Logged to the corrections file

Five entries under 40: the empty INCI field, the cross-product octinoxate risk
between 39 and 40, the Mannan / zero-dosed-ferment / sensitive-skin claims, a
badly garbled tube render on slide S1 (third product running with this problem
after 36 and 39), and a dossier inconsistency worth resolving — **the allergen
sheet in the pack is dated December 2019 and lists linalool, coumarin and
geraniol, none of which appear in the current formula's declared allergens**.
The formula and the registered artwork agree with each other, so those were used
and the 2019 sheet was not.

## Verification

- `tsc --noEmit` clean, eslint clean.
- Jest: 68 suites, 490 passed, 3 skipped.
- Production build passed.
- Headless check on all four views (EN, AR, RU, mobile): **zero console errors**,
  and the filter load, the octinoxate disclosure, the batch assay figures and
  the allergen list all present in every locale.

## Still open

- **Photography.** Same as every product so far: the tube renders are generated
  and S1 carries garbled type.
- **No safety assessment exists for this product.** Product 39 has a 59-page EU
  one; this has none in the dossier. Everything regulatory on this page comes
  from the published SCCS opinion and Annex VI directly rather than from a file
  GENOSYS supplied. Worth asking DTS MG whether one exists.
