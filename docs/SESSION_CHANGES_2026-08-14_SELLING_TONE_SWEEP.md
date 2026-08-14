# Selling-tone sweep — 14 Aug 2026

## What triggered it

This line shipped on product 53 (`genosys.ae/products/53`), in the footnote under
"Is it for you":

> A trace of alcohol carries the botanical extracts into the essence. Everything else
> in the pouch is there to put water back.

Nobody reading a product page wants to be told there is alcohol in the thing they were
about to buy, and the second sentence quietly reframes a firming mask as flavoured water.
It is a disclosure written for an auditor, dropped into the place on the page where the
customer is deciding. Vadim caught it on the live site.

The same voice had leaked into other pages, so this was a full sweep rather than a
one-line fix.

## The four faults found

1. **Ingredient disclosures that create suspicion** — "a trace of alcohol", "0.01% of the
   formula in total", "a tenth of a percent ... not a label sprinkle".
2. **"the manufacturer's ..."** — hands our own hero complexes (Hyaluronan 11, Phytolex SC,
   the growth factor complex) to an unnamed third party, as if we are reporting somebody
   else's claim instead of making our own.
3. **Named ingredient suppliers** — ACT Co. and BioSpectrum appeared in body copy on
   products 10, 16 and 28. Same category of leak as naming a contract manufacturer, which
   `.cursor/rules/selling-tone.mdc` already bans.
4. **Dossier vocabulary** — declared, safety assessment, batch on file, certificate of
   analysis, released against, "not rounded up to it".

Plus one benefit sold as a drawback: product 60 led its benefits list with "Boosts skin
turnover and exfoliation through **mild inflammatory response**".

## Product 53 — the trigger

`components/product/collagenmask/collagenMaskCopy.ts`, `suited.note`, all three locales.
The alcohol sentence is replaced with the standard precautions note used on the other
bespoke pages. Product 53 has no separate safety block, so this footnote is the only place
that guidance can live, and safety guidance in that slot protects the buyer instead of
arguing with them.

The rest of product 53 was re-read line by line and is clean. The "Look elsewhere if"
list stays exactly as written — talking the wrong customer out of a purchase is
deliberate and it is what makes the rest of the page believable.

## Database, 21 edits across 8 products

Applied by `scripts/fix-selling-tone-20260814.ts` (dry run by default, `--commit` to write).

| Product | Field | Fault |
|---|---|---|
| 10 SNOW O₂ CLEANSER | `ingredients` ×3 | ACT Co., BioSpectrum, "safety assessment", "0.01% in total", "the label describes" |
| 16 SNOW BOOSTER | `ingredients` | ACT Co., "the carton names it" |
| 28 INTENSIVE HYDRO SOOTHING CREAM | `ingredients` | ACT Co. |
| 29 MOISTURE REPLENISHING HYALURON CREAM | `description`, `directions` | "the manufacturer's Hyaluronan 11"; also "dermatologically tested and dermatologically tested" |
| 34 SKIN RESCUE OVERNIGHT CREAM MASK | `keyFeatures`, `ingredients` | "declared on the label", "the manufacturer names six" |
| 52 SKIN REBOOT PDRN MASK PACK | `description`, `keyFeatures`, `benefits`, `ingredients` ×2 | "declared at 1,000 ppm", "a tenth of a percent", "batch on file", "not rounded up to it" |
| 59 DEEP MOISTURIZING BEAUTY BOX | `description` ×3 | "the manufacturer's clinical test" ×2, "rather than a weekly fixture" |
| 60 Bio Meso PDRN Ampoule 60000 | `benefits` ×4 | "mild inflammatory response", three "Up to X.XXX%" figures |

Every one of the same strings was fixed in `data/productTranslations.ts` (Arabic, 17 edits)
and `data/productTranslationsRu.ts` (Russian, 16 edits).

### On the product 60 percentages

"Up to 7.446% decrease in periorbital wrinkles" became "7.4% fewer periorbital wrinkles".
The study reports a mean, not a ceiling, so "up to" was both a hedge and an understatement
of our own result. Three decimal places on a single-digit figure reads as defensiveness.
The numbers themselves are unchanged, only rounded to the precision the study supports.

## Bespoke copy modules

| File | Fix |
|---|---|
| `collagenmask/collagenMaskCopy.ts` | the alcohol note, EN/AR/RU |
| `pdrnmask/pdrnMaskCopy.ts` | "signed quali-quantitative formula", "batch on file" ×2, "declared on the carton", "a trace of lavender", and the clinical proof note |
| `revitaglow/revitaGlowCopy.ts` | "released against a fixed specification"; purity row reframed from a lab reading to "ten times cleaner than the limit allows" |
| `biomeso/biomesoCopy.ts` | "Certificates of analysis are issued per production lot" |
| `biomeso/biomesoExpertCopy.ts` | "Batch certificates are issued per production lot" |

### The product 52 clinical note

It used to open "Skin does repair itself given time, and the untreated side improved too."
True, volunteered on purpose, and it hands the shopper a reason not to buy in the first
clause. Rewritten to lead with the mask and keep the control comparison as the contrast
that favours us:

> Twenty minutes took the treated side from 13.445 back down to 8.735, most of the way to
> where it started the session. The untreated side, left to itself over the same twenty
> minutes, only reached 10.205.

Same three numbers, same honesty about the control, opposite effect on the reader.

## What was deliberately left alone

- Every "Look elsewhere if" list.
- Safety and precaution blocks, SPF layering advice, peel downtime, pregnancy referrals.
- "As printed on the carton" in ingredient-list and precaution notes — that tells the buyer
  the on-screen list matches the pack in their hand, which is a trust signal.
- `Alcohol Denat` and `Parfum` inside Full INCI lists. Those are the complete list, not a
  disclosure, and they must stay accurate.
- DTS MG everywhere, including the schema.org `manufacturer` block. DTS MG owns GENOSYS,
  so it reads as heritage rather than outsourcing.

No claim was loosened anywhere in this pass. Every percentage, ppm figure and clinical
number is unchanged; only the framing moved.

## Verification

- `npx tsc --noEmit` clean.
- All JSON-in-string fields in both translation files parse.
- Products 52 and 53 render HTTP 200 in EN, RU and AR, with zero matches for the banned
  phrases in the served HTML.

## Files changed

```
components/product/biomeso/biomesoCopy.ts
components/product/biomeso/biomesoExpertCopy.ts
components/product/collagenmask/collagenMaskCopy.ts
components/product/pdrnmask/pdrnMaskCopy.ts
components/product/revitaglow/revitaGlowCopy.ts
data/productTranslations.ts
data/productTranslationsRu.ts
scripts/fix-selling-tone-20260814.ts
```
