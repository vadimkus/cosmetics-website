# Sentry JAVASCRIPT-NEXTJS-1M — Neon upstream DB blip

**Date:** 2026-08-05 ~13:17 UTC (17:17 GST)  
**Project:** genosys.ae / javascript-nextjs  
**Event ID:** 941f595e1dac4d6fbaec74679bbd2888  
**Release:** `6d3c8fb233a735f11df9f0f39b0c63e1f1176cf4`

## What happened

Production error on `getProductById`:

```
Failed to connect to upstream database. Please contact Prisma support if the problem persists.
```

Stack: `pg-pool` → `@prisma/adapter-pg` (direct Postgres path, not Accelerate).  
Sentry tags: `area=prisma-retry`, `op=getProductById`, `transient=false`, `handled=yes`.

## Diagnosis

- Neon status: All Systems Operational at check time.
- Live site ~5 min later: `/api/products` and product pages returned 200.
- This is a Neon PgBouncer/pooler message when the pooler is up but cannot reach the Postgres compute (wake/suspend race or brief pooler flap), not an app credential/config failure.
- `lib/prismaRetry.ts` did **not** treat the message as transient, so:
  1. No retries
  2. No direct-DB recovery path
  3. No static product catalog fallback in `getProductById`
  4. High-priority Sentry alert fired

## Fix

Added `/Failed to connect to upstream database/i` to `TRANSIENT_MESSAGE_PATTERNS` in `lib/prismaRetry.ts` so the next blip retries, recovers, and/or serves the static catalog instead of 500ing.

## Action for Vadim

- No emergency action needed; site recovered on its own.
- Deploy the `prismaRetry.ts` change when convenient so the next blip is quieter.
- If this repeats in a burst, check Neon console compute status / region for the project.
