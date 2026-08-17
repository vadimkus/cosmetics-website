# MULTI FUNCTIONAL ANTI-WRINKLE SERUM — 6 Marketing Slides — 2026-07-28

> **Updated re-verify 2026-08-01:** use  
> [`SESSION_CHANGES_2026-08-01_MFS_SERUM_6_SLIDES.md`](./SESSION_CHANGES_2026-08-01_MFS_SERUM_6_SLIDES.md)

## Product (ID 22)
**GENOSYS MULTI FUNCTIONAL ANTI-WRINKLE SERUM** (MFS PROFESSIONAL)
- Size: **30ml** (330 AED)
- Form: Anti-aging serum · Bakuchiol + Anti-aging Peptide 6
- Visual: dark charcoal glass dropper · matte black bulb · silver GENOSYS collar · white label
- Live: https://genosys.ae/products/22
- Images: `/images/multif_serum/main.jpeg` + gallery `s1`–`s6` (see SESSION_CHANGES_2026-07-28_PRODUCT_22_MULTIF_SERUM_IMAGES.md)
- Accent (artwork Pantone): **432 C** charcoal · **187 C** red · **177 C** coral → use **coral / deep rose** for overlays

## Sources checked
### Online
- Product page + API: `https://genosys.ae/products/22` · `/api/products/22`
- Training/docs route for serum brochure PDF: **not published** under `public/documents/ppt/` (Multi Vita PDFs exist; this line’s brand deck lives in Intertek PPTX)
- Paired cream page/API id **32** (same Bakuchiol / P&K study language in `lib/products.ts`)

### Local — Intertek / registration ★ primary
- `Registration/Intertek/MULTI FUNCTIONAL ANTI-WRINKLE SERUM/`
  - `GENOSYS MULTI FUNCTIONAL ANTI-WRINKLE SERUM.pptx` (12 slides) — concept, mechanism, Bakuchiol, Peptide 6, liposome, ECM, propolis, adenosine, niacinamide
  - Formula PDF/XLSX — INCI + % (Bakuchiol **0.1%**, Niacinamide **2%**, Adenosine **0.04%**, Panthenol **0.1%**)
  - COA · CFS (MFC/MFS) · Pics
- Artwork: `Registration DOC/MULTI FUNCTIONAL ANTI-WRINKLE SERUM/Artwork-GENOSYS MULTI FUNCTIONAL ANTI-WIRINKLE SERUM.pdf`
  - AM **&** evening · Function anti-wrinkle · MFS copy with Bakuchiol + peptide complex
- Bottle OCR (`multiserum1.jpg`): **MFS PROFESSIONAL** · “MFS improves wrinkles…” · Dermatologically tested

### Site copy (secondary)
- `lib/products.ts` id `22`: P&K Skin Research Center clinical on **skin age index**, Feb 22–May 13 2024, **24** women aged 30–59; efficacy on wrinkles + skin tone balance
- Live How-to says “preferably evening” — **override with artwork AM & PM** + brand “photostable / can be used during the day”

## Verified claims (use these)
- Visibly smooth wrinkles · reinforce firmness
- Bakuchiol = natural alternative to retinol (babchi / *Psoralea corylifolia*)
- Photostable vs retinol · daytime-usable (brand deck)
- Retinol-like gene-expression analogy; brand deck cites wrinkle surface-area reduction comparable to retinol (ingredient comparative research — not a product % chart)
- Anti-aging Peptide 6 (six named peptides — see below)
- Lipid Barrier Liposome: Ceramide **NP** · Cholesterol · Phytosphingosine (formula = NP; pptx typo “Ceramide N”)
- ECM: Hydrolyzed Collagen · Hydrolyzed Elastin
- Propolis · Adenosine · Niacinamide (brightening / tone)
- 4 mechanism pillars (pptx): Firming · Antioxidant/Anti-inflammatory · Barrier · Brightening
- Clinical (site/`products.ts`): skin age index study, P&K, 2024, n=24 — **no published % improvement in local brand deck** → do not invent %
- Dermatologically tested · Made in Korea · 30ml

## Anti-aging Peptide 6 (pptx — exact)
1. Palmitoyl Tripeptide-5  
2. Dipeptide-2  
3. Palmitoyl Tetrapeptide-7  
4. Palmitoyl Tripeptide-1  
5. Palmitoyl Hexapeptide-12  
6. Acetyl Hexapeptide-8  

## Claim caution
- ❌ **MPS / Micro Pocket System** — bottle/artwork is **MFS**; earlier image guess was OCR/vision error
- ❌ Invented clinical % (no chart in Intertek PPTX)
- ❌ Product “pregnancy-safe” — deck contrasts retinol pregnancy limits with bakuchiol gentleness; artwork does not green-light pregnancy use
- ❌ Evening-only ritual — artwork = morning & evening; bakuchiol photostable
- ❌ Copy cream’s Astaxanthin / Multi Vita claims onto this serum
- Soft: website “reversing signs of aging” → prefer “helps improve / visibly smooth”

