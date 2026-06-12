# Session Changes — AR/RU Guide Translations (P2 SEO)

**Date:** 2026-06-12
**Scope:** Arabic and Russian versions of all 8 SEO guide landing pages + index, hreflang, sitemap, middleware
**Risk:** Low — additive routes and content; one middleware regex narrowed (guides removed from the English-only redirect list). No auth, payments, or data paths touched.

## What was added

The 8 SEO guides existed only in English. AR and RU audiences are exactly the buyers these guides target (Arabic UAE search + the Russian-speaking community), and the site already had full AR/RU infrastructure — this fills the content gap.

### New content files

- `lib/seoLandingPagesAr.ts` — `SEO_LANDING_PAGES_AR` + `getSeoLandingPageAr()`: full Arabic translations (title, description, h1, eyebrow, intro, sections, links, FAQ, keywords) of all 8 guides. Internal links point at `/ar/...` routes.
- `lib/seoLandingPagesRu.ts` — same in Russian, links point at `/ru/...`.
- Slugs are **identical** to English (`/ar/guides/korean-skincare-dubai` etc.) so hreflang maps 1:1.
- The `/documents` link (English-only page) is intentionally left unprefixed in both.

**⚠️ Translations were drafted by the assistant** — Vadim should review the Russian, and ideally have a native speaker sanity-check the Arabic (MSA, e-commerce register, feminine address forms used in consumer-facing skincare copy per common GCC convention).

### New routes (mirror the EN structure: ISR 86400, `dynamicParams = false`)

| Route | Notes |
|---|---|
| `app/ar/guides/page.tsx` | AR index, `dir="rtl"`, Arabic breadcrumbs |
| `app/ar/guides/[slug]/page.tsx` | AR detail, RTL, localized static UI strings |
| `app/ru/guides/page.tsx` | RU index |
| `app/ru/guides/[slug]/page.tsx` | RU detail |

### SEO wiring

- **hreflang:** en/ar/ru `languages` alternates added to EN, AR, RU guide pages (index + detail). Verified as `<link rel="alternate" hreflang=...>` triplets in rendered HTML.
- **Canonicals:** each locale page canonicalizes to itself.
- **OG images:** AR/RU guide pages reference the **EN title card** (`/guides/<slug>/opengraph-image`) via explicit `openGraph.images` — satori's bundled font is Latin-only, so a localized card would render Arabic/Cyrillic as tofu. Bundling Noto subsets is a future option.
- **Sitemap (`app/sitemap.ts`):** guides moved from `englishOnlyPages` to `localizedUrls()` — every guide now emits EN+AR+RU entries with xhtml hreflang alternates (27 guide URLs total).

### Middleware fix (`proxy.ts`)

`/ar/guides*` and `/ru/guides*` were 308-redirected to the EN path by the "English-only canonical pages" rule (`genosys|documents|guides`). Removed `guides` from that regex; `genosys` and `documents` still redirect (verified).

## Verification

- `tsc --noEmit` clean, ESLint clean, full `next build` passed; `/ar/guides`, `/ar/guides/[slug]`, `/ru/guides`, `/ru/guides/[slug]` registered.
- Local prod server: all 8 AR + 8 RU detail pages + 2 indexes return 200; `/ar/genosys` and `/ru/documents` still 308 to EN.
- Rendered HTML checked: canonical, hreflang triplet, og:image, `dir="rtl"` on AR.
- Browser-rendered AR detail page (RTL layout correct, Arabic chrome) and RU index (all 8 guides listed).
- Jest: 29 suites / 248 passed.
- Pre-existing note (NOT a regression): unknown guide slugs return a styled 404 page with HTTP 200 (soft 404) — same behavior as the live EN guides today. Tracked as a known issue.

## Post-deploy checks

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://genosys.ae/ar/guides/korean-skincare-dubai   # expect 200
curl -s -o /dev/null -w "%{http_code}\n" https://genosys.ae/ru/guides/korean-skincare-dubai   # expect 200
curl -s https://genosys.ae/sitemap.xml | grep -c "guides"                                     # localized entries present
```

Then: resubmit the sitemap in Google Search Console to speed up discovery of the 18 new URLs.
