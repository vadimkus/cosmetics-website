# Session Changes — Sentry Issues Triage

Date: 2026-05-03

## Scope

Checked unresolved production Sentry issues for the GENOSYS website project via:

```bash
npm run sentry:errors -- --limit 25
npm run sentry:errors -- --since 24h --limit 25
```

Sentry target:

- Org: `genosys-middle-east-fz-llc`
- Project: `javascript-nextjs`
- Environment: `production`

## Findings

- 13 unresolved production issues were present.
- Highest-volume issue is `JAVASCRIPT-NEXTJS-9`: `TypeError: fetch failed` on `GET /products`, 136 events, latest on 2026-05-03. Latest detail shows `SocketError: other side closed`.
- Current server-side Prisma failures are coming from Prisma Accelerate / Cloudflare, not obvious application validation:
  - `JAVASCRIPT-NEXTJS-N`: `prisma.product.findMany()` on `GET /`, latest 2026-05-03, Cloudflare `Error 1102: Worker exceeded resource limits` for `accelerate.prisma-data.net`.
  - `JAVASCRIPT-NEXTJS-C`: `prisma.product.findUnique()` on `/products/54`, same Cloudflare 1102 Prisma Accelerate failure.
  - `JAVASCRIPT-NEXTJS-F`: `prisma.product.findUnique()` on `/products/41`, `null pointer passed to rust`.
- Client-side noise/current browser issues:
  - `JAVASCRIPT-NEXTJS-M`: Safari `NotFoundError: removeChild` on `/`, 2 events.
  - `JAVASCRIPT-NEXTJS-J`: `Rendered more hooks than during the previous render` on `/products`, 1 event.
  - `JAVASCRIPT-NEXTJS-A`: iOS/Safari `TypeError: Load failed` on `/products`, 5 events.
- Mobile app Sentry target from `genosys-mobile-app/app.json` is `genosys/mobile-app`, but querying it with the available token returned Sentry API `404`. Likely no access from the website token, project not created, or slug mismatch.

## Recommended Follow-Up

1. Treat Prisma Accelerate `Error 1102` as the main production reliability issue. Check Prisma Accelerate dashboard and consider bypassing/reducing heavy homepage/product queries, lowering query fan-out, or opening a Prisma support ticket if this is platform-side.
2. Investigate the `/products` fetch failures together with Vercel logs; many events are bots/Sentry uptime checks, but the count is high enough to confirm whether real users see failures.
3. Fix or resolve `JAVASCRIPT-NEXTJS-J` if it recurs after the latest product page changes. One event is not urgent, but hook-order errors are real React bugs when reproducible.
4. Confirm whether mobile Sentry is meant to be active. Docs still say `EXPO_PUBLIC_SENTRY_DSN` needs to be set in EAS production env.

## Fix Applied

- Added a direct Postgres fallback client in `lib/prisma.ts` for read-only hot paths when the primary runtime client uses Prisma Accelerate.
- Extended `withPrismaRetry()` so callers can recover before Sentry captures a final primary failure.
- Added Accelerate Cloudflare `Error 1102` detection (`worker_exceeded_resources` / "Worker exceeded resource limits").
- Wrapped product read hot paths in recovery:
  - `getAllProducts()`
  - `getProductById()`
  - `getProductsByCategory()`
- Reduced product detail lookup from two sequential `findUnique()` calls (`id`, then `productNumber`) to one `findFirst()` with `OR`, while keeping hidden products excluded.
- Checked current `/products` and `ProductCard` trees with focused ESLint, including hooks rules. No conditional hook violation is present in current code; `JAVASCRIPT-NEXTJS-J` is treated as a one-event historical issue unless it recurs after deploy.
- Follow-up deploy fix: moved database analytics helpers out of browser-imported `lib/analytics.ts` into server-only `lib/analyticsDb.ts`. This prevents Turbopack from pulling `pg` / Prisma fallback code into client bundles through `PDFDownloadButton` and fixes the failed Vercel deployment for commit `11d654fa`.