## 6-slide map
| # | Slide | Purpose | Aspect |
|---|---|---|---|
| 1 | Hero | Wrinkles · firmness · Bakuchiol + Peptide 6 | 1:1 |
| 2 | 4-Pillar Mechanism | Firm · antioxidant · barrier · brighten | 1:1 |
| 3 | Bakuchiol vs Retinol + clinical note | Photostable · study citation | 1:1 |
| 4 | Ingredients | Bakuchiol · Peptide 6 · liposome · ECM | 1:1 |
| 5 | Ritual / Result | AM & PM · SPF by day · pair cream | 4:5 |
| 6 | Closing | Bottle **center** | 1:1 |

---

# SLIDE 1 — HERO / HOOK

## Veo 3 prompt

```bash
veo3 "Cinematic product hero shot, 1:1 square. A dark charcoal translucent glass serum dropper bottle with a matte black rubber bulb and a silver metallic collar, fixed and sharp on the right side of the frame — premium Korean professional anti-aging packaging. Soft coral-rose luminous particles and fine peptide-like crystal accents floating beside the bottle, suggesting smoother wrinkles and firmer skin. Pure white seamless studio background, soft diffused beauty lighting, gentle reflection. The entire left half clean empty white space for text overlay. Photorealistic, premium Korean medical-aesthetic cosmeceutical aesthetic, refined coral-rose and charcoal mood, no people, no hands, no readable text, no logos, no watermark. Very slow subtle push-in, minimal motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/mfs-serum-s1-hero.mp4
```

## Text overlay

**MULTI FUNCTIONAL ANTI-WRINKLE SERUM**  
*Smooth. Firm. Bakuchiol Power.*

✦ Natural retinol alternative — Bakuchiol  
✦ Anti-aging Peptide 6 complex  
✦ Visibly smoother wrinkles · reinforced firmness  
✦ Barrier liposome delivery  

**30ml**  
*MFS PROFESSIONAL · Made in Korea*  
*Dermatologically Tested*

---

# SLIDE 2 — 4-PILLAR ANTI-AGING MECHANISM  
*(from Intertek PPTX mechanism slide — not invented)*

## Veo 3 prompt

```bash
veo3 "Cinematic technology-story shot, 1:1 square. A dark charcoal glass serum dropper bottle with silver collar and black bulb, positioned upper right, fixed and sharp. Across left and center, an elegant four-pillar abstract anti-aging visualization in coral-rose, soft gold, and ivory: (1) firming collagen-support glow, (2) antioxidant shield particles, (3) lipid-barrier reinforcing ribbons, (4) soft brightening light on skin tone — scientific but beautiful. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty areas on the left for mechanism text overlay. Photorealistic with subtle scientific visualization, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/mfs-serum-s2-mechanism.mp4
```

## Text overlay

**4-PILLAR ANTI-AGING CARE**  
*MFS — brand mechanism*

**① FIRMING**  
Bakuchiol · Peptide 6 · Collagen · Elastin · Adenosine  

**② ANTIOXIDANT · ANTI-INFLAMMATORY**  
Bakuchiol · Propolis  

**③ SKIN BARRIER**  
Ceramide NP · Cholesterol · Phytosphingosine  
*(Lipid Barrier Liposome)*  

**④ BRIGHTENING**  
Niacinamide  

*Wrinkles ↓ · firmness ↑ · barrier support*

---

# SLIDE 3 — BAKUCHIOL vs RETINOL + CLINICAL NOTE

## Veo 3 prompt

```bash
veo3 "Cinematic comparison-story shot, 1:1 square. A dark charcoal serum dropper bottle with silver collar, positioned upper right, fixed and sharp. On the left, an elegant abstract dual-path visualization: one side suggesting unstable light-sensitive retinol energy that frays, the other a calm photostable botanical bakuchiol glow that stays clear and steady — coral-rose and soft sage accents, not literal plants or medical charts. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty areas for comparison text overlay. Photorealistic with subtle scientific mood, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/mfs-serum-s3-bakuchiol.mp4
```

## Text overlay

**BAKUCHIOL — RETINOL ALTERNATIVE**  
*From babchi seed · plant-derived*

✦ Retinol-like gene-expression pathway  
✦ Photostable — usable AM & PM  
✦ Collagen support · cell turnover · antioxidant  
✦ Gentler profile vs classic retinol irritation  

**CLINICALLY STUDIED**  
Skin age index · P&K Skin Research Center  
Feb 22 – May 13, 2024 · n=24 women (30–59)  
Efficacy: wrinkles · skin tone balance  

*Dermatologically tested*

---

# SLIDE 4 — KEY INGREDIENTS

## Veo 3 prompt

```bash
veo3 "Cinematic ingredient-story shot, 1:1 square. A dark charcoal glass serum dropper bottle with silver collar, fixed and sharp on the right. On the left, elegant abstract botanical-scientific motifs: babchi seed / bakuchiol glow, six soft peptide crystal points, ceramide barrier ribbons, collagen-elastin structural threads, and propolis golden flecks in coral-rose, champagne gold, and ivory. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty areas on the left for ingredient text overlay. Photorealistic, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/mfs-serum-s4-ingredients.mp4
```

