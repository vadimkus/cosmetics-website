# SEO Checklist & Monitoring Guide

## Overview

This document covers all SEO implementations for genosys.ae, including structured data schemas, multilingual SEO configuration, and testing/monitoring procedures.

**Last Updated:** February 2026  
**Languages:** English (default), Arabic (RTL), Russian  
**Domain:** https://genosys.ae

---

## 1. Structured Data (JSON-LD Schemas)

### Global Schemas (on every page via root layout)

| Schema | Component | Location | Purpose |
|--------|-----------|----------|---------|
| WebSite | `WebSiteSchema.tsx` | `components/schema/` | Sitelinks search box, multilingual site info |
| Organization | `OrganizationSchema.tsx` | `components/schema/` | Company info, contact points, credentials |
| LocalBusiness | `LocalBusinessSchema.tsx` | `components/schema/` | Local SEO for Dubai/UAE |
| AggregateRating | `AggregateRatingSchema.tsx` | `components/schema/` | Overall business rating |

### Page-Specific Schemas

| Schema | Component | Used On | Purpose |
|--------|-----------|---------|---------|
| Product | `ProductSchema.tsx` | `/products/[id]` | Product rich snippets (price, availability, shipping, returns) |
| BreadcrumbList | `BreadcrumbSchema.tsx` | All pages | Breadcrumb navigation in search results |
| ProductsList | `ProductsListSchema.tsx` | `/products` | Product collection markup |
| CollectionPage | `CollectionPageSchema.tsx` | `/products`, category pages | Product carousel in search results |
| HowTo | `HowToSchema.tsx` | Blog/guide pages | Step-by-step skincare routine rich snippets |
| Speakable | `SpeakableSchema.tsx` | Homepage (all 3 langs) | Voice search optimization (Google Assistant) |
| ArticleDate | `ArticleDateSchema.tsx` | Homepage, blog, about | datePublished/dateModified for AI Overviews |
| Partners | `PartnersSchema.tsx` | `/partners` | Partner organizations |
| Blog/BlogPosting | Inline in page | `/blog`, `/blog/[slug]` | Article rich snippets |
| FAQPage | Inline in page | `/faq` | FAQ rich snippets |

### Dynamic OG Images

Product pages (`/products/[id]`) auto-generate social media preview images with:
- Product photo, name, price, availability badge
- "Free Shipping UAE" badge
- GENOSYS branding
- Files: `app/products/[id]/opengraph-image.tsx`, `app/products/[id]/twitter-image.tsx`

### Testing Structured Data

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
   - Test each page type: homepage, product page, blog post, FAQ
   - Test all 3 language versions

2. **Schema Markup Validator**: https://validator.schema.org/
   - Paste the page URL or JSON-LD code
   - Check for errors and warnings

3. **Google Search Console**: Check "Enhancements" section for:
   - Product snippets
   - FAQ snippets
   - Breadcrumbs
   - Sitelinks search box

---

## 2. Multilingual SEO Configuration

### URL Structure

```
https://genosys.ae/          → English (default)
https://genosys.ae/ar/       → Arabic (RTL)
https://genosys.ae/ru/       → Russian
```

### Hreflang Implementation

Hreflang tags are implemented in **two places**:

1. **HTML `<head>`** via Next.js `metadata.alternates.languages`:
   - Every page has `en`, `ar`, `ru`, and `x-default` alternates
   - Generated via `buildAlternates()` in `lib/seo.ts`

2. **XML Sitemap** (`/sitemap.xml`):
   - Every URL has `xhtml:link` tags for all 3 languages + x-default
   - Bidirectional: each language version points to all others

### Verifying Hreflang

1. **Ahrefs Hreflang Checker**: https://ahrefs.com/hreflang-checker
2. **Manual Check**: View page source and search for `hreflang`
3. **Google Search Console**: Check "International Targeting" report

### Locale Detection Middleware

File: `middleware.ts` at project root

- Detects locale from `Accept-Language` header on first visit
- Stores preference in `NEXT_LOCALE` cookie (1 year)
- Redirects AR/RU speakers to their language version
- Only redirects on homepage (deep links are not redirected to preserve shared URLs)

---

## 3. Technical SEO Files

### robots.txt (`public/robots.txt`)

- Allows all public content including `/ar/` and `/ru/`
- Allows SEO tools (Ahrefs, Semrush) for monitoring
- Blocks admin, API, private areas, cart, checkout
- References both sitemaps

### Sitemap (`/sitemap.xml`)

Dynamic sitemap generated from:
- Static pages (with multilingual hreflang)
- Product pages (from database)
- Blog posts (from database, with real `lastmod` dates)
- Location pages (all 7 UAE emirates)
- SEO-optimized redirect URLs

Cache: 1 hour (s-maxage=3600), stale-while-revalidate 24h

### Meta Tags

Root layout includes:
- Title, description, keywords
- OpenGraph (with absolute image URLs)
- Twitter Card
- Geo-targeting (`geo.region: AE-DU`, `geo.placename: Dubai`, ICBM coordinates)
- Canonical URLs with hreflang alternates

