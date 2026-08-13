# Phytolex SC, MultiEx Phytrogen and "oxygen therapy" removed from live copy

**Date:** 13 Aug 2026
**Scope:** 9 database records, 2 product translation files, 3 message bundles
**Status:** database live, code pushed to main
**Related:** `SESSION_CHANGES_2026-08-13_PRODUCT_59_DEEP_MOISTURIZING_BOX_PAGE.md`, which
removed the same claims from product 59 and flagged the rest.

## Why

Product 59's copy was corrected earlier today after its claims were checked against
manufacturer documents. The same claims were still live elsewhere, in text as well as in
artwork. This pass clears the text.

### "Phytolex SC" and "MultiEx Phytrogen"

Both were listed as declared ingredients of the Snow O₂ Cleanser, the Snow Booster and
the Intensive Hydro Soothing Cream, each with a description written to match, and both
were repeated in the beauty-box descriptions that contain those products.

Every document we hold for the three products was text-extracted and searched: the
quali-quanti ingredient lists, the older ingredient lists, the signed formulas, and the
printed 180ml and 200ml labels. Neither name occurs once. The same extraction finds Aqua,
Glycerin and Water in every file, so the documents are readable and the absence is real.

They are not invented complexes. They are supplier trade names for clusters that **are**
declared, and the label names the members:

| Trade name | What is actually declared | Level |
|---|---|---|
| Phytolex | Phaseolus Radiatus Extract, Betula Platyphylla Japonica Bark Extract, Rumex Crispus Root Extract | 0.1% each in the Booster; 0.008% and below in the Cream; 0.0005% down to 0.000003% in the Cleanser |
| MultiEx Phytrogen | Soy Isoflavones, Pueraria Lobata Root, Pueraria Mirifica Root, Polygonum Cuspidatum Root, Cimicifuga Racemosa Root, Angelica Polymorpha Sinensis Root, Punica Granatum Fruit, Trifolium Pratense (Clover) Flower | 0.001 to 0.003% in the Cleanser |

So the copy now names what the label names. That also stops trace botanicals being
presented as a product's headline actives, which at 0.000003% for Rumex Crispus in the
Cleanser is what was happening.

### "Oxygen therapy"

No Snow O₂ document uses the phrase. The label is modest and physical: "Naturally
generated oxygen bubbles clean make-up dirts and skin impurities without irritation to
skin." The site had turned that into a therapy mechanism, and in one place into
circulation: *"Oxygen Therapy - Provides skin with oxygen for improved circulation and
nourishment"*, a physiological claim about a rinse-off cleanser, sourced to nothing.

Removed wherever it described the Snow O₂ cleanser. **Deliberately left alone** on #26 EGF
Repair OxyMask Cream (hidden), #34 Skin Rescue Overnight Cream Mask and #38 EZ CO₂ Mask
Kit: those products have oxygenated-water capsules and a CO₂ system, so for them it may
well be the manufacturer's own concept. That needs its own document check rather than a
find-and-replace. Same for the `pc25Benefit1Text` combo string, which is about the CO₂
mask.

### A third thing, found on the way

`#10 productDetails.application` read **"Apply to wet skin, massage gently, rinse
thoroughly"**. The label reads **"Apply the product on dry face, avoiding eyes. When oxygen
bubbles occur, give a circular massage and rinse off with tepid water."** Applying this
cleanser to wet skin defeats the one thing it does. Corrected in English, Arabic and
Russian. The Russian `howToUse` steps already had it right, which is how the contradiction
surfaced.

## What changed

### Database, live (`scripts/fix-phytolex-phytrogen-claims-20260813.ts`)

Backup of all nine records before the write: `/tmp/phytolex-backup-2026-08-13.json`.

| Record | Fields |
|---|---|
| #10 SNOW O₂ CLEANSER | `description`, `ingredients`, `keyFeatures`, `benefits`, `productDetails` |
| #16 SNOW BOOSTER | `ingredients` |
| #28 INTENSIVE HYDRO SOOTHING CREAM | `ingredients` |
| #54 Holiday Kit | `description` |
| #55 PROBLEM SKIN CARE BEAUTY BOX | `description` (cleanser, serum and cream paragraphs) |
| #56 SKIN BRIGHTENING BEAUTY BOX | `description` |
| #57 CHARMING LOOK BEAUTY BOX | `description` |
| #58 ANTI-AGING BEAUTY BOX | `description` |
| #62 SENSITIVE SKIN BEAUTY BOX | `description` |

`#10 keyFeatures` had "Oxygen Therapy Mechanism" sitting two rows above "Natural Oxygen
Bubbles", so rather than restate the bubbles a third time it now carries the part shoppers
get wrong: the cleanser goes on dry.

### Code, needs the deploy

- `data/productTranslations.ts` (Arabic) - #10 `description`, `productDetails`,
  `keyFeatures`, `benefits`, `ingredients`; #16 and #28 `ingredients`; #54 to #58, #62 and
  their cuid-keyed duplicates. Also carries product 59's corrected Arabic description from
  this morning and product 61's from the earlier session, both the same kind of fix.
- `data/productTranslationsRu.ts` (Russian) - the same set.
- `messages/{en,ru,ar}.json` - `pc10Benefit2Text` only. The rest of each file's local diff
  is uncommitted work from the bespoke-page sessions and was **not** staged: it deletes the
  `pc61*` keys, which live `ProductRecommendation.tsx` still reads.

