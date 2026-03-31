# Session Changes — March 30, 2026 (Part 3)

## FAQ Page Overhaul — Categories, Search, Mobile App FAQs

### What Changed

Complete redesign of the FAQ page with best-practice UX patterns, category grouping, search, and new Mobile App FAQ items. Changes deployed across all three platforms: website, iOS app, and Android app.

**Commit**: `e25366b3` — `feat: FAQ page overhaul — categories, search, mobile app FAQs`

---

### 1. Database Schema — Category Column

Added a `category` column to the `faq_items` table for grouping FAQs into sections.

| Detail | Value |
|--------|-------|
| Column | `category TEXT` (nullable) |
| Index | `faq_items_category_idx` |
| Migration | `prisma/migrations/20260330_add_faq_category/migration.sql` |
| Applied | Direct SQL via `prisma db execute` (production DB has no migration history table) |

**Category values:**

| Category | Label (EN) | Icon (Web) | Icon (Native) |
|----------|-----------|------------|---------------|
| `general` | About GENOSYS | `Store` | `storefront-outline` |
| `products` | Products | `Sparkles` | `sparkles-outline` |
| `orders` | Orders & Payment | `CreditCard` | `card-outline` |
| `shipping` | Shipping | `Truck` | `car-outline` |
| `app` | Mobile App | `Smartphone` | `phone-portrait-outline` |
| `account` | Account & Support | `UserCircle` | `person-outline` |

Category labels are localized inline (EN/AR/RU) in both the website and native app code.

---

### 2. Seed Script — Categories + App FAQ Items

**Script**: `scripts/seed-faq-categories.js`

Run with: `DATABASE_URL="..." node scripts/seed-faq-categories.js`

The script:
1. **Categorizes all 18 existing FAQ items** by matching question text to keywords
2. **Creates 4 new Mobile App FAQ items** with full EN/AR/RU translations:

| # | Question | Category |
|---|----------|----------|
| 19 | Does GENOSYS have a mobile app? | `app` |
| 20 | How do I download the GENOSYS app? | `app` |
| 21 | What features does the GENOSYS app offer? | `app` |
| 22 | Is the GENOSYS app free? | `app` |

**Final state**: 22 FAQ items, all categorized, all active.

App FAQ answers include:
- Direct links to App Store and Google Play (HTML `<a>` tags)
- Feature list with `<strong>` formatting
- `<br/>` tags for spacing (stripped to plain text in native apps)

---

### 3. Website — FAQClient Redesign

**File**: `app/faq/FAQClient.tsx` — 402 lines rewritten

#### New Features

| Feature | Description |
|---------|-------------|
| **Search bar** | Real-time text filtering across all questions and answers. Clears category filter on search. |
| **Category tab pills** | Horizontal scrollable pills: All, About GENOSYS, Products, Orders & Payment, Shipping, Mobile App, Account & Support. Only shows categories that have items. |
| **Category section headers** | When "All" is selected, FAQs are grouped under labeled sections with icon + divider line. |
| **Expand All / Collapse All** | Toggle button in toolbar to open/close all visible FAQs at once. |
| **Result count** | Shows "X questions" or "X results" with search context. |
| **Empty state** | "No results found" with clear search button when nothing matches. |
| **Multi-open accordion** | Multiple FAQs can be open simultaneously (was single-open). Uses `Set<string>` of open IDs. |
| **App download banner** | Dark gradient banner with App Store + Google Play badges (inline SVGs matching Hero.tsx). Localized in EN/AR/RU. |
| **Russian locale CTA** | "Still have questions?" section now has proper Russian text (was English-only). WhatsApp pre-fill message also in Russian. |

#### Category Filter Behavior

- **"All" tab** (default): Shows all FAQs grouped by category with section headers
- **Specific tab**: Shows only that category's items, no section header (redundant)
- **Search**: Resets category to "All", filters across all items
- **Tab change**: Clears expanded items and expand-all state

---

### 4. Website — GeoFaqSchema (SEO)

**File**: `components/schema/GeoFaqSchema.tsx`

Added mobile app FAQs to the structured data schemas for AI citation (GEO — Generative Engine Optimization):

| Language | Items Added |
|----------|-------------|
| `GENOSYS_FAQ_EN` | +3 items (app existence, download instructions, features) |
| `GENOSYS_FAQ_AR` | +2 items (app existence, download instructions) |
| `GENOSYS_FAQ_RU` | +2 items (app existence, download instructions) |

---

### 5. Website — Admin Panel

**File**: `components/admin/AdminFaqManager.tsx`

| Change | Description |
|--------|-------------|
| Category dropdown | Added to create/edit forms (6 categories + "No category") |
| Category badge | Shown as colored pill on each FAQ item in the list view |
| API support | Create + update payloads now include `category` field |

---

### 6. Website — API Updates

| File | Change |
|------|--------|
| `app/api/admin/faq-items/route.ts` | POST accepts `category` field |
| `app/api/admin/faq-items/[id]/route.ts` | PUT accepts `category` field |
| `app/api/mobile/faq/route.ts` | Response includes `category` per item (defaults to `'general'`) |

**Mobile FAQ API response (updated):**

```json
{
  "items": [
    {
      "id": 1,
      "category": "general",
      "question": "What is GENOSYS?",
      "answer": "..."
    }
  ],
  "total": 22,
  "locale": "en"
}
```

---

### 7. Website — Server Pages

All 3 FAQ pages updated to include `category` in the Prisma select:

| File | Language |
|------|----------|
| `app/faq/page.tsx` | English |
| `app/ar/faq/page.tsx` | Arabic |
| `app/ru/faq/page.tsx` | Russian |

