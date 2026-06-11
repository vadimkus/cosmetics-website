# Full SEO Audit — genosys.ae (Google + AI Search Engines)

**Date:** 2026-06-11 | **Scope:** technical SEO, AI search (AEO/GEO), structured data, i18n, performance
**Method:** live production crawl (curl, no JS execution — exactly what AI crawlers see), Lighthouse, codebase inspection, DB checks

---

## Executive Summary

The SEO *infrastructure* is far better than average — llms.txt, AI-bot robots rules, per-locale metadata, hreflang, JSON-LD architecture, dynamic OG images, product feeds. Someone did real work here (Apr–May 2026 sessions).

**But one bug silently destroys most of its value: the entire `<body>` of every page renders as a loading spinner in server HTML.** AI crawlers (GPTBot, ClaudeBot, PerplexityBot) do not execute JavaScript — they see ~11–16 words per page. Google has to JS-render everything (slow, budget-limited). Fixing this single component is worth more than everything else in this report combined.

**Verdict: head = A−, body = F. Fix C1 and the site jumps a class.**

---

## Measured Evidence (live production, 2026-06-11)

### Visible text in server HTML (what AI crawlers see)

| Page | Visible words | Product links in HTML |
|---|---|---|
| Homepage | **11** | 0 |
| /products (catalog) | **13** | **0** |
| /products/60 (product) | **16** | 0 |
| /faq | **11** | 0 |
| /guides/korean-skincare-dubai | **12** | 0 |
| /products/concern/anti-aging | **13** | 0 |
| /products/category/serum | **13** | 0 |
| /locations/dubai | **14** | 0 |
| Blog post | **19** | 0 |

A normal e-commerce page should be 500–3,000 words. The whole site body is invisible to non-JS crawlers.

### JSON-LD presence (live HTML)

| Page | Schemas found | Missing (exists in code, eaten by C1) |
|---|---|---|
| Homepage | WebSite, Organization, LocalBusiness | FAQPage (GeoFaqSchema), SpeakableSchema, ItemList |
| Product page | + Product, BreadcrumbList ✅ | — (layout-level, survives) |
| Guide page | + WebPage, FAQPage, BreadcrumbList ✅ | — (layout-level, survives) |
| /faq | global only | **FAQPage** |
| Blog post | global only | **BlogPosting** |
| Category/concern | global only | **CollectionPage** |

Pattern: schemas injected from `app/layout.tsx` (via `RouteStructuredData`) survive; schemas rendered inside page bodies are swallowed by the SSR gate.

### Performance (Lighthouse, mobile-emulated lab run)

| Metric | Value |
|---|---|
| Performance score | **31/100** |
| LCP | 12.5 s |
| TBT | 1,160 ms |
| Speed Index | 17.9 s |
| Unused JS | 368 KiB |
| Accessibility / SEO scores | 93 / 92 |

CrUX field data: none (traffic below threshold) — lab numbers are the only signal. Note: most of the LCP pain is the same root cause as C1 (nothing paints until JS hydrates).

### Other live checks

- robots.txt: 412 lines, all major AI bots explicitly allowed (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Applebot, Meta, DeepSeek, cohere) ✅
- llms.txt (122 lines) ✅ | llms-full.txt (6,801 words) ✅ | ai-products.txt ✅ | /feed/products.xml ✅
- Sitemap: 368 URLs, all 3 locales with hreflang + x-default ✅
- hreflang in head: present (renders as `hrefLang`, case-insensitive = valid) ✅ — but **x-default missing from head** (sitemap only)
- Canonicals: per-locale, present ✅ — but see C2
- http→https 308 ✅ | trailing-slash 308 ✅ | **www→non-www 307 (temporary — should be permanent)** ⚠️
- `/products/99999` → **HTTP 200 "Product Not Found"** (soft 404) ❌
- `/admin` serves `robots: index, follow` meta ❌ (crawl-blocked by robots.txt, but URL can still be indexed)
- GSC/Bing/Yandex verification meta tags: commented out in `app/layout.tsx` (may be DNS-verified — confirm)

---

## Findings

### 🔴 C1 — Site-wide SSR blackout (CRITICAL — the one that matters)

`components/pwa/PWASplashScreen.tsx` (lines 106–112) wraps **all page content** in `app/layout.tsx`:

```tsx
// For non-client (SSR), return minimal loading state
if (!isClient) {
  return <spinner />   // ← every page's server HTML is just this
}
```

`isClient` is always `false` during server rendering, so the server sends a spinner instead of page content — on every route. Effects:

1. **AI search engines see nothing.** GPTBot/ClaudeBot/PerplexityBot don't execute JS. Your product descriptions, FAQ answers, and guides are invisible to ChatGPT, Claude, and Perplexity. The (excellent) llms.txt is currently the *only* thing they can read.
2. **Google must JS-render every page** — delayed indexing, wasted crawl budget, fragile (any JS error = blank page).
3. **Page-level JSON-LD is eaten** — FAQPage on /faq, BlogPosting on posts, CollectionPage on categories never reach the HTML.
4. **LCP 12.5s** — nothing paints until the JS bundle hydrates.

