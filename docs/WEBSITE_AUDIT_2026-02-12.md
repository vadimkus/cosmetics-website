# Website Audit & Tech Stack Evaluation — February 12, 2026

## Summary

Comprehensive audit of genosys.ae covering: tech stack evaluation, identified weaknesses, new technology opportunities, and risk assessment for native app, Stripe, and social logins.

---

## Current Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 16.1.1 |
| Language | TypeScript | 5.9.3 |
| Styling | Tailwind CSS | 4.1.18 |
| ORM | Prisma | 7.3.0 |
| Database | PostgreSQL (Neon) | — |
| State | Zustand | 5.0.8 |
| Hosting | Vercel | — |
| i18n | next-intl | 4.5.5 |
| Payments | Stripe | 19.0.0 |
| Monitoring | Sentry, LogRocket | — |
| React | 19.2.3 | — |

**Verdict:** Core stack is modern and well-chosen. Issues are in *usage depth*, not technology choices.

---

## Key Weaknesses Identified (Pre-Fix)

| Priority | Issue | Status |
|----------|-------|--------|
| High | Product page 4 DB calls per request (metadata + page + OG + Twitter) | **Fixed** — React `cache()` deduplication |
| High | Missing `loading.tsx` on product detail, checkout, orders, blog post | **Fixed** — Skeletons added |
| Medium | Product page `force-dynamic` + `revalidate=0` — no caching | Not addressed (intentional for fresh data) |
| Medium | Root layout provider overload (15+ providers) | Not addressed |
| Medium | Framer Motion bundle bloat (15+ components) | Not addressed |
| Medium | Prisma schema missing indexes (UserAction, UserSession, etc.) | Not addressed |
| Medium | Raw `fetch` instead of SWR hooks in several components | Not addressed |
| Low | PPR + `cacheComponents` not enabled | **Deferred** — requires major migration |

---

## PPR + cacheComponents — Why Deferred

**Decision:** Do not enable `cacheComponents: true` in `next.config.js` without a dedicated migration.

**Reason:** When `cacheComponents` is enabled, Next.js 16 also enables `dynamicIO`. This changes default data fetching behavior. Every route that accesses:
- Database
- `headers()`, `params`, `searchParams`
- Short-lived cache

…must have either:
1. A `Suspense` boundary above it, or
2. A `'use cache'` directive

Otherwise: *"A component accessed data without a Suspense boundary nor a 'use cache' above it."*

With 60+ routes doing server-side fetches, this is a route-by-route migration. The `loading.tsx` files added in this session are a prerequisite (they serve as Suspense fallbacks).

---

## Stripe: Apple Pay & Google Pay

**Current state:** Web checkout uses Stripe Payment Element with `payment_method_types: ['card', 'link']` — explicitly limits to card and Link only.

**To enable Apple Pay / Google Pay:**
1. **Code:** Replace `payment_method_types: ['card', 'link']` with `automatic_payment_methods: { enabled: true }` in `lib/stripe.ts` (both `createPaymentIntent` and `createCheckoutSession`).
2. **Stripe Dashboard:** Register domain `genosys.ae` under Payment method domains; enable Apple Pay and Google Pay.
3. **Domain verification:** Add `.well-known/apple-developer-merchantid-domain-association` if Stripe requires it.

**Mobile app:** Uses separate route `/api/mobile/checkout/stripe` — hosted Checkout Session. Unaffected by web Payment Element changes.

---

## Native App Integration Risk

| Change Category | Mobile Risk | Notes |
|-----------------|-------------|-------|
| Web UI changes | None | Web-only |
| Web-only API routes | None | Mobile uses `/api/mobile/*` |
| Shared routes (`/api/products`, `/api/webhooks/stripe`) | High | Do not change response shapes |
| Mobile API response shapes | Critical | Order items, auth, product schema |
| Database schema | High | Columns used by mobile API |
| Environment variables | Critical | `MOBILE_APP_KEY`, `JWT_SECRET` |

**Key contracts:** See [MOBILE_API_ENHANCED_DOCUMENTATION.md](./MOBILE_API_ENHANCED_DOCUMENTATION.md) and [api/MOBILE_API_TYPES.md](./api/MOBILE_API_TYPES.md).

---

## Stripe Checkout Clarification

**Embedded vs Hosted:**
- **Web:** Already uses embedded Payment Element (Stripe UI inside our BottomSheet) — no redirect to stripe.com.
- **Mobile app:** Uses hosted Checkout (opens `paymentUrl` in SFSafariViewController) — different flow, separate route.

**Recommendation:** Keep current web implementation. The newer Stripe `<EmbeddedCheckout>` component would reduce UI control for marginal conversion gains.

---

## Recommended Future Improvements

| Action | Effort | Impact |
|--------|--------|--------|
| Enable `automatic_payment_methods` for Apple/Google Pay | 5 min | High conversion on mobile web |
| Add missing Prisma indexes | 30 min | Faster analytics/session queries |
| Extract hardcoded values to config (CheckoutClient product IDs, thresholds) | 1 day | Maintainability |
| PPR migration (route-by-route) | 1–2 weeks | TTFB, conversion |
| API versioning for mobile (`/api/mobile/v1/`) | 1 week | Long-term safety |

---

## References

- [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) — Tech stack, patterns
- [SESSION_CHANGES_2026-02-12.md](./SESSION_CHANGES_2026-02-12.md) — Changes implemented
- [MOBILE_API_ENHANCED_DOCUMENTATION.md](./MOBILE_API_ENHANCED_DOCUMENTATION.md) — Mobile API reference
