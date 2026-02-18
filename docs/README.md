# GENOSYS Cosmetics Website - Documentation Index

> **AI ASSISTANT: READ THIS FIRST**
> This is the comprehensive documentation index for the GENOSYS Professional cosmetics e-commerce website.
> Always read relevant documentation before making changes.

## Quick Links

| Priority | Document | Description |
|----------|----------|-------------|
| 🔴 **CRITICAL** | [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) | **Start here!** Tech stack, project structure, patterns |
| 🔴 **CRITICAL** | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Colors, typography, components |
| 🟡 **Important** | [PRICING_DISCOUNT_AUDIT.md](./PRICING_DISCOUNT_AUDIT.md) | Pricing logic, discount rules, calculation reference |
| 🟡 **Important** | [EMAIL_TEMPLATES.md](./EMAIL_TEMPLATES.md) | Order email format specification |
| 🟡 **Important** | [ORDERS_PAGE.md](./ORDERS_PAGE.md) | Orders page display format |
| 🟡 **Important** | [SUCCESS_PAGE.md](./SUCCESS_PAGE.md) | Order success page - design, API, translations |
| 🟢 **Feature** | [CHATBOT_SETUP.md](./CHATBOT_SETUP.md) | AI Chatbot setup and configuration |
| 🟢 **Feature** | [AI_EXPERT_ANALYSIS.md](./AI_EXPERT_ANALYSIS.md) | AI Expert Skin Analysis with GPT-4o vision |

---

## Documentation by Category

### 📋 Core Project Documentation

| File | Description |
|------|-------------|
| [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) | **Master guide** - Tech stack, structure, patterns, hooks, testing |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | UI design system, colors, typography |
| [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) | Database and deployment migrations |
| [WEBSITE_AUDIT_2026-02-12.md](./WEBSITE_AUDIT_2026-02-12.md) | Tech stack evaluation, weaknesses, PPR/Stripe/native app risk |

---

### 📧 Email System

| File | Description |
|------|-------------|
| [EMAIL_TEMPLATES.md](./EMAIL_TEMPLATES.md) | Unified email template specification |
| [EMAIL_CHANGELOG.md](./EMAIL_CHANGELOG.md) | Version history of email system changes |
| [ADMIN_EMAIL_ENHANCEMENT.md](./ADMIN_EMAIL_ENHANCEMENT.md) | Admin notification email details |
| [MOBILE_COD_EMAIL_BUG_INVESTIGATION.md](./MOBILE_COD_EMAIL_BUG_INVESTIGATION.md) | COD email debugging notes |

---

### 🛒 Orders & Checkout

| File | Description |
|------|-------------|
| [PRICING_DISCOUNT_AUDIT.md](./PRICING_DISCOUNT_AUDIT.md) | **NEW** Full pricing/discount audit across all channels (web + mobile) |
| [SUCCESS_PAGE.md](./SUCCESS_PAGE.md) | Order success page - design, API, translations |
| [ORDERS_PAGE.md](./ORDERS_PAGE.md) | Customer orders page display format |
| [ADMIN_ORDERS_BUGS_FIXED.md](./ADMIN_ORDERS_BUGS_FIXED.md) | Admin orders panel fixes |
| [MOBILE_ORDER_DELETION_SUMMARY.md](./MOBILE_ORDER_DELETION_SUMMARY.md) | Order cancellation feature |
| [CONTACT_EMAIL_FEATURE_DOCUMENTATION.md](./CONTACT_EMAIL_FEATURE_DOCUMENTATION.md) | Checkout contact email feature |
| [WEB_CHECKOUT_CONTACTEMAIL_COMPLETE.md](./WEB_CHECKOUT_CONTACTEMAIL_COMPLETE.md) | Contact email implementation |
| [MOYSKLAD_INTEGRATION.md](./MOYSKLAD_INTEGRATION.md) | MoySklad (МойСклад) accounting integration — manual admin push to sync orders |

---

### 💳 Payments (Stripe)