---

## 4. Fonts & Performance

### Font Loading

| Font | Purpose | Subsets |
|------|---------|--------|
| Inter | Default (Latin/Cyrillic) | latin, latin-ext, cyrillic |
| Noto Sans Arabic | Arabic pages | arabic |

Both fonts use:
- `display: swap` for performance
- CSS variable approach (`--font-inter`, `--font-arabic`)
- Preload enabled

### Arabic Font Application

Arabic font is applied via CSS when `html[lang="ar"]`:
```css
html[lang="ar"],
html[lang="ar"] body {
  font-family: var(--font-arabic, "Noto Sans Arabic"), "Tahoma", "Arial", sans-serif;
}
```

---

## 5. Security Headers (via Middleware)

| Header | Value | Purpose |
|--------|-------|---------|
| X-Frame-Options | SAMEORIGIN | Prevent clickjacking |
| X-Content-Type-Options | nosniff | Prevent MIME sniffing |
| Referrer-Policy | strict-origin-when-cross-origin | Privacy + SEO referrer data |
| X-XSS-Protection | 1; mode=block | Legacy XSS protection |
| X-DNS-Prefetch-Control | on | Faster DNS resolution |
| Permissions-Policy | camera=(), microphone=(), etc. | Restrict permissions |

---

## 6. SEO Monitoring Checklist

### Weekly Tasks

- [ ] Check Google Search Console for crawl errors
- [ ] Review Core Web Vitals in Search Console
- [ ] Check for any manual actions or security issues
- [ ] Monitor keyword rankings for target terms

### Monthly Tasks

- [ ] Run Google Rich Results Test on key pages
- [ ] Validate sitemap with Google Search Console
- [ ] Check hreflang implementation with Ahrefs checker
- [ ] Review organic traffic by language in Google Analytics
- [ ] Check for broken links (404 errors)
- [ ] Monitor page indexation status

### Quarterly Tasks

- [ ] Full technical SEO audit
- [ ] Competitor keyword analysis
- [ ] Content gap analysis
- [ ] Backlink profile review
- [ ] Schema markup validation across all pages

---

## 7. Search Engine Verification

### Setup Steps (One-Time)

1. **Google Search Console**:
   - Go to https://search.google.com/search-console
   - Add property `https://genosys.ae`
   - Verify via DNS TXT record (recommended) or HTML meta tag
   - Uncomment `google-site-verification` in `app/layout.tsx` metadata
   - Submit sitemaps: `/sitemap.xml` and `/sitemap-index.xml`

2. **Bing Webmaster Tools**:
   - Go to https://www.bing.com/webmasters
   - Import from Google Search Console (easiest)
   - Or verify via DNS/meta tag
   - Uncomment `msvalidate.01` in `app/layout.tsx` metadata

3. **Yandex Webmaster** (important for Russian-speaking audience):
   - Go to https://webmaster.yandex.com
   - Add site and verify via DNS/meta tag
   - Uncomment `yandex-verification` in `app/layout.tsx` metadata
   - Submit sitemap
   - Set target region if needed

---

## 8. Target Keywords by Language

### English Keywords
- Korean dermacosmetics UAE
- GENOSYS Dubai
- Professional skincare Dubai
- Microneedling devices UAE
- Korean beauty products UAE
- K-beauty UAE

### Arabic Keywords (الكلمات المفتاحية)
- مستحضرات التجميل الكورية الإمارات
- GENOSYS دبي
- العناية بالبشرة المهنية دبي
- أجهزة الوخز بالإبر الدقيقة الإمارات
- منتجات الجمال الكورية الإمارات

### Russian Keywords (Ключевые слова)
- Корейская дерматокосметика ОАЭ
- GENOSYS Дубай
- Профессиональный уход за кожей Дубай
- Устройства для микронидлинга ОАЭ
- Корейская косметика ОАЭ

---

## 9. AI Search & Generative Engine Optimization (GEO)

### What is GEO?

GEO (Generative Engine Optimization) optimizes content for AI search engines — ChatGPT, Perplexity, Google AI Overviews, Claude — so they cite your website in their responses. This is separate from traditional SEO and is a critical emerging channel.

**Impact stats:**
- AI-referred traffic jumped 527% in 2025-2026
- FAQ schemas increase AI citation likelihood by 3x
- Answer-first content format achieves 60% more citations
- Only 2-7 sources are cited per AI response (vs 10 in traditional search)

### llms.txt File

**Location:** `public/llms.txt`

A curated markdown file that tells AI crawlers (ChatGPT, Claude, Perplexity, Gemini) exactly what your site is about. Think of it as a "welcome mat" for AI systems. Only ~840 websites globally have this — first-mover advantage.

**Contents:**
- Company description and key facts
- Links to products, policies, locations, educational content
- Available languages (EN, AR, RU)
- Sitemap references

### AI Bots Allowed (robots.txt)

