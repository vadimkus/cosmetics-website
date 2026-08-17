# Product 25 — SOOTHING REPAIR POSTCREAM — bespoke page

Source audit: `SESSION_CHANGES_2026-08-17_PRODUCT_25_POSTCREAM_SOURCE_AUDIT.md`.
Commercially one of the more important products in the range, because it is what
clinics hand a client on the way out after microneedling.

## This one is a re-attribution, not a debunking

Worth stating plainly, because it changes the tone of the page. Every other
product this week involved cutting a claim that could not be supported. Here the
claim is **well supported** — this is a properly built calming cream — and the only
problem was that our own description credited it to the wrong ingredients.

The page says so out loud rather than quietly reordering the list, because a
customer comparing the old description with the new one deserves the explanation,
and because the correction is genuinely flattering to the product.

## Our key-ingredient list was in almost exactly inverse order of concentration

| Position in our old list | Ingredient | Actual |
|---|---|---|
| **1st** | sh-Polypeptide-7 | **10 parts per billion** |
| 2nd | Centella triterpenes, combined | 200 ppm |
| **3rd** | **Dipotassium glycyrrhizate** | **0.200%** |
| 4th | Panthenol | 0.050% |
| 5th | Grape callus culture extract | 60 ppm |
| 6th | Rosa damascena callus culture extract | 60 ppm |
| **7th** | **Scutellaria baicalensis root extract** | **0.200%** |

A peptide at ten parts per billion led the list. The two ingredients genuinely at
anti-irritant doses were third and last. And the **18.4% humectant load** —
butylene glycol at 12.000% plus glycerin at 6.390%, the largest functional
component of the product and the most useful thing for skin that has just lost its
barrier — was not mentioned anywhere.

The page prints this table as-is, marks the two real doses, and says the
ingredients were ranked by how good they sound rather than by how much of them
there is.

## What the page now leads with

18.4% humectants, then the calming set that is genuinely at working doses:
dipotassium glycyrrhizate 0.200% (licorice, mid-range for its normal 0.1–0.5%
use), scutellaria baicalensis 0.200% for its baicalin, allantoin 0.200%, bisabolol
0.050%, vitamin E 0.500% and arginine 0.500%, over a moderate ~8.3% lipid phase.

The **centella complex gets its own note** rather than a bullet, because it needed
precision in both directions: 0.020% of **purified triterpenes** is a deliberate
and comparatively expensive choice, not label dressing, but the wound-healing
literature works at 0.1–1%, so it is five to fifty times below that. Supporting
detail, not the engine.

## The broken-skin instruction gets its own block

Korean precaution 2 on the carton: **상처가 있는 부위 등에는 사용을 자제할 것** —
refrain from use on wounded areas.

That deserved prominence rather than a bullet, because "post-procedure cream" is
easy to read as permission to apply it to anything a procedure leaves behind, and
our old copy actively invited that reading with "after the dermatological
operations". The page draws the line between **irritated but intact** and **open**
skin, and defers timing to the practitioner.

## Claims removed

**"Efficacy test on protection of the skin against damage induced by physical
stimuli."** No report exists, and the phrase "physical stimuli" does not appear
once in the 42-page assessment. For a product sold specifically for skin that has
just been physically traumatised, this would be the most valuable substantiation we
could hold, which is exactly why it should not be claimed until we have it.

**"Regenerating cream… promotes healthy rejuvenation."** The registered carton
function is the single word **"Soothing"**. There is no Korean functional licence
on this product, and consistent with that, **neither certificate of analysis
carries an ingredient assay line** — there is no functional active to measure. The
page uses the manufacturer's own registered claim instead: helps fast skin recovery
after professional treatment.

**Any regeneration story from the two callus culture extracts**, at 60 ppm each.
The same cut already applied to product 24.

## Newly disclosed

- **Period after opening: six months.** The 6M symbol is on the carton and was
  nowhere on our site. Material for a 100 g tube shared across many clients.
- **Beeswax 0.500%**, so not vegan.
- **Lavender oil 0.0053% with linalool 0.0047%.** Unusually, the assessment had
  the finished cream **analysed** for linalool, measuring 0.0032% — a tested figure
  rather than a calculated one.
- **It may be applied several times a day**, which the carton explicitly permits.
  Genuinely useful for the first 48 hours and it was not being passed on.
- **It contains no functional actives at all** — no retinoid, acid, vitamin C,
  arbutin, adenosine or UV filter. On freshly treated skin that absence is a
  selling point, so the page frames it as one.

## The cleanest assessment of the week

> The product is considered **safe for human health** when used under normal or
> reasonably foreseeable conditions of use.

No "with restrictions" qualifier, unlike products 32 and 23. Patch test graded
**Non Irritant** by QACS. Both batches on file test consistently, and **four**
pathogens were screened including *E. coli* rather than the usual three.

## Files

| File | Change |
|---|---|
| `components/product/postcream/postcreamCopy.ts` | New. EN/AR/RU. |
| `components/product/postcream/postcream.css` | New. Soft sage, plus the amber alert style for the broken-skin block. |
| `components/product/postcream/PostcreamProductPage.tsx` | New bespoke page. |
| `components/product/bespokePdp.tsx` | Registered 25; companions 42, 16, 13, 10. |
| `app/{,ar/,ru/}products/[id]/page.tsx` | Added 25 to the allow-lists. |
| `scripts/update-product-25-postcream-record-20260817.ts` | Record fix, applied. |
| `lib/productsDb.ts` | Cache key v45 → v46. |

## Verification

Typecheck, lint and the full Jest suite (68 suites, 490 tests) pass. Clean
checkout production build passes. Browser pass on all three locales with zero
console errors.

## Open items

1. **We hold no certificate of analysis for the 20 g size we actually sell.** Both
   certificates on file are for the 100 g professional size, including the one
   whose filename says 20 g. Worth resolving, since the 20 g is the retail item.
2. **The Russian panel overclaims badly** — "heals", "enhances regeneration",
   "relieves oedema and inflammation" against a registered function of "soothing".
   Same drift already logged on product 24's non-English panels.
3. **Third volume-on-weight error** on a Russian panel ("Объем 20 мл" against NET
   WT. 20g). Three separate products now. Ask DTS MG to audit the whole Russian
   panel set in one pass rather than us finding them individually.
4. **Request the physical-stimuli efficacy report** or retire the claim.
5. **Photography.** One image, `images: null`, no gallery, on a product clinics
   reorder repeatedly. The video partly covers it.
