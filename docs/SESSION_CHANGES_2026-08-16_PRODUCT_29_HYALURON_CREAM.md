# Product 29 MOISTURE REPLENISHING HYALURON CREAM: Intertek audit, selling-tone rewrite, bespoke page

**Date:** 16 Aug 2026
**Live:** https://genosys.ae/products/29 (plus /ru and /ar)

The cream half of the pair whose serum is product 18.

## Documents read

- `MOISTURE REPLENISHING HYALURON SERUMCREAM/.../CREAM/Formula_updated_22062025.pdf` — current DTS MG formula, signed
- `.../Artwork_updated_22062024.pdf` — function, application, front panel, full INCI, all language panels
- `.../COA_updated_22062024.pdf` — pH, viscosity, heavy metals, micro, three-year span
- `public/documents/PPT/GENOSYS MOISTURE REPLENISHING HYALURON CREAM.pdf` — the DTS MG deck

No safety assessment on file, same as the serum.

## Distinctive fact

**The carton prints the dose of every hyaluronate beside its name.** Sodium hyaluronate
(1,000.9 ppm), then seven more at 30 ppb, then one at 1 ppb. Almost nobody does that,
and it means a shopper can read the box and see for themselves that one form carries
the product and the other eight are parts per billion.

The deck says what that 1,000 ppm is doing: it is the **high molecular weight**
fraction, the heavy grade that films the surface and stops water leaving. That is the
honest split with product 18, which runs **2,000 ppm of hydrolyzed** hyaluronic acid,
the small fragmented form that goes in. Serum fills, cream seals, and neither is a
weaker version of the other. Both pages now say this.

Behind it, glycerin at **9%**, nearly a tenth of the tube and more than every named
complex in the formula added together, plus PENTAVITIN at 0.615%.

## Hyaluronan 11 stays

The workspace rule flags product 29 as one where an INCI-only audit previously banned
a legitimate manufacturer name. The deck settles it: it names **Hyaluronan 11
Multi-Complex**, lists the **eight INCI entries** it covers, and explains the count as
**eleven molecular weight grades**. The Korean carton panel prints the same count. The
page uses the name and shows the reconciliation rather than hiding either number.

## Cut from live copy

- **Mushrooms as "powerful anti-inflammatory and antioxidant"** actives. Five extracts at about 0.17 ppm each, Tremella polysaccharide at 0.6 ppm. Named, not credited
- **"Anti-Aging Benefits — Reduces fine lines and improves skin elasticity"**. No study. The clinical on file is hydration only
- **"All skin types, including sensitive"**. The deck says dry and dehydrated skin, and notes dehydration happens to oily skin too. That is what the page says
- **"4-step hydration system"** as the technology name, and **aquaporin as the mechanism**. Glyceryl glucoside is at 5 ppm
- **"Professional Results — salon-quality hydration at home"**, filler

## Kept, because documented

+82% hydration immediately after a single application and 72-hour persistence, both
from the deck's clinical. The 21-woman satisfaction panel at 100%, quoted as a reported
impression. PENTAVITIN and Hyaluronan 11 by name.

The panel's word "firmer" is quoted as their impression and explicitly not presented as
a measurement, because no firmness study exists.

## Accuracy bugs fixed

1. The full INCI was **missing 1,2-Hexanediol** at 1.0008%. Third product in a row with
   this exact omission.
2. It printed **Propanediol before Dipropylene Glycol** where the carton has them the
   other way round.
3. It dropped the **ppm and ppb figures the carton prints** beside every hyaluronate,
   which are the most useful numbers on the entire list. Restored.
4. `productNumber` was null; set to `'29'`.
5. `data/productConfig.ts` listed the main image inside the gallery array, so the
   thumbnail strip opened on the same shot twice. Removed.

## Page

`components/product/mhcream/` — structurally the twin of product 30, including the two
tube sizes, with a glacier cyan palette taken from the sky-blue cream itself.

Sections: Fill, then lock → Hyaluronan 11 and where the weight sits → the hydration
trial → serum first then massage this in like a film → actives and full INCI → suited /
not → routine → spec (pH 6.00, no lot) → FAQ → reviews.

The "clean" slot holds the trial rather than a no-additions badge, because this carton
has no such badge and this product does have a clinical.

One genuinely useful instruction recovered from the deck and now on the page and in the
quick facts: **do not keep it in the fridge**, because cold changes the viscosity and
the texture, and a light watery cream is the kind that suffers most.

Size selection: 50g at AED 290, 250g at AED 420. Cache key `product-by-id-v32`.

## Image jobs logged

- **s5** prints "gently pat". That is the serum's instruction; this carton asks for massage.
- **s4** credits the mushroom complex with anti-inflammatory and antioxidant action at 0.17 ppm.

Both in `~/Desktop/genosys-artwork-corrections.html`. Neither line is repeated in copy.

## Files

- `components/product/mhcream/mhcreamCopy.ts`, `mhcream.css`, `MhcreamProductPage.tsx`
- `components/product/bespokePdp.tsx`
- `app/products/[id]/page.tsx`, `app/ar/products/[id]/page.tsx`, `app/ru/products/[id]/page.tsx`
- `data/productTranslations.ts`, `data/productTranslationsRu.ts`, `data/productConfig.ts`
- `lib/productQuickFactsCatalog.ts` (five of six facts replaced; +82% kept)
- `lib/chatbot/config.ts`, `app/api/skin-analysis/ai/route.ts`
- `lib/products.ts`, `lib/productsDb.ts`
- `scripts/update-product-29-mhcream-selling-copy-20260816.ts` (applied)
- `scripts/apply-product-29-locale-files-20260816.py`, `scripts/scaffold-mhcream-page-20260816.py`

## Russian copy correction — 20 Aug 2026

The first Russian version was accurate but read like a literal translation of the English
draft. Phrases such as «крем везёт одна форма», «где на самом деле вес», «втирайте как
плёнку» and «вода внутрь» were not acceptable customer Russian.

The complete Russian PDP was rewritten in natural retail language while preserving the
verified figures: 1 000,9 ppm high-molecular-weight sodium hyaluronate, glycerin 9%,
PENTAVITIN 0.615%, +82% hydration after one application and a statistically significant
effect at 72 hours. The rewrite covers the hero, mechanism, clinical section, routine,
ingredient cards, suitability guidance, FAQ, specifications, static translation payload,
database description and localized product name.

`MhcreamProductPage` now displays `nameRu` on the Russian bespoke page instead of the raw
English product name. Regression tests reject the known machine-translated phrases and
validate every JSON-encoded Russian product field.
