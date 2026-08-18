# The wordmark sat on a white sticker

Reported from the footer: the logo did not blend with the cream background.

## Cause

`/Logo/upLOGO.png` is **100% opaque with pure white corners** — the alpha channel exists
but nothing in it is transparent. It is also 1186 × 482 while the wordmark itself occupies
only 1009 × 203 of that, so **58% of the file's height is empty white padding**. Invisible
on a white header; on the cream footer (`rgb(250, 248, 247)`) it read as a white rectangle
with a small logo inside it.

The declared dimensions were wrong everywhere too — the footer said `180 × 54` (ratio
3.33) for an image whose real ratio is 2.46, so the rendered height was never what the
markup implied.

## Not a new problem

`MobileWebHeader.tsx` already carries a comment about this, and the August mobile-web work
swapped that one header to `/images/genosys-wordmark-transparent.png`. That asset is a
**different lockup** — black rather than slate grey, and it carries the ® mark — so using
it in the footer would have changed the mark rather than fixed the background. Four other
surfaces were still on the opaque file.

## Fix

`scripts/make-logo-transparent-20260818.py` trims the padding to the content bounding box
and keys out the white, leaving RGB untouched so the slate and red are exactly as drawn.
Alpha ramps between `min(r,g,b)` 250 and 238 rather than using a hard threshold, so the
anti-aliased letter edges stay smooth — checked against mid-grey, where any white fringe
would be obvious, and there is none.

Output: `/Logo/upLOGO-transparent.png`, 1009 × 203, 72.7% fully transparent, and 33%
smaller than the original (32.8 KB against 48.7 KB).

**New filename on purpose.** `/Logo` and `/images` are served with long cache lifetimes,
so replacing an asset in place would leave repeat visitors on the stale white-boxed copy.

## Applied

| File | Was | Now |
|---|---|---|
| `components/footer/Footer.tsx` | `180×54`, `w-[160px]` | `1009×203`, `w-[150px]` |
| `components/header/HeaderMobileIcons.tsx` | `120×36`, `w-[120px]` | `1009×203`, `w-[110px]` |
| `components/header/HeaderRussianMobile.tsx` | `120×36`, `w-[120px]` | `1009×203`, `w-[110px]` |
| `components/pwa/PWAHeader.tsx` | `260×75`, `h-[50px]` | `1009×203`, `h-[22px]` |

Sizes were re-picked so the **wordmark** stays roughly the size it was rather than the
file. This matters most in the PWA header, which sized by height: at `h-[50px]` the old
file rendered 50px of mostly padding with a 21px wordmark inside it, so keeping that class
with a trimmed asset would have made the logo two and a half times larger.

The footer's `placeholder="blur"` and its JPEG `blurDataURL` were also removed. A blur
placeholder paints a solid rectangle behind the image while it loads, which is the white
box again for as long as it is on screen — wrong for a transparent logo, and pointless for
a 33 KB lazy-loaded asset.

## Left alone

`app/api/skin-analysis/report/route.ts` still references the original file. That is an
emailed HTML report rendered on white, where the opaque background is invisible and the
absolute URL has to keep resolving for existing sent reports.

## Verified

`tsc --noEmit` and `eslint` clean; the asset serves 200 as `image/png`; composited against
the footer's exact background colour and against mid-grey with no halo.
