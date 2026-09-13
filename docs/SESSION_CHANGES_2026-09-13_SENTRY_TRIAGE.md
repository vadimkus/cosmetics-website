# Sentry triage (13 Sep 2026)

Unresolved issues in `javascript-nextjs` reviewed via API.

| Issue | Verdict |
|---|---|
| NEXTJS-3 `e.getBoundingClientRect is not a function` on /success (regressed, 4 events since 23 Aug) | Injected script: every frame is `blob:app:///…`, none from our bundle. Existing `isBlobOnlyBoundingClientRectProbe` filter was gated to iOS WebKit; the new events are Android Chrome Mobile in-app WebView (device "K"). Gate removed. Resolved. |
| NEXTJS-28 `require is not defined` on /login (1 event, 12 Sep 10:51, Electron 42, Mac) | Our own Cursor browser-subagent registration test earlier that day. Not a customer. Resolved. |
| NEXTJS-20 `FetchEvent.respondWith … Load failed` on /products (2 events, 9 Sep, iOS Chrome) | Service-worker fetch aborted by navigation on iOS; old release. Resolved, watch. |
| NEXTJS-W `timeout exceeded when trying to connect` GET /faq (18 events, last 8 Sep) | Prisma/pg pool could not get a Neon connection; cold-start burst, not seen for 5 days. Resolved, watch. |
| NEXTJS-24/25/26/27 Slow DB Query (info) on /products/[id] and reviews | Performance signals, not errors: `products`, `product_variants`, `product_reviews` selects on cache misses. Left open; candidates for a later look at Neon latency / query shape. |
