# Buttons unified onto the cera palette — 31 Aug 2026

Reported as "some buttons are ink and some are cera". The home hero sat on
black while the app-store buttons a few centimetres below it were rose.

## Two forks, not one

**A second CTA colour.** `--cera-cta` has carried a comment saying it "fills
primary buttons, which used to be ink" since the cera pass. But two things never
got the memo:

- `.ed-cta` in `components/editorial/editorial.css`, the primary action on 19
  pages including the home hero, login, checkout, favorites and the order flow,
  still read `background: var(--cera-ink)` with a `#000` hover.
- `--brand-cta` in `globals.css` still held `#191716`, with a comment arguing
  for ink. It feeds the `--brand-red-*` aliases and the shared `Button`.

So two tokens claimed the same job and disagreed. Both now resolve to
`--cera-cta`.

**Four more palettes.** `.cera-page.genosys-page` redeclared the whole cera
block inside `editorial.css`. Nine of its ten tokens were the globals value off
by a digit or two, but `--cera-rose` was `#c0392f` and `--cera-rose-ink`
`#97281f` — a vivid red left over from when the house colour was red and only
the product pages were on cera. That class is on 85 pages, so the entire
shopping path, the blog and the footer were running on a red-tinted fork while
the product pages and the app ran on the real palette.

The same ten declarations, character for character, also sat in `blog.css`,
`training.css` and `skin-recommendation.css` under their own page classes. All
four are gone. The per-product stylesheets under `components/product/` still
declare `--cera-rose` in twenty-odd colours, and those stay: tinting the palette
to the product is the designed behaviour there, not a fork.

Fifteen shadows and one scanning gradient also spelled the old red out by hand
as `rgba(151, 40, 31, …)`, which survived the token removal. They now carry
`rgba(143, 90, 90, …)`, the same `#8f5a5a` in the rest of the palette. The one
that mattered visibly was the selected tile on the skin quiz, which was throwing
a red glow onto an otherwise rose page.

Then another 46 copies of the forked values in TypeScript, where a token cannot
be used or where someone wrote a `var(--cera-x, #fallback)` and pasted the wrong
palette's value into the fallback: the two mobile cart badges, the order-success
confetti, the cookie banner, the chat widget and the breadcrumb. All now hold
the globals value.

One of those was a real bug rather than tidying. The mobile cart badge was
`#c0392f` with a comment claiming it was `--cera-rose`. Had anyone believed the
comment and swapped in the real `--cera-rose`, white on `#c98b8b` is 2.78:1,
illegible at 10px bold in an 18px circle. It is `--cera-rose-ink` now, 5.56:1,
slightly better than the 5.43:1 the vivid red gave.

`npm run verify:tokens` could not catch it: it checks `globals.css` against
`design-tokens.json`, and this was a third copy hidden in a component
stylesheet. The declarations are deleted rather than corrected, because a second
copy of a palette is the thing that drifts. The class stays in the markup as a
hook if a brand-level tint is ever wanted again.

## What ink still does

Ink keeps the job it is good at: the state a filled button changes *to* —
added, saved, applied. Rose flipping to ink plainly registers as something
having happened, where rose flipping to a second rose would not. The same
reasoning that put confirmations on ink in the green-to-cera pass.

## Ad-hoc buttons swept

18 hand-written black buttons moved to the token: the app-store links in the
footer, mobile header and login modal, the 404 pages in all three locales, the
newsletter subscribe, the PWA sign-in, the two partner buttons and the
bundle-builder retry.

## Deliberately left black

- **Sign in with Apple** (`LoginModal.tsx:347`). Apple's guidelines require it.
- **Partner Access — Clinics** (`LoginModal.tsx:697`). A different audience and
  a secondary action; rose would put it level with the primary above it.
- **Image overlays** (`bg-black/25` through `/60`) on the gallery, the 360 spin,
  the brand page tiles and the desktop lab scenes. A scrim, not a button.
- **Admin tooling.** Internal, and not part of the customer palette.

## Contrast

White on `--cera-cta` is 4.55:1, on the `--cera-rose-ink` hover 5.56:1, and on
the new `#7d4e4e` pressed state 6.84:1. All pass AA.

## The app needed nothing

`utils/theme.js` already had `cta: '#9c686d'` for primary buttons. The website
was the outlier, so there is no OTA in this change.

## Verified

Read back from a production build with computed styles, not by eye: hero CTA
`rgb(156, 104, 109)`, footer store buttons the same, 404 the same, and
`--cera-rose` `#c98b8b` / `--cera-rose-ink` `#8f5a5a` on `.genosys-page`, which
is the forked red gone.

## Loose ends

`components/ui/Button.tsx` has no importers anywhere in the repo. It documents
itself as the replacement for "ad-hoc `bg-red-600`/`bg-primary-600` button
classes", which is exactly the problem this change had to fix by hand across 18
sites. Either adopt it or delete it; leaving it is how the next fork starts.

~~`npm run verify:tokens` only reads `globals.css`.~~ Done. The script now also
walks every stylesheet under `app/` and `components/` and fails if a `--cera-*`
declaration appears outside `globals.css`, which defines them, or
`components/product/`, which is allowed to retint them per product. Confirmed by
reintroducing a fork in `blog.css` and watching the check fail, then removing it
again. All four of these would have been caught on the day they were written.

The shadow tints still use `rgba(23, 20, 15, …)`, the forked ink, where the real
one is `rgb(25, 23, 22)`. Left alone deliberately: at 4% alpha the two are
indistinguishable, and there is no token for a shadow tint to point them at.
