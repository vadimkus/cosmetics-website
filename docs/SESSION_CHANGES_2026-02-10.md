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

## Abeer Mekki - Authorized Reseller Added to Partners Page

### Summary
Added **Abeer Mekki Beauty Ladies Center** as a certified authorized reseller to the Partners page (`/partners`). This is the same reseller already displayed on the Abu Dhabi locations page. The partner card now includes a "View Certificate" button linking to the PDF certificate.

### New Partner Details

| Field | Value |
|-------|-------|
| ID | `abeer-mekki-beauty` |
| Name | ABEER MEKKI BEAUTY LADIES CENTER, Abu Dhabi & Al Ain |
| Type | Certified Authorized Reseller |
| Location | Abu Dhabi & Al Ain, United Arab Emirates |
| Phone | +971 55 671 75 64 |
| Theme | Emerald (green) |
| Certificate | `/documents/GENOSYS_Authorized_Reseller_ABEER_MEKKI.pdf` |

Position: After "Body & Mind City Walk" (last in the partners list)

### Partner Type Extension

Added optional `certificateUrl` field to the Partner interface:

```typescript
// types/partner.ts
export interface Partner {
  // ... existing fields
  certificateUrl?: string;  // NEW - link to PDF certificate
}
```

### PartnerCard Component Enhancement

Updated `components/partners/PartnerCard.tsx` to display a "View Certificate" button when `certificateUrl` is present:

- Amber/gold button styling (matches locations page certificate button)
- Opens PDF in new tab
- Uses `FileText` icon from lucide-react
- Localized button text in all 3 languages

### Translation Keys Added

| File | Key | Value |
|------|-----|-------|
| `messages/en.json` | `common.viewCertificate` | "View Certificate" |
| `messages/ar.json` | `common.viewCertificate` | "عرض الشهادة" |
| `messages/ru.json` | `common.viewCertificate` | "Сертификат" |

### Files Changed

| File | Type | Description |
|------|------|-------------|
| `types/partner.ts` | Modified | Added `certificateUrl?: string` |
| `lib/partners.ts` | Modified | Added Abeer Mekki partner entry |
| `components/partners/PartnerCard.tsx` | Modified | Added View Certificate button |
| `messages/en.json` | Modified | Added `viewCertificate` translation |
| `messages/ar.json` | Modified | Added `viewCertificate` translation |
| `messages/ru.json` | Modified | Added `viewCertificate` translation |
| `public/images/partners/abeer-mekki.png` | **New** | Partner logo (AM monogram) |

### Related Pages

The new partner automatically appears on:
- `/partners` (English)
- `/ar/partners` (Arabic)  
- `/ru/partners` (Russian)
- Mobile app via `/api/mobile/partners`

The certificate PDF already existed at `/documents/GENOSYS_Authorized_Reseller_ABEER_MEKKI.pdf` (was already used on the Abu Dhabi locations page).

---

## Bundle Builder API for Mobile App

### Summary
Created a new API endpoint for the native mobile app Bundle Builder ("Build Your Set") feature. This allows the mobile app to fetch all eligible products grouped by skincare routine step, with localized content and user-specific pricing.

### New API Endpoint

**Endpoint:** `GET /api/mobile/bundle-builder`  
**File:** `app/api/mobile/bundle-builder/route.ts`

| Header | Required | Description |
|--------|----------|-------------|
| `x-api-key` | Yes | Mobile app API key |
| `x-locale` | No | `en` / `ar` / `ru` (default: `en`) |
| `x-user-id` | No | User ID for personalized pricing |

**Response Structure:**
```json
{
  "steps": [
    {
      "id": "cleanser",
      "name": "Cleanser",
      "description": "Start with a clean slate",
      "required": true,
      "icon": "🧴",
      "products": [
        {
          "id": "...",
          "name": "PURIFYING CLEANSER",
          "description": "...",
          "image": "https://genosys.ae/images/...",
          "price": 150,
          "displayPrice": 75,
          "originalPrice": 150,
          "userDiscountPct": 50,
          "size": "180ml",
          "variants": [...]
        }
      ],
      "productCount": 8
    }
  ],
  "discountTiers": [
    { "minItems": 2, "discount": 5 },
    { "minItems": 3, "discount": 10 },
    { "minItems": 4, "discount": 15 },
    { "minItems": 5, "discount": 20 }
  ],
  "stats": {
    "totalProducts": 45,
    "totalSteps": 8,
    "requiredSteps": 3,
    "maxDiscount": 20
  },
  "locale": "en"
}
```

### Routine Steps

| Step ID | Name | Required | Category Match |
|---------|------|----------|----------------|
| `cleanser` | Cleanser | ✅ | Cleanser |
| `peeling` | Peeling | ❌ | Peeling |
| `toner` | Toner / Mist | ❌ | Toner OR Mist |
| `serum` | Serum | ✅ | Serum |
| `cream` | Cream | ✅ | Cream |
| `eye-care` | Eye Care | ❌ | Eye |
| `mask` | Mask | ❌ | Mask |
| `sun` | Sun Protection | ❌ | Sun |

