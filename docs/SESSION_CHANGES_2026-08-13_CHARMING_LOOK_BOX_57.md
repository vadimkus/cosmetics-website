# Charming Look Beauty Box (product 57) - claims audit, copy fixes and bespoke page

Date: 13 August 2026

## What this covers

Product 57 is the fifth bespoke product page and the third beauty box built on the
shared `BeautyBoxProductPage` layout. Two separate pieces of work:

1. **Claims corrections**, applied to the live database and to the Russian and
   Arabic locale files. These affect the standard PDP and the mobile app today.
2. **The bespoke page**, which stays local along with the other bespoke layouts
   until the whole set is deployed together.

## The box

Five full retail sizes, AED 1,520 bought separately and AED 1,292 as the box, so
the saving is AED 228.

| Step | Product | Id | Size |
|---|---|---|---|
| Cleanse | Snow O₂ | 10 | 180ml |
| Tone | Snow Booster | 16 | 200ml |
| Cover, protect, treat | Skin Caring Blemish Balm Cushion | 41 | 15g + 15g refill |
| End of day | Skin Defender Lip & Eye Makeup Remover | 11 | 200ml |
| Overnight, 1-2× a week | Skin Rescue Overnight Cream Mask | 34 | 100g |

## Claims corrected

Verified against the signed artwork, the COAs, the formula sheets and the DTS MG
decks under `Registration/Intertek`.

| Was | Now | Source |
|---|---|---|
| Overnight mask 100ml | 100g | `Artwork-GENOSYS SKIN RESCUE OVERNIGHT CREAM MASK.pdf` |
| Cushion "(1pcs)", no refill mentioned | 15g plus a sealed 15g refill | Cushion artwork and carton |
| Cushion key ingredients listed as "SPF 50+ protection, natural coverage formula" | Repairing Pep9 complex, niacinamide 2%, adenosine 0.04%, glutathione, five UV filters | `Formula-GENOSYS SKIN CARING BLEMISH BALM CUSHION #03.pdf` |
| Cushion "SPF 50 / PA++++" | SPF 50+ PA++++ | Carton |
| Remover "10 Vitamin Complex" | Vita 10 Complex | Remover deck and carton |
| Remover "ophthalmologically tested" | removed, no such document exists | - |
| Mask growth factor "PIGF" | PlGF | Mask deck, INCI mapping |
| Mask "clinically proven" | removed, no study on file | - |
| Mask usage frequency contradicted the deck | once or twice a week | Mask deck |
| Snow O₂ "clean make-up dirts" | grammatical rewrite | - |

Applied by `scripts/fix-charming-look-box-57-claims-20260813.ts` to product 57
and to members 11, 34 and 41. Locale files patched to match.

### Routine step titles

Two step titles in `messages/{en,ru,ar}.json` named the wrong product:

- `routineMakeupRemoverTitle` read "Professional Biphasic Make Up Remover" but
  links to product 11, which is the **Skin Defender Lip & Eye Makeup Remover**.
- `routineBBCushionTitle` omitted the SPF rating that the carton prints, so it is
  now "Skin Caring Blemish Balm Cushion [SPF 50+ PA++++]".

These are live-facing on every standard PDP that shows a routine, not only on this box.

### Routine contents

`PRODUCT_ROUTINES['57']` listed three of the five products, which would have
priced a five-product box off three prices once the box page started deriving its
contents and its saving from the routine. All five are now listed, ordered to the
two rules the rest of the file keeps: a remover comes before the cleanser, and
complexion make-up is the last step.

## Dermatological testing claim, three boxes

The claim "every item dermatologically tested" was checked carton by carton.

| Box | Verdict |
|---|---|
| 57 Charming Look | **Four of five.** The Skin Rescue Overnight Cream Mask carton carries no mark. Copy now names the four that do. |
| 58 Anti-Aging | Accurate, all five cartons carry the mark. Left as it was. |
| 59 Deep Moisturizing | **Four of five.** The Soothing Bomb Sea Algae Mask pouch carries no mark. Copy now names the four that do. |

Fixed in all three languages on 57 and 59: hero bullet, badge, stat label,
suitability note and the details Testing row.

## Arabic bidi fixes

Technical tokens were being reordered by the right-to-left paragraph direction:
`SPF50+` printed as `+SPF50` and `2 × 15 غ` printed reversed.

- `BeautyBoxProductPage.tsx`: `dir="auto"` on the stat value, the evidence card
  value and the fact chips. Short mixed-script tokens now take their direction
  from their own first strong character. This benefits every beauty box page.
- `charmingLook.ts`: every `SPF50+` and `PA++++` token in the Arabic block is
  wrapped in U+2066/U+2069 isolates, and the Arabic stat labels open with an
  Arabic word rather than a Latin one.
- Cushion units in the Arabic copy are `غ` rather than `g` so the chips do not
  lead with a Latin character.

## Copy tone

Four passages argued against the product rather than describing it, which was the
same problem flagged on box 58:

- "A cushion is not a substitute for sunscreen" now leads with the licence it
  actually holds and then gives the practical layering advice.
- The FAQ question "Can the cushion replace my sunscreen?" is now "How much sun
  protection does the cushion give?" and the answer opens with the five filters.
- The details Sun protection row and the Korea stat label were rewritten the
  same way.

## Files changed

Pushed:

- `scripts/fix-charming-look-box-57-claims-20260813.ts`
- `data/productTranslations.ts`, `data/productTranslationsRu.ts`
- `messages/en.json`, `messages/ru.json`, `messages/ar.json` (two keys each)

Local until the bespoke set deploys:

- `components/product/beautybox/copy/charmingLook.ts`
- `components/product/beautybox/beautyBoxes.ts`, `beautybox.css` (`bb-mauve` palette)
- `components/product/beautybox/BeautyBoxProductPage.tsx`
- `components/product/beautybox/copy/deepMoisturizing.ts`
- `components/product/bespokePdp.tsx`
- `app/products/[id]/page.tsx` and the `ru` and `ar` equivalents
- `lib/productRoutines.ts`

## Artwork

Five rows added to `~/Desktop/genosys-artwork-corrections.html` under product 57.
The single image `/images/bbbox_charming/main.jpeg` is a render with invented
label text. Two of the four product codes on it are wrong, and those are the rows
to fix first because the code is how a clinic reorders:

- toner prints `SRT`, the carton prints **SBT**
- remover prints `DMS`, the carton prints **DMR**

`SOC` on the cleanser and `ROM` on the mask are both correct. The cleanser and
toner product names are invented (`SWOW O2`, `SHOW SOOSTER`); the remover and
mask names are correct. The cushion is shown without its refill, which
contradicts the 15g + 15g the page states in three languages.

## Open

- The P&K skin age index study for box 58 is still unsourced. Ask DTS MG.
- Arabic PDPs print sizes as `200ml` and `100g` rather than Arabic units. This is
  catalogue-wide and predates this work.