| File | Description |
|------|-------------|
| [STRIPE_SETUP_GUIDE.md](./STRIPE_SETUP_GUIDE.md) | Stripe integration setup |
| [STRIPE_WEBHOOK_SETUP.md](./STRIPE_WEBHOOK_SETUP.md) | Webhook configuration |
| [EMBEDDED_STRIPE_CHECKOUT.md](./EMBEDDED_STRIPE_CHECKOUT.md) | **NEW** Embedded checkout with bottom sheet UI |
| [MOBILE_STRIPE_CHECKOUT_IMPLEMENTATION.md](./MOBILE_STRIPE_CHECKOUT_IMPLEMENTATION.md) | Mobile app Stripe integration |

---

### 🤖 AI Chatbot

| File | Description |
|------|-------------|
| [CHATBOT_SETUP.md](./CHATBOT_SETUP.md) | Chatbot setup, configuration, API reference |
| [CHATBOT_KNOWLEDGE.md](./CHATBOT_KNOWLEDGE.md) | **NEW** Complete knowledge base documentation |

**Knowledge Base Contents (~24K tokens):**
- 61 products with prices and IDs
- 35+ ingredients with scientific details
- 6 complete skincare routines by skin type
- 12 skin concern protocols
- 30+ partner salon locations
- Brand story, technologies, certifications
- Multi-language support (EN, AR, RU)

**Key Features:**
- GPT-4o-mini powered beauty advisor (Genie)
- Product recommendations with Add to Cart links
- Educational skincare facts and ingredient science
- Bundle Builder & AI Skin Analysis promotion
- Rate limiting (10/min, 100/day per IP)

---

### 🧬 AI Expert Skin Analysis

| File | Description |
|------|-------------|
| [AI_EXPERT_ANALYSIS.md](./AI_EXPERT_ANALYSIS.md) | **GPT-4o-mini vision skin analysis** - Professional dermatologist-level analysis |

**Key Features:**
- GPT-4o-mini vision for photo analysis
- Professional skin assessment (type, concerns, health score)
- Personalized product recommendations with Add to Bag
- AM/PM skincare routine generation
- Rate limiting (10/hour per IP)
- Cost: ~$0.002-0.005 per analysis

---

### 🎁 Gift Certificates

| File | Description |
|------|-------------|
| [GIFT_CERTIFICATE_FEATURE.md](./GIFT_CERTIFICATE_FEATURE.md) | Gift certificate feature overview |
| [QUICK_START_CERTIFICATES.md](./QUICK_START_CERTIFICATES.md) | Quick setup guide |
| [BUILD_STATUS_CERTIFICATES.md](./BUILD_STATUS_CERTIFICATES.md) | Build status |
| [CERTIFICATE_TESTING_SUMMARY.md](./CERTIFICATE_TESTING_SUMMARY.md) | Testing results |

---

### 📱 Progressive Web App (PWA)

| File | Description |
|------|-------------|
| [PWA_IMPLEMENTATION_SUMMARY.md](./PWA_IMPLEMENTATION_SUMMARY.md) | PWA overview and features |
| [PWA_IMPROVEMENT_ACTION_PLAN.md](./PWA_IMPROVEMENT_ACTION_PLAN.md) | Planned improvements |
| [PWA_TASK_1_COMPLETION_REPORT.md](./PWA_TASK_1_COMPLETION_REPORT.md) | Task 1 completion |
| [PWA_TASK_2_COMPLETION_SUMMARY.md](./PWA_TASK_2_COMPLETION_SUMMARY.md) | Task 2 completion |
| [PWA_MASKABLE_ICONS_REPORT.md](./PWA_MASKABLE_ICONS_REPORT.md) | App icon implementation |
| [PWA_ICON_WHITE_BACKGROUND.md](./PWA_ICON_WHITE_BACKGROUND.md) | Icon background fix |
| [PWA_STORAGE_QUOTA_MANAGEMENT_REPORT.md](./PWA_STORAGE_QUOTA_MANAGEMENT_REPORT.md) | Storage management |
| [PWA_SW_UPDATE_NOTIFICATION_REPORT.md](./PWA_SW_UPDATE_NOTIFICATION_REPORT.md) | Service worker updates |

