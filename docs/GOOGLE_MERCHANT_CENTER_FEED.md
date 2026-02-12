# Google Merchant Center Product Feed

> **Purpose**: Dedicated RSS 2.0 XML product feed for Google Merchant Center. Provides a single URL for scheduled fetch — more reliable than website crawling.

**Last updated**: February 12, 2026

---

## Overview

Google Merchant Center can ingest product data either by:
1. **Website crawl** — Automatically extracts product data from structured data (JSON-LD) on your pages
2. **Scheduled fetch** — Pulls a dedicated product feed file from a URL on a schedule

**We use option 2** — a dedicated feed endpoint at `/feed/products.xml` that generates RSS 2.0 compliant XML with all product data.

---

## Feed URL

| URL | Purpose |
|-----|---------|
| `https://genosys.ae/feed/products.xml` | Product data source for Merchant Center |

---

## Implementation

### Route

| File | Type | Description |
|------|------|-------------|
| `app/feed/products.xml/route.ts` | Dynamic API route | Next.js route handler that returns XML |

### Data Source

- **Products**: `getAllProducts()` from `lib/productsDb.ts`
- **Filters**: Excludes `isPriceOnRequest` and `price <= 0` (Merchant Center requires valid prices)
- **Cache**: `Content-Type: application/xml; charset=utf-8`, `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`

---

## RSS 2.0 Fields Per Product

### Required (Google Merchant Center)

| Field | Source | Example |
|-------|--------|---------|
| `g:id` | `product.id` | UUID |
| `g:title` | `product.name` (≤150 chars) | SNOW O₂ CLEANSER |
| `g:description` | `product.description` (≤5000 chars) | Gentle oxygen bubble cleanser... |
| `g:link` | `https://genosys.ae/products/{id}` | Product page URL |
| `g:image_link` | `product.image` (absolute URL) | https://genosys.ae/images/SNOW.jpg |
| `g:price` | `product.price` (AED) | 330.00 AED |
| `g:availability` | `product.inStock` | `in stock` or `out of stock` |
| `g:condition` | Fixed | `new` |
| `g:brand` | Fixed | `GENOSYS` |

### Optional (Included)

| Field | Source | Example |
|-------|--------|---------|
| `g:mpn` | `product.productNumber` or `product.id` | SKU |
| `g:product_type` | `product.category` | Health & Beauty > Skin Care > Cleanser |
| `g:google_product_category` | Fixed | Health & Beauty > Skin Care |
| `g:shipping` | Free to UAE | `g:country=AE`, `g:service=Standard`, `g:price=0.00 AED` |
| `g:additional_image_link` | `product.images` (JSON array, up to 10) | Additional gallery images |
| `g:size` | `product.size` | 180ml |
| `g:title xml:lang="ar"` | `product.nameAr` | Arabic product name |
| `g:title xml:lang="ru"` | `product.nameRu` | Russian product name |

---

## Merchant Center Setup

### Add Feed (Scheduled Fetch)

1. Go to [Google Merchant Center](https://merchants.google.com)
2. **Products & store** → **Products** → **Add product source**
3. Select **Add products from a file** → **Enter a link to your file**
4. Enter URL: `https://genosys.ae/feed/products.xml`
5. **Schedule**: Automatically updates every 24 hours at 12:00 AM
6. **Authentication**: Not required (feed is public)
7. **Country**: United Arab Emirates
8. **Language**: English

### Verify Feed

- After first fetch, Merchant Center shows "Product update history" with total products updated and new products added
- Check **Needs attention** for any items with validation issues

---

## Excluded Products

| Condition | Reason |
|-----------|--------|
| `isPriceOnRequest === true` | Merchant Center requires valid price |
| `price <= 0` | Invalid price |
| `isHidden === true` | Not included in `getAllProducts()` |

---

## robots.txt

A comment in `public/robots.txt` documents the feed URL for reference:

```
# Google Merchant Center Product Feed
# Add this URL in Merchant Center > Products > Feeds > Scheduled fetch
# Feed: https://genosys.ae/feed/products.xml
```

The feed itself is not listed as a Sitemap — Google Merchant Center uses scheduled fetch, not sitemap discovery.

---

## Spec Reference

- **RSS 2.0 spec**: [Google Merchant Center RSS 2.0](https://support.google.com/merchants/answer/14987622)
- **Product data spec**: [Product data specification](https://support.google.com/merchants/answer/7052112)
- **Namespace**: `xmlns:g="http://base.google.com/ns/1.0"`

---

## Related Documentation

- [GOOGLE_SEARCH_CONSOLE_SETUP.md](./GOOGLE_SEARCH_CONSOLE_SETUP.md) — Search Console verification, sitemap, structured data
- [SEO_CONCERN_LANDING_PAGES.md](./SEO_CONCERN_LANDING_PAGES.md) — Concern/category pages, product grid
- [SESSION_CHANGES_2026-02-12.md](./SESSION_CHANGES_2026-02-12.md) — Structured data fixes, Merchant Center feed (Part 3)