## Verification

- `npx tsc --noEmit --pretty false` passed.
- `SKIP_DB_MIGRATIONS=true npm run build` passed locally after the analytics split, confirming Turbopack no longer tries to bundle Node built-ins (`dns`, `fs`, `net`, `tls`) for the browser.
- Focused ESLint passed for:
  - `lib/prisma.ts`
  - `lib/prismaRetry.ts`
  - `lib/productsDb.ts`
  - `lib/analytics.ts`
  - `lib/analyticsDb.ts`
  - `app/api/analytics/track/route.ts`
  - `app/products/ProductsPageClient.tsx`
  - `app/products/page.tsx`
  - `app/products/[id]/ProductPageClientRefactored.tsx`
  - `app/products/[id]/components/ProductDocumentation.tsx`
  - `components/ProductCard/*`
  - `components/products/*`
- Cursor diagnostics: no linter errors on edited files.

## Follow-Up — 2026-05-16 Digest Check

The Sentry digest screenshot still showed `fetch failed`, `/products` `Load failed`, and `/products/62` errors. Live checks confirmed the actionable server-side issue was still active on production release `aa988682`: Vercel logs showed fresh homepage `getAllProducts()` failures from Prisma Accelerate socket closures (`UND_ERR_SOCKET`, "other side closed") after retries.

Fix applied:

- Exported the transient Prisma/transport detector from `lib/prismaRetry.ts`.
- Changed product read recovery in `lib/productsDb.ts` from "only recover on Accelerate Cloudflare 1102" to "recover on any exhausted transient read failure", so `fetch failed` / `UND_ERR_SOCKET` falls through to the direct Postgres read client instead of surfacing to users and Sentry.
- Guarded Prisma shutdown in `lib/prisma.ts` with a single registered handler and a shared shutdown promise, removed the `beforeExit` handler, and avoided calling `pg.Pool.end()` after the pool is already ended. This addresses `JAVASCRIPT-NEXTJS-Q` (`Called end on pool more than once`).

Verification:

- `npx tsc --noEmit` passed.
- `npx eslint lib/prisma.ts lib/prismaRetry.ts lib/productsDb.ts` passed.
- `npm run build` passed, including Prisma generate, migration deploy check, service worker version generation, and `390/390` static page generation.

## Follow-Up — 2026-05-16 Direct Fallback Timeout

After commit `925072d0`, Sentry reported a new production event on release `925072d028143a69b4c2297c5373fdd35700d68d`: `getAllProducts:direct` failed with `timeout exceeded when trying to connect`. Vercel logs showed the intended primary-to-direct fallback sequence was working, but the direct `pg` adapter path occasionally timed out while opening its own Postgres connection.

Fix applied:

- Classified `timeout exceeded when trying to connect`, `Connection terminated due to connection timeout`, and Accelerate `P6000` as transient retryable Prisma transport failures.
- Changed the direct fallback URL preference to use `POSTGRES_PRISMA_URL` first, then `POSTGRES_URL`, then `DATABASE_URL`, then `POSTGRES_URL_NON_POOLING`, so Vercel/Neon serverless should prefer the pooled Prisma connection string rather than an unpooled direct URL.
- Reduced the direct fallback pool to one connection per warm lambda and gave that fallback connection path a 10s connect timeout. This limits connection fan-out while giving the pooler enough time during transient Neon/Accelerate blips.

Verification:

- `npx tsc --noEmit` passed.
- `npx eslint lib/prisma.ts lib/prismaRetry.ts lib/productsDb.ts` passed.

## Follow-Up — 2026-05-24 Current Digest

The current Sentry digest showed three live items:

- `Connection terminated due to connection timeout` / `timeout exceeded when trying to connect` from `pg-pool` on production release `a3a3db95`.
- `TypeError: Load failed` on `/products`, all recent events from Mobile Safari / Chrome iOS.
- `ReferenceError: zp_token is not defined` from injected `/1/zp.js`, one event only.

