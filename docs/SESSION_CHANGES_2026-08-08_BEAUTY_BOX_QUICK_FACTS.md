# Beauty Box Quick Facts full audit

**Date:** 2026-08-08  
**Scope:** all GENOSYS Beauty Boxes, EN/RU/AR, desktop web, mobile web/PWA, mobile product APIs, native iOS/Android

## Result

All six live Beauty Boxes now have six manually curated, box-specific Quick Facts. Product 58 no longer presents `Selected shade Beige` or `Format 50g`. The same localized catalog is rendered by web/PWA and returned by the mobile product APIs. A native card renderer was added and shipped once by OTA; later fact edits remain API-driven.

No product database fields, pricing, product descriptions, box contents or formulas were changed.

## Root cause

Two independent fallbacks combined:

1. `ProductPageClientRefactored.tsx` initialized every product to `selectedSize = "50g"` and `selectedColor = "Beige"` when no real variant existed.
2. `ProductQuickFactsHelper.tsx` appended any selected size and colour to Quick Facts without checking whether the product was a Beauty Box.

Beauty Boxes had no entries in the manual Quick Facts catalog, so weak fallback data was exposed prominently. The fix is structural:

- no-variant products now initialize with empty option state;
- `isBeautyBoxProduct()` blocks option-derived facts for all box detection paths, including product number, category and name;
- all six boxes have six curated facts, so fallback content is not needed;
- box disclosures identify their source as verified box contents and pricing rather than a single-product formula.

## Audited live inventory

Source cross-checks:

- production `GET /api/products/{productNumber}`;
- `lib/moyskladBeautyBoxExplosion.ts` for canonical component quantities and line prices;
- `lib/discountUtils.ts` for regular price and the built-in 15% box discount;
- `lib/productRoutines.ts` for honest routine order and AM/PM separation;
- live EN/RU/AR product records and existing translation files.

| Product | Production CUID | Box | Physical contents | Regular / box / saving |
|---|---|---|---|---|
| 55 | `cmhowxw4x00008ofct2ivnq2j` | Problem Skin Care | 4 full-size products + 3 Sea Algae masks = 7 pieces | AED 1,318 / 1,120.30 / 197.70 |
| 56 | `cmhoyg0r400008o7s4va63hsw` | Skin Brightening | 5 full-size products + 1 Sea Algae mask = 6 products | AED 1,496 / 1,271.60 / 224.40 |
| 57 | `cmhoyw7d500008o9tdprqkkhb` | Charming Look | 5 full-size products | AED 1,520 / 1,292 / 228 |
| 58 | `cmhozfrep00008oxxizeqk8a0` | Anti-Aging | 4 full-size products + 5 Collagen masks = 9 pieces | AED 1,390 / 1,181.50 / 208.50 |
| 59 | `cmhp0jfrq00008odr033fg0ly` | Deep Moisturizing | 4 full-size products + 3 Sea Algae masks = 7 pieces | AED 1,318 / 1,120.30 / 197.70 |
| 62 | `cml3twwvk0000ua8o9qiqwkie` | Sensitive Skin | 5 full-size products + 1 Sea Algae mask = 6 products | AED 1,696 / 1,442 / 254 |

This confirms the exact Beauty Box set is **55, 56, 57, 58, 59 and 62**. Products 53 and 54 are not Beauty Boxes.

## Curated fact design

Each line below is a concise title summary. Every title and supporting sentence has a dedicated English, Russian and Arabic version in `lib/productQuickFactsCatalog.ts`.

- **55 Problem Skin Care:** blemish-care focus; 7 pieces; complete daily core; mask-ready sequence; one concern-led set; save AED 197.70.
- **56 Skin Brightening:** tone + texture focus; 6 products; daily + weekly rhythm; matched Multi Vita duo; renewal step included; save AED 224.40.
- **57 Charming Look:** skincare + complexion; 5 full-size products; daytime finish; evening reset; two honest rituals; save AED 228.
- **58 Anti-Aging:** firmness + line care; 9 pieces; matched serum/cream duo; five mask sessions; clear routine order; save AED 208.50.
- **59 Deep Moisturizing:** deep hydration focus; 7 pieces; matched Hyaluron duo; five-step layering; three recovery masks; save AED 197.70.
- **62 Sensitive Skin:** sensitive-barrier focus; 6 products; serum + barrier cream; two mask formats; barrier-first sequence; save AED 254.

