# MULTI VITA RADIANCE SERUM — 6 Marketing Slides — 2026-07-27

## Product (ID 21)
**GENOSYS MULTI VITA RADIANCE SERUM** (MVS PROFESSIONAL)
- Size: **30ml** (330 AED)
- Form: Brightening serum · natural yellow/amber liquid (no artificial pigment)
- Visual: dark glass dropper · matte black bulb · silver GENOSYS collar · white label
- Origin: South Korea · Dermatologically tested · KR whitening functional (niacinamide)
- Image: `/images/radiance_serum/main.jpeg` (+ gallery `s1`–`s5`)
- Live: https://genosys.ae/products/21

## Sources (checked)
- Brand PDF: `public/documents/ppt/GENOSYS MULTI VITA RADIANCE SERUM.pdf` ★ primary  
  - Mechanism page OCR’d from PDF render (Vision) — authoritative for 4-step
  - Clinical page OCR: chart label **27.997%**, bars **6.190 → 4.457**
- Intertek: `Registration/Intertek/Multi Vita Radiance Serum/`  
  - Artwork 30ml · Formula · COA · CFS · training manual
- Live API / DB description (MELAZERO® + Vita framing — OK for serum)

## Bug fixes (2026-07-27)
1. **4-STEP Melanin Care was wrong in first draft** — reconstituted from MELAZERO autophagy copy instead of the PDF mechanism diagram.  
   **Correct PDF steps (serum — not the cream):**
   1. Inhibition of Melanin Synthesis — **3-O-Ethyl Ascorbic Acid · MELAZERO® · Licorice · Glutathione**
   2. Degradation of Melanin — **MELAZERO®**
   3. Inhibition of Melanin Transfer — **Niacinamide**
   4. Hyperpigmentation / Skin Tone Improvement — **PHA (Gluconolactone)** exfoliation  
   Do **not** copy the cream’s Step 4 (Astaxanthin UV assist) onto the serum.
2. Clinical headline locked to PDF chart: **27.997%** ≈ **−28.0%** (6.190 → 4.457 in 2 weeks). Prefer **−28.0%** in overlays; cite chart numbers on clinical slide.
3. `lib/productQuickFactsCatalog.ts` id `21` — melanin fact tightened from vague “~28%” to **−28.0%** with chart numbers.
4. Do not attribute **Astaxanthin** to this serum (cream 31 only).

## Verified claims
- Even skin tone · revive natural brightness / radiance
- Multi vitamins + patented **MELAZERO®** melanin care
- Powerful antioxidant effect with rich vitamins
- Brightens dull skin · prevents hyperpigmentation (MELAZERO®)
- Panthenol-rich formula → moisturizing barrier → natural glow
- **MELAZERO®** (detail slides / ingredients): inhibit production (↓ tyrosinase via α-MSH) + promote decomposition (melanosome autophagy)  
  Complex: Loquat Leaf · Spearmint · Propanediol · 1,2-Hexanediol
- Clinical: **6.190 → 4.457** · PDF **27.997%** · use **−28.0%** in marketing
- Satisfaction (n=21, ages 20–59): even tone **100%** · no dryness/tightness **100%** · no irritation **100%**
- Ritual: toner → apply → pat/massage · AM & PM · SPF by day
- May sting at first — start small · cool/fridge storage recommended · close cap (color may shift with air)

## Key actives (PDF + training ppm)
MELAZERO® · 3-O-Ethyl Ascorbic Acid **1,000 ppm** · Niacinamide **20,000 ppm** · Panthenol **10,000 ppm** · Multi Vita 12 · Glutathione · Gluconolactone (PHA) · Licorice · Macadamia · U-active®P10 herbs

## Claim caution
- ❌ Astaxanthin / cream UV Step 4 on serum slides
- ❌ Pregnancy-safe (TR artwork: not for pregnant women)
- ❌ Invented 4-step (autophagy as Step 2 label — autophagy is MELAZERO science detail, not the diagram’s Step 02 title alone without matching PDF layout)
- ❌ Skip daytime SPF note

## Accent
**Golden amber** (natural serum color) + silver collar / black glass. PDF mechanism banners use orange — orange/amber OK for overlays.

