# Session — Recommended Routine in Mobile App (2026-07-12)

## Request
The website PDP shows a "Recommended Routine" block (heading + numbered steps
with deep links). The mobile app had nothing equivalent. Vadim asked to
investigate and then implement it in the app per product.

## Approach chosen
API-driven (option 2 from the investigation): the website's
`lib/productRoutines.ts` stays the single source of truth. The mobile product
API resolves it into plain localized strings, and the app just renders
whatever arrives. Future routine changes on the web need **no app update**.

## Changes — cosmetics-website

### `lib/mobileProductRoutines.ts` (new)
- `getMobileRoutine(productIdOrNumber, locale)` → `{ heading, steps: [{ title, description, productId }] } | null`
- Sources:
  - `PRODUCT_ROUTINES` (same map the web PDP renders)
  - `BESPOKE_ROUTINES` for the two hardcoded web blocks:
    - **63 Revita Glow BB** — `recommendedRevitaGlowRoutine` (Snow O₂ → Snow Booster → Multi Vita Serum → Hyaluron Cream → Revita Glow BB)
    - **66 Cerabarrier Cleanser** — `recommendedBarrierCareRoutine` (Cerabarrier Cleanser → Microbiome Mist → All For Sensitive Serum → Skin Barrier Cream → Multi Sun Cream)
- Localizes via `messages/{en,ar,ru}.json` (`product.*` keys, EN fallback).
- Per-step deep-link ids from `ROUTINE_STEP_PRODUCT_IDS` (lib/routineStepLinks.ts).
- Beauty boxes and professional/clinic lines intentionally return `null`
  (same exclusions as the web).

### `app/api/mobile/products/[id]/route.ts`
- Response now includes `routine: getMobileRoutine(...)` (localized via the
  existing `x-locale` header / `locale` query param).

### `messages/ru.json`
- Fixed pre-existing half-translated heading:
  `Рекомендуемый Routine Сияющего Блеска` → `Рекомендуемый уход для сияющего блеска`
  (also improves the web PDP for product 63 in Russian).

## Changes — genosys-mobile-app

### `components/product/RecommendedRoutineCard.js` (new)
- Card matching the app design language (white card, purple sparkles icon
  tile, black numbered circles like the web).
- Steps with a `productId` different from the current product are tappable
  and `router.push` to `/product/[id]` (chevron shown); the product's own
  step is rendered without a link.
- Full RTL support (row-reverse, right-aligned text, mirrored chevron).
- Renders nothing when `routine` is null — professional products and beauty
  boxes are unaffected.

### `app/product/[id].js`
- Renders `<RecommendedRoutineCard routine={product?.routine} ... />` right
  after the Perfect Combination card.

## Verification
- `tsc --noEmit` clean on the website; app files parse clean.
- Local resolver test: 10/en, 63/ru, 66/ar, 1/en return correct headings,
  step counts and link ids; unknown product returns null.
- Live after Vercel deploy:
  - `products/10` en → "Recommended Skin Brightening Routine", 5 steps, links 10,16,21,31,40
  - `products/63` ru → RU heading, 5 steps
  - `products/66` ar → AR heading, 5 steps
  - `products/47` en → "Recommended Hair & Scalp Routine", 4 steps

## Deploys
- Website: commits `863748d0` (API + resolver), `4cb71382` (RU heading fix) — pushed, Vercel deployed and verified live.
- App: commit `fa3f438` — EAS OTA published to `production`, runtime 1.11.0,
  update group `1b03fd27-bbe5-46a3-a3d8-ac660bab3db6` (iOS + Android).
  Users get it on next app relaunch (two launches max).

## Follow-up — RU/AR translation audit (same day)

Full scan of `messages/{ru,ar}.json` (all keys, not just routines):
- AR: fully translated — Latin remnants are brand names only, no action.
- RU: **23 routine step titles** were plain English (e.g. "EyeCell Eye
  Contour Serum"). Rewrote them following the catalog convention
  (Russian descriptor + Latin brand name), e.g.
  "Сыворотка для контура глаз EyeCell". Commit `e5c2b6e3`, verified live
  via the mobile API (`products/17` ru).
- DB backfill: `nameRu`/`nameAr` were NULL for **Needle Pen-K (id 2,
  hidden)**, **Hair Stamp (64)** and **Cerabarrier Cleanser (66)** —
  filled in and verified live via `localizedName`.
