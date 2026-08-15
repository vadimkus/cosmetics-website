# Product 12 EPI TURNOVER BOOSTING PEELING GEL — audit and bespoke page — 2026-08-15

## What
Same rolling pass as products 4, 5, 19 and 51: Intertek first, then selling-tone rewrite, then a dedicated editorial page in EN / AR / RU.

Live target: https://genosys.ae/products/12

## Sources
- `Intertek_folder/Quali-quanti Ingredients/Ingredient list-EPI TURNOVER BOOSTING PEELING GEL.pdf` — quantitative formula
- `Registration DOC/SA/SA-GENOSYS EPI TURNOVER BOOSTING PEELING GEL.pdf` — trade names, pH 3.0 ± 0.5, patch test non-irritant
- `Registration DOC/Artwork/[GENOSYS]EPI TURNOVER BOOSTING PEELING GEL.pdf` — front sentence, enzyme + cellulose, dry-skin how-to, pack INCI
- `Registration DOC/Formula/Formula-GENOSYS EPI TURNOVER BOOSTING PEELING GEL.pdf` — registered INCI
- DTS MG deck `GENOSYS EPI TURNOVER BOOSTING PEELING GEL.pptx` (also the live PDF on genosys.ae) — 1–2× week, body tip, gommage. No clinical percentages
- Training manual — pH 2.5–3.5, PAO 6 months

## Distinctive fact
This is a **rinse-off cellulose rolling peel**. Cellulose 3% is the gel you feel. Massage on dry skin for up to one minute, the dead cells clump, tepid water takes them.

Papaya extract is 0.000150%. Moringa is 0.000020%. Desert Complex is a 0.01% premix. Sodium hyaluronate is 0.001%. They are in the formula. They are not the engine.

## Pack vs formula INCI
The pack lifts Sodium Hyaluronate, papaya, moringa and jojoba above their finished percentages. The page prints the registered descending list and does not claim it matches the carton.

## Cut from live copy
- “Without irritation” as a guarantee (deck language; SA is a patch test, not a promise)
- Moringa “miracle tree” as a lead active
- Desert Complex as the moisturizing engine
- Hyaluronic acid and jojoba as key ingredients
- Anti-inflammatory / healing / antiseptic language from the deck
- Clinic results at home / salon-level
- Fragrance-free (fragrance 0.2% + Hexyl Cinnamal)
- Alcohol-free (Alcohol Denat. 4.75%)
- “All skin types including sensitive” as a blanket
- Chatbot 2–3× a week (deck is 1–2×)
- Lot codes KG249 / OH089
- The contract manufacturer (DTS MG only)

Gallery s1 still prints some of the old slide lines on the image itself. That is a later image pass. The editorial copy does not repeat them.

## Page
`components/product/epi/` — Cerabarrier primitives, mint/forest palette from the tube.

Sections: Roll · Rinse · Smooth → cellulose 3% engine → dry skin + one minute + video → actives + registered INCI → suited / not → routine (10 / 12 / 14 / 18 / 29) → spec (pH 3.0 in a 2.5–3.5 spec, no lot, PAO 6 months) → FAQ → reviews.

No proof chart. The deck has photos, not numbers.

Wired in `bespokePdp.tsx` and the EN / AR / RU product routes. DB row now has `productNumber = '12'`. Cache key bumped to `product-by-id-v6`.

## Files
- `components/product/epi/epiCopy.ts`
- `components/product/epi/epi.css`
- `components/product/epi/EpiProductPage.tsx`
- `scripts/update-product-12-epi-selling-copy-20260815.ts`
- DB + AR/RU translations + quick facts + `lib/products.ts` fallback + `data/productConfig.ts` gallery (main removed from `images`)
