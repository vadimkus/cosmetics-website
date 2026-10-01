# Session changes - 1 Oct 2026 - Product 70 MESOPECIA KIT (replaces 47)

Vadim: "I do not wish to sell [47]. Develop the kit of our own: Stamp 0.25 mm, Hair Solution professional,
Scalp peeling. Discard 47, create a new item with campaign, call it Mesopecia Kit as well."

Live at https://genosys.ae/products/70 (also `/ru`, `/ar`). `/products/47` (and `/ru`, `/ar`) redirect
there with a 308.

## Product

| Field | Value |
|---|---|
| id / productNumber | `70` / `70` |
| Name | `MESOPECIA KIT` · RU `Набор MESOPECIA KIT для кожи головы` · AR `طقم MESOPECIA KIT لفروة الرأس` |
| Price | **1,100 AED** (the three bought separately: 230 + 740 + 290 = 1,260, saving 160 / 13%). One variant, no size |
| Contents | 46 HR³ MATRIX SCALP PEELING α 100 ml · 45 HR³ MATRIX HAIR SOLUTION α 4 ml × 8 (professional box) · 67 Microneedle Stamp 0.25 mm × 1 |
| Category | Scalp/Hair · New badge |

The kit has one sterile, single-use stamp, so it covers one stamped session; the page says more stamps are
sold on product 67's page. Facts come from the 45 / 46 / 67 pages only; no hair-loss, regrowth,
growth-factor or frequency claim and no DTS MG (`__tests__/data/product70LocalizedCopy.test.ts`).

## Product 47 retired

- DB `isHidden = true` (row kept so past orders resolve); static fallback in `lib/products.ts` hidden too.
- `next.config.js` redirects `/products/47`, `/ru/products/47`, `/ar/products/47` to 70.
- Companions now point at 70: `bespokePdp.tsx` (45, 46, 67, 48), `COMPANION_PRODUCT_IDS` in
  `hairSolutionCopy.ts`, `scalpPeelingCopy.ts`, `hairGentronCopy.ts`.
- "Also in: Mesopecia Kit" rows on 45 / 46 renamed; the Hair-GENTRON price table row now reads
  "stamp + peeling + eight vials" (EN/RU/AR), still AED 1,100.
- Partner catalogue professional list and the chatbot catalogue: 47 replaced by 70.
- 47's own page and copy files stay in the repo (unreachable while hidden).

## Code

- `data/product70LocalizedCopy.ts` (EN/RU/AR record copy, un-ignored in `.gitignore`)
- `components/product/mesopecia/` - page on the Eye Zone Care Kit layout, cognac / ivory palette
  (`mk-page`): concern, contents with live price / size / link for 46, 45, 67 and the "bought
  separately" arithmetic, how-to (clear, part, feed, press, finish), the stamp, one job per step,
  who it is for, details, FAQ. Campaign slides sit beside their sections.
- Registered: `bespokePdp.tsx` (page + companions 46, 45, 67), product routes (`'69'` and `'70'` added
  to the allowed bespoke list - **69 had never been in it, so its page was rendering the generic PDP**),
  `productTranslations(.Ru).ts`, `lib/products.ts`, `productBadges.ts`, `productQuickFactsCatalog.ts`,
  `localizedProductImages.ts`, `routineStepImages.ts`, `productConfig.ts`, `productCutouts.ts`
  (`cutout/70.webp`, PARTS rule re-traces the second vial), chatbot, partner catalogue.
- `lib/bespokeCopyRegistry.ts` regenerated: adds 70, and 1, 67, 69 which were missing (mobile API now
  carries their bespoke copy too; checked live).
- **MoySklad:** `lib/moyskladMesopeciaKitExplosion.ts` splits each kit line into Microneedle Stamp
  0.25 mm + HR³ MATRIX HAIR SOLUTION α + HR³ MATRIX SCALP PEELING α, the kit price shared by list
  price and adding up exactly; the line discount carries over. Wired into `lib/moysklad.ts` like the
  Power Solution boxes; order description notes the split. Test: `__tests__/lib/moyskladMesopeciaKitExplosion.test.ts`.
- `scripts/create-product-70-mesopecia-kit.ts` (applied): creates 70 (ingredients = a card per liquid
  plus both full INCI lists read from 45 and 46), hides 47.

## Campaign - "THE ROOT OF IT."

Hair starts at the scalp; the kit cares for it in three steps: clear, feed, press. Cognac `#6E3B24`
(the amber glass of all three liquids) alternating with ivory `#F1E9DE`; products only on main, 11, 12.
Workspace `~/Desktop/Insta_Olga/mesopecia70/campaign/` (`m70_*` scripts). Exports
`public/images/mesopecia_art/` (main + s1-s12, `ru/`, `ar/`; 37 files).

| # | Visual | EN headline |
|---|---|---|
| main | the three real packs on white | - |
| 1 | golden seed with fine gold roots | THE ROOT OF IT. |
| 2 | three amber glass cubes as steps | CLEAR. FEED. PRESS. |
| 3 | raked cognac sand | CLEAR THE GROUND. |
| 4 | frosted amber glass sphere | COLD, CLEAN, READY. |
| 5 | golden drop falling to the roots | FEED THE ROOT. |
| 6 | eight amber spheres, two rows of four | 8 · FRESH VIALS. |
| 7 | leather slab with a debossed dot grid | PRESS, LIFT, MOVE ON. |
| 8 | five graduated amber discs | 0.25 MM · THE SHORTEST LENGTH. |
| 9 | ivory silk tassel, every strand straight | NOTHING PULLS. |
| 10 | parallel cognac satin ribbons | PARTING BY PARTING. |
| 11 | the packs on the ivory set | THREE IN ONE KIT. |
| 12 | closing card, packs on white | THE ROOT OF IT. / MESOPECIA KIT / 3 STEPS |

- Main: CapCut re-shoot of a reference built from the real cut-outs (`m70_refs.py`), take 3. CapCut
  garbled the Hair Solution box small print (one line read "hair growth"), so `m70_fix_main.py`
  registers the real box artwork onto the take (SIFT + RANSAC) and pastes it, keeping the take's stamp;
  the stamp tip is restored from the real stamp. Every label checked at full size.
- Rejected takes: tulip bulb (read as an onion), first raked sand (barely visible, then with spa stones),
  eight small spheres (pills), first leather (texture did not read).
- No people, no hair, no needles, no tools, no city.

## Deploy and checks

- Commit `7960b89a3` (product, art, code); cut-out and this log in the follow-up commit.
- DB: product 70 created (variant `-:1100`), gallery 12; product 47 hidden. Revalidated 70 (all
  locales), /products, 45, 46, 67, 48, 69.
- Live: EN/RU/AR pages 200 on the bespoke layout with localized headline and slides; 45 / 46 / 67 link to
  70; grid lists 70, not 47; `/products/47` 308 to 70; mobile API returns 70 with `ar/` slides, 47 is 404.
- Tests: 152 suites, 1,633 passing (bespoke page counts 52 → 53).
