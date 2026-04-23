# SEO & AI-Search Audit + Implementation — 2026-04-17

> Session log: prioritized SEO improvements shipped after the desktop UI rebuild and newsletter system launch. All eight changes below ship in one commit and are verified with a production build + SSR smoke test.

## Why this work

The homepage rebuild (#1-8 UI priorities), footer rebuild (#9-15), split-screen auth (#21), and newsletter system added a large amount of new user-facing content and new URLs. The SEO surface — metadata, structured data, llms.txt, robots.txt, multilingual parity — had not been refreshed to match. This session closes that gap.

Notably:
- AR and RU homepages were rendering **only the Hero** while the EN homepage rendered the full `HomeDesktopSections` catalog rail. That meant non-English crawlers (and AI search engines in those languages) saw **~70 % less indexable content** than English, despite our `hreflang` annotations claiming equivalence.
- `llms.txt` had not been refreshed since 2025 — it was missing TDRA / VAT / "since 2019" credentials, the new payment methods, and the newsletter touchpoint.
- FAQ structured data was EN-heavy (8 items) and AR/RU-thin (5 items), with nothing about newsletter or payment.
- Homepage rails (category, concerns, bestsellers) had no `ItemList` JSON-LD — Google could not generate carousels from them and AI search engines could not answer "what categories does GENOSYS sell?" with structured output.
- Hero rendered two `<h1>` tags (mobile + desktop, conditionally CSS-hidden) with the generic text "Discover Your Beauty" — no keyword value.

## What shipped (in priority order)

### 1. AR/RU homepages now render `HomeDesktopSections` — highest impact

- **Before:** `/ar` and `/ru` rendered only `<Hero />`. Response size ~10 KB, no category rail, no concerns grid, no bestsellers, no Why GENOSYS, no newsletter CTA.
- **After:** Both locales render the same full body as `/` — bringing them to parity. Response size now **~120 KB** (vs 110 KB for EN), carrying full localized content.
- Extracted `getHomeData()` from `app/page.tsx` into `lib/homeData.ts` so all three pages share the same 5-minute cache. One DB read serves all three locale homepages.
- Added `export const revalidate = 300` to `/ar` and `/ru` to match `/`.

Files:
- `lib/homeData.ts` — new, shared server-cached data loader + curated IDs
- `app/page.tsx` — now imports from shared lib (removed ~120 lines of inline logic)
- `app/ar/page.tsx` — now async, renders `HomeDesktopSections`, emits `ArticleDateSchema`
- `app/ru/page.tsx` — same

### 2. `public/llms.txt` refreshed for AI crawlers

LLMs (ChatGPT, Claude, Perplexity, Gemini) use `llms.txt` as a primary source for structured facts about a site. Our file hadn't been updated since early 2025.

New facts now in `llms.txt`:
- TDRA-licensed, VAT-registered, Dubai Municipality certified (Montaji System)
- Operating in the UAE since 2019
- Full category list (was previously missing several)
- Payment methods: Visa, Mastercard, Apple Pay, Google Pay
- Secure checkout powered by Stripe (PCI-DSS compliant)
- Newsletter section with language support + unsubscribe policy
- Three brand pillars re-articulated

### 3. Newsletter FAQ items added (EN / AR / RU)

Added 3 new FAQ entries to `GeoFaqSchema.tsx` that appear in JSON-LD structured data on every homepage:

| Question | Why |
|----------|-----|
| "What payment methods does GENOSYS UAE accept?" | Answers voice search / AI queries about payment. Names Stripe + PCI-DSS. |
| "Is GENOSYS UAE an authorised distributor?" | Establishes legitimacy. Cites TDRA, VAT, Dubai Municipality, since 2019. |
| "How do I subscribe to the GENOSYS newsletter?" | Covers the new subscriber funnel + unsubscribe promise. |

### 4. AR/RU FAQ arrays expanded to match EN (5 → 11 items)

Previously `GENOSYS_FAQ_AR` and `GENOSYS_FAQ_RU` had only 5 items while `GENOSYS_FAQ_EN` had 8. Adding the 3 newsletter-era questions would have widened the gap. Instead:

- EN: 8 → **11** items
- AR: 5 → **11** items (all 3 missing items back-translated: professional-vs-consumer, K-beauty vs regular skincare, app features)
- RU: 5 → **11** items (same)

This restores parity for AI citation across languages.

### 5 + 7. `ItemList` JSON-LD schema for homepage rails

New component `components/schema/HomeItemListSchema.tsx` emits three `ItemList` JSON-LD blobs per homepage:

1. **Category rail** — 6 items (microneedling, pro-solution, serum, cream, mask, sun), localized H1s
2. **Concern grid** — 8 items (all concerns), localized H1s
3. **Featured products (bestsellers)** — 4 items, localized product names + image URLs

Each list includes `itemListOrder`, `numberOfItems`, and absolute URLs that respect `/ar` / `/ru` prefixes.

Why this matters:
- Google uses `ItemList` to generate carousel rich results and sitelink previews from homepages
- AI search crawlers (ChatGPT, Perplexity, Claude) use it to answer structured "what X does Y sell?" queries

Verified: 3 `ItemList` + 1 `FAQPage` JSON-LD blocks render in SSR on all three locales (13 total `application/ld+json` script tags per page).

### 6. Hero H1 rework — keyword-rich text + dedup

**Before:**
- EN: "Discover Your **Beauty**" (no keyword value)
- AR: "اكتشف **جمالك**"
- RU: "Откройте для себя **Красоту**"
- Two `<h1>` elements per page (mobile + desktop, CSS-conditional)

**After:**
- EN: "Professional Korean **Dermacosmetics**" — primary keyword as the accent
- AR: "مستحضرات تجميل كورية **احترافية**" — matches how Arabic users search
- RU: "Профессиональная корейская **дерматокосметика**" — matches Russian search intent
- Hero subtitle also refreshed to surface microneedling / serums / creams / free shipping
- **Single `<h1>` per page** — mobile heading converted to `<h2>`. Desktop H1 is now the sole authoritative heading. (Mobile users are redirected to `/products` by `MobileRedirect` before it matters; this mostly benefits AI crawlers that don't execute JS.)

Files:
- `messages/{en,ar,ru}.json` — hero title, titleHighlight, subtitle
- `components/Hero.tsx` — mobile `<motion.h1>` → `<motion.h2>` with explanatory comment

### 8. `robots.txt` disallow newsletter unsubscribe URLs

```
Disallow: /newsletter/unsubscribe
Disallow: /ar/newsletter/unsubscribe
Disallow: /ru/newsletter/unsubscribe
```

Why: unsubscribe pages are token-gated (`?token=...`) and already set `noindex, nofollow` in their `<head>`, but parameterized URLs still consume crawl budget when discovered. Explicit `Disallow` tells crawlers not to follow them at all.

## What was deferred

### #9 OG image
The existing `/images/genosys-og-image.jpg` still shows the old "Discover Your Beauty" hero. Regenerating needs a design pass (typography, premium imagery, brand approval). Deferred to a separate ticket — UI work, not code.

## Verification

### Type check
```bash
npx tsc --noEmit 2>&1 | grep 'error TS' | grep -v '^__tests__'
# Output: (empty)
```
No new TS errors in production code. All remaining errors are pre-existing in `__tests__/*`.

### Build
```bash
npm run build
# Exit code: 0 — all 89 routes compile, /ar and /ru now prerendered with 5-min revalidate
```

### SSR smoke test (local prod server)
```bash
PORT=3009 npm run start &
curl -s http://localhost:3009/ -o /tmp/en.html     # HTTP 200, 110 KB
curl -s http://localhost:3009/ar -o /tmp/ar.html   # HTTP 200, 120 KB  (was ~10 KB)
curl -s http://localhost:3009/ru -o /tmp/ru.html   # HTTP 200, 122 KB  (was ~10 KB)
```

Per-page JSON-LD counts (all three locales):

| Schema type | Count per page |
|-------------|---------------|
| `ItemList` (category + concern + featured) | 3 |
| `FAQPage` | 1 |
| `Question` (inside FAQPage) | 11 |
| Total `<script type="application/ld+json">` tags | 13 |

Robots + llms:
```bash
curl -s http://localhost:3009/robots.txt | grep unsubscribe
# Disallow: /newsletter/unsubscribe
# Disallow: /ar/newsletter/unsubscribe
# Disallow: /ru/newsletter/unsubscribe

curl -s http://localhost:3009/llms.txt | head -1
# # GENOSYS Middle East FZ-LLC
```

### Manual checks
- Opened the EN / AR / RU homepages in the browser — category rail, concerns grid, bestsellers, Why GENOSYS, newsletter CTA all render in all three locales with correct translations and RTL for AR.
- Inspected page source: single `<h1>` per locale (desktop), mobile heading is `<h2>`.
- Validated JSON-LD for one ItemList blob with schema.org structure — parses cleanly.

## Files changed

### New
- `lib/homeData.ts` — shared homepage data loader + curated category/product IDs
- `components/schema/HomeItemListSchema.tsx` — emits 3 JSON-LD `ItemList` blocks per homepage
- `docs/SESSION_CHANGES_2026-04-17_SEO_IMPROVEMENTS.md` — this file

### Modified
- `app/page.tsx` — imports from `lib/homeData.ts`, adds `HomeItemListSchema`
- `app/ar/page.tsx` — now async, renders `HomeDesktopSections` + `HomeItemListSchema` + `ArticleDateSchema`, adds `revalidate = 300`
- `app/ru/page.tsx` — same as AR
- `components/schema/GeoFaqSchema.tsx` — 3 new EN items, 6 new AR items, 6 new RU items
- `components/Hero.tsx` — mobile `<h1>` → `<h2>` for single authoritative H1
- `messages/en.json`, `messages/ar.json`, `messages/ru.json` — keyword-rich hero title / titleHighlight / subtitle
- `public/llms.txt` — full refresh with TDRA / VAT / payments / newsletter facts
- `public/robots.txt` — added `Disallow: /newsletter/unsubscribe` for 3 locales

## Notes for the next SEO pass

1. **OG image regeneration** — new hero / value prop deserves new 1200×630 art
2. **Sitemap `lastModified`** — currently refreshes on every request for static pages; use a build-time constant instead to stop giving Google a signal of constant change
3. **Google Search Console** — re-submit the sitemap after deploy so the newly rich AR/RU homepages get picked up fast
4. **Google Merchant Center** — verify `/feed/products.xml` still validates (not touched this round but should be audited quarterly)
5. **Consider Brand SERP monitoring** — now that FAQ has 11 localized items, track which ones Google is picking for rich results
