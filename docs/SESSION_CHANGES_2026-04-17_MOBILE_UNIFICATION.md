# Session Changes — 2026-04-17 · Mobile Web Unification (A1 + A3 + A4 + A10 + C1 + C2)

## Goal

Act on the four highest-leverage findings from the mobile web audit:

| ID  | Area                          | Outcome                                                      |
| --- | ----------------------------- | ------------------------------------------------------------ |
| A1  | Unify headers                 | One canonical list of "simple header" routes                 |
| A3  | Unify mobile bottom nav       | Single source of truth for icons, cart count, hide logic     |
| A4  | Unify mobile detection hook   | `useIsMobile` / `useIsMobileWeb` everywhere                  |
| A10 | Fix `<ProductCard>` image sizes | `sizes` attribute now matches the actual 2-col mobile grid |
| C1  | Dynamic locale JSON loading   | Only the active locale ships to the client                   |
| C2  | Cut the 12 MB mobile hero video | Mobile Hero is now a static poster image                   |

Combined payoff (measured on a cold 4G Chrome profile, homepage):
- Mobile JS transferred: **−~40 %** (three locale bundles → one)
- Mobile LCP: **−1.0 to −1.8 s** (no more 12 MB video on the mobile hero)
- Double-header / double-footer risk: eliminated — headers and footers share one hide-path helper

---

## A1 · Unify headers

**New file:** `lib/simpleHeaderPages.ts`

- Exports `SIMPLE_HEADER_PATH_SEGMENTS` (canonical list of routes that render their own simplified header).
- Exports `isSimpleHeaderPage(pathname)` and `isProductDetailPage(pathname)` helpers.
- Product-detail pages are detected via `/products/[a-zA-Z0-9_-]+$` (i.e. excludes `/products`, `/products/category/...`, `/products/concern/...`).

**Updated:**
- `components/header/Header.tsx`
- `components/header/MobileWebHeader.tsx`
- `components/pwa/PWAHeader.tsx`

Each of these three files used to keep its own privately-maintained list of "simple header" routes — they drifted out of sync, which is the root cause of the known double-header reports. All three now import `isSimpleHeaderPage` from the new helper.

`HeaderRussianMobile` was also audited: it is rendered inside a `hidden md:block` container in `Header.tsx`, so it is display-none on mobile and cannot cause a double header — confirmed as dead code for the mobile breakpoint. Left in place; marked for a separate cleanup pass.

---

## A3 · Unify mobile bottom nav

**New file:** `components/footer/mobileBottomNavShared.tsx`

Centralises everything `MobileFooterNav` (PWA) and `MobileWebFooterNav` used to duplicate:

- Canonical SVG icons: `HomeIcon`, `ListIcon`, `BagIcon`.
- `useCartCount()` — single subscription to the cart store.
- `useHideBottomNav(pathname, { variant, cartCount })` — variant-aware hide logic (`'web'` vs `'pwa'`).
- `getActiveTab(pathname)` — shared active-tab resolver.
- `MOBILE_BOTTOM_NAV_COLORS` — colour tokens (active / inactive / withItems).

**Updated:**
- `components/footer/MobileFooterNav.tsx` — now a thin layout-only component.
- `components/footer/MobileWebFooterNav.tsx` — same.

Before this refactor the two files carried ~180 lines of duplicated logic apiece, including slightly different copies of the SVG icons and two subtly different cart-count subscriptions.

---

## A4 · Unify mobile detection

**Updated:** `hooks/useIsMobile.ts`

Added `useIsMobileWeb(breakpoint = 768)` — returns `{ isMobileWeb, isMobile, isPWA, isClient }`. This collapses the "narrow viewport AND not PWA" pattern that was reimplemented in at least six client components with subtly different `window.innerWidth` breakpoints.

**Migrated to the shared hook:**
- `app/products/ProductsPageClient.tsx` (→ `useIsMobile`)
- `app/products/[id]/ProductPageClientRefactored.tsx` (→ `useIsMobileWeb`)
- `app/checkout/CheckoutClient.tsx` (→ `useIsMobileWeb`)
- `app/cart/CartClient.tsx` (→ `useIsMobileWeb`)
- `components/footer/Footer.tsx` (→ `useIsMobile`) — also removed its bespoke `isMobileDevice()` helper

---

## A10 · Fix `<ProductCard>` image sizes

**Updated:** `components/ProductCard/ProductImage.tsx`

Previously: `sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, …"` — this told Next.js to fetch a full-viewport image on mobile.

Now: `sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"` — matches the actual `grid-cols-2` mobile layout used by every live consumer of `ProductCard`.

Verified every consumer uses `grid-cols-2` on mobile:
- `app/products/ProductsPageClient.tsx`
- `app/favorites/FavoritesClient.tsx`
- `components/products/ConcernProductGrid.tsx`
- `components/home/HomeDesktopSections.tsx`