The irony: `app/page.tsx` line ~80 has a comment "*we intentionally keep this outside MobileRedirect so crawlers still see a rich homepage*" — the data is fetched server-side and serialized into the flight payload, but the rendered HTML is discarded by the splash gate. This is an unintended regression, not a design decision.

**Fix (one component):** during SSR and for non-PWA visitors, render `{children}` directly. Only gate client-side *after* detecting PWA display-mode. Crawlers and web users get full HTML; the PWA keeps its auth splash (with a brief flash at worst).

Also fix while there: `app/products/[id]/ProductPageClientDynamic.tsx` line 30 sets `ssr: false` for the product UI ("to improve performance") — verify which client component the product page actually uses and re-enable SSR.

**Effort:** half a day incl. web + PWA testing. **Risk:** moderate (PWA auth flow must be re-verified) — but this is the highest-ROI change available.

### 🔴 C2 — Product canonical ↔ sitemap URL conflict (CRITICAL)

- Sitemap lists `/products/60` (numeric `productNumber`) — 51 URLs
- The page at `/products/60` declares `canonical: /products/cmk449na90077e9k5anpfqz4o` (DB cuid)
- Both URLs return 200 with identical content (duplicate)
- Sitemap also contains 10 cuid URLs + 1 UUID URL (mixed schemes; 48 of 62 visible DB products have no `productNumber`)

Google receives contradictory signals: "index /products/60" (sitemap) vs "the real page is the cuid URL" (canonical). Result: split signals, unpredictable indexed URL, diluted ranking.

**Fix:** pick the numeric/`productNumber` URL as canonical (human-readable, already in sitemap and likely indexed). `generateMetadata` + `ProductSchema` + sitemap must all emit the same URL; 301 cuid → numeric; assign `productNumber` to the 48 DB products that lack one (or canonicalize those to their cuid consistently).
**Effort:** ~1 day (URL helper is centralized in `lib/seo.ts`). **Risk:** low-moderate — must not break existing links; redirects preserve equity.

### 🟠 H1 — Soft 404s on unknown products

`/products/99999` returns HTTP 200 with "Product Not Found" body. Google treats these as soft 404s (crawl waste, index pollution). **Fix:** call `notFound()` when product lookup fails. Trivial.

### 🟠 H2 — Performance (mobile Lighthouse 31)

Mostly downstream of C1 (no server HTML to paint). After C1: cut the 368 KiB unused JS, lazy-load framer-motion/3D components below the fold, audit the 10-deep provider stack in layout. Blog featured images use `unoptimized` (`app/blog/[slug]/page.tsx` ~line 281) — bypasses AVIF/WebP and srcset.

### 🟠 H3 — Search Console / Bing not verified in code

Verification meta tags commented out in `app/layout.tsx` (115–177). If GSC isn't DNS-verified, you have no index coverage, no rich-result reports, no manual-action alerts. Bing matters double for AI: **Bing's index feeds ChatGPT search**. Also: no IndexNow integration (instant Bing/AI-engine pings on content change — free, ~1h work).

### 🟠 H4 — www redirect is temporary (307)

`https://www.genosys.ae` → 307 → apex. Temporary redirects don't consolidate signals. Set the permanent redirect in Vercel domain settings (no code change).

### 🟡 M1 — No reviews → no stars in SERP/AI answers

`aggregateRating` intentionally disabled (no review system exists — correct decision, fake ratings risk manual action). But product star ratings are the highest-CTR rich result and AI engines cite rating data. A real review system (verified buyers via existing order emails) is the roadmap unlock.

### 🟡 M2 — x-default missing from head hreflang

Present in sitemap, absent from `alternates.languages` in metadata. Add `'x-default': enUrl` to `buildAlternates()` in `lib/seo.ts` and homepage metadata.

### 🟡 M3 — /admin (and cart/checkout/login) indexable meta

robots.txt blocks crawling but not indexing. Add `robots: { index: false }` metadata to admin/cart/checkout/login/profile layouts.

### 🟡 M4 — AR blog post canonical missing

`app/ar/blog/[slug]/page.tsx` lacks `alternates.canonical` (EN version has it).

### 🟡 M5 — Single static OG image for non-product pages

Categories, concerns, guides, blog list all share `genosys-products.jpg`. Products already have dynamic OG generation — extend the pattern.

### ⚪ Low / fine as-is

- Guides are EN-only (deliberate; AR/RU expansion is a content opportunity, not a bug)
- Blog list caps at 20 with no pagination (14 posts — fine for now)
- sitemap-index wraps a single sitemap (fine at 368 URLs)
- `keywords` meta tag (ignored by engines, harmless)
- lastmod uses real `updatedAt` for products/posts ✅

---

## AI Search (AEO/GEO) Readiness Scorecard

