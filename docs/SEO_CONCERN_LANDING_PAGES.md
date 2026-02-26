# SEO Concern & Category Landing Pages

> **Purpose**: Condition-based landing pages for Google rankings, AI search citation (GEO), and internal link equity. Optimized for keywords like "sun protection UAE", "acne treatment Dubai", "pigmentation skincare", etc.

**Last updated**: February 26, 2026

---

## Overview

The cosmetics website includes dedicated SEO landing pages for skin concerns and product categories. These pages are available on **web and native app**:

- **Website**: Full concern pages with product grids, routines, FAQs, protocol PDFs
- **Native app**: "Skin Concern" category pill → native card grid (`app/skin-concerns.js`) → tapping a card opens the website concern page in WebView
- **Chatbot (Genie)**: Trained to link concern pages in responses (see `lib/chatbot/config.ts`)
- **Skin analysis results**: "Browse by Skin Concern" CTA links to concern pages after product recommendations

### Key URLs

| Type | Base Path | Example |
|------|----------|---------|
| Skin Concern | `/products/concern/[slug]` | `/products/concern/sun-protection` |
| Product Category | `/products/category/[slug]` | `/products/category/serum` |

Both have localized variants: `/ar/...` and `/ru/...`.

---

## Concern Pages (8 total)

| Slug | H1 (EN) |
|------|---------|
| `sun-protection` | Sun Protection for UAE Climate |
| `acne-treatment` | Acne & Blemish Treatment |
| `pigmentation` | Pigmentation & Skin Brightening Treatment |
| `scars-treatment` | Scar Treatment & Skin Repair |
| `hair-loss` | Hair Loss Treatment & Scalp Care |
| `anti-aging` | Anti-Aging & Wrinkle Treatment |
| `hydration` | Hydrating Skincare for Dry UAE Climate |
| `sensitivity` | Sensitive Skin Care & Soothing Treatment |

Each concern page includes:
- SEO metadata (title, description, H1, intro, keywords) in EN/AR/RU
- FAQ section with `FAQPage` schema for AI citation (GEO)
- Product grid filtered by concern (collapsible, curated via page-specific concern keys, 4-8 products each)
- "Why" section — collapsible on all screen sizes (desktop, mobile web, PWA) with chevron toggle
- Embedded AM/PM skincare routine with interactive product chips (tap to add to cart)
- **"Start Your Routine Today" CTA** — View Bag button (cart-aware, shows item count) + AI Skin Analysis link (`ConcernCTA.tsx`)
- Protocol PDF download card (collapsible "Documentation" section, header matches "Why" section size)
- Related concerns cross-links (horizontal scroll on mobile, grid on desktop)
- Breadcrumb schema
- Sticky cart bar on mobile (replaces mobile footer navigation on concern pages)

> **Removed (Feb 26, 2026):** "Complete Your Routine" essentials section (cleanser, booster, SPF cards). Replaced by the CTA block above. `ConcernEssentialPrice.tsx` is now unused.

### Product Curation Strategy (Feb 19, 2026)

Products are filtered using **page-specific concern keys** (`page-acne`, `page-pigmentation`, `page-anti-aging`, `page-hydration`, `page-sensitivity`, `scar-repair`) in `GENOSYS_PRODUCT_CONCERNS` mapping (`lib/productsDb.ts`). These narrow keys ensure landing pages show only 4-8 highly relevant products. Generic concern keys (e.g., `anti-aging`, `hydration`) remain for the skin analysis scoring system.

### Native App Integration (Feb 19, 2026)

The native app (`genosys-mobile-app`) includes a native Skin Concerns screen at `app/skin-concerns.js`:
- Accessed via "Skin Concern" category pill in shop (with NEW badge)
- Also accessible via 🌿 highlight button in navigation drawer
- Deep links: `skin-concerns`, `products/concern`
- 2-column card grid with 8 concern cards (icon, title, description, "Explore" link)
- Tapping a card opens the website concern page in the in-app WebView
- Full EN/AR/RU + RTL support

---

## Category Pages (14 total)

| Slug | H1 (EN) |
|------|---------|
| `microneedling` | Microneedling Devices |
| `pro-solution` | Pro Solution |
| `cleanser` | Cleanser |
| `peeling` | Peeling |
| `toner-mist` | Toner & Mist |
| `serum` | Serum |
| `cream` | Cream |
| `mask` | Mask |
| `sun` | Sun Protection |
| `cushion-bb` | Cushion & BB Cream |
| `scalp-hair` | Scalp & Hair |
| `eye-care` | Eye Care |
| `device` | Device |
| `bio-meso` | Bio Meso |

Each category page includes:
- SEO metadata in EN/AR/RU
- Product grid filtered by category
- Breadcrumb schema

---

## File Structure

