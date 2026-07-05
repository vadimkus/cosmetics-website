# Session Changes — 2026-07-05: OG Image CDN Caching (WhatsApp Link Previews)

## Problem

Sharing product links in WhatsApp produced inconsistent previews: some links
(e.g. `/products/66`) showed the full rich card with the product image, while
others (e.g. `/products/60`, `/products/65`) showed only a bare "genosys.ae"
title with no image.

## Diagnosis

All product pages emit identical, correct Open Graph meta tags pointing at the
dynamic card renderer:

```
og:image → https://genosys.ae/products/{id}/opengraph-image?{deploymentHash}
```

The endpoint itself always returned HTTP 200 with a valid 1200x630 PNG
(57–257 KB — well within WhatsApp's ~600 KB limit). The real problem was
**latency**:

- Next.js file-based `opengraph-image.tsx` routes ship with
  `Cache-Control: public, max-age=0, must-revalidate` by default.
- Result: **every** fetch was a Vercel CDN `MISS` — verified with repeated
  `curl -I` (always `x-vercel-cache: MISS`).
- Each MISS triggers a full serverless render: DB product lookup + fetch of
  the source product photo (up to ~470 KB) + satori PNG render =
  **1–4 seconds** per request.
- WhatsApp generates previews on the sender's device with a short timeout.
  Page fetch (~1s) + OG image fetch (1–4s cold) intermittently exceeded it,
  so previews appeared only when the render happened to be fast.

## Fix

Two-part fix (the first alone was not enough):

**1. `export const revalidate = 3600`** on all dynamic share-card routes.
Deployed alone this did NOT change the response headers — verified live:
still `max-age=0` + `x-vercel-cache: MISS` on every request. Root cause:
`ImageResponse` (from `next/og`) sets its own `Cache-Control` header on the
Response object, which overrides route segment config for metadata image
routes (documented in vercel/next.js discussions #62742 and community
writeups).

**2. Explicit `Cache-Control` headers on every `ImageResponse`** in
`lib/ogImages.tsx` (shared by all card renderers):

```ts
const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
}
// passed as: new ImageResponse(jsx, { ...size, headers: CACHE_HEADERS })
```

- `s-maxage=86400` — Vercel CDN caches the PNG for a day
- `stale-while-revalidate=604800` — after expiry, serve stale instantly and
  re-render in background (crawlers never wait)
- `max-age=3600` — browsers/WhatsApp proxy keep it for an hour

Files changed:

| File | Purpose |
|---|---|
| `lib/ogImages.tsx` | **The actual fix** — explicit Cache-Control on all 3 renderers (product card, fallback, title card) |

| File | Purpose |
|---|---|
| `app/products/[id]/opengraph-image.tsx` | EN product OG card |
| `app/products/[id]/twitter-image.tsx` | EN product Twitter card |
| `app/ar/products/[id]/opengraph-image.tsx` | AR product OG card |
| `app/ar/products/[id]/twitter-image.tsx` | AR product Twitter card |
| `app/ru/products/[id]/opengraph-image.tsx` | RU product OG card |
| `app/ru/products/[id]/twitter-image.tsx` | RU product Twitter card |
| `app/blog/[slug]/opengraph-image.tsx` | Blog post OG card (no featured image fallback) |

Not changed: `app/guides/[slug]/opengraph-image.tsx` and `twitter-image.tsx`
already use `generateStaticParams` + `dynamicParams = false`, so they are
static at build time.

## Why 1 hour is safe

- Product name / price / stock changes appear in the share card within 1 hour.
- Deploys bust the cache anyway: the og:image URL carries a deployment hash
  query (`?30b49660b126b77b`) that changes on every deploy.
- WhatsApp/Facebook/Twitter cache previews on their side far longer (days),
  so a 1-hour server TTL loses nothing.

## Verification (post-deploy)

1. `curl -I "https://genosys.ae/products/60/opengraph-image?<hash>"` twice —
   second response should show `x-vercel-cache: HIT` and TTFB well under 500 ms.
2. Share a previously-failing product link in WhatsApp (append a dummy query
   string like `?x=1` to bypass WhatsApp's cached failed preview) — the rich
   card should render.

## Note on WhatsApp's own cache

WhatsApp caches a failed preview per exact URL for a while on the sender's
device/account. If a link still shows no preview after this fix, send it with
a throwaway query param (`https://genosys.ae/products/60?w=1`) or wait for
WhatsApp's cache to expire.

## Local build note

The repo's `npm run build` requires Node ≥ 18 (Prisma 7). The machine default
`node v16.16.0` crashes in `prisma generate`; build verified with
`~/.nvm/versions/node/v24.12.0`. Vercel builds are unaffected.
