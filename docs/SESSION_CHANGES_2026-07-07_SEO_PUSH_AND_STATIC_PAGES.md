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

## Google Search Console API access (added same session)

- GSC property `https://genosys.ae/` was already verified (user account). Service account `gsc-reader@genosys-website.iam.gserviceaccount.com` added as full user; JSON key stored locally outside the repo (path passed via `GSC_KEY_FILE`).
- New tool: `scripts/gsc.js` (commit `21ac3383`) — dependency-free Search Console API client. Commands: `sites`, `query <jsonBody>`, `sitemaps`.
- **"/products lost 98% impressions" GSC flag investigated with real data — benign:**
  - `/products` earns almost only branded queries ("genosys", "genosys mask") at low volume (tens of impressions/day).
  - It regularly drops to zero when Google picks the homepage instead for branded terms (identical zero stretch May 27–Jun 3, again Jun 26–Jul 4; already recovering Jul 5 at position 3.4).
  - Site-wide impressions/clicks were steady the whole time (~250–460 imp/day, 14–28 clicks/day). No action needed.
- Sitemap status via API: submitted, last downloaded by Google 2026-07-06, 0 errors, 401 URLs. Image-sitemap entries will be picked up on next crawl.
- Insight: the search profile is overwhelmingly branded (homepage ~3.7K impressions per 28d vs low hundreds for everything else). Growth lever = non-branded content (guides for "microneedling at home UAE"-type queries).

## Product catalog vs Google index alignment (added same session, commit `88a975fe`)

Ran a URL Inspection API audit of all 65 canonical product URLs (`scripts/gsc-product-alignment.js`, report at `/tmp/gsc_product_alignment.json`).

**Result: 60 of 65 indexed. 5 not indexed:**

| Product | State | Cause |
|---|---|---|
| 66 CERABARRIER BIOME GEL CLEANSER (added Jul 4) | Discovered, not crawled | Too new |
| 65 Bio-Meso PDRN Homecare Ampoule 5000 (Jun 18) | Discovered, not crawled | Too new |
| 64 Hair Stamp (Jun 15) | Discovered, not crawled | Too new (has 13 imp already) |
| 62 SENSITIVE SKIN BEAUTY BOX (Feb 1) | Discovered, not crawled | Low crawl priority |
| 57 CHARMING LOOK BEAUTY BOX | Alternate page w/ canonical | Google's Jun 4 crawl predates the cuid→numeric canonical migration; live page is correct, needs recrawl |

Old cuid URLs (products 53/58/61 etc.) all 301 to numeric slugs — correct, will consolidate on recrawl.

**Actions taken:**
- New Arrivals rail ("Just landed") on EN/AR/RU homepages — products added in last 120 days, newest first, excludes bestsellers, self-expiring. Gives new PDPs homepage-level internal links for fast discovery. Verified live: shows 66/65/64.
- Extracted `RailProductCard` shared by Bestsellers + New Arrivals (no behavior change to bestsellers).
- Sitemap resubmitted via API (was last submitted Feb 12; `resubmit-sitemap` command added to `scripts/gsc.js`, now uses full webmasters scope; also added `inspect <url>` command).
- Confirmed all 5 products present in `/feed/products.xml` and sitemap.

**Manual follow-up for Vadim (API cannot do this):** In GSC, URL Inspection → paste each URL → "Request indexing" for: `/products/66`, `/products/65`, `/products/64`, `/products/62`, `/products/57`. Cuts discovery from weeks to days.

## Remaining SEO items (not actioned — need user input or are content projects)

1. ~~Google Search Console verification~~ — done; API access wired up (see above).
2. **Product reviews / aggregateRating** — schema is ready for it but there is no review system. Would unlock star ratings in search results. Separate product decision.
3. **New guide content for high-intent keywords** (e.g. "microneedling at home UAE", "Korean skincare Dubai") — content creation project, highest long-term ranking upside.
4. **Differentiated OG images per concern/category page** — needs designed image assets; all currently share the product collage.
