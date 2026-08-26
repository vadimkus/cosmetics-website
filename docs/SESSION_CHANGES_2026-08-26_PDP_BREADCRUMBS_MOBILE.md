# Breadcrumbs off the phone on product pages (2026-08-26)

Asked whether the breadcrumb trail on mobile web was any good, given the header
already carries navigation.

## It was not

On a phone, a bespoke product page showed a floating bar reading "← Products",
and directly beneath it `Home › All products › SKIN RENEWAL PEELING SYSTEM (S...`.

Three problems, in order of how much they cost:

1. **No new destination.** The only meaningful link in the trail is "All
   products" — where the bar's back arrow already goes.
2. **The last crumb is a worse copy of the heading.** Truncated, not a link, and
   repeated in full as the H1 a few hundred pixels below. It is not navigation.
3. **It costs a line above the fold** on the highest-value page on the site.

The usual counter-argument is SEO, and it does not apply. The `BreadcrumbList`
JSON-LD comes from `BreadcrumbSchema`, separate server-rendered markup. Verified
on the live page and again locally at both widths: the trail Google reads is
unaffected by whether the visual one paints.

Worth recording that the site had already decided this. The generic PDP wraps its
breadcrumb in `{!isAppLikeMode && ...}`, so it has been hidden on mobile web and
PWA all along. The 51 bespoke pages simply never got the memo.

## The trail lived in 52 places

`PageBreadcrumb`'s docstring calls it "the one breadcrumb on the site". It was
not: all 51 bespoke product pages hand-rolled their own `<nav
aria-label="Breadcrumb">` with the same two links, the same chevron and the same
truncated span. Bodies were identical apart from whitespace and one page showing
`displayName` instead of `product.name`.

So the 51 were migrated onto the component first, which turned the actual change
into one line. That also picked up two things the copies lacked: `aria-current="page"`
on the final crumb, and the responsive `max-w` that stops long product names
eating the row. `scripts/migrate-bespoke-breadcrumbs.js` is the record of the
migration; it is idempotent and now a no-op. Removing the copies also cleared
their dead `Chevron`, `ChevronLeft`, `ChevronRight` and `Link` imports — 789
lines deleted against 459 added.

## Hiding is opt-in, not the default

`hideOnMobile` drops both the nav and its band below `md` — the band too, or
hiding the trail would leave its top padding behind as a mystery gap.

It is deliberately not the default. The component has 164 callers, and at least
one of them needs the trail on a phone: login renders it inside a `lg:hidden`
row as the only wayfinding beside the language switcher, and a blanket rule would
have silently emptied that row. The principle is narrower than "no breadcrumbs on
mobile" — it is "no breadcrumbs where a floating back bar already covers it",
which is exactly the set of pages carrying `PdpLocaleBar`.

## Verification

`scripts/check-breadcrumb-visibility.js` loads a bespoke and a generic product
page at 390px and 1280px and asserts all three properties together: hidden on the
phone, shown on desktop, `BreadcrumbList` intact on both. All four combinations
pass.

`__tests__/components/bespokeBreadcrumb.test.ts` asserts each of the 51 pages
renders through `PageBreadcrumb`, passes `hideOnMobile`, and contains no
hand-rolled `aria-label="Breadcrumb"` — the last one is what stops the trail
drifting back out of the component.

Typecheck clean, lint clean (0 errors), production build clean, 1,312 tests
passing.
