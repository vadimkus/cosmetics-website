# HR³ MATRIX HAIR TONIC α blog post - 2026-08-03

## Published article

- Slug: `scalp-first-hair-care-hr3-matrix-hair-tonic-alpha`
- English: https://genosys.ae/blog/scalp-first-hair-care-hr3-matrix-hair-tonic-alpha
- Russian: https://genosys.ae/ru/blog/scalp-first-hair-care-hr3-matrix-hair-tonic-alpha
- Arabic: https://genosys.ae/ar/blog/scalp-first-hair-care-hr3-matrix-hair-tonic-alpha
- Product: https://genosys.ae/products/43
- Publishing script: `scripts/create-hr3-hair-tonic-blog.ts`
- Featured image: `/images/hair_tonic/main.jpeg`
- Article images: `/images/hair_tonic/s1.jpeg` through `/images/hair_tonic/s6.jpeg`

## Editorial approach

The article uses a scalp-first story without promising hair regrowth. It explains:

1. Why persistent or concerning shedding needs a diagnosis rather than a cosmetic guess.
2. What the Korean MFDS functional-cosmetics category means.
3. The exact current α formula and its scalp-care roles.
4. Why topical-caffeine research is interesting but cannot be extrapolated to this product.
5. The registered morning-and-evening leave-on protocol.
6. A sustainable gentle-hair and scalp routine, with clear referral signs.

English, Russian and Arabic receive complete localized titles, excerpts and article bodies.

## Product source of truth

The article was checked directly against local Intertek registration documents:

- `Registration DOC/Formula_up/Formula-GENOSYS HR3 MATRIX HAIR TONIC α.pdf`
- `Registration DOC/Artwork/[GENOSYS]HR3 MATRIX HAIR TONIC α.pdf`
- `Registration DOC/COA/COA-GENOSYS HR3 MATRIX HAIR TONIC α(NF002).pdf`

Verified points:

- Registered function: scalp nourishing and hair conditioning.
- Korean positioning: functional cosmetic that helps alleviate hair-loss symptoms, not a medicine.
- Protocol: shake, spray on scalp, massage, do not rinse, leave at least 3–4 hours, use morning and evening.
- Current formula: Menthol 0.30%, Salicylic Acid 0.25%, Panthenol 0.20%, Allantoin 0.10%, Caffeine 0.001%, Copper Tripeptide-1 0.0001%.
- Formula contains Alcohol Denat. 9.5%; no alcohol-free claim is made.
- COA lot NF002 reports pH 4.38 and passing assays for menthol, salicylic acid and dexpanthenol.
- The obsolete `Ingredient lists_old/HR3 MATRIX HAIR TONIC.pdf` formula was not used.

## Public sources

- [American Academy of Dermatology - Hair loss: Tips for managing](https://www.aad.org/public/diseases/hair-loss/treatment/tips)
- [Korean Ministry of Food and Drug Safety - Functional Cosmetics](https://www.mfds.go.kr/eng/wpge/m_24/de011014l001.do)
- [Wójcik et al. (2025), Caffeine as an Active Ingredient in Cosmetic Preparations Against Hair Loss: A Systematic Review](https://doi.org/10.3390/healthcare13040395)

The caffeine review covered nine studies and 684 participants but found mostly low or very-low-quality evidence. The article explicitly treats it as ingredient-level context, not proof for this formula or concentration.

## Claim controls

- No invented efficacy percentages.
- No “prevents hair loss”, “regrows hair” or medical-treatment claim.
- No extrapolation from other caffeine concentrations.
- No claim that Copper Tripeptide-1 or botanicals produce a measured growth result.
- Full cosmetic-versus-medicine distinction retained in all three languages.
- Pregnancy-related salicylic-acid caution follows the Korean registered artwork.
- No legacy `/images/HT.jpg` or `/images/Second/tonicc.jpg` references.

## Publishing behavior

The Prisma script is idempotent by slug:

- First run creates and publishes the row.
- Later runs update localized content and metadata while preserving the original `publishedAt`.

