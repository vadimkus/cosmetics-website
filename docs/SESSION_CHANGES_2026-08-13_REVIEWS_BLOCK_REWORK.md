# Reviews block rework — 13 Aug 2026

Local only. Nothing pushed.

## Why

On the bespoke product pages the reviews block was the one section that still
looked like the old PDP: a bold sans heading under a stray horizontal rule, a
grey box, a near-black button and the rewards line in brand red. It also had a
few functional gaps that were easy to miss while it sat empty.

## What changed

`components/product/ProductReviews.tsx` was rewritten around a `variant` prop.
`editorial` is passed by the six bespoke pages (60, 61, 63, 64, 65, 66); every
other caller keeps the previous look. The two variants differ in class strings
only, held in one `SKINS` map at the top of the file, so the markup and the
logic stay single-source.

### Styling (editorial variant)

- Serif heading, no top rule or margin (the section already pads itself, and the
  border was the stray line above the block).
- Eyebrow carries the review count instead of repeating the word "reviews" that
  the heading says underneath. Hidden when there are none.
- Cards, palette, stars and buttons pull from the `--cera-*` tokens, so each
  page gets its own colour without a per-product file. Verified on 61 (slate
  teal) and 66 (rose).
- Summary and empty state are width capped so they do not stretch across the
  full editorial column.

### Everywhere, both variants

- **Star breakdown.** New `distribution` field on
  `GET /api/products/[id]/reviews` (a `groupBy` over approved reviews), rendered
  as 5 to 1 bars next to the average. An average alone hides whether 4.2 means
  consistent 4s or a mix of 5s and 1s.
- **Show more reviews.** The endpoint has always paged at 10 and nothing asked
  for page two, so review 11 onward was unreachable. The button appends.
- **Inline notices instead of `alert()`.** Submitting, editing and deleting now
  report into a banner in the block. Submission also confirms the rewards points
  the API already returned but the UI dropped on the floor.
- **Inline delete confirmation instead of `confirm()`**, inside the review card
  so you can see what you are deleting.
- **Empty state** leads with a pen mark rather than five grey stars, which read
  as a zero score on a product that simply has not been reviewed yet. The CTA
  now also appears under the list, and works logged out by routing to login.
- **RTL fix.** The block set `flex-row-reverse` on rows inside a container that
  already carries `dir="rtl"`, so Arabic was double flipping back to LTR: avatars
  on the wrong side, stars filling from the wrong end. Those overrides are gone
  and the layout mirrors on its own.
- Star picker has hover and focus feedback, skeleton replaces the "Loading
  reviews..." line, Russian dates use `ru-RU` instead of `en-US`.

### Copy

Eight keys added to `messages/{en,ar,ru}.json`: `showMoreReviews`,
`reviewPublished`, `reviewUpdated`, `reviewDeleted`, `reviewPointsAdded`,
`confirmDelete`, `ratingBreakdown`, `outOfFive`.

## Verified

- `tsc --noEmit` clean, eslint clean, 488 jest tests pass.
- Screenshots of the empty and populated states (populated via a mocked API
  response, no test rows written to the database) at 1440 and 414 wide, in EN, AR
  and RU, on products 60, 61, 63, 66 and on the standard PDP (44). No console
  errors.
