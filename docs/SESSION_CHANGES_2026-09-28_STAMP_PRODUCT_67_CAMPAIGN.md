# Product 67 GENOSYS DTS Microneedle Stamp — new product + "PRESS HERE." campaign (28 Sep 2026)

Brief (Vadim): a separate product for the stamp alone, like the roller (product 1) and in the
roller's sizes, with a campaign generated in CapCut. Selling voice, best campaign yet, push to main.

## The product

- **Product 67 "Microneedle Stamp"** (RU "Микроигольчатый штамп GENOSYS DTS", AR "ختم الوخز الدقيق
  GENOSYS DTS"), category Microneedling. DB `id` and `productNumber` are both `67`, so id-keyed and
  number-keyed lookups agree without alias entries.
- **Sizes and price:** 0.25 / 0.5 / 1.0 / 1.5 / 2.0 mm at 230 AED each, the roller's five lengths
  and price. DB variants (source of truth for the size selector, created in length order because
  the mobile API lists them as stored) plus a `data/productConfig.ts` entry like product 1. The
  customer must pick a length, as on the roller.
- **MoySklad:** five new items in the ROLLERS folder, cloned from roller 00005 (unit, VAT 5%, price
  types): `54504`-`54508` "Genosys DTS Microneedle Stamp 0.25mm ... 2.0mm", retail 230 / wholesale
  115, no buy price and no stock yet. Mapped in `lib/moysklad.ts` (`MICRONEEDLE STAMP | <size>` +
  a `Microneedle Stamp` default). Script: `scripts/moysklad-create-dts-stamp-items-20260928.js`.
- **Pairing:** the stamp page recommends the roller ("roll the face, stamp the details") on web
  (`ProductRecommendation`, `pc67*` messages EN/RU/AR) and in the mobile API map.
- Also: New badge (`lib/productBadges.ts`), concern mapping (`lib/productsDb.ts`), quick facts
  EN/RU/AR (`lib/productQuickFactsCatalog.ts`), chatbot catalogue line, static fallback
  (`lib/products.ts`), cut-out `cutout/67.webp`, localized slides registered.

## Facts used

From the DTS MG "Overview of Microneedling" deck (p. 41: 140 needles per stamp, ideal for scalp
treatment; p. 64: stamping technique recommended for longer needles on scars and wrinkles; clinical
trial slide: roller and automated stamp comparably helpful on acne scars), the CE certificate
(GENOSYS STAMP inside "sterile micro needle roller for treatment of acne scarring"), DTS MG ISO
13485, and the Korean free-sale certificate (licence 14-1318, models ST025/ST050/ST100/ST150).

Left out on purpose: 0.2 mm needle thickness, SUS 304(H), gamma indicator and 3-year shelf life
(the sources state them for the roller only), collagen and wound-healing physiology.

**Open point:** the Korean free-sale certificate lists the stamp in four lengths (0.25-1.5 mm), no
ST200. The 2.0 mm variant is live because the brief asked for the roller's sizes; confirm supply
with DTS MG, or set the 2.0 mm variant unavailable.

## Idea: "PRESS HERE."

The stamp told as letterpress: pressing straight down into paper, exactly where you put it. The
opposite of the roller, which spreads. Cotton-paper cream and ink-black grounds, GENOSYS red
`#C41230` for tags and numerals, blind-debossed dot impressions as the stamp's "print". Manrope
ExtraBold / Medium, Noto Sans Arabic for AR (feminine address, like the other campaigns).

| # | Plate | EN | RU | AR |
|---|---|---|---|---|
| Main | stamp on white, text-free | - | - | - |
| 01 | stamp on cotton paper, blind impression beside it | PRESS HERE. | НАЖМИТЕ ЗДЕСЬ. | اضغطي هنا. |
| 02 | stamp vertical beside a steel engineer's square, black | STRAIGHT DOWN. | СТРОГО ВНИЗ. | مباشرة إلى الأسفل. |
| 03 | macro of the needle head, black | 140 NEEDLES. | 140 ИГЛ. | 140 إبرة. |
| 04 | gloved hand stamping beside the smile line | EXACTLY THERE. | ТОЧНО В ЦЕЛЬ. | في المكان تماماً. |
| 05 | 3 × 4 grid of blind impressions, stamp at the row's end | PRESS. LIFT. MOVE. | НАЖАТЬ. ПОДНЯТЬ. ПЕРЕСТАВИТЬ. | اضغطي. ارفعي. انتقلي. |
| 06 | five stamps staggered on paper | FIVE LENGTHS. | ПЯТЬ ДЛИН. | خمسة أطوال. |
| 07 | stamp and steel depth gauge on dark stone | MADE FOR DEPTH. | СОЗДАН ДЛЯ ГЛУБИНЫ. | مصمم للعمق. |
| 08 | gloved hand stamping along a hair parting | BETWEEN THE HAIRS. | МЕЖДУ ВОЛОСАМИ. | بين الشعر. |
| 09 | stamp, clear vial, a drop on the needle face | OPENS THE WAY. | ОТКРЫВАЕТ ПУТЬ. | يفتح الطريق. |
| 10 | stamp sealed in a blister on a steel tray | STERILE. SEALED. SINGLE USE. | СТЕРИЛЬНО. ЗАПЕЧАТАНО. ОДНОРАЗОВО. | معقم. محكم. لاستخدام واحد. |
| 11 | roller and stamp side by side | ROLL THE FACE. STAMP THE DETAILS. | РОЛЛЕР ПО ЛИЦУ. ШТАМП ПО ДЕТАЛЯМ. | الرولر للوجه. الختم للتفاصيل. |
| 12 | stamp on white + spec card | PRESS HERE. | НАЖМИТЕ ЗДЕСЬ. | اضغطي هنا. |

## Render (CapCut, GPT Image 2.5 · 2k · 1:1)

- Workspace `~/Desktop/Insta_Olga/stamp/campaign/`: `_scripts/stamp_refs.py` (the real stamp and
  roller cut-outs placed per slide), `make_prompts.py`, `stamp_batch.sh` (CapCut driver),
  `stamp_slides.py` + `stamp_copy.py` (type EN / RU / AR), `stamp_reframe.py`, `stamp_export.py`.
  Picks in `picks/`, masters in `final/`, contact sheets `final/_contact_{en,ru,ar}.jpg`.
- Every scene is a CapCut re-shoot of its reference. Re-rolls: 05 and 06 (stamps sat too low / too
  high), 08 (scalp filled the text side), 03 (CapCut crops macros full-frame, so the take was
  reframed on its own black ground, pinned where the handle leaves the frame; no pasting).
- Two re-roll batches once ran at the same time (the queue matched `BATCH_DONE` in the other log's
  header); the mixed downloads were sorted by content before picking. Queues now match the whole
  line (`grep -qx`).

## Site

- `public/images/stamp_campaign/main.jpg` + `s1-s12.jpg` + `{ru,ar}/s1-s12.jpg` (1600 px
  progressive, q88 4:4:4 stepped down to fit ~520 KB; 37 files, 108-483 KB).
- Copy: `data/product67LocalizedCopy.ts` (EN DB fields, RU/AR translations + descriptions),
  registered in `data/productTranslations*.ts`. Standard product layout, like the roller.
- Tests: `__tests__/data/product67LocalizedCopy.test.ts` (translations, sizes = roller sizes,
  MoySklad map per length, JSON fields, no roller-only claims, quick facts, localized slides);
  `productOptions.test.ts` now lists 67 among option products.
- DB: `scripts/create-product-67-dts-stamp.ts --apply` after the deploy (checks all 37 URLs
  return 200 first): product, five variants, EN/RU/AR copy, gallery.