Vercel logs showed the server-side failures were mostly hourly ISR/home-data revalidations: primary Prisma Accelerate failed, the direct fallback kicked in, and then the direct `pg` fallback also timed out. These failures were explicitly captured by our retry helper and Prisma's own production error logger, even when the request was a background cache refresh or could safely degrade.

Fix applied:

- Product reads now return the static `lib/products.ts` catalog when both Accelerate and direct Postgres fail with transient transport errors. This keeps homepage, `/products`, category pages, and product details rendering during short database transport outages instead of throwing.
- Direct fallback retry failures are no longer double-captured to Sentry when they are known transient transport failures and the product layer can degrade.
- Prisma client production `log` output was disabled so handled retry failures do not appear as Vercel `error` logs before application fallback logic runs. Development still logs Prisma errors and warnings.
- Server-side fallback messages now use `warnLog` instead of `errorLog` when the app can serve static catalog data.
- Broadened the client-side Sentry filter for iOS `TypeError: Load failed` events with no app stack / only Next.js chunk frames.
- Filtered one-off third-party injected `/1/zp.js` `zp_token is not defined` errors.

Verification:

- `npx tsc --noEmit` passed.
- `npx eslint lib/prisma.ts lib/prismaRetry.ts lib/productsDb.ts instrumentation-client.ts` passed.
- `npm run build` passed, including Prisma generate, migration deploy check, service worker version generation, and `394/394` static page generation.

## Follow-Up — 2026-05-27 iOS AbortError

Sentry reported `JAVASCRIPT-NEXTJS-Z` on `/ru/products/21`: `AbortError: The operation was aborted.` The event was a single unhandled rejection from Mobile Safari 18.6 / iOS 18.6.2 on release `fff809b5`, with no matching Vercel server error for that route. This matches the existing iOS App Router navigation-abort class: the browser cancels an in-flight RSC/fetch request during navigation and surfaces it as a global unhandled rejection.

Fix applied:

- Added a narrow client-side Sentry filter for iOS WebKit `AbortError: The operation was aborted` unhandled rejections when the event has no app stack / only Next.js chunk frames.
- Refactored the existing iOS `Load failed` filter to share the same iOS WebKit and "no app stack" checks.
- Hardened direct Prisma fallback lifecycle: if a warm lambda sees a cached direct `pg` pool that has already been ended, discard and recreate it instead of reusing it. This addresses the related `Cannot use a pool after calling end on the pool` issue observed in the current unresolved list.
- Classified `Cannot use a pool after calling end on the pool` as a transient direct-fallback transport/lifecycle error. Product reads can then suppress Sentry capture for that recovery failure and serve the static catalog fallback instead of paging on a handled degradation.

Verification:

- `npx tsc --noEmit` passed.
- `npx eslint instrumentation-client.ts lib/prisma.ts lib/prismaRetry.ts` passed.
- `npm run build` passed, including Prisma generate, migration deploy check, service worker version generation, and `394/394` static page generation.

## Follow-Up — 2026-05-31 Weekly Digest

The weekly Sentry digest for May 23-30 showed 7 total errors:

- `Connection terminated due to connection timeout` and `timeout exceeded when trying to connect` were stale: latest events were May 23 on release `a3a3db95`, before the product-read fallback hardening.
- `AbortError: The operation was aborted` was stale: the only event was May 27 on release `fff809b5`, before the iOS AbortError filter.
- `TypeError: Load failed` was still active on release `36141553`. Raw Sentry event `c45bcb6e...` showed Mobile Safari / iOS, no stack frames, `mechanism=generic handled`, and breadcrumbs `Application error: TypeError: Load failed`. That means the route error boundary (`app/error.tsx`) manually captured the error before the global browser-noise filter could remove it.

Fix applied:

- Added `lib/browserErrorNoise.ts`, a client-safe classifier for iOS WebKit navigation aborts (`TypeError: Load failed`, `AbortError`, and `AbortError: The operation was aborted`).
- Guarded `app/error.tsx` and `app/global-error.tsx` so these browser navigation aborts are not manually logged/captured by route/global error boundaries.

