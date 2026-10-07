# Session changes: product 10 SNOW O₂ "START CLEAN." reel on the page (7 Oct 2026)

## What changed

- `public/videos/snowo2-reel-web.mp4`: 720×1280 H.264 web copy (1.9 MB, 18.0 s) of the Instagram reel
  `~/Desktop/new_prompt/IG_POST/REEL/START_CLEAN_18s_reel_v4_snap.mp4` (Seedance 2.5 film with Vadim, Foley clicks
  and the snap).
- `public/images/snowo2_campaign/reel-poster.jpg`: 9:16 poster, the shirt-button macro (the reel's Instagram cover).
- `data/productConfig.ts` and `lib/products.ts`: product 10 `videoUrl` `/videos/cleanser.mp4` →
  `/videos/snowo2-reel-web.mp4`. Config wins over the DB in the mobile API, so the app shows the reel too (no OTA).
- DB: `npx tsx --env-file=.env.local scripts/set-product-video.ts 10 /videos/snowo2-reel-web.mp4`. The web page
  reads the DB `videoUrl`, so without this step it kept playing `cleanser.mp4`. Then `/api/revalidate` for
  `/products/10`, `/ru/products/10`, `/ar/products/10`; live HTML in all three shows the reel and poster.
- `SnowO2ProductPage.tsx`: the how-to video gets the poster. Not muted: the clicks and the snap carry the film.
- Video title (`howTo.videoTitle`): EN "Start clean, in 18 seconds", RU "Чистый старт за 18 секунд",
  AR "بداية نظيفة في 18 ثانية" (RU/AR live in `snowo2LocalizedCopy.ts`, which overrides `snowo2Copy.ts`).

## Note

The soundtrack is the Dexter title music, used without a licence (Olga's brief assumes a licensed track).
Swap the audio if a rights holder objects.