```
cosmetics-website/
├── lib/
│   ├── concernsData.ts        # Data: SEO, FAQs, slugs, mappings
│   └── productsDb.ts          # getProductsByConcern(), getProductsByCategory()
├── app/
│   ├── products/
│   │   ├── concern/[slug]/page.tsx
│   │   └── category/[slug]/page.tsx
│   ├── ar/products/
│   │   ├── concern/[slug]/page.tsx
│   │   └── category/[slug]/page.tsx
│   └── ru/products/
│       ├── concern/[slug]/page.tsx
│       └── category/[slug]/page.tsx
├── components/
│   ├── ConcernProductGrid.tsx   # Server-rendered product grid
│   ├── ConcernProductPrice.tsx  # Client: user-discounted prices
│   └── ConcernAddToCart.tsx      # Client: add to cart button
└── public/
    ├── llms.txt                 # AI crawler guidance (lists concern/category URLs)
    └── robots.txt               # Allow: /products/concern/, /products/category/
```

---

## Components

### ConcernProductGrid

**Type**: Server component (with client children)

- Renders product cards in a responsive grid (2/3/4 columns)
- Uses `ConcernProductPrice` (client) for price display with user discounts
- Uses `ConcernAddToCart` (client) for add-to-cart
- Displays product name, description (2-line clamp), category, size, stock status
- Localized for EN/AR/RU
- Hover: product name turns `primary-600` (brand red)

### ConcernProductPrice

**Type**: Client component

- Uses `useAuth()` to get the current user
- Calls `calculateDiscountedPrice(product, user)` from `lib/discountUtils.ts`
- Shows discounted price + strikethrough original + "50% OFF" badge when applicable
- Falls back to base price for guests (SSR/crawlers see base price)
- Handles "Price on Request" products

### ConcernAddToCart

**Type**: Client component

- Uses `useCart()` and `useAuth()`
- Adds item directly to cart on click (no navigation)
- `e.preventDefault()` + `e.stopPropagation()` so card link still works
- Shows brief "Added!" confirmation feedback
- Only visible for logged-in users
- Hidden for "Price on Request" products
- Shows "Sold Out" for out-of-stock items

---

## Shop by Skin Concern Block

**Location**: `/products`, `/ar/products`, `/ru/products`

A section at the bottom of the products listing page with links to all 8 concern pages.

**Visibility**:
- **Desktop/tablet** (640px+): Visible — `sm:block`
- **Mobile web**: Hidden — `hidden` to reduce clutter
- **Crawlers**: Still in DOM, so links remain indexable for SEO

**Design** (corporate colors):
- Section background: `bg-primary-50`
- Border: `border-primary-100`
- Card borders: `border-primary-100`, hover `border-primary-300`
- Card hover text: `group-hover:text-primary-600`
- Layout: centered (`text-center`)

---

## Product Matching Logic

### getProductsByConcern(concernKeys, categoryFallbacks)

Products are included if:

1. **Target concerns**: `product.targetConcerns` (JSON array) contains any of `concernKeys`
2. **Curated mappings**: `GENOSYS_PRODUCT_CONCERNS[product.name]` includes any of `concernKeys`
3. **Category fallback**: `product.category` matches any of `categoryFallbacks`, or is a substring of it

### getProductsByCategory(slug)

Products are included if:

- `product.category` (normalized) matches the category slug or category name

---

## Structured Data

- **BreadcrumbSchema**: On all concern and category pages
- **CollectionPageSchema**: On concern/category pages when products exist
- **GeoFaqSchema**: On concern pages only (FAQPage schema for AI citation)

---

## Sitemap & Crawlers

- **Sitemap**: All concern and category URLs added to `/sitemap.xml` with `hreflang` for EN/AR/RU
- **llms.txt**: "Shop by Skin Concern" and "Product Categories" sections added with URLs
- **robots.txt**: `Allow: /products/concern/` and `Allow: /products/category/`

---

## Design System Compliance

- **Colors**: All interactive elements use `primary-*` (brand red `#dc2626`), not blue
- **Product card hover**: `group-hover:text-primary-600`
- **Shop by Skin Concern**: `bg-primary-50`, `border-primary-*`, `text-primary-600` on hover

---

## Native App Risk

**Zero risk.** The concern/category landing pages and their components are:

- Web-only
- Not loaded by the native app
- Do not modify any API endpoints
- Use existing `useCart`, `useAuth`, `calculateDiscountedPrice` — no changes to their logic

The native app uses its own product browsing flow and communicates with the website only via API endpoints, which are unchanged.

---

## Adding a New Concern or Category

1. **For concerns**: Add entry to `CONCERN_PAGES` in `lib/concernsData.ts` with slug, seo, faq, concernKeys, categoryFallbacks, relatedConcerns
2. **For categories**: Add entry to `CATEGORY_PAGES` in `lib/concernsData.ts` with slug and seo (EN/AR/RU)
3. **Sitemap**: `generateStaticParams` in the page routes auto-generates from `CONCERN_PAGES` / `CATEGORY_PAGES` — no changes needed
4. **llms.txt**: Add manual entry if desired
5. **Shop by Skin Concern block**: Only concerns appear here; `CONCERN_PAGES` is used directly

---

## Related Documentation

- [SEO_IMPROVEMENTS_SUMMARY.md](./SEO_IMPROVEMENTS_SUMMARY.md) - General SEO overview
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Corporate colors (primary-600)
- [PRICING_DISCOUNT_AUDIT.md](./PRICING_DISCOUNT_AUDIT.md) - Discount logic reference