## 6-slide map
| # | Slide | Purpose | Aspect |
|---|---|---|---|
| 1 | Hero | Tone · glow · MELAZERO® + Vita 12 | 1:1 |
| 2 | 4-Step Melanin Care | PDF diagram steps 01–04 | 1:1 |
| 3 | Clinical | −28.0% / 2 weeks · 100% panel | 1:1 |
| 4 | Ingredients | MELAZERO · Vit C · Vita 12 · Panthenol | 1:1 |
| 5 | Ritual / Result | AM/PM · SPF · cool storage | 4:5 |
| 6 | Closing | Bottle **center** | 1:1 |

---

# SLIDE 1 — HERO / HOOK

## Veo 3 prompt

```bash
veo3 "Cinematic product hero shot, 1:1 square. A dark glass serum dropper bottle with a matte black rubber bulb and a silver metallic collar, fixed and sharp on the right side of the frame — yellow-amber serum visible at the clear glass base, premium Korean professional packaging. Soft luminous golden amber glow particles and fine vitamin crystal accents floating beside the bottle, suggesting even tone and natural radiant brightness. Pure white seamless studio background, soft diffused beauty lighting, gentle reflection. The entire left half clean empty white space for text overlay. Photorealistic, premium Korean medical-aesthetic cosmeceutical aesthetic, warm golden radiance mood, no people, no hands, no readable text, no logos, no watermark. Very slow subtle push-in, minimal motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/mvs-serum-s1-hero.mp4
```

## Text overlay

**MULTI VITA RADIANCE SERUM**  
*Even Tone. Natural Glow. MELAZERO®.*

✦ Patented MELAZERO® melanin care  
✦ Multi Vita 12 + stable Vitamin C  
✦ Brightens dull skin · evens tone  
✦ Panthenol-rich moisturizing glow  

**30ml**  
*MVS PROFESSIONAL · Made in Korea*  
*Dermatologically Tested*

---

# SLIDE 2 — 4-STEP MELANIN CARE  *(corrected to PDF diagram)*

## Veo 3 prompt

```bash
veo3 "Cinematic technology-story shot, 1:1 square. A dark glass serum dropper bottle with matte black bulb and silver collar, positioned upper right, fixed and sharp. Across left and center, an elegant four-step abstract melanin-care visualization in golden amber, soft botanical green, and ivory: (1) synthesis block at tyrosine / tyrosinase / oxidation, (2) melanin degradation dissolve effect, (3) blocked pigment-transfer pathways, (4) gentle PHA surface exfoliation renewal — scientific but beautiful. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty areas on the left for mechanism text overlay. Photorealistic with subtle scientific visualization, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/mvs-serum-s2-melanin-v2.mp4
```

## Text overlay

**4-STEP MELANIN CARE**  
*MVS — from brand mechanism*

**① INHIBIT SYNTHESIS**  
3-O-Ethyl Ascorbic Acid · MELAZERO®  
Licorice · Glutathione  

**② DEGRADE MELANIN**  
MELAZERO®  

**③ INHIBIT TRANSFER**  
Niacinamide (Vitamin B3)  

**④ TONE IMPROVEMENT**  
PHA (Gluconolactone) — exfoliation benefit  

*Dullness → clearer, more even-looking skin*

---

# SLIDE 3 — CLINICAL PROOF

## Veo 3 prompt

```bash
veo3 "Cinematic clinical-proof shot, 1:1 square. A dark glass serum dropper bottle with silver collar and black bulb, positioned upper right, fixed and sharp. On the left and center, an elegant abstract clinical visualization: a soft improving arc from warmer pigmented tone toward clearer even glow over two weeks, golden amber fading into soft cool clarity — data-viz beauty aesthetic, not a chart with numbers. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty areas for bold clinical stat text overlay. Photorealistic with subtle scientific mood, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/mvs-serum-s3-clinical.mp4
```

## Text overlay

**CLINICALLY SHOWN**  
*Skin surface melanin*

# **−28.0% IN 2 WEEKS**  
*6.190 → 4.457*  
*(PDF chart: 27.997%)*  

**SATISFACTION** *(n=21)*  
**100%** even-looking tone  
**100%** no dryness / tightness  
**100%** no irritation felt  

*Dermatologically tested*

---

# SLIDE 4 — KEY INGREDIENTS

## Veo 3 prompt

