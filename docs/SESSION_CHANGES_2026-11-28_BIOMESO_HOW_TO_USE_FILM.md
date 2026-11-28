# BIO-MESO 65: "How to use it" film on the product page (28 Nov 2026)

Product 65 (BIO-MESO PDRN Homecare Ampoule 5000), EN / RU / AR. Live after the push of 28 Nov 2026.

## What it is

In the "How to use it" section the right-hand column used to hold the static slide `S7` ("Once a week. In the evening.").
It now holds a three-film player, shot in CapCut (GPT Image 2.5 keyframes, Dreamina Seedance 2.5 motion), one film per
step of the weekly evening: **spread**, **press and roll**, **mask**. The four step cards on the left stay and the card
that matches the film now playing lights up. `S7` stays in the gallery strip (the gallery is the DB `images` field, untouched).

The player has every control on screen (Vadim, 28 Nov: he could not tell how to operate the first prototype, which was
scroll-only and code-drawn): numbered step tabs, previous / next arrows, a Play / Pause pill, a progress bar per step, a
hint line that names the keys and the swipe. Nothing depends on scroll. Details below.

## Why these three films and not the mechanism

The first cut was spread, **micro-channels opening with PDRN pearls travelling in**, and **the surface renewing by day six**.
Films 2 and 3 of that cut were dropped before release, because they depict what the 21 Aug 2026 audit removed from this
product (`docs/SESSION_CHANGES_2026-08-21_PRODUCT_65_LOCALIZATION_AUDIT.md`: direct penetration, micro-channels, bio-peeling,
renewal, a fixed six-day course). The RU and AR pages are written to that audit (`AUDITED_RU` / `AUDITED_AR` in
`biomesoCopy.ts`) and the 27 Oct Instagram claim file keeps the boundary. **A film is a claim too.** So the page films show
the documented method only: about 3 ml, spread evenly, press with palms or fingers, rolling movements for around 30 seconds,
then the Skin Reboot PDRN Mask for 10 to 15 minutes. The captions reuse the audited wording.

The English page copy (`EN` in `biomesoCopy.ts`, the S3 slide, the "Four things happen at once" cards, the six-day timeline)
still carries the pre-audit mechanism claims. That is an existing gap, not touched here.
The dropped films are kept in `~/Desktop/GENOSYS/05_VIDEO/BIOMESO_HOW_IT_WORKS_2026-11/99_ARCHIVE/claims_outside_audit_2026-11-28/`.

## Where things are

