# Product 53 - INTENSIVE REPAIR COLLAGEN MASK

**Date:** 14 August 2026
**Page:** https://genosys.ae/products/53
**Scope:** claims audit against the Intertek dossier, corrections in the database and
both locale files, a bespoke editorial page in EN/AR/RU, and an artwork log entry.

---

## 1. The collagen question

This is the finding that governs everything else on the page.

The Korean panel of the sachet prints the hydrolyzed collagen dose itself:
`하이드롤라이즈드콜라겐(1 ppm)`, which is **0.0001%**. Both formula documents agree, and
the formula's own function column classes it as a plain **Skin-Conditioning Agent**.

The site was claiming the mask **"boosts collagen production"**. It does not and cannot.
Hydrolyzed collagen is a protein fragment that sits on the surface and holds water.
Upregulating collagen synthesis would be a drug claim regardless of dose. Removed in all
three languages.

The opposite mistake was avoided just as deliberately. The page does **not** print `1 ppm`,
does not call the collagen "a small amount", and does not explain that it "is not the reason
the mask works". The ingredient is real, it is on the pack, it is in the product's name, and
the pack's own claim - *improves skin firmness and protects skin barrier by soothing and
hydrating skin with collagen and various botanical extracts* - is fully supported. The page
names it, says what it genuinely does, and moves on.

What the page leads on instead is the strongest true thing this product has:

| Ingredient | Formula_up (2025) |
|---|---|
| Glycerin | 10.052% |
| Butylene Glycol | 8.010% |
| **Humectant base together** | **18.062%** |
| Xanthan Gum | 1.500% |
| Betaine | 0.800% |
| Sodium Hyaluronate | 0.500% |
| Citrus Paradisi Extract | 0.475% |
| Centella Asiatica Extract | 0.285% |
| Allantoin | 0.200% |
| Witch Hazel Extract | 0.100% |
| Punica Granatum Extract | 0.0942% |
| Glycine Soja Seed Extract | 0.0942% |
| Alcohol | 0.100% |
| Parfum | 0.010% |

Eighteen percent of pure humectant is a very good thing to be able to say, and it is the
argument the page is built around.

## 2. Sources

Five documents cover this product. There is no marketing deck and no Safety Assessment
report for it, so the sourcing is unusually tight.

| Document | Location | Year |
|---|---|---|
| `Formula-GENOSYS INTENSIVE REPAIR COLLAGEN MASK.pdf` | `Registration DOC/Formula_up/` | 2025 |
| `Formula-GENOSYS INTENSIVE REPAIR COLLAGEN MASK.pdf` | `Registration DOC/Formula/` | 2022 |
| `GENOSYS INTENSIVE REPAIR COLLAGEN MASK.pdf` | `Quali-quanti Ingredients/` | 2017 |
| COA `(ABVMP001)` and COA `(1AAZMP001)` | two batches | - |
| `[GENOSYS]INTENSIVE REPAIR COLLAGEN MASK.pdf` | five-language artwork | 2024 |

**Use Formula_up (2025).** It is the newest, it is fully quantified, and it agrees with the
printed pack. The 2017 quali-quanti disagrees on six ingredients, rounds every figure to a
clean value and carries a corrupted CAS number; no percentage was taken from it.

pH comes from the two COAs: **6.67** and **6.96** against a spec of 6.50 +/- 1.00.

## 3. Claims removed

| Claim | Where it was | Why it went |
|---|---|---|
| Boosts collagen production | DB, AR, RU | False mechanism, and a drug claim in any case |
| Clinically tested, proven results | DB | No study exists for this product |
| Клинически доказан для улучшения увлажнения | RU `directions` | Same claim, survived the first pass in Russian only |
| Brightening, evens tone | DB, AR, RU | No vitamin C, niacinamide, arbutin or any other brightener in the formula |
| Anti-ageing, antioxidant | DB, AR, RU | English pack claims neither; only the Russian pack panel does, and that is logged as an artwork correction rather than copied onto the site |
| Antioxidant care (botanical card) | DB, AR, RU | Same, at ingredient level |
| Suitable for sensitive skin | DB, AR, RU key features | Parfum is in the formula and the page tells fragrance-avoiders to buy something else. The two could not both stand |
| Delivers essential nutrients for skin health | DB, AR, RU benefits | Filler naming no ingredient and no mechanism. Replaced with the leftover-essence point, which is true and checkable |
| Hyaluronic Acid | DB ingredient card | INCI declares Sodium Hyaluronate, the salt |

Claims that stayed, and their source:

| Claim | Source |
|---|---|
| Firmness, barrier, soothing, hydration | front panel of the sachet |
| Dermatologically tested | 2024 artwork |
| 23g single sheet | `NET WT. 23g/0.8 oz.`, Korean `용량: 23g` |
| 15 to 20 minutes | artwork directions |
| Non-woven sheet | Russian panel, `маска из нетканого материала` |
| pH near neutral | both COAs |

