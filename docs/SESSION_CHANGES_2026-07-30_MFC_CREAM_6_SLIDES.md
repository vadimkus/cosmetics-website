# MULTI FUNCTIONAL ANTI-WRINKLE CREAM — 6 Marketing Slides — 2026-07-30

> **Updated re-verify 2026-07-31:** use  
> [`SESSION_CHANGES_2026-07-31_MFC_CREAM_6_SLIDES.md`](./SESSION_CHANGES_2026-07-31_MFC_CREAM_6_SLIDES.md)  
> (live API + Intertek re-checked; Peptide 6 trap cleared on cream `lib/products.ts`).

## Product (ID 32)
**GENOSYS MULTI FUNCTIONAL ANTI-WRINKLE CREAM** (MFC PROFESSIONAL)
- Size: **50g** Homecare (290 AED retail) / **250g** Professional (clinic list 210 AED)
- Form: Multi-functional anti-aging cream · Bakuchiol + Propolis + Collagen
- Visual: white squeeze tube · coral title + vertical accent bar · red GENOSYS sun · DNA + MFC PROFESSIONAL · silver neck ring on 50g
- Live: https://genosys.ae/products/32
- Image: `/images/ANT.jpg` · video `/videos/multif_cream.mp4`
- Accent (sibling artwork Pantone): **177 C** coral · **432 C** charcoal · **187 C** red → use **coral / rose** overlays

## Sources checked
### Online
- Product page + API: `https://genosys.ae/products/32` · `/api/products/32`
- Brand brochure under `public/documents/ppt/`: **no dedicated MFC cream PDF** (deck lives in Intertek PPTX)
- Paired serum: product **22** (MFS — has Peptide 6; cream does **not**)

### Local — Intertek / registration ★ primary
- `Registration/Intertek/MULTI FUNCTIONAL ANTI-WRINKLE CREAM/`
  - `GENOSYS MULTI FUNCTIONAL ANTI-WRINKLE CREAM.pptx` (12 slides) — concept, 4-pillar mechanism, Bakuchiol, Retinol vs Bakuchiol, Lipid Barrier Liposome, ECM, Propolis, Adenosine, Niacinamide
  - Formula PDF/XLSX — INCI + %
  - COA 50g (NE002): opaque white cream · pH **6.15** (5.00–7.00) · Niacinamide assay OK
  - CFS-MFC, MFS · Pics / artwork zip
- Artwork: `Registration DOC/MULTI FUNCTIONAL ANTI-WRINKLE CREAM/Artwork-GENOSYS MULTI FUNCTIONAL ANTI WRINKLE CREAM(50g).pdf` (+ 250g)
  - Function: **Anti-wrinkle, skin brightening**
  - Application: face · gently massage · **morning and evening**
  - Bottle/tube copy: bakuchiol · Retinol alternative · **propolis and collagen** · Dermatologically tested
- Formula (Registration DOC PDF — use these %):
  - **Bakuchiol 0.1%**
  - **Niacinamide 2.0%**
  - **Adenosine 0.04%**
  - **Mangifera Indica Seed Butter 0.8%**
  - **Allantoin 0.1%**
  - Propolis Extract 0.001% · Hydrolyzed Elastin / Collagen (trace) · Ceramide NP · Cholesterol · Phytosphingosine (liposome traces)

### Site copy (secondary — traps)
- Live API ingredients: Bakuchiol · Collagen/Elastin · Adenosine · Propolis · Mango Seed Butter · Niacinamide · Ceramide NP complex ✓ (aligned with formula)
- `lib/products.ts` id `32` description incorrectly lists **Anti-aging Peptide 6** — **NOT in cream Intertek formula / artwork / brand PPTX**. Do **not** put Peptide 6 on cream slides (that is serum **22** only).
- Clinical line on site (same as serum): P&K Skin Research Center, skin age index, Feb 22–May 13 2024, n=24 women 30–59 — **no % chart in cream Intertek PPTX** → cite study only, do not invent %

## Verified claims (use these)
- Helps smooth wrinkles and firm skin
- Promotes collagen synthesis (brand deck)
- Protects from oxidative stress
- Helps even skin tone / brightening (dual-function KR: anti-wrinkle + brightening)
- Bakuchiol = natural alternative to retinol (babchi / *Psoralea corylifolia*)
- Photostable vs retinol · daytime-usable (brand deck)
- Firming support: Propolis · Collagen · Elastin · Adenosine
- Lipid Barrier Liposome: Ceramide **NP** · Cholesterol · Phytosphingosine (pptx typo “Ceramide N”)
- Mango seed butter — nourishment / antioxidant pillar (pptx)
- Niacinamide — brightening
- **AM & PM** massage (artwork)
- Dermatologically tested · Made in Korea · 50g / 250g · MFC PROFESSIONAL

