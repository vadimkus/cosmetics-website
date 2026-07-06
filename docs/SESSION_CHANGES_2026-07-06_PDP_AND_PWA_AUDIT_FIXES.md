# Session Changes — PDP + PWA/Service Worker Audit Fixes (2026-07-06)

Two parallel audits (Product Detail Page, PWA/service worker) + fix pass.
Web commit — see git log; app change shipped OTA. All verified with
typecheck + production build.

## PWA / Service Worker

### CRITICAL
- **Cross-user data leak via cached authenticated GETs** (`public/sw.js`
  `handleAPIRequest`): any 200 GET was written to `DYNAMIC_CACHE` keyed by URL
  only. `/api/user/*`, `/api/orders`, `/api/addresses` responses could be
  served to a different user (or after logout) while offline. **Fix:** added
  `PRIVATE_API_PATTERNS` (user/orders/addresses/auth/push/mobile) that are
  always network-only, never cached, never served stale.

### HIGH
- **`sw.js` / `manifest.json` had no explicit cache headers** (`next.config.js`)
  — relied on Vercel defaults; any CDN/proxy misconfig could freeze users on an
  old SW. **Fix:** `sw.js` → `no-cache, no-store, must-revalidate`;
  `manifest.json` → `no-cache, must-revalidate`.
- **`/api/push/mark-read`**: the caching concern is resolved by the new
  `/api/push/` private pattern. (The GET is read-only — returns unread count —
  so the "GET mutates state" part of the finding was inaccurate; only the POST
  mutates.)

### MEDIUM
- **Same-day deploys didn't rotate cache names** (`scripts/generate-sw-version.js`):
  hash input used the date only, so two deploys on one day produced an
  identical `CACHE_VERSION` and old caches were never purged. **Fix:** use the
  full ISO timestamp.
- Removed dead SW `setInterval` quota check (never fires — SW is killed after
  ~30s idle; quota is already checked on activate).

### LOW
- Removed misleading/dead SW constants: `API_ROUTES` (listed `/api/auth/login`
  as if cacheable), `PRODUCTS_API_ROUTES`, `CACHE_NAME` alias, and an unused
  local `currentCaches` in the activate handler.

### Verified sound (no action)
- Update prompt flow (waiting SW → banner → SKIP_WAITING → reload), cache
  whitelist purge on activate, client-only registration, non-GET bypass,
  `/api/csrf-token` exclusion, immutable `_next/static`, push handlers.
- **False positives:** manifest shortcut `.png` icons and
  `images/screenshot-mobile.png` all exist and are valid (agent's file search
  glitched) — no manifest change made.

## Product Detail Page

### HIGH
- **Price leak via `product:price:amount` OG meta** (`app/products/[id]/page.tsx`
  + AR + RU): prices are login-gated everywhere, but this tag exposed the raw
  base price to any crawler / link-unfurl bot. **Fix:** removed the price/
  currency OG tags on all three locales (kept availability/brand/category).
- **Dead `ProductActions.tsx`** (`app/products/[id]/components/`) — not imported,
  no OOS/auth guards, hardcoded English. **Fix:** deleted.

### MEDIUM
- **Gallery cropped images** (`components/product/ProductImageGallery.tsx`):
  main image + thumbnails used `object-cover` (crop) while the lightbox and the
  rest of the site use `object-contain` on white. **Fix:** `object-contain` +
  `bg-white` on main image and thumbnails.
- **Quantity steppers had no upper bound**
  (`ProductQuantityCart.tsx`, mobile stepper in `ProductPageClientRefactored.tsx`)
  — capped at 99 (matches cart/app).
- **Mobile "Added to Bag" showed on silent failure**
  (`ProductPageClientRefactored.tsx`): inner `handleAddToCart` swallowed errors,
  so the mobile handler always hit the success branch. **Fix:** rethrow on
  error so the success checkmark only shows on real success.
- **Mobile video** — false positive: `getProductVideoUrl` already reads
  `product.videoUrl` as priority 1. No change.

### LOW
- `ru_AE` → `ru_RU` OG locale (`app/ru/products/[id]/page.tsx`) — `ru_AE` isn't
  a valid IANA tag.
- Removed the permanently-hidden `<ProductDetails>` dead DOM block (+ its now-
  unused import).
- App: fixed `styles.specValue` (undefined) → `styles.specValueText` in the
  key/value spec renderer (`app/product/[id].js`).

### Verified sound (no action)
- Hidden/missing products → real 404; legacy CUID → 301 to numeric slug;
  auth-gated pricing matches ProductCard; price-on-request → WhatsApp quote;
  variant enforcement before add-to-cart.

## Deferred (documented)
- Product JSON-LD schema on PDP (SEO win; must emit availability without price
  to respect gating) — larger addition, scheduled separately.
- "Waiting SW after N hours → auto-promote" fallback so users who dismiss the
  update prompt aren't stuck indefinitely.

## Files touched
Web: `public/sw.js`, `next.config.js`, `scripts/generate-sw-version.js`,
`app/products/[id]/page.tsx`, `app/ar/products/[id]/page.tsx`,
`app/ru/products/[id]/page.tsx`, `components/product/ProductImageGallery.tsx`,
`components/product/ProductQuantityCart.tsx`,
`app/products/[id]/ProductPageClientRefactored.tsx`,
`app/products/[id]/components/ProductActions.tsx` (deleted).
App (OTA): `app/product/[id].js`.
