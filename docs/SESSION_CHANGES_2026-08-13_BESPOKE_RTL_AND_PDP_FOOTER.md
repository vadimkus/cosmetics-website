# Bespoke page RTL fix + PDP footer review — 13 Aug 2026

Local only. Nothing pushed.

## 1. Arabic layout bug on all five bespoke pages (fixed)

### What was wrong

Every bespoke product page (60, 61, 63, 64, 65, 66) sets `dir` on its root
element and then also added `flex-row-reverse` to each row when the locale is
Arabic. A flex row inside `dir="rtl"` already lays its children right to left,
so the extra class flipped them back to left-to-right. Arabic pages rendered
with tick marks to the left of their bullet text, step numbers on the wrong
side, the share button on the wrong corner and the accordion chevron opposite
where it belongs. The English pages were unaffected, which is why it survived.

Same defect I had just fixed inside the reviews block, so it was worth sweeping
the rest rather than leaving five pages behind.

### The sweep

Removed across the five page components and `CeraPrimitives`:

| Pattern | Count | Why it went |
|---|---|---|
| `isRtl ? 'flex-row-reverse' : ''` | 89 | Cancels the container's own mirroring |
| `isRtl ? 'flex-row-reverse text-right' : ''` | 20 | Same, plus a redundant alignment |
| `isRtl ? 'text-right' : ''` | 53 | Right alignment is already the RTL default |
| `isRtl ? 'text-right' : 'text-start'` | 10 | Replaced by plain `text-start`, which flips itself |

Kept, because none of these mirror on their own: the chevron direction
(`ChevronLeft`/`ChevronRight`, `rotate-180`), the gallery's absolutely
positioned badge and zoom chip, its arrow-key handling, and the `AED`/`درهم`
currency word. `CeraAccordion` and `CeraBarcodeRows` no longer branch on
direction at all, so their `isRtl` prop was removed; `CeraGallery` keeps it.

### Verified

Arabic and English at 1440 wide on all six product numbers, plus deeper
sections: the four-step how-to strip, the ingredient tables, the routine cards,
the FAQ accordion and the spec rows with the barcode. Typecheck and lint clean,
488 tests pass.

## 2. Footer certification badge said the wrong thing (fixed)

The trust strip paired "Dubai Municipality Certified" with "5% VAT included".
Two unrelated facts, and the Arabic version read as a "5% VAT guarantee", which
means nothing. VAT inclusion is already stated next to the price on both the
standard and the bespoke pages, so the subtitle now describes the certification
it sits under: "Registered with Montaji" / "مسجّلة في نظام منتجي" /
"Зарегистрировано в системе Montaji".

## 3. Should product pages keep the full footer?

Yes, unchanged. A product page is not a checkout funnel: it is where shoppers
look for shipping terms, returns, contact and the certificates, and the four
link columns are also the only internal linking these pages have. Trimming it on
five pages out of sixty would break consistency for no gain. The slim variant
stays where it belongs, on cart, checkout, profile and the other focused
journeys, which the footer already handles by route.

### What was actually wrong at the bottom of these pages

Each page already had a floating buy bar, but only the mobile one worked. The
desktop version was pinned `top-0 z-40` while the site header is `sticky top-0
z-50` and 113 px tall, so it rendered underneath the header and was never once
visible. On desktop the effect was a page eight to twelve thousand pixels long
whose only add-to-bag control sat in the hero.

Both fixes are now in:

**One bar, at the bottom, at every width.** The invisible top bar is gone. The
bottom bar lost its `md:hidden` and gained a desktop layout: thumbnail, product
name and the variant line on the left, price and button on the right, capped at
the page's 1200 px measure. Anchoring at the bottom also removes the dependency
on the header's height, which is what broke it in the first place.

**A closing band before the footer**, `CeraClosingCta`, shared by all five page
components. Product shot, the promise line from the hero as a bookend, the
product name, the delivery note, then price and add to bag. No new copy per
product: every page already carries `headline`, `freeDelivery` and
`vatIncluded`, so all three languages were covered on day one.

