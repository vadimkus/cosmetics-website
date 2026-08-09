# Premium homepage skin-concern redesign

**Date:** 2026-08-09
**Scope:** Homepage `Shop by skin concern` section and all concern landing/catalog surfaces

## Outcome

- Rebuilt the concern section as a dedicated, testable component with an editorial ivory layout, serif display typography, a responsive 4/2/1-column card grid, eight distinct image-led cards, and a full-width skin-analysis callout.
- Preserved all existing localized concern routes, the skin-analysis route, server-computed product counts, and the established EN/RU/AR locale prefixes.
- Added explicit Arabic RTL composition, keyboard focus rings, semantic links, decorative-image alt treatment, minimum touch targets, and reduced-motion handling.
- Enabled the existing `?full=true` mobile homepage path to render the responsive lower homepage sections instead of showing only the hero. The normal mobile redirect to `/products` remains unchanged.
- Refined the first pass after direct target comparison: cards now use a 13px radius, lighter 1px borders and shadows, a compact 960px four-column breakpoint, a short gold heading rule, smaller icons/count pills, and a narrower left-only readability gradient that preserves the imagery on the right half.

## Content and order

1. Sun Protection — 5 products
2. Acne & Blemishes — 7 products
3. Pigmentation — 5 products
4. Scar Treatment — 6 products
5. Hair Loss — 9 products
6. Anti-Aging — 9 products
7. Hydration — 8 products
8. Sensitive Skin — 9 products

The visible count still comes from `getHomeData()` and `filterProductsByConcern()` so each card remains consistent with its destination collection. The requested numbers are retained as safe presentation fallbacks.

## Local image assets and licenses

The final cards use Vadim-supplied, first-party artwork from `public/images/home/skin_concern/`. The requested folder was present under `public/images/home/skin_concern/` rather than `public/images/skin_concern/`. The source filename is confirmed as `sensetive.jpeg` (misspelled in the supplied asset).

All eight JPEG sources are 1024 × 1024, 8-bit, three-channel sRGB, 72 DPI, with no embedded ICC profile, EXIF block, orientation flag, or alpha channel. The untouched source set is 2,659,556 bytes.

Source inventory and SHA-256:

- `sun.jpeg` → Sun Protection — `ae4a448f810b73dd6614270687fb02f0bfe5680853337b967073b08fe59dd32b`
- `acne.jpeg` → Acne & Blemishes — `83384e1bba3b62ea76a5041237d509a97d0dfbf4c69b1f0bc493e80a78e0e946`
- `pigmentation.jpeg` → Pigmentation — `68bae1ee4fc22c404c8cc710bd790754bddc0047bd17235447b2b3dfc48762ca`
- `scar.jpeg` → Scar Treatment — `a47ff08bc30cf1c8809ed44a552ffe422587eb707c2551f7bd6182323f28ff6d`
- `hair_loss.jpeg` → Hair Loss — `ca789118b50fc9737b1fcf302e9b494dee4bfa4dfd904e4b3bad505d037aa71b`
- `anti_age.jpeg` → Anti-Aging — `78a0e895569a51afbb1d8a2cf16c79e3181898f3f8476c02ec8cc931436f6c32`
- `hydration.jpeg` → Hydration — `6e9bda49d24dff6a1226aff956a75a7e9cde485ce205a7be822c9016716338ad`
- `sensetive.jpeg` → Sensitive Skin — `49baa874587b9b047734ac166ff17ba26eb0c858f0b2f9873ce24c997808ed5a`

Sharp generated semantic 960 × 720 WebP derivatives at quality 86 without upscaling. Metadata was stripped; outputs remain sRGB with no ICC or EXIF blocks. The final runtime set is 128,296 bytes:

- `sun-protection.webp` — 11,584 bytes
- `acne-blemishes.webp` — 19,018 bytes
- `pigmentation.webp` — 11,990 bytes
- `scar-treatment.webp` — 8,926 bytes
- `hair-loss.webp` — 15,654 bytes
- `anti-aging.webp` — 18,510 bytes
- `hydration.webp` — 14,006 bytes
- `sensitive-skin.webp` — 28,608 bytes

The original JPEGs remain untouched as first-party source assets. Superseded downloaded Unsplash/Pexels card assets were unreferenced and removed. No remote image host is used at runtime.

## Concern route and surface audit

