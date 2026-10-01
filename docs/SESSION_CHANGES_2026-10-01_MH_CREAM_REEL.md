# Session 1 Oct 2026: MH Cream (product 29) Reel, "Sealed fresh."

## Source

- Seedance 2.5 render `~/Desktop/MH_Cream_29_Reel/1001_308.mp4` (20.06 s, 1080×1920, HEVC 10-bit, 24 fps), from `SEEDANCE_PROMPT.txt` and the 12 plates in `seedance_refs/`.
- All 12 shots present in order. No watermark, logos not mirrored, grape and raisin stay separate, rose stays fresh.

## Problems found and fixed

1. **Garbled small label print.** Seedance kept the big print (logo, headline, MHC) but wrote "MUSFIROOMS", scrambled the description line and "DERMATOLOGRALLY TESTED". The reference plate s8 itself reads "various moisturizers".
   - Fix: `_work/mh_label_fix.py`. SIFT match of the real pack cut-outs (`Insta_Olga/moisture/campaign/_assets/tube50.png`, `tube250.png`, `serum18.png`) to one middle frame per shot, then frame-to-frame tracking (jitter < 0.7 px median). Ink-only swap inside the small-print block: the frame keeps its paper, light and reflections, the ink comes from the real pack.
   - Shots restored: cloche, cream swirl, serum + tube (both packs), closing pair (50 g and 250 g). 188 frames. The cabin tube is too small to read and was left alone.
2. **White end shot only 0.4 s** (frames 471–480). Cut; the reel ends on the navy pair shot, which carries the end card. Audio trimmed with a 0.55 s fade.
3. Small splash when the drop lands in shot 8: left in, reads fine.

## Type pass

`_work/mh_reel_type.py`, Manrope Regular caps, campaign palette (navy 0E2A47, white, mist D8ECF6, cyan 5CD3F2). Headlines per shot follow the carousel: SEALED FRESH. / GRAPE OR RAISIN? / +82% HYDRATION AFTER ONE USE. / 72 HOURS LATER. / 1,000.9 PPM. / 9% GLYCERIN. / FRESH TO THE TOUCH. / FILL. THEN SEAL. / CARRY-ON SIZE. / MORNING. NIGHT. / end card SEALED FRESH., MOISTURE REPLENISHING HYALURON CREAM, 50 G · 250 G, SHOP GENOSYS.AE / GENOSYS UAE APP.

The rose shot goes day → dusk → day; its headline ink follows the background brightness (navy by day, white at dusk).

## Output

- `~/Desktop/MH_Cream_29_Reel/GENOSYS_MH_Cream_Reel_v1.mp4`: 19.625 s, 471 frames, H.264 High 4.2, BT.709, AAC 48 kHz 192k, −16.0 LUFS / −1.4 dBTP, SEI and encoder tags stripped, faststart. 18.4 MB.
- `~/Desktop/MH_Cream_29_Reel/GENOSYS_MH_Cream_Reel_cover_dark.jpg`: end-card frame on navy.

## Next

- Post the Reel to @genosys.uae.
- Web: 720×1280 copy `public/videos/mhcream-reel-web.mp4` + poster, wire product 29 page, DB video URL, revalidate.