The two are wired together by `useCeraStickyBar`, which watches the hero CTA and
the closing band and shows the floating bar only while neither is on screen, so
there are never two competing buy buttons in view. That also let the pages drop
the `pb-28` runway they used to reserve at the bottom.

### Verified

Six product numbers × three languages at 1440 px, plus 414 px mobile in English
and Arabic: bar appears mid-page, retracts over the closing band, band renders
in all three languages, no console errors on any of the eighteen page loads.
Typecheck, lint and 488 tests clean.

## Prices were being set in old-style figures

Reported as "the amount is not fully visible, the font for digits is strange, and
only for digits". Correct on all three counts, and it was one root cause.

Cormorant Garamond, the display serif on these pages, ships old-style figures as
its default: the 5 hangs below the baseline, 0 and 2 sit at x-height, 1 looks
like a small cap. Lovely in a headline, wrong for a price, where it reads as a
rendering fault and the hanging digits get shaved off by the `leading-none` the
price elements carried.

`.cera-numeral` already asked for `lining-nums tabular-nums`, so the fix was
mostly a matter of applying it. It now also states the same request as
`font-feature-settings`, for engines that drop the shorthand once a fallback face
takes over, and carries `line-height: 1.1` instead of `1` so nothing clips.

Applied to every figure a shopper has to read exactly, across all five pages:

| Element | Before | After |
|---|---|---|
| Hero price | `cera-serif text-[38px] leading-none` | `cera-serif cera-numeral text-[38px]` |
| Sticky bar price | `cera-serif text-[20px] leading-none` | `cera-serif cera-numeral text-[20px]` |
| Was-price and routine prices | UI sans, proportional | `tabular-nums` added |
| Clinical figures (60, 65) | `cera-serif leading-none tabular-nums` | `cera-serif cera-numeral` |
| Pack-size pill | `cera-serif` | `cera-serif cera-numeral` |

The closing band already used `cera-numeral`, and the barcode row was already
sans plus `tabular-nums`, so both were correct. Accordion titles and body copy
keep old-style figures on purpose: in running text they are the better choice.

Verified by rendering both variants side by side inside the page root at 5×
scale, so the difference is in the glyphs rather than in a guess about them.

## The closing band's product shot was framed, not embedded

The first version put the shot in a 168 px white tile with a 28 px radius. On a
cream or slate band that reads as a stray rounded card, and since the photograph
already carries its own studio grey, the tile drew a visible box around a box.

The shot is now the panel. It fills the end of the band, flush to every edge, no
radius and no card:

- **Stacked**, the panel is square, which is the shape all six shots were taken
  in, so the photograph fits exactly. Nothing is cropped and there is no seam
  where the panel tint would meet the photograph's own grey.
- **Beside the copy**, the panel is 300 px wide and stretches to the height of
  the band, with `object-cover` taking the small overflow off the top and bottom.
  Measured margins on all six shots are 10-32% at the top and reflections at the
  bottom, so nothing lands on the product. The band carries `lg:min-h-[260px]`
  to keep the panel close to square when the copy is short.
- `--cera-shot: #eeeeee` backs the panel. Every bespoke product's main image
  measures #ebebeb to #f3f3f3 at its corners, so the tone is a match rather than
  a palette tint, and it only shows if an image ever fails to load.

Tried and rejected: `mix-blend-multiply` (the shots are grey, not white, so it
stamped a darker rectangle), a radial mask fade (dissolved the white products on
60 and 66), and a blurred copy of the shot behind a contained one (the blur
pulled the dark floor of the photograph into the bars, which was more visible
than the seam it was meant to hide).

### Still open

The closing band reuses the hero promise line. Bespoke closing copy per product
would read better than a repeat, at the cost of eighteen new short strings.

Playwright cannot drive these pages on the local dev server at the moment: the
client tree does not hydrate under headless Chromium, so clicks and the
`IntersectionObserver` behind the sticky bar do nothing there. Screenshots are
still faithful, since they are server-rendered markup plus CSS, but interaction
has to be checked in a real browser. Unrelated to this change.
