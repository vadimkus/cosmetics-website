# Session Changes — March 30, 2026 (Part 2)

## 1. Android App Blog Post Published

### What Changed

Published a new blog post announcing the GENOSYS UAE Android app on Google Play.

**Commit**: `cfbcc377` — `feat: add Android app launch blog post with Google Play screenshots`

### Blog Post Details

| Field | Value |
|-------|-------|
| Slug | `genosys-android-app-2026` |
| EN URL | https://genosys.ae/blog/genosys-android-app-2026 |
| AR URL | https://genosys.ae/ar/blog/genosys-android-app-2026 |
| RU URL | https://genosys.ae/ru/blog/genosys-android-app-2026 |
| Published | March 30, 2026 18:00 GST |
| Author | GENOSYS Team |
| Featured Image | `/blog/post_android/google-play-listing.png` |
| Tags | Android App, Google Play, Mobile Shopping, AI, Free Download, Technology, GENOSYS UAE, Cash on Delivery |

### Content Sections (all 3 languages)

1. **Hero** — App icon + "Get It on Google Play" CTA
2. **Google Play Store Listing** — Screenshot of the Play Store page
3. **App Screenshots Grid** — Product detail, cart (bundle discounts), checkout (COD)
4. **AI-Powered Skincare** — AI skin analysis, smart recommendations, voice search, chat assistant
5. **Build Your Set** — Bundle builder with tiered discounts (5%, 10%, 15%)
6. **Fast & Flexible Checkout** — COD, card, Google Pay
7. **Feature Grid** — 61+ products, expert blog, find a partner, fingerprint login, 3 languages, favorites
8. **Available on Both Platforms** — App Store + Google Play links
9. **FAQ** — 5 questions (free?, account sync, Android version, COD, delivery)
10. **Download CTA** — Final call-to-action with emerald button
11. **Contact & Signature**

### Files Added

| Path | Description |
|------|-------------|
| `public/blog/post_android/app.png` | App icon (copied from iOS post) |
| `public/blog/post_android/google-play-listing.png` | Google Play Store listing screenshot |
| `public/blog/post_android/screen-product.png` | Product detail screenshot |
| `public/blog/post_android/screen-cart.png` | Cart with bundle discount |
| `public/blog/post_android/screen-checkout.png` | Checkout with COD |
| `public/blog/post_android/screen-cart-ru.png` | Russian language cart |
| `scripts/create-android-app-blog-post.js` | Database creation script |

### Blog Audit

All **12 published blog posts** verified — complete translations (EN, AR, RU) on every post. No missing `titleAr`, `titleRu`, `excerptAr`, `excerptRu`, `contentAr`, or `contentRu` fields.

---

## 2. Privacy Policy — Comprehensive Update

### What Changed

Expanded the privacy policy from **4 sections to 14 sections**, updated the date, added mobile app coverage, AI features, and UAE PDPL reference.

**Commit**: `834736bd` — `update: comprehensive privacy policy — 14 sections, mobile apps, AI, PDPL`

### File Changed

| File | Change |
|------|--------|
| `app/privacy-policy/PrivacyPolicyClient.tsx` | Rewritten — 14 sections, shared `renderContent()` for PWA/desktop, all EN/AR/RU |

### Date Updated

`January 13, 2026` → **`March 30, 2026`**

### New Sections Added

| # | Section | Key Content |
|---|---------|-------------|
| — | Your Privacy Rights | UAE PDPL (Federal Decree-Law No. 45/2021) reference |
| 1 | Personal Information | Added delivery addresses, encrypted passwords |
| 2 | **How We Use Your Information** | 9 specific purposes including AI features |
| 3 | **Mobile Applications** | iOS App Store + Android Google Play, device info, push notifications, biometric auth (local-only), camera for AI |
| 4 | **AI Features & Skin Analysis** | OpenAI GPT-4o disclosure, photo handling, Genie chatbot sessions not stored |
| 5 | Google Auth | Clarified: no access to contacts/files |
| 6 | Apple Sign-In | Private Relay mention |
| 7 | **Payment Processing** | Stripe PCI DSS, COD = no financial data, all payment methods listed |
| 8 | **Data Sharing & Third Parties** | Stripe, delivery partners, OpenAI, Vercel, law enforcement |
| 9 | **Cookies & Tracking** | Essential only, no third-party tracking or targeted ads |
| 10 | **Data Security** | HTTPS/TLS, hashed passwords, CSRF, rate limiting, audits |
| 11 | **Data Retention** | 5 years for orders (UAE tax), 30-day deletion on request |
| 12 | **Children's Privacy** | Under 16, parental consent |
| 13 | **Changes to This Policy** | Email/app notification for material changes |
| 14 | Contact Us | sales@genosys.ae, WhatsApp |