| What | Path |
|---|---|
| Player | `components/product/biomeso/BioMesoHowFilm.tsx` + `biomesoHowFilm.css` |
| Words (EN, RU, AR), media paths, card mapping | `components/product/biomeso/biomesoHowFilmCopy.ts` |
| Wiring | `BioMesoProductPage.tsx`: `HOMECARE_CONFIG.howFilmMedia`; the Expert 60000 page has none and keeps its slide |
| Films | `public/videos/biomeso-how/how-{1-spread,2-press,3-mask}-v1.mp4` (834x1112, 24 fps, 5 s, no audio, 1.4 / 1.5 / 0.9 MB) |
| Posters (first frame of each film) | `public/images/biomeso_how/how-{1-spread,2-press,3-mask}-v1.jpg` |
| Guard test | `__tests__/data/biomesoHowFilmCopy.test.ts` (same steps in 3 languages, method wording, the audit's forbidden claims, files exist and differ) |
| Campaign folder (brief, prompts, takes, checks) | `~/Desktop/GENOSYS/05_VIDEO/BIOMESO_HOW_IT_WORKS_2026-11/` (README there) |

`/images` and `/videos` are cached for a year: a re-shot film needs a new file name (`-v2`), never an overwrite.

## The three films (HUMAN, then EXTREME MACRO, then OBJECT)

All shot in CapCut: GPT Image 2.5 keyframe (2k, Medium, 3:4), then Dreamina Seedance 2.5 image to video (5 s, 720p, 3:4,
audio off), clean "Without watermark" downloads from the Library. Photoreal live-action prompts, no drawn reference anywhere.

| Step | Film | Shot |
|---|---|---|
| Spread | `how-1-spread-v1` | A woman's bare hand glides a clear gel film down her cheek to the jaw (face cropped under the eyes) |
| Press and roll | `how-2-press-v1` | Macro: finger pads pressed on the jawline, the skin giving softly, gel gloss shifting in the light, no face features |
| Mask | `how-3-mask-v1` | One folded, damp white sheet mask on a bone plate, one corner turned back, a droplet sliding along the rim |

Self-check of every take at full size (physics, hands, continuity, brief, photoreal): film 3 was shot twice, because the first
two takes carried a four-point star glint on the droplet (it reads as AI sparkle); the retake prompt bans sparkle and flare and the
picked take is clean. No needles or instruments, no Dubai, no price, no pack, no text in any frame. Cost of this part of the
project: about 2,330 CapCut credits (images 16 per run, Seedance 370 per run of two takes).

## How the player behaves

- Plays by itself only while the picture is at least half on screen and the tab is visible; runs 1, 2, 3, stops on a clean last
  frame and the pill becomes Replay. The films start loading only when the picture is within about 900 px of the screen
  (the poster is the film's first frame, so nothing jumps). Nothing is preloaded in the page head.
- Click or tap the picture to pause, swipe it, arrow keys (they follow the reading direction in Arabic), Home, End, Space.
- Reduced motion or data saver: nothing plays until Play is pressed. A film that fails to load holds its poster about
  four seconds, then the show moves on.
- RTL: the bars, arrows, swipe direction and key arrows mirror; letter spacing is switched off on the Arabic tab labels
  (tracking breaks Arabic joins).
- The picture is capped by window height so the picture and the tabs sit on one laptop screen.

## Checks

`~/Desktop/GENOSYS/05_VIDEO/BIOMESO_HOW_IT_WORKS_2026-11/04_WORK/WEB_TEST/verify_page.mjs [desktop|phone|all] [en|ru|ar] [BASE]`:
autoplay, pause / resume, arrows, tabs, bars, keys, swipe, tap, a full run to Replay, the film really paints above the
poster, the pause mark above the film, the matching card lights up, hints, no sideways scroll, no mechanism wording in the
captions, no console errors; desktop Chrome (H.264) and iPhone WebKit. Run against the dev server and then against
`https://genosys.ae`.

**Result, 28 Nov 2026:** commit `05ef15e78` pushed to main, Vercel deployment `dpl_6gMQR8LKaxBVw27Y97yREJ6eqhza` READY in about
5.5 minutes and aliased to genosys.ae. The three films and three posters answer 200 (`video/mp4`, `image/jpeg`, `Accept-Ranges:
bytes`), and `/products/65`, `/ru/products/65` and `/ar/products/65` reference all of them. `verify_page.mjs`: 64 of 64 checks
per language (desktop Chrome and iPhone WebKit), 192 of 192 on the dev server before the push and 192 of 192 on `https://genosys.ae`
after it. On narrow phones (360, 375 and 390 px wide) every tab label stays on two lines or fewer in all three languages (the
Russian "Прижать и роллинг" needed tighter tab padding under 480 px). `npx jest __tests__/data`: 461 of 461.

## The iOS and Android app (added the same evening)

Vadim, 22:12: "its working on mobile web but not working on IOS app". The app is native (`~/genosys-mobile-app`, Expo, runtime
1.13.0) and never drew the website's page, so the films did not exist there. They do now, in the same words and with the same
behaviour.

- **API** (this repo, commit `a6029fca8`): `GET /api/mobile/products/65` sends the films on the `howTo` bespoke block as
  `film` (steps, poster and film paths, which card lights up, the player's labels), read from the module the web player reads
  (`lib/mobileHowFilm.ts`, wired in `lib/bespokeContent.ts`), in the buyer's language, about 1.4 KB. Additive: older apps ignore
  it. `__tests__/lib/bespokeContentFilm.test.ts` keeps it plain JSON, tied to the web module and its files, and off every other
  product.
- **App** (`genosys-mobile-app` commit `15a4af6`, its own note `docs/SESSION_CHANGES_2026-11-28_HOW_FILM_NATIVE_OTA.md`):
  `components/product/HowFilm.js` + `utils/howFilm.js`, shipped as an OTA update to runtime 1.13.0, iOS group
  `df2d113b-f24a-475d-8bc7-6d6e4dc08421`, Android group `643d07ab-b1d4-491a-bb48-2213318d246a`. Open the app twice to get it.
- **Kill switch:** remove `'65'` from `FILM_PRODUCTS` in `lib/mobileHowFilm.ts` and the film disappears from the app on the next
  product load (the step cards stay). A re-shot film or a corrected caption also reaches the app through this module with no
  update; a re-shot film needs a new file name (`-v2`) as on the web.
- **Checked:** the real app components run in Chrome through react-native-web against the live payload and the real films
  (`~/Desktop/GENOSYS/05_VIDEO/BIOMESO_HOW_IT_WORKS_2026-11/04_WORK/APP_TEST/verify_app.mjs`): 54 checks in English (with a film
  that 404s, and Reduce Motion), 48 in Russian, 48 in Arabic; the app's own smoke tests and `verify:release` pass; the iOS bundle
  compiles. **Not run on a phone or a simulator** (no Xcode on this Mac), so the native side is reasoned from the app's shipped
  video code, not observed.

## Also fixed (found while testing in Russian)

`proxy.ts` sent any request without a locale prefix to `/ru/...` or `/ar/...` when `Accept-Language` contained `ru` or `ar`
(or `NEXT_LOCALE` was `ru` / `ar`). `/fonts/*` and `/favicon/*` were not excluded, so on production
`/fonts/9c72aa0f40e4eef8.woff2` answered **307 to `/ru/fonts/...` (404)**, with the one-year immutable cache header from
`next.config.js`. Russian and Arabic visitors lost the Inter font files and the tab icon (confirmed on production: Inter
`error` in a Russian browser, `loaded` in an English one). Fix: `fonts` and `favicon/` added to the matcher exclusion and to
the redirect condition. Browsers that already cached the 307 keep it until it expires.

Live after the deploy: the font and the favicon answer 200 under a Russian or Arabic `Accept-Language` and under
`NEXT_LOCALE=ru`; in a Russian and an Arabic browser Inter and Cormorant Garamond report `loaded` and no font or favicon
request returns a 3xx or 4xx; pages still redirect by language (`/products/65` with `ru-RU` gives 307 to `/ru/products/65`).
