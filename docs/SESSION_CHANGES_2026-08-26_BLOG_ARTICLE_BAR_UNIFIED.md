# One blog article bar for all three languages

Date: 26 Aug 2026

The same article page had a different bar depending on the language it was read in.

Each locale has its own article client:

- `app/blog/[slug]/BlogPostClient.tsx` (English)
- `app/ar/blog/[slug]/ArabicBlogPostClient.tsx`
- `app/ru/blog/[slug]/RussianBlogPostClient.tsx`

The bar lived *inside* the English one. The other two render their own body rather than
going through it, so they reached for `PdpLocaleBar` — the product page's bar — which
carries a back link and a language control but **no account avatar**. An Arabic or Russian
reader had no way to reach their profile from an article.

The English bar was never English-only: its back label has always carried all three
translations (`المدونة` / `Блог` / `Blog`). It simply had no way of being used from the
other two routes.

## What shipped

`components/blog/BlogArticleBar.tsx`, lifted out of `BlogPostClient` unchanged. All three
clients render it. `BlogPostClient` keeps its wrapper role for the English body and is now
28 lines instead of 75.

Nothing about the bar's appearance or behaviour changed for English readers. Arabic and
Russian gain the account avatar and lose the product-page bar.

The blog *index* was already shared — all three locales route through `BlogPageClient`.
Only the article had diverged.

## Verification

- Playwright at 390×844, all three locales: `.blog-article-bar` present, floating at
  inset 10px with a 22px radius, avatar and presence dot rendering, dot mirrored to the
  left under `dir="rtl"`
- `localeSwitchCoverage.test.ts` updated: instead of pinning that Arabic and Russian use
  `PdpLocaleBar`, it now asserts all three article routes render `BlogArticleBar` and none
  of them renders `PdpLocaleBar`
- Full suite 1331 passed, production build clean

## Not changed

Under `dir="rtl"` the back control still sits on the left rather than the right, because
the bar applies `flex-row-reverse` on top of a container that is already reversed. That
behaved identically with `PdpLocaleBar`, so it is not a regression — but it is wrong, and
it is worth its own pass across all the mobile bars that do this.
