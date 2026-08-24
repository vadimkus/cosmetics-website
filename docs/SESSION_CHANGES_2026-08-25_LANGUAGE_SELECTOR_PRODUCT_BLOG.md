# Language selector on product and blog pages — 2026-08-25

## The bug

Desktop was fine. On a phone, opening any product page or any article removed
the language switcher from the screen entirely.

`lib/simpleHeaderPages.ts` returns true for `/products/[id]` and anything
containing `/blog`, and all three site headers — `Header`, `MobileWebHeader`,
`PWAHeader` — return `null` on those routes, on the assumption that the page
ships a header of its own. Two things were wrong with that assumption:

- The ~60 bespoke editorial product layouts open on artwork and have no top bar
  at all, only an inline breadcrumb. Nothing to tap.
- The shared product page and the English article page do have a bar, but
  neither carried a language control.

Desktop escaped because `Header` only bows out on those routes in PWA mode.

A second, separate fault: `PWAHeader` called `switchLocaleHardNav(l, '/')` with
a hard-coded path, so changing language in the installed app always threw the
reader back to the homepage, whatever they had been reading.

## Web

New `components/LocaleSwitchInline.tsx` — a bordered pill with a globe and the
locale code, sized for a thumb and painted in the cera tokens the light bars
use. `LanguageSwitcher` could not be reused: it is a bare `EN` in green sized
for a dense desktop icon row and disappears against these bars.

New `components/product/PdpLocaleBar.tsx` — a mobile-only sticky bar (back link
plus the pill) for pages that render no bar at all. `md:hidden`, because desktop
still has the site header and does not need a second control.

Wired in:

| Surface | Change |
|---|---|
| Bespoke product layouts (all locales) | `PdpLocaleBar` added at the single dispatch point in the three `products/[id]/page.tsx` routes, covering ~60 products without touching their components |
| Shared product page | Pill added to the existing app-like bar |
| Blog article, English | Pill replaces the "Article" label, which told the reader nothing |
| Blog article, AR and RU | `PdpLocaleBar` — these routes bypass `BlogPostClient` and had no bar |
| Blog list | Pill added beside the profile avatar |
| `PWAHeader` | Passes `pathname` instead of `'/'` |

Also fixed in passing: `BlogPostClient` gated its bar on `isMobileWeb`, which
excludes the installed PWA, so PWA readers got no bar at all on an article. It
now uses any narrow viewport.

## Mobile app

New `components/LocaleSwitchButton.js` — compact globe + locale pill opening a
bottom sheet.

Added to the product screen header (beside share and favourite), the blog
article header and the blog list header. On the two blog screens it takes the
slot the refresh icon had, which duplicated pull-to-refresh.

The language existed only at Profile > Language, so changing it meant leaving
what you were reading, navigating two screens, and finding your way back. On the
screens that actually carry translated copy, almost nobody would.

English and Russian apply in place — all three screens list `locale` in the
effect that fetches their content, so the copy is refetched and swaps under the
reader. Arabic restarts the app, because `I18nManager.forceRTL` only applies
before the React tree mounts, so it asks first rather than yanking the screen
away.

The mobile API was already locale-aware (`x-locale` on
`/api/mobile/blog`, `/api/mobile/blog/[slug]` and the product endpoints), so no
backend change was needed.

## Verified

Playwright at 390 px and 1280 px across six routes: the control is visible on
every phone route and hidden on every desktop one. Clicking through confirmed
`/products/8` → `/ru/products/8`, `/ru/products/8` → `/ar/products/8` and the
blog equivalent all keep the reader on the same page. Arabic mirrors correctly.

`__tests__/lib/localeSwitchCoverage.test.ts` pins both halves: that these routes
are header-less, and that each one now renders a control. It also fails if
anyone puts the literal `'/'` back into the PWA switcher.

Production build clean, 314 existing lib tests still pass.
