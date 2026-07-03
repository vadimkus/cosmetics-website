# Session Changes — 2026-07-03 — GSC "Page with redirect" Notice

## Context

Google Search Console sent a "new reason preventing your pages from being indexed" notice:

> **Page with redirect** — If this reason is not intentional, we recommend that you fix it.

## Investigation

### Sitemap audit (the critical check)
Fetched all **395 URLs** from `https://genosys.ae/sitemap.xml` and requested each one:
- **394 × HTTP 200**, 1 transient network timeout that returned **200 on retest** (`/ar/products/24`).
- **Zero sitemap URLs redirect.** Google is not being told to index redirecting URLs — the notice does not indicate a sitemap defect.

### Redirect inventory (all intentional)
| Redirect | Status | Where | Verdict |
|---|---|---|---|
| `www.genosys.ae/* → genosys.ae/*` | 308 | `next.config.js` `redirects()` | Intentional (added 2026-06-11 for signal consolidation). **Most likely trigger of the notice** — GSC newly discovered www URLs now redirect, which is exactly the desired outcome. |
| `http → https` | 308 | Vercel platform | Standard |
| Trailing slash `/products/ → /products` | 308 | Next.js default | Standard |
| Legacy CUID product URLs → numeric slugs | 301 | `proxy.ts` `legacyProductIdMap` | Intentional (2026-06-11 SEO session) |
| `/ar\|/ru` prefixed English-only paths → canonical | 308 | `proxy.ts` | Intentional |
| SEO alias URLs (`/korean-dermacosmetics-products → /products` etc.) | **307 → fixed to 308** | `proxy.ts` `redirects` map | Intentional but wrong status (see fix) |
| `/en/* → /*` | **307 → fixed to 308** | `proxy.ts` | Intentional but wrong status (see fix) |
| Accept-Language/cookie locale redirects (`/x → /ar/x`) | 307 | `proxy.ts` | Correctly temporary (content negotiation; Googlebot crawls without Accept-Language and gets 200s) |

### Internal-link check
- `OPTIMIZED_URLS` (alias URLs) in `lib/urlUtils.ts` has **no callers** — no indexable page links to the redirecting aliases.
- Remaining `www.genosys.ae` references are in emails/certificates (not indexable surfaces).

## The one real defect found & fixed

`NextResponse.redirect()` defaults to **307 Temporary**. The SEO alias redirects and the `/en/*` redirect were therefore serving 307 even though the Feb 2026 GSC audit documented them as permanent. A 307 tells Google "the old URL may come back", so it keeps re-crawling and reporting those URLs under "Page with redirect" instead of consolidating.

**`proxy.ts` changes:**
- Alias map redirects (`/about-genosys-middle-east`, `/korean-dermacosmetics-products`, `/genosys-official`, guide shortcuts, etc.): now **308 Permanent**.
- `/en` and `/en/*` → unprefixed: now **308 Permanent**.
- Locale-preference redirects intentionally left at 307 (they vary per user).

## Conclusion for the GSC notice

- The notice is **expected and mostly healthy** — it is Google acknowledging the www→apex canonicalization and legacy-URL cleanup from June.
- No action needed in Search Console beyond letting validation run; the affected URLs should progressively resolve as Google processes the permanent redirects.
- In GSC, the "Page with redirect" URL list can be spot-checked: www URLs, `/en/...`, alias URLs, and legacy CUID product URLs are all intentional.

## Verification
- `npx tsc --noEmit` passes.
- All 395 sitemap URLs return 200.
