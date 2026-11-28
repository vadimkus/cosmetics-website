# @genosys.uae highlight covers v2: glass icons (28 Nov 2026)

Vadim: "for instagram, use capcut and shoot icons. We need modern and interesting icons, so we are aligned with website
and our content. Think hard and then shoot and upload new icons."

## What changed

The ten highlight covers on `https://www.instagram.com/genosys.uae/` (Stories, ORDER, PROTOCOLS, APP, REVIEWS, CLINICS,
SKIN, HAIR, DEVICES, FAQ) went from flat Lucide line icons (rosewood on rose mist, 11 and 16 Oct) to **photographed
rosewood-glass sculptures** made in CapCut with GPT Image 2.5 (`2k · Medium · 1:1`). Titles, order and story contents are
untouched.

Concept: one family, same glass (`#B23A3F`), same rose-mist sweep (`#FBF1F1`), same hard light from the upper left and long
shadow, same camera. Only the object changes. It is the website's palette with the Bible's light signature (hard light,
refraction, caustics).

| Highlight | Object |
|---|---|
| Stories | camera with a concentric glass lens |
| ORDER | parcel box with a ribbon bow |
| PROTOCOLS | sealed ampoule |
| APP | phone with four glowing app tiles |
| REVIEWS | pillowy five-point star |
| CLINICS | map pin with a medical-cross opening |
| SKIN | teardrop |
| HAIR | three-strand braid with a hair tie |
| DEVICES | LED dome with a ring of lights (GENO-LED) |
| FAQ | question mark with its dot |

Rejected takes: shopping bag for ORDER (read as a padlock; the box also gives the tray a better rhythm), "lock of hair" for
HAIR (read as a flame), comb for HAIR (darker, not glassy). No text, logos or prices on any cover.

## Technical facts worth keeping

- **Covers must be square.** The web API ignores `crop_rect` on `edit_reel` and stores the upload as is; the tray draws it
  with `object-fit: fill`. A 1080 x 1920 file came out squashed (natural size 84 x 150). Uploaded 1080 x 1080 squares: every
  cover now loads at 150 x 150.
- **`edit_reel` only works through the web app's own client.** A bare `fetch` to `/api/v1/highlights/highlight:<id>/edit_reel/`
  returns 200 with the web shell as HTML and changes nothing (the 16 Oct method no longer works). Use
  `window.require('PolarisInstapi').apiPost('/api/v1/highlights/{highlight_reel_id_str}/edit_reel/', {body, path})` with
  `added_media_ids: '[]'`, `removed_media_ids: '[]'`, `title`, `source: 'self_profile'`,
  `cover: JSON.stringify({upload_id, crop_rect: '[0.0,0.0,1.0,1.0]'})` after uploading to `/rupload_igphoto/fb_uploader_<id>`.
  The web bundle shows the app's own call uses `media_id` for covers taken from the highlight's stories.
- Highlight ids (read from the profile tray): Stories `18096791696487907`, ORDER `18357330985216526`, PROTOCOLS
  `18036230525661015`, APP `17897409546406070`, REVIEWS `18031233107889445`, CLINICS `18091195769212078`, SKIN
  `18142486291610239`, HAIR `18136165150730303`, DEVICES `18091522130206382`, FAQ `17865800151678880`.
- Story counts after the edit (unchanged by it): ORDER 22, PROTOCOLS 8, APP 3, REVIEWS 14, CLINICS 5, SKIN 35, HAIR 15,
  DEVICES 6, FAQ 15, Stories 65.
- Mac note: CapCut had dropped out of full screen (Stage Manager on a 1470-pt display); `capcut_ui.activate()` restores it
  once CapCut is frontmost. Aspect ratio buttons live in the AI image panel under Settings (1:1 is the sixth).

Credits: 14 generating runs x 16 = 224 (2 pilot, 9 main, 3 re-shoots).

## Where the work lives

`~/Desktop/GENOSYS/04_INSTAGRAM/IG_Highlights/COVERS_V2_2026-11/` (README, `01_FINAL/` ten squares, prompts, all takes,
`build_covers.py`, upload template, boards incl. `LIVE_tray_before_after.jpg`, archive of the October set and of the
first stretched upload). The older plan is `docs/2026-10-11_INSTAGRAM_HIGHLIGHTS_PLAN.md`.

## Roll back

Crop the middle 1080 x 1080 square from `99_ARCHIVE/covers_v1_line_icons_2026-10/` and upload it with the same call.

## Same day: Vercel

The docs-only commit `82c38aca1` failed its first production build (`prisma migrate deploy`: `P1001 Can't reach database
server at db.prisma.io:5432`, a transient outage; the DB was reachable again minutes later and `/api/health` read
healthy). Production kept serving the previous deployment. Redeployed the same commit through the Vercel API
(`dpl_ExZkCafreCS29N7q9qFwTw7x9Pne`, READY). A retry-on-P1001 in `scripts/deploy-setup.js` would stop one DB blip from
failing a deploy; not done, no request for it.