### Code Refactor

The old version had duplicate rendering code for PWA/mobile and desktop modes. Refactored into a shared `renderContent(compact: boolean)` function — both layouts now render from the same translations object, eliminating drift.

---

## 3. Privacy Policy API — Mobile Apps Sync

### Problem

The mobile apps (iOS + Android) had a **hardcoded, separate copy** of the privacy policy in `i18n/messages/*.json` files, dated **December 13, 2025** with only 4 sections. Every policy update required manually syncing two codebases + an app build/update.

### Solution

Created a new API endpoint that serves the privacy policy as structured JSON. The mobile app now fetches from the API instead of using hardcoded translations.

### Website API

**Commit**: `fccd4c0f` — `feat: add GET /api/mobile/privacy-policy endpoint`

| Detail | Value |
|--------|-------|
| Endpoint | `GET /api/mobile/privacy-policy` |
| Auth | `x-api-key` header (same as all mobile APIs) |
| Locale | `x-locale` header: `en`, `ar`, `ru` |
| Response | JSON with `title`, `subtitle`, `lastUpdated`, `lastUpdatedISO`, `sections[]`, `locale`, `fullPolicyUrl` |

**File**: `app/api/mobile/privacy-policy/route.ts`

### Section Types

Each section has a `type` field that tells the app how to render it:

| Type | Description | Example Sections |
|------|-------------|-----------------|
| `highlight` | Red accent box | Your Privacy Rights |
| `list` | Label/text pairs | Personal Info, Mobile Apps, AI Features, Google Auth, Apple Auth |
| `bullets` | Simple bullet list | How We Use Info, Data Sharing, Data Security |
| `text` | Plain paragraph | Payment, Cookies, Retention, Children's, Changes |
| `contact` | Contact card with email/phone/address | Contact Us |

### Mobile App Update

**Commit**: `6bc20d5` (genosys-mobile-app) — `feat: fetch privacy policy from API instead of hardcoded translations`

**File**: `components/PrivacyPolicyContent.js`

| Before | After |
|--------|-------|
| Read from `i18n/messages/*.json` | Fetch from `GET /api/mobile/privacy-policy` |
| 4 sections, dated Dec 2025 | 14 sections, always current |
| Required app update to change policy | Policy updates are instant (server-side) |
| Hardcoded in 3 language files | Single API returns correct locale |

### Error Handling

On API failure (network error, server down), the app shows a **"View on Website"** fallback button that opens `genosys.ae/privacy-policy` in the device browser. Users always have access to the policy.

### OTA Deployment

Pushed via EAS Update (OTA) — no new build required:

| Platform | Update Group ID | Status |
|----------|----------------|--------|
| Android | `406ea67c-0a1e-46b3-a913-ef76b2c61f2f` | Live |
| iOS | `68e8d000-8dc2-4d41-8a0a-34df53f0e60c` | Live |

Message: "Sync privacy policy from API — no more hardcoded content"

### Architecture: Single Source of Truth

```
┌─────────────────────────────────────────────┐
│           Privacy Policy Content             │
│   app/api/mobile/privacy-policy/route.ts     │
│   (14 sections × 3 languages = 1 file)      │
└──────────┬──────────────┬────────────────────┘
           │              │
    ┌──────▼──────┐  ┌────▼─────────────────┐
    │   Website   │  │   Mobile Apps (API)   │
    │  /privacy-  │  │  GET /api/mobile/     │
    │   policy    │  │  privacy-policy       │
    │ (inline in  │  │  → PrivacyPolicy      │
    │  Client.tsx)│  │    Content.js         │
    └─────────────┘  └───────────────────────┘
```

> **Note**: The website page (`PrivacyPolicyClient.tsx`) still has its own inline copy for SSR/SEO purposes. The API endpoint is the canonical source for mobile apps. When updating the policy, update **both** the API route and the Client component — they share the same translations but are in separate files. Future improvement: extract shared translations to a single module imported by both.

---

## Summary of All Changes (March 30, 2026 — Part 2)

| Change | Commits | Deployed |
|--------|---------|----------|
| Android app blog post | `cfbcc377` | Vercel (auto) |
| Privacy policy expansion (4→14 sections) | `834736bd` | Vercel (auto) |
| Privacy policy API for mobile apps | `fccd4c0f` | Vercel (auto) |
| Mobile app: fetch policy from API | `6bc20d5` | EAS Update (OTA) |
