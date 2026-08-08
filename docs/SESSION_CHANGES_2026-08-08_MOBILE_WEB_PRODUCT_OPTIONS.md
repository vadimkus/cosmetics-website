# Mobile-web product option sheet parity

**Date:** 2026-08-08  
**Scope:** Website product cards, mobile web, narrow responsive browser, and website PWA. Native repository was reference-only.

## Gap and root cause

The website already prevented silent variant quick-add, but its **Choose options**
action navigated away to the PDP. The native app commits `bcb668c` and `7de5c1fa`
instead use an explicit, localized option sheet with current availability, variant
pricing, quantity, and one confirm action.

The website had three pieces of variant logic (database variants,
`productConfig`, and legacy pricing helpers) but no shared card-level option
model. That made a direct UI clone unsafe, especially for:

- Cerabarrier (`productNumber: 66`) and Revita Glow (`productNumber: 63`),
  whose database IDs are CUIDs;
- product 41 colour/shade lines;
- variant-specific pricing and VIP discounts;
- out-of-stock combinations and cart line identity.

## Architecture

- `lib/productOptions.ts` normalizes DB variants plus `productConfig` fallback,
  exposes explicit-selection/availability rules, and never silently selects when
  more than one choice exists.
- `ProductOptionDialog` is one responsive component:
  - below 768 px: bottom-anchored sheet with drag handle and swipe-down;
  - 768 px and above: centered 512 px desktop dialog;
  - installed website PWA: same bottom sheet as mobile web because it shares the
    narrow responsive ProductCard surface.
- The dialog refreshes the canonical product from `/api/products/[id]` without
  discarding a valid selection made while the refresh is running.
- Product card login behavior remains unchanged. Authenticated required-option
  products open the selector; single/no-option products keep one-tap add.
- Confirm uses the existing cart store and analytics path with exact
  `product + selectedColor + selectedSize + quantity`. Identical variants merge;
  different selections remain separate lines.
- The portal uses `z-index: 20000`, above the website mobile navigation
  (`z-index: 9999`), and restores body scroll/focus after close.
- EN/RU/AR strings use real `product.quantity` translations. Arabic sets `dir=rtl`;
  no literal translation key is rendered.

## UX and accessibility

- Drag handle, rounded sheet, backdrop, close button, Cancel and Add to Bag.
- Product thumbnail, localized name, live unit price, original/VIP discount
  display, Size/Color chips, OOS state, and 1–99 quantity stepper.
- 44 px minimum controls, safe-area footer padding, no keyboard controls.
- Body scroll lock with exact scroll restoration.
- Dialog semantics, initial close-button focus, Tab trap, focus restoration,
  Escape, browser Back, backdrop close, and swipe-down.
- Non-blocking canonical refresh state, localized error/retry, missing-option
  guard, and synchronous double-tap protection.

## Live 13-product parity audit

Production `/api/products` and local `productConfig` were cross-checked on
2026-08-08. All live options were available at audit time.

| Product | Options | Price (AED) | Source/result |
|---|---|---:|---|
| 1 Microneedle Roller | 0.25 / 0.5 / 0.1 / 0.15 / 0.2 mm | 230 each | DB + config |
| 10 Snow O₂ Cleanser | 180 / 500 ml | 330 / 510 | DB + config |
| 15 Problem Control Toner | 200 / 500 ml | 260 / 490 | DB + config |
| 16 Snow Booster | 200 / 1000 ml | 260 / 490 | DB + config |
| 25 Soothing Repair Postcream | 20 / 100 g | 204 / 440 | DB + config |
| 28 Hydro Soothing Cream | 50 / 250 g | 290 / 420 | DB + config |
| 29 Hyaluron Cream | 50 / 250 g | 290 / 420 | DB + config |
| 30 Problem Control Cream | 50 / 250 g | 290 / 420 | DB + config |
| 31 Radiance Cream | 50 / 230 g | 290 / 420 | DB + config |
| 32 Anti-Wrinkle Cream | 50 / 250 g | 290 / 420 | DB + config |
| 41 Cushion | Beige / Ivory / Camel | 300 each | DB colours + config swatches |
| 63 Revita Glow | #01 Bright / #02 Natural | 250 each | CUID + productNumber config fallback |
| 66 Cerabarrier | 200 / 600 ml | 380 / 620 | CUID + DB variants |

## Deterministic coverage

Added 17 focused tests covering:

- required trigger vs one-tap add;
- all 13 option products;
- explicit selection, variant/VIP pricing, OOS disabling, quantity;
- exact cart key/payload, identical-line merge, different-variant separation;
- cancel, close, backdrop, Escape, focus restoration, retry, and double tap;
- mobile sheet vs desktop dialog;
- EN/RU/AR labels, Arabic RTL, and no `product.quantity` leak.

Repository checks:

- `npx tsc --noEmit` — passed.
- `npm run lint` — passed with 170 pre-existing warnings and 0 errors.
- `npm test -- --runInBand` — 60 suites passed; 379 tests passed, 3 skipped.
- Focused suite — 17/17 passed.
- `npm run build` — passed (460 static pages generated).

## Browser evidence

Local browser checks used 390 × 844 and 1280 × 900:

- Cerabarrier required an explicit selection; 600 ml resolved to AED 620 and
  submitted `{ productId: CUID, selectedSize: "600ml", quantity: 1 }`.
- Product 41 exposed Beige/Ivory/Camel; Camel enabled Add at AED 300.
- Sheet had zero internal horizontal overflow, locked body scroll, restored it
  on close, and sat above the fixed mobile navigation.
- Arabic rendered the localized Quantity label and `dir="rtl"`.
- Desktop rendered a centered 512 px dialog with zero center offset/overflow.
- Automated screenshot capture timed out twice; accessibility snapshots and
  runtime geometry/payload checks were retained instead.

The temporary browser-preview route used for isolated authenticated visual
inspection was deleted and is not part of the shipped change.

## Files

- `components/product/ProductOptionDialog.tsx`
- `components/ProductCard/index.tsx`
- `components/ProductCard/ProductActions.tsx`
- `components/ProductCard/hooks/useProductCard.ts`
- `components/ProductCard/types.ts`
- `lib/productOptions.ts`
- `messages/en.json`, `messages/ru.json`, `messages/ar.json`
- `__tests__/components/ProductOptionDialog.test.tsx`
- `__tests__/components/ProductActions.test.tsx`
- `__tests__/lib/productOptions.test.ts`
- this session record and `docs/README.md`

## Deployment

- Implementation commit: `075fae43` (`Add mobile product option sheet`), pushed
  to `origin/main`.
- Vercel production deployment:
  `dpl_9mQQvQE9M9aJN9Fma8VUnzkeaHwb`
  (`cosmetics-website2-nddfybvfn-vadimkus-projects.vercel.app`).
- Status: `READY`; `genosys.ae` resolves to the same deployment ID.
- Production `/products`, `/api/products`, and `/api/products/66` returned 200.
- The deployed products bundle contains the new option-sheet strings and is
  tagged with the same Vercel deployment ID.
- Production API re-audit returned all 13 option products, all in stock and all
  with either live DB variants or the Revita Glow config fallback.
- Mobile production grid at 390 × 844 and desktop at 1280 × 900 had zero
  horizontal overflow; Cerabarrier and product 41 were present after a
  cache-busting reload; Arabic products completed loading with `dir="rtl"`.
- The browser session on production was logged out, so the live authenticated
  sheet/cart mutation was not repeated against a real account. Authenticated
  Cerabarrier/product-41 payload behavior was verified locally with the real
  deployed component and deterministically in Jest. Logged-out card/login
  behavior was unchanged in production.
