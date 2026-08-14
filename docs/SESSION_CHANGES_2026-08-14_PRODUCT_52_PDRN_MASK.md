# Product 52 - SKIN REBOOT PDRN MASK PACK

14 August 2026. Claim audit against the DTS MG dossier, three image
replacements, and a bespoke editorial page in English, Arabic and Russian.

## The thing to read first

Two of the four images on the live product page rendered **PDRN as PORN**.

- `/images/pdrn_mask/s1.jpeg` - the inset tub reads `SKIN REDOOT PORN IWASK PACK`
- `/images/pdrn_mask/s2.jpeg` - the anti-ageing icon reads `PORN / Collagen / Elastin`

Both were AI-generated renders, both were legible at gallery thumbnail size, and
both were live on genosys.ae. The main image was a third render with
`DERMATOLOGIGAELY TESTED` on the tub body and `DERMATOLODICALLY TESTED` on the
lid, plus `Ultrs-Slim` and `Planthenol`.

`Second/pdrnnn.jpg` was already in the repo, unused, and is a real photograph of
the pack with every line spelled correctly. It is now the main image.

```
main    /images/Second/pdrnnn.jpg
gallery /images/Second/pdrn_big2.jpg, /images/Second/pdrn22.jpg
```

Script: `scripts/fix-pdrn-mask-52-images-20260814.ts`.

The old files are left on disk rather than deleted. Past order items reference
`pdrn_mask/main.jpeg` and the order emails resolve against the stored path, so
deleting it would break historical emails. Nothing on the page points at that
folder any more.

## Sources

Everything is in one folder, and unusually for this range it is complete:

```
~/Desktop/Drive/Genosys/Registration/Intertek/SKIN REBOOT PDRN MASK PACK /
  Formula-...pdf     full quali-quanti, 33 lines, signed by Narae Han, R&D manager
  Artwork-...pdf     carton text in 7 languages
  COA-...(256EE).pdf lot 256EE, pH 6.37
  CFS-...pdf         KCA certificate 2025-12072
  GENOSYS SKIN REBOOT PDRN MASK PACK .pptx   13-slide DTS MG deck
```

Because the formula is fully quantified, every percentage on the new page is a
measured figure rather than an inference from INCI position.

## What was wrong

**A fabricated ingredient.** The product record carried an ingredient card for
`Peptide Complex - stimulates collagen production`. There is no peptide in this
formula. Thirty-three lines and not one of them. The nearest things are
hydrolyzed collagen at 9.7 ppm and hydrolyzed elastin at 0.01 ppm, both traces.
Removed in all three languages.

**A missing ingredient.** The Full INCI omitted `1,2-Hexanediol`, which the
formula and the carton both declare at 1.504%. That is the seventh-largest
ingredient in the product and a known sensitiser for a small number of people,
so of everything on this page it is the error that could actually have harmed
somebody. Restored.

**Drug-register claims.** `Promotes cellular regeneration`, `accelerates skin
repair`, `promoting wound healing` and `calms inflammation` all reworded.

**An unsupported clinical claim.** `Delivers clinical-grade skin rejuvenation`
pointed at a study that measured barrier recovery, not rejuvenation.

**Three different application times.** English said 10-15 minutes, Russian said
15-20, the carton says 10-20 in all seven of its languages. The carton wins: it
is the one the customer is holding.

## What was missing, and matters more than any of the above

**Korea licenses this as a dual-function cosmetic.** The Korean panel of the
artwork registers it as a `미백·주름개선 2중 기능성 화장품` - brightening **and**
wrinkle improvement - and names the two actives the licence rests on:
`효능성분 나이아신아마이드, 아데노신`, niacinamide and adenosine.

Both are in the formula at the notified functional doses for exactly those
claims. Niacinamide 2.00%, adenosine 0.04%. Not near them. At them.

Neither ingredient was mentioned anywhere on the site. It is the strongest
verifiable thing this product has, because a regulator granted it against a
submitted formula rather than a marketing team writing it, so it now leads the
page.

**Salmon DNA is declared as a figure.** The carton prints
`Sodium DNA (1000ppm)`. The site said only "PDRN".

**There is a real clinical study.** P&K Skin Research Center, 2 May 2025,
20 women aged 20-60. Skin was deliberately irritated, then treated, with
trans-epidermal water loss measured against an untreated control on the same
panel:

|                          | untreated | treated |
| ------------------------ | --------: | ------: |
| Before                   |     7.065 |   6.965 |
| After physical stimuli   |    13.090 |  13.445 |
| After using the product  |    10.205 |   8.735 |