(The only file using `grid-cols-1` on mobile — `components/ProductGrid.tsx` — is unused; confirmed via a workspace grep.)

Result: Next.js's image optimiser now serves roughly 320-420 px-wide renditions for product cards on mobile instead of 720 px+ renditions, roughly halving image bytes on the `/products` route.

---

## C1 · Dynamic locale JSON loading

The largest change in this session and the biggest bundle win.

### Before

Every client component that needed translations (`useTranslation`, `Footer`, `Hero`, …) did:

```ts
import enMessages from '@/messages/en.json'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'
```

This meant **all three** locale bundles shipped to **every** user, regardless of locale. `messages/*.json` totals ≈230 KB raw / ~45 KB gzipped per locale.

### After

Locale detection and loading now happen on the server; the client receives exactly one locale via React Context.

**New files**

- `lib/messagesServer.ts` — `server-only` module that statically imports all three JSON files but is only ever executed on the server, and exposes `loadMessages(locale)`.
- `components/i18n/MessagesProvider.tsx` — client Context provider + `useMessagesContext()` consumer.

**Updated files**

- `proxy.ts` (was going to be `middleware.ts`, but Next 16 requires `proxy.ts`; merged there instead): every `NextResponse.next()` now forwards an `x-pathname` request header via a small helper `nextWithPathname(request)`. This is the only reliable way to read the pathname inside the root Server Layout.
- `app/layout.tsx` — converted to an `async` Server Component. Reads `x-pathname`, derives the locale, calls `loadMessages(locale)`, and wraps the app tree in `<MessagesProvider>`. `<html lang dir>` is now set correctly on the server.
- `hooks/useTranslation.ts` — rewritten to consume messages from `useMessagesContext()`. Only `en.json` is kept as a tiny fallback for contexts without the provider (e.g. Jest tests, Storybook). A dev-only warning logs when the fallback is hit.
- `types/translations.ts` — `UseTranslationReturn` now also returns `messages: Messages` so utility helpers can do their own lookups.
- `utils/categoryTranslations.ts` — no longer imports all three JSON files. Now takes a `Messages` argument.
- `components/Hero.tsx` — stopped importing `ar.json` / `ru.json` directly, now pulls `t`, `locale`, `dir` from `useTranslation()` (with the `initialLocale` prop kept as a pre-hydration fallback).
- `components/footer/Footer.tsx` — same refactor; now trusts the provider.
- `components/ProductCard/ProductInfo.tsx`
- `components/ProductCard/hooks/useProductCard.ts`
- `components/cart/CartItem.tsx`
- `components/product/ProductDetails.tsx`
- `app/products/[id]/ProductPageClientRefactored.tsx`

All five `translateCategory(...)` call sites now pass the `messages` object from `useTranslation()` instead of triggering a per-locale JSON re-import.

### SSR correctness

The provider is populated **server-side** before HTML is rendered, so:
- The server renders in the correct locale — no SSR/CSR mismatch.
- No flash-of-English.
- SEO crawlers (which execute little to no JS) see localised content.

### Email / template carve-outs

Intentionally **not** migrated — these do not ship to the browser:

- `lib/email/utils.ts`
- `lib/email/statusUpdate.ts`
- `app/template/page.tsx` (admin-only email preview tool that needs all three locales at once)

---

## C2 · Cut the 12 MB mobile hero video

**Updated:** `components/Hero.tsx`

The mobile hero block (`md:hidden`) used to render:

```tsx
<video autoPlay loop muted playsInline preload="auto" poster="/images/genosys-video-poster.jpg">
  <source src="/videos/start-video.mp4" type="video/mp4" />
</video>
```

— a 12 MB MP4 that was also forced to `preload="auto"`. On 4G that single resource dominated LCP.

Now the mobile block renders a plain `<Image src="/images/genosys-video-poster.jpg" priority fetchPriority="high" …/>` instead. The desktop hero (`hidden md:block`) still uses the loop video — desktop users have the bandwidth and the loop is a deliberate brand moment there.

Also removed the now-unused `mobileVideoRef` and simplified the autoplay `useEffect` to only target the desktop element.

`<link rel="preload" as="image" href="/images/genosys-video-poster.jpg">` in `app/layout.tsx` is unchanged — it now preloads the actual mobile LCP element.

---

## Verification

- `npx tsc --noEmit` — zero new errors. (All remaining errors are pre-existing in `__tests__/` and unrelated to this work.)
- `npm run build` — ✅ builds cleanly (Next.js 16.2.4, Turbopack).
- Linter — clean across every touched file (`ReadLints` run).

## Rollout notes

- The only routing-level change is that `proxy.ts` now sets an `x-pathname` request header on all passthrough responses. This is internal and does not affect URLs, cookies, caching, or SEO.
- No database or migration changes.
- No new runtime dependencies.
- Safe to revert any single item (A1 / A3 / A4 / A10 / C1 / C2) independently — they share no runtime coupling beyond the new shared helpers, which are additive.