---

### 📲 iOS Native App

**App Store:** [Genosys UAE](https://apps.apple.com/app/id6756648064)

| Detail | Value |
|--------|-------|
| App Name | Genosys UAE |
| Version | 1.1.0 |
| Apple ID | 6756648064 |
| SKU | GENOSYSUAE001 |
| Status | **Live on App Store** (Feb 9, 2026) |

**Website Integration:**
- App Store badge on homepage (Hero component)
- Download link in mobile hamburger menu
- Localized for EN, AR, RU

---

### 🔐 User Authentication

| File | Description |
|------|-------------|
| [AUTH_PAGES.md](./AUTH_PAGES.md) | **NEW** Forgot/reset password pages, API, security |

---

### 📲 Mobile Web & Mobile App API

| File | Description |
|------|-------------|
| [MOBILE_APP_PRODUCTCONFIG_FIX.md](./MOBILE_APP_PRODUCTCONFIG_FIX.md) | Native app product images, color variants, DB gallery merge fix (Feb 13–14, 2026) |
| [MOBILE_VIEWPORT_FIX.md](./MOBILE_VIEWPORT_FIX.md) | 100dvh fix for iOS scroll bounce |
| [MOBILE_WEB_UX_IMPLEMENTATION.md](./MOBILE_WEB_UX_IMPLEMENTATION.md) | Mobile web UX patterns |
| [MOBILE_FOOTER_IMPLEMENTATION.md](./MOBILE_FOOTER_IMPLEMENTATION.md) | Bottom navigation bar |
| [MOBILE_LOGIN_DESIGN.md](./MOBILE_LOGIN_DESIGN.md) | Mobile login screen |
| [MOBILE_FRIENDLINESS_CHECK.md](./MOBILE_FRIENDLINESS_CHECK.md) | Mobile compatibility audit |
| [MOBILE_APP_CHANGES_SUMMARY.md](./MOBILE_APP_CHANGES_SUMMARY.md) | Mobile app changes log |
| [MOBILE_API_SETUP.md](./MOBILE_API_SETUP.md) | API setup for mobile app |
| [MOBILE_API_ENHANCED_DOCUMENTATION.md](./MOBILE_API_ENHANCED_DOCUMENTATION.md) | Detailed API documentation |
| [MOBILE_API_SPECIFICATIONS_EXTENSION.md](./MOBILE_API_SPECIFICATIONS_EXTENSION.md) | Extended API specs |
| [MOBILE_AUTH_ENDPOINTS.md](./MOBILE_AUTH_ENDPOINTS.md) | Authentication API |
| [MOBILE_CATEGORIES_API_INSTRUCTIONS.md](./MOBILE_CATEGORIES_API_INSTRUCTIONS.md) | Categories API |

---

### 🗄️ Database

| File | Description |
|------|-------------|
| [ADDRESS_TABLE_MIGRATION.md](./ADDRESS_TABLE_MIGRATION.md) | Address table schema |
| [CONTACT_EMAIL_MIGRATION_COMPLETE.md](./CONTACT_EMAIL_MIGRATION_COMPLETE.md) | Contact email migration |
| [PROMO_CODES_TABLE_CREATED.md](./PROMO_CODES_TABLE_CREATED.md) | Promo codes schema |
| [DATABASE_PRICE_SYNC_FIX.md](./DATABASE_PRICE_SYNC_FIX.md) | Price sync fix |
| [CACHE_FIX_DOCUMENTATION.md](./CACHE_FIX_DOCUMENTATION.md) | Database caching |
| [PRICE_FIX_SUMMARY.md](./PRICE_FIX_SUMMARY.md) | Pricing fixes |

---

### 🌐 Translations & Localization

| File | Description |
|------|-------------|
| [TRANSLATION_SETUP.md](./TRANSLATION_SETUP.md) | i18n setup guide |
| [TRANSLATION_TODO_COMPLETED.md](./TRANSLATION_TODO_COMPLETED.md) | Translation tasks completed |
| [RUSSIAN_TRANSLATION_STATUS.md](./RUSSIAN_TRANSLATION_STATUS.md) | Russian translation progress |
| [RUSSIAN_TRANSLATION_PLAN.md](./RUSSIAN_TRANSLATION_PLAN.md) | Russian translation plan |
| [RUSSIAN_TRANSLATION_REVIEW.md](./RUSSIAN_TRANSLATION_REVIEW.md) | Russian translation review |
| [RUSSIAN_MISSING_TRANSLATIONS.md](./RUSSIAN_MISSING_TRANSLATIONS.md) | Missing Russian translations |
| [PRODUCTS_MIXED_TRANSLATIONS.md](./PRODUCTS_MIXED_TRANSLATIONS.md) | Product translation issues |

---

### 🎨 Design & UI

| File | Description |
|------|-------------|
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Design system specification |
| [ANIMATION_USAGE_GUIDE.md](./ANIMATION_USAGE_GUIDE.md) | Animation patterns |
| [ANIMATION_IMPLEMENTATION_SUMMARY.md](./ANIMATION_IMPLEMENTATION_SUMMARY.md) | Animation implementation |
| [CONFETTI_IMPLEMENTATION.md](./CONFETTI_IMPLEMENTATION.md) | Confetti effect |
| [IMAGE_OPTIMIZATION_GUIDE.md](./IMAGE_OPTIMIZATION_GUIDE.md) | Image optimization |

---

### 🔬 AR & Special Features

| File | Description |
|------|-------------|
| [AR_SKIN_ANALYSIS_ENHANCEMENT.md](./AR_SKIN_ANALYSIS_ENHANCEMENT.md) | AR skin analysis feature |
| [POWER_ANIMAL_AND_AR_FEATURES.md](./POWER_ANIMAL_AND_AR_FEATURES.md) | Power animal & AR features |
| [TWILIO_WHATSAPP_INTEGRATION.md](./TWILIO_WHATSAPP_INTEGRATION.md) | WhatsApp integration |
| [SESSION_CHANGES_2026-02-01.md](./SESSION_CHANGES_2026-02-01.md) | **NEW** Mobile footer fix, cart reactivity, Beauty Box 62 |
| [SESSION_CHANGES_2026-01-26.md](./SESSION_CHANGES_2026-01-26.md) | Product video implementation (ID 10) |

---

### 🛍️ Products & Bundles

| File | Description |
|------|-------------|
| [BUNDLE_BUILDER.md](./BUNDLE_BUILDER.md) | Bundle Builder feature - custom routine creation with tiered discounts |

---

### 💉 Professional Treatment Protocols

| File | Description |
|------|-------------|
| [protocols/CLINIC_971_MICRONEEDLING_PROTOCOLS.md](./protocols/CLINIC_971_MICRONEEDLING_PROTOCOLS.md) | **NEW** Complete microneedling protocols for Clinic 971 — 8 protocols (Anti-Wrinkle, Anti-Pigmentation, Acne, Rejuvenation, SRS Peeling, Hydration, Neck/Décolleté, Eye Area) with Carboxy + Power Solutions core |
| [protocols/UNDERARM_BRIGHTENING.md](./protocols/UNDERARM_BRIGHTENING.md) | Underarm brightening protocol — EZ CO₂ + SWS + home care |
| [protocols/EPI_PEELING_HOME_CARE_EN.md](./protocols/EPI_PEELING_HOME_CARE_EN.md) | **NEW** EPI TURNOVER PEELING GEL — home care protocol (EN), ingredients, skincare sets by skin type |
| [protocols/EPI_PEELING_HOME_CARE_RU.md](./protocols/EPI_PEELING_HOME_CARE_RU.md) | **NEW** EPI TURNOVER PEELING GEL — домашний протокол (RU), составы, наборы по типам кожи |
| [protocols/SUN_PROTECTION_HOME_CARE_EN.md](./protocols/SUN_PROTECTION_HOME_CARE_EN.md) | **NEW** Sun Protection home care protocol (EN) — daily AM/PM routine for UAE climate, 5 SPF products, 4 lifestyle sets, reapplication guide, ingredients |
| [protocols/ACNE_BLEMISH_HOME_CARE_EN.md](./protocols/ACNE_BLEMISH_HOME_CARE_EN.md) | **NEW** Acne & Blemish Treatment home care protocol (EN) — AM/PM routine, Problem Control line system, 3 severity sets, UAE-specific tips, expected timeline |
| [protocols/PIGMENTATION_BRIGHTENING_HOME_CARE_EN.md](./protocols/PIGMENTATION_BRIGHTENING_HOME_CARE_EN.md) | **NEW** Pigmentation & Brightening home care protocol (EN) — Multi Vita Radiance routine, 3 severity sets, vitamin C + niacinamide + arbutin |
| [protocols/ANTI_AGING_HOME_CARE_EN.md](./protocols/ANTI_AGING_HOME_CARE_EN.md) | **NEW** Anti-Aging home care protocol (EN) — EGF + peptide routine, 3 age-based sets, ND Cell vs Multi Functional guide |
| [protocols/HYDRATION_HOME_CARE_EN.md](./protocols/HYDRATION_HOME_CARE_EN.md) | **NEW** Hydration home care protocol (EN) — triple-weight hyaluronic acid routine, barrier repair, desert + AC climate tips |
| [protocols/SENSITIVITY_HOME_CARE_EN.md](./protocols/SENSITIVITY_HOME_CARE_EN.md) | **NEW** Sensitive Skin home care protocol (EN) — centella + ceramide routine, barrier repair, temperature-shock recovery |
| [protocols/HAIR_LOSS_HOME_CARE_EN.md](./protocols/HAIR_LOSS_HOME_CARE_EN.md) | **NEW** Hair Loss home care protocol (EN) — HR3 MATRIX system, scalp peeling, 3 severity sets, hard-water tips |
| [protocols/SCARS_TREATMENT_HOME_CARE_EN.md](./protocols/SCARS_TREATMENT_HOME_CARE_EN.md) | **NEW** Scar Treatment home care protocol (EN) — EGF repair routine, scar types guide, 3 severity sets, UV protection emphasis |
| [PROTOCOL_UNDERARM_BRIGHTENING.md](./PROTOCOL_UNDERARM_BRIGHTENING.md) | Underarm brightening protocol (original version) |

**Microneedling Protocol Document:**
- **PDF download on website:** [genosys.ae/training](https://genosys.ae/training) → "Microneedling Protocols (Carboxy + Power Solutions)"
- **PDF file location:** `public/documents/PPT/GENOSYS_Microneedling_Protocols.pdf`
- **Source markdown:** `docs/protocols/CLINIC_971_MICRONEEDLING_PROTOCOLS.md`
- **8 protocols** covering all 6 Power Solution ampoules (AWS, SWS, PCS, HES, CVS, CTS)
- Each protocol includes: step-by-step instructions, needle depths, product selection, rationale, post-treatment masks, and home care programs
- Quick reference card for treatment room (printable)

---

### 🔐 Security & Authentication

| File | Description |
|------|-------------|
| [SECURITY_FIXES.md](./SECURITY_FIXES.md) | Security improvements |
| [SECURITY_FEATURES_TEST_RESULTS.md](./SECURITY_FEATURES_TEST_RESULTS.md) | Security test results |
| [APPLE_SIGNIN_SETUP.md](./APPLE_SIGNIN_SETUP.md) | Apple Sign-In setup |
| [DEPLOYMENT_GOOGLE_OAUTH.md](./DEPLOYMENT_GOOGLE_OAUTH.md) | Google OAuth setup |

---

### 🛠️ Codebase Quality

| File | Description |
|------|-------------|
| [CODEBASE_IMPROVEMENTS_P1_P3.md](./CODEBASE_IMPROVEMENTS_P1_P3.md) | **NEW** P1-P3 improvements: file splits, SWR, service layer, error boundaries, setTimeout cleanup, env centralization, translations (105 files, build passing) |

---

### 🔍 SEO & Blog

| File | Description |
|------|-------------|
| [GSC_FIXES_2026-02-14.md](./GSC_FIXES_2026-02-14.md) | Full GSC audit: Core Web Vitals (CLS/LCP), Product Snippets (236), Merchant Listings (48), Review Snippets (290), Page Indexing 404s (9), product gallery DB fix (Section 7), plus informational reports |
| [GOOGLE_SEARCH_CONSOLE_SETUP.md](./GOOGLE_SEARCH_CONSOLE_SETUP.md) | Google Search Console verification, sitemap submission, ping API |
| [GOOGLE_MERCHANT_CENTER_FEED.md](./GOOGLE_MERCHANT_CENTER_FEED.md) | Product feed XML at /feed/products.xml — RSS 2.0 for Merchant Center scheduled fetch |
| [SEO_CONCERN_LANDING_PAGES.md](./SEO_CONCERN_LANDING_PAGES.md) | Concern & category landing pages, product grid, discount logic, native app risk |
| [SEO_IMPROVEMENTS_SUMMARY.md](./SEO_IMPROVEMENTS_SUMMARY.md) | SEO optimizations |
| [BLOG_POST_CACHE_STATUS.md](./BLOG_POST_CACHE_STATUS.md) | Blog caching |
| [SESSION_IOS_APP_BLOG_UPDATE_2026-02-09.md](./SESSION_IOS_APP_BLOG_UPDATE_2026-02-09.md) | **NEW** iOS app blog refresh (AI features, new images, RU metadata fix) |
| [IOS_APP_BLOG_POST_PUBLISHED.md](./IOS_APP_BLOG_POST_PUBLISHED.md) | iOS app launch blog (original) |
| [IOS_APP_LAUNCH_BLOG_POST_SUMMARY.md](./IOS_APP_LAUNCH_BLOG_POST_SUMMARY.md) | Blog post summary (original) |

---

### 🧪 Testing

| File | Description |
|------|-------------|
| [E2E_TESTS_SUMMARY.md](./E2E_TESTS_SUMMARY.md) | E2E test overview |
| [E2E_TESTS_DETAILED_REPORT.md](./E2E_TESTS_DETAILED_REPORT.md) | Detailed test results |
| [E2E_FINAL_EXECUTION_GUIDE.md](./E2E_FINAL_EXECUTION_GUIDE.md) | Test execution guide |
| [E2E_LIVE_EXECUTION_REPORT.md](./E2E_LIVE_EXECUTION_REPORT.md) | Live test report |
| [TEST_API_VARIANTS.md](./TEST_API_VARIANTS.md) | API variant tests |
| [TEST_REFACTORED_PROFILE.md](./TEST_REFACTORED_PROFILE.md) | Profile tests |
| [HOW_TO_TEST_REFACTORED_PROFILE.md](./HOW_TO_TEST_REFACTORED_PROFILE.md) | Profile test guide |
| [PROFILE_REFACTORING_TEST_CHECKLIST.md](./PROFILE_REFACTORING_TEST_CHECKLIST.md) | Profile test checklist |

---

### 🚀 Deployment & Production

| File | Description |
|------|-------------|
| [PRODUCTION_SETUP_COMPLETE.md](./PRODUCTION_SETUP_COMPLETE.md) | Production setup |
| [PRODUCTION_MIGRATION_SUMMARY.md](./PRODUCTION_MIGRATION_SUMMARY.md) | Migration to production |
| [BUILD_SUCCESS_SUMMARY.md](./BUILD_SUCCESS_SUMMARY.md) | Build status |
| [WEB_APP_SWEEP_COMPLETION_REPORT.md](./WEB_APP_SWEEP_COMPLETION_REPORT.md) | App-wide fixes |

---

### 🐛 API Bug Fixes

| File | Description |
|------|-------------|
| [API_FIX_SUMMARY.md](./API_FIX_SUMMARY.md) | API fixes |
| [API_PRICING_BUG_FIX.md](./API_PRICING_BUG_FIX.md) | Pricing bug fix |
| [ADMIN_CURRENCY_DISPLAY_CLARIFICATION.md](./ADMIN_CURRENCY_DISPLAY_CLARIFICATION.md) | Currency display |

---

### 👥 Admin Portal

| File | Description |
|------|-------------|
| [ADMIN_USER_MANAGEMENT.md](./ADMIN_USER_MANAGEMENT.md) | User management — badges, filters, timestamps, lastLoginSource, order stats, API reference |
| [ADMIN_ANALYTICS_DASHBOARD.md](./ADMIN_ANALYTICS_DASHBOARD.md) | Analytics tab — 5MB fix (findMany → aggregate), error handling, API types |
| [ADMIN_ONLINE_USERS_FEATURE.md](./ADMIN_ONLINE_USERS_FEATURE.md) | Online users — activity tracking, session heartbeat, login source, all auth routes covered |
| [SESSION_CHANGES_2026-02-10.md](./SESSION_CHANGES_2026-02-10.md) | FAQ database migration & admin management (see FAQ section below) |

---

### ❓ FAQ Management

FAQ content is stored in the `faq_items` database table and managed through the admin panel.

| Detail | Value |
|--------|-------|
| Database Table | `faq_items` |
| Admin Tab | FAQ (in admin dashboard) |
| Mobile API | `GET /api/mobile/faq` |
| Admin API | `GET/POST /api/admin/faq-items`, `PUT/DELETE /api/admin/faq-items/[id]` |
| Languages | English (required), Arabic, Russian (optional) |
| Current Items | 18 FAQ items |

**How to manage:**
1. Go to Admin Dashboard → FAQ tab
2. Add, edit, reorder, toggle, or delete FAQ items
3. Changes appear on website and mobile app automatically

---

### 📅 Session Logs (Daily Changes)

| File | Description |
|------|-------------|
| [SESSION_CHANGES_2026-02-18.md](./SESSION_CHANGES_2026-02-18.md) | **NEW** Sun-protection page overhaul — product filtering fix, embedded AM/PM skincare routine, SPF badges, "Why" highlights, protocol PDF, expanded FAQ, corporate color on open steps |
| [SESSION_CHANGES_2026-02-15.md](./SESSION_CHANGES_2026-02-15.md) | MoySklad refactor (auto→manual push), PCS gallery images, duplicate discount fix, MoySklad delivery mapping, GSC structured data fixes (shippingDetails, priceValidUntil, audience), SPF 50+ product video |
| [SESSION_CHANGES_2026-02-14.md](./SESSION_CHANGES_2026-02-14.md) | Part 1: lastLoginSource fix; Part 2: **full activity tracking rework**; Part 3: **native app gallery image fix**; Part 4: **product 5 gallery DB update** (static file vs DB) |
| [SESSION_CHANGES_2026-02-13.md](./SESSION_CHANGES_2026-02-13.md) | Native app productConfig fix, category pill badges, email duplicate discount fix, product 27/31/40/52 content (videos, images), native app video sound fix, **product documentation API fix** |
| [SESSION_CHANGES_2026-02-12.md](./SESSION_CHANGES_2026-02-12.md) | SEO concern/category pages; Part 2: perf, pull-to-refresh, chat icon; Part 3: structured data fixes, Merchant Center feed |
| [SESSION_LOG_2026_02_11.md](./SESSION_LOG_2026_02_11.md) | Beauty box 15% discount display fix, product images (10, 15), checkout strikethrough prices |
| [SESSION_CHANGES_2026-02-10.md](./SESSION_CHANGES_2026-02-10.md) | FAQ DB, Abeer Mekki partner, Bundle Builder API, Push notifications, Login source tracking |
| [SESSION_IOS_APP_BLOG_UPDATE_2026-02-09.md](./SESSION_IOS_APP_BLOG_UPDATE_2026-02-09.md) | iOS App Blog Update - AI features, new images, RU metadata fix |
| [SESSION_CHANGES_2026-02-09.md](./SESSION_CHANGES_2026-02-09.md) | Admin online users feature - activity tracking, green indicators |
| [SESSION_CHANGES_2026-02-08.md](./SESSION_CHANGES_2026-02-08.md) | Mobile web registration fix — missing fields + 5-min hang resolved via after() |
| [SESSION_CHANGES_2026-02-06.md](./SESSION_CHANGES_2026-02-06.md) | Mobile API pricing audit, email template overhaul (images + breakdowns), success page enhancement, localization fixes, support-link order number mismatch fix |
| [SESSION_CHANGES_2026-02-05.md](./SESSION_CHANGES_2026-02-05.md) | Bundle progress bar, discount breakdown, product detail sheet, swipe gestures |
| [SESSION_CHANGES_2026-02-03.md](./SESSION_CHANGES_2026-02-03.md) | Bundle Builder UX, Build Your Set banner, ChatWidget i18n, 66+ AR/RU translations |
| [SESSION_CHANGES_2026-02-02.md](./SESSION_CHANGES_2026-02-02.md) | Bundle Builder feature, price hiding, corporate colors |
| [SESSION_CHANGES_2026-02-01.md](./SESSION_CHANGES_2026-02-01.md) | Mobile footer Chrome fix, cart reactivity, Beauty Box 62, Product 51 recommendation |
| [SESSION_CHANGES_2026-01-26.md](./SESSION_CHANGES_2026-01-26.md) | Product video, footer nav fix, docs |
| [SESSION_CHANGES_2026-01-15-VOICE-SEARCH.md](./SESSION_CHANGES_2026-01-15-VOICE-SEARCH.md) | Voice search feature |
| [SESSION_CHANGES_2026-01-15.md](./SESSION_CHANGES_2026-01-15.md) | Jan 15 changes |
| [SESSION_CHANGES_2026-01-14.md](./SESSION_CHANGES_2026-01-14.md) | Jan 14 changes |
| [SESSION_CHANGES_2026-01-12.md](./SESSION_CHANGES_2026-01-12.md) | Jan 12 changes |

---

## Key Concepts for AI Assistants

### Three Display Modes
Always consider these when making UI changes:
1. **Desktop Web** - `window.innerWidth >= 768`
2. **Mobile Web** - `window.innerWidth < 768 && !isPWA`
3. **PWA** - `display-mode: standalone`

### Three Languages
All features must support:
1. **English** (default) - LTR
2. **Arabic** - RTL layout
3. **Russian** - LTR

### Authentication States
UI often differs between:
- **Logged out** - Grey profile icon, no green dot
- **Logged in** - Red profile icon, green online dot

### Unified Order Item Format
All **email templates**, **success page**, and **Orders page** use the same enhanced format:
- 56×56 product image thumbnail
- Product name (UPPERCASE, bold)
- Combined detail line: "Quantity: 1 • 180ml"
- Discount display: **only one** — badge (`-50% VIP`, `-15% Bundle`, `-15% Box`) or generic `(XX% OFF)` text (never both)
- Original price strikethrough + discounted price in green
- Free items display "FREE" in green
- Summary: retail total, VIP discount, bundle discount, net subtotal, shipping, VAT, "You Saved" banner, total

---

## File Structure

```
cosmetics-website/
├── docs/                    # 📚 All documentation (YOU ARE HERE)
│   ├── README.md           # This index file
│   ├── PROJECT_GUIDE.md    # Master project guide
│   └── ...                 # All other docs
├── app/                    # Next.js pages & API routes
├── components/             # React components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities & business logic
├── messages/               # i18n translations (en, ar, ru)
├── prisma/                 # Database schema
├── public/                 # Static assets
└── scripts/                # Build & maintenance scripts
```

---

## How to Use This Documentation

1. **Before any changes**: Read [PROJECT_GUIDE.md](./PROJECT_GUIDE.md)
2. **UI/styling changes**: Read [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
3. **Email changes**: Read [EMAIL_TEMPLATES.md](./EMAIL_TEMPLATES.md)
4. **Orders page changes**: Read [ORDERS_PAGE.md](./ORDERS_PAGE.md)
5. **API changes**: Read [MOBILE_API_ENHANCED_DOCUMENTATION.md](./MOBILE_API_ENHANCED_DOCUMENTATION.md)
6. **Database changes**: Check relevant migration docs

---

*Last updated: February 18, 2026*
