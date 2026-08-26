# A quantity stepper in the floating buy bar (2026-08-26)

Reported from mobile web: you cannot order five or six of something from the bar
at the bottom of a product page.

## What was wrong

The hero has a quantity stepper. The floating bar that replaces it once you
scroll past does not — it only had a price, an Add to bag button and the heart.
`handleAdd` adds whatever `quantity` holds, and `quantity` is whatever the hero
stepper was left at, so from the bar alone the answer was always one.

The bar did grow a `− n +` control, but only *after* the first add, when it
switches to the green in-bag state. That is too late to be discoverable, and it
means the price can never preview what the order will actually cost.

The mobile app already fixed this; its stepper is commented "web PDP parity",
which the web had quietly lost.

## What changed

`CeraStickyQuantity` in `CeraPrimitives.tsx`, dropped into all 51 bespoke product
pages between the price and the buy button. It renders while the item is not yet
in the bag, is in stock, and someone is signed in — the same conditions that
decide whether the Add to bag button is the live control.

The bar's price now multiplies. This is the part that mattered most: adding a
stepper without it would have recreated exactly the bug the app hit, where a
shopper adding five reads 300 and is charged 1,500. When more than one is
selected the unit price appears above the total as `6 × 300.00`, so the
multiplication is shown rather than something the shopper has to trust. New key
`product.pricePerUnit` in all three languages, matching the app's wording.

## The bar had to get taller

Four controls on one phone row does not fit. Measured rather than guessed:

```
390px  price 110  stepper 118  cta 46 (label 79)  heart 48   <- label does not fit
```

The button was crushed to 46px for a label needing 79. So the row now wraps —
price on its own line on a phone, everything on one line from `md` up, which is
how the app lays out the same bar. Re-measured across five widths:

```
320px  cta  98 (label 79)     360px  cta 138     390px  cta 168
414px  cta 192                430px  cta 208
```

`scripts/measure-sticky-bar.js` does that measurement against the live
stylesheet. It clones the bar's own classes into a real page rather than driving
a login, because the controls only render for a signed-in shopper.

## Which broke the back-to-top button

The bar went from ~76px to 100px, and `ScrollToTop` sat at a fixed offset that
only accounted for the mobile nav. It ended up overlapping the bar's new price
line. Rather than write the bar's height into `ScrollToTop` as a third magic
number that would go stale the next time the bar changes, it now measures
whatever floating bar is on screen and sits above it.
`scripts/check-sticky-overlap.js` proves the two are clear of each other.

Worth noting this was already marginal on desktop before today — the same fix
covers that.

## Verification

`__tests__/components/stickyBuyBar.test.ts` asserts, for each of the 51 pages,
that the stepper is imported and rendered, that the price multiplies by the
count, that the per-unit line is present, and that the row wraps. 256 assertions.
The bar is duplicated across 51 files rather than shared, so any change to it is
51 near-identical edits and the failure mode is one page silently left behind —
that is what these catch. Consolidating the bar into one component is the obvious
follow-up and would make the test unnecessary.

Typecheck clean, production build clean, full suite 1,156 passing.

Not verified in a signed-in browser: the auth provider clears its stored user
when the session API returns none, so the state cannot be seeded without a real
account. Layout is covered by the measurement above, which uses the identical
classes.
