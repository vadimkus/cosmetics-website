# Session Changes - February 10, 2026

## FAQ Database Migration & Admin Management

### Summary
Moved FAQ content from static translation files to a proper database table (`faq_items`) with full admin CRUD management. Updated delivery timings and pricing per emirate. Added account deletion FAQ. Both the website and native mobile app now read FAQ data from the database — update once in admin, changes appear everywhere automatically.

### Database Changes

**New Prisma Model: `FaqItem`** (`prisma/schema.prisma`)

```prisma
model FaqItem {
  id          String   @id @default(cuid())
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
  questionEn  String
  answerEn    String   @db.Text
  questionAr  String?
  answerAr    String?  @db.Text
  questionRu  String?
  answerRu    String?  @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  @@index([isActive, sortOrder])
  @@map("faq_items")
}
```

**Seeded Data:** 18 FAQ items in all 3 languages (EN, AR, RU)

### New API Endpoints

#### Mobile FAQ API
**Endpoint:** `GET /api/mobile/faq`  
**File:** `app/api/mobile/faq/route.ts`

| Header | Required | Description |
|--------|----------|-------------|
| `x-api-key` | Yes | Mobile app API key |
| `x-locale` | No | `en` / `ar` / `ru` (default: `en`) |

**Response:**
```json
{
  "title": "FAQ",
  "subtitle": "Frequently Asked Questions",
  "description": "Find answers to common questions...",
  "items": [
    { "id": 1, "question": "What is GENOSYS?", "answer": "..." }
  ],
  "total": 18,
  "locale": "en"
}
```

#### Admin FAQ CRUD APIs
**List + Create:** `GET/POST /api/admin/faq-items`  
**Update + Delete:** `PUT/DELETE /api/admin/faq-items/[id]`  
**Files:** `app/api/admin/faq-items/route.ts`, `app/api/admin/faq-items/[id]/route.ts`

All admin endpoints follow the existing pattern:
- `requireAdminAuth` for authentication
- `requireCsrfToken` for CSRF protection
- `{ success: boolean, error?: string }` response format

### Admin Panel - FAQ Tab

**New Component:** `components/admin/AdminFaqManager.tsx`

Features:
- List all FAQ items with expand/collapse to preview content
- Create new FAQ items (all 3 languages)
- Edit inline with full form (question + answer × 3 languages)
- Delete with confirmation
- Toggle active/inactive per item (eye icon)
- Reorder with up/down arrows (swap sort order)
- Refresh button
- Item count with active/total breakdown

**Tab added to:** `components/admin/AdminTabNavigation.tsx` and `app/admin/page.tsx`

### Website FAQ Pages Updated

All 3 locale pages now fetch from DB server-side:

| File | Change |
|------|--------|
| `app/faq/page.tsx` | Added `prisma.faqItem.findMany()`, passes data as props |
| `app/ar/faq/page.tsx` | Same DB query, passes `faqItems` prop |
| `app/ru/faq/page.tsx` | Same DB query, passes `faqItems` prop |
| `app/faq/FAQClient.tsx` | Accepts `faqItems: FaqItemData[]` prop, locale-selects Q&A |

### FAQ Content Updates

#### Delivery Timings (updated in all 3 locales)

| Emirate | Delivery Time | Shipping Cost |
|---------|--------------|---------------|
| Dubai | 1–2 hours (Careem/QuipQup) | 45 AED |
| Abu Dhabi & Al Ain | 24–36 hours | 70 AED |
| Sharjah | 24–36 hours | 70 AED |
| Ajman | 24–36 hours | 70 AED |
| Ras Al Khaimah | 24–36 hours | 70 AED |
| Fujairah | 24–36 hours | 70 AED |
| Umm Al Quwain | 24–36 hours | 70 AED |

Free shipping on orders over 1,000 AED.

#### New FAQ: Account Deletion

> **Q:** Can I delete my account?  
> **A:** Yes, you can delete your account at any time. Go to your Profile and select "Delete Account". Once confirmed, all your personal data — including order history, saved addresses, and preferences — will be permanently deleted. This action cannot be undone.

