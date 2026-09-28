# 2026-09-28 — PCT Instagram Reel (CapCut / Dreamina Seedance 2.5)

- Product: #15 Intensive Problem Control Toner, gallery `/images/pct_campaign/` (main + s1–s8, s9b, s10–s12).
- Slides downloaded in order to `~/Desktop/PCT_Reel_Slides/` (00_main … 12_s12, 1600×1600).
- Plan: CapCut → AI video → Omni reference, 13 images, Seedance 2.5, 20s, 1080p, 9:16, audio on.
- Order: open on main, close on s12 ("Stay matte. Stay cool.") with a ~3s hold.
- After export: `~/Desktop/PCT_Reel_Slides/clean_reel.sh` remuxes with ffmpeg, strips all metadata/C2PA,
  output `~/Desktop/GENOSYS_PCT_Reel.mp4`. Trim the CapCut outro in the editor before export.
- Prompt + IG caption delivered in chat.

## Post-production (same day, 15:20–15:40)

Dreamina export landed as `Premium_20_second_vertica...cs_no_added_text_or_logos.mp4`:
1440×1440 square (the 9:16 setting was not applied), HEVC 10-bit, 24 fps, 20.04 s, AAC music.

Problems found:
- CapCut "Ai" badge burned into every frame, top-left (~80×80 px, ~43% white overlay + soft shadow).
- C2PA manifest in a top-level `uuid` box plus a `CapCut` string in the container.
- Slides 1–11 reproduced faithfully. Slide 12 was redrawn onto the s11 ice-block scene
  (cobalt, not the white original) with the small line misspelt "Intensive Problem CON TROL TONER".
  Hard cut to that text at exactly 18.000 s (frame 432).

Fixes (`~/Desktop/PCT_Reel_Slides/_work/render_reel.py`):
- Badge: alpha matte estimated from flat-background frames, glyph mask dilated 13 px, per-frame
  `cv2.inpaint` (Telea). Straight overlay subtraction left a dark ghost, so it was not used.
- End card: misspelt line inpainted from frame 432 on and re-set as "Intensive Problem Control Toner"
  in Manrope Medium 38 px at 1440 scale (matches the 317 px width of "Intensive Problem"), colour 206/220/253.
- 9:16 layout: square at y 400–1480 on navy bands (multiply blend with a blurred copy of the frame so
  white slides do not grey the bands). Top: white-lettered GENOSYS logo + "INTENSIVE PROBLEM CONTROL TONER".
  Bottom: "OIL OFF. COOL ON." / "200 ml mist · 500 ml pump" from 0.35 s, switching at 18.0 s to
  "SHOP AT GENOSYS.AE" / "or in the GENOSYS UAE app · App Store & Google Play".
- Audio: +8.3 dB, limiter at 0.79, 0.75 s fade-out → −15.5 LUFS, −1.3 dBTP, LRA 11 (loudnorm dynamic
  mode would have squashed LRA 14 → 5.6, rejected).
- Encode: H.264 High, yuv420p bt709, CRF 15, SEI stripped, metadata and encoder tags blanked. Verified
  no `c2pa` / `jumb` / `CapCut` / `x264` / `Lavf` bytes in either file.

Deliverables in `~/Desktop/PCT_Reel_Slides/`:
- `GENOSYS_PCT_Reel_9x16.mp4` (1080×1920, 18 MB, upload this as the Reel)
- `GENOSYS_PCT_Reel_1x1.mp4` (1080×1080 clean square, feed or ads)
- `GENOSYS_PCT_Reel_cover.jpg` (1080×1920 cover, the "OIL OFF. COOL ON." frame at 3.58 s)
- `caption.txt` (Reel caption with app line; app confirmed on both stores: iOS id6756648064, Android ae.genosys.app)

## v2 — UltraShield format (16:00–17:00)

Vadim rejected the banded 9:16 layout: "keep it full frame like UltraShield, no borders, no logo, never".
The banded files and the 1:1 are in `PCT_Reel_Slides/_old/`.

- The first 9:16 regen (`P2_…mp4`) used a prompt that asked Seedance to keep the slide text. It
  zoom-cropped the square slides, so headlines were cut ("IL OFF.", "HINY", "AY.") and it misspelt
  "PERPOMINT" on an ice shot with no bottles. Rule: for 9:16, feed text-free plates and ban all text.
- New refs: `refs_9x16/01_Main.jpg … 13_Final.jpg` (text-free plates from
  `Insta_Olga/problem_boost/campaign/picks/`, 2048 px). Prompt: `PCT_Reel_Slides/REEL_PROMPT.txt`.
- Seedance result `0928_593.mp4` (1080×1920, 24 fps, HEVC 10-bit, no Ai badge). Cuts at frames
  62, 94, 126, 157, 186, 223, 257, 285, 317, 349, 380, 410. Seedance ignored "keep top third calm" on
  the face shots.
- Fixes (`_work3/pct_reel_fix.py`): shot 2 (62–93) was mirrored, spray label read backwards → flipped.
  Leftover "0%"/"UM." on the glass (126–156) → texture from 720 px below, relit from a low-res fill of the
  surroundings, feathered rectangle. Leftover "A" on steel (157–185) → steel from 150 px right.
- Type (`_work3/pct_reel_type.py`, adapted from `ultra/campaign/_scripts/reel_type.py`): Manrope Regular
  caps, 5-frame fade-rise / 4-frame fade-out. Navy #10204F with white glow on light and skin, white with
  navy shadow on cobalt. Face shots carry their headline low (y 1330–1418). End card top-left of shot 13:
  STAY MATTE. / STAY COOL. · INTENSIVE PROBLEM / CONTROL TONER · 200 ML MIST · 500 ML PUMP ·
  SHOP GENOSYS.AE / GENOSYS UAE APP.
- Audio +9.5 dB + limiter → −16.0 LUFS, −1.6 dBTP, LRA 11. Colour vs source within 0.5 level (exact
  BT.709 decode on both sides). No encoder / c2pa / CapCut bytes.
- Final: `PCT_Reel_Slides/GENOSYS_PCT_Reel_v2.mp4` (22 MB) + `GENOSYS_PCT_Reel_v2_cover.jpg` (end card).

## On the website (17:10)

- Web copy `public/videos/pct-reel-web.mp4` (720×1280, H.264 ~1.1 Mbit/s + AAC 128k, 2.8 MB, faststart,
  no encoder/C2PA bytes), same spec as `ultra2-web.mp4`. New filename because `/videos` is immutable-cached.
- Poster `public/images/pct_campaign/reel-poster.jpg` (720×1280, "OIL OFF." frame at 1.5 s).
- /products/15: DB `videoUrl` → `/videos/pct-reel-web.mp4` (`scripts/set-product-video.ts 15 …`),
  `lib/products.ts` fallback too. No config `videoUrl` for 15, so the DB value wins; the mobile app reads
  the same field. Page video gets the 9:16 poster; eyebrow "Three ways to apply" → "Oil off. Cool on.
  In 20 seconds" (RU "Минус блеск. Плюс свежесть. За 20 секунд", AR "وداعاً للمعان. أهلاً بالانتعاش. في 20 ثانية").
- Blog `intensive-problem-control-toner-oil-off-cool-on`: same file + poster, same three headings,
  re-run of `scripts/create-pct-toner-oil-off-cool-on-blog.ts` (keeps `publishedAt`).
- `public/videos/problem.mp4` left in place (old how-to clip, no longer referenced by product 15).
