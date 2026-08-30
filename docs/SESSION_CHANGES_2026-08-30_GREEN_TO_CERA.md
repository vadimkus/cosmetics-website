# Green off the brand palette — 30 Aug 2026

Prompted by the app's product page: the "In stock" pill was still green on a
cream page next to a rose CTA.

## What was actually there

Green was doing two unrelated jobs under one colour.

The first is telling apart the stages of an order. Pending, processing,
shipped, delivered and cancelled sit in one list and the hue is the only thing
separating them at a glance. That is a real job and the colour is load-bearing.

The second is confirming that a single thing went right: in stock, added to
bag, promo applied, password saved, free delivery earned, the amount you saved.
There the tick and the words already say it. The green added nothing except a
courier-app look on a warm page.

Only the second job moved.

## Counts

| | before | moved | kept |
|---|---|---|---|
| Website, Tailwind utilities | 1,051 | 1,051 | ~330 excluded from the sweep |
| Website, tokenized `--status-green-*` | 62 | 58 | 4 |
| App, `colors.green*` | 180 | 173 | 2 |

## New tokens

`--cera-ok` / `--cera-ok-bg` / `--cera-ok-line` on the website, `ok` / `okBg` /
`okLine` in the app. Same values as rose-ink / blush / blush-deep, which the
palette already had; what was missing was a name saying which of the two jobs
is meant. Text holds **4.81:1** on its own background, against **4.79:1** for
the green-700-on-green-50 pair it replaces, so nothing got harder to read.

Written as literals, not as `var(--cera-rose-ink)`. The 45 bespoke product
pages each retint the cera tokens to their own product, so rose-ink is teal on
the hyaluron cream and plum on the overnight mask. An alias would have made
"In stock" a different colour on all 45 and needed 45 contrast checks. Caught
before shipping by reading the computed value in the browser rather than
trusting the source.

## Three surfaces that needed ink, not the new token

A filled confirmation flipping from `--cera-cta` to `--cera-ok` would be two
tones of one hue and would barely register as a change, so those go to ink:

- The in-cart quantity bar and the bespoke pages' stepper pill.
- The free-shipping progress bar, and the app's `ProgressBar.fillMet`. These
  matter most: the unmet state is already `--cera-rose`, so an earned bar
  painted rose-ink would be all but the same colour as an unearned one and the
  bar would stop reporting anything.
- The filled success toast, which sits against a filled red error toast.

The one exception is the in-stock badge that overlays a product photograph. It
has to stay filled to be legible, so it takes rose-ink with white at 5.56:1.

## What kept its green, and why

- **Order status**, website and app. Several states in one list.
- **WhatsApp.** Not ours to retune.
- **The presence dot** on an avatar. A green dot meaning "active" is a
  convention across every messaging app, and no text accompanies it.
- **Password strength, storage quota, network online.** Scales and binaries
  where the colour is the reading.
- **Skin-analysis metrics.** Two series side by side, told apart by hue.
- **Ledgers and dashboards** where green and red are a plus/minus pair.
- **The free-mask bar**, whose two states are on screen at once.

## Method

`scripts/codemod-green-to-cera.mjs`, anchored on the utility prefix so nothing
in prose can match, with the meaning-bearing files skipped by name. Every
`-500` shade is excluded outright: that one number is where WhatsApp's mark,
the presence dot and the middle of the strength scale all happen to live, and
excluding the shade is a rule that cannot be got wrong by accident.

## Note for the next person

`rg` strips the matched text out of captured output unless you pass
`--color=never`, which makes `bg-green-50` read back as `bg-n-50`. A codemod
built on that output would have corrupted every file it touched.

## Verification

Typecheck clean, 120 suites / 1393 tests green, production build passes, token
contract still matches across both repos, all 41 touched app files parse, and
the rendered product page reports no green element left.
