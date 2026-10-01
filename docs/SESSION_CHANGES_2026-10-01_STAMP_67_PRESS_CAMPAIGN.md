# Session changes 2026-10-01: product 67 stamp, "Press. Don't pull." campaign

Vadim on https://genosys.ae/products/67: "i don't like how its done. main - can stay. rest of the
slides: the shape and form of the stamp, same position always. i took pics, pls ingest stamp_2. see
geometry, box, sealed box etc. reshoot in capcut and let's do a proper campaign with stamp. no need
for heads/faces".

## What was wrong with the "Press here." set

- Every slide used one 3/4 view of a single studio photo (head lower left), turned only in plane.
- That photo's handle read as a fat white club. The real stamp (Vadim's photos) is slimmer and ivory:
  a long leaf-shaped handle tapering to a point with a moulded groove, a slim neck with a ring joint,
  a square ivory collar, and a black rectangular head under a clear cap with a metal rim. GENOSYS is
  printed on one side only; the back of the handle is plain.
- A hair-parting scene with a gloved hand, and a needle macro (both now against the campaign rules).

## Source photos

`~/Desktop/stamp_2/stamp/`, 114 WhatsApp photos (1 Oct 2026): the stamp from every side, the carton
(white, red line-art waves, PROFESSIONAL tag, red STAMP corner), the stamp in its clear blister, and
the blister's paper lid. The lid label (lot, dates) is not used, so no slide carries a lot code.

## Campaign

Line: **PRESS. DON'T PULL.** The benefit in two words each: the stamp goes straight down to the
scalp, where a roller has to travel through the hair. Two colours: GENOSYS carton red `#9C1C2B` and
warm paper `#EFEBE4`, red ink on paper, paper ink on red. Manrope Regular, Noto Sans Arabic for AR.
No heads, faces, hands, needle close-ups or instruments. The stamp takes a different position on
every slide.

| # | Plate | Stamp position / scene | EN |
|---|---|---|---|
| 1 | red | side profile, horizontal | PRESS. DON'T PULL. |
| 2 | paper | top view, head down, on a red ruled line | STRAIGHT DOWN. |
| 3 | red | diagonal, above a smooth loose lock of hair | NO TANGLES. |
| 4 | paper | top view, upright; giant 140 | 140 NEEDLES. ONE PRESS. |
| 5 | red | plain back, rising to the right; a stepped grid of its own impressions | PART. PRESS. MOVE. |
| 6 | paper | five stamps standing on their heads | FIVE LENGTHS. 0.25 · 0.5 · 1.0 · 1.5 · 2.0 MM |
| 7 | red | standing beside the HR³ vial | MADE FOR HR³. |
| 8 | paper | rising diagonal; giant 10-15 | 10-15 MINUTES. |
| 9 | red | sealed blister, upright | STERILE. SEALED. |
| 10 | paper | blister, lid peeled back at the head | ONE SESSION. ONE STAMP. |
| 11 | paper | carton + blister | MADE IN KOREA. |
| 12 | red | carton + blister, final card | PRESS. DON'T PULL. + credentials, SHOP GENOSYS.AE / GENOSYS UAE APP |

RU НАЖАТЬ. НЕ ТЯНУТЬ.; AR اضغطي. لا تسحبي. Facts from `data/product67LocalizedCopy.ts` only
(140 disk-cut needles, no wire or glue, 90°, partings 1-2 cm, 10-15 minutes, half or whole vial,
five lengths with the HR³ protocol at 0.25-0.5 mm, sterile, single use, CE, ISO 13485, Korea).

## Production

Workspace `~/Desktop/Insta_Olga/stamp67v3/`:

- `s3_cut.py`: each photo white-balanced on its own paper, cut with Vision
  (`scripts/cutout/RemoveBackground.swift`): side (67), top view (43), plain back (8), head (2),
  blister (101, 107), carton + blister (73, 77).
- `s3_refs.py`: per-slide references from those cut-outs at true relative scale, type area kept clear.
- `s3_prompts.py` + `s3_batch.sh`: CapCut GPT Image 2.5, 2k Medium 1:1, one pass of 12 jobs
  (about 80 s each). Shape, collar, cap and wordmark held on every slide.
- `s3_fix_vial.py`: slide 7's vial label was redrawn by CapCut; the real HR³ vial artwork is fitted
  to the take's vial outline and pasted.
- Picks: 1/1, 2/2, 3/2, 4/1, 5/2, 6/2, 7/1 (vial restored), 8/1, 9/4, 10/1, 11/2, 12/2.
- `s3_art.py` + `s3_copy.py`: type EN/RU/AR. Slide 3 text sits 60 px higher and the AR column ends
  at 860 px there, clear of the stamp head.

## Site

- `public/images/stamp_press/s1-s12.jpg` + `ru/` + `ar/` (1600 px, q88 4:4:4 progressive,
  138-309 KB). New folder because `/images` is immutable. Main stays `stamp_scalp/main.jpg`.
- `lib/localizedProductImages.ts` (stamp_press entry), `lib/products.ts` fallback gallery,
  `components/product/stamp/StampProductPage.tsx` (section figures: why s2/s3/s4/s1, pairing s7,
  lengths s6, how-to s5, session s8/s9, details s10/s11/s12), test paths.
- DB: `scripts/update-product-67-press-campaign-20261001.ts` (images field only, after all 36 URLs
  return 200).
