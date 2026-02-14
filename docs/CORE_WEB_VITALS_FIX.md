# Core Web Vitals Fix — February 14, 2026

## Problem

Google Search Console reported **56 URLs** with two Core Web Vitals issues on **mobile**:

| Issue | Severity | URLs Affected |
|-------|----------|---------------|
| CLS (Cumulative Layout Shift) > 0.1 | Need improvement | 56 |
| LCP (Largest Contentful Paint) > 2.5s | Need improvement | 56 |

## Root Causes

### CLS > 0.1

**Primary cause:** Multiple `<Image>` components had `style={{ width: 'auto', height: 'auto' }}` which overrode the explicit `width`/`height` props. Browsers use these intrinsic dimensions to reserve space before the image loads — overriding them to `auto` caused layout shifts when images rendered at their actual size.

**Affected components:**
- `components/Hero.tsx` — 3 images (mobile fallback, mobile logo, desktop fallback)
- `components/Logo.tsx` — 1 image
- `app/products/ProductsPageClient.tsx` — 1 image
- `components/header/HeaderMobileIcons.tsx` — 1 image
- `components/header/HeaderRussianMobile.tsx` — 1 image
- `components/footer/Footer.tsx` — 1 image

### LCP > 2.5s

**Primary causes:**
1. Hero video had no `poster` image — browser had to wait for video to decode before painting anything in the hero area
2. No `<link rel="preload">` hints for critical above-the-fold assets
3. Blocking inline scripts in `<head>` were verbose (~70 lines) — unnecessary parse/execution time
4. No long-term cache headers for static assets

## Changes Made

### 1. CLS Fix — Remove style overrides on Image components

**Files changed:**
- `components/Hero.tsx` — Removed `style={{ width: 'auto', height: 'auto' }}` from 3 images, added `priority` to fallback images
- `components/Logo.tsx` — Removed `style={{ width: 'auto', height: 'auto' }}`
- `app/products/ProductsPageClient.tsx` — Removed `style={{ width: 'auto', height: 'auto' }}`
- `components/header/HeaderMobileIcons.tsx` — Removed style override, corrected width/height to match CSS (120x36), added `priority`
- `components/header/HeaderRussianMobile.tsx` — Removed style override, corrected width/height (120x36), added `priority`
- `components/footer/Footer.tsx` — Removed style override, changed `priority={false}` to `loading="lazy"`

**Why safe:** The visual rendering is unchanged — Tailwind CSS classes (`h-12 w-auto`, `object-contain`, `w-[120px]`) still control the rendered size. The only difference is the browser now correctly reserves space during load.

### 2. LCP Fix — Video poster image

**File:** `components/Hero.tsx`

Added `poster="/images/genosys-video-poster.jpg"` to both mobile and desktop `<video>` elements. This gives the browser an image to paint immediately while the video loads/decodes.

### 3. LCP Fix — Preload hints

**File:** `app/layout.tsx`

Added to `<head>`:
```html
<link rel="preload" href="/images/genosys-video-poster.jpg" as="image" fetchPriority="high" />
<link rel="preload" href="/images/genosys-logo.png" as="image" />
```

### 4. LCP Fix — Minified blocking scripts

**File:** `app/layout.tsx`

Minified the two blocking inline scripts (locale detection + theme initialization) from ~70 lines to single-line minified versions. Same exact logic, just reduced parse/execution time.

**Locale script behavior (unchanged):**
- Detects `/ar` and `/ru` URL paths
- Sets `lang`, `dir`, `data-locale`, `data-dir` on `<html>`
- Sets `dir`, `data-dir` on `<body>` (with MutationObserver fallback)
- Sets `window.__GENOSYS_DIR__` and `window.__GENOSYS_LANG__`

**Theme script behavior (unchanged):**
- Reads `localStorage('genosys-theme')`
- Checks `prefers-color-scheme: dark`
- Sets `data-theme` attribute and CSS class on `<html>`

### 5. Performance — Static asset cache headers

**File:** `next.config.js`

Added `headers()` configuration for long-term caching:
```
/images/*  → Cache-Control: public, max-age=31536000, immutable
/Logo/*    → Cache-Control: public, max-age=31536000, immutable
/videos/*  → Cache-Control: public, max-age=31536000, immutable
/favicon/* → Cache-Control: public, max-age=31536000, immutable
```

## What Was NOT Changed

- No payment/checkout/Stripe files modified
- No authentication/login files modified
- No cart/order logic modified
- No API routes modified
- No database schema changes
- No translation files modified
- No functional logic changes — all changes are purely visual/performance

## Validation

After deploying:
1. Go to [Google Search Console → Core Web Vitals](https://search.google.com/search-console/core-web-vitals)
2. Click "Validate Fix" on both CLS and LCP issues
3. Validation takes ~28 days
4. Monitor with Chrome DevTools Lighthouse (Performance tab) for immediate results

## Expected Impact

- **CLS** should drop below 0.1 (the "good" threshold)
- **LCP** should improve to under 2.5s on mobile — poster image provides instant paint, preload hints reduce resource discovery time
- **Repeat visits** will be significantly faster due to 1-year cache headers on static assets