- Canonical concern slugs remain sourced from `CONCERN_PAGES`: `sun-protection`, `acne-treatment`, `pigmentation`, `scars-treatment`, `hair-loss`, `anti-aging`, `hydration`, and `sensitivity`.
- The 24 localized landing pages under `/products/concern/[slug]`, `/ru/products/concern/[slug]`, and `/ar/products/concern/[slug]` now render the same per-slug artwork in a shared responsive hero and shared related-concern cards.
- `lib/concernVisuals.ts` is the single visual mapping used by the homepage, landing-page heroes, related cards, product-catalog concern grids, the interactive face-map result cards, social metadata, image sitemap entries, and the mobile concern API.
- Open Graph and Twitter metadata now use each concern's artwork with its actual 960 × 720 dimensions. Canonical URLs and EN/RU/AR hreflang alternates were not changed.
- Sitemap concern URLs are still generated for all three locales, now from `getAllConcernSlugs()` instead of a second hardcoded list; each entry includes its matching image.
- The mobile API response now exposes additive `image` and `imagePosition` fields for the current concern and an `image` field for related concerns. Product filtering, pricing, routine, FAQ, and cache behavior are unchanged.
- The mobile API's `meta.productCount` intentionally remains larger than the homepage/landing collection count for most concerns because its existing contract appends products referenced by routine steps. Verification returned 16, 11, 12, 11, 9, 15, 12, and 11; this was not forced to the homepage's filtered 5, 7, 5, 6, 9, 9, 8, and 9.
- The compact idle quick chips in `ConcernFaceMap` intentionally remain icon/text controls because they are navigation controls around the diagnostic face diagram; selected concern result cards use the shared artwork.
- Guide pages, product cards, category pages, breadcrumb schema, collection schema, and product imagery intentionally retain their existing content-specific images. Their concern links were audited but they are not decorative concern-image surfaces.
- The edge proxy retains its small inlined concern-slug allowlist intentionally to avoid pulling the large `concernsData` module into middleware. The visual mapping is not duplicated there.

## Files

- `lib/concernVisuals.ts`
- `components/home/SkinConcernSection.tsx`
- `components/home/HomeDesktopSections.tsx`
- `components/ConcernHero.tsx`
- `components/RelatedConcernCards.tsx`
- `components/products/ConcernLinkGrid.tsx`
- `components/products/ConcernFaceMap.tsx`
- `app/products/concern/[slug]/page.tsx`
- `app/ru/products/concern/[slug]/page.tsx`
- `app/ar/products/concern/[slug]/page.tsx`
- `app/products/page.tsx`
- `app/ru/products/page.tsx`
- `app/ar/products/page.tsx`
- `app/api/mobile/concerns/[slug]/route.ts`
- `app/sitemap.ts`
- `__tests__/components/SkinConcernSection.test.tsx`
- `__tests__/components/ConcernVisuals.test.tsx`
- `public/images/home/skin_concern/*.jpeg`
- `public/images/home/skin_concern/*.webp`
- `docs/README.md`

## Verification

- Focused Jest: exact content/order/counts, concern links, localized routes, CTA, and RTL.
- TypeScript `tsc --noEmit`.
- Focused ESLint and IDE diagnostics.
- Production `npm run build` completed successfully. Its existing PostgreSQL SSL-mode warnings and non-fatal blog fetch timeout logs did not fail generation; build-created service-worker version changes were restored so verification did not pollute the worktree.
- Automated final screenshots at 1000px desktop, 390px mobile, and 1000px Arabic/RTL.
- Browser checks confirmed all eight local images load with non-zero natural dimensions and the expected localized CTA routes.
- All eight English concern URLs returned HTTP 200 with the correct `currentSrc`, 200 image responses, dedicated Open Graph image, no console errors, and unchanged product totals: 5, 7, 5, 6, 9, 9, 8, and 9.
- Representative Russian, Arabic RTL, mobile, product-catalog grid, and related-card checks also returned HTTP 200 with non-zero image dimensions and no console errors.
- Authenticated local mobile API checks returned HTTP 200 for all eight slugs, the exact shared image filename for each concern, and images for every related-concern object.
- Final evidence captures:
  - `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/skin-concern-first-party-1000x630.png`
  - `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/skin-concern-first-party-mobile.png`
  - `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/skin-concern-first-party-ar-rtl.png`
  - `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/concern-page-sun-protection-en.png`
  - `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/concern-page-acne-treatment-en.png`
  - `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/concern-page-pigmentation-en.png`
  - `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/concern-page-scars-treatment-en.png`
  - `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/concern-page-hair-loss-en.png`
  - `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/concern-page-anti-aging-en.png`
  - `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/concern-page-hydration-en.png`
  - `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/concern-page-sensitivity-en.png`
  - `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/concern-page-acne-treatment-en-mobile-final.png`
  - `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/concern-page-pigmentation-ru.png`
  - `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/concern-page-sensitivity-ar-final.png`
  - `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/concern-related-sun-en-related.png`
  - `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/concern-catalog-grid-en.png`
  - `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/concern-catalog-grid-ar.png`
