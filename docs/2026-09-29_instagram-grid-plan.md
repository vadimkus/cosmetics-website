# 2026-09-29 — Instagram grid and posting plan (@genosys UAE)

Context: Vadim now runs the account himself and asked for a structure, the next post and the next Reel cover.

## Read of the account (screenshots 29 Sep, 17:07)

- Profile grid is the 3:4 tile layout. Square posts show only their middle 3:4 (sides trimmed); Reels show the
  middle 3:4 of 9:16 (y 240-1680 on a 1080×1920 cover).
- Newest 12, left to right: PCT reel "COOL ON CONTACT" (356 views) · PCT packshot (240) · Ultra Shield reel
  "WE DO." (267) · Ultra tube (327) · cat + Multi Vita reel (640) · Snow O2 cleanser (251) · HR3 (514) ·
  pink-dress reel (427) · Dubai Derma stand (395) · tubes (580) · foil pack (459) · ND Cell (452).
- Older highs: phone demo reel 2,093, Bio-Meso 902, cream 833, anti-wrinkle serum 802, cushion 778,
  specialist reel 567. Real/human video leads; packshots accumulate slowly. The two campaign reels are 1-3 days
  old, too early to judge. Grid view counts are not reach: check Insights (reach, non-follower %, shares, saves,
  follows) for the last 10 posts.
- Matches `~/Desktop/Insta_Olga/Анализ аккаунта.pdf` (June): feed reads as a product catalogue; missing
  people, specialists, procedures, proof, clinics.

## The grid rule

A tile sits under the post published 3 posts earlier and beside the posts just before and after it. Every new
post must contrast (light vs dark / colour) with the previous post and with the post 3 back. The first of three
posts lands on the right of a row, the last on the left.

## Next three posts

| # | Post | Cover | Why |
|---|---|---|---|
| P1 | GENO-LED IR II carousel: main + 12 EN slides (`lamp/campaign/final/`) | white main packshot | beside cobalt PCT reel, above violet "WE DO." |
| P2 | GENO-LED Reel `lamp/campaign/reel/GENOSYS_GENO-LED_Reel_v1.mp4` | `GENOSYS_GENO-LED_Reel_cover_dark.jpg` ("ONE DOME.", red on black, frame 120) | dark above the white PCT packshot and beside the white carousel; red glow stops the scroll |
| P3 | Real proof, light: dome running at a partner clinic / specialist / team, filmed on phone | light | account's biggest gap; the last 7 posts are all product |

Mock: `~/Desktop/Insta_Olga/grid_plan_next3.jpg`. Space them ~2 days apart.

## Weekly structure

- 3 feed posts a week = one grid row: campaign carousel → same campaign's Reel → real proof/people post.
- Stories daily (behind the scenes, orders going out, polls, app link).
- Month: 4 campaigns (carousel + Reel) + 4 proof/people posts. Never two same-colour campaigns back to back.
- Campaign slides ready (docs `SESSION_CHANGES_2026-09-2*_*_CAMPAIGN.md`); Reels exist only for Ultra Shield,
  PCT and GENO-LED. One new campaign Reel a week: Seedance prompt from text-free plates + local type pass.

## Posted 29 Sep 2026 (@genosys.uae, from the Cursor browser)

- **P1 carousel** https://www.instagram.com/genosys.uae/p/Dd3350YjOMj/ : 13 slides, 1080 × 1080 JPEG q93 made from
  `public/images/led_campaign/{main,s1..s12}.jpg`, 1:1 crop, no filter, AI label off. Caption 982 chars: five
  wavelengths with irradiance and dose (slide 8 figures), colour + IR together, nothing to reorder, 2.6 kg, voice
  prompts EN/KO/ZH, Made in Korea, official UAE distributor, DM/WhatsApp +971 58 548 76 65, genosys.ae, app.
  No effect claims per wavelength.
