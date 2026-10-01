# Product 17 EyeCell EYE CONTOUR SERUM — "Tired has a shape." campaign (1 Oct 2026)

Vadim: "run new campaign for this, be creative and cool, minimalistic with message".

## Concept

Tiredness around the eye has three shapes: the line, the circle, the puff. One minimal studio still per
shape, then the serum as the one answer to all three. Two colours: pale lilac `#E3DEEB` (the under-eye
shadow) and the black of the pack `#161616`. No people, no faces, no hands, no instruments. The pack
appears only on slides 11 and 12, and there it is the real cut-out pasted over the CapCut take.

| # | Plate | Visual | Headline |
|---|---|---|---|
| 1 | lilac | a black line, a black ring, a lilac satin cushion | TIRED HAS A SHAPE. |
| 2 | black | lilac paper with one sharp crease | SHAPE ONE: THE LINE. (Adenosine 0.04%) |
| 3 | lilac | a cup-ring stain fading from dark to nothing | SHAPE TWO: THE CIRCLE. (Arbutin 2%) |
| 4 | black | a lilac satin cushion with one patted dent | SHAPE THREE: THE PUFF. |
| 5 | lilac | one pale-yellow serum drop | 2% ARBUTIN. |
| 6 | black | one lilac thread lying dead straight | 0.04% ADENOSINE. |
| 7 | lilac | concentric ripples from one gentle tap | PAT. DON'T RUB. |
| 8 | black | sheer lilac chiffon | SOFT ON THIN SKIN. (HA, panthenol, allantoin) |
| 9 | lilac | serum stroke beside cream stroke | SERUM FIRST. CREAM AFTER. |
| 10 | black | a lilac disc and a crescent | MORNING AND NIGHT. |
| 11 | lilac | the pack with line, ring and cushion | ONE SERUM. ALL THREE. |
| 12 | white | closing card, pack small lower right | TIRED HAS A SHAPE. · 10 ML |

RU: У УСТАЛОСТИ ЕСТЬ ФОРМА. AR: للتعب شكل.

## Claims

From `components/product/eyeserum/eyeserumCopy.ts` (artwork EN, Formula_up, COA): the look of deep
wrinkles, dark circles and eye puffs; Arbutin 2%, Adenosine 0.04%; hyaluronate, panthenol, allantoin for
moisture and comfort; AM and PM, gently pat; cream seals after; 10 ml; dermatologically tested; made in
Korea. Not used: 10 Years Back, Botox, peptide-complex hero, Haloxyl as an active, clinical figures,
DTS MG, lot codes.

## Files

- Workspace `~/Desktop/Insta_Olga/eyeserum17` (`e17_prompts.py`, `e17_refs.py`, `e17_batch.sh`,
  `e17_fix.py` real-pack paste, `e17_copy.py`, `e17_art.py`, `e17_export.py`).
- `public/images/eyeserum_shape/s1-s12.jpg` (+ `ru/`, `ar/`). Main unchanged (`eye_serum/main-v2.jpg`).
- `lib/products.ts` fallback gallery, `lib/localizedProductImages.ts` entry, `EyeSerumProductPage.tsx`
  section art (s1 effects, s5 engine, s7 how-to) and gallery now localized by locale.
- Test `__tests__/data/product17Campaign.test.ts`.
- DB: `scripts/update-product-17-tired-has-a-shape-20261001.ts` (HEAD-checks first). Old `eye_serum/s*.jpeg`
  kept on disk.

## Open

The DB English `benefits` / `ingredients` for product 17 still carry dossier wording ("Made in Korea by
DTS MG", "the latest batch came back inside the 2% specification"), against `selling-tone.mdc`. Not
changed in this session.
