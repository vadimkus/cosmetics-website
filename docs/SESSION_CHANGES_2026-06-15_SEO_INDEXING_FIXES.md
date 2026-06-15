# Session Changes — 2026-06-15 — SEO Indexing Fixes (Search Console)

## Context

Google Search Console "Why pages aren't indexed" showed:

| Reason | Source | Pages |
|---|---|---|
| Alternate page with proper canonical tag | Website | 4 |
| Soft 404 | Website | 1 |
| Excluded by 'noindex' tag | Website | 1 |
| Discovered – currently not indexed | Google systems | 171 |
| Crawled – currently not indexed | Google systems | 90 |
| Duplicate, Google chose different canonical than user | Google systems | 2 |

## Investigation

Verified the SEO foundation is sound (no bugs found there):
- `www → non-www`, `http → https`, and trailing-slash redirects all return 308 correctly.
- Product / concern / category / AR / RU pages all emit correct self-referencing canonicals + hreflang alternates.
- AR/RU pages serve genuinely translated content (`seo.ar` / `seo.ru`), not thin English duplicates.
- The sitemap has **386 URLs** (~125 per locale). Google indexing ~125 (386 − 261) ≈ the English set — i.e. it is deferring the AR/RU duplicates. On a low-authority site this is expected and resolves over time; not a code bug.

Two **real, fixable** issues were found:

### 1. Soft 404 — thin/empty category pages (defensive)
Initial diagnosis suspected `/products/category/bio-meso` based on the local **static fallback catalog** (`lib/products.ts`), which contains no Bio Meso product. **Correction:** the live DB *does* contain "Bio Meso PDRN Ampoule 60000" (category "Bio Meso", In Stock), so the live page returns 200 and renders the product — it is **not** a soft 404 today. The Search Console Soft 404 (validation "Not Started") was most likely a **stale snapshot** from before that product was tagged/unhidden.

The fix is therefore defensive rather than targeted: any category that resolves to **0 products** (e.g. during a DB-outage fallback to the static catalog, or a future emptied category) now returns a real 404 instead of a thin 200, and the sitemap only advertises categories that actually have products.

### 2. Unstable `lastmod` churn in the sitemap
`app/sitemap.ts` stamped `lastModified: new Date()` (`now`) on the **guides index, all SEO landing guides, all 8 concern pages, and all 14 category pages** — ~40 pages × 3 locales ≈ 120 URLs reporting "just changed" on every sitemap regeneration. A constantly-moving `lastmod` trains Google to distrust the signal and deprioritise crawling — a known contributor to **"Discovered – currently not indexed."**

## Changes

**`app/sitemap.ts`**
- Added a stable `contentDate` (`2026-06-01`) for editorial landing pages.
- Guides index, SEO landing guides, concern pages, and category pages now use `contentDate` instead of `now`. Products/blog keep their real `updatedAt`; home/products-listing/blog-index keep `now` (genuinely dynamic).
- Category section is now **data-driven**: only categories that actually contain a visible (`isHidden: false`) product are emitted. Runs against the live DB, so `bio-meso` stays in (it has a live product); genuinely empty categories are omitted and the list self-heals once a product is tagged.

**`app/products/category/[slug]/page.tsx`** (+ `app/ar/...` + `app/ru/...`)
- Added guard: if a category resolves to **0 products**, return `notFound()` (real HTTP 404) instead of serving thin content. Future-proofs any category that empties out.

## Notes / not changed (intentional)
- "Excluded by noindex" (1) and "Alternate page with proper canonical tag" (4) are expected/benign (private pages + hreflang alternates).
- "Duplicate, Google chose different canonical" (2) is Google's discretion; the cleaner sitemap + stable lastmod help it reconcile.
- The AR/RU "not indexed" backlog is an authority/time issue, not a code bug. No localization removed.

## Follow-up (optional, owner action)
- `bio-meso` is healthy on live (1 product, In Stock) — no action needed there.
- After deploy, in Search Console: use "Validate Fix" on Soft 404, and re-submit `sitemap.xml`.
- Note: `lib/products.ts` (static DB-outage fallback) does not include the Bio Meso product. Harmless for SEO, but worth syncing if the fallback catalog is meant to mirror production.

## Verification
- `npx tsc --noEmit` passes.
- Confirmed homepage featured-category rail does not link to `bio-meso` (no broken internal links).
