# GENOSYS Cosmetics Website - Documentation Index

> **AI ASSISTANT: READ THIS FIRST**
> This is the comprehensive documentation index for the GENOSYS Professional cosmetics e-commerce website.
> Always read relevant documentation before making changes.

## Quick Links

### Strategy & Roadmaps (2026-07-18)

| Priority | Document | Description |
|----------|----------|-------------|
| 🔴 **Payment incident** | [Mobile card payment contact-email fix](./SESSION_CHANGES_2026-07-21_MOBILE_CARD_PAYMENT_CONTACT_EMAIL_FIX.md) | Fixes native Stripe Payment Sheet startup for accounts using a separate contact email by preserving the canonical login email required by the order foreign key. |
| 🔴 **Account integrity** | [Registration email-domain validation](./SESSION_CHANGES_2026-07-21_EMAIL_DOMAIN_VALIDATION.md) | Layered web/PWA/native signup protection: syntax checks, explicit common-domain typo suggestions, and server-side MX/domain deliverability validation. |
| 🟡 **Account ops** | [Claire Cabarles email correction](./SESSION_CHANGES_2026-07-21_CLAIRE_EMAIL_CORRECTION.md) | Corrected the mistyped Gmail login while preserving the password/account, verified password login readiness, and resent the welcome email. |
| 🟢 **Commerce UX** | [Checkout progress indicator](./SESSION_CHANGES_2026-07-21_CHECKOUT_PROGRESS.md) | Persistent three-step Cart → Details & payment → Confirmation indicator with green progress segments, secure-checkout cue, EN/RU/AR, RTL, and accessible current/completed states. |
| 🟢 **UI/UX** | [Product quick-facts disclosure redesign](./SESSION_CHANGES_2026-07-21_QUICK_FACTS_DISCLOSURE.md) | Inline PDP disclosure with a full-row trigger, responsive visual fact cards, clear open state, EN/RU/AR and RTL support, and accessible disclosure semantics. |
| 🟢 **Commerce UX** | [Website order-item UX refinement](./SESSION_CHANGES_2026-07-21_WEBSITE_ORDER_ITEM_UX.md) | Variant-safe product-card/cart actions, Revita Glow shade changes, reactive totals, checkout progress, Genie-free purchase pages, and one consistent minimal footer across focused journeys. |
| 🟢 **UI/UX** | [Desktop profile redesign](./SESSION_CHANGES_2026-07-19_DESKTOP_PROFILE_REDESIGN.md) | Award-inspired desktop account dashboard with sticky navigation, real rewards/orders/favorites data, URL-backed sections, security consolidation, EN/RU/AR and RTL; mobile/PWA unchanged. |
| 🟢 **UI/UX** | [Recommended Routine step badges](./SESSION_CHANGES_2026-07-19_ROUTINE_STEP_BADGES.md) | Replaces detached number circles with compact red badges over product thumbnails; semantic ordered lists, responsive sizing, keyboard focus, and RTL support. |
| 🟡 **Important** | [Product 20 Problem Control Serum PDF](./SESSION_CHANGES_2026-07-20_PRODUCT_20_PROBLEM_SERUM_PDF.md) | New guide in `documents/PPT/`; productConfig + training/downloads listings; product 18 was Hyaluron (wrong ID in request). |
| 🟡 **Important** | [Product 41 BB Cushion images](./SESSION_CHANGES_2026-07-23_PRODUCT_41_CUSHION_IMAGES.md) | New `cushion/main` + s1/s2/s4/s5/s6 gallery; 104 order items repointed; old `BBC.jpg` and Second cushion assets deleted. |
| 🟡 **Important** | [Product 39 Ultra Shield SPF 50+ images](./SESSION_CHANGES_2026-07-20_PRODUCT_39_ULTRA_IMAGES.md) | New `ultra/main` + s1–s6 gallery; 33 order items + summer blog repointed; old `SPF50.jpg` / `50big.jpg` deleted. |
| 🟡 **Important** | [Product 39 Ultra Shield SPF 50+ video](./SESSION_CHANGES_2026-07-20_PRODUCT_39_ULTRA_VIDEO.md) | New compressed `ultra.mp4` (23 MB → 776 KB); DB + productConfig + products.ts updated; old `spf50.mp4` deleted. |
| 🟡 **Important** | [Product 40 Multi Sun SPF 40 images](./SESSION_CHANGES_2026-07-19_PRODUCT_40_SUN_IMAGES.md) | New `sun/main` + s1–s6 gallery; 16 order items + summer blog repointed; old `SSUN.jpg` / `40big.jpg` deleted. |
| 🟡 **Important** | [Product 40 Multi Sun SPF 40 video](./SESSION_CHANGES_2026-07-19_PRODUCT_40_SUN_VIDEO.md) | New compressed `sun2.mp4` (35 MB → 1.2 MB); DB + productConfig updated; old `sun.mp4` deleted. |
| 🟢 **Rewards UX** | [COD Rewards disclosure](./SESSION_CHANGES_2026-07-19_COD_REWARDS_DISCLOSURE.md) | Shows estimated retail GENOSYS Rewards points in COD confirmation email and website success page, with clear collection/delivery timing and shipping exclusion in EN/RU/AR. |
| 🔴 **Clinic commerce** | [Clinic Homecare Scripts](./SESSION_CHANGES_2026-07-19_CLINIC_HOMECARE_SCRIPTS.md) | Versioned clinic recommendations, private patient links, cart/order attribution, Clinic Points, responsive web/PWA and native API support; fully verified against an isolated local database. |
| 🔴 **Mobile commerce** | [Mobile PDP bag controls](./SESSION_CHANGES_2026-07-18_MOBILE_PDP_BAG_CONTROLS.md) | Removes the overlapping mobile PDP chat button and makes the localized in-bag control navigate directly to the bag. |
| 🟢 **UI/Dev** | [Phase A stabilization + product morphs](./SESSION_CHANGES_2026-07-18_PHASE_A_PRODUCT52_PILOTS.md) | Reliable guide progress, repeatable home reveals, same-document image morphs, and high-positioned customer quick facts with verified sales evidence across all EN/RU/AR PDPs; fully browser-tested locally. |

### SEO Guides (2026-07-13)

| Priority | Document | Description |
|----------|----------|-------------|
| 🟢 **SEO/Content** | [SESSION_CHANGES_2026-07-13_EVERGREEN_UAE_SKINCARE_GUIDES.md](./SESSION_CHANGES_2026-07-13_EVERGREEN_UAE_SKINCARE_GUIDES.md) | **Six high-intent UAE evergreen guides.** Three new topics (microneedling aftercare, PDRN benefits, ceramide/barrier care) + three major rewrites (Korean skincare Dubai, clinic dermacosmetics, Dubai sunscreen), fully localized EN/RU/AR. Adds evidence sources, relevant product-image cards, localized structured data, x-default hreflang, and guide images in the sitemap. |
| 🟢 **Content/Commerce** | [SESSION_CHANGES_2026-07-13_OVERNIGHT_MASK_BLOG_CERABARRIER_COMBINATION.md](./SESSION_CHANGES_2026-07-13_OVERNIGHT_MASK_BLOG_CERABARRIER_COMBINATION.md) | **Overnight Mask feature article + barrier-first product pairing.** EN/RU/AR blog uses the new main + S1–S5 images and product video, with a CERABARRIER two-step night ritual. Reciprocal 34↔66 Perfect Combination added across web, APIs, and native app with localized benefit copy. |

### Operations & Accounting (2026-07-16)

| Priority | Document | Description |
|----------|----------|-------------|
| 🟡 **Important** | [SESSION_CHANGES_2026-07-16_ARFI_NAILS_CONSIGNMENT_PAYMENTINS.md](./SESSION_CHANGES_2026-07-16_ARFI_NAILS_CONSIGNMENT_PAYMENTINS.md) | **ARFI Nails** — paymentin **05946** (Barsha report **01397** / **3,821 AED**) + **05947** (Jumeirah **01398** / **1,476 AED**); both reports **Paid**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-16_SHINE_MEDICAL_CENTER_ORDER.md](./SESSION_CHANGES_2026-07-16_SHINE_MEDICAL_CENTER_ORDER.md) | **Shine Medical Center (Dibba)** — SO **GENCardM2607165371** / inv **04826** / ship **06549** / **1,195 AED**; SWS skipped (OOS). |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-16_IRYNA_SOLODKA_CLINIC_ORDER.md](./SESSION_CHANGES_2026-07-16_IRYNA_SOLODKA_CLINIC_ORDER.md) | **Iryna Solodka** — clinic SO **GENCardM2607165770** / inv **04827** / ship **06550** / pay **05948** / **855 AED** (paid, delivered). |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-16_VALERIYA_BORSCHEVA_CLINIC_ORDER.md](./SESSION_CHANGES_2026-07-16_VALERIYA_BORSCHEVA_CLINIC_ORDER.md) | **Dr. Valeria Borscheva** — clinic SO **GENCardM2607169446** / inv **04828** / ship **06551** / pay **05949** / **372 AED** (paid, delivered). |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-16_YULA_BEAUTY_CONSIGNMENT_EYE_KIT.md](./SESSION_CHANGES_2026-07-16_YULA_BEAUTY_CONSIGNMENT_EYE_KIT.md) | **Yula Beauty Salon LLC** — consignment report **01407** + demand **06552** / **490 AED** (EyeCell kit `00059` ×1); pay **05951** — **Paid**; PDFs in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-16_YULA_BEAUTY_ROLLER_ORDER.md](./SESSION_CHANGES_2026-07-16_YULA_BEAUTY_ROLLER_ORDER.md) | **Yula Beauty Salon LLC** — SO **GENCardM2607167103** / inv **04829** / ship **06553** / pay **05950** / **115 AED** (roller `00001` ×1, paid). |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-16_NEW_YOU_STAR_CONSIGNMENT_DEMAND.md](./SESSION_CHANGES_2026-07-16_NEW_YOU_STAR_CONSIGNMENT_DEMAND.md) | **NEW YOU STAR** — consignment demand **06554** / **805 AED** (EyeCell kit, Snow O₂ 180ml, Camel cushion); stock note PDF in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-16_LOVE_MY_BODY_CONSIGNMENT_SALES_HISTORY.md](./SESSION_CHANGES_2026-07-16_LOVE_MY_BODY_CONSIGNMENT_SALES_HISTORY.md) | **Love My Body Salon** — full consignment sales history (**8 reports / 21,056 AED**); copy in `~/Desktop/orders/GENOSYS_Love_My_Body_Consignment_Sales_History.md`. |
| 🔴 **Critical** | [SESSION_CHANGES_2026-07-16_LOVE_MY_BODY_DEMAND_LETTER.md](./SESSION_CHANGES_2026-07-16_LOVE_MY_BODY_DEMAND_LETTER.md) | **Love My Body** — final demand **2,660 AED** (report **01400**); deadline Fri 17 Jul 2026 17:00; letter in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-16_LOVE_MY_BODY_PAYMENTIN_01400.md](./SESSION_CHANGES_2026-07-16_LOVE_MY_BODY_PAYMENTIN_01400.md) | **Love My Body** — report **01400** paid via paymentin **05952** / **2,660 AED** (2026-07-16). |
| 🔴 **Critical** | [SESSION_CHANGES_2026-07-16_PEPTIDE_MASK_MOYSKLAD_EXPLOSION.md](./SESSION_CHANGES_2026-07-16_PEPTIDE_MASK_MOYSKLAD_EXPLOSION.md) | **Peptide pack → MoySklad `00012` ×5** on admin push; Genesis **PARTW2607160539** re-pushed (**2,970 AED**, peptide ×40 pcs). |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-08_EVOLUTION_CLEANSER_ORDER.md](./SESSION_CHANGES_2026-07-08_EVOLUTION_CLEANSER_ORDER.md) | **Evolution Aesthetics** — SO **GENCardM260708EVCL** / inv **04783** / ship **06497** / pay **05953** / **510 AED** (Snow cleanser 500ml ×2, paid). |

### UI & Order Reliability (2026-07-15)

| Priority | Document | Description |
|----------|----------|-------------|
| 🔴 **Critical** | [SESSION_CHANGES_2026-07-15_ORDER_EMAIL_IMAGE_CANONICALIZATION.md](./SESSION_CHANGES_2026-07-15_ORDER_EMAIL_IMAGE_CANONICALIZATION.md) | **Permanent order-email thumbnail fix** — all order channels now persist canonical server product images; repaired 75 dead historical rows, post-audit zero unresolved. |
| 🔴 **Critical** | [SESSION_CHANGES_2026-07-16_PARTNER_CREDIT_TERMS_AND_PRO_SEGREGATION.md](./SESSION_CHANGES_2026-07-16_PARTNER_CREDIT_TERMS_AND_PRO_SEGREGATION.md) | **Partner credit terms + pro/retail segregation** — 30/45/60/90-day credit option at partner checkout, consignment restricted to retail products (`lib/partnerCatalog.ts`), admin payment tracking with mark-paid + overdue, Partner Access on `/login`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-16_GENESIS_CONSIGNMENT_ADMIN_FIX.md](./SESSION_CHANGES_2026-07-16_GENESIS_CONSIGNMENT_ADMIN_FIX.md) | **Genesis Healthcare Center** consignment activated; fixed admin profile toggle not persisting (`consignmentActive` missing from admin user GETs). |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-16_KATERYNA_SIEROVA_ORDER.md](./SESSION_CHANGES_2026-07-16_KATERYNA_SIEROVA_ORDER.md) | **Kateryna Sierova** — offline retail order **MSK-KATERYNA-160726** (1,135 AED) + VIP 12% + 1,090 pts / SILVER; not for MoySklad. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-17_PRODUCT_11_REMOVER_IMAGES.md](./SESSION_CHANGES_2026-07-17_PRODUCT_11_REMOVER_IMAGES.md) | **Product 11 remover** — new `remover/Main` + S1–S6 gallery; 27 order items repointed; old `DEF.jpg` / `def_big.jpg` deleted. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-18_PRODUCT_12_EPI_IMAGES.md](./SESSION_CHANGES_2026-07-18_PRODUCT_12_EPI_IMAGES.md) | **Product 12 EPI peeling gel** — new `epi/main` + s1–s6 gallery; 29 order items repointed; old `EPI.jpg` / `eppi_big.jpg` deleted. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-17_PARTNER_FACE_ROOM_REMOVED.md](./SESSION_CHANGES_2026-07-17_PARTNER_FACE_ROOM_REMOVED.md) | **Partners** — removed closed FACE ROOM (Dubai Marina). |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-17_NEW_BADGE_TRUST_FIX.md](./SESSION_CHANGES_2026-07-17_NEW_BADGE_TRUST_FIX.md) | **NEW badges** — stop lying on Cream/Cleanser/Skin Concern; product-level launches only via `lib/productBadges.ts`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-17_PARTNER_SHINE_MEDICAL_CENTER.md](./SESSION_CHANGES_2026-07-17_PARTNER_SHINE_MEDICAL_CENTER.md) | **Partners** — added SHINE MEDICAL CENTER (Dibba Al Fujairah) + Northern Emirates area filter. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-17_PARTNERS_FACE_ONLY_REMOVED_NEW_YOU_STAR.md](./SESSION_CHANGES_2026-07-17_PARTNERS_FACE_ONLY_REMOVED_NEW_YOU_STAR.md) | **Partners** — removed closed Face Only; added NEW YOU STAR BEAUTY HEALTH CLINIC (The Mall Umm Suqeim). |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-17_PRODUCT_11_REMOVER_VIDEO.md](./SESSION_CHANGES_2026-07-17_PRODUCT_11_REMOVER_VIDEO.md) | **Product 11 remover** — compressed `remover.mp4` (30 MB → 1.0 MB); DB `videoUrl` set; PDP + mobile API. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-16_PRODUCT_10_CLEANSER_IMAGES.md](./SESSION_CHANGES_2026-07-16_PRODUCT_10_CLEANSER_IMAGES.md) | **Product 10 cleanser** — new `cleanser/Main` + S1–S6 gallery; config gallery removed so DB wins; 85 order items repointed; old `SNOW.jpg` deleted. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-15_PRODUCT_15_PROBLEM_TONER_IMAGES.md](./SESSION_CHANGES_2026-07-15_PRODUCT_15_PROBLEM_TONER_IMAGES.md) | **Product 15 toner** — new `problem/Main` + S1–S6 gallery; config gallery removed so DB wins; 20 order items repointed; old `PRS.jpg` deleted. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-15_MISS_ESTEFA_PASTOR_FOC_ORDER.md](./SESSION_CHANGES_2026-07-15_MISS_ESTEFA_PASTOR_FOC_ORDER.md) | **Miss Estefa Pastor** — amended existing SO **GENCardM2607155574** / inv **04822** / ship **06545** — added Bio-Meso 5000 ×1 + collagen ×5 @ 100% off (paid total **320 AED** unchanged); removed mistaken duplicate chain. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-15_BEIGE_CUSHION_OVERNIGHT_MASK_WRITEOFF.md](./SESSION_CHANGES_2026-07-15_BEIGE_CUSHION_OVERNIGHT_MASK_WRITEOFF.md) | **Write-off 00008-00472** — beige cushion `00144` ×1 + overnight mask `00189` ×1 @ buyPrice **99.16 AED**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-15_NEW_CLINIC_DEMO_WRITEOFF.md](./SESSION_CHANGES_2026-07-15_NEW_CLINIC_DEMO_WRITEOFF.md) | **New clinic demo** — loss **00008-00473** / **180.68 AED** @ buyPrice (Snow Booster 200ml, Snow O₂ 180ml, SRS ×2, PDRN Expert 60000 box). |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-15_NONNA_COLLECTION_RETAIL_ORDER.md](./SESSION_CHANGES_2026-07-15_NONNA_COLLECTION_RETAIL_ORDER.md) | **Nonna Collection** — SO **GENCardM2607156716** / inv **04824** / ship **06547** / pay **05944** / **1,020 AED** (Snow O₂ 500ml ×2 @510, delivery free); PDF in `~/Desktop/orders/`. |

### Operations & Accounting (2026-07-14)

| Priority | Document | Description |
|----------|----------|-------------|
| 🟢 **UI/App** | [SESSION_CHANGES_2026-07-14_NO_ROLLER_WITH_SPICULES.md](./SESSION_CHANGES_2026-07-14_NO_ROLLER_WITH_SPICULES.md) | **Never roller + spicules** — #65 Bio-Meso routine drops roller; #1 roller pairs with hyaluron serum instead of Homecare 5000. |
| 🟢 **UI/App** | [SESSION_CHANGES_2026-07-14_BIO_MESO_60000_ROUTINE.md](./SESSION_CHANGES_2026-07-14_BIO_MESO_60000_ROUTINE.md) | **Bio Meso #60** Recommended Routine added (cleanse → Expert 60000 → PDRN mask → postcream); EN/AR/RU. |
| 🟢 **UI/App** | [SESSION_CHANGES_2026-07-14_REVITA_GLOW_MOBILE_ROUTINE.md](./SESSION_CHANGES_2026-07-14_REVITA_GLOW_MOBILE_ROUTINE.md) | **Revita Glow #63** Recommended Routine was desktop-only; folded into `ProductRoutineCard` so mobile web shows it after Product Details. |
| 🟢 **UI/App** | [SESSION_CHANGES_2026-07-14_COLLAGEN_PROMO_IMAGE_FIX.md](./SESSION_CHANGES_2026-07-14_COLLAGEN_PROMO_IMAGE_FIX.md) | **Mobile free collagen promo** still used deleted `/images/in.png` → broken order-email thumbs; pointed at `collagen_mask/Main.jpeg` + OTA; repointed **352** historical orderItems. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-14_ILMIRA_HAIRULINA_CONSIGNMENT_SALES_RETURN.md](./SESSION_CHANGES_2026-07-14_ILMIRA_HAIRULINA_CONSIGNMENT_SALES_RETURN.md) | **Ilmira Hairulina** — report **01406** / **231 AED** (collagen×5, algae×2, SPF40) + return **00304** / **2,132 AED**; PDFs in `~/Desktop/orders/`; collagen book −4 vs physical. |

### Operations & Accounting (2026-07-13)

| Priority | Document | Description |
|----------|----------|-------------|
| 🟡 **Important** | [SESSION_CHANGES_2026-07-13_BRAU_LADIES_SPLIT_PEPTIDE_ORDERS.md](./SESSION_CHANGES_2026-07-13_BRAU_LADIES_SPLIT_PEPTIDE_ORDERS.md) | **Brau Ladies** — 2 identical chains (ADU + JBR): peptide `00012` ×20 @ 38 + free delivery; inv **04811**/04812, ship **06531**/06532 / **760 AED** each (**1,520** total); PDFs in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-13_SALES_BONUS_500_PAYMENTOUT.md](./SESSION_CHANGES_2026-07-13_SALES_BONUS_500_PAYMENTOUT.md) | **Sales bonus** — paymentout **00651** / **500 AED** → Vadim Sagatdinov (expense Sales Bonus). |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-13_MISS_OSHBA_AL_FALASI_RETAIL_ORDER.md](./SESSION_CHANGES_2026-07-13_MISS_OSHBA_AL_FALASI_RETAIL_ORDER.md) | **Miss Oshba Al Falasi** — SO **GENCardM2607130007** / inv **04813** / ship **06533** / pay **05930** / **705 AED** (radiance + hyaluron serums + delivery 45); **Доставлен**; PDF in `~/Desktop/orders/`. |

### UI & Web Development (2026-07-05)

