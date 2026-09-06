# Sentry sweep, 2026-09-06

Commit `450daf76`. 19 unresolved issues in `javascript-nextjs`, all resolved in Sentry after the fix.
Weekly digest showed 29 errors (+190%), driven by one iOS device on /products/63.

## Fixed in code

| Issue | What it was | Fix |
|---|---|---|
| 1T Transition was aborted because of invalid state (Chrome Android, /products/:id) | Gallery `startViewTransition` left `ready`/`updateCallbackDone` unhandled; a second tap skips the first transition and rejects all three | `settleViewTransition()` in `lib/productViewTransition.ts`, used by every caller |
| 20 FetchEvent.respondWith received an error: Load failed | A rejection escaping a SW handler fails the page fetch with a worker error | `public/sw.js` dispatch now `.catch(fetch).catch(offline)` |
| 1Y `t.objectStoreNames` undefined (iOS Safari) | Private mode fires `upgradeneeded` with no `result` | `hooks/useBackgroundSync.ts` bails |
| P, W connect timeouts on /faq; 1Z connection closed | 5 s pool connect budget vs Neon compute resume (3–8 s) on cold ISR revalidate, even after 3 retries | `lib/prisma.ts` connect timeout 15 s |
| 1N, 1S, 1P, 1Q, 1R Slow DB Query | Unique-key `users` lookup and `COUNT(*)` flagged slow: connection latency, not plans. 1N/1S last seen Aug 11 | Same 15 s change; no query work |

## Filtered (not code faults)

| Issue | Why | Filter |
|---|---|---|
| 22 InvalidStateError: The object is in an invalid state (17 events, one iOS 18.7 device, one session, no frame of ours) | WebKit-internal DOMException via onerror | `isWebKitBareInvalidStateError` (client) |
| 23 SyntaxError: Unexpected token '<' on / | Chunk from the previous deployment 404s as HTML | `isDeploymentSkewChunkError` (client) |
| T Failed to find Server Action | Same skew, server side | `isDeploymentSkewServerAction` (server) |

Structural fix for the two skew issues is Vercel → Project → Settings → Deployment Protection → **Skew Protection**. Not toggled here; the filters keep the residue out either way.

## Already covered by earlier filters, resolved as stale

1W Instagram "Java object is gone" (filter shipped Sep 2, event predates), 3 blob `getBoundingClientRect` (Aug 27),
A Safari "Load failed" (Aug 19), 1V Max call stack on blog (Aug 14), 1X RSC render error /ru/blog (Aug 17).
If any of these re-open, that is the signal to dig again.
