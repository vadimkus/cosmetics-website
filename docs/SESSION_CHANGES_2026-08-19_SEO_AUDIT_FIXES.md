# SEO audit and fixes

**Date:** 19 Aug 2026
**Scope:** indexability, robots.txt, titles, hreflang

A full audit of metadata coverage, canonicals, hreflang, sitemap, robots, structured
data and indexability. What follows is what was found and what was fixed.

## ★ Seven routes were indexable that should not have been

Each inherited the root layout's `index: true` **and its title**, so Google could crawl
them and list them under the homepage's name.

| Route | Why it was missed |
|---|---|
| `/ar/orders`, `/ru/orders` | `app/orders/layout.tsx` noindexes the English route, but that layout does not wrap the localized files — they sit outside its subtree. A customer's order history was crawlable in two languages. |
| `/forgot-password` | The page is a client component, and Next.js silently ignores a metadata export from one. AR and RU were already correct; only English was exposed. |
| `/pay/success`, `/pay/cancel` | Missed when `/success` and `/checkout/success` were noindexed. `cancel` is also a client component. |
| `/share` | A share-target utility with no metadata at all. |
| `/prof` | Publishes per-procedure clinic cost and margin structure. No metadata at all. |

`/forgot-password` and `/pay` take their directive from a **layout**, because a client
component cannot carry one. For `/forgot-password` that also matters because the AR and
RU pages import the client component from that path directly.

**None of these were added to robots.txt.** A crawler blocked from fetching a page can
never see its `noindex`, so anything that needs to *drop out* of the index has to stay
crawlable. Only pages that were never indexed belong in a `Disallow`.

`/prof` is noindexed rather than given a public title, because it exposes clinic margin.
If it is ever wanted as a B2B landing page, flip `index` and write it a real title first.

## ★ robots.txt only blocked the English private paths

robots.txt matches on prefix, so `Disallow: /cart/` never covered `/ar/cart/` or
`/ru/cart/`. Only the newsletter unsubscribe route had explicit locale entries. Every one
of the fourteen crawler blocks was letting bots walk the localized cart, checkout, login,
profile, favourites, tracking and PDF-viewer pages.

Each localized entry now has a `/*/<path>/` twin, which covers both current locales and
any added later. 135 rules added.

## Titles over the result limit

The root fallback was 72 characters and truncated in results — and it is what every page
without its own title inherits, so it has to stand alone. Now 48.

| Page | Was | Now |
|---|---|---|
| root fallback | 72 | 48 |
| `/products` | 68 | 44 |
| `/privacy-policy` | 75 | 43 |
| `/contact` | 62 | 52 |

**No `title.template` was added, on purpose.** 236 page titles across the three locales
already contain "GENOSYS", so a template would brand every one of them twice. This is
worth remembering the next time it looks like an easy win.

## x-default hreflang

`lib/seo.ts` emits `x-default` and the sitemap's alternates carry it, but 39 public pages
wrote their `languages` block by hand and listed only `en`, `ar` and `ru`. The page markup
and the sitemap were disagreeing about how to serve a visitor whose language we do not
publish.

Each `x-default` points at the English URL already declared in the same block. Private
routes were skipped — they are noindexed, so hreflang there signals nothing.

## Verified

- `tsc --noEmit` clean, `eslint` clean (21 pre-existing warnings, 0 errors), production
  build compiles.
- All seven routes now render `noindex`; `/`, `/products`, `/ar/products`, `/ru/products`
  and `/training` still render `index, follow`.
- `x-default` present on `/training`, `/ar/training`, `/ru/training`, `/terms`,
  `/skin-recommendation`, `/delivery`, `/partners`, `/locations`.
- Note that Next.js renders the attribute as `hrefLang`; HTML attribute names are
  case-insensitive, so crawlers read it correctly. A case-sensitive grep will say it is
  missing when it is not.

## Found but NOT fixed — worth a decision

These are real but need a judgement call or are lower value than the above.

1. **~30 files hardcode `https://genosys.ae`** in canonical and Open Graph URLs instead of
   using `buildUrl()`, bypassing `metadataBase`. Harmless today; breaks on preview
   deployments and any domain change.
2. **`LocalBusinessSchema.tsx` uses non-standard fields**: `address` and `geo` as arrays
   (schema.org expects one each), plus `hasCredential` and `memberOf`, which belong to
   `Person`. Google's validator will flag them.
3. **`ProductSchema.tsx`** puts `OpeningHoursSpecification` inside `shippingDetails.
   businessDays`. That type is for store opening hours, and it may suppress the shipping
   rich result.
4. **Most pages share one of two OG images**, so nearly every social preview is identical.
   Only product pages and English blog posts generate their own.
5. **AR and RU blog posts have no `opengraph-image.tsx`** — English does.
6. **`app/ar/option-sheet-preview/`** exists with no metadata and is not in the sitemap.
   Looks like a dev preview route; should probably be removed or noindexed.
