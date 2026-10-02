# 2026-10-02 — Product 53 card hover video (pilot)

First product card with a hover clip: Intensive Repair Collagen Mask (53), a soft light sweep across
the foil. Desktop mouse only; phones, PWA and the app keep the still photo.

## Behaviour

- `lib/productCardVideos.ts` maps a card **main image path** to a clip, so a new main image drops the
  video automatically until a matching clip is made.
- `components/ProductCard/CardHoverVideo.tsx`: enabled only on `(hover: hover) and (pointer: fine)`
  with reduced motion off. The `src` mounts on the first mouse hover (`preload="none"`), plays muted
  and looped, shows on `playing`, fades out over 200 ms on leave, then pauses and rewinds.
- `components/ProductCard/ProductImage.tsx` renders it over the non-PWA card image.
- Checked on local dev (`/products`): clip mounts on hover, plays at opacity 1, on leave opacity 0,
  paused, `currentTime` 0; one video element on the page.

## Shoot (CapCut → AI video)

- **Multiframes** (Dreamina Seedance Multiframes, photo as first and last frame): every job ended
  "Generation timed out", and CapCut resubmitted them itself (8 tiles from 4 clicks). 350 credits,
  nothing usable. Do not use Multiframes for card loops.
- **Image to video**, Dreamina Seedance 2.5, one first frame (`collagen_campaign/main-v2.jpg`),
  5 s, 720p, 1:1, audio off, 185 credits. Prompt:
  > Studio product shot on a pure white background. The sachet stays perfectly still. A soft band of
  > light slowly glides across the foil from left to right, a gentle glossy highlight, and has left
  > the sachet by the fourth second. Static camera.
- Take: 960×960, 24 fps. Had a faint white "Ai" badge top-left from ~frame 20, and Seedance redrew
  the red slightly more orange (G 36 vs 20 in the photo).

## Processing

- Workspace `~/Desktop/Insta_Olga/collagen53/video/` (`53_take1.mp4`, `c53_prep.py`, sheets, GIF).
- `c53_prep.py`: keeps the real photo in every frame and adds only the light,
  `out = photo + blur(take[n] − take[0.5 s])`, badge corner held at the photo's white, cut
  0.5–4.5 s, last 0.4 s eases back to the photo.
- `scripts/cards/make-card-video.py` → `public/videos/cards/53-v1.mp4`: 600×600, 4 s, H.264, no
  audio, 44 KB, no c2pa/jumb/CapCut/Lavf/x264/Lavc bytes; frame 1 and last frame vs photo 2.48 / 2.47.
- `__tests__/lib/productCardVideos.test.ts` guards the mapping, file size and metadata.

## Product 36 — Soothing Bomb Sea Algae Mask (green sachet)

- Same shoot: Image to video, Seedance 2.5, `seaalgae_campaign/main.jpg`, 5 s, 720p, 1:1, audio off,
  same prompt, 185 credits (balance 3,696). Take `~/Desktop/Insta_Olga/seaalgae36/video/36_take1.mp4`.
- This take washed the whole sachet mid-sweep and greyed the GENOSYS logo and small print, so the
  plain photo + light delta carried the greying over. Fixed with the generic
  `scripts/cards/light-pass.py` (replaces the one-off `c53_prep.py`):
  `--start 0.25 --end 4.5 --blur 12 --gain 0.7 --brighten-only` — only brightening survives, blurred to
  light-band scale, so printed text stays printed.
- `public/videos/cards/36-v1.mp4`: 600×600, 4.25 s, 59 KB, no forbidden bytes; frame 1 / last vs photo
  2.20 / 2.13. Mapped in `lib/productCardVideos.ts`, covered by the test.

## Product 37 — Peptide Gel Mask (sachet + box)

- Same shoot on `peptide_campaign/main-v2.jpg`, prompt adapted to both packs ("The sachet and the box
  stay perfectly still… glides across both packs…"), 185 credits (balance 3,511). Take
  `~/Desktop/Insta_Olga/peptide37/video/37_take1.mp4`.
- The screen locked mid-download: CapCut's own cache copy (`…/0915/ai_material/<uuid>.mp4`) stalls
  without a moov atom while locked. Download from the Generations panel after unlocking.
- Take had a warm golden glare band and a lens-flare starburst on the box from 4.5 s. Cut at 4.0 s and
  added `--neutral` to `light-pass.py` (light applied as white):
  `--start 0 --end 4.0 --blur 12 --gain 0.6 --brighten-only --neutral`.
- `public/videos/cards/37-v1.mp4`: 600×600, 4.0 s, 39 KB, no forbidden bytes; frame 1 / last vs photo
  2.38 / 2.30.

## Replay fix (`0ca006915`)

- A repeat-hover test showed the clip playing at opacity 0 on later hovers: the replay after
  pause + rewind did not always fire `playing`, which was the only thing that made the clip visible.
- `CardHoverVideo` now shows the clip when `play()` resolves, guarded by a `hovering` ref so a late
  resolve or `playing` event can never show it after the mouse has left.
- Live check (peptide card, media-event listeners attached): 4/4 hovers play, show and rewind on
  leave. Synthetic `PointerEvent`s fired right after page load still miss occasionally; confirm with a
  real mouse.

## Next card

Same recipe: Image to video, one first frame, short positive prompt (negatives like "no drops"
invite drops), then `light-pass.py` (add `--brighten-only --blur 12` if the take greys the print), then
`make-card-video.py --start 0 --dur <end-start>`. New clip =
new filename (`/videos` is immutable-cached).