Arabic needed two passes: the box paragraphs say `العلاج بالأكسجين` while product 10's own
fields say `علاج الأكسجين`, without the article, so the first sweep missed them.

## Verified

- No `Phytolex`, `Phytrogen`, `Oxygen Therapy`, `علاج الأكسجين` or `кислородная терапия`
  left in either translation file except #26, #34 and #38 as described above.
- All 49 Arabic and 215 Russian JSON payloads still parse.
- `npx tsc --noEmit` clean, eslint clean.
- Pages checked in all three locales for #10, #16, #28 and #55 to #62: nothing stale, and
  the new English copy renders in the ingredient list, the feature grid, the benefit list
  and the detail rows.

## Still outstanding: artwork

The text no longer makes these claims. The marketing slides still do, and they need
re-exporting under new filenames, since `/images/*` is served with a one-year immutable
cache.

| File | Product | Gallery slot | Claim on the slide | Replace with |
|---|---|---|---|---|
| [`/images/cleanser/S3.jpg`](https://genosys.ae/images/cleanser/S3.jpg) | #10 Snow O₂ | 3 of 6 | "PHYTOLEX SC - Botanical complex", "MULTIEX PHYTROGEN - Multi-plant complex" | Keep the Methyl Perfluoroisobutyl Ether and Glycerin blocks; swap the two trade names for Phaseolus Radiatus / Camellia Sinensis / Coix Lacryma-Jobi extracts |
| [`/images/hyaluron/s1.jpeg`](https://genosys.ae/images/hyaluron/s1.jpeg) | #29 Hyaluron Cream | 1 of 6 | "11 Types of **Hyaluronic Acid**", plus a rendered tube reading "multilevel hydration with 11 types of hyaluronic acid" | "8 Forms of Hyaluronic Acid"; re-render the tube with the current label line |
| [`/images/hyaluron/s3.jpeg`](https://genosys.ae/images/hyaluron/s3.jpeg) | #29 | 3 of 6 | Headline is fine; the rendered tube still reads "11 types of hyaluronic acid" | Re-render the tube only |
| [`/images/hyaluron/s4.jpeg`](https://genosys.ae/images/hyaluron/s4.jpeg) | #29 | 4 of 6 | "11 MULTI-COMPLEX - 11 HA types" | "8 HA FORMS - low / mid / high MW - 1,000 ppm high MW" |
| [`/images/hyaluron/s6.jpeg`](https://genosys.ae/images/hyaluron/s6.jpeg) | #29 | 6 of 6 | "11 HA TYPES - Multi-depth fill" | "8 HA FORMS - Multi-depth fill" |

On S3 the honest replacement is already on the same slide: Methyl Perfluoroisobutyl Ether,
which is second only to water in the declaration.

For #29 the count is the problem, not the ingredient. The signed formula
(`Formula-GENOSYS MOISTURE REPLENISHING HYALURON CREAM.xlsx`) and the 250 g artwork
(`Artwork-GENOSYS MOISTURE REPLENISHING HYALURON CREAM 250g.pdf`) both declare **eight**
hyaluronate INCI names and no more: Sodium Hyaluronate (1,000.9 ppm), Sodium Hyaluronate
Crosspolymer, Potassium Hyaluronate, Hydroxypropyltrimonium Hyaluronate, Hydrolyzed Sodium
Hyaluronate, Hydrolyzed Hyaluronic Acid, Hyaluronic Acid (all 30 ppb) and Sodium Acetylated
Hyaluronate (1 ppb). The string "11" appears nowhere in either document. The current
printed tube claims "multi-level hydration with hyaluronic acid complex and various
mushrooms" - GENOSYS themselves dropped the count.

Our slides are internally inconsistent about this: s4 and s6 render the current tube text,
while s1 and s3 render an older tube that still carries the eleven. Whoever re-exports
should treat s4/s6 as the reference for the label artwork.

Worth knowing before rewriting the copy on s4: seven of the eight forms are dosed at
30 ppb or 1 ppb, which is 0.000003% and below. Only Sodium Hyaluronate at 1,000 ppm (0.1%)
is present in a functional amount, and the current text already leads with that figure.
"8 forms" is true; presenting all eight as equal actives would be the next version of the
same problem.

Separately, the Snow O₂ slides S1, S2, S3 and S6 render a bottle whose label text is
garbled - "DERMATOLOBICALLY TESTEB", "PBOFESSIONAL", "GENOXIS is a compounet word of Gene
Re-biuth Sonira". It reads at gallery size on desktop. Not a claims problem, but the same
re-export should fix it.

## Not fixed, and worth a separate pass

The same auto-generated tone produced other claims across the catalogue that no document
supports. Found while working on these records, left alone to keep this change reviewable:

- #28 `ingredients`: Beta-Glucan as a "natural immune-boosting ingredient that enhances
  skin's defense mechanisms and promotes healing".
- #28 Arabic `ingredients`: snail secretion filtrate described as "rich in glycoproteins
  and growth factors", where the English on the same record says only that it supports
  comfort and hydration.

Both are medical-adjacent claims on cosmetics and should be checked against the formulas
in the same way this pass was.