### Product Filtering (same as website Bundle Builder)

Excluded from API response:
- Category = "Beauty Boxes" (bundles themselves)
- Category = "PRO Solution" (professional only)
- `isHidden = true`
- `inStock = false`
- `isPriceOnRequest = true`
- Name contains "SKIN RENEWAL PEELING SYSTEM"

### User-Specific Pricing

When `x-user-id` header is provided:
1. Fetches user's `discountType` and `discountPercentage` from database
2. Applies user discount to `displayPrice` for products where `noDiscount = false`
3. Returns `originalPrice` and `userDiscountPct` for strikethrough pricing in UI

### Localization

- Step names and descriptions localized based on `x-locale` header
- Product names use translation files (`getProductTranslations`, `getProductTranslationsRu`)
- Falls back to database `nameAr`/`nameRu` fields if no translation file entry

### Files Changed

| File | Type | Description |
|------|------|-------------|
| `app/api/mobile/bundle-builder/route.ts` | **New** | Bundle Builder API endpoint |

---

---

## Expo Push Notifications for Order Status Updates

### Summary
When an admin changes an order's status (e.g., Confirmed, Shipped, Delivered), the customer's mobile app now receives a beautiful push notification with localized text. Tapping the notification opens the Orders page.

### Backend Changes

#### New Service: `lib/expoPush.ts`
Expo push notification service using `expo-server-sdk`.

Features:
- Beautiful localized notification messages for all 6 statuses (EN, AR, RU)
- Token validation using `Expo.isExpoPushToken()`
- Automatic cleanup of invalid tokens (`DeviceNotRegistered` → clears from DB)
- Batch sending support for future promotional notifications
- Receipt checking for delivery verification

#### Notification Messages

| Status | English | Emoji |
|--------|---------|-------|
| PENDING | "We've received your order #123. We'll confirm it shortly." | 🛒 |
| CONFIRMED | "Great news! Your order #123 has been confirmed and is being prepared." | ✅ |
| PAID | "Thank you! Payment for order #123 has been received." | 💳 |
| SHIPPED | "Your order #123 is on its way! Track your delivery in the app." | 📦 |
| DELIVERED | "Your order #123 has been delivered. Enjoy your GENOSYS products!" | 🎉 |
| CANCELLED | "Your order #123 has been cancelled. Contact us if you have questions." | ❌ |

All messages available in Arabic and Russian as well.

#### Integration: `app/api/admin/orders/[id]/route.ts`
Added push notification sending after email + WhatsApp notifications:
1. Looks up user by order email
2. Checks if user has a valid Expo push token
3. Sends localized notification based on order locale
4. If token is expired (`DeviceNotRegistered`), clears it from database
5. Non-blocking — order status update succeeds even if push fails

### Mobile App Changes

#### New Context: `contexts/NotificationContext.js`
Centralized notification handling:
- **Foreground listener**: Receives notifications while app is open (vibrates on Android)
- **Tap listener**: Navigates to `/profile/orders` when user taps notification
- **Cold start**: Checks if app was opened from a notification and navigates accordingly
- **Android channel**: Creates "orders" channel with high importance, vibration, and red LED

#### Updated: `app/_layout.js`
- Added `NotificationProvider` wrapping the app
- Notifications are now handled globally

#### Updated: `services/pushNotificationsService.js`
- Changed `shouldPlaySound: false` → `shouldPlaySound: true` for foreground notifications

### Architecture Flow

```
Admin changes order status
  → PUT /api/admin/orders/[id]
    → Update DB status
    → Send email notification (existing)
    → Send WhatsApp notification (existing)
    → NEW: Send Expo push notification
      → Look up user.expoPushToken
      → Build localized message (EN/AR/RU)
      → Send via Expo push service
      → Customer sees notification on iPhone/Android
        → Tap → opens app → navigates to Orders page
```

### Files Changed

| File | Repo | Type | Description |
|------|------|------|-------------|
| `lib/expoPush.ts` | website | **New** | Expo push notification service |
| `app/api/admin/orders/[id]/route.ts` | website | Modified | Sends push on status change |
| `package.json` | website | Modified | Added `expo-server-sdk` dependency |
| `contexts/NotificationContext.js` | mobile | **New** | Notification listeners + navigation |
| `app/_layout.js` | mobile | Modified | Added NotificationProvider |
| `services/pushNotificationsService.js` | mobile | Modified | Enabled sound for foreground |

### Dependencies

| Package | Version | Repo |
|---------|---------|------|
| `expo-server-sdk` | latest | website |

---

*Session completed: February 10, 2026*