| Capability | Status |
|---|---|
| robots.txt allows AI bots (GPTBot, ClaudeBot, PerplexityBot, etc.) | ✅ Excellent — 15 bots explicitly handled |
| llms.txt / llms-full.txt | ✅ Excellent (122 lines / 6,801 words, well-structured) |
| ai-products.txt machine-readable product index | ✅ Rare, ahead of the curve |
| Product feed (Google Merchant XML) | ✅ |
| **Page content readable without JS** | ❌ **C1 — the blocker** |
| FAQPage schema in rendered HTML | ⚠️ Only on guides; eaten on /faq + homepage (C1) |
| Product schema in rendered HTML | ✅ Complete (price, availability, shipping, returns) |
| Entity clarity (Organization, LocalBusiness, sameAs) | ✅ Strong |
| Bing verified + IndexNow (feeds ChatGPT) | ❌ Missing |
| Citable stats/sources in content | ⚠️ Thin — guides are good start |

**Bottom line for AI search:** you built the best llms.txt setup I've seen on a site this size, then served AI crawlers a spinner for every actual page. Fix C1 → instantly best-in-class AEO posture for the niche.

---

## Prioritized Plan

### P0 — This week (unlocks everything else)

| # | Action | Effort | Risk | Impact |
|---|---|---|---|---|
| 1 | **Fix `PWASplashScreen` SSR gate** — render children during SSR/non-PWA; gate only in PWA after mount. Re-verify PWA auth flow + web on desktop/mobile. | 0.5 day | Moderate (PWA testing) | 🚀 Massive — every page becomes readable by AI crawlers + Google; page-level schema (FAQPage, BlogPosting, CollectionPage) starts rendering; LCP collapses |
| 2 | Re-enable SSR for the product page client component (`ssr: false` flag) | 1 h | Low | Product content in HTML |
| 3 | **Soft 404 → real 404** (`notFound()` on missing product) | 1 h | None | Stops index pollution |
| 4 | **Product canonical unification** — one URL scheme (productNumber), align canonical + schema + sitemap, 301 the duplicates, backfill `productNumber` for 48 DB products | 1 day | Low-mod | Consolidates product ranking signals |
| 5 | Verify after deploy: curl word counts (expect 500+), schema presence on /faq + blog + categories, GSC URL inspection + reindex requests for top 20 pages | 2 h | None | Proof |

### P1 — Next 2 weeks

| # | Action | Effort | Risk |
|---|---|---|---|
| 6 | GSC + **Bing Webmaster** verification (Bing feeds ChatGPT) + **IndexNow** pings on product/blog updates | 0.5 day | None |
| 7 | www→non-www permanent redirect (Vercel domain settings) | 15 min | None |
| 8 | noindex on admin/cart/checkout/login; x-default in head hreflang; AR blog canonical | 2 h | None |
| 9 | Remove `unoptimized` from blog images; lazy-load 3D/framer-motion below fold; trim 368 KiB unused JS | 1–2 days | Low |
| 10 | Post-C1 Lighthouse re-run; target mobile ≥ 70 | — | — |

### P2 — This month+

| # | Action | Why |
|---|---|---|
| 11 | **Review system** (verified buyers via order emails) → enable `aggregateRating` | Stars in SERP + AI citations; biggest CTR lever left |
| 12 | AR/RU versions of the 8 guides; 2–4 new guides/month targeting answer-engine queries ("best Korean sunscreen UAE", "microneedling aftercare Dubai") | Guides are your strongest AEO asset and they're EN-only |
| 13 | Dynamic OG images for categories/concerns/guides (pattern exists for products) | Social/share CTR |
| 14 | Track AI referrals in GA4 (chatgpt.com, perplexity.ai referrers) + monthly brand-mention checks in ChatGPT/Perplexity | Measure AEO ROI |
| 15 | Blog cadence (14 posts total, last activity unclear) — repurpose existing session knowledge (ingredient deep-dives, protocols) | Topical authority |

### Explicitly NOT recommended

- Fake/imported aggregate ratings (manual-action risk; code comment shows this was already correctly avoided)
- Buying backlinks
- Auto-generated thin content per emirate beyond the existing 7 location pages

---

## Verification Checklist (after P0 ships)

```
curl -s https://genosys.ae/ | <strip tags> | wc -w        → expect 500+, was 11
curl -s https://genosys.ae/faq | grep FAQPage             → expect present, was missing
curl -s https://genosys.ae/products | grep -c 'href="/products/'  → expect 50+, was 0
curl -s -o /dev/null -w "%{http_code}" https://genosys.ae/products/99999  → expect 404, was 200
Product page canonical == sitemap URL                     → expect match, was conflict
Lighthouse mobile performance                             → expect 60+, was 31
GSC: Coverage report — valid pages trending up over 2–4 weeks
```

---

*Audit artifacts: live crawl measurements taken 2026-06-11 08:00–09:00 UTC; Lighthouse run local headless Chrome (lab); codebase inventory at commit `909d20f3`.*