The manufacturer's headline is 34.969%, the treated side's fall from its own
irritated peak. The page uses that, and **also** gives the control comparison -
8.735 against 10.205, so 14% below untreated - because a shopper who notices
that the untreated side recovered too should find we had already said so.
Volunteering it is stronger than being caught omitting it, and it is still a win
for the product.

The site previously said "clinical results show significant improvement" and
gave no figure at all.

## Deliberately not used

- **The satisfaction survey.** All seven measures come back at exactly 100% on
  n=20, including "Fragrance". A row of perfect scores reads as a formality, and
  putting it next to real TEWL data would cheapen the real data.
- **Ceramides as a selling point.** Ceramide NP is 0.04 ppm, phytosphingosine is
  0.015 ppm. Named in the INCI and nowhere else.
- **Collagen and elastin as actives.** 9.7 ppm and 0.01 ppm.
- **"Green Leaf Complex".** The deck's name for the mint, green tea and thyme
  extracts, which come to 0.15 ppm combined.
- **The 44.8% figure** from our own gallery slide. It is a single subject's
  barrier-image reading, not the panel TEWL result.

## The page

`components/product/pdrnmask/`, three files:

- `pdrnMaskCopy.ts` - all copy for EN, AR and RU, plus the sourcing notes above
  and the TEWL readings as data
- `PdrnMaskProductPage.tsx` - the layout
- `pdrnmask.css` - palette override on `.cera-page.pdrnmask-page`

Structure, in order: hero, stats, **the licence**, **the study**, **the sheet**,
how to use, the formula, suited/not suited, routine, FAQ, specification,
reviews, closing band.

The licence, study and sheet sections are new to this product. The study section
draws a bar chart of the three TEWL measurement points, untreated against
treated, with each bar scaled against the highest reading in the set so the
shape of the chart is the shape of the result. It is decorative reinforcement of
the figures printed beside it, so it is hidden from assistive tech rather than
read out twice.

**Palette.** Clay, sampled off the tub itself at `#c8aca1` on the body and
`#bea79f` on the lid. The pack is one large flat field of warm dusty rose and it
fills most of every photograph we have, so taking the accent off the pack keeps
the page from fighting its own packshot. Neutrals run warm, unlike product 53:
a cool ground made the tub look grey in the closing band. It has to stay clear
of 53's crimson `#b8323a`, the other mask in the range and the page a shopper is
most likely to see next - this one is desaturated and brown-leaning where 53 is
saturated and red, so the two read as different products rather than as a set.

**Closing band** uses `imageFit="blend"`. The pack shot is on pure white, so it
multiplies into the band and the tub sits on the tint with no panel around it.

**Active ingredient cards live in the copy module, not the product record.** The
bespoke layouts get the untranslated product row, so a page reading actives from
the database shows English cards on the Arabic and Russian pages. Holding them
in `pdrnMaskCopy.ts` is what makes those two pages read in Arabic and Russian.
The Full INCI is exported from the same file and rendered `dir="ltr"` so the
Arabic page does not reverse its commas.

## Files changed

```
components/product/pdrnmask/PdrnMaskProductPage.tsx   new
components/product/pdrnmask/pdrnMaskCopy.ts           new
components/product/pdrnmask/pdrnmask.css              new
components/product/bespokePdp.tsx                     registered 52
app/products/[id]/page.tsx                            allowlist
app/ru/products/[id]/page.tsx                         allowlist + stale comment
app/ar/products/[id]/page.tsx                         allowlist + stale comment
data/productTranslations.ts                           52 block rewritten (AR)
data/productTranslationsRu.ts                         52 block rewritten (RU)
scripts/fix-pdrn-mask-52-images-20260814.ts           new, run with --commit
scripts/fix-pdrn-mask-52-claims-20260814.ts           new, run with --commit
```

## Logged for DTS MG

Seven rows under #52 in `~/Desktop/genosys-artwork-corrections.html`: the four
image rows above, and three carton/deck ingredient-prominence rows (the front
panel's "Enriched with Panthenol & Ceramide", the back panel's "Anti-Aging:
enriched with PDRN, Collagen, Elastin", and the deck's "Green Leaf Complex").
None of the three is urgent - the site copy already avoids all of them.

The carton itself is otherwise in good order: 33 INCI names all spelled
correctly, net content stated, directions consistent across seven languages, and
the Korean functional panel correct.

## Verified

`npx tsc --noEmit` clean. All three locales rendered at 1440px and checked
frame by frame, including RTL mirroring on the Arabic page.