Facts deliberately avoid sales counts, popularity, medical outcomes and generic marketing language. Ingredient or clinical adjudication was not required, so no Intertek claim was introduced.

## Architecture

### Shared website catalog

`lib/productQuickFactsCatalog.ts`

- owns the six localized facts for each box;
- exports the exact product-number list and production CUID map;
- normalizes API locale selection;
- remains the single content source for web/PWA and mobile APIs.

### Website and PWA renderer

`components/product/ProductQuickFactsHelper.tsx`

- continues to render the responsive disclosure in desktop, mobile web and PWA;
- uses the shared Beauty Box detector;
- never appends selected size, colour or `product.size` for a Beauty Box;
- retains option facts for eligible single products;
- keeps all content wrapped with no fixed-height clipping and preserves Arabic RTL.

`app/products/[id]/ProductPageClientRefactored.tsx`

- removes synthetic `50g` and `Beige` option defaults.

### API and native app

`GET /api/mobile/products` and `GET /api/mobile/products/{id}` now return localized `quickFacts`.

The native app did not previously contain a Quick Facts renderer, so a one-time client component was required. `ProductQuickFactsCard.js` now renders API-provided facts with flexible text, RTL layout and no hardcoded box content. Future catalog changes need only a website deployment.

## Deterministic coverage

`__tests__/lib/productQuickFactsCatalog.test.ts` and `__tests__/components/ProductQuickFactsHelper.test.tsx` assert:

- exact product numbers and CUIDs;
- exactly six facts for every box in EN/RU/AR;
- complete non-empty titles and values;
- no duplicate title or text per locale;
- no raw translation keys;
- no popularity or medical-outcome language;
- no `Selected shade`, `Beige`, generic `Format 50g`, or kit-size fallback;
- verified piece counts and savings;
- explicit product 58 titles and values;
- a Beauty Box remains protected even if deliberately passed `selectedSize="50g"` and `selectedColor="Beige"`.

## Verification

Local:

- focused Jest: 2 suites, 25 tests passed;
- full Jest: 62 suites passed, 399 passed, 3 skipped;
- TypeScript: passed;
- focused ESLint: passed;
- production build: passed, 460/460 pages generated;
- mobile TypeScript: passed;
- native iOS + Android Expo export: passed;
- native release smoke suite: passed;
- local mobile API: 18/18 box-locale payloads returned six facts.

Production:

- six public product records matched exact product numbers and CUIDs;
- 18/18 mobile API box-locale payloads returned six localized facts;
- 36/36 PDP combinations passed: six boxes × three locales × mobile/desktop;
- zero horizontal panel/card overflow;
- zero option-derived facts;
- zero raw keys;
- product 58 explicitly showed 9 pieces and AED 208.50 savings.

## Deployment

Website:

- commit: `5ea7d17e` (`Curate Beauty Box Quick Facts`);
- Vercel deployment: `dpl_BrTurmhy8b1jLU6dA5uK3eJSdzJJ`;
- deployment URL: `https://cosmetics-website2-dc0jb6l6o-vadimkus-projects.vercel.app`;
- status: Ready; verified through `https://genosys.ae`.

Native:

- commit: `1f55b3f` (`Render API-driven product Quick Facts`);
- production runtime: `1.11.0`;
- OTA group: `4180b771-011d-4b01-bfd9-a4746fffe9d4`;
- Android update: `019fe274-1046-7c6e-a8cd-39feddb8e53b`;
- iOS update: `019fe274-1046-788e-8d29-041fb8999383`;
- dashboard: `https://expo.dev/accounts/vadimkus/projects/genosys-mobile-app/updates/4180b771-011d-4b01-bfd9-a4746fffe9d4`.

Unrelated worktree changes were left untouched and excluded from both commits.
