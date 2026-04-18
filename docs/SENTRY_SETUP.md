# Sentry Setup

Error + performance monitoring is wired through `@sentry/nextjs`. The SDK
is a **silent no-op until you set `NEXT_PUBLIC_SENTRY_DSN`**, so cloning
the repo and running `npm run dev` locally does not spam your Sentry quota.

## Configuration files (Next.js 16 + Sentry v10)

| File | Runtime | Purpose |
|---|---|---|
| `instrumentation.ts` | Node.js + Edge | Entry point Next calls at startup; delegates to the runtime-specific config + exports `onRequestError` |
| `sentry.server.config.ts` | Node.js | `Sentry.init` for API routes, Server Components, route handlers |
| `sentry.edge.config.ts` | Edge | `Sentry.init` for `proxy.ts` and any edge route handlers |
| `instrumentation-client.ts` | Browser | `Sentry.init` for the client + `onRouterTransitionStart` for App Router nav spans |
| `app/global-error.tsx` | Browser | Last-resort error boundary (replaces root layout) that calls `Sentry.captureException` |
| `app/error.tsx` | Browser | Per-route error boundary (also calls `Sentry.captureException`) |

`lib/monitoring.ts` provides a thin wrapper (`trackError`, `trackMessage`,
`addBreadcrumb`, `setUserContext`) so app code can emit events without
depending on Sentry directly. When no DSN is set, these fall back to
`debugLog` / `errorLog` so stack traces still show in dev.

## Environment variables

All Sentry env vars are **optional**. Set them in Vercel → Settings → Environment Variables.

| Variable | Scope | Required | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | client + server | Yes (to capture anything) | Project DSN. Exposed to the browser; DSNs are not secret. |
| `SENTRY_DSN` | server-only | No | Override DSN on the server. Falls back to `NEXT_PUBLIC_SENTRY_DSN` when unset. Only useful if you want browser + server reporting into different projects. |
| `SENTRY_ORG` | build time | No | Source-map upload target. Required for readable stack traces on Sentry. |
| `SENTRY_PROJECT` | build time | No | Source-map upload target. |
| `SENTRY_AUTH_TOKEN` | build time | No | Sentry CLI auth token. Keep **secret** (Vercel "sensitive" env). |
| `SENTRY_ENABLE_DEV` | server-only | No | Set to `"true"` to capture events during `next dev` (default: off). |
| `NEXT_PUBLIC_SENTRY_ENABLE_DEV` | client-only | No | Same as above but for the browser runtime. |
| `VERCEL_GIT_COMMIT_SHA` / `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA` | auto | — | Used as the Sentry release tag. Automatically injected by Vercel. |
| `VERCEL_ENV` / `NEXT_PUBLIC_VERCEL_ENV` | auto | — | Used as the Sentry environment (`production`, `preview`, `development`). |

## First-time setup

1. Create a Sentry project at [sentry.io](https://sentry.io/) (pick platform: **Next.js**).
2. Copy the DSN from *Settings → Projects → [project] → Client Keys (DSN)*.
3. In Vercel, add `NEXT_PUBLIC_SENTRY_DSN` with the DSN value to Production + Preview.
4. (Optional) For source-map upload, create an auth token with `project:releases` scope and add:
   - `SENTRY_ORG` (e.g. `genosys`)
   - `SENTRY_PROJECT` (e.g. `genosys-website`)
   - `SENTRY_AUTH_TOKEN` (mark sensitive)
5. Redeploy. Errors should start appearing in Sentry within ~30 seconds of the first occurrence.

## Verifying it works

Drop a temporary button anywhere that throws:

```tsx
<button onClick={() => { throw new Error('Sentry test from Genosys') }}>
  Break it
</button>
```

Visit the page, click the button, then check the Sentry issues stream. If
nothing appears, walk through:

- DSN set in Vercel + redeployed since? (`Settings → Deployments` should show env var change)
- Ad blocker? Sentry's `ingest.sentry.io` is commonly blocked; disable the blocker and retry.
- Browser console: the SDK logs warnings at boot if the DSN is malformed.

## Why no Session Replay, no Feedback widget?

- **Replay** adds ~90 KB to the client bundle and eats Sentry quota fast.
  We dropped LogRocket explicitly for bundle reasons; re-enabling Replay
  would partly undo that. Revisit when there's a specific debugging need
  (ideally with `replaysSessionSampleRate: 0.01` and a targeted `errorSampleRate`).
- **Feedback** widget is UI clutter for this small catalog. Customers
  already email us via the contact form.

## PII scrubbing

`instrumentation-client.ts` includes a `beforeSend` hook that strips cookies,
IP address, and email before events leave the browser. Checkout pages in
particular see email/address/phone; scrubbing happens before Sentry ingests.
If you need to track user-specific errors, pass an opaque user ID (e.g.
database PK) via `setUserContext(userId)` — that's safe to send.

## What was removed (April 2026)

- `logrocket` npm dependency (~150 KB gzipped client bundle savings).
- `LogRocketMonitoringService` class and `LogRocketSDK` interface in
  `lib/monitoring.ts`.
- `LOGROCKET_ID` env var placeholder in `.env.example`.
- The commented-out `SENTRY_DSN` line in `.env.example` — replaced with
  the real setup instructions above.

LogRocket was installed but never actually initialized in production
(no App ID, no provider mount), so this is a pure cleanup with no
functional regression.

## Related files

- `components/MonitoringProvider.tsx` — React context wrapper around
  `lib/monitoring.ts`. **Not currently mounted** in the root layout.
  Kept as available scaffolding if you want React-hook access later.
- `lib/errorTracking.ts` — opinionated helpers (`trackApiError`,
  `trackPaymentError`, etc.). Also not currently imported by application
  code; available if you want to plug them into Stripe webhooks etc.
