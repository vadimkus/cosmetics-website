# Session Changes — 2026-06-11 — SEO P0: SSR Blackout Fix + Canonical Unification

Implements the P0 items from `SEO_AUDIT_2026-06-11_FULL_AI_SEARCH.md`.

## Problem Recap (from audit)

1. **C1 — Site-wide SSR blackout.** `PWASplashScreen` (wrapping all pages in
   `app/layout.tsx`) returned a bare spinner during SSR. Every page served
   ~11 words of HTML to non-JS crawlers (GPTBot, ClaudeBot, PerplexityBot)
   and crippled Lighthouse (mobile 31, LCP 12.5s).
2. **C2 — Product canonical conflict.** Sitemap listed numeric product URLs
   (`/products/60`) while page canonicals declared CUID URLs
   (`/products/cmk449na…`) — contradictory signals to search engines.
3. Soft 404s: missing products/guides returned HTTP 200.

## Changes

### 1. `components/pwa/PWASplashScreen.tsx` — SSR renders children
- During SSR/pre-hydration, children are now ALWAYS rendered into the HTML.
- The splash overlay is also in the server HTML but hidden via the
  `pwa-boot-splash` CSS class (`app/globals.css`), which only displays in
  PWA display modes (`standalone` / `fullscreen` / `minimal-ui`).
  PWA users still see the splash with no content flash; browsers and
  crawlers never see it.
- Post-hydration PWA auth-gating logic is unchanged (unauthenticated PWA
  users still redirected to `/pwa-login`).
- Fragment structure kept stable (`<>{overlay}{content}</>`) so React never
  remounts the page tree when hydration state flips.

### 2. Product canonical unification (numeric scheme)
- New helper `getCanonicalProductSlug(product)` in `lib/seo.ts`:
  `productNumber ?? id`. DB audit confirmed every visible product resolves
  to a unique numeric slug (48 legacy products have numeric ids; 14 newer
  CUID products all have a numeric `productNumber`). No backfill needed.
- Numeric slug now used consistently in:
  - canonicals + og:url + hreflang alternates (`app/{,ar/,ru/}products/[id]/page.tsx`)
  - Product + Breadcrumb JSON-LD (`components/schema/RouteStructuredData.tsx`)
  - sitemap (`app/sitemap.ts`)
  - Google Merchant feed (`app/feed/products.xml/route.ts`)
  - AI indexes (`app/ai-products.txt/route.ts`, `app/llms-full.txt/route.ts`)
  - homepage bestseller links (`components/home/HomeDesktopSections.tsx`)
  - (ProductCard already used `productNumber || id`)
- **Real 301 redirects** for the 11 indexed legacy CUID/UUID product URLs in
  `proxy.ts` (static map, all locales). Page-level `permanentRedirect()` in
  `generateMetadata` remains as fallback for any future CUID URL.

### 3. Soft 404 mitigation
- `notFound()` moved into `generateMetadata` for product pages (EN/AR/RU)
  and guides, replacing the "Product Not Found" metadata stubs.
- `app/guides/[slug]`: added `dynamicParams = false` (slugs are static).
- **Known limitation:** the root `app/loading.tsx` boundary makes Next.js
  stream a 200 status before `notFound()`/`redirect()` resolve, so missing
  products still return HTTP 200 — but now with the `not-found` boundary +
  `noindex, follow` robots meta, which keeps them out of indexes. A real
  404 status would require removing the site-wide loading skeletons
  (UX trade-off — deliberately not done). The proxy-level 301s above are
  real HTTP redirects and unaffected.

### 4. Dead code removed
- `app/products/[id]/ProductPageClientDynamic.tsx` and
  `ProductPageClientOptimized.tsx` (unused `ssr: false` variants; the live
  page uses `ProductPageClientRefactored`, which server-renders).

## Verification (local production build)

| Check | Before | After |
|---|---|---|
| Homepage SSR word count (GPTBot UA) | ~11 | 1,255 |
| `/products` SSR word count | ~11 | 7,104 |
| `/products/60` SSR word count | ~11 | 558 |
| `/products/60` canonical | CUID URL | `https://genosys.ae/products/60` |
| Product JSON-LD in served HTML | no | yes (Product + BreadcrumbList) |
| hreflang on product pages | CUID URLs | numeric, EN/AR/RU + x-default |
| CUID product URL | 200 (duplicate content) | **301** → numeric (all locales) |
| Sitemap/feeds CUID URLs | mixed | 0 (186 numeric product URLs) |
| Missing product | 200, fake product page | 200 + not-found boundary + `noindex` |
| Missing guide (unknown slug) | 200 | 200 + `noindex` (`dynamicParams=false`) |

- `tsc --noEmit` ✓, eslint ✓, jest 248 passed ✓, `npm run build` ✓
- Browser check: homepage + product page render fully, no splash overlay in
  browser mode; PWA splash CSS verified present in built stylesheet.

## Expected Impact
- AI crawlers and Googlebot now receive full page content in HTML.
- LCP/Lighthouse should improve dramatically (no client-side content gate).
- Duplicate product URL signals eliminated; link equity consolidates on
  numeric URLs.

## Post-deploy checklist
- [ ] Verify production: `curl -A GPTBot https://genosys.ae/` word count
- [ ] Verify 301: `curl -I https://genosys.ae/products/cmk449na90077e9k5anpfqz4o`
- [ ] Test PWA on a real device (login gate + splash still work)
- [ ] Resubmit sitemap in Google Search Console
- [ ] Re-run PageSpeed Insights after a few days