## Text overlay

**ANTI-AGING COMPLEX**  
*with Bakuchiol*

**① BAKUCHIOL**  
Natural retinol alternative · 0.1%  
Firm · smooth · antioxidant  

**② ANTI-AGING PEPTIDE 6**  
Tripeptide-5 · Dipeptide-2 · Tetrapeptide-7  
Tripeptide-1 · Hexapeptide-12 · Acetyl Hexapeptide-8  

**③ LIPID BARRIER LIPOSOME**  
Ceramide NP · Cholesterol · Phytosphingosine  

**④ COLLAGEN · ELASTIN · PROPOLIS · ADENOSINE · NIACINAMIDE**  
Structure · comfort · firm · tone  

---

# SLIDE 5 — RITUAL / RESULT

## Veo 3 prompt

```bash
veo3 "Cinematic skincare lifestyle shot, 4:5 portrait. A mature-adult with firm, smooth, radiant skin, soft natural glow, calm confident expression with eyes gently closed — complexion looking smoother and more lifted, not heavy makeup. Soft coral-rose and champagne lighting accents. Bright clean white studio background, soft diffused beauty lighting. The dark charcoal MULTI FUNCTIONAL ANTI-WRINKLE SERUM dropper bottle with silver collar softly placed in the lower right corner. Clean empty space along the left edge and top for minimal text overlay. Photorealistic, K-beauty aesthetic, natural firm radiant skin, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 4:5 --duration 4 --resolution 1080p -o ~/Movies/Veo/mfs-serum-s5-result.mp4
```

## Text overlay

**SMOOTH. FIRM. RADIANT.**

**①** Cleanse + toner  
**②** 2–3 drops · pat / upward massage  
**③** AM & PM · SPF by day  

*Seal with Multi Functional Anti-Wrinkle Cream*  
**30ml** · *MFS PROFESSIONAL*  
*Photostable Bakuchiol — day-friendly*

---

# SLIDE 6 — CLOSING (bottle center)

## Veo 3 prompt

```bash
veo3 "Cinematic product closing shot, 1:1 square. A dark charcoal translucent glass serum dropper bottle with matte black bulb and silver metallic collar, perfectly centered in the frame as the hero, fixed and sharp — not on the right. Soft reflection on a seamless white surface, delicate coral-rose luminous particles drifting gently around the bottle. Pure white seamless studio background, soft diffused beauty lighting with warm coral accents. Clean empty space above and below the bottle for closing text overlay. Photorealistic, premium Korean medical-aesthetic cosmeceutical aesthetic, refined anti-aging mood, no people, no hands, no readable text, no logos, no watermark. Very slow subtle push-in, minimal motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/mfs-serum-s6-closing.mp4
```

## Text overlay

**RETINOL RESULTS. PLANT CALM.**

*Bakuchiol + Peptide 6 anti-wrinkle serum.*

**BAKUCHIOL** · natural retinol alternative  
**PEPTIDE 6** · collagen · comfort · expression lines  
**BARRIER LIPOSOME** · Ceramide NP complex  
**CLINICAL** · skin age index study (P&K 2024)  

*AM & PM · 30ml · close the cap*

**MULTI FUNCTIONAL ANTI-WRINKLE SERUM**  
**MFS PROFESSIONAL · Made in Korea**

---

## Pairing
Cream **32** = same Bakuchiol line (50g / 250g). Serum first, cream seal.  
Do not confuse with Multi Vita serum **21** (MELAZERO®) or ND Cell neck cream **23**.

## Bug fixes (2026-07-28)
1. **How to use was wrong (evening-only)** — DB + AR/RU said “once daily, preferably evening”. Artwork + brand deck = **morning & evening**; Bakuchiol photostable.  
   - Live DB `howToUse` / `directions` / `keyFeatures` updated via `scripts/fix-product-22-bakuchiol-copy-20260728.ts --apply`  
   - `data/productTranslations.ts` + `productTranslationsRu.ts` frequency/directions aligned
2. **Pairing copy day/night split** — `pc22Benefit2` / `pc32Benefit2` (web + mobile EN/AR/RU) said serum=day / cream=night. Fixed to **AM & PM layering** + SPF.
3. **Chatbot Bakuchiol “pregnancy-safe”** — removed from `docs/CHATBOT_KNOWLEDGE.md` (artwork does not clear pregnancy use).
4. Softened absolute “clinically proven / without irritation” wording in DB keyFeatures/directions toward studied / typically gentler.

## Instagram caption
- Delivered in chat 2026-07-28: long + short + optional hashtag block
- Price omitted · no invented clinical % (cite P&K 2024 skin age index, n=24 only)
- Bakuchiol + Peptide 6 · AM & PM · SPF by day · pair cream 32
- App mention without store URLs · no pregnancy-safe claim