```bash
veo3 "Cinematic ingredient-story shot, 1:1 square. A dark glass serum dropper bottle with silver collar, fixed and sharp on the right — amber serum glow at the base. On the left, elegant abstract botanical-scientific motifs: loquat leaf and spearmint accents for MELAZERO®, vitamin crystal points, vitamin-C derivative sparkle, panthenol moisture veil, and soft PHA renewal particles in golden amber, soft green, and ivory. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty areas on the left for ingredient text overlay. Photorealistic, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/mvs-serum-s4-ingredients.mp4
```

## Text overlay

**RADIANCE COMPLEX**  
*with MELAZERO®*

**① MELAZERO®**  
Inhibit synthesis · degrade melanin  
*Loquat + Spearmint — patented*  

**② 3-O-ETHYL ASCORBIC ACID**  
Stable Vit C · antioxidant · brightening  
*1,000 ppm*  

**③ MULTI VITA 12 + NIACINAMIDE**  
Nourish · tone · transfer control  
*Niacinamide 20,000 ppm*  

**④ PANTHENOL · PHA · GLUTATHIONE · LICORICE**  
Glow barrier · renew · antioxidant · tyrosinase support  
*Panthenol 10,000 ppm*  

*Natural serum color — no artificial pigment*

---

# SLIDE 5 — RITUAL / RESULT

## Veo 3 prompt

```bash
veo3 "Cinematic skincare lifestyle shot, 4:5 portrait. A young adult with even, luminous radiant skin, soft natural glow, calm expression with eyes gently closed — complexion brighter and more even, not shiny or heavy makeup. Soft warm golden amber lighting accents. Bright clean white studio background, soft diffused beauty lighting. The dark glass MULTI VITA RADIANCE SERUM dropper bottle with silver collar softly placed in the lower right corner. Clean empty space along the left edge and top for minimal text overlay. Photorealistic, K-beauty aesthetic, natural radiant even skin, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 4:5 --duration 4 --resolution 1080p -o ~/Movies/Veo/mvs-serum-s5-result.mp4
```

## Text overlay

**EVEN. BRIGHT. COMFORTABLE.**

**①** Cleanse + toner  
**②** Apply · pat / massage  
**③** AM & PM · always SPF by day  

**−28.0% surface melanin · 2 weeks**  
*Start small if vitamin-sensitive*  
*Cool storage recommended*  
**30ml** · *MVS PROFESSIONAL*

---

# SLIDE 6 — CLOSING (bottle center)

## Veo 3 prompt

```bash
veo3 "Cinematic product closing shot, 1:1 square. A dark glass serum dropper bottle with matte black bulb, silver metallic collar, and amber serum visible at the base, perfectly centered in the frame as the hero, fixed and sharp — not on the right. Soft reflection on a seamless white surface, delicate golden amber luminous particles drifting gently around the bottle. Pure white seamless studio background, soft diffused beauty lighting with warm golden accents. Clean empty space above and below the bottle for closing text overlay. Photorealistic, premium Korean medical-aesthetic cosmeceutical aesthetic, warm radiance mood, no people, no hands, no readable text, no logos, no watermark. Very slow subtle push-in, minimal motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/mvs-serum-s6-closing.mp4
```

## Text overlay

**DULL SKIN’S BRIGHTENING SERUM.**

*Multi vitamins + patented MELAZERO®.*

**MELAZERO®** · inhibit · degrade  
**VITA 12 + VIT C** · nourish · glow  
**4-STEP MELANIN CARE** · synthesize · degrade · transfer · renew  
**−28.0%** surface melanin in 2 weeks  

*Natural amber serum · close the cap*  
*SPF by day · fridge-friendly storage*

**MULTI VITA RADIANCE SERUM**  
**30ml** · *MVS PROFESSIONAL · Made in Korea*

---

## Pairing note
Cream **31** = Astaxanthin + Vita 12 (no MELAZERO).  
Serum **21** = MELAZERO® + Vita 12 + Ethyl Ascorbic Acid (no Astaxanthin).  
Recommendation copy (`pc21Benefit1Text`) already separates the two.

## Instagram caption
- Delivered in chat 2026-07-28: long + short + optional hashtag block
- Price omitted · PDF clinical (−28.0% / 27.997%, 6.190 → 4.457) · MELAZERO® · app mention without store URLs
- No Astaxanthin · SPF by day · fridge tip in long form
