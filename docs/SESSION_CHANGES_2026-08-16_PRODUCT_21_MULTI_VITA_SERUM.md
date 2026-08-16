# Product 21 MULTI VITA RADIANCE SERUM: Intertek audit, selling-tone rewrite, bespoke page

**Date:** 16 Aug 2026
**Live:** https://genosys.ae/products/21 (plus /ru and /ar)

## Documents read

- `Multi Vita Radiance Serum/Formula-GENOSYS MULTI VITA RADIANCE SERUM.pdf` — signed DTS MG formula
- `Multi Vita Radiance Serum/Pics/Artwork-MULTI VITA RADIANCE SERUM 30ml.pdf` — all language panels
- `Multi Vita Radiance Serum/COA-GENOSYS MULTI VITA RADIANCE SERUM 30ml.pdf`
- `public/documents/PPT/GENOSYS MULTI VITA RADIANCE SERUM.pdf` — the DTS MG deck

No safety assessment for the serum; the SA on file is for the cream (product 31).

## Distinctive fact

**The carton prints the dose of every vitamin, and the ladder is the story.**

| | |
|---|---|
| Niacinamide | 20,000 ppm |
| Panthenol | 10,000 ppm |
| 3-O-Ethyl Ascorbic Acid | 1,000 ppm |
| Tocopherol | 300 ppm |
| Sodium Ascorbyl Phosphate | 50 ppb |
| Glutathione, Biotin, Folic Acid, Pyridoxine | 1 ppb each |
| Cyanocobalamin | 0.1 ppb |
| Linoleic Acid, Riboflavin, Beta-Carotene, Inositol, Thiamine | 0.01 ppb each |

Four working doses and eleven traces, printed by the manufacturer before we say a word.
So "twelve vitamin complex" is an honest count and a misleading hierarchy, and the page
prints the ladder instead. A shopper who sees 20,000 ppm next to 0.01 ppb learns more in
five seconds than any paragraph can teach them.

The Korean panel registers the product as a **whitening functional cosmetic** and names
the functional active: **niacinamide**. That settles what the product actually is.

## MELAZERO is real, and unusually it is not a trace

The deck gives the patent and the composition: loquat leaf extract and spearmint extract
in a glycol carrier. In the formula the two botanicals sit at **0.04% and 0.01%**, four
hundred and one hundred parts per million. Most branded complexes in this range turn out
to be parts per billion. This one does not, and the page says so.

## Documented and kept

- Skin surface melanin **6.190 to 4.457 after two weeks**, a 28.0% improvement, from the deck's clinical
- **21 women aged 20 to 59**, 100% on even tone, no tightness, no irritation
- MELAZERO, Multi Vita 12 and PENTAVITIN-style branded names, all traceable to the deck

## Warnings recovered and put on the page

Three of these were on documents and on none of the live surfaces:

- **It may sting.** The deck's own how-to page says the product contains active vitamins, that a stinging sensation is possible, to start with a small amount, and to stop if irritation continues. That is now a how-to step, a quick fact and an FAQ.
- **Not for use during pregnancy.** On the carton, on the Turkish panel rather than the English one.
- **The colour can darken with air** without the effect changing, so close the cap. Also Turkish panel. The manufacturer suggests the fridge.

## Cut from live copy

- **Glutathione as a key ingredient** described as a powerful antioxidant. The carton prints it at 1 ppb
- **Gluconolactone (PHA) as a gentle exfoliating acid**. It is at 10 ppb
- **"Suitable for all skin types with anti-inflammatory properties"**, on a serum the maker warns may sting
- **"Visible improvements within 4-6 weeks"**. The study measured two weeks
- **"Gently massage in upward motions"**. The carton says pat
- **"Efficacy test on improving skin surface melanin"** as a bare phrase in the fallback, replaced with the actual figures

## Accuracy bugs fixed

1. The full INCI **dropped every ppm and ppb figure** the carton prints, and omitted **1,2-Hexanediol** and **3-O-Ethyl Ascorbic Acid** entirely. Restored.
2. `productNumber` was null; set to `'21'`.
3. `data/productConfig.ts` listed the main image inside the gallery array.
4. **Chatbot specialty-creams block had three more wrong ids.** It offered "POST-TREATMENT CREAM {{id:22}}", "INTENSIVE REPAIR CREAM {{id:21}}" and "NECK LIFTING CREAM {{id:10}}" — those ids are the anti-wrinkle serum, this brightening serum and the Snow O₂ cleanser. Corrected to 25, 27 and 23, plus the eye cream given its missing id and the anti-wrinkle entry pointed at the cream (32) rather than the serum. Second block of this kind found today.

## Page

`components/product/mvserum/` — single 30ml dropper, so it runs the product 20 layout,
with an amber and champagne palette taken from the serum itself.

Sections: four ways at one problem → the dose ladder → the two-week trial and the panel →
pat it in, start small, sunscreen over it → actives and full INCI → suited / not →
routine → spec (pH 5.94, no lot) → FAQ → reviews.

Cache key `product-by-id-v34`.

## Image job logged

Gallery **s1** credits step 4 of the mechanism to PHA / gluconolactone, which sits at
10 ppb. Logged in `~/Desktop/genosys-artwork-corrections.html`; the copy does not repeat it.

## Files

- `components/product/mvserum/mvserumCopy.ts`, `mvserum.css`, `MvserumProductPage.tsx`
- `components/product/bespokePdp.tsx`
- `app/products/[id]/page.tsx`, `app/ar/products/[id]/page.tsx`, `app/ru/products/[id]/page.tsx`
- `data/productTranslations.ts`, `data/productTranslationsRu.ts`, `data/productConfig.ts`
- `lib/productQuickFactsCatalog.ts`, `lib/chatbot/config.ts`, `app/api/skin-analysis/ai/route.ts`
- `lib/products.ts`, `lib/productsDb.ts`
- `scripts/update-product-21-mvserum-selling-copy-20260816.ts` (applied)
- `scripts/apply-product-21-locale-files-20260816.py`, `scripts/scaffold-mvserum-page-20260816.py`
