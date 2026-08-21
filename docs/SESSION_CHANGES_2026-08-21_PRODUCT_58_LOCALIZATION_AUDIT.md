# Product 58 RU/AR localization audit

**Date:** 21 August 2026  
**Product:** 58, ANTI-AGING BEAUTY BOX  
**Scope:** live Russian and Arabic copy, routine/concern surfaces, chatbot context, production DB, tests

## Source basis

The rewrite reuses the completed source audits for products 10, 16, 22, 32 and 53. Product 22/32 records refer to P&K Skin Research Center, but the underlying clinical report and exact result tables are not in the retained archive. No P&K result or clinical efficacy claim is therefore transferred to this set.

## Verified commercial facts

- Nine pieces: SNOW O₂ 180 ml, SNOW BOOSTER 200 ml, serum 30 ml, cream 50 g and five masks of 23 g.
- Current component total: `330 + 260 + 330 + 290 + (36 × 5) = AED 1,390`.
- Set price: AED 1,181.50.
- Saving: AED 208.50, exactly 15%.
- Customer-facing comparison remains runtime-driven from current component prices.
- Production size normalized to `1 set · 9 pieces`.

## Claim corrections

- Removed set-level rejuvenation, youthful/lifted-skin, firmness, elasticity and clinical-proof language.
- Removed oxygen delivery, all-in-one, irritation-free and universal-skin claims.
- Kept bakuchiol at the verified 0.1% concentration without presenting it as retinol-equivalent.
- Kept serum and cream facts separate: glycerin 25.45% versus 8%, niacinamide 2% and adenosine 0.04% in each; the cream's emollient phase is about 13%.
- Kept mask facts conservative: 18.062% humectant base, sodium hyaluronate 0.5%, collagen 1 ppm and 15–20 minutes. No firmness, barrier, soothing, deep-hydration or invented weekly-frequency claim.
- Added morning sunscreen guidance and component-specific fragrance, lavender oil, linalool/limonene, propolis, alcohol and soy disclosures.

## Routine

Daily: cleanser → booster → serum → cream, morning and evening.  
Mask evening: cleanser → booster → mask for 15–20 minutes → serum → cream. The pack does not state a weekly frequency.

## Implementation

- Added `data/product58LocalizedCopy.ts` as the canonical RU/AR DB payload.
- Wired product-number and CUID maps plus the audited-copy registry to the canonical module.
- Rewrote the dedicated beauty-box page, quick facts, recommended routine, concern/SEO text and chatbot guardrails.
- Added `scripts/update-product-58-localized-copy-20260821.ts` with exact row parity and live component-price assertions.
- Added `__tests__/data/product58LocalizedCopy.test.ts` for map parity, structured JSON, exact contents/order, cautions and forbidden claims.

## Production parity

The updater verified product `cmhozfrep00008oxxizeqk8a0`, `productNumber: 58`, all expected localized fields, cleared unsupported nullable fields and exact pricing. A second run returned every `changed` flag as `false`, confirming idempotency.

## Validation

- `npx tsc --noEmit`
- `npm run lint` (zero errors; existing repository warnings remain)
- Focused Product 58 localization test
- Audited localization registry test
- Recommended-routine invariant test
- Mobile pricing-engine test
- MoySklad beauty-box explosion test
- `git diff --check`
