# Session Changes — 2026-07-06 — Twenty-Element Audit (Security, Commerce, DB, SEO, App)

Twenty areas audited (six read-only subagents + direct DNS/npm/secrets/sitemap checks), fixes applied one by one, verified locally + on production. Web commits `c5ae1259`, `dc45d34d`; mobile commit `b95e247` + EAS OTA (runtime 1.10.5). Prod verified: security gates return 401/404, sitemap has `/terms`, AASA has reset-password paths, key pages 200, cron gated.

## CRITICAL — unauthenticated PII / abuse (all closed)

| Endpoint | Was | Now |
|---|---|---|
| `POST /api/auth/refresh` (web) | returned any user's full profile by email — customer-list enumeration | session-authenticated; body email ignored; returns only caller's record |
| `GET /api/orders/success/[orderNumber]` | full order PII (name/email/phone/address) public by order number | requires session email == order.customerEmail, or admin; 404 otherwise |
| `POST /api/blog/comments` | commenter identity taken from request body/header (impersonation) | identity resolved only from `genosys_session` cookie + tokenVersion check |
| `POST /api/certificates/send` | unauthenticated branded gift-cert email to any address (spam/phish) | admin-only (`requireAdminAuth`) |
| `POST /api/invoice/generate` | any caller could resend invoices by order number | owner (session email) or admin only |

Verified on prod: all return 401/404 to unauthenticated callers; blog comment rejected even with a valid CSRF token when no session.

## Commerce integrity

- **Free-gift threshold now server-enforced** on all 5 order paths (web COD, web card, mobile COD, mobile Stripe, Apple Pay). New `allowedFreeGiftUnits()` + `freeGiftKind()` in `lib/checkoutPricingGuards.ts`: collagen mask only at subtotal ≥500, + sea-algae at ≥700. Free items are deferred until the paid subtotal is final, then only the allowed count is admitted; extra/undeserved free items are dropped. Was UI-only — a crafted request could get a free mask for shipping cost.
- **Out-of-stock enforcement** added to all 5 paid order paths (`if (!product.inStock) → 400`). Not added to `readProductById` so PDPs still display OOS products; free-gift masks bypass the check.
- **Verified sound (no change):** item prices always recomputed server-side (client prices ignored), VIP discount from DB bounded 0<pct<100, bundle tier server-substituted, shipping fail-closed, VAT server-side, CSRF on web, Stripe webhook signature + paid-transition dedupe, `reconcilePaidAmount` logs mismatches.
- **Documented (deliberate business decision, not changed):** bundle discount is granted by counting client-flagged bundle lines (max 20%) rather than requiring a verified bundle-builder session — the discount is an advertised feature; web COD order number is client-supplied (DB unique constraint catches dupes).

## API hardening

- Per-IP rate limits added to `create-payment-intent` and `create-checkout-session` (8/min) — were unlimited (Stripe billing + DB amplification risk).
- `skin-analysis/ai` moved from an in-memory Map (reset per serverless cold start) to the hybrid DB `rateLimitSimple` (10/hr/IP).

## Session & cookie (partial — highest-value done)

