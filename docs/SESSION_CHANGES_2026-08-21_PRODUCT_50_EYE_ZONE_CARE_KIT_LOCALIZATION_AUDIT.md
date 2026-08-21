# Product 50 EyeCell EYE ZONE CARE KIT RU/AR localization audit

Date: 2026-08-21  
Product: `50` · EyeCell EYE ZONE CARE KIT

## Outcome

Product 50 now has one source-grounded Russian/Arabic payload across the translation maps, bespoke PDP, quick facts, recommended routine, eye-care SEO, chatbot, static fallback and production database.

The revised copy presents a premium four-step ritual instead of internal audit language. It leads with the verified functional actives and exact contents, keeps the roller within cosmetic claims, and makes reuse, sanitation and contraindications explicit.

## Primary sources checked

- `Registration DOC/Artwork/[GENOSYS]EYECELL KIT.pdf` · current February 2025 kit artwork
- `Registration DOC/Formula_up/Formula-GENOSYS EyeCell EYE CONTOUR SERUM.pdf`
- `Registration DOC/SA/SA-GENOSYS EyeCell EYE CONTOUR SERUM.pdf`
- `Registration DOC/Formula_up/Formula-GENOSYS EyeCell EYE CONTOUR CREAM.pdf`
- `Registration DOC/SA/SA-GENOSYS EyeCell EYE CONTOUR CREAM.pdf`
- `Registration DOC/Formula_up/Formula-GENOSYS EyeCell EYE PEPTIDE GEL PATCH .pdf`
- `Registration DOC/SA/SA-GENOSYS EyeCell EYE PEPTIDE GEL PATCH.pdf`
- current component COAs and existing source audits for products `17`, `24` and `33`
- `public/documents/PPT/GENOSYS EyeCell EYE ZONE CARE SYSTEM.pdf` · official DTS MG deck
- clinic/export product list for roller article `EBT025` / `GRME025`

## Verified contents

- EyeCell EYE CONTOUR SERUM · `10 ml`
- GENOSYS EYE ROLLER · one-body · `0.25 mm` · `60 needles` · kit only
- EyeCell EYE PEPTIDE GEL PATCH · `101 g / 60 pieces`
- EyeCell EYE CONTOUR CREAM · `20 g`

The roller is not product `1`, the detachable 450-needle face roller.

The primary artwork/deck does not separately state a needle-alloy grade. The French carton panel specifically contraindicates the roller for an `allergie à l’inox` (stainless-steel allergy), so live copy retains that exact material-related safety boundary without inventing an alloy specification.

## Verified functional actives

- serum: arbutin `2%` + adenosine `0.04%`
- cream: arbutin `2%` + adenosine `0.04%`
- patches: niacinamide `2%` + adenosine `0.04%`

The patch contains Acetyl Hexapeptide-8 at `46.5 ppb`, but the revised kit copy does not lead with that trace figure or assign it unsupported effects.

## Protocol and roller handling

1. Cleanse the eye contour and pat dry.
2. Apply serum under the eyes and brow bones.
3. Roll horizontally and vertically over the serum for several minutes. The carton requires “extra care” but gives no numeric pressure; the page therefore instructs no pressing and stopping if uncomfortable.
4. Place patches under the eyes and/or brow bones for `20–40 minutes`, then remove.
5. Finish with cream and gently massage until absorbed.
6. Before reusing the roller, disinfect it for `5 minutes` in chlorhexidine solution. Keep it personal and do not share.

The carton does not establish a universal roller frequency. The official deck contains case photos with some seven-day intervals, but these are not converted into general instructions.

## Safety boundary

- kit-level English artwork: avoid during pregnancy and lactation
- cream: contains `Arachis Hypogaea (Peanut) Oil`; do not use the kit with peanut allergy
- avoid direct eye and mucosal contact; rinse with cool water after contact
- roller contraindications: keloid tendency, stainless-steel allergy and dermatitis
- roller not for damaged, infected or irritated skin
- patch caution retained for people who react to plasters or compresses
- dermatologically tested statement retained for the kit/components

## Claims and tone corrected

Removed from live RU/AR selling copy:

- “registered carton,” “not assembled here,” “own paperwork” and similar internal audit language
- trace peptide concentration as a hero claim
- “soft roll” as a substitute for the sourced horizontal/vertical method
- medical delivery, penetration, microchannel and collagen-activation claims
- unsourced numeric pressure or universal frequency
- implication that the roller is single-use

Official cosmetic claims for the appearance of wrinkles, dark circles and eye bags, plus soothing/moisturizing care, remain because the current kit artwork and DTS deck support them.

## Implementation

- canonical payload: `data/product50LocalizedCopy.ts`
- RU/AR translation maps wired to the canonical module
- bespoke RU/AR EyeKit page rewritten
- product 33 kit-sequence cross-reference corrected
- quick facts, generic routine, routine links, eye-care SEO, chatbot and static fallback updated
- production fields `skinType`, `targetConcerns`, `usage` and `ageGroup` cleared
- normalized top-level size: `4-piece kit`
- idempotent production updater: `scripts/update-product-50-localized-copy-20260821.ts`
- focused tests: `__tests__/data/product50LocalizedCopy.test.ts`
- `.gitignore` exception added for the canonical module

## Production database

The updater preserves `productNumber = 50`, synchronizes RU/AR names and all localized fields, replaces generic English structured fields with the same source-grounded boundaries, clears unsupported recommendation metadata and performs a field-by-field post-write parity check.

The updater is safe to rerun.

## Verification

- `npx tsc --noEmit`
- focused ESLint on changed TypeScript files
- focused Jest for product 50 and adjacent product 33/localization tests
- updater rerun for idempotency
- scoped diff/status review

No commit or push was made.
