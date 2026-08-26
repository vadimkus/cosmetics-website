# Mobile web: rearranging the sticky buy bar

**Date:** 26 Aug 2026
**Scope:** the 51 bespoke product pages (`components/product/*/…ProductPage.tsx`), mobile web only

## What was wrong

Two separate faults in the same bar, both visible on a phone.

**The information stacked into a column and left half the row empty.** The
per-unit price, the total and the pack size each took their own line down the
left edge:

```
4 × 250.00
1000.00 AED
50g
[− 4 +]  [ Choose your shade ]  [♡]
```

**The button's label wrapped inside a fixed-height pill.** The action row held
the stepper (118px), the button and the favourite. At 390px that left the button
146px, and "Choose your shade" needs 166px. `h-12` is a fixed height, so the
label wrapped to two lines and spilled over the pill's top and bottom edges. At
360px the button got 116px, and the Russian and Arabic labels are longer again.

## What it is now

```
4 × 250.00                              ┌─────────┐
1000.00 AED              50g            │ −  4  + │
                                        └─────────┘
[         Choose your shade         ]   [♡]
```

Two changes, applied mechanically to all 51 pages since they share one wrapper:

1. **The pack size moved onto the price line**, pushed to the far end. Three
   lines become two, and the width that was already there gets used.
2. **The button has its own line.** A zero-height `w-full md:hidden` element is
   a flex-wrap line break: it costs nothing vertically and forces the button and
   the favourite onto their own row. The button now gets 246px at 360px and
   276px at 390px, so no label in any of the three languages has to fit into
   whatever the stepper and the favourite leave over.

The stepper moved up to share the information row, which is why the bar only
grew from 102px to 134px rather than gaining a whole row.

Desktop is untouched: the wrapper keeps `md:flex-none`, the line break is
`md:hidden`, and the bar stays a single 73px row.

## Details worth keeping

- The pack size is `min-w-0 max-w-[52%] shrink truncate` — it yields space to
  the price and ellipses rather than wrapping the bar taller.
- The shade line (products 52 and 63) is a flex row of swatch plus name.
  `truncate` cannot ellipsis a flex container, so the clamp sits on the
  container (`overflow-hidden`) and the ellipsis on the text span inside it.
  The swatch gained `shrink-0` or it would have been squeezed with the name.
- The information wrapper is `flex-1`, not `w-full`. `w-full` is what pushed the
  stepper down onto the button's row in the first place.

## Verified

Measured in a real browser at 360, 390 and 430px, signed in and logged out, in
English, Russian and Arabic:

- No button's `scrollHeight` exceeds its `clientHeight` any more — nothing
  spills out of a pill in any language.
- Two rows on mobile, one on desktop.
- RTL mirrors correctly: stepper on the left, price on the right, 12px gaps,
  no overlap between any two children.

Jest (1,321 passed), eslint and a production build are clean.
