# Website error sweep

**Date:** 2 September 2026 (afternoon)

Layers: Sentry (real user errors, 14 days), eslint, typecheck, Jest, a crawl of
354 internal links, every product image/slide/cutout in the database against the
live CDN, and translation parity plus keys used in code.

## Sentry: 9 unresolved issues, 18 events, 0 affected users in 14 days

Low volume. Reached via the DSN's org and project ids on the `de` region; the
env has `SENTRY_AUTH_TOKEN` but no `SENTRY_ORG`/`SENTRY_PROJECT`, which also
means the build's source-map upload in `next.config.js` has nothing to point at.
Worth setting both (`genosys-middle-east-fz-llc`, project id `4511240467972176`).

Fixed:

- **`InvalidStateError: Transition was aborted`** on product pages (3).
  `startViewTransition().finished` rejects when a second navigation interrupts
  the first, which is someone tapping twice, not a fault. The rejection now
  ends in the helper; a synchronous throw falls back to a plain navigation.
- **`undefined is not an object (evaluating 't.objectStoreNames')`** (1). The
  service worker's `onupgradeneeded` trusted `event.target.result`, which
  Safari private browsing leaves undefined. Guarded; the open fails through
  `onerror`, which every caller already handles.
- **`FetchEvent.respondWith received an error: Load failed`** (1). Private
  API requests were returned as a bare `fetch(request)`, so offline the
  rejection landed on `respondWith`. Now a clean 503 JSON response.
- **`aria-label` read "common.language"** on the mobile web language button
  in every locale. `t()` returns the key on a miss, so the `|| 'Language'`
  fallback was dead. Key added to EN, RU, AR. Found by the key scan below, not
  Sentry.

Left alone, with reasons:

- **DB connection timeouts** on `/faq`, `/ru/faq`, `/` (7 events). Neon cold
  connections during ISR revalidation; the query already has retry and a
  five-minute cache, and ISR keeps serving the last good page when a
  revalidation fails, which matches zero affected users. Infrastructure, not
  code.
- **`Failed to find Server Action`** (2). Deploy skew; a tab open across a
  deploy. Transient by nature.
- **`Java object is gone`** (2). Android WebView teardown inside the app.
- **`e.getBoundingClientRect is not a function`** on `/success` (2). The two
  call sites both iterate `querySelectorAll`, which can only yield elements;
  the stack does not point at our code. Not guessing.

## Static and structural

- eslint: 0 errors, 164 style warnings (`no-explicit-any`, `no-console`).
- Typecheck clean. Jest 1463 passing; the one failure is the pre-existing dash
  in the uncommitted `lib/moysklad.ts`.
- Crawl from 14 seed pages: 354 internal links, 0 broken.
- 66 products, 442 image paths (main, gallery, cutout): 0 missing on the CDN;
  every visible product has a cutout.
- Translations: RU and AR carry every EN key (RU +17 extra, AR +21 extra, all
  harmless). 2,495 `t()` call sites with literal keys; one missing, fixed
  above. The partner-portal hits are a local inline `t(en, ru, ar)` helper.
