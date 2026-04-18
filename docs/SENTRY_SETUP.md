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
2. **Do NOT run** the `npx @sentry/wizard` command Sentry's UI suggests — it
   will overwrite our manual instrumentation files. Skip the wizard, go
   straight to *Settings → Projects → [project] → Client Keys (DSN)*.
3. Copy the DSN, add `NEXT_PUBLIC_SENTRY_DSN` to Vercel → Settings →
   Environment Variables (All Environments). DSNs are non-secret.
4. Push an empty commit (or redeploy) so the env var bakes into the client
   bundle. Errors start appearing within ~30 seconds of the first occurrence.
5. (Optional, for readable stack traces) Create a build-time auth token
   with `project:releases` scope and add to Vercel:
   - `SENTRY_ORG` (currently `genosys-middle-east-fz-llc`)
   - `SENTRY_PROJECT` (currently `javascript-nextjs`)
   - `SENTRY_AUTH_TOKEN` (mark as **sensitive**)

Existing values are in `.env.example` — update there if the slugs change.

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
- Service worker cache? The PWA service worker caches old JS. Hard-reload
  + `Application → Service Workers → Unregister` in DevTools if the
  current page's JS predates your env var change.

Note on browser DevTools REPL: running `throw new Error(...)` directly in
the console often **does not** propagate to `window.onerror` in Chrome,
so it will not reach Sentry. Use `setTimeout(() => { throw ... }, 0)`
instead — the timer escapes the REPL context and the error surfaces normally.

If you want to prove ingestion without touching UI code, use the CLI smoke
test below.

## CLI workflow

Two CLIs + one helper script are wired for terminal-based ops.

### One-time install

```bash
npm install -g vercel @sentry/cli
vercel login                       # authenticate against Vercel
# Sentry auth = Personal Auth Token, added to .env.local (see below)
```

### Personal Auth Token (Sentry REST API)

Create at *Sentry → User Settings → Auth Tokens → Create New Token*.

| Scope | Why |
|---|---|
| `project:read` | List issues, view project metadata |
| `event:read` | Fetch individual events, stack traces, tags |

Append to `.env.local` (gitignored) as `SENTRY_AUTH_TOKEN=sntryu_...`.

### npm scripts

| Command | What it does |
|---|---|
| `npm run sentry:errors` | List 10 unresolved prod issues |
| `npm run sentry:errors -- --limit 25` | Larger window |
| `npm run sentry:errors -- --all-envs` | Drop env filter when nothing matches |
| `npm run sentry:errors -- --since 24h` | Time window (also accepts `7d`, `90d`, etc.) |
| `npm run sentry:errors -- --query "is:unresolved level:error"` | Full Sentry search syntax |
| `npm run sentry:errors -- --detail JAVASCRIPT-NEXTJS-2` | Full stack, tags, release, user for one issue |
| `npm run sentry:errors -- --detail 12345678` | Same, by numeric issue ID |
| `npm run vercel:logs` | Function logs (prod), last 1 hour, 100 entries |
| `npm run vercel:logs:errors` | Error-level only, last 24 hours — fast triage view |
| `npm run vercel:logs:follow` | Live-tail prod Vercel function logs |

The `vercel:logs` scripts target the linked project via `.vercel/project.json`
(`cosmetics-website2` on Vadim's machine) — so there's no need to pass a
URL. Vercel CLI prints a cosmetic `WARNING! Did you mean to deploy the
subdirectory "logs"?` line every run; it's safe to ignore, just noise.

One-time requirement: `vercel login` (interactive browser flow). Check
status with `vercel whoami`.

The script lives at `scripts/sentry-errors.js` — zero production deps, uses
only `dotenv` (already a project dependency) to read `.env.local`.

### CLI smoke test (confirms ingestion end-to-end)

```bash
# Fetch the DSN from Sentry via REST API and feed it to sentry-cli:
DSN=$(curl -s -H "Authorization: Bearer $SENTRY_AUTH_TOKEN" \
  "https://sentry.io/api/0/projects/genosys-middle-east-fz-llc/javascript-nextjs/keys/" \
  | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).find(k => k.isActive).dsn.public)")

SENTRY_DSN="$DSN" sentry-cli send-event \
  --message "CLI smoke test $(date +%s)" \
  --level warning
```

The event appears in Sentry within ~8 seconds. Follow up with
`npm run sentry:errors -- --detail <SHORT-ID>` to confirm the release,
environment, and tags came through correctly.

### Security hygiene

- `SENTRY_AUTH_TOKEN` in `.env.local` **only**. The file matches the
  `.env*.local` pattern in `.gitignore`.
- Token scopes are read-only (`project:read` + `event:read`). Compromise
  would leak issue contents but not let an attacker modify or delete
  data in Sentry.
- If a token ever gets pasted into chat, a screenshot, a PR description,
  etc. — rotate it immediately at *Sentry → User Settings → Auth Tokens*
  (delete old, create new, update `.env.local`).

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