| Bot | Platform | Purpose |
|-----|----------|---------|
| GPTBot | OpenAI | ChatGPT training + search |
| ChatGPT-User | OpenAI | User-triggered browsing |
| PerplexityBot | Perplexity | AI search citations |
| ClaudeBot | Anthropic | Claude AI |
| anthropic-ai | Anthropic | Claude training |
| Applebot | Apple | Siri, Apple Intelligence |
| Applebot-Extended | Apple | Extended AI features |
| Amazonbot | Amazon | Alexa, product recommendations |
| Meta-ExternalAgent | Meta | Meta AI assistant |
| CCBot | Common Crawl | Used by many AI systems |
| DeepSeekBot | DeepSeek | DeepSeek AI |
| cohere-ai | Cohere | Cohere AI |
| Google-Extended | Google | Google AI / Gemini |
| GoogleOther | Google | Additional Google crawling |
| Bravebot | Brave | Brave Search |

All AI bots are allowed public content but blocked from `/admin/`, `/api/`, `/profile/`, `/cart/`, `/checkout/`.

### GEO FAQ Schema

**Component:** `components/schema/GeoFaqSchema.tsx`

Answer-first FAQ structured data optimized for AI citation. Deployed on:

| Page | Language | FAQ Set |
|------|----------|---------|
| `/` | English | `GENOSYS_FAQ_EN` (5 Q&As) |
| `/ar` | Arabic | `GENOSYS_FAQ_AR` (3 Q&As) |
| `/ru` | Russian | `GENOSYS_FAQ_RU` (3 Q&As) |
| `/faq` | English | `GENOSYS_FAQ_EN` |
| `/ar/faq` | Arabic | `GENOSYS_FAQ_AR` |
| `/ru/faq` | Russian | `GENOSYS_FAQ_RU` |

### Search Engine Ping API

**Endpoint:** `POST /api/admin/ping-search-engines`

Notifies Google, Bing, and Yandex when you publish new content. Call after adding products, blog posts, or major page changes.

```bash
curl -X POST https://genosys.ae/api/admin/ping-search-engines \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "New product added"}'
```

### Google Verification

Verification fields are prepared in `app/layout.tsx` metadata. To activate:

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property `https://genosys.ae`
3. Choose "HTML tag" verification method
4. Copy the verification code
5. Uncomment and fill in `verification.google` in `app/layout.tsx`

Repeat for:
- [Bing Webmaster Tools](https://www.bing.com/webmasters) → `msvalidate.01`
- [Yandex Webmaster](https://webmaster.yandex.com) → `verification.yandex`

### GEO Content Best Practices

For maximum AI citation, all content should follow these principles:

1. **Answer-first format** — Lead paragraphs with the direct answer, then expand
2. **Clear headings** — Use descriptive H2/H3 with question format where possible
3. **Numbered lists** — AI systems prefer structured, scannable content
4. **Statistics and data** — Include specific numbers (prices, delivery times, emirates)
5. **Author/brand attribution** — Always reference "GENOSYS Middle East FZ-LLC"
6. **Update regularly** — Fresh content with recent dates gets prioritized

---

## 10. Key SEO Files Reference

```
cosmetics-website/
├── middleware.ts                          # Locale detection, security headers
├── public/
│   ├── robots.txt                        # Crawler directives (AI bots allowed)
│   └── llms.txt                          # AI crawler content guide (GEO)
├── app/
│   ├── layout.tsx                        # Root metadata, geo tags, fonts, verification
│   ├── sitemap.xml/route.ts              # Dynamic multilingual sitemap
│   ├── sitemap-index.xml/route.ts        # Sitemap index
│   ├── page.tsx                          # Homepage (EN) + GEO FAQ
│   ├── ar/page.tsx                       # Homepage (AR) + GEO FAQ
│   ├── ru/page.tsx                       # Homepage (RU) + GEO FAQ
│   └── api/admin/
│       └── ping-search-engines/route.ts  # Google/Bing/Yandex sitemap ping
├── components/schema/
│   ├── WebSiteSchema.tsx                 # Site + SearchAction
│   ├── OrganizationSchema.tsx            # Company info
│   ├── LocalBusinessSchema.tsx           # Local business
│   ├── AggregateRatingSchema.tsx         # Ratings
│   ├── ProductSchema.tsx                 # Product pages (Merchant Center enhanced)
│   ├── BreadcrumbSchema.tsx              # Breadcrumbs
│   ├── ProductsListSchema.tsx            # Product listings
│   ├── GeoFaqSchema.tsx                  # AI-optimized FAQ (EN/AR/RU)
│   ├── SpeakableSchema.tsx               # Voice search optimization
│   ├── HowToSchema.tsx                   # Step-by-step guides
│   ├── CollectionPageSchema.tsx          # Category carousel results
│   ├── ArticleDateSchema.tsx             # Date signals for AI Overviews
│   └── PartnersSchema.tsx                # Partners
├── lib/
│   ├── seo.ts                            # SEO helper utilities
│   ├── siteConfig.ts                     # Site URL, social links
│   └── i18n.ts                           # Internationalization utilities
└── messages/
    ├── en.json                           # English translations
    ├── ar.json                           # Arabic translations
    └── ru.json                           # Russian translations
```
