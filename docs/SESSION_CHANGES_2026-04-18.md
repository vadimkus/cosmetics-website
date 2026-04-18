# Session Changes — 2026-04-18

Two separate work items committed the same day:

1. **Observability** — Sentry in, LogRocket out.
2. **Page caching strategy** — FAQ + product pages + blog/slug unified around ISR + tag revalidation. [Jump ↓](#page-caching-strategy-isr--tag-invalidation)

---

## 1. Observability (Sentry in, LogRocket out)

## Summary

Wired up `@sentry/nextjs` properly for Next.js 16 + React 19, removed
`logrocket` entirely. Production errors now ship to Sentry (once the DSN
env var is set in Vercel); bundle gets smaller either way.

Prior state: both Sentry and LogRocket were listed as dependencies but
neither was actually initialized — no DSN, no App ID, `MonitoringProvider`
was defined but never mounted in the root layout. So despite ~600 KB of
monitoring SDKs in the client bundle, **zero production errors were being
captured**.

## What changed

### New files

| File | Purpose |
|---|---|
| `instrumentation.ts` | Next.js instrumentation entry; wires Node.js + Edge runtimes and exports `onRequestError` |
| `instrumentation-client.ts` | Client-side `Sentry.init`; PII-scrubbing `beforeSend`; `onRouterTransitionStart` export for App Router nav spans |
| `sentry.server.config.ts` | Server runtime init (10 % trace sample, enabled only in prod or with `SENTRY_ENABLE_DEV=true`) |
| `sentry.edge.config.ts` | Edge runtime init (mirrors server config) |
| `app/global-error.tsx` | Last-resort React render error boundary; renders plain HTML so failed-provider crashes still show something |
| `docs/SENTRY_SETUP.md` | End-to-end setup + env-var reference + verification recipe |

### Modified files

| File | Change |
|---|---|
| `next.config.js` | Wrapped with `withSentryConfig`; moved `disableLogger` / `automaticVercelMonitors` into the new `webpack: {…}` block (Sentry v10 deprecation) |
| `app/error.tsx` | Now calls `Sentry.captureException(error)` alongside the existing `errorLog` |
| `lib/monitoring.ts` | **Dropped `LogRocketMonitoringService` + `LogRocketSDK`.** Simplified `SentryMonitoringService` to use the already-initialized SDK instead of dynamic-importing it. Added no-DSN fallback that logs locally via `debugLog`/`errorLog` so dev output isn't silent |
| `.env.example` | Replaced commented stubs with real setup instructions for `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`, and the `SENTRY_ENABLE_DEV` flags. Removed LogRocket lines. |
| `package.json` | Removed `"logrocket": "^10.1.0"` |
| `package-lock.json` | Regenerated — 1 package removed |

### Untouched (intentionally)

- `components/MonitoringProvider.tsx` — still defined, still not mounted.
  Kept as available React-context scaffolding if you ever want to use
  `useMonitoring()` hook from client components.
- `lib/errorTracking.ts` — opinionated wrappers (`trackApiError`,
  `trackPaymentError`, …). Not currently called; kept for future use.
- `components/PerformanceMonitor.tsx` — independent of monitoring SDK,
  emits `web-vitals` data via its own path.

## Config rationale

- **Session Replay disabled.** Replay adds ~90 KB to the client bundle
  and consumes Sentry quota. We dropped LogRocket specifically for
  bundle reasons; enabling Replay would partly undo that win.
- **Feedback widget disabled.** UI clutter for a small catalog; we
  already have a contact form.
- **`tracesSampleRate: 0.1` in prod, `1.0` in dev.** Keeps free-tier
  spend bounded while giving full fidelity during local iteration.
- **`enabled: NODE_ENV === 'production' || SENTRY_ENABLE_DEV === 'true'`.**
  Means running `next dev` locally doesn't pollute the Sentry stream
  unless the dev explicitly opts in.
- **`beforeSend` strips cookies, IP, email.** Checkout and account
  pages handle PII; scrub before anything leaves the browser. If you
  need user-specific debugging, pass an opaque database ID via
  `setUserContext(userId)`.
- **Release tag = `VERCEL_GIT_COMMIT_SHA`.** Vercel injects this
  automatically; it lets Sentry group issues per deploy.
- **`NEXT_PUBLIC_SENTRY_DSN` is the required var.** DSNs are not
  secret (Sentry rate-limits by project, not by DSN secrecy), so
  shipping it to the browser is safe.

## Testing

- `npm run build` → **Passed** (17.6 s compile, no TypeScript errors,
  no Sentry deprecation warnings). Full route table rendered.
- `ReadLints` on all 12 touched files → **0 errors**.
- `grep logrocket` in package.json + package-lock.json → **0 hits**.
- `grep LogRocket` in source tree → **0 hits**.

Sentry capture itself is **not yet verified in production** — that
requires adding `NEXT_PUBLIC_SENTRY_DSN` to Vercel env, redeploying,
and triggering a test error. Instructions in `docs/SENTRY_SETUP.md`.

## Bundle impact (directional)

Before:
- `@sentry/nextjs` (~200 KB client) — dynamic-imported inside a
  `monitoring.ts` class that was never instantiated on any real code path.
- `logrocket` (~150 KB client) — same story.
- Combined cost in compiled bundles: still shipped as separate chunks
  because `lib/monitoring.ts` was tree-shake-unreachable but present.

After:
- `@sentry/nextjs` (~200 KB client) — now integrated via Next.js
  instrumentation, which is a first-class bundling target. Still a
  per-project cost but now does actual work.
- No LogRocket.
- Net: ~150 KB smaller client bundle (LogRocket fully removed) **plus**
  Sentry is no longer an unused dependency.

## Remaining follow-ups

- [ ] **User action required:** add `NEXT_PUBLIC_SENTRY_DSN` to Vercel
      production + preview env vars. Without this, Sentry still builds
      and ships but captures nothing.
- [ ] (Optional) Add `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`
      to enable readable (source-mapped) stack traces.
- [ ] (Optional) Revisit Session Replay *iff* a specific bug needs it —
      turn on with very low sample rates (`replaysSessionSampleRate:
      0.01, replaysOnErrorSampleRate: 1.0`).

## References

- Sentry Next.js manual setup: <https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/>
- Next.js instrumentation: <https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation>

---

## Page caching strategy (ISR + tag invalidation)

### Why this needed fixing

- `/products/[id]` was declared `force-dynamic` with `revalidate = 0`.
  Every visit ran two Prisma queries (primary by `id`, fallback by
  `productNumber`). On Vercel that's a per-request DB round trip —
  slow first-byte, noisy DB, zero LCP benefit for repeat visits.
- `/faq` (× 3 locales) fired an uncached `prisma.faqItem.findMany` on
  every render. The data is identical across locales and changes
  roughly once a month.
- `/ar/blog/[slug]` and `/ru/blog/[slug]` had no `revalidate` set,
  so they defaulted to dynamic even though `/blog/[slug]` already
  used `revalidate = 60`.
- Admin mutations had no cache-invalidation hooks — they wouldn't
  have propagated even if the pages were cached.

### What Next.js 16 actually supports

Next.js 16 **removed** `experimental.ppr` and
`export const experimental_ppr`. The replacement,
`cacheComponents: true`, is a global flag that makes every uncached
async data access a build-time error unless it's wrapped in
`"use cache"` or `<Suspense>`. That's a multi-day migration for this
codebase (~30+ pages), so we didn't enable it.

Instead we delivered the "LCP on repeat visits" ROI via classic ISR
with tag invalidation — the pattern `app/products/page.tsx` and
`app/products/category/[slug]/page.tsx` were already using.

### Target routes (before → after)

| Route | Before | After | Notes |
|---|---|---|---|
| `/` `/ar` `/ru` | Static | Static (unchanged) | No server data; already optimal |
| `/faq` `/ar/faq` `/ru/faq` | Dynamic (uncached Prisma) | **Static + `5m` ISR** | `tags: ['faq']` |
| `/blog/[slug]` | SSG + `1m` | SSG + `1m` (unchanged) | |
| `/ar/blog/[slug]` `/ru/blog/[slug]` | Dynamic | **SSG + `1m` ISR** | Now matches EN |
| `/products/[id]` | Dynamic (`force-dynamic`) | On-demand ISR + **`5m`** + `tags: ['products']` | First hit warms cache |
| `/ar/products/[id]` `/ru/products/[id]` | Dynamic | On-demand ISR + **`5m`** + `tags: ['products']` | Now uses same cached fetcher as EN |

Build indicator for `/products/[id]` is still `ƒ` because there's
no `generateStaticParams` (product catalogue is open-ended, no
natural candidate for build-time prerendering). Runtime ISR is
active via `unstable_cache` around the DB fetcher.

### New files

| File | Purpose |
|---|---|
| `lib/faqDb.ts` | `getActiveFaqItems()` — shared across EN/AR/RU FAQ pages. `unstable_cache` with tag `faq`, plus `react.cache()` for intra-request dedup. |

### Modified files

| File | Change |
|---|---|
| `lib/productsDb.ts` | `getProductByIdCached` now composes `unstable_cache` (tag `products`, 5 min) with `react.cache()`. First call per request warms both layers. |
| `app/products/[id]/page.tsx` | Dropped `force-dynamic` + `revalidate = 0`; added `revalidate = 300`. |
| `app/ar/products/[id]/page.tsx` | Switched from raw `getProductById` to `getProductByIdCached`; added `revalidate = 300`. |
| `app/ru/products/[id]/page.tsx` | Same as `/ar`. |
| `app/faq/page.tsx` `app/ar/faq/page.tsx` `app/ru/faq/page.tsx` | Replaced inline Prisma call with `getActiveFaqItems()`; added `revalidate = 300`. |
| `app/ar/blog/[slug]/page.tsx` `app/ru/blog/[slug]/page.tsx` | Added `export const revalidate = 60` to match EN. |
| `app/api/admin/products/route.ts` | `POST` now calls `revalidateTag('products', 'max')`. |
| `app/api/admin/products/[id]/route.ts` | `PUT` + `DELETE` call `revalidateTag('products', 'max')`. |
| `app/api/admin/faq-items/route.ts` | `POST` calls `revalidateTag('faq', 'max')`. |
| `app/api/admin/faq-items/[id]/route.ts` | `PUT` + `DELETE` call `revalidateTag('faq', 'max')`. |

### Why `'max'` as the second argument

Next.js 16 made `revalidateTag(tag)` (single-arg) a deprecated form.
The new signature `revalidateTag(tag, profile)` asks for a
`cacheLife` profile. `'max'` gives stale-while-revalidate behavior —
admins see their change immediately on the admin UI (the admin
endpoints read directly from Prisma, bypassing the cache), while
public-side readers get a background refresh. We don't need the
stricter `updateTag()` semantics here because the admin flow reloads
the admin page, not the public one.

### Testing

- `npm run build` → passed; route indicators:
  - `○ /faq`, `○ /ar/faq`, `○ /ru/faq` — each with `5m` revalidate
  - `● /blog/[slug]`, `● /ar/blog/[slug]`, `● /ru/blog/[slug]` — each with `1m`
  - `ƒ /products/[id]`, `ƒ /ar/products/[id]`, `ƒ /ru/products/[id]`
    (runtime ISR, no build-time prerendering)
- `ReadLints` on all 14 touched files → 0 new errors. Two existing
  errors in blog `generateStaticParams` catch-block signatures are
  pre-existing (unrelated to this work).

### ROI

- Repeat-visit LCP for any `/products/[id]` URL within 5 minutes is
  served from cached HTML with zero DB cost. Admin edits propagate
  in whatever time it takes Vercel to process the tag invalidation
  (near-instant in practice).
- FAQ page generation cost dropped from 1 Prisma call per render to
  1 Prisma call per 5 minutes (per tag invalidation).
- Blog locale pages are now consistent — prevents future "it works
  on EN but not RU" regressions.

### Follow-ups (not done, not urgent)

- [ ] Consider `generateStaticParams` for the top 10–20 products
      by traffic so their HTML is prerendered at build time. Only
      worthwhile if build times stay reasonable.
- [ ] The blog admin routes (`/api/admin/blog-posts`) could also
      wire up `revalidateTag('blog-posts', 'max')` if we want admin
      blog edits to propagate faster than 60s.
