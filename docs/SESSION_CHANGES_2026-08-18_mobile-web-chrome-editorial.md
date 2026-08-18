# Mobile web header and tab bar on the editorial system

Date: 18 Aug 2026
Commit: `2a761a93`
Scope: **mobile web only** — the PWA tab bar was deliberately left alone.

## Files

| File | Change |
|---|---|
| `components/header/MobileWebHeader.tsx` | Three-column grid, 44px targets, editorial palette, AI link and tagline removed, transparent wordmark, menu panel restyled |
| `components/footer/MobileWebFooterNav.tsx` | Editorial colours, active rule, uppercase micro-labels, `aria-current` |
| `components/footer/mobileBottomNavShared.tsx` | Added `MOBILE_WEB_NAV_COLORS`; left `MOBILE_BOTTOM_NAV_COLORS` for the PWA |
| `app/globals.css` | `.mobile-web-footer-nav`: cream + hairline, safe-area inset, 80px → 58px + inset |

## Measured defects, before and after

| | Before | After |
|---|---|---|
| Wordmark offset from centre | +22px | 0px (all three locales) |
| Header height | 78px | 57px |
| Tab bar height | 80px (no safe-area inset) | 58px + `env(safe-area-inset-bottom)` |
| Chrome as share of an 844px screen | 158px / 18.7% | 115px / 13.6% |
| Controls under the 44px minimum | 4 of 6 | 0 |

The wordmark was off-centre because it sat in a flex row grouped with the heart, so the
flanks never balanced. A three-column grid with the wordmark alone in the middle centres it
regardless of what the flanks weigh.

The 44px figure is Apple's HIG minimum and WCAG 2.5.5. The language button and the heart
were 32px tall; the AI link was 30×32.

## Two things removed rather than restyled

**The bare red "AI".** It was a duplicate — the hamburger already carries the same
destination as a labelled "AI Skin Analysis" CTA, which is legible where two red letters
were not. Checked before removing.

**"Premium Skincare & Beauty".** Moved into the menu panel as an eyebrow. It is a one-off
brand statement and it was charging a permanent row on every screen of a 390px phone for it.

Language stayed in the header. Unlike the AI link it has no other entry point on mobile web,
and for a trilingual UAE site it needs to stay discoverable — so it was quieted rather than
buried.

## Colour

The old chrome had no hierarchy: green on the language switcher, red on the AI text, the
heart, the avatar and the active tab, then green again when the cart had items. The loudest
element on the left was the least important control.

Now ink for structure, rose for the single accent. Green is kept only where it reports
status, on the signed-in dot — the same call made across the account area.

The tab bar also gains a 2px ink rule above the active tab. Colour alone fails WCAG 1.4.1,
and the old scheme leaned on red against green specifically, which is the most common
deficiency pairing. The green "cart has items" icon colour went away because the rose count
badge already carries that signal.

## Three fixes that fell out of the work

1. **The wordmark asset.** `/Logo/upLOGO.png` has an opaque white rectangle and a band of
   dead padding baked in. Invisible on a white header, an obvious white sticker on a cream
   one. Swapped for `/images/genosys-wordmark-transparent.png`, already in the repo.
2. **The menu panel offset.** It already assumed a 56px header (`env(safe-area-inset-top) +
   56px`) while the header was actually 78px, so the panel's top 22px sat behind the header.
   Correct now that the header really is 56px.
3. **The missing safe-area inset.** The tab bar hard-set 80px with a flat 10px of bottom
   padding and never read `env(safe-area-inset-bottom)`, so on a phone with a home indicator
   the labels crowded it.

## Consequence worth tracking

The mobile web tab bar and the PWA tab bar now look different — ink/rose versus the iOS
red/grey. That was the deliberate reading of "mobile web only", and the installed app is a
defensible place to keep platform-native colour. If the two should match, the PWA variant
needs the same treatment and the shared `MOBILE_BOTTOM_NAV_COLORS` can then collapse into
one set.

## Not touched

- The desktop header (`components/header/Header.tsx`) and desktop footer
  (`components/footer/Footer.tsx`), which returns `null` below 768px anyway.
- `components/footer/MobileFooterNav.tsx` (PWA), per the scope above.
- The floating chat widget, which still overlaps content near the Bag tab.

## Verification

Typecheck clean, no lint errors, 490 tests across 68 suites, clean production build. The
header, tab bar, open menu panel and language dropdown were each screenshotted at 390×844
with an iPhone user agent in English, Arabic and Russian; Arabic mirrors correctly.

Note for anyone re-running this: a CSS edit to `globals.css` did not reach the browser until
the dev server was restarted and `.next/dev` cleared. Measurements taken before that showed
the old 80px white bar and were misleading.
