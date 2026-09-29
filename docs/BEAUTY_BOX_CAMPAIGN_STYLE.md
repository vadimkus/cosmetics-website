# Beauty Box campaign style v1 — "Singles, boxed" (28 Sep 2026)

The beauty boxes (55, 56, 57, 58, 59, 62) are sets of single products that ship without a box of
their own. The style gives every set the box it never had: **a precision kit case**, shot straight
from above, with each single seated in its own die-cut foam pocket in routine order. Every box
uses the same architecture; only the foam colour, the accent and the campaign idea change.

First run: product 55, "The Oil Change" (see `SESSION_CHANGES_2026-09-28_BB_PROBLEM_CAMPAIGN.md`).
Second run: product 58, "Time, well kept" (see `SESSION_CHANGES_2026-09-28_ANTI_AGING_BOX_CAMPAIGN.md`).
Third run: product 56, "Let the light in." (see `SESSION_CHANGES_2026-09-29_BB_BRIGHT_CAMPAIGN.md`).
Fourth run: product 59, "The refill." (see `SESSION_CHANGES_2026-09-29_BB_DEEP_CAMPAIGN.md`).
Fifth run: product 62, "Handle with care." (see `SESSION_CHANGES_2026-09-29_BB_SENSITIVE_CAMPAIGN.md`).

## The object

- Open hard-shell case, top-down, lid out of frame. Matte bone-white moulded shell, softly rounded
  corners, **a thin accent stripe round the outer edge**, two brushed-aluminium latches on the front
  edge, two hinges on the back edge.
- Foam insert in the box colour, fine matte texture, clean die-cut pockets.
- Packs lie face up with their long axis vertical, left to right in routine order (cleanser, toner,
  serum/treatment, cream), sheet masks fanned in the last, wider pocket.
- One px/mm for every pack, from the real sizes, so a 30 ml dropper never outgrows a 200 ml toner.
- The same case appears closed and carried by its handle on the "singles, one kit" slide, with the
  accent stripe round its middle.

## Main image (the product record)

Kit case on pure white. Type above it: a small accent tag `GENOSYS BEAUTY BOX`, then the box name in
Manrope ExtraBold, navy, centred. One caps line under the case: `N PRODUCTS · N PIECES · MADE IN KOREA`.
The main carries English type only; the product name is English in every locale.

## Carousel grammar (12 slides)

| # | Role | Rule |
|---|---|---|
| 1 | Hero | The kit case on the accent colour, campaign line above it |
| 2 | Hook | One metaphor object for the skin problem, no pack |
| 3–4, 6–8 | Steps | One pack per slide, tag `STEP 0X / 0N · VERB`, one-word or two-word headline |
| 5 | Proof | The strongest measured figure as a giant numeral over a metaphor still life |
| 9 | Feel | A texture metaphor for how the routine treats skin |
| 10 | Schedule | A blank card/clipboard photographed, the AM · PM steps typeset on it (rotated to the card) |
| 11 | Kit | The case closed and carried: "N singles. One kit." Every product is also sold on its own |
| 12 | Close | The singles standing in a line on white + spec card + `GENOSYS.AE · GENOSYS UAE APP` |

Two colours alternate as backgrounds (foam colour and accent), with white for the close.

## Type

- Headlines Manrope ExtraBold caps, body Manrope Medium, tags Manrope Bold in the accent.
- Navy `#0E2A47` on light grounds, white on the accent; RU same geometry (a block only shrinks when a
  line would pass its column); AR Noto Sans Arabic Bold/Medium, mirrored, Latin runs in Manrope.

## Palettes and idea seeds for the remaining boxes

The page palette (`beautybox.css`) follows the campaign once a box is redone.

