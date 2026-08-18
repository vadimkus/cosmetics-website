# Favorites page — editorial rework

Three things were asked about the empty state: the breadcrumbs, the unicorn, and whether
the page held up editorially.

## Breadcrumbs — there were two navigations to the same place

The page rendered a `PageBreadcrumb` (`Home › Favorites`) and then, directly beneath it, a
`← Back to Home` link. Two controls to the same destination, stacked. The breadcrumb is
the one that belongs on a brand page — every bespoke product page uses it alone — so the
back link is gone from both the empty and the populated state.

It only ever showed on desktop; PWA and mobile web have their own header with a
context-aware back button, which is untouched.

There is a comment in this file recording that the breadcrumb block itself used to be
duplicated. That was already fixed; this is the second layer of the same problem.

## The unicorn

`/images/avatar/uni.png` is **100% opaque with pure white corners** — the same defect as
the wordmark fixed earlier today. It was invisible because the illustration sat on a white
card. The moment the card comes off, the white rectangle shows.

**A naive white-key would have destroyed it**, because it is a *white* unicorn — a
threshold on "how white is this pixel" punches holes straight through the animal. So
`scripts/make-asset-transparent.py` finds the background by flood-filling inward from the
border and never touches anything enclosed by artwork. Alpha feathers across the near-white
band so the edges stay smooth, and RGB is untouched, so the greys and the yellow stars are
exactly as drawn. Checked by compositing on strong red, where a halo or a punched-through
body would be obvious; neither is there.

`/images/avatar/uni-transparent.png` — 1420 × 1277 after trimming, 70% fully transparent.
New filename, because these paths are served with long cache lifetimes.

**Bigger:** the empty state went from a fixed 180 px to a fluid `max-w-[300px]` on mobile
and `max-w-[380px]` on desktop, rendering at 380 × 342. The delisted-products state gets
the same illustration at 220 px, replacing a 60 px mobile-only image and a desktop heart
icon — those were two different empty states for what is nearly the same situation.

Note it reads as a pale watermark against cream rather than the strong illustration it was
on white. That is the trade for blending, and it is the intended effect.

## Editorial

The empty state was a white rounded card floating on the cream page, with a rose pill
button — the pre-editorial house style. It now follows the same pattern as the bespoke
product pages and the reworked cart and profile:

| | Was | Now |
|---|---|---|
| Container | `bg-white rounded-xl` card | none — sits on the cream page |
| Label | — | `cera-eyebrow` |
| Heading | 24/34px | `cera-serif` 30/38/46px |
| Primary action | rose pill, `rounded-xl` | `ed-cta` — ink, fully rounded |
| Sign-in | a text link on its own line | `ed-ghost` button, paired with the primary |
| Width | `max-w-md` | `max-w-[560px]`, copy capped at `42ch` |

The sign-in nudge was a small link buried under the button. It is now a proper secondary
action beside the primary, with the "syncs across devices" line demoted to a note beneath —
worth offering, since favourites live in local storage for guests and do not survive a new
device, but not worth demanding.

**One layout bug found while checking:** the page wrapper had no minimum height on
desktop, so with the short empty state the cream stopped mid-page and a band of body white
showed between the content and the footer. Now `min-h-[72vh]`.

## Verified

`tsc --noEmit` and `eslint` clean. Rendered at 2× — the unicorn loads (380 × 342, opacity
1), the cream runs to the footer, and the breadcrumb is the only route home.

## Not done

`uni.png` is still used by the cart, the orders page and the profile order history, all on
white cards where the opaque background is invisible. They would each benefit from the
transparent asset if those cards ever come off, but nothing is visibly wrong there today.
