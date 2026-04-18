# Session Changes — 2026-04-18

Four separate work items committed the same day:

1. **Observability** — Sentry in, LogRocket out.
2. **Page caching strategy** — FAQ + product pages + blog/slug unified around ISR + tag revalidation. [Jump ↓](#page-caching-strategy-isr--tag-invalidation)
3. **CLI observability tooling** — Sentry + Vercel CLIs installed, `npm run sentry:errors` helper script, DSN wired in Vercel, end-to-end verification. [Jump ↓](#cli-observability-tooling)
4. **Production log cleanup** — three noisy / genuinely-broken signals surfaced via `npm run vercel:logs:errors` fixed at the root. [Jump ↓](#production-log-cleanup)

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

---

## CLI observability tooling

### Context

Item 1 (Sentry) shipped the SDK wiring but left two operational gaps:

1. Sentry only captures errors if a DSN is configured at the hosting
   provider. The DSN had not yet been added to Vercel.
2. There was no way to pull issues or logs from the terminal —
   the only way to see what was broken was to open the Sentry UI
   and the Vercel dashboard in a browser.

This item closes both gaps.

### What the Sentry project looked like

Created in Sentry with the auto-generated slugs (kept as-is —
renaming later is trivial and nothing upstream depends on them):

- Org:      `genosys-middle-east-fz-llc`
- Project:  `javascript-nextjs` (Sentry default naming for Next.js)
- Plan:     Developer (free) — 5k errors/mo, 10k spans/mo, 30-day retention

### Vercel wiring (one-time)

- `NEXT_PUBLIC_SENTRY_DSN` added to Vercel project
  `cosmetics-website2` → Environment Variables → All Environments
  (scope includes Production, Preview, Development; DSN is
  non-secret so this is safe).
- Empty commit pushed to trigger redeploy so the env var actually
  bakes into the client bundle:
  `chore: redeploy to pick up NEXT_PUBLIC_SENTRY_DSN` (fa598074).
- Verified on genosys.ae: 7 envelope POSTs to
  `*.ingest.sentry.io` per page load, all HTTP 200. SDK is live.

Note: console `throw` statements from DevTools REPL often don't
propagate to `window.onerror` in Chrome, so they do **not** appear
in Sentry. Real UI-triggered errors do. The realistic test:

```js
setTimeout(() => { throw new Error('real async error') }, 0)
```

The `setTimeout` wrapper escapes the REPL context.

### CLIs installed (global, via npm)

```bash
npm install -g vercel @sentry/cli
```

- `vercel@51.7.0` — deployment + log management.
- `@sentry/cli@3.3.5` — release + source-map tooling; also
  `send-event` for smoke tests.

### Why a custom script (and not just `sentry-cli`)

`@sentry/cli` does not expose a "list recent issues" command —
it's focused on release/source-map workflows. Pulling events
requires the REST API. Rather than make Vadim curl endpoints with
auth tokens every time, shipped a small wrapper.

### New files

| File | Purpose |
|---|---|
| `scripts/sentry-errors.js` | Zero-dep Node helper over `/api/0/` endpoints. Supports list-by-env, custom queries, time windows, and drill-down by short ID or numeric ID |

### Modified files

| File | Change |
|---|---|
| `package.json` | Added three scripts: `sentry:errors`, `vercel:logs`, `vercel:logs:follow` |
| `.env.example` | Added setup pointer for `SENTRY_AUTH_TOKEN` (Personal Auth Token, scopes `project:read` + `event:read`) and corrected default org/project slugs to the real ones |

### Command surface

| Command | Purpose |
|---|---|
| `npm run sentry:errors` | List 10 unresolved issues from production |
| `npm run sentry:errors -- --limit 25` | Larger window |
| `npm run sentry:errors -- --all-envs` | Drop the env filter (useful when nothing matches and you want to sanity-check) |
| `npm run sentry:errors -- --since 24h` | Time window filter |
| `npm run sentry:errors -- --query "is:unresolved level:error"` | Custom Sentry search syntax |
| `npm run sentry:errors -- --detail JAVASCRIPT-NEXTJS-2` | Full exception payload with stack, tags, release, user |
| `npm run vercel:logs` | Function logs (prod), last hour, 100 entries |
| `npm run vercel:logs:errors` | Error-level only, last 24h — fast triage view |
| `npm run vercel:logs:follow` | Live-tail prod function logs |

### Secrets handling

- `SENTRY_AUTH_TOKEN` lives in `.env.local` only (gitignored via
  pattern `.env*.local` in `.gitignore`). The script reads it via
  `dotenv`, which is already a project dep.
- The token uses Sentry's newer `sntryu_` Personal Auth Token
  format. Scopes: `project:read` + `event:read` — read-only, no
  write access to issues or releases.
- No secrets committed. Verified with
  `git diff --staged | grep -iE '(token|password|api[_-]?key)'`
  before pushing.

### End-to-end verification

1. `npm run sentry:errors` (before token) — exits 1 with clear
   instructions. Correct fail-closed behavior.
2. Token added to `.env.local`, `npm run sentry:errors` — shows
   Sentry's auto-demo issue (`JAVASCRIPT-NEXTJS-1`, hardcoded
   `TypeError: Object [object Object] has no method 'updateFrom'`).
   Confirms API connectivity + auth.
3. `sentry-cli send-event --message "CLI smoke test ..."` —
   dispatched event `9395a7db-c750-4848-8aee-8aa5a1e5584f`. Appeared
   in Sentry within 8 seconds.
4. `npm run sentry:errors -- --detail JAVASCRIPT-NEXTJS-2` — full
   detail output including the correct release SHA
   (`fa598074cd4d1174200688d1f8df3e6d69c2f142`, matching the empty
   redeploy commit). Confirms the release tag wiring is live.

### Outstanding (user actions)

- [ ] **Rotate the auth token.** The token was pasted into chat
      during setup (transcript at
      `~/.cursor/projects/Users-vadimkus-VisionDrive/agent-transcripts/`).
      Create a new token in Sentry → delete the old one → update
      `.env.local`. Takes 30 seconds.

### Done this session

- Vercel CLI syntax corrected in `package.json` scripts. The original
  `vercel logs https://genosys.ae --since=1h` form conflicts with
  Vercel's current CLI (URL argument implies `--follow`, which rejects
  `--since`). Scripts now use `.vercel/project.json` linking instead —
  no URL needed, all filters work.
- Confirmed `vercel whoami` = `vadimkus` — already logged in, no
  `vercel login` needed.
- Smoke-tested all three logs scripts end-to-end. Surfaced real
  production signals:
  - `λ GET /products/26` and `/products/59` → intermittent
    `Error fetching…` at warning level
  - Multiple `(node:4) [DEP0170]` deprecation warnings on product
    routes
  - Warning about missing `ADMIN_EMAIL` env var on admin endpoints
  - None of these reached Sentry yet, suggesting they're caught
    internally and logged but not re-thrown. Worth reviewing if
    product-page errors start hitting real users.

### Follow-ups (optional)

- [ ] Rename Sentry project slug from `javascript-nextjs` to
      `genosys-website` for clarity. Requires updating
      `.env.example` default and any Vercel env vars for source-map
      upload (`SENTRY_PROJECT`).
- [ ] Add `SENTRY_ORG` + `SENTRY_PROJECT` + `SENTRY_AUTH_TOKEN`
      to Vercel build-time env vars so source-maps upload
      automatically on each deploy. Without them, Sentry stack
      traces show minified chunks (still usable, just less pretty).
- [ ] Add `npm run sentry:errors` invocation to the developer
      workflow doc (or a pre-release checklist) once there are
      enough real issues to justify it.

### Commits

- `fa598074` — `chore: redeploy to pick up NEXT_PUBLIC_SENTRY_DSN`
- `4176a5e8` — `feat(tooling): add `npm run sentry:errors` + Vercel log shortcuts`

---

## Production log cleanup

### Context

The new CLI tooling from item 3 (`npm run vercel:logs:errors`) immediately
surfaced three pre-existing production signals that were worth fixing:

```
λ GET /products/26  error  TypeError: fetch failed [cause: ETIMEDOUT]
λ GET /products     error  (node:4) [DEP0169] DeprecationWarning: url.parse()
λ GET /api/admin/*  warn   ADMIN_EMAIL and ADMIN_PASSWORD not set
```

None were recent regressions — they'd been silently accumulating in
production logs. With observability finally live, the cheapest next
step was to stop them at the source.

### 1. Prisma Accelerate ETIMEDOUT on product pages (real bug)

**Symptom**

```
prisma:error fetch failed
Error fetching product by ID: TypeError: fetch failed
  [cause]: Error: write ETIMEDOUT  errno: -110  syscall: 'write'
  clientVersion: '7.3.0'
revalidating cache with key: product-by-id-["26"]
Error: Failed to fetch product
```

**Diagnosis**

- `DATABASE_URL` is a `prisma+postgres://` URL → Prisma Accelerate
  (HTTP proxy), not direct Postgres. Confirmed by the `fetch failed`
  error shape and `write ETIMEDOUT` at the socket layer.
- The error fires during `unstable_cache` background revalidation
  (tag `products`, 5-minute ISR), so a single network blip invalidates
  the cache entry and every subsequent request hits the error boundary
  until the next revalidation attempt succeeds.
- No retry logic anywhere. First transient blip → hard failure.
- Original error was also being masked by
  `throw new Error('Failed to fetch product')`, which dropped the
  `cause` chain and made Sentry stack traces useless.

**Fix**

- New helper `lib/prismaRetry.ts` with `withPrismaRetry(fn, { label })`:
  - Detects transient errors (`ETIMEDOUT`, `ECONNRESET`, `ECONNREFUSED`,
    `EPIPE`, `EAI_AGAIN`, `UND_ERR_SOCKET`, or message patterns like
    `fetch failed` / `socket hang up` / `connection terminated
    unexpectedly` — covers both the pg driver and the Accelerate
    HTTP transport).
  - Retries up to 2 times with 100 ms → 500 ms → 1500 ms backoff.
  - On final failure, calls `Sentry.captureException` with
    `{ tags: { area: 'prisma-retry', op: label } }` so each retry
    exhaustion surfaces as a real Sentry issue instead of only a
    stdout error.
- Applied to the three hottest read paths:
  - `getProductById` — used by `/products/[id]` SSG pages
  - `getAllProducts` — used by concern landing pages + product numbers lookup
  - `getActiveFaqItems` — used by EN/AR/RU FAQ pages (same ISR + tag pattern)
- Removed the `try { ... throw new Error('Failed to fetch product') }`
  wrapper in `getProductById` and `getAllProducts` — the retry helper
  preserves the original error (including `.cause` chain) so stack
  traces stay useful.

**Why retries are safe here**

All three wrapped functions are pure reads (`prisma.product.findUnique`,
`prisma.product.findMany`, `prisma.faqItem.findMany`). No side effects,
so retrying is idempotent by definition. Writes and multi-step
transactions are NOT wrapped — those need per-call review before retry
is safe.

### 2. `DEP0169` url.parse() deprecation on every request

**Symptom**

```
(node:4) [DEP0169] DeprecationWarning: `url.parse()` behavior is not
standardized and prone to errors that have security implications.
Use the WHATWG URL API instead.
```

One warning per cold start, on every route. Vercel's log ingestion
classifies stderr as `error` level, so it polluted the error stream
as a false positive.

**Diagnosis**

`npm ls` traced the call site:

```
@sentry/nextjs@10.32.1
  └── @sentry/node@10.32.1
      └── @opentelemetry/instrumentation-http@0.208.0  ← url.parse() lives here
```

Line 49 of that package's `utils.js` had a literal `url.parse(path)`
call during HTTP request instrumentation. Fixed upstream in
`@opentelemetry/instrumentation-http@0.215.0`, which ships with
`@sentry/nextjs@10.49.0` and transitively pulls in `0.214.0`.

**Fix**

Upgraded `@sentry/nextjs`: `10.32.1 → 10.49.0`. Verified by:

```bash
npm ls @opentelemetry/instrumentation-http
# @opentelemetry/instrumentation-http@0.214.0

grep 'url\.parse(' node_modules/@opentelemetry/instrumentation-http/build/src/utils.js
# 209:            // for backward compatibility with how url.parse() behaved.
# (only a comment remains — the actual call is gone)
```

No code changes required — the upgrade is drop-in. Build + typecheck
both passed.

### 3. `ADMIN_EMAIL and ADMIN_PASSWORD not set` warning spam

**Symptom**

Every request to `/api/admin/*` emitted two warnings:

```
⚠️  WARNING: ADMIN_EMAIL and ADMIN_PASSWORD not set in production.
    Admin user will be created with default credentials.
⚠️  WARNING: NEXT_PUBLIC_SITE_URL not set in production.
    Falling back to https://genosys.ae.
```

The admin dashboard polls `/api/admin/users` and `/api/admin/products`
every minute → 2 warnings × 2 endpoints × 60 invocations/hour = ~240
warn-level log entries per hour with zero signal value.

**Diagnosis**

Both warnings in `lib/envValidation.ts` fired on every container cold
start. Worse, the first warning message was **wrong**:

- `ADMIN_EMAIL` and `ADMIN_PASSWORD` are only read by
  `scripts/create-admin-user.js`, a one-off seed script. Not used at
  runtime for any auth path.
- The actual runtime use of `ADMIN_EMAIL` is as a fallback destination
  for admin notification emails (order confirmations, new-user signups),
  with `GMAIL_USER` and `EMAIL_USER` also acceptable fallbacks.
- So the warning "Admin user will be created with default credentials"
  was pure misinformation — no admin user is created at runtime.

`NEXT_PUBLIC_SITE_URL` was the same story: the fallback to
`https://genosys.ae` is stable, correct, and used everywhere. The
warning added noise with no action surface.

**Fix**

Rewrote the warning block in `lib/envValidation.ts`:

- Removed the misleading `ADMIN_EMAIL && ADMIN_PASSWORD not set`
  warning. Replaced with an accurate
  `No admin notification email configured` check that fires only
  when ALL of `ADMIN_EMAIL`, `GMAIL_USER`, `EMAIL_USER` are missing —
  the actual breakage condition.
- Removed the `NEXT_PUBLIC_SITE_URL not set` warning entirely
  (fallback is stable, nothing to fix).
- Added a module-level `hasEmittedWarnings` dedup flag so the
  remaining warnings (MOBILE_APP_KEY, JWT_SECRET, Stripe, Google
  OAuth, Apple OAuth) fire **once per container** instead of once
  per request.

### Verification

```bash
npm run build              # exit 0, clean
npx tsc --noEmit           # no errors in lib/prismaRetry.ts, productsDb.ts, faqDb.ts, envValidation.ts
                           # (pre-existing test-file errors unchanged)
npm ls @opentelemetry/instrumentation-http
# @opentelemetry/instrumentation-http@0.214.0 ✓ (was 0.208.0)
```

After the next deploy, re-run:

```bash
npm run vercel:logs:errors
# expect: zero DEP0169 warnings (Sentry upgrade takes effect)
# expect: fewer Prisma fetch errors (retry helper absorbs blips)
# expect: no more per-request ADMIN_EMAIL warnings on /api/admin/*
```

Any retry exhaustion on the Prisma side will now appear as a Sentry
issue tagged `area:prisma-retry, op:getProductById` (or
`getAllProducts` / `getActiveFaqItems`) — making recurring DB
instability actionable instead of invisible.

### Files changed

- `package.json` + `package-lock.json` — `@sentry/nextjs 10.32.1 → 10.49.0`
- `lib/prismaRetry.ts` — NEW, retry helper with Sentry reporting
- `lib/productsDb.ts` — `getProductById` + `getAllProducts` use retry
- `lib/faqDb.ts` — `getActiveFaqItems` uses retry
- `lib/envValidation.ts` — misleading warnings removed, dedup added

### Not addressed (out of scope)

- **`(node:4) [DEP0170]`** from `react/server-dom-webpack` (if it
  reappears) — this is a React 19 internal using `punycode` deprecation.
  Will be fixed in a future React patch release.
- **`@sentry/nextjs` upgrade side effects** — none observed, but worth
  watching the first deploy for any new Sentry config warnings. The
  minor version jump (10.32 → 10.49) was within a stable release line.
