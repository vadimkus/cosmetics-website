# Session Changes — 2026-07-07 — SEO Push + Static Page Redesign

Continuation of the 2026-07-06/07 session ("lets work on SEO make sure we are top" + static page enhancement task). All changes verified locally, then confirmed live on genosys.ae after Vercel deploy.

## Commits (this session, chronological)

| Commit | Summary |
|---|---|
| `c1e7f84b` | FAQ: removed duplicate FAQPage schema, hash deep-linking (`#q-<id>`), JSON-LD escaping, a11y |
| `c93f24e7` | Terms, Privacy Policy, Locations aligned to editorial page style (kicker/headline/pill headers, dark CTA) |
| `7c341fd0` | SEO round 1: soft-404 fixes (`dynamicParams=false`), PDP title shortening, x-default hreflang, Blog in desktop nav, concern breadcrumb fix, About/Training OG images, `/phone*` noindex, AR/RU guide FAQ schema |
| `4c51caaa` | Middleware rewrites so unknown concern/category slugs return real 404s |
| `b0610aaf` | Price exposed in Product JSON-LD (`price` + `priceValidUntil`) + OG price tags — user-approved decision for Shopping rich results / Merchant eligibility |
| `385f8942` | SEO round 2 (see below) |
| `f0f0fa09` | Image sitemap (see below) |

## SEO Round 2 (`385f8942`)

1. **`/products` CollectionPage + ItemList JSON-LD** — main listing now emits schema for all 65 priced products (products with `price=0`/price-on-request excluded to keep snippets valid). Component fixes along the way:
   - Collection URL is now param-free (`/products`, was `?category=` query URL)
   - Product URLs use canonical slug helper (was raw id)
   - Breadcrumb third node points to `/products/category/<slug>`
   - Logo path corrected to `/images/genosys-logo.png`
   - Output escaped via `toJsonLd` (XSS hardening, consistent with other schemas)
2. **Blog post Twitter cards (EN + AR)** — `summary_large_image` with `@genosys_official`, featured image when present, falls back to file-based twitter-image title card.
3. **Bundle builder metadata** — keyword-rich title/description ("Build Your Skincare Set — Custom Bundle | GENOSYS UAE"), OG + Twitter cards with product collage image, canonical + full hreflang set (EN/AR/RU/x-default). AR/RU routes confirmed live (200).

## Image Sitemap (`f0f0fa09`)

- Product sitemap entries now carry up to 5 `<image:image>` sub-entries each (main image first) via the Google image-sitemap namespace.
- 357 image entries live on `https://genosys.ae/sitemap.xml` (verified with `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"`).
- Makes the visual catalog discoverable in Google Images without relying on HTML crawl.

## Live verification (post-deploy)

- `/products`: `CollectionPage` + `ItemList` + `numberOfItems: 65` present in HTML
- Blog post: `twitter:card summary_large_image` + `twitter:site @genosys_official`
- `/bundle-builder`: new title + hreflang alternates rendered; `/ar/` + `/ru/` variants return 200
- `sitemap.xml`: 357 `<image:loc>` entries

## Remaining SEO items (not actioned — need user input or are content projects)

1. **Google Search Console / Bing Webmaster verification codes** — `verification` block in root layout metadata is empty. Need the actual codes from the GSC/Bing accounts to add them (or DNS verification already in place — worth confirming which).
2. **Product reviews / aggregateRating** — schema is ready for it but there is no review system. Would unlock star ratings in search results. Separate product decision.
3. **New guide content for high-intent keywords** (e.g. "microneedling at home UAE", "Korean skincare Dubai") — content creation project, highest long-term ranking upside.
4. **Differentiated OG images per concern/category page** — needs designed image assets; all currently share the product collage.
