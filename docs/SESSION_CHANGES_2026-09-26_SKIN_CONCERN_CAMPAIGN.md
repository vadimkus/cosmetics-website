# "Name it. Treat it." - skin-concern artwork

**Date:** 2026-09-26
**Scope:** the eight "Shop by skin concern" images, and every surface that reads them from
`lib/concernVisuals.ts`: homepage and /products tiles, concern landing heroes, related-concern
cards, face-map and skin-analysis thumbnails, share cards, image sitemap, mobile concern API.

## Idea

The old tiles were soft ingredient still-lifes. The new ones show the concern honestly and, in
the same frame, the moment the answer touches it. The shopper recognises her problem, sees it
being treated, and the tile copy routes her to the products.

| Concern | Frame |
|---|---|
| Sun protection | Harsh desert sun and a palm shadow on a sun-flushed cheek; a fingertip draws one stroke of SPF |
| Acne & blemishes | A few inflamed blemishes on the jawline; a pipette drop of clear serum on the largest |
| Pigmentation | Sun spots and a melasma patch on medium-deep skin; a fingertip presses a brightening drop |
| Scar treatment | Rolling acne-scar texture in raking light; a gloved hand and microneedling pen through serum |
| Hair loss | A widened parting; a dropper of golden ampoule on it; a comb with shed hairs |
| Anti-ageing | Crow's feet at the eye corner; a ring finger pressing a pearl of rich cream |
| Hydration | Dull, flaky, dehydrated cheek; a large hyaluronic drop turns the contact point dewy |
| Sensitive skin | Diffuse flush on cheek and nose; a fine cooling mist settling on it |

Products stay unbranded (plain pipette, cream, pen, mist) so no invented label reaches the site.
No numbers, no before/after, no text in the frames (Arabic mirrors the image).

## Render

CapCut AI image, GPT Image 2.5 · 2k · Medium · **16:9** (2560 x 1440), four renders per concern,
8 jobs / 128 credits. Prompts: `~/Desktop/Insta_Olga/concerns/campaign/PROMPTS.txt` and
`_paste/*.txt` (shared composition block in `_paste/_style.txt`: subject in the right half,
empty ivory #F6F0E8 left half, no text). Driver: `_scripts/capjob.py` + `run_rest.py`
(`/tmp/main2_venv/bin/python`). Raw renders `_gen/raw/`, sheets `_gen/*_sheet.jpg`, picks
`final/*.png` + `final/_contact_sheet.jpg`.

Picks: sun v2, acne v1, pigmentation v1, scars v1, hair v4, anti-ageing v1, hydration v2,
sensitive v1.

## Site

- `public/images/concern_campaign/{sun-protection,acne-blemishes,pigmentation,scar-treatment,
  hair-loss,anti-aging,hydration,sensitive-skin}.webp` - 1600 x 900, WebP q86, 55-124 KB. New
  folder because `/images` is served immutable; the old `home/skin_concern/*.webp` stay
  (`WhyGenosysSection` still uses `anti-aging.webp` as its background).
- `lib/concernVisuals.ts`: new paths; `imagePosition` re-set per frame (the vertical value keeps
  the detail inside the ~3.2:1 landing hero); new `cardPosition` for cards that set copy over the
  left of the image. Subjects start at 40-54% of the frame, so tiles crop further left
  (0-38%) and the face starts where the copy ends. Hero and square thumbnails keep
  `imagePosition`.
- `ConcernShowcase.tsx`: tiles use `cardPosition`; heading max-width 76% -> 58%, benefit
  70% -> 50%, so copy ends before the face.
- `RelatedConcernCards.tsx`: uses `cardPosition`.
- Concern pages (EN/RU/AR): Open Graph / Twitter image size 960 x 720 -> 1600 x 900.
- Tests: `ConcernVisuals.test.tsx`, `SkinConcernSection.test.tsx` expect the new paths.

## Checks

- Jest (both suites, 7 tests), `tsc --noEmit`, ESLint.
- Dev server: /products tiles in EN (copy clears the face on all eight), AR (mirrored, faces
  left, copy right on ivory), acne and hair-loss landing heroes.
- Mobile app does not render concern images; the API `image` field just points at the new files.