Verification:

- `npx tsc --noEmit` passed.
- `npx eslint app/error.tsx app/global-error.tsx lib/browserErrorNoise.ts instrumentation-client.ts` passed.
- `npm run build` passed, including Prisma generate, migration deploy check, service worker version generation, and `394/394` static page generation.

## Follow-Up — 2026-06-03 Blocked Browser Storage

Sentry reported two fresh homepage issues on release `9b0252c`:

- `JAVASCRIPT-NEXTJS-12` / event `6690a74a...`: `SecurityError: Failed to read the 'localStorage' property from 'Window': Access is denied for this document.`
- `JAVASCRIPT-NEXTJS-11` / event `fc00ef3f...`: same `SecurityError`, surfaced as an unhandled browser rejection.

Both happened on `/` in Chrome/Linux from the same region/time. This is the browser privacy/embedded-context behavior where merely reading `window.localStorage` can throw, even though `window` exists. The homepage mounts root providers that used direct storage access for auth fallback, favorites, theme, cart persistence, offline storage, and PWA sync.

Related issue:

- `JAVASCRIPT-NEXTJS-10` / event `ecc2e80d...`: `ReferenceError: indexedDB is not defined` on `/`, also from release `9b0252c`.

Fix applied:

- Added `lib/browserStorage.ts` with safe `localStorage`, `sessionStorage`, and IndexedDB availability helpers that treat blocked storage as unavailable instead of throwing.
- Updated `AuthProvider`, `FavoritesProvider`, `useTheme`, `cartStore`, and `offlineStorage` to use the safe storage wrappers.
- Guarded `useBackgroundSync` so it skips IndexedDB-backed queue setup and queue operations when IndexedDB is unavailable.

Verification:

- `npx tsc --noEmit` passed.
- `npx eslint lib/browserStorage.ts components/auth/AuthProvider.tsx components/FavoritesProvider.tsx hooks/useTheme.ts hooks/useBackgroundSync.ts lib/cartStore.ts lib/offlineStorage.ts` passed with 0 errors; existing hook dependency warnings remain in `useTheme` and `useBackgroundSync`.
- `npm run build` passed, including Prisma generate, migration deploy check, service worker version generation, and `394/394` static page generation.

## Follow-Up — 2026-06-04 Injected Shop Lookup Rejection

Sentry reported `JAVASCRIPT-NEXTJS-13` on `/pwa-login`: `UnhandledRejection: Non-Error promise rejection captured with value: Not found` on release `9b0252c`. The app route itself loaded correctly: raw event breadcrumbs showed `GET https://genosys.ae/pwa-login?_rsc=...` returned `200`.

The failing breadcrumb was an external request:

- `GET https://o0rmue7xt0.execute-api.il-central-1.amazonaws.com/dev/sites?site=genosys.ae`
- Status `404`
- Preceded by a console breadcrumb `includeShop`

There is no `includeShop` or `execute-api.../dev/sites` code in the repo, and the only in-repo `Not found` response is an unrelated admin newsletter API. This points to third-party/injected browser extension or shopping-assistant script noise.

Fix applied:

- Added a narrow client-side Sentry filter for non-error `Not found` unhandled rejections only when the event includes the external `execute-api.../dev/sites?site=genosys.ae` 404 breadcrumb.
- Updated `/pwa-login` to clear the splash flag through the safe `sessionStorage` wrapper, so browser storage restrictions cannot create a separate login-page failure.

Verification:

- `npx tsc --noEmit` passed.
- `npx eslint instrumentation-client.ts app/pwa-login/page.tsx lib/browserStorage.ts components/auth/AuthProvider.tsx components/FavoritesProvider.tsx hooks/useTheme.ts hooks/useBackgroundSync.ts lib/cartStore.ts lib/offlineStorage.ts` passed with 0 errors; existing hook dependency warnings remain in `useTheme` and `useBackgroundSync`.
- `npm run build` passed, including Prisma generate, migration deploy check, service worker version generation, and `394/394` static page generation.