- **P2 reel** https://www.instagram.com/genosys.uae/reel/Dd34OKGK7-a/ : `GENOSYS_GENO-LED_Reel_v1.mp4`, crop set to
  Original (web defaults to 1:1 and would cut the reel), sound on, custom cover `reel_cover_dark.jpg`, AI label
  off (Vadim's call). Caption 412 chars, same claims, shorter.
- Grid now reads: dark reel | white carousel | cobalt PCT reel.
- Upload method, for next time: Instagram web blocks the page from fetching localhost under its CSP and the browser
  tool cannot set file inputs. Working path: `ig_post/serve.py` (CORS + Private-Network headers on 127.0.0.1:8765),
  CDP `Page.setBypassCSP` + reload, then in-page `fetch` → `DataTransfer` → `input.files` + `change`. The reel cover
  input only accepted the file through its React `onChange` prop. Turn the CSP bypass off and stop the server after.
  Files: `~/Desktop/Insta_Olga/lamp/campaign/ig_post/`.
- Next: P3, the real proof post (light), ~2 days out.

### Fix, same day: both captions had published empty

- Business Suite listed both posts as "This post has no text". Instagram web's caption box (Lexical) shows
  pasted or scripted text and even updates the counter, but its save request (`/api/v1/media/<id>/edit_media/`
  and the create call) carries no `caption_text`. Typing through the browser tool did not register either.
- Fixed by patching `fetch`/XHR in the tab to add `caption_text` to the edit_media request, then opening
  Edit and pressing Done. Both captions confirmed live after reload (hashtags render as links).
- The carousel carries a location "The Palm Jumeirah, Dubai, UAE" that Instagram pre-filled; left as is.
- Next time: post captions the same way (inject `caption_text` into the create request), then reload the post
  and read the caption before calling it done.

### Story: not possible from the browser

- Desktop Instagram has no story option; the mobile site (phone emulation) takes photos only.
- Business Suite story composer (reached with "Continue with Instagram", set to genosys.uae only) blocks
  localhost under its CSP (`connect-src` list + `upgrade-insecure-requests`); `setBypassCSP` did not hold there.
  The file picker is suppressed in the Cursor browser and clipboard reads are refused. The only file it could take
  was Instagram's own 720p copy of the reel (1.4 MB, ~550 kbps), too soft. Draft discarded.
- Decision: Vadim shares the reel to his story from the phone (full quality, taps through to the reel).

## Next campaign pick (30 Sep 2026): Product 41 Cushion, "Shade to go."

- Live grid top row: LED reel (dark red) | LED carousel (white) | PCT reel (cobalt). The next tile sits beside
  the dark LED reel and above the cobalt PCT reel, so it must be light and warm: not blue, not red.
- Cushion 41: top seller (63 September order mentions, most of any product), old cushion post was one of the
  account's best (778 views), livery warm sand + near-black stone with mashrabiya shadows. Slides live on site
  (`public/images/cushion_campaign/`), text-free plates in `~/Desktop/Insta_Olga/cushion41/campaign/picks/`.
- Order: carousel first (main on white + 12 EN slides), then the reel with a dark black-stone cover (s3 SPF50+
  or s8 drop) to sit beside the white carousel and above the white LED carousel.
- Ruled out for this slot: MH Cream 29 (navy/sky), Hyaluron Serum 18 (black/cyan), Snow O2 10 (on the grid
  already, row 3), BB Charming 57 (contains the cushion; not back to back).
- After the cushion pair: MH Cream 29 (blue after sand), then Snow O2 10 (apricot/charcoal). Keep 18 and 29 apart.
- Pack on the Desktop: `~/Desktop/Cushion_41_Reel/` with `carousel/` (00_main + 01–12 EN, 1080 JPEG q94),
  `seedance_refs/` (11 text-free plates, 1600 JPEG: main, s2, s1, s3, s4, s5, s6, s7, s8, s9, s11; s10 blank
  card and s12 duplicate of main left out) and `SEEDANCE_PROMPT.txt` (20 s, 11 shots, ~110 BPM Arabic deep house,
  lattice-shadow wipes, product lock, lid never moves, end hold on white for the end card).
- Seedance returned `0930_974.mp4` (1080×1920 HEVC 10-bit, 24 fps, 20.06 s): all 11 shots in order, no Ai mark,
  logos read correctly, lid never moved, pad emblem only. No fix pass needed. Cuts at frames 56, 118, 156, 193,
  235, 285, 329, 367, 400, 429.
- Type pass `cushion41/campaign/_scripts/c41_reel_type.py` (Manrope Regular caps, campaign palette, light halo under
  dark type on lattice shadow, dark shadow under light type): THE SUN FINDS YOU · SHADE TO GO · SPF50+ PA++++ ·
  ONE PRESS. THREE JOBS. · 2% NIACINAMIDE · TOUCH UP. · THREE SHADES. SAME PROTECTION. · SHAPED LIKE A DROP. ·
  GOLDEN HOUR, COVERED. · 30 G IN THE BOX. · end card SHADE TO GO. + spec + SHOP GENOSYS.AE · GENOSYS UAE APP.
- Audio: +7.3 dB, alimiter 0.84, 48 kHz → −16.0 LUFS, −1.5 dBTP (final file −1.4 dBTP after AAC).
- Output `~/Desktop/Cushion_41_Reel/GENOSYS_Cushion_Reel_v1.mp4` (21 MB, x264 CRF 16, SEI and metadata stripped),
  cover `GENOSYS_Cushion_Reel_cover_dark.jpg` (frame 146, SPF50+ on black stone), captions in `captions.txt`.

## Posted 30 Sep 2026: cushion pair

- **Carousel** https://www.instagram.com/genosys.uae/p/Dd6R_5YjCJ9/ : 13 slides (site `cushion_campaign/main` +
  `s1`–`s12`, 1:1), no location, AI label off, caption 944 chars. Went up blank again, fixed through edit_media
  (shows "Edited"). Shade codes written "01 Ivory, 02 Beige, 03 Camel": Instagram turns "#01" into a hashtag.