| Priority | Document | Description |
|----------|----------|-------------|
| 🔴 **Security** | [SESSION_CHANGES_2026-07-06_TWENTY_ELEMENT_AUDIT_SECURITY_COMMERCE_DB.md](./SESSION_CHANGES_2026-07-06_TWENTY_ELEMENT_AUDIT_SECURITY_COMMERCE_DB.md) | **20-element audit (security, commerce, DB, SEO, app).** CRITICAL closed: 5 unauthenticated PII/abuse endpoints gated (auth/refresh enumeration, order-success PII, blog-comment impersonation, certificate + invoice email spam). Commerce: free-gift spend threshold + out-of-stock now enforced server-side on all 5 order paths; Stripe endpoints rate-limited. Observability: error.tsx prod leak, Sentry server PII scrub + checkout capture, logger EROFS no-op, admin error-detail leaks. DB: order_items(productId) + orders(status,createdAt) indexes created CONCURRENTLY on prod; admin revenue metric no longer zeroes paid-undelivered orders. SEO: /terms in sitemap, stable lastmod. New GDPR analytics-retention cron (CRON_SECRET). nodemailer→9.0.3 (0 web vulns). Mobile: /orders/<id> deep link + faster cold-start auth (OTA). Documented decisions: /training public gate (SEO vs professional-only), email DMARC→quarantine + domain sender (DNS), logout tokenVersion tradeoff. |
| 🟢 **UI/Dev** | [SESSION_CHANGES_2026-07-06_SIX_AREA_AUDIT_CONSENT_ANALYTICS_PERF_A11Y_I18N.md](./SESSION_CHANGES_2026-07-06_SIX_AREA_AUDIT_CONSENT_ANALYTICS_PERF_A11Y_I18N.md) | **Six-area audit (consent, analytics, perf, a11y, i18n, app resilience).** CRITICAL closed: cookie-consent banner + Google Consent Mode v2 (GA ran unconsented; privacy policy misstated cookies — corrected EN/AR/RU); GA4 `purchase` now fires for COD/card (was Stripe-only → revenue under-reported) + `view_item`/`add_to_cart`/`begin_checkout` wired; `/ar`+`/ru` forgot-password / reset-password / terms were 404 (password recovery broken for AR/RU) → created. Perf: hero video 12MB deferred to idle, prod console stripping, image `sizes`. A11y: aria-live toasts, listbox language switcher, nav focus rings, label association, contrast. RTL: checkout summary, product info, cart, footer. App: see mobile repo doc (timeouts, 37 `Linking.openURL` guards, error boundaries, Sentry capture) — shipped via OTA. |
| 🟢 **UI/Dev** | [SESSION_CHANGES_2026-07-06_FIVE_ELEMENT_AUDIT_2.md](./SESSION_CHANGES_2026-07-06_FIVE_ELEMENT_AUDIT_2.md) | **Audit #2 (contact, SEO, blog, delivery, security).** CRITICAL: Product JSON-LD price leak removed. HIGH: unknown emirate granted free shipping (now fails closed); `/api/analytics` was public (revenue+PII) → admin-gated. Rate-limited cod-confirmation/skin-analysis/pdf-download; HSTS added. Blog: Arabic mobile list localized, view-count double-increment fixed, JSON-LD `</script>` escaping, HTML-stripped descriptions, comment cap+sanitize. SEO: noindex EN account pages, x-default hreflang, logo 404 fix. Contact form is intentionally WhatsApp/email links (no dead form). |
| 🟢 **UI/Dev** | [SESSION_CHANGES_2026-07-06_NEWSLETTER_AUDIT.md](./SESSION_CHANGES_2026-07-06_NEWSLETTER_AUDIT.md) | **Newsletter audit + mobile capture fix.** Backend confirmed fully live (subscribe API + honeypot/rate-limit + welcome email + unsubscribe + admin) — the "stubbed" code comment was stale. Real gap: the only signup form was the desktop-only homepage hero, so mobile/PWA visitors (redirected to /products, footer hidden) couldn't subscribe. Added compact `NewsletterSignup` card to /products (same API, EN/AR/RU, RTL). |
| 🟢 **UI/Dev** | [SESSION_CHANGES_2026-07-06_FIVE_ELEMENT_AUDIT_FIXES.md](./SESSION_CHANGES_2026-07-06_FIVE_ELEMENT_AUDIT_FIXES.md) | **Five-element audit + fixes (cart/checkout, favorites, profile, push, admin).** CRITICAL closed: profile IDOR + isAdmin self-grant; unauthenticated dead push route deleted; wishlist moved from in-memory Map to new `wishlist_items` DB table (live product data, self-healing); mobile wishlist DELETE 404. HIGH: admin logout cookie, deletion PII erasure (addresses+push+tokenVersion), COD order-number mismatch, order notes finally persisted, web phone validation, guest-favorite merge, push token cleared on logout. Deferred items listed with rationale. |
| 🟢 **UI/Dev** | [SESSION_CHANGES_2026-07-06_HOME_PAGE_REWORK.md](./SESSION_CHANGES_2026-07-06_HOME_PAGE_REWORK.md) | **Home page rework.** "What's popular" now computed from real sales (units sold, paid+delivered-COD, 180d; top-4 verified vs production data) with curated fallback; bestsellers moved under hero; category tiles redesigned (neutral wells, no pastel gradients, fixed mid-word title break, per-tile product counts); concern cards unified to brand styling with count chips matching landing pages. EN/AR/RU + RTL verified; live on genosys.ae. |
| 🟢 **UI/Dev** | [SESSION_CHANGES_2026-07-06_SEARCH_AUDIT_FIXES.md](./SESSION_CHANGES_2026-07-06_SEARCH_AUDIT_FIXES.md) | **Search audit + fixes (web+app).** Substring search failed on word order (`serum hyaluron` → 0) and ignored RU/AR names on web (`сыворотка` → 0, 63/65 products have them). New shared `lib/productSearch.ts`: tokenized AND matching, EN/RU/AR haystack, diacritic/harakat folding; suggestions dropdown aligned; stale 51/52 "newest" pinning removed; `trackSearch` wired (debounced, with `results_count` → zero-result queries visible in GA). App `shop.js` search matched to same semantics (OTA-safe). |
| 🟢 **UI/Dev** | [PAYMENT_INTEGRITY_AUDIT_2026-07-06.md](./PAYMENT_INTEGRITY_AUDIT_2026-07-06.md) | **Checkout/payment money-path audit.** Verified: webhook signature check, server-authoritative amounts (no client tampering), exactly-once paid-transition + emails (atomic claim), order dedup. Added a **paid-amount reconciliation** log (flags when Stripe's charged amount ≠ order total — catches promo codes/partial captures/bugs; log-only, never blocks). Flagged `allow_promotion_codes: true` + missing Stripe idempotency key for review. |
| 🟢 **UI/Dev** | [EMAIL_TEMPLATES_AUDIT_2026-07-06.md](./EMAIL_TEMPLATES_AUDIT_2026-07-06.md) | **Admin email "Order Source" (app vs website)** — derived from the order-number channel letter (`GENCardM`/`CODM` = app, `…W` = website; `paymentMetadata.source` backstop), rendered admin-only in `adminNewOrder`; verified on live orders. **Customer confirmation footer polish** — support row (WhatsApp + email), Shop/Instagram/Track links, bolded legal entity + Dubai UAE, EN/AR/RU. Suggestions logged (unify contact info, apply footer to other emails, TRN line). |
| 🟢 **UI/Dev** | [ORDERS_AUDIT_2026-07-06.md](./ORDERS_AUDIT_2026-07-06.md) | **Orders & tracking audit.** Access control verified sound. Fixed: web `/orders` showed raw "CONFIRMED"/"PAID" (missing from status labels/colors — CONFIRMED is live in prod); mobile missing `out_for_delivery`. Rate-limited the public tracking endpoint (order numbers are sequential/guessable → was bulk-enumerable for customer names/items/totals). |
| 🟢 **UI/Dev** | [AUTH_LOGIN_HARDENING_2026-07-06.md](./AUTH_LOGIN_HARDENING_2026-07-06.md) | **Login hardening (web+app).** `tokenVersion` revocation (password reset now logs out ALL devices; enforced at session/refresh/validate), 48 legacy plaintext passwords migrated to bcrypt + lazy-upgrade code removed, method-agnostic social-login message, timing-safe mobile token compare, register min 8 chars, AASA `webcredentials` + app entitlement + AutoFill props (TestFlight build 94), biometric v1 payloads auto-upgrade to token + password purge. |
| 🟢 **UI/Dev** | [CHAT_ASSISTANT_AUDIT_2026-07-06.md](./CHAT_ASSISTANT_AUDIT_2026-07-06.md) | **AI chat (Genie) audit.** All 53 prompt products verified live. Fixed: eye-care advice carded the SCALP BRUSH (id 61 vs 17); dead Needle Pen-K (404) removed; mobile infinite spinner on failed cards; 12 missing sellable products added to the catalog (PDRN ampoules, Cerabarrier, Revita Glow BB, collagen mask, hair stamp, all 6 beauty boxes). |
| 🟢 **UI/Dev** | [PASSWORD_RESET_AUDIT_2026-07-06.md](./PASSWORD_RESET_AUDIT_2026-07-06.md) | **Password reset full audit.** Backend solid (hashed single-use 30-min tokens, enumeration-proof, rate-limited). Fixed: email had button-only (no copyable link) while the app demanded a "reset code" → dead end; email now has a plain-link fallback, app accepts pasted link OR token + deep-link prefill, token table now purged. Flagged: sessions survive reset; register allows 6-char vs reset 8. |
| 🟢 **UI/Dev** | [PRICING_ALIGNMENT_AUDIT_2026-07-06.md](./PRICING_ALIGNMENT_AUDIT_2026-07-06.md) | **Full pricing audit web vs app vs server.** Architecture confirmed sound (server-authoritative, contract-driven). Fixed: mobile beauty-box product-number set (server parity), web CartClient's duplicated shipping table → shared `MOBILE_CHECKOUT_CONFIG`. Documented accepted gaps (recommendation surfaces show retail to VIPs) + where every pricing rule lives. |
| 🟢 **UI/Dev** | [SESSION_CHANGES_2026-07-06_BUILD_YOUR_SET_AUDIT_FIXES.md](./SESSION_CHANGES_2026-07-06_BUILD_YOUR_SET_AUDIT_FIXES.md) | **Build Your Set audit fixes.** Cross-step toggle bug fixed (multi-category products silently removed from set); "Required" → "Recommended" + Skip on any empty step; Bio Meso ampoules → Serum step; SRS re-admitted (Peeling step + checkout guards); variant-aware modal price; VIP-aware discount label; tiers deduped into `bundleStore`; dead `calculatePricing` removed. Mobile counterpart aligned bag totals to best-discount-wins. Audit: [BUILD_YOUR_SET_AUDIT_2026-07-06.md](./BUILD_YOUR_SET_AUDIT_2026-07-06.md). |
| 🟢 **UI/Dev** | [SESSION_CHANGES_2026-07-05_HAIRSTAMP_64_MAIN_IMAGE_NODE24_UPGRADE.md](./SESSION_CHANGES_2026-07-05_HAIRSTAMP_64_MAIN_IMAGE_NODE24_UPGRADE.md) | **Product 64 (Hair Stamp) main image** → `/images/needles/main.jpg` (1024²); old `BStamp1.png` deleted (404 verified). **Montaji PDF check**: repo/Desktop/live copies byte-identical (`d915adfa` already pushed) — nothing new to deploy. **Local Node 16 → 24.18.0 LTS** via official pkg; homebridge 2.1.0 + config-ui-x 5.24.0 + miot 1.8.7 reinstalled, daemon restarted clean. |
| 🟢 **UI/Dev** | [SESSION_CHANGES_2026-07-05_DEPENDENCY_UPDATES_SEMVER_SAFE.md](./SESSION_CHANGES_2026-07-05_DEPENDENCY_UPDATES_SEMVER_SAFE.md) | **Dependency refresh, tier 1 (semver-safe).** next 16.2.10, react 19.2.7, stripe 22.3.0 (+ apiVersion pin → `2026-06-24.dahlia` in 4 files), sentry, playwright, tailwind, etc. Build 433/433 pages + prod smoke test OK. Majors deferred + documented (ai 7, nodemailer 9, pdfjs 6, lucide 1.x, Expo SDK 57…). Mobile app already aligned to SDK 54. |
| 🟢 **UI/Dev** | [SESSION_CHANGES_2026-07-05_BIO_MESO_5000_GALLERY_S1_S4.md](./SESSION_CHANGES_2026-07-05_BIO_MESO_5000_GALLERY_S1_S4.md) | **Product 65 (Bio-Meso PDRN 5000)** — four 1024² studio shots (`s1`–`s4.jpeg`) added as DB gallery after the main image; verified live on PDP + API. |
| 🟢 **UI/Dev** | [SESSION_CHANGES_2026-07-05_OG_IMAGE_CDN_CACHE_WHATSAPP_PREVIEWS.md](./SESSION_CHANGES_2026-07-05_OG_IMAGE_CDN_CACHE_WHATSAPP_PREVIEWS.md) | **WhatsApp link previews — intermittent missing images fixed.** Dynamic `opengraph-image` / `twitter-image` routes (EN/AR/RU products + blog) were never CDN-cached (`max-age=0` → every fetch a 1-4s cold render → WhatsApp preview timeout). `revalidate` alone was overridden by `ImageResponse`'s own header; the real fix is explicit `Cache-Control` (s-maxage=86400 + SWR) in `lib/ogImages.tsx`. Verified live: `x-vercel-cache: HIT`, sub-second responses. |
| 🟢 **UI/Dev** | [SESSION_CHANGES_2026-07-05_PRODUCT_CARD_FULL_IMAGE_PREVIEWS.md](./SESSION_CHANGES_2026-07-05_PRODUCT_CARD_FULL_IMAGE_PREVIEWS.md) | **Product card previews — no clipping.** Iterated `object-cover` → `object-contain` → blurred backdrop → **FINAL: square `aspect-square` frames + `object-contain` on white** (no padding, no backdrop). Square studio photos fill edge-to-edge; wide photos letterbox invisibly. Covers products grid, favorites, PWA, related-products, home bestsellers, concern grids, search dropdown. Also logs Cerabarrier (66) + Bio-Meso (65) main-image swaps to square studio shots. |
| 🟢 **UI/Dev** | [SESSION_CHANGES_2026-07-05_PDP_STOCK_BADGE_REPOSITION.md](./SESSION_CHANGES_2026-07-05_PDP_STOCK_BADGE_REPOSITION.md) | **PDP "In Stock" badge** moved from an absolute overlay **on top of** the main photo to its **own row above** the image (`ProductImageGallery.tsx`); vertical thumbnail rail gets `lg:pt-10` to re-align. No more overlap on any photo aspect ratio. |
| 🟢 **UI/Dev** | [SESSION_CHANGES_2026-07-05_PDRN_MASK_MAIN_IMAGE_SWAP.md](./SESSION_CHANGES_2026-07-05_PDRN_MASK_MAIN_IMAGE_SWAP.md) | **Product 52 (SKIN REBOOT PDRN MASK PACK)** — DB main image → `/images/pdrn_mask/main.jpeg` (1024²); 2 old box renders removed from gallery; video kept. |
| 🟢 **UI/Dev** | [SESSION_CHANGES_2026-07-05_BIO_FERMENT_MAIN_IMAGE_SWAP.md](./SESSION_CHANGES_2026-07-05_BIO_FERMENT_MAIN_IMAGE_SWAP.md) | **Product 51 (BIO-FERMENT AGE DEFYING POWDER MASK)** — DB main image → `/images/bio_ferment/bferment_main.jpg` (1024²); plain white-jar render removed; modified `Ferment_3.jpeg` re-shipped as cache-busted `/images/bio_ferment/bferment_model.jpg`. |

### Operations & Accounting (2026-07-06)

| Priority | Document | Description |
|----------|----------|-------------|
| 🟡 **Important** | [SESSION_CHANGES_2026-07-07_KOREA_REORDER_DOUBLECHECK.md](./SESSION_CHANGES_2026-07-07_KOREA_REORDER_DOUBLECHECK.md) | **Korea reorder recheck** — live MoySklad 2026-07-07; **~1,435 u** proposed (add algae/cushion/SPF40; drop PDRN home/Cerabarrier); 260616 + Jun3 PO fully received. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-06_MELIS_SARIOGLU_CUSHION_RETAIL_ORDER.md](./SESSION_CHANGES_2026-07-06_MELIS_SARIOGLU_CUSHION_RETAIL_ORDER.md) | **Melis Sarioglu** (Paloma Tower 1204) — SO **GENCardM2607066552** + inv **04776** + ship **06488** + pay **05899** / **300 AED** (Beige cushion + free delivery); PDF → `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-06_TATIANA_ANISKINA_CONSIGNMENT_SALES.md](./SESSION_CHANGES_2026-07-06_TATIANA_ANISKINA_CONSIGNMENT_SALES.md) | **Tatiana Aniskina Nail Master** — consignment sales **01401** / **520 AED** + paymentin **05895** + replenishment demand **06485** / **1,050 AED**; PDFs → `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-06_MISS_VALERIYA_CUSHION_RETAIL_ORDER.md](./SESSION_CHANGES_2026-07-06_MISS_VALERIYA_CUSHION_RETAIL_ORDER.md) | **Miss Valeriya** (+971585207755) — SO **GENCardM2607067755** + inv **04773** + ship **06484** + pay **05894** / **345 AED** (Beige cushion + delivery); PDF → `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-06_BROW_BEAUTY_CLINIC_ORDER.md](./SESSION_CHANGES_2026-07-06_BROW_BEAUTY_CLINIC_ORDER.md) | **Brow and Beauty Aesthetic Clinic L.L.C** — new counterparty (license 1582255) + PO **GENCardM260706BBAC** / **17,885 AED** (PDRN ×30 packs). |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-06_AMERICAN_MEDICAL_CENTER_HAIR_CASH.md](./SESSION_CHANGES_2026-07-06_AMERICAN_MEDICAL_CENTER_HAIR_CASH.md) | **American Medical Center DMCC** — invoice **04772** + shipment **06483** + cashin **00175** / **335 AED** (HR³ tonic + scalp peeling + delivery 45); Legal_TAX PDF → `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-01_COSMIDEN_MYLINE_CONSIGNMENT_SALES.md](./SESSION_CHANGES_2026-07-01_COSMIDEN_MYLINE_CONSIGNMENT_SALES.md) | **Cosmiden / Myline** — report **01389** / **1,339 AED** (June 2026 consignment sales); paymentin **05893** full settlement **2026-07-06**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-01_ECLATANT_CONSIGNMENT_SALES.md](./SESSION_CHANGES_2026-07-01_ECLATANT_CONSIGNMENT_SALES.md) | **Eclatant** — consignment sales **01388** / **1,498 AED** (June 2026); paymentin **05896** full settlement **2026-07-06**. |

### Operations & Accounting (2026-07-05)

