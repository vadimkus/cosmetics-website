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

One hook, `hooks/useHideOnScroll.ts`, now owns the rule, and both bars use it:

- `components/header/MobileWebHeader.tsx` — the products list and every other
  standard page.
- `components/product/PdpLocaleBar.tsx` — product pages and articles. Its local
  copy of the logic moved into the hook unchanged.

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

Identical numbers on both, and the header held at `10` through a 600px scroll
with the language menu open. Jest (1,323 passed), eslint and a production build
are clean.

## Not changed

The blog index keeps its own sticky bar and does not hide, so mobile web is
consistent on the shopping path but not yet everywhere. The app hides its blog
header too; that one is still outstanding.
