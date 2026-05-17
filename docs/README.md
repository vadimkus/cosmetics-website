# GENOSYS Cosmetics Website - Documentation Index

> **AI ASSISTANT: READ THIS FIRST**
> This is the comprehensive documentation index for the GENOSYS Professional cosmetics e-commerce website.
> Always read relevant documentation before making changes.

## Quick Links

| Priority | Document | Description |
|----------|----------|-------------|
| 🔴 **CRITICAL** | [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) | **Start here!** Tech stack, project structure, patterns |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-16_RUSSIAN_TRANSLATION_AUDIT.md](./SESSION_CHANGES_2026-05-16_RUSSIAN_TRANSLATION_AUDIT.md) | **Russian translation audit** — all visible products now have natural `nameRu` + `descriptionRu`; Russian labels, SEO metadata, blog titles/excerpts, concern pages, GEO FAQ, and PWA manifest were polished for more natural wording. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-16_PRODUCT_ARABIC_TRANSLATION_REVIEW.md](./SESSION_CHANGES_2026-05-16_PRODUCT_ARABIC_TRANSLATION_REVIEW.md) | **Product Arabic translation review** — all visible products now have improved `nameAr` + natural `descriptionAr`; DB scan shows no missing Arabic product fields or audited machine-translation residues. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-17_MOYSKLAD_PAID_ORDER_STATUS.md](./SESSION_CHANGES_2026-05-17_MOYSKLAD_PAID_ORDER_STATUS.md) | **MoySklad paid website order status** — admin sync now creates paid online (`stripe` / `apple_pay`) customer orders with `paymentStatus=paid` as **`Оплачен - Ждет доставки`**; COD/unpaid/pending remains **`Новый`**. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-17_MOBILE_WEB_PARTNERS_MENU.md](./SESSION_CHANGES_2026-05-17_MOBILE_WEB_PARTNERS_MENU.md) | **Mobile web Partners navigation** — added `Partners` to the hamburger dropdown and registered `/partners` as a simple-header route so the partners page opens with its own app-like mobile header. |
| 🟡 **Important** | [SESSION_CHANGES_2026-05-17_ELYAZIA_PARTNER_ADDED.md](./SESSION_CHANGES_2026-05-17_ELYAZIA_PARTNER_ADDED.md) | **Partners page update** — added `ELYAZIA BEAUTY CENTER, MIRDIF` with supplied logo, address, phone, website, directions link, and mobile app feed visibility through shared `lib/partners.ts`. |
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
