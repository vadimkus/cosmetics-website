# Phase A Stabilization and Product Morphs

Date: 2026-07-18

## Completed

- Guide and blog reading progress now uses a JS-driven `scaleX()` value and explicitly disables the unreliable CSS scroll-timeline animation.
- Desktop home sections use bidirectional CSS `view()` timelines, with an `IntersectionObserver` fallback and reduced-motion handling.
- Every product card now morphs its image into the matching PDP gallery image.
  - Each product receives a unique transition name such as `genosys-product-52-image`.
  - Next `Link.onNavigate` keeps navigation in the same document.
  - The transition callback waits for the marked PDP image target before resolving.
  - Only the clicked product is captured; the other 63 card images are temporarily excluded so they do not bury the morph under simultaneous fade-outs.
  - The selected image morph runs for 700 ms; root/header transitions remain short.
  - Safari uses a manual fixed-image FLIP fallback because its native View Transition path does not reliably provide the shared-element morph.
  - Each hydrated product card intercepts its own image link in capture phase instead of relying on Next Link's browser-dependent `onNavigate` callback.
- Development service workers are automatically removed on localhost and clear their caches, preventing stale PWA chunks from hiding current local changes.
- Every PDP now has customer-facing quick facts directly below the product heading and above the gallery.
  - Facts prioritize structured features, benefits, product details, selected format/shade, and localized description fallback.
  - A popularity fact appears only when verified unit sales clear the existing 20-unit social-proof threshold; no unsupported “best seller” claim is used.
  - Product 52 (`SKIN REBOOT PDRN MASK PACK`) preserves concise verified PDRN facts.
  - Copy is localized for English, Russian, and Arabic.
  - PDRN formula wording is based on the official GENOSYS formula: Sodium DNA 0.1% / 1,000 ppm.

## Verification

- Playwright:
  - Confirmed 64 rendered product cards have 64 unique source transition names.
  - Confirmed same-document morphs for representative products 66, 48, and 39, with matching source/target names and `committed` state.
  - Confirmed localized morphs on Russian and Arabic product routes.
  - Confirmed high-positioned quick facts on products 52, 55, 66, and device 49; structured, fallback, sales, and verified PDRN paths are covered.
  - Confirmed all 64 visible products have sufficient source data for at least one fact, plus EN/RU/AR copy and mobile placement above the gallery.
  - Confirmed product 65 morph at a 390 × 844 mobile viewport.
  - Confirmed reduced-motion navigation skips animation and remains functional.
  - Inspected the production animation timeline: only the clicked product generated product-image pseudo animations; no unrelated product fade-outs remained.
  - Safari user-agent regression: manual overlay mounted during navigation, animated to the PDP target, then cleaned up and restored the target image.
  - Browser-neutral navigation regression: the same product-image click committed in both Safari/manual and Chrome/native modes.
  - Confirmed guide progress tracks actual scroll position in EN/RU/AR with CSS animation disabled.
  - Confirmed home reveal sequence: entering `0.261785`, visible `1`, exited `0`, visible again on reverse scroll `1`.
- `npx tsc --noEmit`: passed.
- Scoped ESLint for all touched implementation files: passed.
- Jest: 37/38 suites passed; 272 tests passed. One unrelated date-sensitive existing failure remains in `pricingEngine.test.ts` (`isNewProduct` expected `true`, received `false`).

## Build, Payment, and Mobile Regression Check

- Production web build passed:
  - Optimized Next.js compile and TypeScript passed.
  - 453/453 static pages generated.
  - Database migrations were explicitly disabled for the local build check.
  - Built runtime returned 200 for `/`, `/products`, `/products/52`, and `/checkout`; protected `/api/mobile/products` correctly returned 401 without an API key.
  - Product morph committed successfully from the production build.
  - A final production build also passed after the visual-isolation and localhost service-worker cleanup.
- Payment and pricing:
  - 14 checkout/payment suites passed (64 tests).
  - Remaining `pricingEngine` coverage passed (29 tests, 1 stale date-sensitive badge test intentionally excluded).
  - Mobile Apple Pay intent, Stripe checkout/payment intent, COD, loyalty redemption, server-authoritative totals, bundle pricing, and admin invoice integrity were covered.
- Mobile app:
  - TypeScript passed.
  - Pricing/cart/order/repository release smokes passed.
  - Expo export produced valid iOS and Android bundles.
  - Mobile repository remained unchanged.
- Pre-existing mobile maintenance findings:
  - Expo Doctor passed 18/19 checks; 24 Expo SDK 57 packages are behind current patch versions.
  - `verify:splash` is stale: it expects legacy `expo.splash` fields, while `app.json` now correctly configures splash through the `expo-splash-screen` plugin.

## Deployment

- Local changes only. No commit or push performed.
