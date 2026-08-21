# Product 59 RU/AR localization audit

Date: 21 August 2026

## Scope

Full source-grounded Russian and Arabic rewrite for `DEEP MOISTURIZING BEAUTY BOX` (`productNumber: 59`, CUID `cmhp0jfrq00008odr033fg0ly`).

The audit covers the canonical RU/AR payloads and maps, dedicated beauty-box PDP, quick facts, recommended-routine messages, chatbot context, production updater and focused tests.

## Exact set and pricing

The set contains seven physical pieces:

- SNOW O₂ 180 ml × 1, product 10, AED 330
- SNOW BOOSTER 200 ml × 1, product 16, AED 260
- MOISTURE REPLENISHING HYALURON SERUM 30 ml × 1, product 18, AED 330
- MOISTURE REPLENISHING HYALURON CREAM 50 g × 1, product 29, AED 290
- SOOTHING BOMB SEA ALGAE MASK 25 g × 3, product 36, AED 108

Current separate value: AED 1,318. Bundle: AED 1,120.30. Saving: AED 197.70, exactly 15%.

Customer copy does not hard-code these figures. The shared beauty-box page calculates component value and saving from current catalogue prices. The production updater verifies the exact figures and fails if parity changes.

## Source basis

Copy was reconciled against the completed source audits for products 10, 16, 18, 29 and 36. The retained quantitative claims are:

- serum: hydrolyzed hyaluronic acid 2,000 ppm, PENTAVITIN 0.615%, humectant base 16.02%
- serum measurement: inner-hydration reading 50.81 → 52.238 immediately after one application, 21 women aged 20–59
- cream: glycerin 9%, PENTAVITIN 0.615%, high-molecular-weight sodium hyaluronate 1,000.9 ppm
- cream measurement: hydration value +82% after one application and still significantly above baseline after 72 hours, 21 women aged 20–59
- masks: methylpropanediol 10%, glycerin 5.035%, betaine 0.5%, allantoin and panthenol 0.1% each

The cream result is explicitly attributed to the cream, and the serum result to the serum. Neither is presented as a box-level result.

## Correct routine

Morning and evening:

`cleanser → booster → serum → cream`

Morning ends with a suitable sunscreen.

On a mask evening:

`cleanser → booster → mask for 15–20 minutes → serum → cream`

The mask is used immediately after opening. Its pack does not state a weekly frequency.

## Removed or constrained

- oxygen-bubble lifting, oxygen therapy and irritation-free mechanisms
- blanket all-skin, daily and over-makeup claims in box copy
- hyaluronic delivery “layer by layer”
- aquaporin and water-channel mechanisms
- unsupported moisture-binding and mushroom-nourishment mechanisms
- generic deep-hydration, barrier-strengthening and instant-cooling claims
- algae and centella functional effects removed by the product 36 audit
- blanket dermatological-testing attribution to every component
- unsupported pregnancy, breastfeeding and child-safety claims for serum and cream
- fixed AED figures in customer-facing localized copy

## Safety wording retained

- fragrance and limonene in SNOW O₂
- geranium oil and fragrance allergens in serum and cream
- peppermint oil in the mask
- caution for fragrance, essential-oil, plaster and compress sensitivity
- SNOW O₂ pack warning for pregnancy and breastfeeding
- mask immediately after opening
- cream not stored in the refrigerator
- daytime sunscreen

## Production parity

`scripts/update-product-59-localized-copy-20260821.ts` is idempotent. It:

1. finds the row by product number, known CUID or exact English name;
2. refuses a conflicting product owner;
3. writes the canonical fields, `productNumber: 59` and `size: 1 set · 7 pieces`;
4. clears unsupported `ingredients`, `skinType`, `targetConcerns`, `usage` and `ageGroup`;
5. reads the row back and checks exact field parity;
6. reads component prices and verifies AED 1,318 / AED 1,120.30 / AED 197.70 / 15%.

## Verification

Focused coverage is in `__tests__/data/product59LocalizedCopy.test.ts`, with the shared quick-facts expectation updated to require live pricing rather than fixed arithmetic.