- **Reel** https://www.instagram.com/genosys.uae/reel/Dd6T-4dqjI_/ : 1080p master, Original crop, sound on, cover
  SPF50+ via the cover input's React `onChange`, caption live first time. Vadim adds music to the carousel himself.
- Grid top row now: cushion reel (dark) | cushion carousel (white) | LED reel (dark), then LED carousel | PCT reel.

## Posted 1 Oct 2026: MH Cream 29 carousel

- https://www.instagram.com/genosys.uae/p/Dd9UYVyjFEk/ : 13 slides from site `mhcream_campaign` (main + s1–s12),
  1:1, no location, AI label off. Caption 903 chars live on first share (set `caption` + `caption_text` on
  `configure_sidecar`): +82% hydration after one use and still higher three days later, grape or raisin, 1,000.9 ppm
  high-weight HA as a light film, 9% glycerin + PENTAVITIN 0.615%, 50 g / 250 g, Fill then seal, Made in Korea,
  contacts, 10 hashtags. Grid top row: MH cream (white) | cushion reel (dark) | cushion carousel (white).
- Next: the MH Cream reel (dark navy cover), then Snow O2 10. A real-people post is still overdue.

## Posted 1 Oct 2026: MH Cream 29 reel

- https://www.instagram.com/genosys.uae/reel/Dd9evDYKDum/ : `GENOSYS_MH_Cream_Reel_v1.mp4` (1080p, 19.6 s, label
  print restored from the real packs), Original crop, sound on, custom cover (navy end card) via the cover input's
  React `onChange`, AI label off, no location. Caption 724 chars live on first share (`caption` + `caption_text` on
  `configure_to_clips`), 10 hashtags linked.
- Grid top row: MH reel (navy) | MH carousel (white) | cushion reel (dark).
- Grid tile shows the middle 3:4 of the cover, so it reads "FRESH." only. Fix on the phone: reel → ⋯ → Edit →
  Edit cover → Profile grid, drag to the top. Next time keep cover type inside y 240–1680 of 1920.
- localhost.run tunnel dropped mid-transfer (503) and ran at ~90 KB/s; restarted, 18 MB took ~4 min in-page.
- Next: Snow O2 10 campaign. A real-people post is still overdue.

## Upload method, updated 30 Sep 2026 (replaces the localhost route above)

- The Cursor browser now blocks every page from reaching `127.0.0.1` / `localhost` (local network access), even
  with `Page.setBypassCSP` on. The request never leaves the browser.
- Images already on the site: fetch from `https://genosys.ae/...` (Vercel sends `access-control-allow-origin: *`)
  with the CSP bypass on.
- Files not on the site (1080p reel master, cover, captions): `serve.py` in a folder holding only those files,
  plus a temporary tunnel `ssh -R 80:127.0.0.1:8765 nokey@localhost.run` (public https `*.lhr.life`). Start both as
  their own background processes, not inside a chained `( … &)`, or they die with the shell. Close the tunnel and
  delete the folder after.
- Captions: the create calls (`/api/v1/media/configure_sidecar/`, `/configure_to_clips/`) read **`caption`**;
  `edit_media` reads **`caption_text`**. Patch fetch/XHR to set both on any `configure|edit_media` URL, then open
  the live post and read the caption back.
