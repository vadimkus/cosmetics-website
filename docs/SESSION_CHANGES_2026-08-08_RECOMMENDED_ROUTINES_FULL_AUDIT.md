# Recommended Routine full audit

**Date:** 2026-08-08  
**Scope:** website desktop/mobile/PWA, EN/RU/AR, mobile product API, native app consumption

## Executive result

- Audited **54 product routine recipients** covering **35 distinct ordered sequences**.
- Replaced split routine ownership with one canonical catalog:
  `lib/productRoutines.ts`.
- Corrected all clear ordering errors found, including the reported product 41
  defect.
- Added automated invariants across every routine, every locale, every linked
  product ID, and every routine thumbnail.
- Native routine content is API-driven. No native source or OTA is required for
  these content corrections.

## Canonical architecture

1. `lib/productRoutines.ts`
   - Owns every routine, including beauty boxes 55-59/62, Revita Glow 63, and
     Cerabarrier 66.
2. `components/product/ProductRoutineCard.tsx`
   - Renders the same catalog on website desktop, mobile web, and PWA.
3. `lib/mobileProductRoutines.ts`
   - Localizes and serializes the canonical catalog for
     `GET /api/mobile/products/[id]`.
4. Native `RecommendedRoutineCard.js`
   - Presentation only. It renders the API payload and contains no bundled
     routine recommendations.
5. `lib/routineStepLinks.ts`
   - Maps step title keys to real product/productNumber routes.
6. `lib/routineStepImages.ts`
   - Uses a production-DB-audited map of current canonical `Product.image`
     paths rather than allowing legacy static catalog data to win.

Historical hardcoded beauty-box markup remains guarded as a non-rendering
fallback while the canonical entries exist. Automated coverage asserts all six
beauty-box entries remain present, so the legacy paths cannot take over.

## Deterministic audit rules

Every routine is checked for:

- remover only as the first PM cleansing step;
- no cleanser/remover after treatment or leave-on steps;
- SPF and BB/cushion complexion products only as the final daytime step;
- treatment masks before leave-on serum/cream;
- no duplicate step product;
- valid EN/RU/AR heading, title, and description keys;
- valid product IDs and current local image assets;
- scalp peel before shampoo;
- Hair Stamp before Hair Solution;
- no Microneedle Roller together with Bio-Meso 5000/60000 spicules;
- focused product 41 regression through both the canonical catalog and mobile
  API serializer.

## Issues found and corrected

### 1. Product 41: remover after cushion

**Before:** Snow O₂ → Mist → Hyaluron Cream → BB Cushion → Biphasic Remover  
**After:** Snow O₂ → Mist → Hyaluron Cream → **BB Cushion (final)**

The data model is a single ordered routine with no clean AM/PM phase support.
The remover was therefore removed instead of being misrepresented as a closing
daytime step. EN/RU/AR cushion copy now explicitly says it is the final daytime
step.

### 2. Product 42: remover after BB cream

**Before:** Snow O₂ → Mist → Hyaluron Cream → Intensive BB → Remover  
**After:** Snow O₂ → Mist → Hyaluron Cream → **Intensive BB (final)**

### 3. Charming Look box 57 mixed AM and PM into one false sequence

**Before:** Cleanser → Booster → Cushion → Remover → Overnight Mask  
**After:** Cleanser → Booster → **Cushion (final daytime step)**

The remover and overnight mask remain separate products in the box, but they
are not forced into a linear daytime recommendation. The simple routine model
cannot present an honest second PM phase.

### 4. Masks appeared after serum/cream

Corrected recipients:

- Problem skin 15/20/30 and box 55:
  cleanser → toner → optional mask → serum → cream.
- Anti-aging 22/32 and box 58:
  cleanser → toner → optional collagen mask → serum → cream.
- Recovery 25:
  cleanser → mist → soothing mask → postcream.
- Deep-moisturizing box 59:
  cleanser → toner → soothing mask → serum → cream.
- Sensitive box 62:
  cleanser → toner → soothing mask → serum → barrier cream.

