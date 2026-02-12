# Google Search Console Setup

> **Purpose**: Verify site ownership, submit sitemaps, and monitor indexing. Required for SEO visibility and crawl prioritization.

**Last updated**: February 12, 2026

---

## Overview

Google Search Console (GSC) is configured for `https://genosys.ae`. It is separate from Google Analytics (GA4), which handles traffic and user behavior.

---

## Verification

### Method: HTML File Upload

The site is verified using an HTML file placed at the site root:

| File | URL | Purpose |
|------|-----|---------|
| `public/google564054d5967aa69e.html` | `https://genosys.ae/google564054d5967aa69e.html` | GSC ownership verification |

**Important**: Google expects the file at the **root** (`/google564054d5967aa69e.html`), not in a subfolder. The file was initially in `public/seo/` and was moved to `public/` for correct verification.

### Alternative: HTML Meta Tag

If the file method fails, use the HTML tag method in `app/layout.tsx`:

```typescript
verification: {
  google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  // ...
}
```

---

## Sitemap Submission

**Submitted sitemap**: `https://genosys.ae/sitemap.xml`

This dynamic sitemap includes:

- Homepage, about, brand, products, contact, delivery, FAQ, etc.
- All concern pages (`/products/concern/[slug]`) in EN/AR/RU
- All category pages (`/products/category/[slug]`) in EN/AR/RU
- Blog posts, locations, product detail pages
- Full `hreflang` coverage for EN, AR, RU

**How to submit** (if not already done):

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select property `https://genosys.ae/`
3. Indexing → Sitemaps
4. Enter `sitemap.xml` in "Add a new sitemap"
5. Click Submit

---

## Post-Deploy Ping (Optional)

When new content is published (products, blog posts, concern/category pages), you can notify search engines:

```bash
curl -X POST https://genosys.ae/api/admin/ping-search-engines \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

This pings Google, Bing, and Yandex with the sitemap URL.

---

## Structured Data

The site uses JSON-LD structured data for:
- **Organization**, **LocalBusiness** (with aggregateRating)
- **Product** (on product pages, with offers, return policy, shipping)
- **CollectionPage** (concern/category pages, with ItemList)
- **BreadcrumbList**, **FAQPage**, **WebSite**

**Fixes applied (Feb 2026):**
- Removed standalone `AggregateRatingSchema` (invalid root type)
- Removed fake reviews from LocalBusinessSchema
- Replaced `@type: Product` in offer catalogs with `OfferCatalog`/`Service` to avoid "invalid items"
- Product `aggregateRating` disabled until real review system exists

See [SESSION_CHANGES_2026-02-12.md](./SESSION_CHANGES_2026-02-12.md#part-3-structured-data-fixes--google-merchant-center-feed) for details.

---

## Related Tools

| Tool | Purpose |
|------|---------|
| **Google Search Console** | Indexing, sitemaps, coverage, manual actions |
| **Google Analytics (GA4)** | Traffic, events, conversions |
| **Bing Webmaster Tools** | Indexing for Bing (optional) |
| **Yandex Webmaster** | Indexing for Yandex (Russian SEO, optional) |

---

## Troubleshooting

### Verification Fails

- Ensure the file is at `public/google564054d5967aa69e.html` (root, not `/seo/`)
- Wait 1–2 minutes after Vercel deploy
- Click "Verify" again in Search Console

### Sitemap Status "Couldn't fetch"

- Verify `https://genosys.ae/sitemap.xml` loads in browser
- Check Vercel deployment is live
- Retry submission after a few minutes

---

## Related Documentation

- [GOOGLE_MERCHANT_CENTER_FEED.md](./GOOGLE_MERCHANT_CENTER_FEED.md) — Product feed for Merchant Center
- [SEO_CONCERN_LANDING_PAGES.md](./SEO_CONCERN_LANDING_PAGES.md) — Concern/category pages in sitemap
- [SEO_IMPROVEMENTS_SUMMARY.md](./SEO_IMPROVEMENTS_SUMMARY.md) — General SEO overview
- [SESSION_CHANGES_2026-02-12.md](./SESSION_CHANGES_2026-02-12.md) — Structured data fixes (Part 3)
