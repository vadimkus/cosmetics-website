# Product 31 MULTI VITA RADIANCE CREAM: Intertek audit, selling-tone rewrite, bespoke page

**Date:** 16 Aug 2026
**Live:** https://genosys.ae/products/31 (plus /ru and /ar)

The cream half of the pair whose serum is product 21.

## Documents read

- `Registration DOC/Formula_up/Formula-GENOSYS MULTI VITA RADIANCE CREAM .pdf` — signed
- `Registration DOC/SA/SA-GENOSYS MULTI VITA RADIANCE CREAM.pdf` — QACS, Jan 2021
- `Multi_vita/COA-GENOSYS MULTI VITA RADIANCE CREAM.pdf`
- `public/documents/PPT/GENOSYS MULTI VITA RADIANCE CREAM.pdf` — DTS MG deck

## Distinctive fact

**This is the only product in the range whose certificate assays the active.** Rather
than restating the recipe, it runs a laboratory test for niacinamide and prints the
result: specified at **2.00%**, found at **2.04%**. Korea treats niacinamide as a
functional ingredient, which is why the test exists.

That is a stronger fact than anything on a formula sheet, and per the selling-tone rule
it is phrased as "a full 2%, and every batch is tested to prove it. The latest came back
at 2.04%" rather than in dossier language.

Second fact: the same 2% as the serum, carried in **13% macadamia oil** instead of
water. Same active, two vehicles, which is the honest reason to own both.

Third: **the cream is orange because the astaxanthin is.** No pigment added, and that
also explains the carton note that the shade can shift with air.

## Cut from live copy

- **Astaxanthin as an antioxidant powerhouse.** It is at 0.001%, ten parts per million, inside a 0.1% liposome premix. The deck's "6,000 times stronger than vitamin C" comes from testing the raw material
- **"Astaxanthin assists UV defence"**, which was in the static fallback. The deck calls it an internal sunscreen. Neither goes on a page
- **Ceramide NP implied as a barrier active.** It is at 0.001% here, five hundred times less than in product 27
- **Gluconolactone as a PHA exfoliant** at 0.005%
- **Panthenol** as a listed key ingredient. It is at 0.00001%, a tenth of a part per million. The panthenol story belongs to the serum at 1%
- **"Supporting collagen feel"**, which means nothing
- **"High satisfaction panel"** as a vague quick fact, replaced with the actual numbers

## The 95% that could have been rounded

The panel for this cream came back at **95%** on "skin tone has become even", where the
serum's came back at 100%. The old quick fact said "very high satisfaction" and hid the
difference. The page now prints 95% and says plainly that it would have been easy to
round it up to match the serum. That is the sort of number a customer can check against
the deck, so it is worth being exact about.

## What was missing entirely

Macadamia oil at **13%** appeared nowhere in the live copy, despite being the second
ingredient after water and the entire character of the product. Neither did the assay.
The two strongest facts about this cream were both absent.

## Page

`components/product/mvcream/` — structurally the twin of product 30, two tubes at 50g
and 230g, with the cream's own orange as the palette.

Sections: even tone, real glow → the number that gets checked → the two-week trial
including the 95% → serum first then cream then sunscreen → actives and full INCI →
suited / not (too rich for oily skin) → routine → spec (pH 6.48, no lot) → FAQ → reviews.

Cache key `product-by-id-v35`.

## Image job logged

Gallery **s4** prints "6,000x vs Vitamin C" under astaxanthin. Raw-material data on a
finished cream that carries 10 ppm of it. Logged in
`~/Desktop/genosys-artwork-corrections.html`. The copy does not repeat it, and the FAQ
addresses the figure head on rather than ignoring it.

## Files

- `components/product/mvcream/mvcreamCopy.ts`, `mvcream.css`, `MvcreamProductPage.tsx`
- `components/product/bespokePdp.tsx`, the three locale routes
- `data/productTranslations.ts`, `data/productTranslationsRu.ts`
- `lib/productQuickFactsCatalog.ts` (all six replaced), `lib/chatbot/config.ts`, `app/api/skin-analysis/ai/route.ts`
- `lib/products.ts`, `lib/productsDb.ts`
- `scripts/update-product-31-mvcream-selling-copy-20260816.ts` (applied)
- `scripts/apply-product-31-locale-files-20260816.py`, `scripts/scaffold-mvcream-page-20260816.py`
