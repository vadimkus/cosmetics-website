# One account avatar, taken from the app

Date: 26 Aug 2026

The blog index's account avatar was a red circle and the article one tap away from it was
black. Chasing that turned up fifteen hand-rolled copies of the same control across
fourteen files, in three variants.

## What was there

| Variant | Count | Where |
| --- | --- | --- |
| `bg-[var(--cera-ink)]` | 12 | article, favourites, locations, partners, orders detail, product, delivery, skin recommendation, checkout, checkout cancelled |
| `bg-[var(--cera-rose)]` | 3 | blog index, brand, orders |
| ink when signed in, `--cera-muted` when not | 2 (within the 12) | cart, both bars |

The presence dot had drifted too: `bg-green-500` in most, `--status-green-deep` in cart,
and positioned with `right-0`, so in Arabic it stayed on the right instead of mirroring.

## What the app says

From `app/(tabs)/shop.js`, the rule is not a colour — it is that the avatar tells you
whether you are signed in:

- **Signed in**: initial in white on `colors.cta`, plus a presence dot in `colors.green`.
- **Signed out**: a person outline in `colors.secondaryLabel` on `colors.subtleBg`, with a
  hairline in `colors.separator`. No letter, no dot.

`colors.cta` is `#191716` — cera ink, not red. That was decided when primary CTAs went to
ink. So the app agrees with the web's majority, and the blog index was the outlier.

The web showed a signed-out visitor a white **"G"** on a dark circle, which reads as an
account that is already logged in. It was not their initial and stood for nothing. That is
the substantive fix here; the colour was the symptom that led to it.

## What shipped

`components/AccountAvatar.tsx`, replacing all fifteen copies. Colours map to the app token
for token:

| App | Web |
| --- | --- |
| `cta` `#191716` | `--cera-ink` `#191716` |
| `subtleBg` `#f3ece8` | `--cera-cream-deep` `#f3ece8` |
| `separator` `#e8e0db` | `--cera-line` `#e8e0db` |
| `secondaryLabel` | `--cera-muted` |
| `green` `#2E7D4F` | `--status-green` `#2e7d4f` |

The dot moved from `right-0` to the logical `end-0`, matching the app's `end: -1`.

## Verification

- Playwright at 390×844: blog index and article now identical, signed in and signed out
- Presence dot measured at `rgb(46, 125, 79)`, on the right in `/cart` and the left in
  `/ar/cart`
- New `AccountAvatar.test.tsx`, 4 tests; full suite 1330 passed
- Production build clean

## Found, not fixed

The English blog article renders its own bar; `/ar` and `/ru` render `PdpLocaleBar`
instead, which has no account avatar at all. Two different bars for the same page
depending on locale. Predates this change and is worth a separate pass.
