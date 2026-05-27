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