| Box | Foam | Accent | Idea seed |
|---|---|---|---|
| 55 Problem Skin | powder blue `#9ACDEB` | signal orange `#F26A21` | **The Oil Change** (done) |
| 56 Skin Brightening | ivory `#F4EDE1` | sunlit amber `#E9A33E` (dusk navy for the mask) | **Let the light in** (done) |
| 57 Charming Look | blush | plum | Backstage Kit |
| 58 Anti-Aging | garnet velvet `#7A1D2E` | brass `#B8925A` (champagne `#D6BC92` ground) | **Time, well kept** (done) |
| 59 Deep Moisturizing | aqua `#96D4CF` | deep teal `#0E5B61` (pale aqua `#BEE6E2` and sand grounds) | **The refill** (done) |
| 62 Sensitive Skin | oat `#E2D5BC` | sage `#5E7F63` (pale oat `#F0E9DB` ground) | **Handle with care** (done) |

## Every box gets its own idea, not a reskin

The kit case, the one-pack-per-step slides and the close are the series. The idea is not: 55 is a
car service (dipstick, service card, "full service"), 58 is fine watchmaking (guilloché dial, brass
micrometer, sundial, a blank pocket-watch dial for the schedule, "keep good time"), 56 is a fogged
window (a wiped stripe through fog, a blind opening onto a garden, moonlight for the mask, "lights
on"), 59 is a refill (an empty glass on desert stone for the hook, a glass brimming over for the
proof, "refilled" for the close), 62 is fragile handling (a dandelion clock one breath from scattering
for the hook, a blush petal floating on still water for the proof, a feather on cashmere for the feel,
"with care" for the close). Each box also gets its own recurring prop so the step slides do not look like 55 in a new
colour: in 58 every pack stands on a round brass-rimmed pedestal shaped like a watch case; in 56
the same four-pane window shadow falls across every step; in 59 a plain glass column of water stands
beside every step pack and fills a quarter, half, three quarters, then to the brim and stoppered; in 62 every
step pack stands on a small plump oat-linen cushion with a sage piped edge, the way a fragile piece is
set down. Keep the window out of frame on step plates: a visible sheer curtain lands behind the type
column, and on the accent ground it sinks white text. Pick the idea from what the
routine promises, then find the objects that say it without a pack in frame.

Hardware follows the accent: 58's latches, hinges and stripe are brass, not aluminium.

Packs are drawn from real photographs when the site renders disagree with the product. The 58
serum bottle is black glass fading to clear at the base (Intertek `MULTI FUNCTIONAL ANTI-WRINKLE
SERUM/Pics/Front.jpeg`), not the solid black of the older renders, and the cream is the current
white tube with red lettering, not the old salmon-band "INTENSIVE MULTI FUNCTIONAL CREAM" artwork.

## Production rules

1. **Every image is a CapCut generation (GPT Image 2.5, 2k, Medium, 1:1; never Max). Nothing is pasted into a final.**
   Concept plates are text-to-image. Product slides: a plate is generated empty, the real container
   PNGs are placed on it at true scale as a *reference only*, and CapCut re-shoots the whole frame as
   one photograph. The kit case reference is drawn flat (shell, foam, pockets) with the real packs
   laid in, then re-shot.
2. Print is never restored by hand. A take with a wrong word on a pack is rejected and re-rolled.
3. Claims come only from each member product's audited page copy (and the box copy module's
   sourcing block). No figure appears on a slide that is not on the member's own page.
4. Workspace per box: `~/Desktop/Insta_Olga/<box>/campaign/` with `_prompts/`, `_gen/gi` (decoded
   takes), `_gen/ref` (references), `picks/`, `final/{,ru,ar}`. Scripts: `bbp_batch.sh` (CapCut
   driver around `Insta_Olga/aws/campaign/_scripts/capcut_ui.py`), `bbp_refs.py`, `bbp_slides.py` +
   `bbp_copy.py`, `bbp_export.py`, `sheet.py`.
5. Site: `public/images/<box>_campaign/{main,s1…s12}.jpg` + `ru/`, `ar/`; register the folder in
   `lib/localizedProductImages.ts`; DB `image` + `images` via a `scripts/update-product-NN-campaign-gallery.ts`
   run after the deploy. The box page and the mobile API show main → campaign slides; member packshots only
   fill the gallery of a box that has no campaign yet (the campaign already shows every item).