## Follow-Up — 2026-06-05 Browser Translation iframe Probe

Sentry reported `JAVASCRIPT-NEXTJS-14` on `/brand`: `TypeError: null is not an object (evaluating 'e.contentDocument.body')` on release `9b0252c`. Two events occurred on Mobile Safari / iOS 26.2.

Raw event details:

- Stack frames were only `app:///brand`, with no function names or source context.
- The repo has no `contentDocument` reads in the brand page or shared components.
- The brand page embeds YouTube videos via cross-origin iframes.
- Breadcrumbs immediately before the error showed browser translation/probing logs such as `{ from: "en", to: "ko" }` and progress objects `{ current, total, isObserved, success }`.

Assessment: this is a browser translation or extension script probing iframe documents and not handling a null `contentDocument` on iOS Safari. It is not actionable application code and did not point to a broken app route.

Fix applied:

- Added a narrow client-side Sentry filter for `TypeError` messages containing `contentDocument.body` only when browser-translation breadcrumbs are present.
- Kept the filter independent from the existing Google Translate `removeChild` filter so real app errors still pass through.

## Follow-Up — 2026-06-06 Weekly Digest Noise

Weekly Sentry digest highlighted three noisy client-side issues:

- `JAVASCRIPT-NEXTJS-3` on `/success`: `TypeError: e.getBoundingClientRect is not a function`.
- `JAVASCRIPT-NEXTJS-A` on `/products`: `TypeError: Load failed`.
- `JAVASCRIPT-NEXTJS-14` on `/brand`: `contentDocument.body`, already handled by the 2026-06-05 browser-translation filter.

Findings:

- `/success` events are Mobile Safari only, with a synthetic `window.onerror` exception and a single `blob:app:///...` frame. No app source or `_next/static/chunks` frame is present. Breadcrumbs show successful checkout navigation and successful `/api/orders/success/...` fetch before the error. This points to browser/third-party blob script behavior during the post-checkout page, not our success page React code.
- `/products` `Load failed` latest event is on current release `1be6658`, Mobile Safari, single `_next/static/chunks` frame, and breadcrumbs show successful RSC prefetches followed by failed RSC prefetches immediately before navigation from `/` to `/products`. This is the same iOS WebKit navigation-abort class, but the previous filter relied only on `event.contexts`; Sentry's browser/OS data is safer to read from tags too.
- `/brand` has no new event after the browser-translation filter commit; the digest is counting prior events.

Fix applied:

- Updated iOS/WebKit detection in `instrumentation-client.ts` to fall back to Sentry tags (`browser`, `browser.name`, `os`, `os.name`) when contexts are absent.
- Added a narrow blob-only `getBoundingClientRect` filter: it only drops Mobile Safari `window.onerror` events where every stack frame is `blob:app:///...` and the message matches `getBoundingClientRect is not a function`.

## Follow-Up — 2026-06-07 Instagram Android Navigation Logger

Sentry reported `JAVASCRIPT-NEXTJS-15` on `/products`: `Error invoking enableDidUserTypeOnKeyboardLogging: Java object is gone` on release `92705d4`.

Raw event details:

- Browser: Instagram `431.1.0` in-app browser.
- OS: Android 16.
- Stack frames were exclusively `app://navigation_performance_logger_android`, including `sendBeforeUnloadMessage`.
- Breadcrumbs showed Meta/Instagram performance console logs such as `FBNavFirstContentfulPaint`, `FBNavLargestContentfulPaint`, and `FBNavINP`.
- App requests around the event (`/products`, `/favorites`, product RSC requests, `/api/analytics/track`) returned `200`.

Assessment: this is Instagram's Android WebView navigation-performance bridge trying to call a disposed Java object during/after navigation. It is outside our app bundle and not actionable product code.

Fix applied:

- Added a narrow client-side Sentry filter that drops only Instagram-on-Android `window.onerror` events with the exact `enableDidUserTypeOnKeyboardLogging` message and stack frames exclusively from `app://navigation_performance_logger_android`.