Available in EN, AR, RU.

### Translation Files Updated

| File | Changes |
|------|---------|
| `messages/en.json` | Updated `shipToAllEmirates`, `shippingTime` answers; added `deleteAccount` |
| `messages/ar.json` | Same updates in Arabic |
| `messages/ru.json` | Same updates in Russian |

Note: Translation files retain the FAQ content for backward compatibility (chatbot, help page), but the FAQ page and mobile API now read exclusively from the database.

### Files Changed (Website)

| File | Type | Description |
|------|------|-------------|
| `prisma/schema.prisma` | Modified | Added `FaqItem` model |
| `app/api/mobile/faq/route.ts` | **New** | Mobile FAQ API (DB-driven) |
| `app/api/admin/faq-items/route.ts` | **New** | Admin GET list + POST create |
| `app/api/admin/faq-items/[id]/route.ts` | **New** | Admin PUT update + DELETE |
| `components/admin/AdminFaqManager.tsx` | **New** | Admin FAQ management UI |
| `components/admin/AdminTabNavigation.tsx` | Modified | Added FAQ tab |
| `app/admin/page.tsx` | Modified | Added AdminFaqManager + FAQ tab type |
| `app/faq/page.tsx` | Modified | Server-side DB fetch |
| `app/faq/FAQClient.tsx` | Modified | Accepts `faqItems` prop from DB |
| `app/ar/faq/page.tsx` | Modified | Server-side DB fetch |
| `app/ru/faq/page.tsx` | Modified | Server-side DB fetch |
| `messages/en.json` | Modified | Updated delivery FAQ + account deletion |
| `messages/ar.json` | Modified | Updated delivery FAQ + account deletion |
| `messages/ru.json` | Modified | Updated delivery FAQ + account deletion |

### Commits

1. `e5922d3a` - feat: move FAQ to database with admin management

---

## Mobile App Changes (genosys-mobile-app)

### FAQ Screen - API-Driven

**File:** `app/faq.js`

The FAQ screen was rewritten to fetch content from the website's `/api/mobile/faq` endpoint instead of using local translation files.

Features:
- Loading state with spinner
- Error state with retry button
- Pull-to-refresh
- Haptic feedback on accordion toggle and CTA buttons
- Formatted answers (bullet lists, numbered lists, paragraphs)
- Question mark icon removed (kept simple)

### Standalone About Page

**File:** `app/about.js` (new)

Created a standalone About page for hamburger menu navigation. Same content as `app/profile/about.js` but with:
- Generic back arrow (`←`) instead of "< Account" text
- Footer with tappable `www.genosys.ae` link + copyright
- App version display

The original `app/profile/about.js` is untouched — navigating from Profile/Account still shows "< Account".

### NavigationDrawer Updated

**File:** `components/NavigationDrawer.js`

- "About" link changed from `/profile/about` to `/about` (standalone)

### Files Changed (Mobile App)

| File | Type | Description |
|------|------|-------------|
| `app/faq.js` | Modified | Rewritten to fetch from API |
| `app/about.js` | **New** | Standalone about page with generic back arrow |
| `components/NavigationDrawer.js` | Modified | About route updated |

### Commits

1. `75ac10e` - feat: add haptic feedback to FAQ page
2. `02b8442` - feat: FAQ from API, standalone about page

---

## Architecture: Before vs After

### Before (FAQ in Translation Files)
```
Website FAQ page → reads messages/en.json → hardcoded array
Mobile app FAQ  → reads i18n/messages/en.json → hardcoded array
Admin           → no way to manage FAQ without code changes
```

### After (FAQ in Database)
```
Admin panel     → CRUD /api/admin/faq-items → faq_items table
Website FAQ page → prisma.faqItem.findMany() → server-side render
Mobile app FAQ  → GET /api/mobile/faq → JSON response
                  All read from the same faq_items table
```

**Key benefit:** Add, edit, reorder, or deactivate FAQ items from the admin panel. No code changes, no redeployment needed. Both website and mobile app update automatically.

---

*Session completed: February 10, 2026*
