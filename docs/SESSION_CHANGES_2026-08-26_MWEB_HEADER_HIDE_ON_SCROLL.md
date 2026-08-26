# Mobile web: headers now step aside on scroll, like the app

**Date:** 26 Aug 2026
**Scope:** mobile web only (`display-mode: browser`, ≤767px)

## The inconsistency

The app hides its header on every scrolling screen — 28 of them, the shop tab
included — through `useCollapsibleHeader({ hideOnScroll: true })`. On mobile web
only the product page did. Measured on the live site before the change:

| | at top | scrolled down | scrolled up |
|---|---|---|---|
| products list | `top: 10` | `top: 10` | `top: 10` |
| product page | `top: 10` | `top: -58` | `top: 10` |

The site header is `fixed` with no scroll handling at all, so it sat over the
grid permanently. The product page bar had been given the behaviour on its own,
in its own component, which is how the two drifted apart.

## What changed

One hook, `hooks/useHideOnScroll.ts`, now owns the rule, and every bar uses it:

- `components/header/MobileWebHeader.tsx` — the products list and every other
  standard page.
- `components/product/PdpLocaleBar.tsx` — product pages and articles. Its local
  copy of the logic moved into the hook unchanged.
- `app/blog/BlogPageClient.tsx` and `app/blog/[slug]/BlogPostClient.tsx` — the
  blog index and articles, which the app also hides.

Movement lives in one CSS class, `.mweb-hide-on-scroll`, with the app's timings:
180ms to leave, 220ms to come back, quad-out easing. Leaving is quicker than
arriving, so getting out of the way feels immediate while the return does not
snap.

## Where the web version departs from the app, and why

The app compares each scroll event to the last and ignores deltas under 10px.
That works on a flung native list, which reports large jumps. A deliberate drag
on a web page arrives as two or three pixels per frame and never clears a ten
pixel gate — a direct port simply never moves. The web version accumulates
travel since the last change of direction instead, which keeps the same feel for
a flick and still answers a slow drag.

`__tests__/hooks/useHideOnScroll.test.ts` carries a copy of the app's
`shouldHideHeader` and asserts the two agree step by step on flick-sized
movement, plus both hard rules: never hidden within its own height of the top,
and state held below the threshold.

## Detail worth keeping

- The hide distance is measured, not assumed — the bar's height plus its
  computed `top`, which covers both the fixed header and the sticky bars, and
  picks up the safe-area inset without naming it.
- Deliberately not `offsetTop`. On a *stuck* sticky element that reports the
  shifted position, so the dead zone grows with the scroll and stays permanently
  ahead of it. The bar then never moves, which is the bug this replaced.
- The header holds still while its hamburger or language menu is open, since
  both panels are anchored to it and would otherwise be left behind.

## Verified

In a real browser at 390px, dragging six pixels a frame rather than jumping:

| | at top | dragged down | dragged up | back at top |
|---|---|---|---|---|
| products list | `10` | `-58` | `10` | `10` |
| product page | `10` | `-58` | `10` | `10` |
| home | `10` | `-58` | — | — |
| blog index | `10` | `-70` | `10` | `10` |
| blog article | `0` | `-61` | `0` | `0` |

Every bar clears the screen completely and comes back to where it started, and
the header held at `10` through a 600px scroll with the language menu open.
Jest, eslint and a production build are clean.

The floating bars rest 10px down and hide by their height plus that offset; the
article bar sits flush on the edge and hides by its height alone. That is why
the extra offset in the CSS is scoped to `.mobile-web-header` and
`.mweb-float-sticky-top` rather than applied to everything that hides.

## Not changed

The article bar is still a flat white band with a bottom border, where the blog
index, the product bar and the site header are floating cream bars with rounded
corners. It hides correctly now, but it is the one piece of mobile web chrome
that never got the floating treatment.
