# Mobile web: the article bar joins the floating chrome, and back-to-top stops sitting on the buy bar

Date: 26 Aug 2026

Two unrelated things, both on mobile web.

## 1. The article bar was the last flat one

Every other piece of mobile web chrome had been given the floating treatment: a cream bar
inset from the edges, rounded corners, a hairline border and a soft shadow. The blog
article bar was still a flat white band pinned edge to edge with a bottom border — the one
piece that never came across.

It now carries `mweb-float-sticky-top`, cream at 95% with a backdrop blur, matching the blog
index bar it sits one tap away from.

The notch handling moved from an inline style to a `.blog-article-bar` class, following the
precedent already set by `.pdp-locale-bar`:

- Installed as a PWA the bar sits flush on the top edge, so it carries
  `max(env(safe-area-inset-top), 12px)` and clears the notch itself.
- In the browser it floats, the notch is already in the gap above it, and the padding
  returns to the symmetric `py-3` the rest of the bar uses.

An inline style could not have done this, since it would have won against the media query.

Hide-on-scroll is unaffected — and now that the bar floats, it picks up the floating
variant of the hide transform automatically, which accounts for the inset and the notch as
well as its own height.

## 2. Back-to-top was landing on the buy bar

The control measures whatever bottom bar is on screen and sits above it. It was looking for
one class, `.mweb-float-bottom`, which is what the 51 bespoke product pages use.

Products 1, 2, 26 and 54 have no bespoke page and fall through to the generic one, which
uses a **sticky** bar, `.mweb-float-sticky-bottom`. The control never saw it, fell back to
its default offset, and landed exactly on the bar's top edge — measured clearance was 0px.

Two fixes:

**It now looks for both.** `BOTTOM_BARS` covers the fixed and the sticky bar.

**It measures from the bar's top, not its height.** A floating bar is inset from the bottom
edge, and that inset counts as part of the distance. Capping the measurement at the bar's
height threw the inset away and left 6px of clearance where 16 were intended. Measured
after the change: 16px on the generic page (was 0), 16–17px on the bespoke pages (was 6).

A bar that has left the bottom edge is skipped. A sticky bar reaches the end of the page
and travels up with the content, at which point it is not in the way and pushing the
control up to meet it would be wrong.

It also re-measures on `transitionend`. Bars slide into place after the scroll that
triggered them has stopped, so measuring on scroll alone can read one mid-slide and leave
the control at a height that was only ever true in passing.

## Verification

- Playwright at 390×844, EN and AR:
  - article bar floats (inset 10px, 22px radius, cream, shadow), symmetric 12px padding,
    still hides on the way down and returns on the way up
  - back-to-top clearance: product 1 (generic/sticky) 16px, products 36 and 63
    (bespoke/fixed) 16px and 17px
- `ScrollToTop.test.tsx` grew from 2 tests to 5, covering both bar kinds and a bar that has
  left the edge
- Full suite: 1326 passed
- Production build clean

## Not done

The article bar's account avatar is a black circle where the blog index's is red. That
predates this change and is a separate inconsistency.
