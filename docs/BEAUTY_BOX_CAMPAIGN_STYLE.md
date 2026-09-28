# Beauty Box campaign style v1 — "Singles, boxed" (28 Sep 2026)

The beauty boxes (55, 56, 57, 58, 59, 62) are sets of single products that ship without a box of
their own. The style gives every set the box it never had: **a precision kit case**, shot straight
from above, with each single seated in its own die-cut foam pocket in routine order. Every box
uses the same architecture; only the foam colour, the accent and the campaign idea change.

First run: product 55, "The Oil Change" (see `SESSION_CHANGES_2026-09-28_PROBLEM_SKIN_BOX_CAMPAIGN.md`).

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
| 56 Skin Brightening | ivory | sunlit amber | Lights On |
| 57 Charming Look | blush | plum | Backstage Kit |
| 58 Anti-Aging | deep garnet | brass | The Restoration |
| 59 Deep Moisturizing | aqua | deep teal | The Refill |
| 62 Sensitive Skin | oat | sage | Handle With Care |

## Production rules

1. **Every image is a CapCut generation (GPT Image 2.5, 2k, 1:1). Nothing is pasted into a final.**
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
