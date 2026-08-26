# Product page header no longer covers the photograph

26 Aug 2026 — mobile web and the mobile app, reported together.

## What was wrong

Both platforms float a bar over the top of the product page. On both, the
photograph ended up behind it.

**Mobile app.** The gallery began at the very top of the scroll view and the pill
floated over it, so at rest the top of every packshot sat behind the controls.
Worse on the claim slides, which are artwork with a headline across the top: the
bar took the first line of the claim with it.

**Mobile web.** `PdpLocaleBar` is `position: sticky`, so nothing overlaps at rest,
but everything scrolls underneath it. Measured on `/products/11` at iPhone 13
width, the bar covered the stage by 58px from roughly 150px of scroll onward —
the cap of the bottle was cut off for the whole length of the page.

## What changed

### App — reserve the pill's footprint

`utils/pdpHeaderGeometry.js` (new) owns the relationship between the pill and the
gallery, because that relationship is the bug and it is invisible in the layout:
the pill is absolutely positioned, so nothing stops the photograph sliding under
it. The screen now takes `headerTop`, `hideDistance` and `galleryTopInset` from
one place, and reserves `galleryTopInset` of stage-coloured headroom above the
gallery.

`SafeAreaView` on that screen now takes `edges={['left', 'right']}`. Both bars
already place themselves from `insets`, and the scroll content already pads past
the footer, so padding top and bottom on the container as well applied the same
inset twice — and, more importantly, left the headroom depending on whether
absolute children read that padding, which is version-dependent in Yoga and
cannot be reasoned about from the file. Every vertical measurement on the screen
is now taken from the top of the window.

The title hand-off (`titleFadeIn`) moves down by the same inset, so the product
name still joins the pill exactly as the photograph leaves the screen.

### Web — the bar steps aside on the way down

`PdpLocaleBar` now hides when you scroll into the page and returns when you
scroll up, which is what the app does. At rest it is above the picture, and while
you read down it is gone, so the photograph is never behind it.

Two details are worth keeping:

**The threshold is measured from the last change of direction, not frame to
frame.** The app compares consecutive scroll events and gets away with it because
a flung native list reports large jumps. A deliberate drag on a web page arrives
as two or three pixels per frame, which never clears a ten pixel gate — the first
version of this simply never moved. `nextBarState` accumulates travel since the
turning point instead, which keeps the same feel for a flick and also responds to
a slow drag.

**The dead zone near the top is not measured with `offsetTop`.** On a *stuck*
sticky element `offsetTop` reports the shifted position, so it grows with the
scroll; the "don't hide near the top" zone stayed permanently ahead of the scroll
position and the bar never hid. It now uses the bar's height plus its computed
`top`, both of which are stable.

## Residual behaviour, stated plainly

Scrolling back up brings the bar back over whatever is beneath it — measured at
28px over the stage. That is inherent to a floating bar that returns on scroll-up,
it is what the app has always done, and both platforms now behave identically. If
that is unwanted, the alternative is a bar that scrolls away for good, which
costs the persistent back and language controls.

## Verification

- `nextBarState` unit tests: `__tests__/components/pdpLocaleBar.test.ts`, including
  the slow drag and the rubber-band bounce.
- App geometry: `npm run smoke:pdp-header-clearance`, across six safe-area inset
  profiles from no notch to Dynamic Island, plus assertions that the screen
  actually applies the headroom and is not padding edges it should leave alone.
- Playwright on `/products/11` at iPhone 13 width: bar covers the stage by 0px at
  rest, 0px while reading down (hidden), 0px back at the top.
- Full suite: 1321 jest tests, 0 lint errors, production build clean.

No iOS simulator was available in this environment, so the app change is verified
by geometry and smoke tests rather than by screenshot.
