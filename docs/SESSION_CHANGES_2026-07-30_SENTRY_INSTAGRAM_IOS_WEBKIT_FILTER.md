# Session Changes — 2026-07-30 — Sentry: Filter Instagram iOS `window.webkit.messageHandlers` Noise

## Trigger

Sentry Slack alert, new issue `368a5316d951475cb208eb73d63ea4fb`:

- **Error:** `TypeError: undefined is not an object (evaluating 'window.webkit.messageHandlers')`
- **Page:** `https://genosys.ae/products`
- **Tags:** browser `Instagram 393.1.0`, device `iPhone17,2`, os `iOS 26.5.2`, mechanism `auto.browser.global_handlers.onerror`, handled `no`
- **Stack:** anonymous frames only — `w (app:///:1:704)`, `v (app:///:1:2396)` — zero frames in `_next/static/chunks`
- **First seen:** 2026-07-30 05:32 UTC, release `9815b931`

## Root Cause (not our code)

Instagram/Facebook on iOS open external links in a WKWebView and inject their own
minified bridge script into every page. That script talks to the native app via
`window.webkit.messageHandlers.<handler>.postMessage(...)`. In webview instances
where the handler map is not exposed, the **injected** script throws; the error
fires the page's `window.onerror`, so Sentry attributes it to genosys.ae.

Verification that no app code can produce this message:

- `rg messageHandlers` over source → no matches
- `grep -rl messageHandlers .next/static/chunks` → empty (built client bundle clean)
- Only global third-party script is Google Analytics (gtag) — does not touch `window.webkit`
- Stripe.js loads lazily inside checkout/partner payment sheets only — not on `/products`

User-visible impact: none — the page loads and works normally; this is the host
app's bridge probe failing, same class as the existing Instagram-Android
navigation-logger filter.

## Change

`instrumentation-client.ts`:

- New filter `isInjectedWebkitMessageHandlersError` — drops the event only when
  ALL of these hold:
  - exception type `TypeError`, value matches `/window\.webkit\.messageHandlers/i`
  - mechanism `auto.browser.global_handlers.onerror`
  - iOS WebKit browser (existing `isIOSWebKitBrowser` helper, incl. UA fallback)
  - no stack frame resolves into `_next/static/chunks/` (if our own code ever
    touches this API, the event still reaches Sentry)
- Wired into `beforeSend` alongside the existing injected-script filters.

`npx tsc --noEmit` clean.

## Follow-up

- In Sentry: archive issue `368a5316…` — no new events will be recorded after
  this deploys, and the Slack "new issue" alert will not re-fire for it.
