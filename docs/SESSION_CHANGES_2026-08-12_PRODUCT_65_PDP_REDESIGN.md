# Product 65 — Bio-Meso PDRN Homecare Ampoule 5000, bespoke PDP

**Date:** 2026-08-12
**Scope:** local only. Nothing committed, pushed or deployed.
**Request:** apply the same design and approach used for product 66 to product 65.

## What shipped

A bespoke editorial product page for product 65, reusing the design system built
for the Cerabarrier page (product 66) with a different palette and a different
section set.

### New files

| File | Purpose |
|---|---|
| `components/product/biomeso/BioMesoProductPage.tsx` | The page |
| `components/product/biomeso/biomesoCopy.ts` | EN / AR / RU copy, with sourcing notes per figure |
| `components/product/biomeso/biomeso.css` | Pearl-violet palette override plus timeline rail and spec table |
| `components/product/bespokePdp.tsx` | Shared layout resolver and routine-product loader for all bespoke PDPs |

### Modified files

| File | Change |
|---|---|
| `app/products/[id]/page.tsx` | Routes 65 and 66 through the shared resolver instead of an inline branch |
| `app/ru/products/[id]/page.tsx` | Routes 65 to the bespoke layout |
| `app/ar/products/[id]/page.tsx` | Routes 65 to the bespoke layout |

## Reused rather than duplicated

`CeraGallery`, `CeraPrimitives` (reveal, section header, accordion), `ceraFont`
and `cerabarrier.css` are imported from `components/product/cerabarrier/`.
Every rule in `cerabarrier.css` reads from CSS variables, so `biomeso.css` only
restates the variables under `.cera-page.biomeso-page` to re-skin the entire
page. Product 66 was not modified.

Palette moved from Cerabarrier's warm rose-on-cream to pearl and iridescent
violet, matching the holographic foil on the tube and the cool lilac of the
packshot photography.

## Section set, and why it differs from product 66

| Product 66 | Product 65 | Reason |
|---|---|---|
| Size selector + size comparison | Static size chip | Single 50 ml SKU, no variants |
| Texture story orbs | Six-day renewal timeline | The shedding sequence is what a first-time buyer most needs to expect |
| Clinical proof with percentages | Laboratory specification table | **No efficacy study exists for product 65** |
| — | Video section | Product 65 has `/videos/5000.mp4` |
| — | Safety / contraindications | Spicules have real contraindications |

## Sourcing — no invented claims

Everything on the page traces to Intertek filings, the outer-carton artwork,
the batch COA, or the audited database record. The sourcing rule and the source
of each figure are documented in the header comment of `biomesoCopy.ts`.

Verified figures used:

- **BIO-MESO PDRN 5,000 ppm**, **Panthenol 10,000 ppm**, **Peptide 9 types** — outer box artwork
- **Sodium DNA 1,010 ppm** (0.101% w/w), **Niacinamide 2%**, five ceramides, nine peptides — Intertek formula PDF
- **pH 6.77**, white opaque lotion, specific gravity 1.017, 50 ml net, all four pathogens not detected — COA for LOT 665EK, spec pH 6.60 ± 1.00
- **CFS 2025-25983**, Korea Cosmetic Association; manufactured by CNF Co., Ltd., Anseong-si
- 0.25 mm needle equivalent, 24–72 h spicule window, six-day renewal sequence, once-weekly cadence — Bio-Meso line training manual
- Precautions verbatim from the artwork, plus the no-roller rule from `SESSION_CHANGES_2026-07-14_NO_ROLLER_WITH_SPICULES.md`

**Deliberately absent:** there is no clinical efficacy study on file for product
65 anywhere in Intertek or in this repo. No improvement percentages appear on
the page. A verification sweep confirmed the only percentages rendered are
"Niacinamide at 2%" and "5% VAT included". The 52% hydration figure that exists
in an Instagram carousel doc belongs to the professional 60000 and was not
reused here. The training manual also states spicule treatment carries
low-to-moderate downtime, so the page says so explicitly rather than claiming
the treatment is comfortable.

## Routine cross-sell

Four compact shoppable cards, 2-up on mobile and 4-up on desktop: thumbnail,
fully visible title, live price, direct add in secondary styling.

Two of the routine products sell in more than one size (Snow O₂ Cleanser and
Soothing Repair Postcream), so they get a **"From <price>"** off the cheapest
variant and a **"Choose size"** link to their own page, rather than a one-tap
add that would silently pick a size. Skin Reboot PDRN Mask Pack is single
variant and gets a direct add. Product 65's own card shows "You are here".

Prices run through `getPricingDisplay`, so tier discounts are respected.

## Verification

| Check | Result |
|---|---|
| HTTP status, `/products/65` | 200 |
| Console errors / page errors | none |
| Failed network responses | none |
| Broken images | none (14 desktop, 13 mobile) |
| Horizontal overflow at 1440px and 390px | none |
| Scroll reveals stuck hidden after full scroll | 0 |
| Video element present | yes |
| Locales | EN, RU (ltr), AR (rtl) all 200, no English leaking into translated sections |
| Logged-out routine add | redirects to `/login` |
| Logged-out hero CTA | "Log in to shop" |
| Product 66 regression | still renders Cerabarrier, 4 routine buttons, no errors |
| Product 52 regression | still renders the shared PDP |
| ESLint on new files and all three routes | clean |
| `tsc --noEmit` | no new errors (pre-existing `utils/formatProductDisplayName.tsx` errors unchanged) |

## Follow-up: product 66 localized (same day)

The gap noted above was closed on request. `/ru/products/66` and
`/ar/products/66` now render the Cerabarrier layout instead of the shared PDP.

| File | Change |
|---|---|
| `app/ru/products/[id]/page.tsx` | Allowlist `['65']` → `['65', '66']`, plus `unitsSold` |
| `app/ar/products/[id]/page.tsx` | Allowlist `['65']` → `['65', '66']`, plus `unitsSold` |
| `components/product/bespokePdp.tsx` | Comment only, the English-only note was stale |

No new copy was written. `cerabarrierCopy.ts` already carried complete Arabic
and Russian blocks, and the `CeraCopy` interface guarantees every key is
present in all three.

The localized routes were also dropping `unitsSold`, so the sold count silently
fell back to 0 on RU and AR. Both now pass it, resolved in parallel with the
routine products. `getUnitsSold` is called only inside the bespoke branch, so
the shared PDP keeps its existing query count.

### Verified

Both products across all three locales, at 1440px and 390px: HTTP 200, correct
`dir` (`ltr` for EN/RU, `rtl` for AR), no English strings in the translated
pages, no horizontal overflow, no console or page errors, no failed responses,
no broken images, all reveal animations resolved. The Arabic 66 size selector
mirrors correctly, which product 65 could not exercise since it is single-size.
ESLint clean, `tsc --noEmit` shows no new errors.
