# Product 20 PROBLEM CONTROL SERUM: Intertek audit, selling-tone rewrite, bespoke page

**Date:** 16 Aug 2026
**Live:** https://genosys.ae/products/20 (plus /ru and /ar)

## Documents read

- `Ingredient lists_old/GENOSYS PROBLEM CONTROL SERUM.pdf` — Winnova quantitative formula
- `Registration DOC/SA/SA-GENOSYS PROBLEM CONTROL SERUM.pdf` — QACS, July 2015. Trade name to INCI map, registered function, patch test
- `Label/[GENOSYS]PROBLEM CONTROL SERUM.pdf` — front panel, function, application, five no-additions, full INCI, precautions
- `Registration DOC/COA/COA-GENOSYS PROBLEM CONTROL SERUM 30ml.pdf` — pH, appearance, micro, three-year span

There is a DTS MG deck on file (`GENOSYS INTENSIVE PROBLEM CONTROL SERUM.pdf`) and it stays linked from the page.

## Distinctive fact

**Zinc PCA at 0.05%, and it goes in neat.** The safety assessment records ZINCIDONE at
0.05% with 100% purity, so unlike most actives in this range the figure is not a
diluted premix. The registered function, verbatim from the SA and the carton, is
**"Anti-blemishes, oil and sebum control"**. Nine tenths of the bottle is water.

The toner (product 15) runs zinc PCA at 0.5%, ten times this. That is a different
step, not a stronger version: the toner sweeps or sprays, the serum stays on and
adds panthenol, allantoin, trehalose and xylitol the toner does not carry. The page
and the FAQ say this plainly so the two pages stop competing.

Phytolex SC sits at 0.5% here, five hundred times its level in the sensitive serum.
Named honestly as the mung bean / white birch / yellow dock trio, not credited with
the result.

## Cut from live copy

Every one of these was live in English, Arabic and Russian this morning:

- **ACZERO®, PORE LASER™, HydroFerment Complex, Tea Tree Complex** — all four quick facts named complexes that are in no document
- **Niacinamide** — not in this product. It was in a quick fact and in the chatbot script
- **Redness −16.6%, clinically proven** — no efficacy study exists for this SKU
- **Non-comedogenic, certified by QACS** — the QACS work was a cutaneous irritancy patch test, nothing else
- **Beta-glucan as "immune-boosting"**, panthenol and allantoin as "healing" and "regeneration"
- **Black willow bark working "alongside zinc PCA"** — it sits at 0.001%
- **"Efficacy test on improving excessive sebum production"** in the static fallback
- **"Clinically proven"** in productDetails.testing
- **"Visible improvements in 2 to 4 weeks"** — invented
- **"Massage in upward motions"** — the carton says pat
- **Sebum −17% and marks −8% in four weeks**, plus a sebaceous-gland enzyme mechanism, in the Problem Skin Beauty Box (product 55) copy in all three languages

Also not repeated: **"sloughing away of dead skin cells"**. It is on the registered
carton, but nothing in the formula exfoliates, so the page leaves it alone.

## Accuracy bug fixed

The full INCI in the database was **missing 1,2-Hexanediol**, the third ingredient
at 2%. Restored, and the list now matches the carton exactly at twenty-two entries.

## Page

`components/product/pcserum/` — Cerabarrier primitives, cool eucalyptus palette taken
from the black glass and the leaves in the studio slides, deliberately apart from the
sensitive serum's warm lime and the toner's ice blue.

Sections: Sebum · Texture · Comfort → zinc PCA engine → five no-additions → toner
first then pat, AM and PM, plus the video → actives and full INCI → suited / not
(no acid, not for dry skin, not for diagnosed acne) → routine → spec (pH 5.62 in
5.50 to 6.50, no lot) → FAQ → reviews.

Studio slides are on the page from the start, per the 16 Aug standard: lookbook after
the stats, s2 beside what it does, s3 beside the complex, s4 beside how-to, s5 beside
the five no-additions.

The FAQ leads with "Is there salicylic acid in it?" because black willow bark is the
single most likely wrong assumption a shopper makes about this bottle.

Wired in `bespokePdp.tsx` and the EN / AR / RU routes. `productNumber` was null on the
DB row and is now `'20'`. Cache key bumped to `product-by-id-v30`.

## Gallery

`data/productConfig.ts` listed the main image inside the gallery array, so the
thumbnail strip opened on the same shot twice. Removed; the six studio slides stand
on their own.

## Image job logged

Gallery slide s3 prints **"Non-comedogenic"**, which no test on file supports, and
s5 prints "(COA)" which is dossier voice. Both are queued in
`~/Desktop/genosys-artwork-corrections.html` for re-export under a new filename. The
slides stay on the page until then and the copy does not repeat either line.

## Files

- `components/product/pcserum/pcserumCopy.ts`
- `components/product/pcserum/pcserum.css`
- `components/product/pcserum/PcserumProductPage.tsx`
- `components/product/bespokePdp.tsx`
- `app/products/[id]/page.tsx`, `app/ar/products/[id]/page.tsx`, `app/ru/products/[id]/page.tsx`
- `data/productTranslations.ts`, `data/productTranslationsRu.ts`
- `lib/productQuickFactsCatalog.ts` (all six facts replaced)
- `lib/chatbot/config.ts` (three mentions), `app/api/skin-analysis/ai/route.ts`
- `components/product/beautybox/copy/problemSkin.ts` (EN/AR/RU)
- `messages/en.json`, `messages/ru.json`, `messages/ar.json` (routine step)
- `lib/products.ts`, `data/productConfig.ts`, `lib/productsDb.ts`
- `scripts/update-product-20-pcserum-selling-copy-20260816.ts` (applied)
- `scripts/apply-product-20-locale-files-20260816.py`, `scripts/scaffold-pcserum-page-20260816.py`
