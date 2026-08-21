# Product 51 BIO-FERMENT RU/AR localization audit

Date: 2026-08-21  
Product: `51` · BIO-FERMENT AGE DEFYING POWDER MASK

## Outcome

Product 51 now uses one source-grounded Russian/Arabic payload across the translation maps, bespoke PDP, quick facts, routine and recommendation strings, chatbot, fallback catalog and production database.

The audited copy sells the verified professional format: a 300 g powder modeling mask, 40 g per treatment, three scoops of powder to four and a half scoops of water, powder-to-water ratio `1 : 1.5`, `5–10` minute set time, `15–20` minute wear, about seven complete treatments, use once or twice weekly and `6M` after opening.

## Primary sources checked

- `Intertek/BIOFERMENT_MASK/Formula-GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK.pdf`
- `Intertek/BIOFERMENT_MASK/COA-GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK.pdf`
- `Intertek/BIOFERMENT_MASK/Artwork-GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK.pdf`
- `Intertek/BIOFERMENT_MASK/Front.jpeg`
- `Intertek/BIOFERMENT_MASK/Back.jpeg`
- `public/documents/PPT/GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK.pdf`
- DTS MG product decks and local catalogue/archive searches

No product-specific safety assessment or underlying clinical study report was found. The available evidence for efficacy figures is the DTS MG marketing presentation itself.

## Formula retained

- diatomaceous earth `41.79%`
- glucose `35%`
- algin `15%`
- calcium sulfate `6%`
- hydrolyzed collagen `0.2%`
- allantoin `0.1%`
- Chamaecyparis Obtusa Water `0.093%`
- menthol `0.02%`
- Bacillus/Soybean Ferment Extract `0.001%`
- Galactomyces Ferment Filtrate `0.001%`
- Bifida Ferment Lysate `0.001%`
- Lactobacillus/Punica Granatum Fruit Ferment Extract `0.00001%`

The available registered formula INCI is retained in full. The artwork list differs by naming Hydrolyzed Corn Starch and `sh-Polypeptide-11` where the registered formula names Hydrolyzed Collagen, Allantoin and `sh-Polypeptide-3`; the site does not claim that its formula list is a transcription of the carton.

Neither available INCI list names `Parfum` or separately declared fragrance allergens. Cypress water is therefore disclosed as an ingredient, not converted into a retail claim that the product contains added fragrance or that it is fragrance-free.

## Clinical-claim validation

The DTS MG presentation places `17.27` before and `48.513` after beside a headline of `218%`. Those numbers do not mathematically produce a `218%` increase:

- relative increase: `(48.513 − 17.27) ÷ 17.27 × 100 = 180.91%`
- after/before index: `48.513 ÷ 17.27 × 100 = 280.91%`

The deck does not identify the measurement endpoint or units, instrument, exact post-application timing, sample behind the aggregate pair, comparator, statistical treatment or the denominator used for `218%`. Its satisfaction panel of 21 women cannot be assumed to be the measurement population.

The cooling slides show two illustrated cases and temperature differences, but no protocol establishes the heat challenge, timing, measurement location, instrument, untreated comparator or representativeness of those two cases. They cannot support a general `10–11°C` product claim.

Accordingly, the audited RU/AR retail copy omits `218%`, the larger case percentages and `10–11°C`. It also omits “does not dry out,” moisture locking, heat-stressed-skin suitability, smoothing, anti-aging, regeneration, nourishment and unsupported collagen outcomes.

## Implementation

- canonical payload: `data/product51LocalizedCopy.ts`
- RU/AR translation maps wired to the canonical module
- bespoke RU/AR PDP rewritten and the unsupported study visualization excluded from RU/AR runtime
- quick facts, routine/recommendation strings, concern mapping, chatbot and static fallback corrected
- idempotent updater: `scripts/update-product-51-localized-copy-20260821.ts`
- focused tests: `__tests__/data/product51LocalizedCopy.test.ts`
- `.gitignore` exception added for the canonical module

## Production database

The updater sets `productNumber` to `51`, normalizes size to `300 g`, synchronizes RU/AR names and descriptions, replaces generic structured fields with the conservative English payload, and clears unsupported `skinType`, `targetConcerns`, `usage` and `ageGroup`.

It performs a field-by-field post-write parity check and is safe to rerun.

## Verification

- `npx tsc --noEmit`
- focused ESLint on changed TS/TSX/JSON files
- focused Jest for product 51 plus adjacent product 50 and canonical localization audit tests: `176` passed
- updater rerun: every tracked field reported unchanged and parity verified
- scoped `git diff --check`

The repository-wide `git diff --check` still reports two pre-existing trailing-whitespace issues outside this audit (`app/ru/training/page.tsx` and the Fayy Health session note). The product 51 scoped diff is clean.

No commit or push was made.
