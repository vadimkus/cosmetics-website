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

| File | Product | Claim on the slide |
|---|---|---|
| `/images/cleanser/S3.jpg` | #10 Snow O₂ | "PHYTOLEX SC - Botanical complex", "MULTIEX PHYTROGEN - Multi-plant complex" |
| `/images/hyaluron/s1.jpeg` | #29 Hyaluron Cream | "11 Types of Hyaluronic Acid" |
| `/images/hyaluron/s4.jpeg` | #29 | "11 MULTI-COMPLEX - 11 HA types" |
| `/images/hyaluron/s6.jpeg` | #29 | "11 HA TYPES" |

On S3 the honest replacement is already on the same slide: Methyl Perfluoroisobutyl Ether,
which is second only to water in the declaration. For #29 the count is the problem, not
the ingredient: both DTS MG hyaluronate decks list **eight** hyaluronate INCI names, and
eleven appears nowhere except our own artwork.

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
