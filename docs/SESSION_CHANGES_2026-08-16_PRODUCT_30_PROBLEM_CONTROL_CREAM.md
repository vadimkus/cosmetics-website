# Product 30 INTENSIVE PROBLEM CONTROL CREAM: Intertek audit, selling-tone rewrite, bespoke page

**Date:** 16 Aug 2026
**Live:** https://genosys.ae/products/30 (plus /ru and /ar)

Third step of the Problem Control line, after the toner (15) and the serum (20).

## Documents read

- `Registration DOC/Formula_up/Formula-GENOSYS INTENSIVE PROBLEM CONTROL CREAM.pdf` — current DTS MG formula, signed
- `Ingredient lists_old/GENOSYS INTENSIVE PROBLEM CONTROL CREAM.pdf` — older Winnova sheet, agrees
- `Registration DOC/SA/SA-GENOSYS INTENSIVE PROBLEM CONTROL CREAM.pdf` — QACS, Nov 2014
- `Label/[GENOSYS]INTENSIVE PROBLEM CONTROL CREAM 50g.pdf` — artwork, all language panels
- `Registration DOC/COA/COA-GENOSYS INTENSIVE PROBLEM CONTROL CREAM 50g.pdf`

The 2014 safety assessment table predates both formula sheets and carries different
figures for DPG, trehalose and the two thickeners. Formula_up wins.

## Distinctive fact

**A cream with no oil in it.** No plant oil, no butter, no wax, no fatty alcohol, no
emulsifier. What makes it feel like a cream is 1.3% of thickener, acrylates
crosspolymer at 0.7% plus sodium polyacrylate at 0.6%, holding **86.595% water** in a
gel. Dimethicone is the only entry on the list that behaves like an oil and it is at
**0.005%**, arriving inside a 0.1% lecithin premix.

Three documents say it independently: the safety assessment gives the appearance as
"Gel Cream", the COA as "Opaque Gel Cream", and the Turkish carton panel calls it
"yagsiz bir krem", an oil-free cream, outright.

That is the right story for the buyer this is registered for. Most creams aimed at
oily skin still carry oils; this one carries none, which is why it can be the last
step on skin that already makes plenty of its own.

**Second fact, and it settles a cross-page claim:** zinc PCA is at **0.05%, exactly
the serum's dose**. The gallery slide that says "Zinc PCA in both" is correct, and so
is the line I put on the product 20 page last night.

Registered function is **"anti-blemishes, oil control"**. Note the serum's is
"anti-blemishes, oil and sebum control" — the cream's does not include sebum.
Application differs too: the carton says **massage** here and **pat** on the serum.

## Cut from live copy

- **"All skin types"** in productDetails and **"safe for all skin types"** in directions. The carton says oily and combination
- **Allantoin promoting "skin healing"**, beta-glucan strengthening **"the skin's own defences"**
- **"Keeps skin hydrated without clogging pores"** — a non-comedogenic claim with no test behind it
- **"Efficacy test on improving excessive sebum production"** in the static fallback. No efficacy study exists for this SKU; the SA records a patch test only
- **Sebum −14% and marks −9% in four weeks** in the Problem Skin Beauty Box (55) copy, in all three languages

## Accuracy bugs fixed

1. The full INCI was **missing 1,2-Hexanediol**, the third ingredient at 2%. Same bug
   as the serum had. Now twenty-four entries, matching the carton.
2. `keyFeatures` was **null** on the DB row, so that block had nothing in it.
3. `productNumber` was null; set to `'30'`.
4. **Chatbot hair-loss line had four wrong product ids.** It offered "Shampoo
   {{id:29}}, Hair Tonic {{id:28}}, Scalp Peeling {{id:30}}" — those are the Hyaluron
   Cream, the Hydro Soothing Cream and this Problem Control Cream. A customer asking
   about hair loss was being offered face creams with a working add-to-cart button.
   Corrected to 44, 43, 46 and 45.

## Page

`components/product/pccream/` — the product 20 layout with a cool blue palette from
the tube's own band, kept apart from the serum's eucalyptus and the toner's pale ice.

Sections: Sebum · Hydrate · Soothe → water thickened rather than oil emulsified →
five no-additions plus an oil-free sixth → toner, serum, then massage this in →
actives and full INCI → suited / not → routine → spec (pH 5.87 in 5.50 to 6.50,
no lot) → FAQ → reviews.

**Size selection**, which is new for this branch of the layout: 50g homecare at AED
290 and 250g professional at AED 420. The selector, the size-aware price, the
size-aware cart line and the size passed on every add are lifted from product 66,
which already did this for its two bottles.

Slides sit beside the section each illustrates: s2 with what it does, s4 with the
complex, s5 with how-to, s3 with the oil-free claim.

Wired in `bespokePdp.tsx` and the EN / AR / RU routes. Cache key `product-by-id-v31`.

## Image jobs logged

Two gallery slides need a re-export and neither line is repeated in copy:

- **s2** prints "sebum control". The cream's registered function is "anti-blemishes,
  oil control"; it is the serum that adds sebum.
- **s4** prints **"No Phytolex SC"**, which the safety assessment contradicts: it
  records Phytolex SC at 0.500%, delivering the Phaseolus, Betula and Rumex extracts
  the formula then lists at 0.1% each. This is the read-the-INCI-only failure already
  logged on products 10, 16, 28, 29 and 63.

Because that slide is on the page, the copy names the three botanicals by plant
rather than by premix, so nothing on the page contradicts anything else on it. Once
s4 is re-exported the premix can be named the way product 19 names MultiEx.

Both rows are in `~/Desktop/genosys-artwork-corrections.html`.

## Files

- `components/product/pccream/pccreamCopy.ts`, `pccream.css`, `PccreamProductPage.tsx`
- `components/product/bespokePdp.tsx`
- `app/products/[id]/page.tsx`, `app/ar/products/[id]/page.tsx`, `app/ru/products/[id]/page.tsx`
- `data/productTranslations.ts`, `data/productTranslationsRu.ts`
- `lib/productQuickFactsCatalog.ts` (six new facts; there were none)
- `lib/chatbot/config.ts` (product line plus the hair-loss id fix), `app/api/skin-analysis/ai/route.ts`
- `components/product/beautybox/copy/problemSkin.ts` (EN/AR/RU)
- `messages/en.json`, `messages/ru.json`, `messages/ar.json` (routine step)
- `lib/products.ts`, `lib/productsDb.ts`
- `scripts/update-product-30-pccream-selling-copy-20260816.ts` (applied)
- `scripts/apply-product-30-locale-files-20260816.py`, `scripts/scaffold-pccream-page-20260816.py`
