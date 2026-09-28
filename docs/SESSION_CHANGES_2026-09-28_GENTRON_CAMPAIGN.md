# Product 48 Hair-GENTRON — "Lights on. World off." campaign (28 Sep 2026)

Brief (Vadim): new campaign for https://genosys.ae/products/48, folder `~/Desktop/hair_gentron`,
"we are selling", remove the dossier voice, best campaign ever, CapCut for every image, never
paste, push to main, full control.

## Sources

- `~/Desktop/Drive/Genosys/Registration/Gentron/`: User's manual (EN / KR / JP), EU Declaration
  of Conformity (17 Dec 2019), IEC/EN 60335-2-32 test report, DTS MG brochures
  (`Genosys_HAIR_GENTRON.pdf`, `_2.pdf`).
- Carried: one-second hold starts ten minutes of massage + heat + all three lights + music;
  10 / 20 / 30 minutes, switches itself off, up to 30 at a time; four LED modes (red + infrared,
  blue, all three, off); air-pressure massage and heat on their own buttons; one preloaded track,
  your own over USB-C; height and width dials, front above the eyes; 1.0 kg; USB-C adaptor or
  4 × AA; no consumables; red 640 / infrared 840 / blue 420 nm (DTS MG brochure); home and
  professional use; registered design EU + China (brochure certificate page); CE (EMC + LVD),
  IEC/EN 60335-2-32; 24-month warranty; model HGHY01, made in Korea.
- Kept out, every language: hair growth / hair-loss treatment / hair cycle, mitochondria,
  circulation, nutrients or oxygen to the follicle, LED count, irradiance, "therapy". The Korean
  patent number and the 2020 invention medal were dropped: no document on file carries them.
- The brand clip `/videos/gentron.mp4` is no longer shown on the page: its captions say "Stop
  Hair Loss, Start the Light" and "The Ultimate Solution for Fuller and Healthier Hair". It is
  still the product's `videoUrl` (the app shows it) - worth replacing with a clean reel.

## Idea

LIGHTS ON. WORLD OFF. Ten minutes under the helmet: red, infrared and blue light, air-pressure
massage, warmth and your own music, hands free, and the helmet switches itself off. Sold as the
ritual plus the practical facts (one button, timer, no consumables, home or clinic).

System: the renders' own near-black, LED red `#FF4D4D` and blue `#6E97FF` tags, warm white
`#F4F5F7` Manrope ExtraBold headlines, silver `#C3C7CD` Manrope Medium body; slide 11 sits on a
light clinic wall in graphite ink. Arabic: Noto Sans Arabic, mirrored.

| # | Scene | EN | RU | AR |
|---|---|---|---|---|
| Main | helmet on stand + controller, black set, red/blue glow | (no type) | | |
| 01 | woman in a lounge chair wearing it, eyes closed | LIGHTS ON. WORLD OFF. | СВЕТ ВКЛЮЧЁН. МИР ВЫКЛЮЧЕН. | أضيئي النور. أطفئي العالم. |
| 02 | hand, thumb on the controller button | PRESS ONCE. | ОДНО НАЖАТИЕ. | ضغطة واحدة. |
| 03 | dome interior, red | RED + INFRARED. | КРАСНЫЙ + ИК. | أحمر + تحت الأحمر. |
| 04 | dome interior, blue | BLUE. | СИНИЙ. | أزرق. |
| 05 | front, red + blue pouring out | ALL THREE AT ONCE. | ВСЕ ТРИ СРАЗУ. | الثلاثة معاً. |
| 06 | profile portrait wearing it | PRESS. RELEASE. | СЖАТЬ. ОТПУСТИТЬ. | ضغط. واسترخاء. |
| 07 | helmet, tea, towel, lamp | WARMTH, IF YOU WANT IT. | ТЕПЛО, ЕСЛИ ХОТИТЕ. | دفء، إن رغبتِ. |
| 08 | controller on USB-C to a laptop playlist | BRING YOUR PLAYLIST. | ВАШ ПЛЕЙЛИСТ. | قائمتكِ الموسيقية. |
| 09 | reading on the sofa wearing it | HANDS FREE. | РУКИ СВОБОДНЫ. | يداكِ حرّتان. |
| 10 | helmet in a red countdown ring | IT STOPS ITSELF. | ВЫКЛЮЧАЕТСЯ САМ. | تتوقف وحدها. |
| 11 | clinic chair, therapist hands free | NOTHING TO REFILL. | НИЧЕГО НЕ МЕНЯТЬ. | لا شيء يُستبدل. |
| 12 | helmet + controller, spec card | YOUR TEN MINUTES. | ВАШИ ДЕСЯТЬ МИНУТ. | دقائقكِ العشر. |

## Render (CapCut, GPT Image 2.5 · 2k · Medium · 1:1)