## Claim caution
- ❌ **Anti-aging Peptide 6** on cream — serum-only; site `products.ts` bug
- ❌ Invented clinical % improvement
- ❌ Product “pregnancy-safe” — deck contrasts retinol pregnancy limits with bakuchiol gentleness; artwork does not green-light pregnancy use
- ❌ Evening-only — artwork = morning **and** evening
- ❌ Copy Multi Vita / ND Cell / Astaxanthin claims
- Soft: “without side effects” (pptx Bakuchiol wording) → prefer “typically gentler profile vs classic retinol”
- Soft: website “reversing signs of aging” → “helps improve / visibly smooth”

## 6-slide map
| # | Slide | Purpose | Aspect |
|---|---|---|---|
| 1 | Hero | Wrinkles · firmness · Bakuchiol cream | 1:1 |
| 2 | 4-Pillar Mechanism | Firm · antioxidant · barrier · brighten | 1:1 |
| 3 | Bakuchiol vs Retinol + clinical note | Photostable · P&K citation | 1:1 |
| 4 | Ingredients | Bakuchiol · Propolis · Collagen · Liposome | 1:1 |
| 5 | Ritual / Result | AM & PM · SPF · pair serum 22 | 4:5 |
| 6 | Closing | Tube **center** (both sizes mood OK) | 1:1 |

---

# SLIDE 1 — HERO / HOOK

## Veo 3 prompt

```bash
veo3 "Cinematic product hero shot, 1:1 square. A white professional squeeze tube of anti-aging cream standing upright, fixed and sharp on the right — clean matte-white Korean dermacosmetic packaging with a subtle coral accent mood (no readable label text). Soft coral-rose luminous particles and nourishing cream-like light accents floating beside the tube, suggesting smoother wrinkles and firmer, radiant skin. Pure white seamless studio background, soft diffused beauty lighting, gentle reflection. The entire left half clean empty white space for text overlay. Photorealistic, premium Korean medical-aesthetic cosmeceutical aesthetic, refined coral-rose and ivory mood, no people, no hands, no readable text, no logos, no watermark. Very slow subtle push-in, minimal motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/mfc-cream-s1-hero.mp4
```

## Text overlay

**MULTI FUNCTIONAL ANTI-WRINKLE CREAM**  
*Smooth. Firm. Radiant.*

✦ Bakuchiol — natural retinol alternative  
✦ Propolis + Collagen firming support  
✦ Wrinkle care · tone balance · barrier comfort  
✦ Rich cream texture · AM & PM  

**50g / 250g**  
*MFC PROFESSIONAL · Made in Korea*  
*Dermatologically Tested*

---

# SLIDE 2 — 4-PILLAR ANTI-AGING MECHANISM  
*(Intertek PPTX mechanism slide — cream formula, not serum Peptide 6)*

## Veo 3 prompt

```bash
veo3 "Cinematic technology-story shot, 1:1 square. A white anti-aging cream squeeze tube positioned upper right, fixed and sharp. Across left and center, an elegant four-pillar abstract anti-aging visualization in coral-rose, soft gold, and ivory: (1) firming collagen-support glow, (2) antioxidant shield particles, (3) lipid-barrier reinforcing ribbons, (4) soft brightening light on skin tone — scientific but beautiful. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty areas on the left for mechanism text overlay. Photorealistic with subtle scientific visualization, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/mfc-cream-s2-mechanism.mp4
```

## Text overlay

**4-PILLAR ANTI-AGING CARE**  
*MFC — brand mechanism*

**① FIRMING**  
Bakuchiol · Collagen · Elastin · Adenosine  

**② ANTIOXIDANT · ANTI-INFLAMMATORY**  
Bakuchiol · Propolis · Mango seed butter  

**③ SKIN BARRIER**  
Ceramide NP · Phytosphingosine · Cholesterol · Propolis  
*(Lipid Barrier Liposome)*  

**④ BRIGHTENING**  
Niacinamide  

*Wrinkles ↓ · firmness ↑ · tone support*

---

# SLIDE 3 — BAKUCHIOL vs RETINOL + CLINICAL NOTE

## Veo 3 prompt

```bash
veo3 "Cinematic comparison-story shot, 1:1 square. A white cream squeeze tube positioned upper right, fixed and sharp. On the left, an elegant abstract dual-path visualization: one side suggesting unstable light-sensitive retinol energy that frays, the other a calm photostable botanical bakuchiol glow that stays clear and steady — coral-rose and soft sage accents, not literal plants or medical charts. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty areas for comparison text overlay. Photorealistic with subtle scientific mood, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/mfc-cream-s3-bakuchiol.mp4
```