- Fixed: `auth/refresh`, `orders/success`, `blog/comments` (above).
- **Deferred with rationale:** logout does not bump `tokenVersion` (doing so would kill the user's sessions on *all* devices on every logout — a UX tradeoff, not clearly desired); admin session has no tokenVersion (24h TTL limits exposure); mobile refresh grace is 60 days (→ effective 90-day token life). These are documented for a future dedicated session-management pass.

## Observability / error handling

- `error.tsx` no longer renders raw `error.message` to users in production (client throws could leak internal messages).
- `sentry.server.config.ts` `beforeSend` now strips cookies, `authorization`/`x-api-key` headers, user IP + email (client config already did).
- `Sentry.captureException` added to the catch blocks of `cod-confirmation`, `create-payment-intent`, `create-checkout-session` — checkout failures were previously invisible to alerting.
- `lib/logger.ts` `writeToFile` now early-returns on Vercel/production (the FS is read-only there — every log call was throwing EROFS and swallowing it).
- Admin error responses (`analytics`, `admin/users`, `translate-blog-posts-ru`) no longer leak `error.message` in production.
- **Reviewed, no change:** `PerformanceMonitor` correctly reports Web Vitals to GA4 (nav-timing/memory sections are prod-dead but harmless); all 3 locale `not-found.tsx` return real 404s; Sentry client noise filters are thorough.

## Database

- Created on production (CONCURRENTLY, non-blocking, via `scripts/add-order-indexes.ts`) + declared in schema: `order_items(productId)` and `orders(status, createdAt)` — back the admin product-performance / revenue-trends / CLV reports.
- Bounded the admin `userAction` cleanup scan with `take: 50`.
- **Deferred:** `page_views(ipAddress)` index + analytics-query caching (write-amplification tradeoff on the hottest table; the new retention cron shrinks it instead). `push_subscriptions.findMany()` left unbounded (admin-only, small table).

## Admin metrics

- `getAnalyticsData` (`lib/analyticsServer.ts`): "orders placed" now counts non-cancelled (matching the ux-metrics card), and revenue now sums `paymentStatus:'paid' OR status:'DELIVERED'` (excluding cancelled). Previously both counted DELIVERED-only, which zeroed every paid-but-undelivered card order in the revenue figure.

## SEO / content

- Sitemap: added `/terms` (+AR/RU — were live 200 but orphaned from the sitemap); replaced the moving `now` lastmod on home/products/blog with a stable date (a constantly-changing lastmod makes Google discard the signal); pinned `sitemap-index.xml` lastmod.
- **Reviewed, healthy:** 404s real in all locales, hidden products excluded from sitemap, guide slug 404s are hard 404s, robots.txt scoping correct, locations LocalBusiness schema present (3 cities lack coordinates → no map link, minor).
- **Decision documented, NOT changed — `/training` public access:** the audit flagged the web `/training` page as having no server-side auth gate (the mobile API is key-gated). It is intentionally `index:true` + in the sitemap, and the underlying PDFs live at public `/documents/*` URLs regardless of any page gate, so gating the page would hurt SEO without actually protecting the files. Whether training should be professional-only (gate + move PDFs behind auth) or stay public for SEO is a business decision left to the owner.

## Dependencies / secrets / email (DNS)

- `nodemailer` 8 → 9.0.3 (fixes GHSA-p6gq-j5cr-w38f). Web `npm audit`: **0 vulnerabilities**.
- Mobile `npm audit`: 23 findings (2 high) — all in the Expo/Metro/React-Native **dev toolchain** (undici, ws under `@expo/cli`/`metro`), none in the shipped app bundle. No action; they don't ship.
- Secrets scan (git-tracked files): clean — only `sk_live_xxx`-style placeholders in docs and test fixtures; `.env*` files are gitignored (only `.env.example` tracked). Local machine has many `.env.*.backup` files — not in git.
- **Email deliverability (DNS, documented — no code change):** genosys.ae has SPF, but DMARC is `p=none` (monitor-only) and no DKIM selector is published. Transactional email is currently sent from a **gmail.com** address via Gmail SMTP (`From: … <…@gmail.com>`), so Gmail's own SPF/DKIM authenticate it and deliverability is functional — but customers see a gmail sender, not `@genosys.ae`. Recommendation (infra, owner decision): move transactional mail to a domain sender (Resend/SES) with `@genosys.ae` DKIM, then raise DMARC to `p=quarantine`.

## Analytics data-retention cron (new)

- `app/api/cron/analytics-retention/route.ts` + `vercel.json` cron (daily 01:30) — deletes `page_views` / `user_sessions` older than 365 days in bounded batches (GDPR/PDPL storage limitation; complements the cookie-consent work from earlier today). Gated by `CRON_SECRET` (set on Vercel production). Orders/PDF-download records untouched.

## Mobile app

- `/orders/<id>` universal links now open the native order-detail screen (were falling through to a WebView). OTA-shipped.
- `app.json`: added `/reset-password` + `/forgot-password` Android intentFilters to match the AASA paths added web-side (takes effect on next native build; AASA change already helps iOS).
- Cold-start auth restore parallelized: `getUserSession` reads SecureStore + AsyncStorage together; biometric support + enabled read together; biometric type name derived from the already-fetched support object (was a 2nd hardware round-trip); removed the redundant post-validation `checkBiometricAvailability()`. OTA-shipped (update group `781a1fd3`).

## Verification

- `tsc --noEmit` clean, `npm run build` clean (cron route present in manifest), web `npm audit` 0 vulns.
- Local prod build browser/curl: auth/refresh 401, order-success 404 unauth, certificates 401, blog-comment 401 without session, cron 401.
- Production after deploy: same gates 401/404; `/`, `/products`, `/products/66`, `/checkout`, `/cart`, `/blog`, `/terms`, `/ar/terms` all 200; sitemap contains `/terms`; AASA contains reset-password.
- Mobile: Babel parse-check + `expo export` succeed; OTA published iOS+Android.