- Workspace `~/Desktop/hair_gentron/campaign/`: `_scripts/hgt_refs.py` (Vision cut-outs of the
  desktop photos → references on white: front, three-quarter with controller, the pair for worn
  shots, controller alone, the lit-dome photos), `hgt_prompts.py` (fixed helmet / worn /
  controller descriptions in every prompt), `hgt_batch.sh`, `hgt_slides.py` + `hgt_copy.py`,
  `hgt_export.py`. Every scene is generated from a reference; nothing is pasted.
- 19 jobs, ~304 credits (1,335 → ~1,030). Second takes for framing only (CapCut centred or
  filled the frame and left no room for type): s3b, s4b, s5b, s6b, s8b, s12b.
- Picks: main main_3, 01 s1_3, 02 s2_4, 03 s3b_1, 04 s4b_3, 05 s5b_4, 06 s6b_2, 07 s7_3,
  08 s8b_2, 09 s9_3, 10 s10_2, 11 s11_4, 12 s12b_3.
- `capcut_ui.py` hardening: reference detection compares the slot with a capture of the empty
  "+" tile (a black helmet thumbnail is neither brighter nor busier than the glyph); `activate()`
  restores full screen or refuses to click (CapCut twice dropped to a window between batches and
  stray clicks landed on "Yours"); `generate` gives up after 240 s with no files (all four tiles
  failed, twice) and the batch retries once.

## Typeset

Every EN / RU / AR line 0 busy px within 28 px except RU 01 (67) and AR 09 (20), both clear on
inspection. Arabic columns can be narrower than English (`rtl_w`) because right-aligned lines
reach the far edge (02, 07). RU 01 headline in four lines, RU 03 "КРАСНЫЙ + ИК.".

## Site

- `public/images/gentron_campaign/main.jpg`, `s1-s12.jpg`, `{ru,ar}/s1-s12.jpg` (1600 px,
  progressive, 204-445 KB), registered in `lib/localizedProductImages.ts`.
- `HairGentronProductPage.tsx` on the product 3 layout: gallery localized; the amber "what the
  leaflet claims" block is now "The idea" beside s9; s2 beside the build cards; s10 replaces the
  video in How to use; "The light" (was "the numbers we will not invent") beside s5; s12 beside
  the specification table; companions eyebrow "HR³ MATRIX".
- Copy in selling voice, EN / RU / AR (`hairGentronCopy.ts`): no "we do not", "the brochure
  claims", "no efficacy study", "not registered". Stats now end on "0 consumables to replace".
  Spec adds the wavelengths and the registered design; patent and medal rows gone.
- Central RU/AR (`data/product48LocalizedCopy.ts`): descriptions without "not a medical device /
  no clinical data", warranty "24 months from purchase", `light` and `design` rows. Old dead `48`
  objects removed from `productTranslations.ts` / `productTranslationsRu.ts` (the canonical
  payload already overrode them). Quick facts: "Nothing to refill" replaces the Class III line.
  `pc48Benefit3/4` RU/AR. Hair-loss concern RU/AR: the Gentron sentence and FAQ answer.
- Chatbot: "Hair-GENTRON: Electro stimulation for hair growth" was wrong on both counts; now the
  real feature list plus "never describe it as a hair-loss treatment".
- Cut-out `cutout/48-v2.webp` from the three-quarter studio photo (the black campaign main does
  not separate), REVISION 48 → 2, manifest regenerated.
- DB via `scripts/update-product-48-campaign-gallery.ts --apply` after the deploy: image,
  gallery, EN description / details / features / benefits / howToUse / directions (the old
  howToUse claimed follicle stimulation and blood flow, and the app showed it), RU/AR
  descriptions.
- Tests: `product48LocalizedCopy.test.ts` wavelengths now stated in our own voice; new check that
  the RU/AR descriptions carry no dossier phrases.

## Live check (28 Sep 2026)

- Code `a66520bbd` live after ~6 min; DB `--apply` done (before: `/images/gen.jpg`, no gallery);
  revalidated tag `products`, `/products/48` and the hair-loss concern EN/RU/AR, `/products`
  EN/RU/AR, `/`.
- `/products/48`, `/ru/…`, `/ar/…`: "View image 13 of 13", each locale's own 12 slides, cut-out
  `48-v2`, no dossier phrase rendered. Mobile API: main + 12 slides per `x-locale`, no follicle /
  efficacy wording (the one "circulation" is the manual's diabetes contraindication).
- The page payload still carried companion 45's "No efficacy study exists for this product"
  (not rendered). The Gentron companion grid is links only, so `LINK_ONLY_COMPANIONS` in
  `bespokePdp.tsx` now includes 48, as product 3 does. `videoUrl` stays in the record payload but
  is not rendered.