## Text overlay

**BAKUCHIOL — RETINOL ALTERNATIVE**  
*From babchi seed · plant-derived · 0.1%*

✦ Retinol-like gene-expression pathway  
✦ Photostable — usable AM & PM  
✦ Collagen support · cell turnover · antioxidant  
✦ Typically gentler profile vs classic retinol  

**CLINICALLY STUDIED***  
Skin age index · P&K Skin Research Center  
Feb 22 – May 13, 2024 · n=24 women (30–59)  
Efficacy focus: wrinkles · skin tone balance  

*Dermatologically tested*  
*Site line for MFC/MFS range — no invented %*

---

# SLIDE 4 — KEY INGREDIENTS

## Veo 3 prompt

```bash
veo3 "Cinematic ingredient-story shot, 1:1 square. A white cream squeeze tube fixed and sharp on the right. On the left, elegant abstract botanical-scientific motifs: babchi / bakuchiol glow, golden propolis flecks, soft collagen-elastin structural threads, ceramide barrier ribbons, and mango-butter nourishment accents in coral-rose, champagne gold, and ivory. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty areas on the left for ingredient text overlay. Photorealistic, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/mfc-cream-s4-ingredients.mp4
```

## Text overlay

**ANTI-AGING CREAM COMPLEX**  
*with Bakuchiol*

**① BAKUCHIOL 0.1%**  
Natural retinol alternative  
Firm · smooth · antioxidant  

**② PROPOLIS + COLLAGEN · ELASTIN**  
Firming · comfort · structure support  

**③ LIPID BARRIER LIPOSOME**  
Ceramide NP · Cholesterol · Phytosphingosine  

**④ ADENOSINE · NIACINAMIDE 2% · MANGO SEED BUTTER**  
Wrinkle care · tone · nourishment  

---

# SLIDE 5 — RITUAL / RESULT

## Veo 3 prompt

```bash
veo3 "Cinematic skincare lifestyle shot, 4:5 portrait. A mature-adult with firm, smooth, radiant skin, soft natural glow, calm confident expression with eyes gently closed — complexion looking smoother and more nourished, not heavy makeup. Soft coral-rose and champagne lighting accents. Bright clean white studio background, soft diffused beauty lighting. A white MULTI FUNCTIONAL ANTI-WRINKLE CREAM squeeze tube softly placed in the lower right corner (no readable text). Clean empty space along the left edge and top for minimal text overlay. Photorealistic, K-beauty aesthetic, natural firm radiant skin, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 4:5 --duration 4 --resolution 1080p -o ~/Movies/Veo/mfc-cream-s5-result.mp4
```

## Text overlay

**SMOOTH. FIRM. NOURISHED.**

**①** Cleanse + toner  
**②** Serum (optional) · Multi Functional Anti-Wrinkle Serum  
 
**③** Cream · thin layer · face · gentle massage  
**④** AM & PM · SPF by day  

*Seal step after Bakuchiol serum **22***  
**50g** Homecare · **250g** Professional  
*Photostable Bakuchiol — day-friendly*

---

# SLIDE 6 — CLOSING (tube center)

## Veo 3 prompt

```bash
veo3 "Cinematic product closing shot, 1:1 square. A white professional anti-aging cream squeeze tube perfectly centered in the frame as the hero, fixed and sharp — not on the right. Soft reflection on a seamless white surface, delicate coral-rose luminous particles drifting gently around the tube. Pure white seamless studio background, soft diffused beauty lighting with warm coral accents. Clean empty space above and below the tube for closing text overlay. Photorealistic, premium Korean medical-aesthetic cosmeceutical aesthetic, refined anti-aging cream mood, no people, no hands, no readable text, no logos, no watermark. Very slow subtle push-in, minimal motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/mfc-cream-s6-closing.mp4
```

## Text overlay

**RETINOL-LIKE CARE. CREAM COMFORT.**

*Bakuchiol cream for wrinkles · firmness · glow.*

**BAKUCHIOL** · natural retinol alternative  
**PROPOLIS · COLLAGEN** · firming support  
**BARRIER LIPOSOME** · Ceramide NP complex  
**NIACINAMIDE** · tone balance  

*AM & PM · 50g / 250g*

**MULTI FUNCTIONAL ANTI-WRINKLE CREAM**  
**MFC PROFESSIONAL · Made in Korea**

---

## Pairing
Serum **22** (MFS) first → cream **32** (MFC) seal. Same Bakuchiol line; **Peptide 6 is serum-only**.  
Do not confuse with Multi Vita cream **31** or ND Cell neck cream **23**.

## Site bug to fix later (optional)
- `lib/products.ts` id 32 description: remove “Anti-aging Peptide 6” (not in cream formula/artwork).
