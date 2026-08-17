# Session Changes — 2026-08-17 — homepage reworked onto the editorial system

## What was asked

Rework `https://genosys.ae/` with the editorial design, the same system the six
brand pages moved onto on 16 Aug (`SESSION_CHANGES_2026-08-16_SIX_PAGE_EDITORIAL_REWORK.md`).

## What the homepage was

Seven sections, and between them:

- **three serif stacks** — `Georgia` inline on the category rail and the concern
  tiles, `"Times New Roman"` inline on Why GENOSYS, Tailwind `font-display`
  (Inter) bold on the hero and the two product rails
- **five accent colours** — `primary-600`, `#a52f35`, `#b5252e`, `#9c343b`, and a
  gold pair `#9c742e` / `#a77a2d`
- **four creams plus a dark slab** — `gray-50`, `#f8f3ec`, `#fffefa`, `#f4efe8`,
  and `gray-950` under the newsletter
- **eight more colours** in the concern grid, one per tile: gold, green, purple,
  blue, teal, pink, blue again, gold again
- an inline `<style>` block inside `SkinConcernSection` holding the responsive
  grid, addressed by `[data-testid=...]` selectors

Nothing was broken. It just did not read as one site, and it did not read as the
same site as the product and brand pages.

## What it is now

Root of all three locale pages:

```tsx
<div className={`cera-page genosys-page genosys-home ${ceraSerif.variable} …`}>
```

`cerabarrier.css` gives the structure, `editorial.css` the house palette and the
shared components, and a new `components/home/home.css` holds the handful of
compositions only this page needs: the cream/white band rhythm, the product-rail
card, the tile with its image scale and RTL-mirrored wash, and the newsletter's
input-plus-button pill.

Section by section:

| Section | Before | After |
|---|---|---|
| Hero | Inter bold, two outlined red buttons, boxed 3-up credential grid, CTAs below the visual | Serif h1, `ed-cta` + `ed-ghost`, hairline-divided figures, CTAs above the visual |
| Bestsellers | grey card, red price, emerald in-stock chip | `home-product-card`, `cera-numeral` price, neutral chip with an emerald dot |
| New arrivals | same card on `gray-50` | same card on the cream band |
| Category rail | `#f8f3ec` band, Georgia, diamond divider | white band, `cera-serif`, divider dropped |
| Shop by concern | `#fffefa`, Georgia, gold, eight tile colours | cream band, `cera-serif`, one `ed-mark` treatment |
| Why GENOSYS | `#f4efe8`, Times New Roman, hard-coded card shadows | white band, `cera-serif`, `cera-card` |
| Newsletter | dark `gray-950` slab, mono kickers, radial pink glow | `ed-panel` with the seal motif, `ed-field` pill, `ed-cta` |

Behaviour is untouched throughout: the scroll reveals, the newsletter POST with
its honeypot and its rate-limit/already-subscribed/error states, auth-gated
pricing, the server-computed product counts, the PWA login branch, the login
modal, the 3D hero visual and every `data-testid`.

## Two calls worth recording

**The eight concern colours went.** Sun gold, acne green, pigmentation purple and
so on — no rule a reader could infer, which is the same thing `/contact` had with
its six differently-coloured channel tiles. The icon already distinguishes the
concerns. `SkinConcernCard.accent` stays on the type because the concern pages
read it; only the homepage tile stopped using it.

**Green stayed where it means something.** The saving percentage on a discounted
rail card is information, not decoration, so it keeps `emerald-700` rather than
flattening into the house red — the call `/orders` made for its status badges.

## The font

`ceraSerif` was declared with `preload: false`, because at the time only product
66 rendered it and `/products/[id]` is shared by the whole catalog. The homepage
h1 is now set in it, so on a cold load the largest text on the site's most-visited
route painted in the Georgia fallback and swapped a beat later. Flipped to
`preload: true`; the premise that made it not worth preloading no longer holds
now that most of the catalog has a bespoke page.

## Tests

Two assertions had to move, both pinning things that are not behaviour:

- `WhyGenosysSection.test.tsx` asserted `toHaveClass('bg-[#f4efe8]')`. Replaced
  with a presence check. The content assertions around it are untouched.
- `ProductQuickFactsHelper.test.tsx` asserted product 41 shows
  `'>60% moisture essence'` and `'9 regenerating peptides'`. **This was already
  failing on HEAD**, unrelated to this rework: the 16 Aug dossier audit removed
  both claims from the catalog — water is about a quarter of that formula, and
  the peptides run 640 ppb down to 10 ppb — and the test was never updated with
  it. Now asserts the verified facts and adds negative assertions so neither
  claim can come back.

## Verification

- `tsc --noEmit` clean, no lint errors on any touched file.
- `npm run build` compiled successfully.
- Full jest suite: **68 suites, 490 passed, 3 skipped, 0 failing.**
- Checked `/`, `/ru` and `/ar` in the browser at desktop width. All sections
  render, all rail and tile images resolve, Arabic mirrors correctly including
  the concern-tile wash and the arrow directions, and Russian does not overflow.
- Confirmed via computed style that all eight `h1`/`h2` on the homepage resolve
  to Cormorant Garamond — an early screenshot caught the page mid font-swap and
  looked like one heading had been missed.

## Note for whoever is next

Three pages reworked on 16 Aug — `/skin-recommendation`, `/training`, `/blog` —
still carry their own copies of the palette instead of importing `editorial.css`.
They can migrate whenever someone is in there. Nothing new should.