SEO metadata on the English page updated:
- Description mentions "mobile app"
- Keywords: `GENOSYS app`, `GENOSYS mobile app`, `GENOSYS iOS app`, `GENOSYS Android app`

---

### 8. Website — Translations

| File | Change |
|------|--------|
| `messages/en.json` | `faq.description` — added "our mobile app" |
| `messages/ar.json` | `faq.description` — added "تطبيق الجوال" |
| `messages/ru.json` | `faq.description` — added "мобильном приложении" |

---

### 9. Native App — FAQ Screen with Categories

**File**: `genosys-mobile-app/app/faq.js` — Full rewrite

| Feature | Before | After |
|---------|--------|-------|
| Layout | Flat accordion list | Grouped by category with section headers |
| Search | None | Search bar with real-time filtering |
| Categories | Ignored `category` field | Section headers with icon + label + divider |
| Accordion | Single-open (`expandedId`) | Multi-open (`expandedIds` object) |
| HTML handling | Pass-through (broken) | Strips `<br/>` and HTML tags to plain text |
| Empty state | None | "No results found" with clear button |
| Item count | 18 | 22 (including 4 new app FAQs) |

---

### 10. Native App — Help Screen API Migration

**File**: `genosys-mobile-app/app/profile/help.js`

| Before | After |
|--------|-------|
| 17 static FAQ items from `i18n/messages/*.json` | Fetches from `GET /api/mobile/faq` |
| Required OTA update to change FAQ content | FAQ updates are instant (server-side) |
| Out of sync with website FAQ | Single source of truth |

Added:
- `fetchFAQ()` with `AUTH_CONFIG.API_KEY` + locale header
- Loading spinner while fetching
- Retry on tap if API fails
- HTML tag stripping for answer rendering

---

### 11. OTA Deployment

Pushed via EAS Update (OTA) to the `production` channel:

| Platform | Update Group ID | Status |
|----------|----------------|--------|
| Android | `0c33c29e-d601-4790-a55d-8de23361658b` | Live |
| iOS | `a8331920-a500-486b-b04d-f133a96d2566` | Live |

Message: "FAQ: category grouping, search, app FAQ from website API"

---

### Architecture: Single Source of Truth for FAQ

```
┌───────────────────────────────────────────────────┐
│              faq_items database table               │
│  22 items × 3 languages × 6 categories             │
│  Managed via Admin Dashboard → FAQ tab              │
└──────┬─────────────────┬──────────────────┬────────┘
       │                 │                  │
 ┌─────▼──────┐  ┌───────▼────────┐  ┌─────▼─────────┐
 │  Website   │  │  Mobile Apps   │  │  SEO Schema   │
 │  /faq      │  │  /faq screen   │  │  GeoFaqSchema │
 │  (SSR +    │  │  /profile/help │  │  (static for  │
 │  client)   │  │  (API fetch)   │  │  AI citation) │
 └────────────┘  └────────────────┘  └───────────────┘
```

> **Note**: The GeoFaqSchema (`components/schema/GeoFaqSchema.tsx`) has static FAQ arrays for SEO structured data. These are separate from the database and should be manually updated when adding significant new FAQ topics. The database is the canonical source; the schema arrays are optimized subsets for AI/search engine citation.

---

### Files Changed (14 files)

| File | Change |
|------|--------|
| `prisma/schema.prisma` | Added `category String?` + `@@index([category])` to FaqItem |
| `prisma/migrations/20260330_add_faq_category/migration.sql` | ALTER TABLE + CREATE INDEX |
| `app/faq/FAQClient.tsx` | Full rewrite — search, categories, expand/collapse, app banner |
| `app/faq/page.tsx` | Added `category` to select, updated SEO metadata |
| `app/ar/faq/page.tsx` | Added `category` to select |
| `app/ru/faq/page.tsx` | Added `category` to select |
| `components/schema/GeoFaqSchema.tsx` | Added app FAQs to EN (3), AR (2), RU (2) |
| `components/admin/AdminFaqManager.tsx` | Category dropdown, badge, payload |
| `app/api/admin/faq-items/route.ts` | POST accepts `category` |
| `app/api/admin/faq-items/[id]/route.ts` | PUT accepts `category` |
| `app/api/mobile/faq/route.ts` | Response includes `category` |
| `messages/en.json` | FAQ description mentions mobile app |
| `messages/ar.json` | FAQ description mentions mobile app |
| `messages/ru.json` | FAQ description mentions mobile app |
| `scripts/seed-faq-categories.js` | Seed script (categories + 4 app FAQ items) |

### Native App Files Changed (2 files)

| File | Change |
|------|--------|
| `genosys-mobile-app/app/faq.js` | Full rewrite — categories, search, multi-expand, HTML stripping |
| `genosys-mobile-app/app/profile/help.js` | Static FAQ → API-driven FAQ fetch |

---

### Summary

| Change | Platform | Deployment |
|--------|----------|------------|
| FAQ page: categories, search, expand/collapse, app banner | Website | Vercel (`e25366b3`) |
| 4 new Mobile App FAQ items (EN/AR/RU) | Database | Seed script |
| FAQ category column (`faq_items.category`) | Database | Direct SQL |
| Admin: category dropdown + badge | Website | Vercel |
| Mobile API: `category` in response | Website API | Vercel |
| GeoFaqSchema: app FAQs for SEO | Website | Vercel |
| FAQ screen: categories, search, grouping | iOS + Android | EAS OTA |
| Help screen: static → API-driven FAQ | iOS + Android | EAS OTA |