### 5. Eye patches appeared after eye serum/cream

Products 17, 24, and EyeCell kit 50 now use:
cleanser → eye patch → eye serum → eye cream.

Product 33 already used this order and was unchanged.

### 6. Brightening box 56 put peel after leave-on cream

**Before:** cleanser → toner → serum → cream → peel → mask  
**After:** cleanser → peel → toner → soothing mask → serum → cream

The optional weekly treatment steps now occur before daily leave-on treatment.

### 7. PDRN mask routine stacked an unnecessary peel

Product 52 changed from cleanser → peel → PDRN mask → cream to:
cleanser → PDRN mask → cream. This removes unnecessary treatment stacking and
keeps the recommendation concise.

### 8. Scalp peeling followed shampoo

Products 45 and professional Mesopecia kit 47 now place scalp peeling before
shampoo, matching the product's own use description.

### 9. Hair Solution preceded Hair Stamp

Products 3, 45, 47, and 64 now place the microneedling/stamp step before the
dedicated Hair Solution step. Face and scalp routine families remain separate.

### 10. Beauty-box routines had duplicate desktop/mobile definitions

Products 55-59 and 62 previously had separate hardcoded desktop and mobile-web
blocks and were excluded from the native API routine payload. They now live in
the same canonical catalog as all other routines and are returned to the
native app automatically.

### 11. Beauty-box item links targeted wrong products

Corrected:

- Collagen Mask `36` → product **53**
- All For Sensitive Serum `21` → product **19**
- Skin Barrier Protecting Cream `31` → product **27**

### 12. Sensitive box referenced a discontinued routine product

EGF Repair Oxymask product 26 is hidden, out of stock, and returns 404. It was
removed from the displayed recommendation. The box's remaining sellable steps
form the practical sequence. This audit did not alter the box SKU description
or commercial contents.

### 13. Routine images could inherit stale static-catalog paths

The routine image map was reconciled against the production product table for
all linked steps and now explicitly mirrors current main images. Automated
tests require every path to exist under `public/`.

## Unchanged routines validated

The following recipients passed sequencing and compatibility review without a
step-order change:

- Brightening: 10, 16, 21, 31
- Makeup removal: 11 (remover first, then cleanser)
- Renewal/barrier/hydration: 12, 14, 18, 19, 27, 28, 29, 34, 35, 36, 37, 38,
  51, 53, 66
- Anti-aging: 23
- Eye: 33
- Sun/BB: 39, 40, 63
- Hair/scalp: 43, 44, 46, 61
- Microneedling/Bio-Meso: 1, 60, 65

The roller/spicule exclusion remains intact: product 1 uses no Bio-Meso step;
products 60/65 use no roller.

## Localization and claims

- EN/RU/AR keys were checked for every heading, title, and description used.
- Product 41 final-step wording was updated in all three locales.
- Arabic continues to use the existing RTL-aware shared renderer.
- No new ingredient, concentration, or clinical efficacy claim was introduced.
  Formula adjudication was not needed, so no Intertek formula claim was inferred.

## Automated coverage

`__tests__/lib/productRoutines.test.ts` iterates the complete catalog and fails
on:

- coverage drift from the audited 54 recipients;
- missing localization;
- missing product links or routine images;
- dead local image paths;
- duplicate products;
- cleanser/remover after treatments;
- remover anywhere except first;
- non-final SPF/BB/cushion;
- mask after leave-on serum/cream;
- scalp peel after shampoo;
- Hair Stamp after Hair Solution;
- roller + Bio-Meso spicules;
- product 41 remover regression;
- incorrect product 41 native API serialization.

## Verification

- Focused routine tests: **8/8 passed**
- Full Jest: **56/56 suites passed; 358 passed, 3 skipped**
- TypeScript: passed
- Focused ESLint: passed
- Next.js production build: passed; **440/440** pages generated. Seven blog
  fetches logged transient database timeouts during static generation, but the
  build completed successfully.
- Deployment and live EN/RU/AR/API checks: recorded in the deployment handoff
  for this change.