| Priority | Document | Description |
|----------|----------|-------------|
| 🔴 **CRITICAL** | [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) | **Start here!** Tech stack, project structure, patterns |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-05_VALERIIA_REUTA_RETAIL_ORDER.md](./SESSION_CHANGES_2026-07-05_VALERIIA_REUTA_RETAIL_ORDER.md) | **Miss Valeriia Reuta** — SO **GENCardM2607058965** + invoice **04770** + shipment **06481** + paymentin **05891** / **1,377 AED** (10% off + delivery 45); card renamed; **Доставлен**; PDF → `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-05_LOVE_MY_BODY_SPF40_FIX.md](./SESSION_CHANGES_2026-07-05_LOVE_MY_BODY_SPF40_FIX.md) | **Love My Body** — report **01400** SPF50 sold (2,660); demand **06474** SPF40 shipped (2,640); stock note PDF re-exported + printed landscape. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-05_LOVE_MY_BODY_SPF40_DEMAND.md](./SESSION_CHANGES_2026-07-05_LOVE_MY_BODY_SPF40_DEMAND.md) | **Love My Body** — demand **06481** created then **deleted** (SPF 40 ×1 / 105 AED); PDF on disk is stale. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-05_LAURA_ABIZOVA_RETAIL_ORDER.md](./SESSION_CHANGES_2026-07-05_LAURA_ABIZOVA_RETAIL_ORDER.md) | **Miss Laura Abizova** — SO **GENCardM2607059596** + invoice **04769** + shipment **06480** + payment **05890** / **1,310 AED**; order **Доставлен**; retail PDF printed. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-05_SALES_BONUS_PAYMENTOUT.md](./SESSION_CHANGES_2026-07-05_SALES_BONUS_PAYMENTOUT.md) | **Sales bonus** — paymentout **00645** / **1,339.40 AED** → Vadim Sagatdinov (Wio LN82276115992176; June 2026 bonus). |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-05_SARA_PRESENT_WRITEOFF.md](./SESSION_CHANGES_2026-07-05_SARA_PRESENT_WRITEOFF.md) | **Present to Sara** — loss **00008-00464** / **136.97 AED** @ buyPrice: PDRN 5000 ×1, post cream 100g ×1, peptide masks ×5. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-05_PEPTIDE_REVITA_CVS_WRITEOFF.md](./SESSION_CHANGES_2026-07-05_PEPTIDE_REVITA_CVS_WRITEOFF.md) | **Write-off** — loss **00008-00463** / **57.86 AED** @ buyPrice: peptide mask ×1, Revita Bright ×1, expired CVS vials ×2. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-05_VANESS_PRESENT_WRITEOFF.md](./SESSION_CHANGES_2026-07-05_VANESS_PRESENT_WRITEOFF.md) | **Present to Vaness** — loss **00008-00462** / **264.29 AED** @ buyPrice: hyaluron cream+serum, Snow O₂ 500ml, PDRN mask pack, EZ box, SPF40. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-05_LE_CIEL_COUNTERPARTY_UPDATE.md](./SESSION_CHANGES_2026-07-05_LE_CIEL_COUNTERPARTY_UPDATE.md) | **Le Ciel** — renamed to **LE CIEL BEAUTY SPOT… LLC S.O.C**; license **1612620** (was 784011); invoice **04765** PDF reissued. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-05_LE_BLEU_CIEL_CUSHION_ORDER.md](./SESSION_CHANGES_2026-07-05_LE_BLEU_CIEL_CUSHION_ORDER.md) | **Le Ciel** — SO **GENCardM2607057775** + invoice **04765** + shipment **06476** / **750 AED** (Beige cushion ×3, Ivory ×2 @ clinic list); Legal_TAX PDF landscape → `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-04_LOVE_MY_BODY_COMMISSION_DEMAND.md](./SESSION_CHANGES_2026-07-04_LOVE_MY_BODY_COMMISSION_DEMAND.md) | **Love My Body Salon** — report **01400** / **2,660** + demand **06474** / **2,640** (June sold; agreement **27**; SPF50 sold / SPF40 shipped). |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-04_X_BEAUTY_CONSULTING_OLGA_ORDER.md](./SESSION_CHANGES_2026-07-04_X_BEAUTY_CONSULTING_OLGA_ORDER.md) | **X Beauty Consulting** — SO **GENCardM260704XBCO** + invoice **04764** + shipment **06473** + cash in **00174** / **510 AED** (booster, overnight mask, sensitive serum, delivery; customer Olga). |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-04_X_BEAUTY_CONSULTING_YANA_ORDER.md](./SESSION_CHANGES_2026-07-04_X_BEAUTY_CONSULTING_YANA_ORDER.md) | **X Beauty Consulting** — SO **GENCardM2607041778** + invoice **04763** + shipment **06472** + cash in **00173** / **735 AED** (PDRN 60000, post cream 100g, overnight mask, delivery; customer Yana). |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-04_PRESENTS_GIFT_WRITEOFF.md](./SESSION_CHANGES_2026-07-04_PRESENTS_GIFT_WRITEOFF.md) | **Presents write-off** — loss **00008-00461** / **271.74 AED** @ buyPrice: bio ferment×1, peptide gel mask×10, collagen×10, sea algae×10, post cream 20g×4. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-04_FAMILY_CLASS_POLYCLINIC_HAIR_TONIC_ORDER.md](./SESSION_CHANGES_2026-07-04_FAMILY_CLASS_POLYCLINIC_HAIR_TONIC_ORDER.md) | **Family Class Polyclinic** — SO **GENCardM260704FCPH** + invoice **04762** + shipment **06471** / **560 AED** (hair tonic + solution box + delivery 45); Legal_TAX PDF landscape printed. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-03_MILENA_PAYMENTIN_04752.md](./SESSION_CHANGES_2026-07-03_MILENA_PAYMENTIN_04752.md) | **Milena Wasl** — paymentin **05871** @ **04752**/06455 / **1,500 AED** (RAK ref E2E00402607034309888); order **Доставлен**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-03_MISS_AIDANA_PROBLEM_CREAM_ORDER.md](./SESSION_CHANGES_2026-07-03_MISS_AIDANA_PROBLEM_CREAM_ORDER.md) | **Miss Aidana Yerkegaliyeva** — SO **GENCardM2607033838** + invoice **04761** + shipment **06470** + payment **05882** / **335 AED** (problem cream + delivery 45; FOC toner/PCS/HES + masks); PDF reprinted 2026-07-04. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-03_PRESENTS_GIFT_WRITEOFF.md](./SESSION_CHANGES_2026-07-03_PRESENTS_GIFT_WRITEOFF.md) | **Presents write-off** — loss **00008-00460** / **518.14 AED** @ buyPrice: EZ mask, PDRN 60000×2, PDRN 5000×2, SWS vials×10, radiance cream+serum, collagen×10, sea algae×10. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-03_YELIZAVETA_NABIEVA_CONSIGNMENT_REPORT.md](./SESSION_CHANGES_2026-07-03_YELIZAVETA_NABIEVA_CONSIGNMENT_REPORT.md) | **Yelizaveta Nabieva Cosmetologist** — report **01399** / **2,580 AED** (contract **00038**): full consignment remainder sold; partial payment **05881** **1,050 AED**; **1,530 open**; PDF in orders. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-03_MELANTA_REPLENISHMENT_DEMAND.md](./SESSION_CHANGES_2026-07-03_MELANTA_REPLENISHMENT_DEMAND.md) | **Melanta Poly Clinic** — demand **06469** / **1,280 AED** (contract **14**): Cushion Beige ×4, Bio-Meso **Homecare 5000** ×2, CERABARRIER 200ml ×2; stock note PDF printed. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-03_SERENE_SKIN_STOCK_RECON.md](./SESSION_CHANGES_2026-07-03_SERENE_SKIN_STOCK_RECON.md) | **Serene Skin stock recon (superseded)** — morning return 00302 reversed by stock adjust; see adjust doc. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-03_SERENE_SKIN_CONSIGNMENT_COUNT_INVESTIGATION.md](./SESSION_CHANGES_2026-07-03_SERENE_SKIN_CONSIGNMENT_COUNT_INVESTIGATION.md) | **Serene Skin** — consignment count vs printed report: report overstates SPF/cushion; hyaluron report shows 2 but only 1 ever shipped; clinic short on cleanser/PCC/blemish → unreported sales. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-03_DU_INTERNET_PAYMENTOUT.md](./SESSION_CHANGES_2026-07-03_DU_INTERNET_PAYMENTOUT.md) | **DU internet** — paymentout **00642** / **393.75 AED** / Apple Pay 03 Jul (acct 2856165422, txn 002171868239). |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-03_BRAU_LADIES_SPLIT_ORDERS.md](./SESSION_CHANGES_2026-07-03_BRAU_LADIES_SPLIT_ORDERS.md) | **Brau Ladies** — 2 separate chains: ADU **04757**/06464 **300 AED** (Hydro Cool) + JBR **04758**/06465 **760 AED** (peptide ×20); PDFs in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-03_KOREA_PO_260616_RECEIVE.md](./SESSION_CHANGES_2026-07-03_KOREA_PO_260616_RECEIVE.md) | **Korea PO DM GME 260616 ship** — supply **00187** / invoicein **00173** / paymentout **00643** / **55,453 AED**; PO fully received + paid. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-03_LIPS_FOR_KISS_ORDER.md](./SESSION_CHANGES_2026-07-03_LIPS_FOR_KISS_ORDER.md) | **Lips for Kiss Clinic** — SO **GENCardM260703LFK** + invoice **04759** + shipment **06467** / **2,990 AED**; paymentin **05873**; order **Доставлен**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-03_DELETE_01397_RENUMBER_ARFI.md](./SESSION_CHANGES_2026-07-03_DELETE_01397_RENUMBER_ARFI.md) | **Delete Refresh report 01397** — renumbered ARFI Barsha **01397**, Jumeirah **01398**; sales PDFs reissued. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-03_ARFI_JUMEIRAH_JUNE_CONSIGNMENT_SOLD.md](./SESSION_CHANGES_2026-07-03_ARFI_JUMEIRAH_JUNE_CONSIGNMENT_SOLD.md) | **ARFI Nails Jumeirah** — report **01398** + demand **06463** / **1,476 AED** (June sold, 11 pcs / agreement **30**); PDFs in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-03_ARFI_BARSHA_JUNE_CONSIGNMENT_SOLD.md](./SESSION_CHANGES_2026-07-03_ARFI_BARSHA_JUNE_CONSIGNMENT_SOLD.md) | **ARFI Nails Barsha** — report **01397** + demand **06462** / **3,821 AED** (June sold, 26 pcs / agreement **25**); PDFs in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-03_EVOLUTION_ANTIWINKLE_ORDER.md](./SESSION_CHANGES_2026-07-03_EVOLUTION_ANTIWINKLE_ORDER.md) | **Evolution Aesthetics Clinic** — SO **GENCardM260703EVOL** + invoice **04756** + shipment **06461** / **1,710 AED** (00190×3 + SPF×3 + Beige×4 + Ivory×2); PDF reissued. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-03_REVITA_GLOW_NATURAL_PRESENT_WRITEOFF.md](./SESSION_CHANGES_2026-07-03_REVITA_GLOW_NATURAL_PRESENT_WRITEOFF.md) | **Promotional present** — loss **00008-00457** / **31.40 AED** @ buyPrice: Revita Glow BB Natural `54473` ×1. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-02_CERRABAR_MUCOSAL_IRRITATION_CASE.md](./SESSION_CHANGES_2026-07-02_CERRABAR_MUCOSAL_IRRITATION_CASE.md) | **Post-market: CERABARRIER** — genital irritation case. **Revised dx (post-Canesten response): Candida balanitis (fungal)**, not irritant dermatitis; cleanser = **predisposing co-factor** (surfactant system — Cocamidopropyl Betaine 6% + Sodium Cocoyl Glutamate 8.75% + Parfum 0.5% — disrupted mucosal barrier/microbiome + low-viscosity run-off under prepuce → opportunistic Candida). **Product not defective**; use-area trigger, not toxicity. Logged as non-serious PMS case; reinforces need for RU/AR "not for mucosal/intimate use" copy. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-02_CERRABAR_FOLDER_INGEST.md](./SESSION_CHANGES_2026-07-02_CERRABAR_FOLDER_INGEST.md) | **Desktop `Cerrabar` folder ingest** — **NEW product GENOSYS CERABARRIER BIOME GEL CLEANSER** (200ml GCCL05 / 600ml GCCL06): full Formula/INCI (37 lines), COA LOT **6682FD** pH **6.37** (mfg 2026-04-24), multilingual artwork (EN/KR/DE/FR/TR/RU/AR), barcodes **8809849809834** / **8809849809841**, WhatsApp product shots; already mirrored to Intertek source-of-truth; **not yet in `lib/products.ts`** (recommended card id 66, category `Cleanser`); + normalized formula CSV. CFS is scanned image (OCR pending). |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-02_PERSONA_MARINA_JUNE_CONSIGNMENT_SOLD.md](./SESSION_CHANGES_2026-07-02_PERSONA_MARINA_JUNE_CONSIGNMENT_SOLD.md) | **First Person Marina** — report **01391** (June sold 3,033) + demand **06450** amended to **590 AED** (PCT 200ml×1, SPF40×2, Ultra Shield×2); PDF in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-02_MILENA_2LOCATIONS_CUSHION_ORDERS.md](./SESSION_CHANGES_2026-07-02_MILENA_2LOCATIONS_CUSHION_ORDERS.md) | **Milena** — 2 locations: Wasl **04752**/ **06455** (1,500) + JBR **04753**/ **06456** (900); cushions @ 150; PDFs in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-02_ADMIN_SHAKIROVNA_BEIGE_CUSHION_ORDER.md](./SESSION_CHANGES_2026-07-02_ADMIN_SHAKIROVNA_BEIGE_CUSHION_ORDER.md) | **Admin Shakirovna** — SO **GENCardM260702SHKB** + invoice **04749** + shipment **06451** / **630 AED** (Beige + overnight + serum + Snow Booster + delivery 15); PDF in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-02_MISS_AIDANA_BEIGE_CUSHION_ORDER.md](./SESSION_CHANGES_2026-07-02_MISS_AIDANA_BEIGE_CUSHION_ORDER.md) | **Miss Aidana Yerkegaliyeva** — SO **GENCardM2607023838** + invoice **04750** + shipment **06452** / **640 AED** (Beige cushion ×2 @ 300 + delivery 40); PDF in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-02_PERSONA_PALM_JUNE_CONSIGNMENT_SOLD.md](./SESSION_CHANGES_2026-07-02_PERSONA_PALM_JUNE_CONSIGNMENT_SOLD.md) | **Persona Palm Jumeirah** — report **01392** only / **3,429 AED** (June sold, 14 lines / 37 pcs, agreement **00078**); PDF in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-02_PERSONA_DOWNTOWN_JUNE_CONSIGNMENT_SOLD.md](./SESSION_CHANGES_2026-07-02_PERSONA_DOWNTOWN_JUNE_CONSIGNMENT_SOLD.md) | **Persona Downtown** — report **01393** only / **833 AED** (June sold, 6 lines, agreement **00077**); PDF in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-02_MELANTA_JUNE_CONSIGNMENT_SOLD.md](./SESSION_CHANGES_2026-07-02_MELANTA_JUNE_CONSIGNMENT_SOLD.md) | **Melanta Poly Clinic** — report **01396** only / **1,734 AED** (June sold, 8 lines / 14 pcs, agreement **14**); PDF in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-02_VOLNA_JUNE_CONSIGNMENT_SOLD.md](./SESSION_CHANGES_2026-07-02_VOLNA_JUNE_CONSIGNMENT_SOLD.md) | **Volna Beauty Salon** — report **01395** + demand **06454** / **2,390 AED** (June sold, 8 lines / 20 pcs, agreement **19**); PDFs in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-02_RISE_UP_CONSIGNMENT_DEMAND.md](./SESSION_CHANGES_2026-07-02_RISE_UP_CONSIGNMENT_DEMAND.md) | **Rise UP** — consignment demand **06457** / **4,410 AED** (34 pcs replenishment, agreement **34**); PDF in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-02_RISE_UP_CONSIGNMENT_RETURN.md](./SESSION_CHANGES_2026-07-02_RISE_UP_CONSIGNMENT_RETURN.md) | **Rise UP** — consignment return **00301** / **1,430 AED** (10 pcs, agreement **34**; amended 2026-07-03 Natural ×1); PDF in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-02_RISE_UP_STOCK_RECONCILIATION.md](./SESSION_CHANGES_2026-07-02_RISE_UP_STOCK_RECONCILIATION.md) | **Rise UP** — stock recon → report **01394** / **5,004 AED** sold (41 pcs, agreement **34**); PDF in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-02_VIKTORIIA_KLYMENKO_DEMAND.md](./SESSION_CHANGES_2026-07-02_VIKTORIIA_KLYMENKO_DEMAND.md) | **Viktoriia Klymenko** — demand **06449** / **680 AED** (patch box ×2 + Ivory cushion ×2 / agreement **33**). |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-02_CP_WORLD_PAYMENTOUT.md](./SESSION_CHANGES_2026-07-02_CP_WORLD_PAYMENTOUT.md) | **CP World freight** — paymentout **00641** / **12,074.05 AED** / invoice **V11180** (DM GME 260616 air, job AIGN-V00239). |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-02_SALIK_PAYMENTOUT.md](./SESSION_CHANGES_2026-07-02_SALIK_PAYMENTOUT.md) | **Salik toll** — paymentout **00640** / **100 AED** / DubaiPay Apple Pay 02 Jul (SP 138906046). |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-02_PRESENTS_GIFT_WRITEOFF.md](./SESSION_CHANGES_2026-07-02_PRESENTS_GIFT_WRITEOFF.md) | **Promotional presents** — loss **00008-00456** / **259.83 AED** @ buyPrice (PDRN, hydrocool, bio ferment, sea algae ×10, collagen ×10, Revita Bright ×2). |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-01_IULIA_BEAUTY_CONSIGNMENT_SOLD.md](./SESSION_CHANGES_2026-07-01_IULIA_BEAUTY_CONSIGNMENT_SOLD.md) | **IULIA Beauty Salon** — consignment sold (retail): report **01390** + demand **06447** / **2,572 AED** (agreement **28**, 17 lines / 25 pcs); PDFs in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-07-01_REVITA_GLOW_BRIGHT_WRITEOFF.md](./SESSION_CHANGES_2026-07-01_REVITA_GLOW_BRIGHT_WRITEOFF.md) | **Warehouse write-off** — loss **00008-00455** / **62.80 AED** @ buyPrice: Revita Glow BB Bright `54472` ×2. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-30_SERENE_SKIN_CONSIGNMENT_SOLD.md](./SESSION_CHANGES_2026-06-30_SERENE_SKIN_CONSIGNMENT_SOLD.md) | **Serene Skin** — consignment sold → report **01387** + demand **06436** / **857 AED** (agreement 00060); PDF in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-30_BRAU_LADIES_JUNE_INVOICE_PDFS.md](./SESSION_CHANGES_2026-06-30_BRAU_LADIES_JUNE_INVOICE_PDFS.md) | **Brau Ladies** — 7 June invoices exported to `~/Desktop/orders/GENOSYS_Brau_Ladies_*.pdf` (**5,620 AED** total). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-26_DESKTOP_26062026_FOLDER_INGEST.md](./SESSION_CHANGES_2026-06-26_DESKTOP_26062026_FOLDER_INGEST.md) | **Desktop `26062026` folder ingest** — Korea air **DM GME 260616**: invoice PDF (38 lines / USD 15,098.80), packing list (23 cartons / 324 kg), AWB **607-54108224**, declaration **1010113202326**, CPIP **160626-081300**, DNATA auth for CP WORLD DCL 745; normalized CSVs + **Air.xlsx** Montaji (18 cosmetic barcodes/qty from screenshot). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-30_INVENTORY_WRITE_OFF_CLEANSER_MIST.md](./SESSION_CHANGES_2026-06-30_INVENTORY_WRITE_OFF_CLEANSER_MIST.md) | **Warehouse write-off** — loss **00008-00452** / **58.75 AED** @ buyPrice: Snow O₂ cleanser 180ml `00021` ×1 + Microbiome mist `00188` ×1. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-30_BRAU_LADIES_BULK_PAYMENTINS.md](./SESSION_CHANGES_2026-06-30_BRAU_LADIES_BULK_PAYMENTINS.md) | **Brau Ladies Salon** — 8 invoices paid → paymentins **05837–05844** @ shipments / **5,050 AED** total; all orders **Доставлен**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-30_ABEER_MEKKI_CONSIGNMENT_SOLD.md](./SESSION_CHANGES_2026-06-30_ABEER_MEKKI_CONSIGNMENT_SOLD.md) | **Abeer Mekki** — consignment sold SPC/ROM/SOC/MSC ×1 → report **01386** / **598.50 AED** (−10% Al Ain rep); report only, no demand; PDF in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-30_MEDICLINIC_PAYMENTIN_04211.md](./SESSION_CHANGES_2026-06-30_MEDICLINIC_PAYMENTIN_04211.md) | **Mediclinic** — remittance **760 AED** (30 Jun) → paymentin **05836** @ invoice **04211** / shipment **05753** (UTR SE99992606303561). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-29_SALON971_CONSIGNMENT_SOLD.md](./SESSION_CHANGES_2026-06-29_SALON971_CONSIGNMENT_SOLD.md) | **Salon 971** — consignment recon: opening **06288** − photo remaining → report **01385** + demand **06430** / **1,080 AED** (6 pcs sold); PDF in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-28_INVENTORY_WRITE_OFF_EXPIRED.md](./SESSION_CHANGES_2026-06-28_INVENTORY_WRITE_OFF_EXPIRED.md) | **Warehouse write-off** — loss **00008-00451** / **867.65 AED** @ buyPrice (SPF40, bio ferment, masks, mist, SWS/SRS expired vials, hyal cream, multifun cream, eye patch). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-28_SHAKIROVNA_ELITE_CLINIC_COMMISSION.md](./SESSION_CHANGES_2026-06-28_SHAKIROVNA_ELITE_CLINIC_COMMISSION.md) | **Shakirovna Business Bay** — consignment sold 07.06–27.06: reports **01383** / **01384** + demands **06428** / **06429** / **1,707 AED** total (Elite 1,367 + Clinic 340). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-27_INSTAGRAM_DAILY_PRODUCT_CAROUSEL_STRATEGY.md](./SESSION_CHANGES_2026-06-27_INSTAGRAM_DAILY_PRODUCT_CAROUSEL_STRATEGY.md) | **Instagram daily product carousel strategy** — reusable 5-slide template (hook / what it is / how it works / proof / CTA), daily feed rotation across pro / home / education lanes, plus a concrete Bio Meso PDRN Ampoule 60000 carousel and copy-ready caption. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-28_MISS_NINA_RETAIL_ORDER.md](./SESSION_CHANGES_2026-06-28_MISS_NINA_RETAIL_ORDER.md) | **Miss Nina** — full cycle SO **GENCardM2606282249** / inv **04730** / ship **06421** / pay **05826** / **625 AED** (SPF50 + Hyaluron serum + delivery); paid; PDF in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-28_MALIKA_KHODZHAEVA_CLINIC_SO.md](./SESSION_CHANGES_2026-06-28_MALIKA_KHODZHAEVA_CLINIC_SO.md) | **Dr Malika Khodzhaeva** — clinic SO **GENCardM2606288573** / **1,820 AED** (delivery + 3 masks 100% off); inv/ship/pay pending. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-28_VALERIYA_BORSCHEVA_2_CLINIC_ORDERS.md](./SESSION_CHANGES_2026-06-28_VALERIYA_BORSCHEVA_2_CLINIC_ORDERS.md) | **Dr. Valeria Borscheva** — 2 clinic full cycles: O1 **GENCardM2606289446A** inv **04727** ship **06418** pay **05824** / **475**; O2 **…9446B** inv **04728** ship **06419** pay **05825** / **1,535** (sea algae+collagen+delivery 100% off). PDFs in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-27_MISS_ANNA_RETAIL_ORDER.md](./SESSION_CHANGES_2026-06-27_MISS_ANNA_RETAIL_ORDER.md) | **Miss Anna** — full cycle SO **GENCardM2606271583** / inv **04726** / ship **06417** / pay **05823** / **345 AED** (Beige cushion 00144 @300 + delivery 45); PDF in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-26_WE_OWE_CUSTOMER_AUDIT.md](./SESSION_CHANGES_2026-06-26_WE_OWE_CUSTOMER_AUDIT.md) | **«Мы должны» audit (corrected + fixed)** — consignment returns excluded from cash; Marina 882 fixed (00002/00006 → contract 00024); **real cash «мы должны» now = 0 accounts**; 42 accounts / 216,656 AED are consignment stock returned (no Взаимозачёт entity + report API 403 → no sweep). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-26_PERSONA_MARINA_RETURNS_RESTORE.md](./SESSION_CHANGES_2026-06-26_PERSONA_MARINA_RETURNS_RESTORE.md) | **First Person Marina** — restored **21** sales returns (5,368 AED); consignment stock ledger fixed; 9 phantom invoices stay voided. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-26_PERSONA_MARINA_LEGACY_BALANCE_FIX.md](./SESSION_CHANGES_2026-06-26_PERSONA_MARINA_LEGACY_BALANCE_FIX.md) | **First Person Marina** — voided **9** phantom invoices (23,769); returns restore in separate doc. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-26_PERSONA_MARINA_BALANCE_INVESTIGATION.md](./SESSION_CHANGES_2026-06-26_PERSONA_MARINA_BALANCE_INVESTIGATION.md) | **First Person Marina** — «**мы должны: 882 AED**» on pay **05819** = legacy return credit (**00002** 740 + **00006** 142); **550 retail chain OK**; full settlement **−18,401** (old 2020–21 invoices). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-26_PERSONA_MARINA_CONSIGNMENT_REPLENISHMENT.md](./SESSION_CHANGES_2026-06-26_PERSONA_MARINA_CONSIGNMENT_REPLENISHMENT.md) | **First Person Marina** — consignment ship **06412** / **1,545 AED** / agr. **00024** (cleanser, hair, eye cream, PDRN pack) + stock note PDF. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-26_SAMADHI_YOGA_PAYMENTOUT.md](./SESSION_CHANGES_2026-06-26_SAMADHI_YOGA_PAYMENTOUT.md) | **Wellness at Samadhi - Yoga** — paymentout **00635** / **139 AED** / Sundry operating expenses (26 Jun). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-26_ADMIN_SHAKIROVNA_RADIANCE_SPF_ORDER.md](./SESSION_CHANGES_2026-06-26_ADMIN_SHAKIROVNA_RADIANCE_SPF_ORDER.md) | **Admin Shakirovna** — SO **GENCardM260626SHKR** / inv **04721** / ship **06410** / pay **05818** / **285 AED** (00122 + 54457 + delivery 15). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-25_ELIZAVETA_PDRN_HOMECARE_ORDER_FIX.md](./SESSION_CHANGES_2026-06-25_ELIZAVETA_PDRN_HOMECARE_ORDER_FIX.md) | **Elizaveta website COD** — order **CODM2606256271** fixed **935→1,085** + inv **04719** / ship **06408** / PDF in `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-24_ADMIN_SHAKIROVNA_CAMEL_CUSHION_ORDER.md](./SESSION_CHANGES_2026-06-24_ADMIN_SHAKIROVNA_CAMEL_CUSHION_ORDER.md) | **Admin Shakirovna** — SO **GENCardM260624SHKC** / inv **04717** / ship **06406** / **165 AED** (Camel 54464 @150 + delivery 15). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-23_YANA_KHACHATUROVA_ORDER.md](./SESSION_CHANGES_2026-06-23_YANA_KHACHATUROVA_ORDER.md) | **Miss Khachaturova Yana** — SO **GENCardM260623YANA** / inv **04716** / ship **06405** / **1,585 AED** (radiance cream/serum, barrier cream, PDRN pack×2, Snow Booster×2). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-23_BRAU_LADIES_PEPTIDE_ORDER.md](./SESSION_CHANGES_2026-06-23_BRAU_LADIES_PEPTIDE_ORDER.md) | **Brau Ladies Salon** — SO **GENCardM260623BRAUP20** / inv **04714** / ship **06403** / **760 AED** (Peptide Gel Mask 00012 ×20 @ 38). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-23_KOREA_PO_DM_GME_260616_SHIPPING.md](./SESSION_CHANGES_2026-06-23_KOREA_PO_DM_GME_260616_SHIPPING.md) | **Korea shipping invoice DM GME 260616** — NEW PO **`DM GME 260616 ship`** / **55,453 AED** / **38 lines** / ETA Jul-15; 6 new SKUs + 00120 reactivated. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-22_PRESENTS_MIST_BB_WRITEOFF.md](./SESSION_CHANGES_2026-06-22_PRESENTS_MIST_BB_WRITEOFF.md) | **Presents write-offs** — **00448–00450** mist/BB/masks/hyaluron/PDRN / **254.60 AED** buy total. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-22_TONETRENDZ_PROTOCOL_ORDER.md](./SESSION_CHANGES_2026-06-22_TONETRENDZ_PROTOCOL_ORDER.md) | **TONETRENDZ** — protocol P2 clinic order **GENCardM2606222913** / inv **04713** / ship **06402** / pay **05809** / **1,725 AED** paid. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-22_KOREA_PO_54475_GCAP01.md](./SESSION_CHANGES_2026-06-22_KOREA_PO_54475_GCAP01.md) | **Korea PO PI 260605** — **54475** GCAP01 ×**5** + supply **00186**; invoice **00172** + payment **00634** aligned → **58,129.35 AED** all columns. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-22_SARA_PDRN_HOMECARE_ORDER_FIX.md](./SESSION_CHANGES_2026-06-22_SARA_PDRN_HOMECARE_ORDER_FIX.md) | **Sara website order** — **54475** mapped + full doc chain **GENCardM2606225559** / inv **04712** / ship **06401** / pay **05808** → **1,205 AED**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-22_SALIK_PAYMENTOUT.md](./SESSION_CHANGES_2026-06-22_SALIK_PAYMENTOUT.md) | **Salik toll** — paymentout **00632** / **100 AED** / expense *Car Fuel/Salik* (paid 22 Jun). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-22_RAKEZ_AMENDMENT_PAYMENTOUT.md](./SESSION_CHANGES_2026-06-22_RAKEZ_AMENDMENT_PAYMENTOUT.md) | **RAKEZ corporate amendment** — paymentout **00633** / **5,394.30 AED** / 20 May 2026 / receipt **5800833261**; paid from personal account → Partners' CA. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-22_FAMILY_CLASS_POLYCLINIC_HAIR_ORDER.md](./SESSION_CHANGES_2026-06-22_FAMILY_CLASS_POLYCLINIC_HAIR_ORDER.md) | **Family Class Polyclinic** — SO **GENCardM260622FCPH**, invoice **04708**, shipment **06397** / **875 AED** (HR³ Matrix ×1 each + delivery 45; qty corrected from ×2). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-22_ALLURE_REPLENISHMENT_DEMAND.md](./SESSION_CHANGES_2026-06-22_ALLURE_REPLENISHMENT_DEMAND.md) | **MoySklad Allure** — consignment shipment **06396** (agr. **00045**); **9 lines / 16 pcs / 2,490 AED** replenishment. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-22_ALLURE_COMMISSION_REPORT.md](./SESSION_CHANGES_2026-06-22_ALLURE_COMMISSION_REPORT.md) | **MoySklad Allure** — commission report **01382** (agr. **00045**); **6 lines / 12 pcs / 1,790 AED** consolidated sold items; report only. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-21_INSTAGRAM_CREAMS_CAPTION.md](./SESSION_CHANGES_2026-06-21_INSTAGRAM_CREAMS_CAPTION.md) | **Instagram creams texture caption** — copy direction for GENOSYS cream lineup visual, positioned as a choose-by-skin-need post with soft cosmetic claims and GENOSYS footer. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-21_MOFA_ATTESTATION_260616.md](./SESSION_CHANGES_2026-06-21_MOFA_ATTESTATION_260616.md) | **MOFA attestation** — paymentout **00631** / **304.41 AED** for **DM GME 260616** Jun 16 import (paid 21 Jun). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-21_LIUDMILA_STEPANOVA_MOYSKLAD_FIX.md](./SESSION_CHANGES_2026-06-21_LIUDMILA_STEPANOVA_MOYSKLAD_FIX.md) | **Liudmila Stepanova** — web **GENCardM2606211312** / **1,580.30 AED** full MoySklad chain; beauty-box auto-explosion + sync guardrails. |
| 🟡 **Security** | [SESSION_CHANGES_2026-06-12_DEP_AUDIT_ZERO_VULNS.md](./SESSION_CHANGES_2026-06-12_DEP_AUDIT_ZERO_VULNS.md) | **npm audit → 0 vulnerabilities** — grpc patched via audit fix; `overrides` block pins `tar` 7.5.16, `@hono/node-server` 1.19.13, `postcss` → `$postcss` (8.5.15, fixes Next's bundled 8.4.31). Remove overrides when prisma/next/pdfjs-dist update upstream. |
| 🟢 **SEO** | [SESSION_CHANGES_2026-06-12_GUIDES_SOFT_404_FIX.md](./SESSION_CHANGES_2026-06-12_GUIDES_SOFT_404_FIX.md) | **Guides soft-404 fix** — unknown guide slugs returned 404 UI with HTTP 200; `proxy.ts` now validates slugs against `SEO_LANDING_PAGES` and rewrites unknowns to an unrouteable path → real HTTP 404 on EN/AR/RU. Products/blog soft 404s remain (DB-backed slugs, follow-up). |
| 🟢 **SEO** | [SESSION_CHANGES_2026-06-12_AR_RU_GUIDES.md](./SESSION_CHANGES_2026-06-12_AR_RU_GUIDES.md) | **AR/RU guide translations** — all 8 SEO guides now exist in Arabic (`/ar/guides/*`, RTL) and Russian (`/ru/guides/*`) via `lib/seoLandingPagesAr.ts`/`Ru.ts`; en/ar/ru hreflang on all locales, localized sitemap entries, `proxy.ts` no longer redirects localized guide URLs to EN. Translations need native review. |
| 🟢 **SEO** | [SESSION_CHANGES_2026-06-12_OG_IMAGES_BRANDED_CARDS.md](./SESSION_CHANGES_2026-06-12_OG_IMAGES_BRANDED_CARDS.md) | **Branded OG share cards** — shared renderer in `lib/ogImages.tsx`; product cards now apply on EN/AR/RU (explicit raw-photo `openGraph.images` removed), per-guide title cards, blog title-card fallback when no featured image. |
| 🟡 **Performance** | [SESSION_CHANGES_2026-06-12_ADMIN_ORDERS_PAGINATION.md](./SESSION_CHANGES_2026-06-12_ADMIN_ORDERS_PAGINATION.md) | **Admin orders query cap** — `readOrders()` was an unbounded `findMany` with all items on every admin load; now capped (default 500, `?limit`/`?offset`, 2000 ceiling) + `countOrders()`. Response gains additive `total`/`limit`/`offset`; no UI change at current volume. |
| 🔴 **Security** | [SESSION_CHANGES_2026-06-12_JWT_HARDENING.md](./SESSION_CHANGES_2026-06-12_JWT_HARDENING.md) | **JWT hardening** — `JWT_SECRET` now hard-fails in prod when missing (was guessable fallback); legacy unsigned-JSON session cookies rejected (forgeable `{"isAdmin":true}` passed the orders admin gate). One-time logout for pre-migration cookies only. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-20_GOCOSMO_DEMAND_LETTER.md](./SESSION_CHANGES_2026-06-20_GOCOSMO_DEMAND_LETTER.md) | **GOCOSMO** — report **01253** reverted to **2,509**; demand **15,710 AED** total; legal deadline **22 Jun 15:00**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-20_GOCOSMO_PARTIAL_PAYMENT.md](./SESSION_CHANGES_2026-06-20_GOCOSMO_PARTIAL_PAYMENT.md) | **GOCOSMO BEAUTY SALON** — report **01253** expanded **2,509 → 5,000 AED** then **reverted**; draft payment **05801** deleted / contract **13**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-21_GOCOSMO_CONSIGNMENT_RETURN.md](./SESSION_CHANGES_2026-06-21_GOCOSMO_CONSIGNMENT_RETURN.md) | **GOCOSMO** — physical stock recovery **48 pcs / 5,507 AED**; return note PDF on Desktop + salesreturn **00299** (Contract **13**). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-21_GOCOSMO_REPORT_01253_3000_PAYMENT.md](./SESSION_CHANGES_2026-06-21_GOCOSMO_REPORT_01253_3000_PAYMENT.md) | **GOCOSMO** — report **01253** **3,000 AED** paid (**05803**); FAB **FT261711H65M** 20 Jun 2026. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-21_GOCOSMO_RETURN_1699_SUPPLEMENT.md](./SESSION_CHANGES_2026-06-21_GOCOSMO_RETURN_1699_SUPPLEMENT.md) | **GOCOSMO** — supplemental return **00300** **1,699 AED**; book now **5,504 AED** (= 14,011−3,000−5,507). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-21_GENE_REBIRTH_DISPLAY_WRITEOFF.md](./SESSION_CHANGES_2026-06-21_GENE_REBIRTH_DISPLAY_WRITEOFF.md) | **Loss 00008-00447** — Gene Re-Birth testers → **Persona Palm Jumeirah** (HSC/MFC/MHC/EPG ×1) @ buyPrice **133 AED**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-21_TONETRENDZ_FOLDER_PDFS.md](./SESSION_CHANGES_2026-06-21_TONETRENDZ_FOLDER_PDFS.md) | **TONETRENDZ** — tax invoice **04685** + consignment stock note **06326** PDFs → `Contract_Customers/Toner_Trends/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-21_TONETRENDZ_CONSIGNMENT_REPLENISHMENT.md](./SESSION_CHANGES_2026-06-21_TONETRENDZ_CONSIGNMENT_REPLENISHMENT.md) | **TONETRENDZ** — consignment **06394** / **970 AED** (Camel×3, hyaluron serum×2, peptide mask×5) — **merged into 06326** (see merge doc). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-19_VOLNA_PDRN_MASK_DEMAND.md](./SESSION_CHANGES_2026-06-19_VOLNA_PDRN_MASK_DEMAND.md) | **Volna Beauty Salon** — consignment shipment **06388** / **800 AED** (PDRN mask pack 54467 ×4 @ 200) / contract **19**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-19_ADMIN_EGOISTKA_CAMEL_ORDER.md](./SESSION_CHANGES_2026-06-19_ADMIN_EGOISTKA_CAMEL_ORDER.md) | **Admin Egoistka Salon** (new) — full chain **GENCardM260619EGOK** → invoice **04700** → shipment **06386** → paymentin **05794** / **600 AED clinic** (Camel cushion ×4 @ 150); PDF on Desktop. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-18_BRUNHILDE_MARIE_RETAIL_ORDER.md](./SESSION_CHANGES_2026-06-18_BRUNHILDE_MARIE_RETAIL_ORDER.md) | **Brunhilde Marie** (new) — full chain **GENCardM2606181388** → invoice **04697** → shipment **06383** → paymentin **05791** / **333 AED** (collagen×6, sea algae×2 @ 36, delivery 45); PDF on Desktop. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-18_HEIKE_LUTZ_RETAIL_ORDER.md](./SESSION_CHANGES_2026-06-18_HEIKE_LUTZ_RETAIL_ORDER.md) | **Miss Heike Lutz** — SO **GENCardW2606187940** / **1,870 AED retail** (repair oxymask, overnight mask, anti-wrinkle serum+cream, hyaluron serum+cream; Excellent Delivery **100% off**); invoice pending. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-18_MOYSKLAD_GENOSYS_NAME_PREFIX.md](./SESSION_CHANGES_2026-06-18_MOYSKLAD_GENOSYS_NAME_PREFIX.md) | **MoySklad naming** — 49 active products renamed to **Genosys …** prefix; Delivery / Excellent Delivery unchanged. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-18_KOREA_PO_DM_GME_260616.md](./SESSION_CHANGES_2026-06-18_KOREA_PO_DM_GME_260616.md) | **Korea PO DM GME 260616** — invoice ingest **27,911.19 AED** / 493 units; new SKUs **54475/54478/54479/54476** + reactivated **00121**; sample buys aligned; FOC EPI/overnight/shampoo. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-18_PROSPECT_PROMO_GIFT_WRITEOFF.md](./SESSION_CHANGES_2026-06-18_PROSPECT_PROMO_GIFT_WRITEOFF.md) | **Prospect/promo gifts** — loss **00008-00446** / **792.05 AED** @ buyPrice (90 pcs: SPF40, mist, cleanser, camel cushion, masks, power solutions, SRS, hyaluron serum). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-17_OLGA_PERSHAY_BLEMISH_CUSHION_ORDER.md](./SESSION_CHANGES_2026-06-17_OLGA_PERSHAY_BLEMISH_CUSHION_ORDER.md) | **Miss Olga Pershay** — SO **GENCardM2606177315** → invoice **04690** → shipment **06374** / **550 AED retail** (Revita Glow Natural×1 @ 250, cushion #2 beige×1 @ 300); PDF on Desktop. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-17_YULA_BEAUTY_SALON_EYECELL_HAIR_ORDER.md](./SESSION_CHANGES_2026-06-17_YULA_BEAUTY_SALON_EYECELL_HAIR_ORDER.md) | **Yula Beauty Salon LLC** — SO **GENCardM2606174821** → invoice **04689** → shipment **06373** / **1,060 AED** (EyeCell kit×1, hair solution pro box×1, stamp 0.25mm×2); PDF on Desktop. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-17_MARYNA_SOLOMATINA_FULL_CHAIN.md](./SESSION_CHANGES_2026-06-17_MARYNA_SOLOMATINA_FULL_CHAIN.md) | **Maryna Solomatina** — web **GENCardW2606176876** full chain **2,801.80 AED** (order → invoice **04686** → shipment **06372** → paymentin **05781**); beauty boxes exploded; PDF on Desktop. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-17_MARYNA_SOLOMATINA_ORDER_MOYSKLAD_MAP.md](./SESSION_CHANGES_2026-06-17_MARYNA_SOLOMATINA_ORDER_MOYSKLAD_MAP.md) | **Maryna Solomatina** — web **GENCardW2606176876** / **2,801.80 AED** (2 beauty boxes + EPI peeling×2 + 2 free masks); MoySklad pick map — explode boxes to singles (**00021×2, 00022×2, 00140×4, 00063×6**, etc.). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-16_VALERIYA_BORSCHEVA_EZ_MASK_ORDER.md](./SESSION_CHANGES_2026-06-16_VALERIYA_BORSCHEVA_EZ_MASK_ORDER.md) | **Dr. Valeria Borscheva** — SO **GENCardM2606179446** → invoice **04684** → shipment **06370** / **275 AED** (EZ mask box×1 @ 230, Excellent Delivery 45); PDF on Desktop. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-16_JUNE_CLOSE_PROJECTION.md](./SESSION_CHANGES_2026-06-16_JUNE_CLOSE_PROJECTION.md) | **June 2026 close projection** — MTD +18.4k net (16d); base-case **~+45k** full month (run-rate sales + May-like opex); YTD −58.7k through 16 Jun. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-16_DM_IMPORT_FEE_CPIP_160626.md](./SESSION_CHANGES_2026-06-16_DM_IMPORT_FEE_CPIP_160626.md) | **Dubai Municipality import fee** — paymentout **00627** / **70 AED** / expense DM Import Fee / **CPIP-160626-081300** (DM GME 260616). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-16_BRAU_LADIES_HYDRO_PEPTIDE_ORDER.md](./SESSION_CHANGES_2026-06-16_BRAU_LADIES_HYDRO_PEPTIDE_ORDER.md) | **Brau Ladies Salon LLC** — SO **GENCardM260616BRAU** → invoice **04683** → shipment **06369** / **1,060 AED** (Hydro Cool 1kg×1 @ 300, peptide mask single×20 @ 38); PDF on Desktop. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-16_DOMINIKA_PROBLEM_CONTROL_ORDER.md](./SESSION_CHANGES_2026-06-16_DOMINIKA_PROBLEM_CONTROL_ORDER.md) | **Dominika Heidenreichova** — SO **GENCardM2606166866** → invoice **04681** → shipment **06367** / **880 AED** (Problem Control toner×1 @ 260, serum×1 @ 330, cream×1 @ 290); PDF on Desktop. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-16_VIKTORIIA_KLYMENKO_COMMISSION_REPORT.md](./SESSION_CHANGES_2026-06-16_VIKTORIIA_KLYMENKO_COMMISSION_REPORT.md) | **Viktoriia Klymenko** — consignment report **01381** / **570 AED** (Beige×2, mist×1, peptide mask×5) / contract **33**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-16_ADMIN_SHAKIROVNA_CUSHION_PATCHES_ORDER.md](./SESSION_CHANGES_2026-06-16_ADMIN_SHAKIROVNA_CUSHION_PATCHES_ORDER.md) | **Admin Shakirovna** — SO **GENCardM260616SHKP** → invoice **04680** → shipment **06366** / **500 AED** (Beige cushion×2 @ 150, eye patch box×1 @ 190, delivery 10); PDF on Desktop. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-16_OLGA_VORONINA_RETAIL_ORDER.md](./SESSION_CHANGES_2026-06-16_OLGA_VORONINA_RETAIL_ORDER.md) | **Miss Olga Voronina** (Marina Terraces) — new customer → SO **GENCardM2606169051** → invoice **04678** → shipment **06364** / **145 AED** (Blemish Balm `00040` ×1 @ 125 + delivery 20); PDF on Desktop. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-16_ABEER_MEKKI_COMMISSION_REPORT.md](./SESSION_CHANGES_2026-06-16_ABEER_MEKKI_COMMISSION_REPORT.md) | **Abeer Mekki** — consignment report **01380** / **589.50 AED** (AFS serum×1 + EyeCell kit×1) / contract **31**; **−10% partner discount** on each line + noted in description. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-16_GENOSYS_EXPORT_ORDERFORM_CODES_INGEST.md](./SESSION_CHANGES_2026-06-16_GENOSYS_EXPORT_ORDERFORM_CODES_INGEST.md) | **GENOSYS Export Order Form (Codes.xlsx) ingest** — factory USD order form normalized into **184 line items** across 4 sheets (USD 128, Marketing 53, LED 1, Hair-Gentron 2) → `GENOSYS_Export_Orderform_Codes_2026_normalized.csv`; master reference for **barcodes, labeling codes, HS customs codes (3304.99.1000 / 9018.90.9080 / 9019.10.2000 / 8516.32.0000)** and USD wholesale prices ($0.8–$160). Distinct from the AED clinic price list. Script `ingest_genosys_export_orderform_codes_2026.py`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-16_TONETRENDZ_PROFESSIONAL_SO.md](./SESSION_CHANGES_2026-06-16_TONETRENDZ_PROFESSIONAL_SO.md) | **TONETRENDZ** — SO **GENCardM2606162913** / **775 AED** professional consumables (Snow O₂ 500ml×1, EZ CO₂ box×1, AWS vials×10); invoice pending. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-15_MELANTA_DEMAND_FROM_SO.md](./SESSION_CHANGES_2026-06-15_MELANTA_DEMAND_FROM_SO.md) | **Melanta Poly Clinic** — SO **GENCardM2606155578** (755 AED) → отгрузка **06361** under contract **14**, then SO deleted; overnight mask×2, Snow O₂×1, SPF50×2. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-15_EXPIRED_GIFT_WRITEOFF.md](./SESSION_CHANGES_2026-06-15_EXPIRED_GIFT_WRITEOFF.md) | **Expired + prospect gifts write-off** — Loss **00008-00445** / **564.90 AED** @ buyPrice / **52 pcs**: SWS×15, HES/PCS/CTS/SRS×5, peptide mask×15, EZ CO₂ box×1, Snow Booster 200ml×1. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-15_MARIA_TOLOCHKOVA_RETAIL_ORDER.md](./SESSION_CHANGES_2026-06-15_MARIA_TOLOCHKOVA_RETAIL_ORDER.md) | **Miss Maria Tolochkova** (existing customer) — delivery address updated to Sobha Heartland, The Crest, Tower B, Apt B0208 → SO **GENCardM2606155577** → invoice **04675** → shipment **06360** → paymentin **05770** / **356 AED** (Beige `00144` ×1 @ 300 + delivery 56); PDF on Desktop. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-14_MISS_ELENA_ZAKHAROVA_RETAIL_ORDER.md](./SESSION_CHANGES_2026-06-14_MISS_ELENA_ZAKHAROVA_RETAIL_ORDER.md) | **Miss Elena Zakharova** (Salon Egoistka, Marina) — new customer → SO **GENCardM2606141776** → invoice **04672** → shipment **06356** → paymentin **05766** / **170 AED** (Beige `00144` ×1 @ 150 + delivery 20); PDF on Desktop. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-14_RECON_FIXES_00588_QATAR_SUNDRY.md](./SESSION_CHANGES_2026-06-14_RECON_FIXES_00588_QATAR_SUNDRY.md) | **H1 recon fixes #2–#4 (backdated)** — `00588` MOFA fixed **0.00 → 304.41**; **Qatar Airways** (Jan 5) booked as **00620** Business Travel then corrected to **net AED 740** (28,830 of 29,570 refunded Jan 27); small Wio-card operational spend booked as month-end aggregates **00621–00625** = **AED 2,222.61** (new counterparty *Sundry Card Expenses (Wio AED)* + expense item *Sundry operating expenses*). Excludes Slider/Wio-fee/bonus/rent/MOFA/Qatar (no double-count). Script `moysklad-fix-recon-items-00588-qatar-sundry-20260614.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-14_PARTNERS_CURRENT_ACCOUNT_RENT_H1.md](./SESSION_CHANGES_2026-06-14_PARTNERS_CURRENT_ACCOUNT_RENT_H1.md) | **Office rent → Partners' Current Account** — rent paid from owner's personal account, not reimbursed → `Dr Rent / Cr Partners' CA (Due to Vadim)`, not a company-cash outflow (so correctly absent from Wio AED). MoySklad has **0 bank accounts** + paymentouts carry no `orgAccount` → it's an expense recorder, not a cash ledger. H1 2026 **AED 82,665.20 due to owner** (00536/00550/00570/00586/00601/00613). Same mechanism as 2025's AED 100,919 Partners' CA correction. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-14_AED_BANK_MOYSKLAD_RECON_H1.md](./SESSION_CHANGES_2026-06-14_AED_BANK_MOYSKLAD_RECON_H1.md) | **H1 AED bank ↔ MoySklad reconciliation** — Wio AED `9833011607` vs MoySklad H1 2026. Findings: **rent (~AED 82.7K) paid from owner's private account** (→ Partners' CA, resolved), `00588` booked **AED 0.00** (should be 304.41), Qatar Airways 29,570 confirm-booked, small card spend unbooked; Slider/Wio-fee/Korea explained. Script `reconcile-aed-bank-vs-moysklad-h1-2026.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-14_WIO_USD_ACCOUNT_INGEST_KOREA_RECON.md](./SESSION_CHANGES_2026-06-14_WIO_USD_ACCOUNT_INGEST_KOREA_RECON.md) | **Wio USD account ingest + Korea recon** — 1-yr USD statement (`9333280268`), pass-through for DTS MG; **27 Korea payments / USD 163,237** (~AED 599K); MoySklad DTSMG paymentouts **AED 529,192** → ~AED 70K gap = Korea prepayment/goods-in-transit + FX spread; script `ingest-wio-usd-statement-2025-2026.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-14_SLIDER_SUPPLIER_MOYSKLAD.md](./SESSION_CHANGES_2026-06-14_SLIDER_SUPPLIER_MOYSKLAD.md) | **Slider supplier + monthly delivery expense** — counterparty SLIDER DELIVERY SERVICE (TRN `105010526900003`); expense item "Last-mile delivery"; 6 monthly paymentouts **00614–00619** = **8,072.51 AED** (VAT 384.54); delivery P&L H1 ≈ **+4,978 AED net**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-14_SLIDER_2026_WIO_STATEMENTS_INGEST.md](./SESSION_CHANGES_2026-06-14_SLIDER_2026_WIO_STATEMENTS_INGEST.md) | **Wio H1 2026 ingest (Slider_2026)** — 6 CSVs Jan–Jun partial; AED current **54,281.84 → 26,363.36**; **344 Slider card charges / 7,909.93 AED**; Stripe/NI inflows **236,461 AED**; script `ingest-wio-slider-2026-statements.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-13_MISS_ANNA_RETAIL_ORDER.md](./SESSION_CHANGES_2026-06-13_MISS_ANNA_RETAIL_ORDER.md) | **Miss Anna** — SO **GENCardM2606133623** → invoice **04665** → shipment **06349** / **345 AED** (Beige cushion `00144` ×1 @ 300 + delivery 45); PDF on Desktop. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-12_KOREA_PO_PI_MISSING_LINES.md](./SESSION_CHANGES_2026-06-12_KOREA_PO_PI_MISSING_LINES.md) | **Korea PO PI sync** — +13 missing lines then qty recon to PI 260605; **42,081 → 57,959 AED** / 30 lines; removed `00038` loose (PI uses box `00039`). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-12_CORDOBA_OFFICE_RENT_PAYMENTOUT.md](./SESSION_CHANGES_2026-06-12_CORDOBA_OFFICE_RENT_PAYMENTOUT.md) | **Cordoba office rent** — paymentout **00613** / **14,208.30 AED** / expense Office monthly rent (same as May **00601**). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-12_SVITLANA_CUSTOMER_PHONE_FIX.md](./SESSION_CHANGES_2026-06-12_SVITLANA_CUSTOMER_PHONE_FIX.md) | **Svitlana customer phone fix** — `05477494727` → `+971547749727` on website user `cmq9tun3e0082dxl09ikxafit`, order `GENCardW2606124107`, and MoySklad counterparty `0c2f3142-6692-11f1-0a80-10fa004df201`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-12_SHAKIROVNA_LADIES_MIST_COMMISSION_REPORT.md](./SESSION_CHANGES_2026-06-12_SHAKIROVNA_LADIES_MIST_COMMISSION_REPORT.md) | **Shakirovna Ladies Marina** — consignment report **01379** + paymentin **05758** / **160 AED** (mist `00188` ×2 @ 80) / contract **00030**; paid in full. |
| 🔴 **Mobile/iOS** | [SESSION_CHANGES_2026-06-11_IOS_UNIVERSAL_LINKS_AASA.md](./SESSION_CHANGES_2026-06-11_IOS_UNIVERSAL_LINKS_AASA.md) | **iOS Universal Links fix** — `apple-app-site-association` was missing (404) so genosys.ae links never opened the iOS app; added AASA with appID `2842PLB7CS.ae.genosys.app` + Android-parity path set, `application/json` header rule in `next.config.js`. Verified live on Apple's CDN — works for already-installed apps, no app release needed. |
| 🟡 **Performance** | [SESSION_CHANGES_2026-06-11_IMG_TO_NEXT_IMAGE_MIGRATION.md](./SESSION_CHANGES_2026-06-11_IMG_TO_NEXT_IMAGE_MIGRATION.md) | **Legacy `<img>` → `next/image` migration** — all 14 `no-img-element` warnings cleared: 7 migrated (404 hero `roadend.png` **1.59 MB → 12.9 KB AVIF**, QR SVGs via `unoptimized`, orders thumbnails, Genie product card), 6 kept as `<img>` with reasoned disables (data-URL camera/avatar, external QR API, arbitrary AI-markdown hosts). |
| 🟡 **Performance** | [SESSION_CHANGES_2026-06-11_PERF_BLOG_IMAGES_3D_DEFER.md](./SESSION_CHANGES_2026-06-11_PERF_BLOG_IMAGES_3D_DEFER.md) | **Performance pass: blog images + 3D defer** — `unoptimized` removed from 5 blog featured images; EN blog list raw `<img>` → `next/image`; new `lib/blogContentImages.ts` rewrites in-content CMS `<img>` to the optimizer with srcset + lazy (e.g. 12.png 1.36 MB → 69 KB AVIF); three.js hero chunk deferred via `requestIdleCallback` so it never competes with LCP. |
| 🔴 **SEO** | [SESSION_CHANGES_2026-06-11_SEO_QUICKWINS_WWW_ADMIN_LIGHTHOUSE.md](./SESSION_CHANGES_2026-06-11_SEO_QUICKWINS_WWW_ADMIN_LIGHTHOUSE.md) | **SEO quick wins (P1)** — www.genosys.ae attached to Vercel project with **308** redirect (was unattached → default 307); `/admin` noindex via layout metadata (robots.txt only covered `/admin/`); Lighthouse mobile re-run: **31 → 74**, LCP **12.5s → 3.5s** (P1 target ≥70 met). |
| 🔴 **SEO** | [SESSION_CHANGES_2026-06-11_SEO_P0_SSR_CANONICALS.md](./SESSION_CHANGES_2026-06-11_SEO_P0_SSR_CANONICALS.md) | **SEO P0 fixes: SSR blackout + canonical unification** — PWASplashScreen now renders children during SSR (homepage 11→1,255 words for crawlers; splash CSS-gated to PWA display-mode); product canonicals/sitemap/feeds/JSON-LD unified on numeric slugs (`productNumber ?? id`); 301s for 11 legacy CUID URLs in proxy.ts; `notFound()` in generateMetadata + guides `dynamicParams=false`; dead `ssr:false` product variants deleted. |
| 🔴 **Security** | [SESSION_CHANGES_2026-06-11_NODEMAILER_8_UPGRADE.md](./SESSION_CHANGES_2026-06-11_NODEMAILER_8_UPGRADE.md) | **nodemailer 7.0.13 → 8.0.11 security upgrade** — fixes jsonTransport access bypass + List-* CRLF injection (8.0.9) and strict-TLS credential requests (8.0.8); only v8 breaking change (`NoAuth`→`ENOAUTH`) confirmed unused in our code; verified with live Gmail SMTP handshake + real test send on v8; no app code changed. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-11_LINT_DEBT_CLEARED_CI_BLOCKING.md](./SESSION_CHANGES_2026-06-11_LINT_DEBT_CLEARED_CI_BLOCKING.md) | **Lint debt cleared (40→0 errors), CI lint now blocking** — 23 unused catch vars → bare `catch`; malformed eslint-disable fixed; dev-page `<a>`→`<Link>`; `no-img-element` downgraded to warn (14 legacy `<img>` backlogged for per-page next/image migration); `continue-on-error` removed from CI lint step. |
| 🔴 **Security** | [SESSION_CHANGES_2026-06-11_TIER2_INDEXES_ADMIN_VERIFY_AUDIT_FIX_WHATSAPP_AUTH.md](./SESSION_CHANGES_2026-06-11_TIER2_INDEXES_ADMIN_VERIFY_AUDIT_FIX_WHATSAPP_AUTH.md) | **Tier 2 hardening (4 items)** — DB indexes for orders/analytics (applied to prod); `admin-verify` enumeration oracle closed (signed cookie only); `npm audit fix` 56→8 vulns (criticals cleared, lock-only); `whatsapp/order-status` auth enforced with timing-safe `INTERNAL_API_KEY` (generated + set in Vercel) or admin session, fails closed; 8 new regression tests (251 total). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-11_PRICING_TESTS_FIX_LEGACY_CHECKOUT_REMOVAL.md](./SESSION_CHANGES_2026-06-11_PRICING_TESTS_FIX_LEGACY_CHECKOUT_REMOVAL.md) | **pricingEngine tests fixed + legacy checkout deleted** — 11 test failures were a stale `productConfig` mock (missing `getProductImages`/`getProductVideoUrl`/`getProductDocumentation`), not a pricing bug; suite re-enabled in CI (29 suites / 243 tests now gate every push); legacy `/api/checkout` route deleted (was already 410-gated in prod, zero callers; COD uses `orders/cod-confirmation`, card uses `/api/stripe/*`). |
| 🔴 **Security** | [SESSION_CHANGES_2026-06-10_CI_PIPELINE.md](./SESSION_CHANGES_2026-06-10_CI_PIPELINE.md) | **CI pipeline added (both repos)** — GitHub Actions: tsc, eslint (report-only until lint debt cleared), jest (28 suites incl. 21 security regression tests), gitleaks secret scan with `.gitleaks.toml` allowlist; first scan found + removed a hardcoded Prisma Accelerate key in two archived blog scripts; mobile repo runs tsc + `verify:release` smokes + gitleaks. |
| 🔴 **Security** | [SESSION_CHANGES_2026-06-10_ADMIN_AUTH_BYPASS_FIX.md](./SESSION_CHANGES_2026-06-10_ADMIN_AUTH_BYPASS_FIX.md) | **Admin auth bypass closed (SEC-1)** — removed the unsigned `x-admin-email` header / `admin-email` cookie fallback; the signed `admin-session` HMAC cookie is now the only admin credential; timing-safe signature comparison; `chat-stats` + `whatsapp/send` moved to central auth; 11 regression tests in `__tests__/lib/adminAuth.test.ts`. |
| 🔴 **Security** | [SESSION_CHANGES_2026-06-10_ENV_SCRUB_ROUTE_GUARDS.md](./SESSION_CHANGES_2026-06-10_ENV_SCRUB_ROUTE_GUARDS.md) | **Env secrets scrub + route guards (SEC-2/1.4)** — untracked 4 git-tracked env files (DB, MoySklad, SMTP, Gmail secrets), hardened `.gitignore`, `git filter-repo` purged all env files from full git history (both repos, force-pushed); guarded `create-payment-blog`, `init-db`, `ping-search-engines` with admin auth; added 10/hour register rate limit; 10 regression tests in `__tests__/api/guarded-routes-auth.test.ts`. **Credential rotation still pending (Step 1).** |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-10_BIO_MESO_60000_RETAIL_PRICE.md](./SESSION_CHANGES_2026-06-10_BIO_MESO_60000_RETAIL_PRICE.md) | **Bio Meso PDRN Ampoule 60000 (product 60)** — retail price set to **600 AED**, `isPriceOnRequest` cleared → orderable on web + mobile; DB-only product, safe from `sync-product-prices-from-products-ts.ts`. |
| 🟡 **Important** | [2026-04-27_B2C_MARKETING_PLAN_JANNA_REFERRALS.md](./2026-04-27_B2C_MARKETING_PLAN_JANNA_REFERRALS.md) | **GENOSYS B2C marketing plan from Zhanna referrals** — outreach list for Mamochki Dubai, Style Me, Angel wellness, Dubai Decode, Expat Woman, Russian Emirates; corrected 2026-05-24 with ROI, stock, and professional-claims checks. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-24_INSTAGRAM_API_MEDIA_OPTIONS.md](./SESSION_CHANGES_2026-05-24_INSTAGRAM_API_MEDIA_OPTIONS.md) | **Instagram API/media workflow** — direct GENOSYS posting is possible via official Instagram Graph API for authorized Business/Creator accounts; arbitrary head-office video downloading is not a clean official API use case, so recommended path is permission/shared assets plus API publishing. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-16_RUSSIAN_TRANSLATION_AUDIT.md](./SESSION_CHANGES_2026-05-16_RUSSIAN_TRANSLATION_AUDIT.md) | **Russian translation audit** — all visible products now have natural `nameRu` + `descriptionRu`; Russian labels, SEO metadata, blog titles/excerpts, concern pages, GEO FAQ, and PWA manifest were polished for more natural wording. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-16_PRODUCT_ARABIC_TRANSLATION_REVIEW.md](./SESSION_CHANGES_2026-05-16_PRODUCT_ARABIC_TRANSLATION_REVIEW.md) | **Product Arabic translation review** — all visible products now have improved `nameAr` + natural `descriptionAr`; DB scan shows no missing Arabic product fields or audited machine-translation residues. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-16_MOBILE_ADMIN_CUSTOMER_OPEN_FIX.md](./SESSION_CHANGES_2026-05-16_MOBILE_ADMIN_CUSTOMER_OPEN_FIX.md) | **Mobile admin fix** — `/admin` Users tab **Open customer** now renders `CustomerProfile` on phone; selected-customer state was previously only consumed by hidden desktop admin. ESLint + TypeScript passed. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-08_YTD_PROFITABILITY_CHECK.md](./SESSION_CHANGES_2026-06-08_YTD_PROFITABILITY_CHECK.md) | **2026 YTD profitability** — gross +530k AED (~68% margin); net **-31k** after opex/write-offs; script `moysklad-ytd-profitability.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-08_FAMILY_CLASS_POLY_CLINIC_ORDER.md](./SESSION_CHANGES_2026-06-08_FAMILY_CLASS_POLY_CLINIC_ORDER.md) | **Family Class Poly Clinic** — SO **GENCardM26060852411**, invoice **04636**, shipment **06314** / **479 AED** (patches ×2, collagen ×3, delivery 45). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-08_ELEGANCE_POLYCLINIC_ORDER.md](./SESSION_CHANGES_2026-06-08_ELEGANCE_POLYCLINIC_ORDER.md) | **Elegance Polyclinic** — SO **GENCardM2606089666**, invoice **04637**, shipment **06315** / **1,357 AED** (7 lines, free delivery ≥1000). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-08_ARAK_SALE_COSMETICS_CUSTOMER.md](./SESSION_CHANGES_2026-06-08_ARAK_SALE_COSMETICS_CUSTOMER.md) | **ARAK SALE OF COSMETICS L.L.C** (Korean House, Ajman) — MoySklad counterparty `33c7fa5e-6325-11f1-0a80-1a4600828ae8`; TRN + license per Face Room pattern. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-08_ARAK_TRIAL_SKU_SELECTION.md](./SESSION_CHANGES_2026-06-08_ARAK_TRIAL_SKU_SELECTION.md) | **ARAK trial SKU list** — YTD bestseller validation; core (cleanser, masks, SPF40, EPI, Beige/Camel cushion, radiance) + add PDRN pack, mist, toner, overnight mask, hyaluron, blemish cream. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-08_ANJANA_SPA_FZE_CUSTOMER.md](./SESSION_CHANGES_2026-06-08_ANJANA_SPA_FZE_CUSTOMER.md) | **ANJANA SPA - FZE** — counterparty `d5532af5-6356-11f1-0a80-08090090f8b4`; license **3249** in email field; Face Room pattern; Saadiyat address. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-08_ANJANA_SPA_COLLAGEN_ORDER.md](./SESSION_CHANGES_2026-06-08_ANJANA_SPA_COLLAGEN_ORDER.md) | **ANJANA SPA - FZE** — SO **GENCardM260608ANJ** + invoice **04645** + shipment **06323**; collagen **00063** ×100 @ **18 AED − 19.44%** → **14.50 net** = **1,450 AED**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-08_ADARA_SPA_ORDER.md](./SESSION_CHANGES_2026-06-08_ADARA_SPA_ORDER.md) | **Adara Spa Retreat** — SO **GENCardM260608ADAR** only / **825 AED** (Snow cleanser ×2, booster, radiance 50g, post cream 100g). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-10_DM_GME_260513_POSTCREAM_BOX_TO_LOOSE.md](./SESSION_CHANGES_2026-06-10_DM_GME_260513_POSTCREAM_BOX_TO_LOOSE.md) | **DM GME 260513 Korea chain** — PO / invoice **00171** / supply **00183** / payment **00606**: **7×00039** box → **84×00038** loose 20g; sum **51,755.90 AED** unchanged; script `moysklad-modify-po-dts-260513-postcream-box-to-loose-20260610.js`; stock: `00038` +84, `00039` −7 (now **−2** on hand — 2 boxes already unpacked). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-07_MOYSKLAD_OVERPAYMENT_FIX.md](./SESSION_CHANGES_2026-06-07_MOYSKLAD_OVERPAYMENT_FIX.md) | **MoySklad overpayment fix (Tarasova + Marapo)** — invoice **03533** / **04044**: payment linked to overstated shipment; aligned demand + `paymentin` linkedSum; settlement **0 AED** both; script `moysklad-fix-invoice-overpayment-20260607.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-11_ZHETEYEVA_ELLA_SALESRETURN_01476.md](./SESSION_CHANGES_2026-06-11_ZHETEYEVA_ELLA_SALESRETURN_01476.md) | **Zheteyeva Ella close-out** — sales return **00298** / **8,225 AED** / **2022-12-19** vs invoice **01476** + shipment **01738** (Bagus boards); script `moysklad-create-zheteyeva-ella-salesreturn-invoice-01476-2022.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-11_MOYSKLAD_CUSTOMER_BALANCE_AUDIT.md](./SESSION_CHANGES_2026-06-11_MOYSKLAD_CUSTOMER_BALANCE_AUDIT.md) | **MoySklad customer balance audit** — real overpayment: **2** customers (54+30 AED) **→ fixed 2026-06-07**; **23** owe us; **67** consignment salons show unpaid отгрузки (normal UI); **20** duplicate invoice+shipment pairs to fix; script `moysklad-audit-customer-balances-20260611.js` (**includes salesreturn credits**). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-10_MISS_INDIRA_URAZOVA_ORDER.md](./SESSION_CHANGES_2026-06-10_MISS_INDIRA_URAZOVA_ORDER.md) | **Miss Indira Urazova** (new, Arabian Ranches) — SO **GENCardM2606102075** → invoice **04652** → shipment **06336** / **966 AED clinic list** (Beige cushion ×2, PDRN, SPF50, mist, masks, barrier cream); PDF → `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-10_SHAKIROVNA_ELITE_CLINIC_COMMISSION_DEMAND.md](./SESSION_CHANGES_2026-06-10_SHAKIROVNA_ELITE_CLINIC_COMMISSION_DEMAND.md) | **MoySklad Shakirovna Elite + Clinic** — reports **01374** / **01375** → отгрузки **06334** (**1,545 AED** / 7 lines) + **06335** (**905 AED** / 6 lines); agreements **21** / **26**; script `moysklad-create-shakirovna-elite-clinic-commission-demand-20260610.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-10_SHAKIROVNA_LADIES_COMMISSION_DEMAND.md](./SESSION_CHANGES_2026-06-10_SHAKIROVNA_LADIES_COMMISSION_DEMAND.md) | **MoySklad Shakirovna Ladies Beauty Saloon** — report **01378** + отгрузка **06331** (same 18 SKU / 51 pcs / **4,038 AED**) / договор **00030**; `00038` 20g via box unpack **00039**; script `moysklad-create-shakirovna-ladies-salon-commission-demand-20260610.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-10_ADMIN_SHAKIROVNA_MIST_BEIGE_CUSHION_ORDER.md](./SESSION_CHANGES_2026-06-10_ADMIN_SHAKIROVNA_MIST_BEIGE_CUSHION_ORDER.md) | **Admin Shakirovna Salon** — SO **GENCardM260610SHK** → invoice **04648** → shipment **06328** / **240 AED** (mist ×1 @ 80, Beige cushion ×1 @ 150, delivery 10); landscape PDF → `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-10_MISS_AHLAM_RETAIL_ORDER.md](./SESSION_CHANGES_2026-06-10_MISS_AHLAM_RETAIL_ORDER.md) | **Miss Ahlam** (new) — SO **GENCardM2606105504** / **2,384 AED** retail (7 lines incl. PDRN ampoule @ 600); proforma PDF → `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-10_MISS_LIZA_SALON971_RETAIL_ORDER.md](./SESSION_CHANGES_2026-06-10_MISS_LIZA_SALON971_RETAIL_ORDER.md) | **Miss Liza** (Salon 971, Arjan) — SO **GENCardM2606101025** → invoice **04650** → shipment **06330** / **785 AED clinic list** (patches, PDRN, cleanser, EZ CO₂); landscape PDF → `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-10_MISS_HESSA_ABDULLAH_HYALURON_ORDER.md](./SESSION_CHANGES_2026-06-10_MISS_HESSA_ABDULLAH_HYALURON_ORDER.md) | **Miss Hessa Abdullah** (new, Kas Residence) — SO **GENCardM2606105536** → invoice **04651** → shipment **06332** / **667.25 AED** (hyaluron cream + serum, delivery 45 ex-VAT; `vatIncluded: false`); landscape PDF → `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-10_COSMIDEN_ZERO_FILL_DEMAND.md](./SESSION_CHANGES_2026-06-10_COSMIDEN_ZERO_FILL_DEMAND.md) | **Cosmiden Clinic** — former отгрузка **06334** (11 pcs) **merged into 06333** and deleted; see merge script `moysklad-merge-cosmiden-demands-06333-06334-20260610.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-10_COSMIDEN_CONSIGNMENT_RESTOCK_DEMAND.md](./SESSION_CHANGES_2026-06-10_COSMIDEN_CONSIGNMENT_RESTOCK_DEMAND.md) | **Cosmiden Clinic** — consignment отгрузка **06333** / **2,710 AED** (16 lines / 54 pcs) / agreement **15** — merged **06333+06334**, **excl. `00038`** post cream. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-09_ARFI_BARSHA_REPLENISHMENT_DEMAND.md](./SESSION_CHANGES_2026-06-09_ARFI_BARSHA_REPLENISHMENT_DEMAND.md) | **ARFI Nails Barsha** — consignment shipment **06324** / **1,020 AED** (anti-wrinkle cream ×2, serum ×2, PDRN pack ×2) + stock note PDF → `~/Desktop/orders/`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-09_GENOSYS_UAE_PRICELIST_CLINICS_INGEST.md](./SESSION_CHANGES_2026-06-09_GENOSYS_UAE_PRICELIST_CLINICS_INGEST.md) | **GENOSYS UAE clinic price list 2026 ingest** — Desktop Excel normalized into **100 priced line items** across **25 categories** plus CSV `GENOSYS_UAE_PriceList_Clinics_2026_normalized.csv` and an **11-page professional PDF** on Desktop; source notes preserve worksheet/title mismatch and N/A cartridge price. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-09_TONETRENDZ_CUSTOMER.md](./SESSION_CHANGES_2026-06-09_TONETRENDZ_CUSTOMER.md) | **TONETRENDZ** JVC — counterparty `74aa75cb-63db-11f1-0a80-111d001bbe72`; license **1626587**; Face Room pattern; pro = invoice only. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-09_TONETRENDZ_OPENING_CONSIGNMENT.md](./SESSION_CHANGES_2026-06-09_TONETRENDZ_OPENING_CONSIGNMENT.md) | **TONETRENDZ** — agreement **36** + shipment **06326** / **4,875 AED** (16 retail lines, wave 1+2) + stock note PDF. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-02_ARFI_BARSHA_COMMISSION_DEMAND.md](./SESSION_CHANGES_2026-06-02_ARFI_BARSHA_COMMISSION_DEMAND.md) | **MoySklad ARFI Nails Barsha** — report **01371** + отгрузка **06274** (2,268 AED / 11 lines) / contract **25**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-02_ARFI_JUMEIRAH_COMMISSION_DEMAND.md](./SESSION_CHANGES_2026-06-02_ARFI_JUMEIRAH_COMMISSION_DEMAND.md) | **MoySklad ARFI Nails Jumeirah** — report **01370** + отгрузка **06273** (1,610 AED / 10 lines) / contract **30**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-29_SERENE_SKIN_VAT_TRN.md](./SESSION_CHANGES_2026-06-29_SERENE_SKIN_VAT_TRN.md) | **Serene Skin Beauty** — VAT TRN **105207755700003** on counterparty (Face Room pattern: license in email/fax, TRN in `legalAddressFull.comment`). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-02_SERENE_COMMISSION_DEMAND.md](./SESSION_CHANGES_2026-06-02_SERENE_COMMISSION_DEMAND.md) | **MoySklad Serene Skin Beauty** — report **01369** + отгрузка **06271** (865 AED / 6 lines) / contract **00060**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-02_MELANTA_COMMISSION_REPORT.md](./SESSION_CHANGES_2026-06-02_MELANTA_COMMISSION_REPORT.md) | **MoySklad Melanta** — report **01368** only (2,801 AED / 14 lines / May 2026) / contract **14**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-02_LOVE_MY_BODY_COMMISSION_REPORT.md](./SESSION_CHANGES_2026-06-02_LOVE_MY_BODY_COMMISSION_REPORT.md) | **MoySklad Love My Body** — report **01367** (2,729 AED) + отгрузка **06266** (9,460 AED, 23 lines) / contract **27**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-02_VOLNA_COMMISSION_DEMAND.md](./SESSION_CHANGES_2026-06-02_VOLNA_COMMISSION_DEMAND.md) | **MoySklad Salon Volna** — report **01366** (1,034 AED) + отгрузка **06265** (1,524 AED incl. EyeCell kit) / contract **19**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-01_PERSONA_PALM_JUMEIRAH_COMMISSION_REPORT.md](./SESSION_CHANGES_2026-06-01_PERSONA_PALM_JUMEIRAH_COMMISSION_REPORT.md) | **MoySklad Persona Palm Jumeirah** — report **01365** (7,608 AED) + отгрузка **06261** (7,988 AED incl. +10 peptide masks) / contract **00078**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-01_PERSONA_MARINA_CONSIGNMENT_DEMAND.md](./SESSION_CHANGES_2026-06-01_PERSONA_MARINA_CONSIGNMENT_DEMAND.md) | **MoySklad First Person Marina** — consignment отгрузка **06259** / **1,585 AED** / 8 lines under contract **00024**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-01_PERSONA_MARINA_COMMISSION_REPORT.md](./SESSION_CHANGES_2026-06-01_PERSONA_MARINA_COMMISSION_REPORT.md) | **MoySklad First Person Marina** — commissioner report **01364** / **3,369 AED** / 15 lines / May 2026 (contract **00024**); blemish balm = cream `00040`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-01_ECLATANT_COMMISSION_REPORT.md](./SESSION_CHANGES_2026-06-01_ECLATANT_COMMISSION_REPORT.md) | **MoySklad Eclatant** — received commissioner report **01363** / **2,838 AED** / 11 lines / May 2026 period (contract **18**). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-01_ECLATANT_CONSIGNMENT_DEMAND.md](./SESSION_CHANGES_2026-06-01_ECLATANT_CONSIGNMENT_DEMAND.md) | **MoySklad Eclatant** — consignment отгрузка **06258** under agreement **18** / **2,024 AED** / 7 lines ×2 (Snow cleanser/toner, cushions, SPF50, post cream, eye patches). |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-01_SARAYOUNNESSKIN_SARA_ELYZIUM_ORDER.md](./SESSION_CHANGES_2026-06-01_SARAYOUNNESSKIN_SARA_ELYZIUM_ORDER.md) | **MoySklad Miss Sarayounesskin Sara** — paid chain: order `GENCardM2606014891`, invoice **04595**, shipment **06256**, cash in **00167** / **1,050 AED** (PDRN 60000 ×2 + FOC, mask, cushion). |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-16_KIND_CARE_COMMISSION_REPORT.md](./SESSION_CHANGES_2026-05-16_KIND_CARE_COMMISSION_REPORT.md) | **MoySklad Kind Care** — created received commissioner report `01358` under agreement `00080`, combining screenshot duplicate rows into 5 lines / 11 units / **1,127 AED**; no matching shipment created. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-16_BIANCO_CEDRE_DEMAND.md](./SESSION_CHANGES_2026-05-16_BIANCO_CEDRE_DEMAND.md) | **MoySklad Bianco Cedre** — `Отгрузка` **06174** under agreement `00073` / **Bianco Spa FZCO (Cedre Center)**: 6 lines / 11 pcs / **1,550 AED** (cleanser, booster, oxymask, problem cream, Revita Bright + Natural); commission report not created; script `moysklad-create-bianco-cedre-demand-20260516.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-16_IULIA_BEAUTY_DEMAND.md](./SESSION_CHANGES_2026-05-16_IULIA_BEAUTY_DEMAND.md) | **MoySklad IULIA Beauty** — `Отгрузка` **06178** under agreement **28** (City Walk): Snow cleanser + overnight mask + hyaluron cream + radiance serum (4×1) / **645 AED**; script `moysklad-create-iulia-beauty-demand-20260516.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-17_MOYSKLAD_PAID_ORDER_STATUS.md](./SESSION_CHANGES_2026-05-17_MOYSKLAD_PAID_ORDER_STATUS.md) | **MoySklad paid website order status** — admin sync now creates paid online (`stripe` / `apple_pay`) customer orders with `paymentStatus=paid` as **`Оплачен - Ждет доставки`**; COD/unpaid/pending remains **`Новый`**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-17_MOBILE_WEB_PARTNERS_MENU.md](./SESSION_CHANGES_2026-05-17_MOBILE_WEB_PARTNERS_MENU.md) | **Mobile web Partners navigation** — added `Partners` to the hamburger dropdown and registered `/partners` as a simple-header route so the partners page opens with its own app-like mobile header. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-17_ELYAZIA_PARTNER_ADDED.md](./SESSION_CHANGES_2026-05-17_ELYAZIA_PARTNER_ADDED.md) | **Partners page update** — added `ELYAZIA BEAUTY CENTER, MIRDIF` with supplied logo, address, phone, website, directions link, and mobile app feed visibility through shared `lib/partners.ts`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-17_KBEAUTY_DELIVERY_TECH_BLOG.md](./SESSION_CHANGES_2026-05-17_KBEAUTY_DELIVERY_TECH_BLOG.md) | **Blog article** — published `The Next K-Beauty Breakthrough: Delivery Tech, PDRN and Exosome-Inspired Skin Boosters` with EN/RU/AR content, original optimized hero image, and idempotent Prisma upsert script. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-17_KBEAUTY_BLOG_IMAGE_FIX.md](./SESSION_CHANGES_2026-05-17_KBEAUTY_BLOG_IMAGE_FIX.md) | **K-beauty blog image fix** — moved the hero image out of conflicting `/public/blog`, added a compatibility image route, and switched blog listing previews to direct `<img>` rendering after `next/image` still showed alt text in production. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-17_MOBILE_FORCE_UPDATE_1_10_1.md](./SESSION_CHANGES_2026-05-17_MOBILE_FORCE_UPDATE_1_10_1.md) | **Native app force update** — `/api/mobile/app-version` now requires app version **1.10.0** and shows a blocking update screen to older builds for checkout/payment improvements. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-15_RADIANCE_SERUM_RESTOCK.md](./SESSION_CHANGES_2026-05-15_RADIANCE_SERUM_RESTOCK.md) | **Website stock restore** — `MULTI VITA RADIANCE SERUM` product `21` was hardcoded in stock but DB `Product.inStock=false`; updated DB to `inStock=true`, visible, saleable, 330 AED / 30ml. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-06_GIFT_INVENTORY_LOSS_MOYSKLAD.md](./SESSION_CHANGES_2026-05-06_GIFT_INVENTORY_LOSS_MOYSKLAD.md) | **MoySklad gift stock write-off** — Loss `00008-00433` / **716.80 AED** buy cost / **51 pcs** / marker `GIFT-WRITE-OFF-2026-05-06`; script `scripts/moysklad-create-gift-writeoff-20260506.js`; assumptions: Hair Tonic qty **1**, PDRN = **54467** mask pack not ampoule. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-07_DTS_PO_DM_GME_260430.md](./SESSION_CHANGES_2026-05-07_DTS_PO_DM_GME_260430.md) | **Obsolete scope** — original MoySklad supplier PO `DM GME 260430` from full invoice (deleted); use rectified PO below for current order. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-08_DTS_PO_DM_GME_260508_RECTIFIED.md](./SESSION_CHANGES_2026-05-08_DTS_PO_DM_GME_260508_RECTIFIED.md) | **MoySklad supplier PO** `DM GME 260508` — rectified **28-line** list only (**47,241.50 AED** buy); script `scripts/moysklad-create-po-dts-260508-rectified.js`; GCMA02 = 100 kits → 500 pcs `00012`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-12_SHAKIROVNA_LADIES_SALON_COMMISSION_REPORT.md](./SESSION_CHANGES_2026-05-12_SHAKIROVNA_LADIES_SALON_COMMISSION_REPORT.md) | **MoySklad Shakirovna Ladies Beauty Saloon** — отчёт **01354** и отгрузка **06133** (те же строки) / **2,490 AED** / договор **00030**; scripts commission + `scripts/moysklad-create-shakirovna-ladies-salon-demand-20260512.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-01_RISE_UP_OPENING_CONSIGNMENT.md](./SESSION_CHANGES_2026-06-01_RISE_UP_OPENING_CONSIGNMENT.md) | **MoySklad Rise UP** — opening отгрузка **06255** / **10,720 AED** / 96 pcs / 32 lines (дог. **34**); script `moysklad-create-rise-up-opening-consignment-20260601.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-03_RISE_UP_AGREEMENT_ADDRESS_FIX.md](./SESSION_CHANGES_2026-06-03_RISE_UP_AGREEMENT_ADDRESS_FIX.md) | **Rise UP agreement fix** — Office **906**, phone **+971 58 530 93 20** (from stock note **06255**); PDF regenerated on Desktop. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-03_RISE_UP_CONSIGNMENT_AGREEMENT_INGEST.md](./SESSION_CHANGES_2026-06-03_RISE_UP_CONSIGNMENT_AGREEMENT_INGEST.md) | **Rise UP consignment PDF ingest** — `Genosys_Consignment_Agreement_Rise_UP.pdf` → [Rise_UP_Consignment_Agreement_34_Genosys_Middle_East_FZ-LLC.md](./Rise_UP_Consignment_Agreement_34_Genosys_Middle_East_FZ-LLC.md); agreement **34** / shipment **06255** / **10,720 AED**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-01_RISE_UP_CONSIGNMENT_CONTRACT.md](./SESSION_CHANGES_2026-06-01_RISE_UP_CONSIGNMENT_CONTRACT.md) | **MoySklad Rise UP** — commission agreement **34** (`c91330fa-…`); PercentOfSales 0%; script `moysklad-create-rise-up-consignment-contract-20260601.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-01_RISE_UP_CUSTOMER.md](./SESSION_CHANGES_2026-06-01_RISE_UP_CUSTOMER.md) | **MoySklad Rise UP** — new counterparty Business Bay (`b83e0d80-…`); Metropolis Tower Office 1808; +971554436530; script `moysklad-create-rise-up-customer-20260601.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-06-01_PERSONA_DOWNTOWN_COMMISSION_DEMAND.md](./SESSION_CHANGES_2026-06-01_PERSONA_DOWNTOWN_COMMISSION_DEMAND.md) | **MoySklad Persona Downtown** — report **01362** / **1,151 AED** (8 sold lines) + shipment **06254** / **680 AED** (beige cushion ×2 + gel patch ×2, дог. **00077**); script `moysklad-create-persona-downtown-commission-demand-20260531.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-30_ADMIN_SHAKIROVNA_IVORY_CUSHION_PAID.md](./SESSION_CHANGES_2026-05-30_ADMIN_SHAKIROVNA_IVORY_CUSHION_PAID.md) | **MoySklad Admin Shakirovna** — order **GENCardM2605307390** → invoice **04592** → shipment **06251** → cash in **00166** / **150 AED** (Ivory cushion `00143` ×1); fully paid; script `moysklad-create-admin-shakirovna-ivory-cushion-paid-20260530.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-30_IVANOVA_TATYANA_SPF50_ORDER.md](./SESSION_CHANGES_2026-05-30_IVANOVA_TATYANA_SPF50_ORDER.md) | **MoySklad Miss Ivanova Tatyana** — new customer Beach Vista; order **GENCardM2605309943** only / **5,000 AED** (SPF50 `54457` ×20 @ 250); no invoice; script `moysklad-create-ivanova-tatyana-spf50-order-20260530.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-30_IRYNA_BOBROVA_ORDER_INVOICE.md](./SESSION_CHANGES_2026-05-30_IRYNA_BOBROVA_ORDER_INVOICE.md) | **MoySklad Iryna Bobrova** — new customer Discovery Gardens; order **GENCardM2605307822** + invoice **04590** / **340 AED** (patches `00053` + cushion beige `00144` retail); script `moysklad-create-iryna-bobrova-order-invoice-20260529.js`. |
| 🟡 **Important** | [CONSIGNMENT_STOCK_RECONCILIATION.md](./CONSIGNMENT_STOCK_RECONCILIATION.md) | **MoySklad consignment stock reconciliation playbook** — book formula, sold vs lost decision tree, document flow (return+loss / demand / commission report), constants, checklist. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-29_SHAKIROVNA_LADIES_STOCK_RECON.md](./SESSION_CHANGES_2026-05-29_SHAKIROVNA_LADIES_STOCK_RECON.md) | **Shakirovna Ladies Salon stock recon (full)** — contract **00030**; lost → **00296** + **90.30 AED** loss; surplus → **06247**; before/after balances verified; script `moysklad-create-shakirovna-ladies-salon-stock-recon-20260529.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-12_SHAKIROVNA_ELITE_CLINIC_SHIPMENTS_INVOICE_LINES.md](./SESSION_CHANGES_2026-05-12_SHAKIROVNA_ELITE_CLINIC_SHIPMENTS_INVOICE_LINES.md) | **MoySklad Shakirovna** — Отгрузка **06131** (дог. **21**, Elite, **781 AED**, строки как счёт **01351**) + **06132** (дог. **26**, Clinic, **145 AED**, как **01352**); script `scripts/moysklad-create-shakirovna-elite-clinic-shipments-invoice-lines-20260512.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-12_ELIZAVETA_NABIEVA_CUSHION_ORDER_INVOICE.md](./SESSION_CHANGES_2026-05-12_ELIZAVETA_NABIEVA_CUSHION_ORDER_INVOICE.md) | **MoySklad Yelizaveta Nabieva Cosmetologist** — order **GENCardM2605123401** + invoice **04495** / **450 AED** (BB Beige ×2 + Camel ×1); PDF **Genosys_Invoice_Legal_TAX** → Desktop; script `scripts/moysklad-create-elizaveta-nabieva-cushion-order-invoice-20260512.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-11_ANNA_SAKHUGOVA_ORDER_INVOICE.md](./SESSION_CHANGES_2026-05-11_ANNA_SAKHUGOVA_ORDER_INVOICE.md) | **MoySklad Anna Sakhugova** — order **GENCardM2605116924** + invoice **04494** / **770 AED**; PDF **Genosys_Invoice_Legal_TAX** → Desktop + `lp`; template UUID **`5e56cd7d-…`**; script `scripts/moysklad-create-anna-sakhugova-order-invoice-20260511.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-11_MELANTA_GEL_PATCH_SHIPMENT_PRINT.md](./SESSION_CHANGES_2026-05-11_MELANTA_GEL_PATCH_SHIPMENT_PRINT.md) | **MoySklad Melanta** — отгрузка **06117** / **380 AED** / 2× Eye gel patch box `00053` (дог. **14**); Consignment Stock Note PDF + `lp`; script `scripts/moysklad-create-melanta-gel-patch-shipment-print-20260511.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-11_GENOSYS_MOYSKLAD_SOA_TEMPLATE.md](./SESSION_CHANGES_2026-05-11_GENOSYS_MOYSKLAD_SOA_TEMPLATE.md) | **MoySklad SOA template** — reworked `SOA_old.xls` into `Genosys_SOA_CLEAN.xls` with new GENOSYS header style, cleaner summary/table/totals/signature layout, A4 landscape export, and **9/9** SOA placeholders preserved. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-11_GENOSYS_CONSIGNMENT_SOA_TEMPLATE.md](./SESSION_CHANGES_2026-05-11_GENOSYS_CONSIGNMENT_SOA_TEMPLATE.md) | **MoySklad consignment SOA template** — reworked `SOA_Deliv_NotPaid_NEW2.xls` into `Genosys_Consignment_SOA_CLEAN.xls`, preserving `${row.sourceAgentRef.name}` and **9/9** required placeholders. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-11_GENOSYS_CONSIGNMENT_INVOICE_TEMPLATE.md](./SESSION_CHANGES_2026-05-11_GENOSYS_CONSIGNMENT_INVOICE_TEMPLATE.md) | **MoySklad consignment invoice template** — reworked `Invoice_Consignment_Sales_Genosys.xls` into `Invoice_Consignment_Sales_Genosys_CLEAN.xls` with clean GENOSYS invoice header/table/stamp and **8/8** required placeholders preserved. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-11_GENOSYS_CONSIGNMENT_REPORT_TEMPLATE.md](./SESSION_CHANGES_2026-05-11_GENOSYS_CONSIGNMENT_REPORT_TEMPLATE.md) | **MoySklad consignment report template** — reworked `Invoice_Consignment_Report_Genosys.xls` into `Invoice_Consignment_Report_Genosys_CLEAN.xls` with clean GENOSYS report header/table, no print/stamp, and **8/8** required placeholders preserved. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-11_GENOSYS_CONSIGNMENT_STOCK_NOTE_TEMPLATE.md](./SESSION_CHANGES_2026-05-11_GENOSYS_CONSIGNMENT_STOCK_NOTE_TEMPLATE.md) | **MoySklad consignment stock note template** — reworked `Genosys_Consignment_Stock_Note.xls` into `Genosys_Consignment_Stock_Note_CLEAN.xls` with clean GENOSYS stock-note header/table, no print/stamp, and **8/8** required placeholders preserved. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-11_GENOSYS_PROFORMA_TEMPLATE.md](./SESSION_CHANGES_2026-05-11_GENOSYS_PROFORMA_TEMPLATE.md) | **MoySklad proforma template** — reworked `Genosys_Invoice_PROFORMA.xls` into `Genosys_Invoice_PROFORMA_CLEAN.xls` with clean GENOSYS proforma header/table, no print/stamp, and **8/8** required placeholders preserved. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-10_MELANTA_PDRN_SHIPMENT_PRINT.md](./SESSION_CHANGES_2026-05-10_MELANTA_PDRN_SHIPMENT_PRINT.md) | **MoySklad Melanta** — отгрузка **06116** / **400 AED** / 2× PDRN `54467` (дог. **14**); PDF **Genosys_Consignment_Stock_Note** на рабочий стол + печать `lp`; script `scripts/moysklad-create-melanta-pdrn-shipment-print-20260510.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-10_LIPS_FOR_KISS_MOYSKLAD_ORDER_V2.md](./SESSION_CHANGES_2026-05-10_LIPS_FOR_KISS_MOYSKLAD_ORDER_V2.md) | **MoySklad Lips for Kiss Clinic** — customer order **GENCardM2605104512** / **3,005 AED** / 6 lines; post cream: **20g** `00038`×10 (client text “2g” — no 2g SKU); script `scripts/moysklad-create-lips-for-kiss-order-20260510.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-09_ARYNA_MOYSKLAD_ORDER.md](./SESSION_CHANGES_2026-05-09_ARYNA_MOYSKLAD_ORDER.md) | **MoySklad Aryna** (`0521175210`) — customer order **GENCardM2605095210** / **135 AED** — 5× Sea Algae paid + 1× Sea Algae FOC + 1× Collagen FOC + Dubai delivery 45; script `scripts/moysklad-create-aryna-order-20260509.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-09_OGUZ_MED_MOYSKLAD_REPORT.md](./SESSION_CHANGES_2026-05-09_OGUZ_MED_MOYSKLAD_REPORT.md) | **MoySklad Oguz Med** — received commissioner sales report `01349` (agr. **32**); **6 lines / 14 pcs / 745 AED**; script `scripts/moysklad-create-oguz-med-commission-report-20260509.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-08_LOVE_MY_BODY_MOYSKLAD_REPORT.md](./SESSION_CHANGES_2026-05-08_LOVE_MY_BODY_MOYSKLAD_REPORT.md) | **MoySklad Love My Body** — report `01347` + shipment `06111` (agr. **27**); **9 lines / 24 pcs / 1,773 AED**; green mask = Sea Algae `00140` (not CO₂); script `scripts/moysklad-create-love-my-body-sales-20260508.js`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-07_HIDEAWAY_MOYSKLAD_ORDER.md](./SESSION_CHANGES_2026-05-07_HIDEAWAY_MOYSKLAD_ORDER.md) | **MoySklad The Hideaway For Women Salon** — customer order `GENCardM2605071059` / **1,845 AED** (7 lines); Snow Booster line is **1000ml** (no 500ml SKU); SPF 50+ → Ultra Shield `54457`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-07_ALLURE_MOYSKLAD_REPORT.md](./SESSION_CHANGES_2026-05-07_ALLURE_MOYSKLAD_REPORT.md) | **MoySklad Allure** — commission report `01346` (8 lines / **1,890 AED** sold items) + shipment `06096` (3 lines / **1,240 AED** replenishment only) under agreement `00045`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-06_PERSONA_PALM_JUMEIRAH_MOYSKLAD_REPORT.md](./SESSION_CHANGES_2026-05-06_PERSONA_PALM_JUMEIRAH_MOYSKLAD_REPORT.md) | **MoySklad Persona Palm Jumeirah** — commission report `01345` + shipment `06095` under agreement `00078`: 14 lines / **41 pcs** / **4,964 AED** (same lines on both docs). |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-05_PERSONA_MARINA_DEMAND.md](./SESSION_CHANGES_2026-05-05_PERSONA_MARINA_DEMAND.md) | **MoySklad Persona Dubai Marina отгрузка** — `06092` under agreement `00024`: Problem Control 50g x2, Snow Cleanser 180ml x2, Snow Booster 200ml x1, Cushion Biege x2, Matrix Shampoo x3, Hair Tonic x2, PDRN pack x2 — **2,250 AED** / 14 pcs / 7 lines. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-05_MISS_YULIA_MOYSKLAD_ORDER.md](./SESSION_CHANGES_2026-05-05_MISS_YULIA_MOYSKLAD_ORDER.md) | **MoySklad Miss Yulia customer order** — `GENCardM2605051058`: Snow O₂ Cleanser 180ml x1 @ 360 (−10%) + Microbiome Mist x1 @ 160 (−10%) + Dubai delivery 45 AED; **513 AED** total; counterparty `Miss Yulia (0505509051)` / `+971505509051`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-05_YULA_BEAUTY_MOYSKLAD_REPORT.md](./SESSION_CHANGES_2026-05-05_YULA_BEAUTY_MOYSKLAD_REPORT.md) | **MoySklad Yula Beauty Salon** — `Полученный отчет комиссионера` `01344` (2 lines / 270 AED) + `Отгрузка` `06091` (radiance x2 + blemish x1 / 415 AED) under agreement `12`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-05_PRODUCT_SCHEMA_AUDIENCE.md](./SESSION_CHANGES_2026-05-05_PRODUCT_SCHEMA_AUDIENCE.md) | **Merchant listings JSON-LD** — Search Console "Invalid object type for field `audience`" fix: `ProductSchema` now emits a single `PeopleAudience` with `suggestedGender` + `suggestedMinAge` per Google Merchant docs (removed generic `@type: Audience` array). |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-03_SEO_LLM_INDEXING.md](./SESSION_CHANGES_2026-05-03_SEO_LLM_INDEXING.md) | **SEO + LLM indexing pass** — crawler-safe proxy exclusions for AI/feed/sitemap endpoints, generated `/llms-full.txt` + `/ai-products.txt`, blog RSS/Atom feeds, OpenSearch descriptor, localized product metadata/schema, absolute image URL hardening, server-rendered PDP JSON-LD, and eight commercial `/guides/*` landing pages. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-03_SENTRY_ISSUES_TRIAGE.md](./SESSION_CHANGES_2026-05-03_SENTRY_ISSUES_TRIAGE.md) | **Sentry production triage** — 13 unresolved website issues checked via `npm run sentry:errors`; top risks are Prisma Accelerate / Cloudflare 1102 failures on homepage/product queries and recurring `/products` `fetch failed` events. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-04_COSMIDEN_COMMISSION_REPORT.md](./SESSION_CHANGES_2026-05-04_COSMIDEN_COMMISSION_REPORT.md) | **MoySklad Cosmiden commission report** — created received commissioner report `01343` only under agreement `15`, with 6 lines / 28 units / 964 AED VAT-inclusive. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-04_VIKTORIIA_KLYMENKO_MOYSKLAD_REPORT.md](./SESSION_CHANGES_2026-05-04_VIKTORIIA_KLYMENKO_MOYSKLAD_REPORT.md) | **MoySklad Viktoriia Klymenko commission report + shipment** — created received commissioner report `01342` and `Отгрузка` `06089` under agreement `33`, both with 5 lines / 6 units / 780 AED VAT-inclusive. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-04_REFRESH_CLINIC_MOYSKLAD_REPORT.md](./SESSION_CHANGES_2026-05-04_REFRESH_CLINIC_MOYSKLAD_REPORT.md) | **MoySklad Refresh Clinic commission report + shipment** — created received commissioner report `01341` and `Отгрузка` `06087` under agreement `24`, both with 13 lines / 21 units / 2,643 AED VAT-inclusive. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-04_PERSONA_MARINA_COMMISSION_REPORT.md](./SESSION_CHANGES_2026-05-04_PERSONA_MARINA_COMMISSION_REPORT.md) | **MoySklad Persona Dubai Marina commission report** — created received commissioner report `01340` under contract `00024`, with 16 lines / 20 units / 2,654 AED VAT-inclusive. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-03_MOBILE_ADMIN_NAV.md](./SESSION_CHANGES_2026-05-03_MOBILE_ADMIN_NAV.md) | **Mobile admin navigation fix** — `/admin` now hides the public mobile footer and shows visible Orders / Users navigation inside the owner admin header, so mobile admins can switch tabs. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-03_CART_SIZE_SELECTION.md](./SESSION_CHANGES_2026-05-03_CART_SIZE_SELECTION.md) | **Cart size selection for bundle items** — mobile web/PWA cart operations now target exact bundle vs non-bundle rows, size chips wrap better on narrow screens, and native paired update preserves Build Your Set variant data so bundle discounts survive size changes. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-03_NATIVE_DISCOUNT_REMOVAL_FIX.md](./SESSION_CHANGES_2026-05-03_NATIVE_DISCOUNT_REMOVAL_FIX.md) | **Native app discount removal fix** — clearing user discount in admin now clears both type and percentage; native session/profile/cart/product display paths require active `discountType`; product cache clears when discount signature changes. Fixes stale 50% discount after app restart. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-02_3D_MOLECULES_HERO.md](./SESSION_CHANGES_2026-05-02_3D_MOLECULES_HERO.md) | **Desktop hero rebuilt as static photoreal portrait + transparent React Three Fiber atom field** drifting around the lady with cursor parallax (X/Y/Z), replacing the autoplay video. Adds `@react-three/{fiber,drei}` + `three`, `components/desktop-experience/{AtomFieldScene,DesktopHero3DVisual}.tsx`, `hooks/useDesktopExperience.ts` (≥768 px + `prefers-reduced-motion` gate), the petri-shot portrait `genosys-athlete-face-hero.png`, and a `/dev/3d-test` GLB inspector. Mobile / PWA / `/products/27` PDP all unchanged. Build clean (376/376), tsc clean, eslint clean. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-02_PERSONA_DOWNTOWN_MOYSKLAD_REPORT.md](./SESSION_CHANGES_2026-05-02_PERSONA_DOWNTOWN_MOYSKLAD_REPORT.md) | **MoySklad Persona Downtown sales report + shipment** — created received commissioner report `01337` for 3 sales lines / 4 units / 610 AED and shipment `06073` under contract `00077` for HR3 Matrix Hair Tonic x2 + Scalp & Hair Shampoo x1 / 460 AED. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-02_VOLNA_MOYSKLAD_REPORT.md](./SESSION_CHANGES_2026-05-02_VOLNA_MOYSKLAD_REPORT.md) | **MoySklad Volna sales report + shipment** — created received commissioner report `01338` and shipment `06075` under contract `19`, both with 4 lines / 6 units / 402 AED VAT-inclusive. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-02_ECLATANT_DEMAND.md](./SESSION_CHANGES_2026-05-02_ECLATANT_DEMAND.md) | **MoySklad Eclatant shipment** — final visible standalone shipment `06076` under contract `18`, with 4 lines / 38 units / 3,135 AED VAT-inclusive; earlier linked shipment was deleted in MoySklad and user's separate `06077` / 19 AED was left untouched. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-02_MELANTA_MOYSKLAD_REPORT.md](./SESSION_CHANGES_2026-05-02_MELANTA_MOYSKLAD_REPORT.md) | **MoySklad Melanta sales report + shipment** — created received commissioner report `01339` and shipment `06078` under contract `14`, both with 7 lines / 8 units / 1,385 AED VAT-inclusive. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-02_MISS_LILY_MOYSKLAD_ORDER.md](./SESSION_CHANGES_2026-05-02_MISS_LILY_MOYSKLAD_ORDER.md) | **MoySklad Miss Lily customer order** — created new counterparty and customer order `GENCardM2605028790` for SPF40 x1 + Dubai delivery, total 150 AED VAT-inclusive. |
| 🔴 **CRITICAL** | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Colors, typography, components |
| 🔴 **CRITICAL** | [DEPLOY_MIGRATIONS.md](./DEPLOY_MIGRATIONS.md) | **DB migrations runbook** — every Vercel build runs `prisma migrate deploy`. Adding migrations, `SKIP_DB_MIGRATIONS` emergency bypass, baseline history, drift detection. Read before touching `prisma/migrations/` or `scripts/deploy-setup.js`. |
| 🟡 **Important** | [VARIANT_VALIDATION_CHECKOUT.md](./VARIANT_VALIDATION_CHECKOUT.md) | Color & size validation at checkout + bag selectors |
| 🟡 **Important** | [API_SECURITY_AUDIT_2026-03-23.md](./API_SECURITY_AUDIT_2026-03-23.md) | API security & code quality audit (6 fixes, 5 deferred) |
| 🟡 **Important** | [PRICING_DISCOUNT_AUDIT.md](./PRICING_DISCOUNT_AUDIT.md) | Pricing logic, discount rules, calculation reference |
| 🟡 **Important** | [EMAIL_TEMPLATES.md](./EMAIL_TEMPLATES.md) | Order email format specification |
| 🟡 **Important** | [NEWSLETTER_SYSTEM.md](./NEWSLETTER_SYSTEM.md) | **Newsletter system — full reference** — public subscribe/unsubscribe + admin composer. Data model (`NewsletterSubscriber` + `NewsletterCampaign`), APIs, XSS-safe markdown renderer, security model (rate limit · honeypot · CSRF · token rotation · scheme whitelist), operations runbook, 2,000-recipient cap rationale, migration path when we scale. Start here before touching anything under `app/api/newsletter/*` or the admin Newsletter tab. |
| 🟡 **Important** | [ORDERS_PAGE.md](./ORDERS_PAGE.md) | Orders page display format |
| 🟡 **Important** | [SUCCESS_PAGE.md](./SUCCESS_PAGE.md) | Order success page - design, API, translations |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-25_SEO_AUDIT_AND_HEADER.md](./SESSION_CHANGES_2026-04-25_SEO_AUDIT_AND_HEADER.md) | **SEO post-audit after brand vs legal-name sweep** — fixed `/ru/contact` + `/ru/brand` wrong-locale metadata & canonicals, stripped `| Genosys` title artifacts (~40 files), normalised all `og:siteName` to `GENOSYS`, trimmed Arabic legal suffix from `/ar/locations` marketing copy, shorter skin-rec title + genosys page title cleanup + `appleWebApp.title` casing. **Desktop header** — wordmark `GENOSYS MIDDLE EAST` (EN/AR/RU) with `whitespace-nowrap`. Commits `e859dd5b`, `0ebf8e97`. |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-25_NEWSLETTER_WELCOME_EMAIL_FIX.md](./SESSION_CHANGES_2026-04-25_NEWSLETTER_WELCOME_EMAIL_FIX.md) | **Newsletter welcome email never arrived in production** — root cause: fire-and-forget SMTP after `NextResponse.json` killed on Vercel serverless. Fix: wrap `sendNewsletterWelcomeEmail` in Next 16 `after()` for new + reactivated subscribers; add success/failure logs with `messageId`. Commit `9199844d`. [NEWSLETTER_SYSTEM.md](./NEWSLETTER_SYSTEM.md) §3.2–3.3 updated. |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-26_PLATFORM_CONSISTENCY_FIXES.md](./SESSION_CHANGES_2026-04-26_PLATFORM_CONSISTENCY_FIXES.md) | **P1 platform consistency fixes** — Russian `html.lang` preserved, login redirects localized to `/ar/login` and `/ru/login`, active PDP desktop/mobile gates aligned to the site-wide `md` breakpoint, and PDP `ProductSchema` now emits localized URL + `inLanguage`. Focused ESLint on edited files: 0 errors, 1 pre-existing profile warning. |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-26_P2_CLEANUP_POLISH.md](./SESSION_CHANGES_2026-04-26_P2_CLEANUP_POLISH.md) | **P2 cleanup/polish** — `llms.txt` + GEO FAQ wording now lead with Dubai Municipality / Montaji, blog mobile-web detection uses the shared viewport hook, desktop `Header` no longer renders unreachable mobile branches, and footer address/microcopy are localized via a local copy map. |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-26_PRICING_CONTRACT_SLICE.md](./SESSION_CHANGES_2026-04-26_PRICING_CONTRACT_SLICE.md) | **Pricing contract migration first slice** — server-side `PricingContract` added beside existing mobile API price fields, parity tests/smoke script added, legacy `price` / `displayPrice` / `originalPrice` behavior preserved for old clients. |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-26_PRICING_DISPLAY_WEB_SLICE.md](./SESSION_CHANGES_2026-04-26_PRICING_DISPLAY_WEB_SLICE.md) | **Web pricing display slice** — product cards, PDP, cart rows, concerns, recommendations, homepage cards, and bundle-builder display now use the contract display helper while checkout math remains untouched. |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-26_PRICING_CONTRACT_CLEANUP_SLICE.md](./SESSION_CHANGES_2026-04-26_PRICING_CONTRACT_CLEANUP_SLICE.md) | **Pricing contract cleanup slice** — remaining skin-recommendation display paths use `getPricingDisplay()`, mobile concern API now includes `pricing`, and checkout/payment math remains untouched pending broader verification. |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-26_WEB_CART_PRICING_HELPER.md](./SESSION_CHANGES_2026-04-26_WEB_CART_PRICING_HELPER.md) | **Web cart pricing helper slice** — `cartStore.getTotalPrice()` now uses a focused cart pricing helper with Jest coverage for retail, VIP, bundle-only, Beauty Box, variant, and Black Friday scenarios; checkout submit payloads remain untouched. |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-26_PRICING_FINAL_INTEGRITY.md](./SESSION_CHANGES_2026-04-26_PRICING_FINAL_INTEGRITY.md) | **Pricing final integrity pass** — invoice generation, manual admin notification resend, and debug order calculation now use stored orders / contract-backed pricing instead of submitted totals; focused regression tests added. |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-28_BUNDLE_VIP_BEST_DISCOUNT_RULE.md](./SESSION_CHANGES_2026-04-28_BUNDLE_VIP_BEST_DISCOUNT_RULE.md) | **Bundle vs VIP best-discount rule** — Bundle Builder and VIP discounts no longer stack or downgrade high-discount users; desktop/mobile web now apply whichever discount is better, matching native TestFlight behavior. |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-26_MOBILE_ORDER_HISTORY_EMAIL_PARITY.md](./SESSION_CHANGES_2026-04-26_MOBILE_ORDER_HISTORY_EMAIL_PARITY.md) | **Mobile native order history email parity** — `GET /api/mobile/orders` and detail/delete ownership now match both login email and `contactEmail`, so Apple/private-relay users can see historical website orders in the native app. |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-17_SEO_IMPROVEMENTS.md](./SESSION_CHANGES_2026-04-17_SEO_IMPROVEMENTS.md) | **SEO & AI-search audit + implementation** — prioritized 10-item audit following the desktop UI rebuild, 8 fixes shipped one commit: (1) AR/RU homepages now render `<HomeDesktopSections />` for locale parity (response size ~10 KB → ~120 KB on both); (2) `public/llms.txt` refreshed with TDRA / VAT / since-2019 / payment methods / newsletter; (3) 3 new FAQ items (payment, official distributor, newsletter) added to EN/AR/RU `GeoFaqSchema`; (4) AR and RU FAQ arrays expanded 5 → 11 items to match EN (restores AI citation parity); (5) new `HomeItemListSchema.tsx` emits 3 `ItemList` JSON-LD blobs per homepage (category rail, concern grid, bestsellers) — all locale-aware URLs; (6) Hero H1 rework — keyword-rich (`Professional Korean Dermacosmetics` / `مستحضرات تجميل كورية احترافية` / `Профессиональная корейская дерматокосметика`), mobile `<h1>` → `<h2>` for single authoritative H1 per page; (7) same `HomeItemListSchema` covers bestsellers rail; (8) `robots.txt` explicitly `Disallow: /newsletter/unsubscribe` across all 3 locales. Build passes, 13 JSON-LD blocks render in SSR on all three locales (3 ItemList + 1 FAQPage + others). OG image regen deferred to a design ticket. |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-17_NEWSLETTER_ADMIN.md](./SESSION_CHANGES_2026-04-17_NEWSLETTER_ADMIN.md) | **Newsletter admin composer shipped** — new `Newsletter` tab inside `/admin` with live stats, markdown composer + XSS-safe preview, locale/source segment filtering, test-send, batched production send via Next.js 16 `after()` with cursor-paginated 150 ms throttle + live polling status, subscriber table (search · filters · manual add · per-row unsubscribe · CSV export), new `NewsletterCampaign` audit model + migration, hand-rolled 170-line markdown renderer with 11/11 XSS smoke tests, hard 2,000-recipient cap with Inngest migration path documented. Full reference: [NEWSLETTER_SYSTEM.md](./NEWSLETTER_SYSTEM.md). |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-17_PDP_UX_OVERHAUL.md](./SESSION_CHANGES_2026-04-17_PDP_UX_OVERHAUL.md) | **Product detail page UX overhaul** — 5 critical fixes: (1) kill fake 5-star rating, swap for live `/api/products/[id]/reviews` fetch + "Be the first to review" fallback; (2) proper `Home / Products / Name` breadcrumb (new `ProductBreadcrumb.tsx`); (3) trust strip unified with `/products` listing (inlined EN/AR/RU copy to sidestep a Turbopack messages-chunk SW cache edge case); (4) right-column details converted to accordion (new `ProductInfoAccordion.tsx`, Benefits open by default, conditional render so collapsed items take 0 height); (5) mobile footer de-cluttered — Share moved to header next to avatar, Add to Bag CTA widened ~50%. All 3 viewports + 3 locales verified via Cursor browser MCP. Lint + typecheck clean. Documents known SW cache quirk and fix (DevTools → Unregister service workers). |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-18.md](./SESSION_CHANGES_2026-04-18.md) | **Observability — Sentry in, LogRocket out** — real prod error tracking via `@sentry/nextjs` (Next 16 instrumentation), LogRocket removed, `lib/monitoring.ts` simplified, ~150 KB client bundle savings. **Page caching strategy (ISR + tag invalidation)** — `/products/[id]` drops `force-dynamic`, FAQ pages gain `unstable_cache` with tag `faq`, admin mutations call `revalidateTag`. **CLI observability** — `npm run sentry:errors` helper + `npm run vercel:logs`, DSN wired in Vercel, end-to-end verified. **Production log cleanup** — `@sentry/nextjs 10.32 → 10.49` fixes DEP0169 `url.parse()` noise, new `lib/prismaRetry.ts` wraps `getProductById`/`getAllProducts`/`getActiveFaqItems` with transient-error retries + Sentry reporting, misleading `ADMIN_EMAIL` warnings rewritten + dedup'd. **Sentry CLI `--resolve` / `--ignore`** — helper script can now close issues from terminal. **Stock management: 50g hyaluron out-of-stock block** — first use of variant-level availability flow, surfaced two-layer architecture (DB + hardcoded UI lists) now documented in [STOCK_MANAGEMENT.md](./STOCK_MANAGEMENT.md). See [SENTRY_SETUP.md](./SENTRY_SETUP.md) for DSN + CLI configuration. |
| 🟡 **Important** | [STOCK_MANAGEMENT.md](./STOCK_MANAGEMENT.md) | **Variant-level stock-out runbook** — when to use, the two-layer DB + hardcoded-list architecture, step-by-step block procedure, restore, and caveats (cart-stale-checkout gap, 5-min mobile cache lag) |
| 🟡 **Important** | [SENTRY_SETUP.md](./SENTRY_SETUP.md) | **Sentry configuration guide** — env vars, first-time setup, verification, PII scrubbing rationale, CLI workflow (`sentry:errors` / `vercel:logs`), smoke tests, auth-token hygiene |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-17_part6.md](./SESSION_CHANGES_2026-04-17_part6.md) | **`/products` page UX refresh** — default sort → *Newest First*, mobile categories → horizontal scroll with snap, NEW category group (*Skin Concern* / *Cream* / *Beauty Boxes*) moved to front + green **NEW** badge on pills and sidebar, **trust strip** under search (free-shipping · authentic · VAT-inclusive) fully i18n EN/AR/RU, mobile sort dropdown now visible, card description capped at 2 lines, guest CTA softened to outlined style, redundant "Back to Home" desktop link removed |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-17_part5.md](./SESSION_CHANGES_2026-04-17_part5.md) | **Post-audit hygiene pass** — Apple App Store URLs unified to `/ae/app/genosys-uae/` form across all live code, admin page backups deleted, untracked files triaged (PII moved out of repo), `.gitignore` hardened, mobile-app iOS OTA dual-config documented |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-17_part4.md](./SESSION_CHANGES_2026-04-17_part4.md) | **Apple button → Apple's official "Download on the App Store"** (EN/RU/AR) + Google Play button added to `LoginModal.tsx` for full symmetry |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-17_part3.md](./SESSION_CHANGES_2026-04-17_part3.md) | **Apple button text → "Download on Apple Store"** — renamed `login.downloadApp` → `login.downloadAppApple` for symmetry with Google button (EN/RU/AR) |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-17_part2.md](./SESSION_CHANGES_2026-04-17_part2.md) | **Google Play button on `/login`** — added below App Store button on mobile + desktop layouts, EN/RU/AR translations |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-17.md](./SESSION_CHANGES_2026-04-17.md) | **MoySklad push fixes** — 5% VAT on delivery (FTA compliance), structured `shipmentAddressFull` so delivery address no longer blank in UI |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-06.md](./SESSION_CHANGES_2026-04-06.md) | **MoySklad API deep-dive** — 2025 financials, Q1 2026 invoices, stock alerts, Montaji PDF update |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-28_EVOLUTION_MOYSKLAD_ORDER.md](./SESSION_CHANGES_2026-04-28_EVOLUTION_MOYSKLAD_ORDER.md) | **MoySklad Evolution order** — created customer order `GENCardM2604288778` for Evolution Aesthetics Clinic, 8 lines / 16 units / 2490 AED VAT-inclusive. |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-28_MISS_VLADA_MOYSKLAD_ORDER.md](./SESSION_CHANGES_2026-04-28_MISS_VLADA_MOYSKLAD_ORDER.md) | **MoySklad Miss Vlada order** — created new counterparty and customer order `GENCardM2604288779`, 7 lines / 7 units / 1740 AED VAT-inclusive. |
| 🟡 **Important** | [2026-04-29_april-2026-profitability-review.md](./2026-04-29_april-2026-profitability-review.md) | **April 2026 profitability review** — MoySklad net sales, gross profit, margin, cash movement, category mix, top products/customers; compares Apr 2026 MTD vs Mar 2026 and Apr 2025. |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-29_PROFITABILITY_REPORT_TAB.md](./SESSION_CHANGES_2026-04-29_PROFITABILITY_REPORT_TAB.md) | **Admin Profitability tab** — on-demand MoySklad profitability report in `/admin`, with date range controls, previous-month/year comparisons, gross profit, margin, category/product/customer mix, and payment breakdown. |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-29_MOBILE_OWNER_ADMIN.md](./SESSION_CHANGES_2026-04-29_MOBILE_OWNER_ADMIN.md) | **Mobile owner admin cockpit** — iPhone-first `/admin` view with Orders and Users as primary tabs, big order cards, status actions, MoySklad push, and customer search/cards while desktop admin remains unchanged. |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-29_SHAKIROVNA_COMMISSION_REPORT.md](./SESSION_CHANGES_2026-04-29_SHAKIROVNA_COMMISSION_REPORT.md) | **MoySklad Shakirovna commission report + shipment** — created received commissioner report `01332` and `Отгрузка` `06051` for Shakirovna Ladies Beauty Saloon, 11 GENOSYS lines, 12 pcs, 1,598 AED VAT-inclusive. |
| 🟡 **Important** | [SESSION_CHANGES_2026-04-27_ULBOSSYN_COMMISSION_REPORT.md](./SESSION_CHANGES_2026-04-27_ULBOSSYN_COMMISSION_REPORT.md) | **MoySklad commission report + shipment** — created received commissioner report `01331` and `Отгрузка` `06044` for Ulbossyn Saparbayeva, 15 GENOSYS lines, 43 pcs, 3,655 AED VAT-inclusive |
| 🟡 **Important** | [SESSION_CHANGES_2026-03-30_part3.md](./SESSION_CHANGES_2026-03-30_part3.md) | **FAQ overhaul** — categories, search, expand/collapse, 4 app FAQs, admin category picker, native app API sync |
| 🟡 **Important** | [SESSION_CHANGES_2026-02-26_part2.md](./SESSION_CHANGES_2026-02-26_part2.md) | Skin concern pages: CTA, collapsible Why/Docs, AI pricing fix |
| 🟡 **Important** | [SESSION_CHANGES_2026-02-26.md](./SESSION_CHANGES_2026-02-26.md) | "Download Genosys UAE App" button on login page with EN/RU/AR translations |
| 🟡 **Important** | [SESSION_CHANGES_2026-02-20.md](./SESSION_CHANGES_2026-02-20.md) | Routine chip remove fix (web), MoySklad cushion color, **protocol PDF download fix** (HTML→PDF) |
| 🟢 **Feature** | [CHATBOT_SETUP.md](./CHATBOT_SETUP.md) | AI Chatbot setup and configuration |
| 🟢 **Feature** | [AI_EXPERT_ANALYSIS.md](./AI_EXPERT_ANALYSIS.md) | AI Expert Skin Analysis with GPT-4o vision |

---

## Documentation by Category

### 📋 Core Project Documentation

| File | Description |
|------|-------------|
| [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) | **Master guide** - Tech stack, structure, patterns, hooks, testing |
| [PERSONAL_CONTEXT.md](./PERSONAL_CONTEXT.md) | **Owner / operator context for AI** — bio, employer, ventures, preferences; safe to cite in chats (no secrets — keep sensitive data out) |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | UI design system, colors, typography |
| [DEPLOY_MIGRATIONS.md](./DEPLOY_MIGRATIONS.md) | **Production DB migrations runbook** — how `prisma migrate deploy` is wired into the Vercel build, adding new migrations, emergency bypass |
| [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) | Legacy password-reset table migration (superseded by `DEPLOY_MIGRATIONS.md` for new work) |
| [WEBSITE_AUDIT_2026-02-12.md](./WEBSITE_AUDIT_2026-02-12.md) | Tech stack evaluation, weaknesses, PPR/Stripe/native app risk |

---

### 📧 Email System

| File | Description |
|------|-------------|
| [EMAIL_TEMPLATES.md](./EMAIL_TEMPLATES.md) | Unified email template specification |
| [EMAIL_CHANGELOG.md](./EMAIL_CHANGELOG.md) | Version history of email system changes |
| [NEWSLETTER_SYSTEM.md](./NEWSLETTER_SYSTEM.md) | **Newsletter system** — public subscribe + admin composer, data model, APIs, XSS-safe markdown renderer, security model, operations runbook |
| [SESSION_CHANGES_2026-04-25_NEWSLETTER_WELCOME_EMAIL_FIX.md](./SESSION_CHANGES_2026-04-25_NEWSLETTER_WELCOME_EMAIL_FIX.md) | **Newsletter welcome SMTP + Vercel `after()`** — why fire-and-forget failed, fix commit `9199844d`, verification steps |
| [ADMIN_EMAIL_ENHANCEMENT.md](./ADMIN_EMAIL_ENHANCEMENT.md) | Admin notification email details |
| [MOBILE_COD_EMAIL_BUG_INVESTIGATION.md](./MOBILE_COD_EMAIL_BUG_INVESTIGATION.md) | COD email debugging notes |

---

### 🛒 Orders & Checkout

| File | Description |
|------|-------------|
| [VARIANT_VALIDATION_CHECKOUT.md](./VARIANT_VALIDATION_CHECKOUT.md) | **NEW** Color & size validation at checkout + bag selectors |
| [PRICING_DISCOUNT_AUDIT.md](./PRICING_DISCOUNT_AUDIT.md) | Full pricing/discount audit across all channels (web + mobile) |
| [SUCCESS_PAGE.md](./SUCCESS_PAGE.md) | Order success page - design, API, translations |
| [ORDERS_PAGE.md](./ORDERS_PAGE.md) | Customer orders page display format |
| [ADMIN_ORDERS_BUGS_FIXED.md](./ADMIN_ORDERS_BUGS_FIXED.md) | Admin orders panel fixes |
| [MOBILE_ORDER_DELETION_SUMMARY.md](./MOBILE_ORDER_DELETION_SUMMARY.md) | Order cancellation feature |
| [CONTACT_EMAIL_FEATURE_DOCUMENTATION.md](./CONTACT_EMAIL_FEATURE_DOCUMENTATION.md) | Checkout contact email feature |
| [WEB_CHECKOUT_CONTACTEMAIL_COMPLETE.md](./WEB_CHECKOUT_CONTACTEMAIL_COMPLETE.md) | Contact email implementation |
| [MOYSKLAD_INTEGRATION.md](./MOYSKLAD_INTEGRATION.md) | MoySklad (МойСклад) accounting integration — manual admin push to sync orders |
| [SESSION_CHANGES_2026-04-17.md](./SESSION_CHANGES_2026-04-17.md) | **MoySklad push fixes** — 5% VAT on delivery + structured `shipmentAddressFull` so delivery address populates in MoySklad UI |
| [SESSION_CHANGES_2026-04-06.md](./SESSION_CHANGES_2026-04-06.md) | **MoySklad full API** — financial reports, stock analysis, 2025 P&L/BS generation, Montaji PDF update |

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
- 12 skin concern protocols (with concern page cross-references)
- 8 Skin Concern page URLs with usage instructions
- 30+ partner salon locations
- Brand story, technologies, certifications
- Multi-language support (EN, AR, RU)

**Key Features:**
- GPT-4o-mini powered beauty advisor (Genie)
- Product recommendations with Add to Cart links
- **Skin Concern page linking** — trained to direct users to curated concern pages with routines
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

### 📲 Native Apps (iOS & Android)

**App Store:** [Genosys UAE](https://apps.apple.com/ae/app/genosys-uae/id6756648064)
**Google Play:** [Genosys UAE](https://play.google.com/store/apps/details?id=ae.genosys.app)

| Detail | iOS | Android |
|--------|-----|---------|
| App Name | Genosys UAE | Genosys UAE |
| Package | id6756648064 | ae.genosys.app |
| Version | 1.5.0 (Build 64) | 1.7.0 (vc75) |
| Status | **Live on App Store** | **Internal Testing** |

**Website Integration:**
- **App Store + Google Play badges** on homepage Hero (side-by-side, EN/AR/RU)
- App Store download link in mobile hamburger menu
- **"Download Genosys UAE App" button on login page** (desktop, mobile web, modal) — below Sign in with Apple
- Localized for EN, AR, RU

---

### 🔐 User Authentication

| File | Description |
|------|-------------|
| [AUTH_PAGES.md](./AUTH_PAGES.md) | **NEW** Forgot/reset password pages, API, security |

---

### 🧴 Skin Concern Pages — Interactive Routine

All 8 skin concern pages have interactive routine product chips:

| Platform | Action | Result |
|----------|--------|--------|
| Desktop / Mobile Web / PWA | Single click | Toggle add/remove from cart |
| Desktop / Mobile Web / PWA | Long press / Right-click | Navigate to product page |
| Native App (iOS/Android) | Single tap | Toggle add/remove from cart (with toast + haptic) |
| Native App (iOS/Android) | Long press (500ms) | Navigate to product page |

**Visual feedback:** Green background + checkmark icon when product is in cart.

**Collapsible sections (all platforms):**
- **"Why" section** — Collapsed by default, tap to expand (`ConcernWhySection.tsx`)
- **"Documentation"** — Protocol PDF download, collapsed by default
- **"Recommended Products"** — Collapsible product grid, open by default

**"Start Your Routine Today" CTA** (`ConcernCTA.tsx`):
- View Bag button (disabled when cart empty, shows item count)
- AI Skin Analysis button (links to `/skin-recommendation`)
- Replaces the old "Complete Your Routine" essentials block (removed Feb 26, 2026)

**Sticky cart bar** (`ConcernStickyBar.tsx`):
- Replaces mobile footer nav on concern pages
- Shows cart total, savings, expand to see items

**Pricing:** Guests see no prices. Logged-in users see discounted prices on routine chips (`RoutineProductChip.tsx`) via `calculateDiscountedPrice()`.

**Technical:** Products are matched by `productNumber` (from URL `/products/10`) to full product objects. The API and web pages both fetch routine-referenced products that may not be in the concern-matched set.

**Key files:** `components/RoutineProductChip.tsx`, `components/ConcernCTA.tsx`, `components/ConcernWhySection.tsx`, `components/ConcernStickyBar.tsx` (web), `app/concern-detail.js` (native), `app/api/mobile/concerns/[slug]/route.ts` (API)

**Protocol PDF downloads:** [PROTOCOL_PDF_DOWNLOAD.md](./PROTOCOL_PDF_DOWNLOAD.md) — Technical doc: web vs native, fix for HTML-vs-PDF bug (Feb 2026)

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
| [API_SECURITY_AUDIT_2026-03-23.md](./API_SECURITY_AUDIT_2026-03-23.md) | **NEW** Full API audit: unauthenticated delete fix, revalidation secret, checkout validation, test-email body parse, 6 fixes + 5 deferred |
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
| [ADMIN_USER_MANAGEMENT.md](./ADMIN_USER_MANAGEMENT.md) | User management — badges, filters, timestamps, lastLoginSource, order stats, **5MB fix** (profilePicture lazy-load), API reference |
| [ADMIN_ANALYTICS_DASHBOARD.md](./ADMIN_ANALYTICS_DASHBOARD.md) | Analytics tab — 5MB fix (findMany → aggregate), error handling, API types |
| [ADMIN_ONLINE_USERS_FEATURE.md](./ADMIN_ONLINE_USERS_FEATURE.md) | Online users — activity tracking, session heartbeat, login source, all auth routes covered |
| [NEWSLETTER_SYSTEM.md](./NEWSLETTER_SYSTEM.md) | **Newsletter tab** — admin composer with markdown + preview, locale/source filters, test-send, batched production send, campaign history polling, subscribers table + CSV export. Full system docs (public flow too). |
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
| Current Items | 22 FAQ items |
| Categories | `general`, `products`, `orders`, `shipping`, `app`, `account` |
| Full Docs | [SESSION_CHANGES_2026-03-30_part3.md](./SESSION_CHANGES_2026-03-30_part3.md) |

**Categories** (added Mar 30, 2026):
- About GENOSYS (`general`) — 4 items
- Products (`products`) — 4 items
- Orders & Payment (`orders`) — 4 items
- Shipping (`shipping`) — 2 items
- Mobile App (`app`) — 4 items
- Account & Support (`account`) — 4 items

**Website features** (`app/faq/FAQClient.tsx`):
- Search bar with real-time filtering
- Category tab pills (horizontal scroll)
- Section headers with icons when viewing "All"
- Expand All / Collapse All toggle
- Multi-open accordion
- App download banner with Store badges
- Full EN/AR/RU localization

**Native app features** (`genosys-mobile-app/app/faq.js`):
- Category grouping with section headers + icons
- Search bar with real-time filtering
- Multi-open accordion
- HTML tag stripping for clean display

**How to manage:**
1. Go to Admin Dashboard → FAQ tab
2. Add, edit, reorder, toggle, or delete FAQ items
3. Select a category from the dropdown when creating/editing
4. Changes appear on website and mobile app automatically (mobile fetches via API)

---

### 📅 Session Logs (Daily Changes)

| File | Description |
|------|-------------|
| [SESSION_CHANGES_2026-04-17_SEO_IMPROVEMENTS.md](./SESSION_CHANGES_2026-04-17_SEO_IMPROVEMENTS.md) | **NEW** **SEO & AI-search audit + 8-item implementation.** After the desktop UI rebuild and newsletter launch the SEO surface was stale — audited 10 items, shipped 8 in one commit: (1) **AR/RU homepages now render `<HomeDesktopSections />`** — extracted `getHomeData()` to `lib/homeData.ts` so all three locale homepages share one cached payload; response size went from ~10 KB (Hero only) to ~120 KB (full catalog rail, concerns, bestsellers, Why GENOSYS, newsletter CTA) on both AR and RU. (2) **`public/llms.txt` refreshed** with TDRA-licensed + VAT-registered + Dubai Municipality certified + "operating in the UAE since 2019" + payment methods (Visa/Mastercard/Apple Pay/Google Pay via Stripe) + newsletter section. (3) **3 new FAQ items** added to EN/AR/RU `GeoFaqSchema` covering payment methods, authorised-distributor credentials, and newsletter subscription. (4) **AR/RU FAQ parity** — expanded from 5 → 11 items each to match EN, restoring multilingual AI citation. (5 + 7) **New `components/schema/HomeItemListSchema.tsx`** emits 3 JSON-LD `ItemList` blobs per homepage (category rail = 6, concern grid = 8, bestsellers = 4) with locale-aware URLs. (6) **Hero H1 rework** — keyword-rich text per locale (`Professional Korean Dermacosmetics` / `مستحضرات تجميل كورية احترافية` / `Профессиональная корейская дерматокосметика`) + mobile `<h1>` converted to `<h2>` for single authoritative H1 per page. (8) **`robots.txt`** explicitly `Disallow: /newsletter/unsubscribe` across 3 locales. Verification: TypeScript clean for production code, `npm run build` exit 0, SSR smoke test confirms 3 `ItemList` + 1 `FAQPage` JSON-LD blocks on all three locales (13 total `<script type="application/ld+json">`). OG image regen deferred to a design ticket. |
| [SESSION_CHANGES_2026-04-17_NEWSLETTER_ADMIN.md](./SESSION_CHANGES_2026-04-17_NEWSLETTER_ADMIN.md) | **NEW** **Newsletter admin composer shipped.** New `Newsletter` tab inside `/admin` with live stats (active + per-locale), markdown composer + XSS-safe preview, locale/source segment filtering with live recipient count, test-send, batched production send via Next.js 16 `after()` (cursor pagination, 150 ms throttle, live polling), subscribers table (search · filters · manual add · per-row unsubscribe · CSV export), new `NewsletterCampaign` audit model + migration, hand-rolled 170-line markdown renderer (11/11 XSS smoke tests), hard 2,000-recipient cap with Inngest migration path documented. 11 new/changed files, zero new type errors, all 4 admin endpoints correctly 401 unauth, admin page compiles 200. Full reference: [NEWSLETTER_SYSTEM.md](./NEWSLETTER_SYSTEM.md). |
| [SESSION_CHANGES_2026-04-18.md](./SESSION_CHANGES_2026-04-18.md) | **NEW** Six items. (1) **Sentry wired up, LogRocket dropped** — real prod error tracking via `@sentry/nextjs` with Next 16 instrumentation (`instrumentation.ts`, `instrumentation-client.ts`, `sentry.{server,edge}.config.ts`), `app/global-error.tsx` now a plain-HTML last-resort boundary, `lib/monitoring.ts` simplified, ~150 KB client bundle freed. (2) **Page caching strategy (ISR + `revalidateTag`)** — `/products/[id]` drops `force-dynamic` → `revalidate = 300` with `unstable_cache` layer tagged `products`; FAQ pages (EN/AR/RU) share new `lib/faqDb.ts` + tag `faq`; AR/RU blog slugs now `revalidate = 60` to match EN; admin product/FAQ routes call `revalidateTag('…', 'max')` on write. (3) **CLI observability tooling** — Sentry + Vercel CLIs installed globally, new `scripts/sentry-errors.js` wrapper over Sentry REST API, npm scripts: `sentry:errors`, `vercel:logs`, `vercel:logs:errors`, `vercel:logs:follow`. `NEXT_PUBLIC_SENTRY_DSN` wired in Vercel, empty-commit redeploy triggered ingestion; verified end-to-end with `sentry-cli send-event`. (4) **Production log cleanup** — three pre-existing prod signals surfaced via `vercel:logs:errors` fixed at the root. Upgraded `@sentry/nextjs 10.32.1 → 10.49.0` (pulls in `@opentelemetry/instrumentation-http@0.214` → DEP0169 `url.parse()` deprecation spam gone). New `lib/prismaRetry.ts` helper wraps Prisma reads (`getProductById`, `getAllProducts`, `getActiveFaqItems`) with 2-retry backoff on transient errors (`ETIMEDOUT`, `ECONNRESET`, `fetch failed`, `null pointer passed to rust` engine panics) and reports exhausted retries to Sentry tagged `area:prisma-retry`. Misleading `ADMIN_EMAIL and ADMIN_PASSWORD not set` warning removed; replaced with accurate check firing only when ALL of `ADMIN_EMAIL`/`GMAIL_USER`/`EMAIL_USER` are missing. Module-level dedup added so remaining env warnings fire once per cold start. (5) **Sentry CLI `--resolve` / `--ignore`** — `scripts/sentry-errors.js` extended with issue-status mutations so issues can be closed from the terminal alongside `vercel:logs`. Used to close `JAVASCRIPT-NEXTJS-4` after the retry broadening shipped — auto-reopens if new events arrive. (6) **Stock management: hyaluron cream 50g out-of-stock block** — first real-world use of the DB variant-availability flow; surfaced a two-layer architecture (DB `ProductVariant.available` for mobile API + checkout, hardcoded lists in `utils/productPricing.ts` for website UI). New `scripts/set-hyaluron-cream-availability.ts block-50g\|restore-50g` handles the DB side; `utils/productPricing.ts` + `components/product/ProductInfo.tsx` get product-29 branches split out of shared groups with `temporarily out of stock` comments for restore grep-ability. Documented as a reusable runbook in [STOCK_MANAGEMENT.md](./STOCK_MANAGEMENT.md). |
| [SESSION_CHANGES_2026-04-17_part5.md](./SESSION_CHANGES_2026-04-17_part5.md) | **NEW** Post-audit hygiene pass. Apple App Store URLs unified to UAE locale form (`https://apps.apple.com/ae/app/genosys-uae/id6756648064`) across all live code, API routes, not-found pages, and `docs/README.md` — replaces the short `/app/id...` form that was inconsistent between header/Hero and LoginClient. Admin page backups (`page.tsx.backup`, `.bak`) deleted. Untracked files triaged: PII-bearing customer protocols moved to `~/Documents/genosys-customer-protocols/`, orphan assets (6 images, 11MB Splash2.mp4) deleted, one-off Stuart/BB-cream scripts deleted, `list-blog-posts.js` + `vat-q1-2026-validation.js` kept. `.gitignore` adds `/docs/customers/` safety net. Mobile-app: new `docs/OTA_UPDATES.md` explaining why `Expo.plist` and `app.json.updates` both carry OTA config (iOS production doesn't prebuild). |
| [SESSION_CHANGES_2026-04-17_part4.md](./SESSION_CHANGES_2026-04-17_part4.md) | **NEW** (1) Apple button label corrected to Apple's official brand wording: `"Download on the App Store"` (EN), `"Загрузите в App Store"` (RU), `"حمّل من App Store"` (AR). (2) Google Play button added to `LoginModal.tsx` so the inline login popover now has the same App Store + Google Play stack as `/login`. |
| [SESSION_CHANGES_2026-04-17_part3.md](./SESSION_CHANGES_2026-04-17_part3.md) | **NEW** Apple button label follow-up: renamed `login.downloadApp` → `login.downloadAppApple` (symmetric with `login.downloadAppGoogle`), new value `"Download on Apple Store"` / `"Загрузите в Apple Store"` / `"احصل عليه من Apple Store"`. Updated 3 call-sites: `LoginClient.tsx` (mobile + desktop) and `LoginModal.tsx`. Modal also gets the new text. |
| [SESSION_CHANGES_2026-04-17_part2.md](./SESSION_CHANGES_2026-04-17_part2.md) | **NEW** Google Play "Download on Google Play" button added to `/login` page (EN/RU/AR), mirrors the existing App Store button on both mobile compact card and desktop card. Android users now have a direct Play Store link at login. Icon + label + RTL handling all wired through `messages/*.json` via new `login.downloadAppGoogle` key. Scoped to `/login` only — `/pwa-login` and `LoginModal` intentionally untouched. |
| [SESSION_CHANGES_2026-04-17.md](./SESSION_CHANGES_2026-04-17.md) | **NEW** MoySklad push-integration fixes: (1) delivery service line now booked at 5% VAT instead of 0% — fixes FTA output-VAT under-declaration; (2) delivery address now sent as structured `shipmentAddressFull` (country/city/street) instead of plain-string `shipmentAddress` — fixes blank delivery-address field in MoySklad UI |
| [SESSION_CHANGES_2026-04-06.md](./SESSION_CHANGES_2026-04-06.md) | **NEW** MoySklad API deep-dive — full financial data extraction (2025 P&L/BS, Q1 2026 invoices, stock alerts, expense categorization), Montaji registration review (EPI Peeling EXPIRED), PDF update + Vercel deploy. Scripts: `moysklad-q1-report.js`, `moysklad-invoices-export.js`, `moysklad-2025-financials.js`, `moysklad-2025-expenses.js` |
| [SESSION_CHANGES_2026-03-30_part3.md](./SESSION_CHANGES_2026-03-30_part3.md) | **NEW** FAQ overhaul — categories (6), search, expand/collapse, 4 new app FAQs (EN/AR/RU), admin category picker, GeoFaqSchema SEO, native app category grouping + API-driven FAQ. OTA deployed. |
| [SESSION_CHANGES_2026-03-30_part2.md](./SESSION_CHANGES_2026-03-30_part2.md) | Android app blog post published (12 posts, all translated). **Privacy policy** expanded 4→14 sections (mobile apps, AI, UAE PDPL). **Privacy policy API** (`GET /api/mobile/privacy-policy`) for mobile sync — apps fetch from server instead of hardcoded JSON. OTA deployed. |
| [SESSION_CHANGES_2026-03-30.md](./SESSION_CHANGES_2026-03-30.md) | Admin Users 5MB fix — `profilePicture` excluded from list query, new GET `/api/admin/users/[id]`, lazy-load on profile open. **Google Play badge** added to homepage Hero (side-by-side with App Store, EN/AR/RU) |
| [API_SECURITY_AUDIT_2026-03-23.md](./API_SECURITY_AUDIT_2026-03-23.md) | Full API audit: close unauthenticated DELETE, require revalidation secret, validate checkout inputs, fix test-email body parse, fix `exactOptionalPropertyTypes` violation (6 fixes, 5 deferred) |
| [SESSION_CHANGES_2026-03-11.md](./SESSION_CHANGES_2026-03-11.md) | Per-item `bundleDiscount` fix, `exactOptionalPropertyTypes` build fix, **support-link payment removal** (~1,100 lines), **COD admin email fix** (`after()` vs fire-and-forget) |
| [SESSION_CHANGES_2026-03-07.md](./SESSION_CHANGES_2026-03-07.md) | GSC Soft 404 fix (server-side order validation + robots.txt), CSRF cookie missing fix (SW Set-Cookie stripping + client fallback) |
| [SESSION_CHANGES_2026-02-26_part2.md](./SESSION_CHANGES_2026-02-26_part2.md) | Skin concern pages: Replace "Complete Your Routine" with CTA, collapsible Why section on all screens, Documentation header sizing, AI Expert Analysis discount pricing fix, remove "View Recommended Products" button |
| [SESSION_CHANGES_2026-02-26.md](./SESSION_CHANGES_2026-02-26.md) | "Download Genosys UAE App" button on login page (desktop, mobile web, modal) with EN/RU/AR translations |
| [SESSION_CHANGES_2026-02-20.md](./SESSION_CHANGES_2026-02-20.md) | Fix routine chip remove for products with size variants (web) |
| [SESSION_CHANGES_2026-02-19_part2.md](./SESSION_CHANGES_2026-02-19_part2.md) | Concern detail API, native concern-detail screen, native training screen, routine add-to-cart (tap toggle + long-press navigate), product ID mismatch fix (CUID vs productNumber), breadcrumb hiding, toast messages, TestFlight build 64 |
| [SESSION_CHANGES_2026-02-19.md](./SESSION_CHANGES_2026-02-19.md) | Concern page product refinement (page-specific keys), scoring algo overhaul (MAX=4, threshold=30), routine essentials, 8 protocol rework, Skin Concern category (web+native), native concerns screen, Genie chatbot training, Browse by Concern CTAs, PDRN mask video |
| [SESSION_CHANGES_2026-02-18.md](./SESSION_CHANGES_2026-02-18.md) | Sun-protection page overhaul — product filtering fix, embedded AM/PM skincare routine, SPF badges, "Why" highlights, protocol PDF, expanded FAQ, corporate color on open steps |
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

*Last updated: April 17, 2026 — Newsletter admin composer*
