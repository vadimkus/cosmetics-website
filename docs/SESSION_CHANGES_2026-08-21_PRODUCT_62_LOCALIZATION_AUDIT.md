# Product 62 RU/AR localization audit

Date: 2026-08-21  
Product: 62, SENSITIVE SKIN BEAUTY BOX

## Source conclusion

Product 62 is a UAE-assembled value set. It has no set-level formula, clinical study or universal suitability result. Live RU/AR claims were rebuilt from the completed source audits for its exact components:

- Product 10, SNOW O₂ CLEANSER 180 ml;
- Product 16, SNOW BOOSTER 200 ml;
- Product 19, ALL FOR SENSITIVE SERUM 30 ml;
- Product 27, SKIN BARRIER PROTECTING CREAM 100 g;
- Product 34, SKIN RESCUE OVERNIGHT CREAM MASK 100 g;
- Product 36, SOOTHING BOMB SEA ALGAE MASK 25 g × 1.

The only efficacy measurements retained are the Product 34 results after four weeks:

- TEWL: −15%;
- appearance of redness: −26%.

They are identified as overnight-mask results everywhere and are never assigned to the box, another component or a general routine.

## Exact contents and pricing

The updater verified the six live component prices:

- 330 + 260 + 330 + 450 + 340 + 36 = 1,746 AED;
- box price: 1,442 AED;
- saving: 304 AED;
- mathematical saving: 17.41%.

Customer copy uses `304 AED` or a live comparison. It does not print an exact `17%` claim. The legacy/mobile pricing helper now derives and rounds the actual percentage at runtime, returning 17%.

The canonical database format is:

- `productNumber: 62`;
- `size: 1 set · 6 pieces`.

Unsupported broad fields `skinType`, `targetConcerns`, `usage` and `ageGroup` are cleared.

## Fragrance correction

The previous “toner and both masks are fragrance-free” story was wrong. Absence of `Parfum` does not prove absence of aromatic ingredients.

Live RU/AR copy now states:

- SNOW O₂: `Parfum 0.15%`, limonene `0.108%`;
- SNOW BOOSTER: no `Parfum` or essential oils, but grapefruit seed extract is disclosed;
- ALL FOR SENSITIVE SERUM: orange peel oil and limonene;
- SKIN BARRIER PROTECTING CREAM: `Parfum`, linalool and coumarin;
- SKIN RESCUE OVERNIGHT CREAM MASK: essential oils plus citral, geraniol and limonene;
- SOOTHING BOMB: peppermint oil.

The set is not described as fragrance-free, hypoallergenic or universally suitable for sensitive or reactive skin.

## Live copy corrections

- Added `data/product62LocalizedCopy.ts` as the canonical RU/AR payload and repointed both translation maps.
- Rewrote the dedicated beauty-box module in natural Russian and neutral MSA.
- Rebuilt quick facts around exact pieces, verified concentrations, fragrance disclosure, mask timings and AED 304 saving.
- Updated shared routine descriptions and retained the sheet mask before serum/cream in the flattened recommendation sequence.
- Rewrote the RU/AR sensitivity concern-page guidance, SEO and FAQ to remove blanket dermatological testing, irritation-free formulas, guaranteed barrier rebuilding and invented response timelines.
- Expanded the chatbot product rule with exact contents, routine, fragrance boundaries, Product 34 study attribution and live-price guidance.
- Added the `.gitignore` exception for the canonical module.
- Added focused regression coverage.

Removed set-level claims include guaranteed soothing, protection, barrier rebuilding, deep hydration, reduced sensitivity, regeneration, post-procedure comfort and blanket dermatological testing.

## Staged routine

- AM: cleanser → booster → serum → cream → suitable sunscreen.
- PM: cleanser → booster → serum → cream.
- Overnight-mask evening: cleanser → booster → serum → overnight mask instead of cream, 1–2 times weekly.
- Sheet-mask evening: cleanser → booster → sheet mask for 15–20 minutes → serum → cream. No weekly frequency is invented.
- Patch test each component and introduce one product at a time.
- Stop the product that causes persistent burning, redness, swelling or irritation.
- Do not assume post-procedure suitability; follow the treating specialist.

No “one-week starter” schedule was retained.

## Production updater

Run:

```bash
npx tsx --env-file=.env.local scripts/update-product-62-sensitive-box-20260817.ts
```

The script resolves product 62 by product number, CUID or exact name, refuses a conflicting owner, writes the canonical audited fields, reads the record back for exact parity, checks all six current component prices and fails unless the arithmetic is exactly `1,746 / 1,442 / 304 / 17.41`.

Production id: `cml3twwvk0000ua8o9qiqwkie`.

The first successful pass updated the localized names and audited text/normalization fields. The second pass reported every field unchanged, proving idempotence. Production parity and price parity both passed.

## Verification

- `npx tsc --noEmit`: passed.
- Focused localization, routine, quick-fact and pricing run: 4 suites, 59 tests passed.
- Mobile pricing/routine run: 5 suites, 26 tests passed.
- Scoped ESLint: passed with 0 errors and 0 warnings.
- Full ESLint: passed with 0 errors and 171 pre-existing warnings.
- Full `git diff --check` is blocked by pre-existing trailing whitespace in `app/ru/training/page.tsx` and `docs/SESSION_CHANGES_2026-08-17_FAYY_HEALTH_BASIC_CLEANSE.md`.
- No commit or push was made.
