# Product 63 — REVITA GLOW BB CREAM — bespoke page review

Date: 13 Aug 2026
Scope: local only. `components/product/revitaglow/` is still untracked and nothing here was deployed.

## VOICE RULE FOR ALL BESPOKE PDPs — read this before editing copy

These are **sales pages**, not compliance documents. Vadim flagged on 13 Aug that they
had drifted into reading like a formula audit. The drift came from good intentions:
after finding fabricated claims elsewhere in the catalogue (product 49's invented
specs, product 43's stale INCI), the copy swung toward provable-only and started
showing its working on the page.

Accuracy and audit-voice are not the same thing. Keep the first, drop the second.

**Never put on the page:**

- The name of a testing house or filing body — "Intertek", "as declared in the
  Intertek formula filing". The customer has no idea what that is.
- Batch numbers, packaging dates, viscosity, specific gravity, net-weight variance.
- Any sentence announcing the *absence* of evidence: "no clinical study is on file",
  "we do not quote improvement percentages". Nobody asked. Not making an unsupported
  claim is the compliance requirement; confessing that you cannot make it is not.
- Defensive self-justification: "said plainly rather than dressed up", "we would
  rather say so up front", "it is a functional dose, not a trace inclusion" (which
  plants the idea that it is trace).
- Anything that undercuts the feature being paid for, e.g. "nobody applies a tinted
  base that heavily" as a comment on the SPF rating.

**Do put on the page:**

- Real numbers that sell: "Niacinamide at 2%", "SPF 38 PA+++", "four filters".
- The Korean triple-functional registration, framed as an achievement rather than a
  regulatory category.
- Full INCI — it earns its place for sensitive skin and for search. Just the list, no
  provenance framing.
