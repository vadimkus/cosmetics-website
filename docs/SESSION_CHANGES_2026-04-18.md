# Session Changes — 2026-04-18 — Observability (Sentry in, LogRocket out)

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