Deliberate omissions, not to be added without a document: marine collagen (only the Russian
panel says it; no document names a source species), cupra / Tencel / bio-cellulose (the only
substrate wording anywhere is "non-woven"), and any clinical percentage.

## 4. The duplicate Arabic entry

`data/productTranslations.ts` carried **two blocks for this product**: a full one under
`'53'` and a much thinner, older one under the CUID `cmgj9ifoi00008o07p4eqmfb7` with
`keyFeatures: null` and `ingredients: null`.

Different callers reach different keys. `ProductContentDisplay` looks up
`product.productNumber || product.id`, so the web pages got the good block, while
`app/api/mobile/bundle-builder` and `app/api/mobile/products/[id]` look up `p.id`, so the
**mobile app got the thin one**. The app and the site were describing the mask differently.

The stale block is deleted and the CUID is now aliased onto `'53'`, so one block answers to
both keys.

## 5. The page

`components/product/collagenmask/` - same three-file pattern as `scalpbrush/` and
`cerabarrier/`:

| File | Contents |
|---|---|
| `CollagenMaskProductPage.tsx` | layout, adapted from `ScalpBrushProductPage` |
| `collagenMaskCopy.ts` | all EN/AR/RU copy, plus the sourcing rules above as a file header |
| `collagenmask.css` | crimson palette taken off the sachet |

Registered in `components/product/bespokePdp.tsx` and opted in by all three route files.

Section order: hero and gallery, stats strip, **what it does** (the four claims the sachet
makes), **the essence** (the humectant base), **how to use**, **what is in it** with the
full INCI in an accordion, **is it for you**, routine cross-sell, specification table, FAQ,
reviews, closing band.

Two structural differences from the scalp brush template it started as: the care-and-cautions
section is replaced by the ingredients grid and INCI accordion carried over from Cerabarrier,
and the closing band gets its own headline rather than repeating the hero line.

`imageFit="blend"` was tried on the closing band and reverted - the sachet is shot on studio
grey rather than white, so multiplying it into the band renders it as a grey block, which is
the failure mode that prop is documented against.

## 6. Tone corrections found on the rendered page

Four lines were written in the audit register the selling-tone rule exists to stop, and were
caught only by reading the built page end to end:

- *"Nothing here depends on a percentage we cannot show you"* - narrates the absence of data
- *"An appearance change, honestly described, and a real one"* - meta-commentary on our own honesty
- *"well below the level that would make it a drying formula"* - defends against an objection the page never raised
- *"All, including sensitive and mature"* in the spec table, two sections below a caution telling fragrance-avoiders to look elsewhere

All four rewritten in EN, AR and RU.

## 7. Gallery slides

Logged to `~/Desktop/genosys-artwork-corrections.html` under product 53.

| Slide | State |
|---|---|
| S1 | **Clean.** Renders every line of the sachet correctly and every claim on it is supported. Only correction: "Hyaluronic Acid" should read "Sodium Hyaluronate". Use it as the reference for re-exporting the others |
| S2 | Claims **"Brightens · evens tone · anti-aging"**, which the page now explicitly contradicts. Sachet render prints `ICM PROFEENONAL` over an illegible paragraph |
| S3 | Footer claims **"Antioxidant care"**. Sachet render prints `PROFESONAL` over an illegible paragraph |
| S4 | Usable. Em and en dashes throughout |
| S5 | Worst of the set. Product name renders as `GENOSYS INTENSIVE BEPAIR COLLAGEN MASK` over two lines of noise, code block reads `ICM PPOFEIARCAL`, baseline reads `GEALSEAA a compased word of Cont Be Alrck System`, and red bleed crosses the `FIRM. HYDRATED. REPAIRED.` lettering |

The gallery is unchanged pending a decision on whether to pull S2, S3 and S5 or re-export them.

## 8. Pack corrections for DTS MG

Already logged; unchanged by this session. The urgent one is that **two packs are in
circulation stamping expiry in opposite formats** - `EXP. YYYY/MM/DD` on the photographed
sachet, `EXP. DD/MM/YYYY` on the 2024 artwork - so a batch stamped `01/02/2026` means
1 February on one pack and 2 January on the other.

## 9. Files touched

```
components/product/collagenmask/CollagenMaskProductPage.tsx   new
components/product/collagenmask/collagenMaskCopy.ts           new
components/product/collagenmask/collagenmask.css              new
components/product/bespokePdp.tsx                             register 53
app/products/[id]/page.tsx                                    opt in 53
app/ru/products/[id]/page.tsx                                 opt in 53
app/ar/products/[id]/page.tsx                                 opt in 53
data/productTranslations.ts                                   claims + duplicate key
data/productTranslationsRu.ts                                 claims incl. clinical claim
scripts/fix-collagen-mask-53-claims-20260814.ts               DB, first pass
scripts/fix-collagen-mask-53-consistency-20260814.ts          DB, second pass
~/Desktop/genosys-artwork-corrections.html                    slide rows
```

Typecheck clean, lint clean, 488 tests passing, all three locales rendering.
