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

## Verification

- `npx tsc --noEmit --pretty false` passed.
- Focused ESLint passed for:
  - `lib/prisma.ts`
  - `lib/prismaRetry.ts`
  - `lib/productsDb.ts`
  - `app/products/ProductsPageClient.tsx`
  - `app/products/page.tsx`
  - `app/products/[id]/ProductPageClientRefactored.tsx`
  - `app/products/[id]/components/ProductDocumentation.tsx`
  - `components/ProductCard/*`
  - `components/products/*`
- Cursor diagnostics: no linter errors on edited files.
