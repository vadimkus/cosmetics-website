# Session Changes — Branded OG Share Cards (P2 SEO)

**Date:** 2026-06-12
**Scope:** Open Graph / Twitter share images for products (EN/AR/RU), guides, and blog fallback
**Risk:** Zero runtime risk — only `<meta>` tag image URLs and new file-based image routes. No auth, payments, or data paths touched.

## Problem

The branded 1200x630 product OG card (`app/products/[id]/opengraph-image.tsx`) existed but **never actually showed**: each page's `generateMetadata` set explicit `openGraph.images` (raw 800x800 product photos), which override the file-based convention. Verified live before the fix:

- `genosys.ae/products/60` → `og:image = /images/Second/Prof_Meso.jpg` (square photo, crops badly in link previews)
- AR/RU product pages → same raw photos
- All guides → one shared stock photo (`genosys-products.jpg`) for every guide
- Blog posts without a featured image → `images: []` (no share image at all)

## Changes

### New shared renderer — `lib/ogImages.tsx`

- `renderProductOgImage(product, { size, locale })` — branded card: product photo left, name / price / availability / footer right, "Free Shipping UAE" badge. Extracted from the old EN-only `opengraph-image.tsx`.
- `renderTitleOgImage({ title, subtitle, size, locale })` — dark editorial title card for guides/articles.
- `renderFallbackOgImage(size)` — branded fallback (missing record / errors).
- `OG_SIZE` (1200x630), `TWITTER_SIZE` (1200x600), `OG_CONTENT_TYPE`.
- **Font note:** satori's bundled Noto Sans is Latin-only, so AR/RU cards use English labels (product names are stored in English anyway). Bundling Noto Arabic/Cyrillic subsets is a future option — labels are already structured per-locale.

### File-based image routes (new)

| Route | Card |
|---|---|
| `app/ar/products/[id]/opengraph-image.tsx` + `twitter-image.tsx` | product card |
| `app/ru/products/[id]/opengraph-image.tsx` + `twitter-image.tsx` | product card |
| `app/guides/[slug]/opengraph-image.tsx` + `twitter-image.tsx` | per-guide title card (SSG, `dynamicParams = false` matching the page) |
| `app/blog/[slug]/opengraph-image.tsx` | title card **fallback** for posts without a featured image |

EN product routes (`app/products/[id]/opengraph-image.tsx` / `twitter-image.tsx`) refactored to thin wrappers over the shared renderer — same visual output.

### Metadata fixes (so file-based cards actually apply)

- `app/products/[id]/page.tsx`, `app/ar/products/[id]/page.tsx`, `app/ru/products/[id]/page.tsx` — removed explicit `openGraph.images` / `twitter.images` (raw 800x800 photos). Removed now-unused `getProductImageUrls` import.
- `app/guides/[slug]/page.tsx` — removed the shared stock-photo `images`.
- `app/blog/[slug]/page.tsx` — `images: []` (suppresses og:image entirely) replaced with conditional spread: featured image when present, otherwise the key is omitted so the file-based title card applies. **Posts with featured images are unchanged.**

## Verification

- `tsc --noEmit` clean, ESLint clean on all touched files, full `next build` passed.
- All routes registered in build output (guides prerendered per slug, products/blog dynamic).
- Local prod server (`next start`):
  - `/products/60`, `/ar/products/60`, `/ru/products/60` → `og:image` + `twitter:image` now point to `…/opengraph-image` / `…/twitter-image`
  - `/guides/korean-skincare-dubai` → per-guide card
  - `/blog/genosys-ios-app-2026` (has featured image) → still the featured photo ✔
  - Rendered PNGs inspected visually: 1200x630, product photo + name + 600 AED + In Stock + branding; guide title card clean.
- Jest: 29 suites / 248 passed.

## Post-deploy check

```bash
curl -s https://genosys.ae/products/60 | grep -o '<meta property="og:image"[^>]*>'
# expect: content="https://genosys.ae/products/60/opengraph-image?..."
```

Then re-share a product link in WhatsApp/Telegram (or use their link-preview debuggers) — previews now show the branded card. Social platforms cache OG images; previews of previously-shared URLs refresh on their own schedule.

## 16 September 2026 — remove the empty white half

Physical Threads preview showed that the original two-column card left most of
the white information column unused below the price and stock line. The product
photo was also smaller than the space reserved for it.

The 1200×630 and 1200×600 renderers now share a cream outer canvas, a larger
white packshot panel and a full-height graphite information panel. Category,
shipping, name, price, availability and `genosys.ae` branding all sit inside
that dark panel, so unused space reads as deliberate composition rather than a
missing half-page.

Product 45 was rendered locally from the production record and visually
inspected before release.
