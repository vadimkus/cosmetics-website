# Product 47 — HR³ MATRIX MESOPECIA KIT: bespoke page built

Last of the five HR³ MATRIX scalp pages, and the only one whose product has no formula
of its own. See `SESSION_CHANGES_2026-08-17_HR3_MATRIX_LINE_SOURCE_AUDIT.md` for the
line-wide audit this closes out.

## What was built

| File | |
|---|---|
| `components/product/hr3/mesopeciaKitCopy.ts` | EN / AR / RU copy |
| `components/product/hr3/MesopeciaKitProductPage.tsx` | layout |
| `components/product/bespokePdp.tsx` | registered `'47'`, companions `['45','46','43','44']` |
| `app/products/[id]/page.tsx` + `ar` + `ru` | opted `'47'` into the bespoke list |

The page defers rather than restates: the peeling is product 46 and the solution is
product 45, so the chemistry lives on their pages and this one spends itself on what the
box actually adds — the applicator, the shorter course, and the arithmetic.

## ★ The applicator is a roller, not a stamp

The record written earlier in the day called it a stamp and told the customer to "stamp
directly on the scalp". **The product photograph shows a drum roller on a handle.** The
registered artwork cannot decide either, and uses both words in the same document:

| Panel | Wording |
|---|---|
| Contents line | `GENOSYS STAMP(ROLLER)` |
| Korean contents | `제노시스 스템프(롤러)` — GENOSYS stamp (roller) |
| Precaution | "Do not use **roller(stamp)** if you have metal allergy…" |
| Step 3 | "**roll (stamp)** on the scalp directly. While **rolling(stamping)**…" |
| French | "L'utilisation de **roller** est interdite…" |
| German | "…sollten Sie den **Roller** nicht verwenden" |

The page and the record now say roller, note that the carton also says stamp, and use
**roll** as the verb rather than press. A page instructing someone to press a roller is a
page written off a spec sheet instead of off the product.

Fixed by `scripts/fix-product-47-roller-not-stamp-20260818.ts`.

## ★ The carton's English panel makes the drug claim

Verbatim, from the registered artwork:

> HR³ MATRIX MESOPECIA KIT is an innovative hair and scalp treatment system invented to
> **prevent hair loss and promote hair regrowth and restoration by inhibiting the
> fundamental causes of hair loss.**

That is the source of the "prevent hair loss and promote healthy hair regrowth" line
stripped from our record earlier today. **It did not come from a translation — it is on
the box, in English.** The Russian panel goes further: the kit is titled
*«Набор для борьбы с выпадением волос»* (a kit for fighting hair loss), the peeling is
*«мягкого действия»* (gentle) and *«дезинфицирующее»* (disinfecting), and the ampoule
*«оказывает эффект ангиогенеза»* (has an angiogenesis effect) and *«подавляет выпадение
волос»* (suppresses hair loss). Gentle and disinfecting were both already refused on
product 46's page.

Following the precedent set on product 44's dandruff claim, the page **refuses this out
loud rather than staying silent**, because the customer will be holding the carton that
makes it. It quotes the sentence in the amber block and answers it again in the FAQ.
`productDetails.cartonClaimNotCarried` records it in the database so the next person to
read the record does not "restore" it from the packaging.

Running total of documents in this line asserting a drug mechanism: tonic Russian panel,
Hair Solution deck (×3 slides), Scalp Peeling deck (×2 slides), **and now the kit carton
in English and Russian.**

## ★ The 0.5 mm is on the Russian panel only

`Дермаштамп 0,5 мм`. **The English panel gives no needle depth at all.** Same
recovered-from-a-translated-panel pattern as the shampoo's three-minute dwell (44) and
the ampoule's 1–2 cm partings (45). The page states the figure and says where it comes
from, because depth is the one number that decides whether a device is cosmetic.

Also recovered from the **Arabic** panel and absent from the English one: dry with a
dryer for **two to five minutes** after the peeling, and the sequence may be **repeated
after ten minutes** if needed. No interval between sessions is given on any panel, so the
page does not invent one.

## ★ Two INCI lists were silently invisible on the live site

A catalogue-wide check found that every bespoke layout looks up its full ingredient list
by the exact key `Full INCI`, and:

| Product | Stored as | Result |
|---|---|---|
| 47 items across the catalogue | `Full INCI` | renders |
| **45 HAIR SOLUTION α** | `Full ingredient list (INCI)` | **hidden** |
| **46 SCALP PEELING α** | `Full ingredient list (INCI)` | **hidden** |

Both pages went live yesterday with their full ingredient list rendering nowhere. Renamed
to `Full INCI` and verified live on both.

Separately, product 47's `ingredients` had been written as **one plain string** where
every other product stores a JSON array, so the INCI just transcribed off the carton to
fill an empty field would have parsed to nothing. Restructured into the standard array,
with **two** INCI entries rather than one (`Full INCI — Scalp Peeling α`,
`Full INCI — Hair Solution α`) since the kit carries two liquids. The page looks them up
by prefix and renders an accordion each.

Both fixes in `scripts/update-product-47-ingredients-structure-20260818.ts`.

**Still open:** product 44 (MEDI SCALP SHAMPOO α) has **no INCI entry at all**. Its full
list has not been transcribed. Products 50, 61 and 64 also have none, but those are kits
and devices where it is not expected.

## The arithmetic section, and why it is not a saving

| | AED |
|---|---|
| Scalp Peeling α 100 ml, on its own | 290 |
| Hair Solution α, six vials pro-rata (740 ÷ 8 × 6) | 555 |
| **The two liquids** | **845** |
| **This kit** | **1,100** |
| **Which puts the roller at** | **255** |

The page prints this and then says the other half out loud: **290 + 740 = 1,030** buys
both liquids with **eight** vials rather than six — less money and more product than the
kit, without the roller.

It also anchors the 255 against **product 1, the standalone 0.25 mm Microneedle Roller at
AED 230** (confirmed live in the public catalogue), so the figure is interpretable rather
than bare. Quoted explicitly as a price comparison and **not** as a substitute, because
0.25 mm is a shallower needle sold for the face. So the kit is right if you need an applicator, and product 45
standalone is right if you want a full course. Companions are ordered `45, 46, 43, 44`
to match that advice.

**Price visibility:** the table is gated behind `canSeePrices`, like every other price on
the site. The FAQ answer that quotes the same figures is gated too, via a `needsPrices`
flag on the copy item — otherwise an FAQ would have been the one place list prices leaked
to signed-out visitors. Verified absent from the signed-out HTML in all three languages.

## Other record corrections carried into the page

- Vials are **4 ml × 6**, not 5 ml. Matches the correction applied to product 45.
- Roller contraindications — **metal allergy, keloid-prone skin, dermatitis** — were
  nowhere on the site, on a product whose entire mechanism is puncturing skin. Now in the
  roller section and again in the precautions.
- The carton gives no number of sessions the roller is good for. Stated as unknown, with
  the advice to treat it as a personal item and stop when the needles stop feeling sharp.

## Verified

- `tsc --noEmit` and `eslint` clean.
- `/products/47`, `/ar/products/47`, `/ru/products/47` all 200, with the roller wording,
  0.5 mm, the contraindications, both INCI accordions and the carton quote present, and
  no banned claim in any of the three.
- `/products/45` and `/products/46` now render their full ingredient lists.

## Asset gap

**One image**, `/images/meso.jpg` — a good one, showing the carton, the roller, the
peeling bottle and all six vials, so the six-not-eight point is visible rather than only
stated. But `images` is null, so the gallery is a single frame where the sibling pages
have six. This is the thinnest gallery in the line.
