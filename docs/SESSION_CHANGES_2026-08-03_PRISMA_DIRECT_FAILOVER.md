# Session Changes — 2026-08-03 — Site-wide Prisma direct failover

## Incident

Production requests began failing with Prisma `P6000` query timeouts and Vercel
`504 FUNCTION_INVOCATION_TIMEOUT` responses. The failures affected unrelated,
simple queries across admin login, Google OAuth, product APIs, session refresh,
analytics, blog generation, rate limits, and cron processing.

Prisma's public status page reported Accelerate as operational. Direct
PostgreSQL queries remained healthy, including retrieval of the existing
bcrypt-protected admin account. This isolated the failure to the project's
Accelerate query path rather than the database, credentials, indexes, or recent
UI changes.

## Fix

`lib/prisma.ts` now selects database transports in this order:

1. `POSTGRES_PRISMA_URL`
2. `POSTGRES_URL`
3. direct `DATABASE_URL`
4. `POSTGRES_URL_NON_POOLING`
5. `PRISMA_DATABASE_URL` using Accelerate, only if no direct URL exists

Vercel function instances use a maximum direct pool size of one connection to
avoid multiplying database connections across serverless instances. Local and
long-lived processes retain a maximum pool size of five.

The existing Prisma adapter, singleton lifecycle, graceful shutdown, and
authentication checks remain unchanged.

## Root cause

The application was configured Accelerate-first because
`PRISMA_DATABASE_URL` took precedence over healthy direct URLs. Once the
Accelerate allocation started timing out, every route using the shared Prisma
client inherited the failure. Route-specific fallbacks were insufficient.

No recent Prisma version or database runtime configuration change preceded the
incident. The evidence is consistent with project-specific Accelerate
query-engine or connection-pool degradation; Prisma reported no platform-wide
incident at the time.