- Fragrance and allergen disclosure, framed as **service** ("worth a look first if
  your skin reacts") rather than confession.
- Honest usage guidance, framed positively and normalised ("that applies to any
  tinted base, not just this one").

**Sourcing discipline still matters — it belongs in the file header comments**, where
it protects the next person editing, not in front of the customer.

Applied 13 Aug to products 63 and Bio-Meso in all three locales. Products 64 and 66
were already clean.

## Headline

The previous review of this product was wrong on two counts, because it treated the
Intertek registration dossier as the only source of truth and never opened the DTS MG
product deck. The deck is at
`~/Desktop/Glass_Skin/01-official-pdfs/GENOSYS_REVITA_GLOW_BB_CREAM.pdf` and it
supports two claims the page had been written to contradict.

### 1. "7 Herb Complex" is the manufacturer's branded name, not an error

The INCI declares **eight** botanical extracts: Camellia Sinensis, Rosmarinus
Officinalis, Centella Asiatica, Tremella Fuciformis, Chamomilla Recutita, Polygonum
Cuspidatum, Scutellaria Baicalensis, Glycyrrhiza Uralensis.

The deck's comparison table brands the marketing complex **"7 Herb Complex"**. The
reconciliation is on the deck's own ingredient pages: Tremella Fuciformis is listed
twice, once under *Skin Revitalizing* and again under *Hydrating*. Counting it as a
hydrator rather than a herb gives seven. Both numbers are defensible.

So `s1.jpg` ("10 Vitamins + 7 Herbs") and `s3.jpg` ("HERB 7 COMPLEX") are quoting the
brand correctly. The earlier note calling them wrong has been removed.

### 2. The dedicated puff is real, but it is not in this box

- Deck page 2, in the REVITA GLOW overview: "Enhanced adhesion and long-lasting wear
  with the dedicated puff."
- Deck page 6 details its micro air-cell structure, tapping motion and quadruple
  adhesion coating.
- Carton artwork (`Intertek/GENOSYS REVITA GLOW BB CREAM/.../Artwork-*.pdf`) lists a
  50 g tube, PP cap, PAO 12M and **no accessory of any kind**.
- Official application text: "Apply to the face after skincare. Blend well." The
  Korean adds `가볍게 두드려` — lightly tap to finish.

So the puff is a real GENOSYS accessory promoted for this cream, tapping is a
legitimate finishing motion, and neither is included in the carton. The FAQ used to
say "if you have read about a puff in connection with this product, that belonged to
the cushion", which flatly contradicts the manufacturer. Corrected in EN, AR and RU.

### 3. "All-day, no transfer" is deck-supported

Deck page 5, Film Gel Network: a flexible gel film that sets "without smudging or
transfer" and holds "all day without dryness". Not an Intertek claim and there is no
study behind it, so the page still does not lead with it, but it is not fabricated.

## Changes made (all local)

| File | Change |
|---|---|
| `revitaGlowCopy.ts` | Rewrote the herb-count and puff blocks in the sourcing header; both were asserting the opposite of the manufacturer deck |
| `revitaGlowCopy.ts` | Rewrote the "Is this the same as the BB Cushion?" answer in EN, AR and RU |
| `revitaGlowCopy.ts` | Moved `figureAlt` from `functions` (which has no figure) to `shadeSection` (which does) |
| `RevitaGlowProductPage.tsx` | Repointed the alt to `copy.shadeSection.figureAlt` |
| both | Added a `mechanism` section — the deck's three-layer account — in EN, AR and RU |

Typecheck clean for this component. All three locales return 200.

Note: product 63 has `videoUrl = /videos/revita.mp4`, so the shade figure renders only
as the video poster and `shadeSection.figureAlt` is a fallback path today.

## Still outstanding — gallery imagery

The five files in `public/images/revita/` are AI-generated and are **live on
production**. What survives review and what does not:

| File | Verdict |
|---|---|
| `main.jpg` | Usable. Garbles ("#D1 Snght", "VSC", "GENOSTS") only legible when zoomed |
| `s1.jpg` | "7 Herbs" is fine. Packaging text is gibberish: "#01 Snglh", "#02 Rlaurel", "PROFEEDONAL", "DERMATOLORIGALLY TESTEB" |
| `s2.jpg` | Shade copy is verbatim from deck page 3 and correct. Tube reads "BB CSEAM" / "BB 99 CREAM", both shades mislabelled "S03" |
| `s3.jpg` | "MOISTLITOL" is an invented word. "Treatment-grade coverage" overstates it — the deck rates this ★★★, the lowest of the three balms |
| `s4.jpg` | Puff is legitimate after all. Tube reads "REVITA GLOW B5 CREAM", body copy is gibberish |

Common failure across all four secondaries is fake packaging text, not false claims.

**Decision 13 Aug 2026: leave the images as they are.** The garbles are only legible
when zoomed and the claims themselves survive review. Revisit if a customer notices.

If they are ever replaced, clean official renders exist at 4629x6171 and 4711x6283:

- `~/Desktop/REVITA GLOW BB CREAM #01 BRIGHT_container.png`
- `~/Desktop/REVITA GLOW BB CREAM #02 NATURAL_container.png`
- duplicates in `~/Desktop/Glass_Skin/02-product-images/`

Per the product-gallery-images rule, any replacement needs **new filenames** —
`/images/*` is served immutable for a year, so replacing in place would leave repeat
visitors on the stale copy.

## Mechanism section (added)

The deck's three-step account (page 5) is now a section on the page, sitting between
the registered functions and the UV filter table:

1. **Smoothing and fitting** — smoothing mechanism plus high-adhesion fitting system
2. **Revitalising** — the ten vitamins, herbal complex and humectants under the coverage
3. **Film gel network** — transparent flexible gel film that sets the finish

It closes with a note stating plainly that this describes how the formula is
constructed rather than a measured outcome, since no clinical study exists for this
product. That keeps the section consistent with the rest of the page, which carries no
percentage-improvement figures anywhere.

Verified in all three locales. Arabic uses Arabic-Indic step numerals and the card grid
flows right-to-left correctly.
