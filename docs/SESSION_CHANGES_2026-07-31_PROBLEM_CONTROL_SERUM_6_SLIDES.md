# PROBLEM CONTROL SERUM — 6 Marketing Slides — 2026-07-31

## Product (ID 20)
**GENOSYS PROBLEM CONTROL SERUM** (PCS PROFESSIONAL)
- Size: **30ml** (330 AED)
- Form: Anti-blemish / sebum-control serum for oily & combination skin
- Visual: dropper bottle · artwork Pantone **2738 C** (blue) · **187 C** (red accent) · **432 C** (charcoal) · PCS PROFESSIONAL
- Live: https://genosys.ae/products/20
- Image: `/images/PRSS.jpg`
- Brand PPT (training): `/documents/PPT/GENOSYS%20INTENSIVE%20PROBLEM%20CONTROL%20SERUM.pdf` (19 pp, Jul 2026)
- Pairing (site Perfect Combination): cream **30** Intensive Problem Control Cream  
- Routine: Cleanser → Problem Control Toner (**15**) → Serum (**20**) → Cream (**30**) → optional Soothing Bomb Mask

---

## Sources checked

### Online
- Product page + API: `https://genosys.ae/products/20` · `/api/products/20`
- Brand PPT: `public/documents/PPT/GENOSYS INTENSIVE PROBLEM CONTROL SERUM.pdf`
- Perfect Combination i18n: `pc20Benefit*` → pairs with product **30**

### Local — Intertek / registration ★ primary for INCI & %
- Formula: `Ingredient lists_old/GENOSYS PROBLEM CONTROL SERUM.pdf` (WINNOVA)  
  + `Registration DOC/Formula_up/Formula-GENOSYS PROBLEM CONTROL SERUM.pdf` (DTS) — **same %**
- Artwork: `Registration DOC/Artwork/[GENOSYS]PROBLEM CONTROL SERUM.pdf`
- Label: `Label/[GENOSYS]PROBLEM CONTROL SERUM.pdf`
- COA: `Registration DOC/COA/COA-GENOSYS PROBLEM CONTROL SERUM 30ml(WND018).pdf`  
  — translucent viscous liquid · pH **5.62** (5.50–6.50) · lot WND018 · mfg 2024-04

### Cream pairing (Intertek)
- `Ingredient lists_old/GENOSYS INTENSIVE PROBLEM CONTROL CREAM.pdf` — Zinc PCA **0.05%** (same order of magnitude as serum)

---

## Verified claims (use these on slides)

### Artwork / bottle (safe)
- Function: **Anti-blemishes, oil and sebum control**
- PCS contributes to excessive oil & sebum control that can lead to breakouts — **for oily and combination skin**
- Helps improve breakouts by sebum control + sloughing away of dead skin cells (artwork English)
- Application: apply on face · gently pat · **morning & evening**
- **Dermatologically tested**
- **5 No-additions:** Paraben · Artificial Surfactant · Artificial Fragrance · Artificial Pigment · Ethanol
- Made in Korea · 30ml · PCS PROFESSIONAL
- Notification ref. (artwork): 1993726 · date 24.07.2015

### Intertek lead actives (meaningful % — soft wording for traces)
| Ingredient | % (W/W) | Slide role |
|---|---|---|
| **Zinc PCA** | **0.05%** | Sebum / oil balance (hero — do not inflate %) |
| **Panthenol** | **0.2%** | Soothe · comfort |
| **Trehalose** | **1%** | Moisture / humectant |
| **Xylitol** | **0.5%** | Humectant · balance feel |
| **Allantoin** | **0.1%** | Soothe · protect |
| **Betaine** | **0.1%** | Comfort moisture |
| **Beta-Glucan** | **0.08%** | Comfort · support |
| Salix Nigra (Willow) Bark Extract | **0.001%** | Soft: turnover / dead-cell support — **not “BHA treatment”** |
| Leuconostoc/Radish Root Ferment | 0.02% | Soft conditioning |
| Lactobacillus/Pumpkin Ferment | 0.01% | Soft microbiome support |
| Polyglutamic Acid | 0.01% | Soft moisture film |
| Phaseolus Radiatus / Rumex / Betula | trace | Soft botanical support |

pH ~5.6 (mildly acidic COA band) — soft “skin-friendly / low-irritant feel” OK; do not invent “clinical low-irritant study” from COA alone.

---

## Claim caution / traps ★ read before design

### Intertek vs brand PPT (renewal) — CRITICAL
Brand PPT title is **INTENSIVE PROBLEM CONTROL SERUM** and shows a **Renewal** formula with:
- ACZERO® · PORE LASER™ · Tea Tree Complex · **Salicylic Acid** · **Niacinamide** · Tannic Acid · PhytoDefense / HydroFerment · Phytolex SC  
- Clinical: non-comedogenic (QACS Ltd.) · redness **16.6%** improvement / 4 weeks (KC Skin Research Center, subject callout)

**None of those patented complexes / SA / Niacinamide appear in the registered Intertek formula.**  
→ For these 6 slides (UAE product **20** as registered): **do not use** ACZERO®, PORE LASER™, Salicylic Acid as hero, Niacinamide, Tannic Acid, Phytolex SC, or the **16.6%** redness figure.  
→ If HQ later confirms renewal SKU is what ships in UAE, re-verify with new formula PDF before using PPT clinical %.

### Site / lib traps
- ❌ API `productDetails.testing`: “clinically proven” — too broad; artwork only says **dermatologically tested**
- ❌ `lib/products.ts` lists **Phytolex SC** — **absent** from Intertek formula
- ❌ API howToUse “Visible improvements typically seen within 2–4 weeks” — **not on artwork/Intertek**; skip invented timeline
- ❌ Willow bark ≠ free salicylic acid treatment strength (0.001%)
- ❌ Do not copy toner clinical **−50% sebum / 4 weeks** onto the serum
- Soft: “immune-boosting” for beta-glucan → prefer soothe · comfort · barrier support
- Soft: Zinc PCA 0.05% — hero as sebum-care active, not “high-dose zinc”

---

## 6-slide map

| # | Slide | Purpose | Aspect |
|---|---|---|---|
| 1 | Hero | Oily / combo · sebum · blemish control | 1:1 |
| 2 | 3-Pillar Care | Sebum · Texture · Soothe + hydrate | 1:1 |
| 3 | Free-from + Derm tested | 5 No-additions · safety mood | 1:1 |
| 4 | Ingredients | Zinc PCA · Panthenol · Trehalose · willow soft | 1:1 |
| 5 | Ritual / Pairing | AM & PM · toner + cream **30** | 4:5 |
| 6 | Closing | Bottle **center** | 1:1 |

Accent mood: **blue / charcoal** (Pantone 2738 C + 432 C) · coral-red sparingly (187 C) for stars/line like other GENOSYS slides.

---

# SLIDE 1 — HERO / HOOK

## Veo 3 prompt

```bash
veo3 "Cinematic product hero shot, 1:1 square. A premium Korean professional serum dropper bottle for blemish / sebum care — clear-to-charcoal glass with blue label accent mood, matte dropper bulb and silver collar, fixed and sharp on the right. Soft luminous blue and cool silver particles suggesting oil balance and clarified skin, subtle watery serum sheen. Pure white seamless studio background, soft diffused beauty lighting, gentle reflection. The entire left half clean empty white space for text overlay. Photorealistic, premium Korean medical-aesthetic cosmeceutical aesthetic, blue-charcoal mood, no people, no hands, no readable text, no logos, no watermark. Very slow subtle push-in, minimal motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/pcs-serum-s1-hero.mp4
```

## Text overlay

**WHEN OIL TIPS THE BALANCE.**  
PROBLEM CONTROL SERUM

✦ Oily · combination · blemish-prone skin  
✦ Anti-blemishes · oil & sebum control  
✦ Clearer-looking · calmer feel  
✦ Lightweight daily serum  

**30ml** · *PCS PROFESSIONAL*  
*Made in Korea · Dermatologically tested*

---

# SLIDE 2 — 3-PILLAR CARE  
*(artwork function language + Intertek actives — not PPT renewal patents)*

## Veo 3 prompt

```bash
veo3 "Cinematic technology-story shot, 1:1 square. A serum dropper bottle for problem-control skincare positioned upper right, fixed and sharp. Across left and center, an elegant three-pillar visualization in cool blue, silver, and soft mint: (1) sebum-balance droplets calming oil shine, (2) refined pore / texture light grid, (3) soothing hydration veil — scientific but soft, never medical-harsh. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty areas on the left for text overlay. Photorealistic with subtle scientific mood, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/pcs-serum-s2-pillars.mp4
```

## Text overlay

**SEBUM · TEXTURE · COMFORT**

**① SEBUM** — Zinc PCA · oil & sebum balance  
**② TEXTURE** — Willow bark support · smoother look  
**③ COMFORT** — Panthenol · Allantoin · Trehalose · Xylitol  

*Function: Anti-blemishes · oil and sebum control*  
*Artwork language — Intertek actives*

---

# SLIDE 3 — FREE-FROM + DERM TESTED  
*(artwork “5 No-additions” — exact wording)*

## Veo 3 prompt

```bash
veo3 "Cinematic clean-formula product shot, 1:1 square. A problem-control serum dropper bottle positioned upper right, fixed and sharp. On the left, five elegant minimal soft-blue and silver marks suggesting a clean free-from checklist, with a calm protective aura — no literal text in the image. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty areas for checklist text overlay. Photorealistic, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/pcs-serum-s3-freefrom.mp4
```

## Text overlay

**CLEAN DAILY CONTROL**

**5 NO-ADDITIONS**  
✦ No paraben  
✦ No artificial surfactant  
✦ No artificial fragrance  
✦ No artificial pigment  
✦ No ethanol  

**DERMATOLOGICALLY TESTED**  
*Mildly acidic serum feel · pH band ~5.5–6.5 (COA)*  
*PCS PROFESSIONAL · Made in Korea*

---

# SLIDE 4 — KEY INGREDIENTS

## Veo 3 prompt

```bash
veo3 "Cinematic ingredient-story shot, 1:1 square. A serum dropper bottle fixed and sharp on the right. On the left, elegant abstract botanical-scientific motifs: zinc mineral cool glints, soft willow-bark botanical light, watery trehalose / xylitol moisture threads, panthenol comfort glow — cool blue, silver, and soft sage accents. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty areas on the left for ingredient text overlay. Photorealistic, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/pcs-serum-s4-ingredients.mp4
```

## Text overlay

**PROBLEM-CONTROL COMPLEX**  
*with Zinc PCA*

**① ZINC PCA 0.05%**  
Oil & sebum balance support  

**② PANTHENOL 0.2% · ALLANTOIN 0.1%**  
Soothe · comfort blemish-prone feel  

**③ TREHALOSE 1% · XYLITOL 0.5%**  
Moisture without heavy greasiness  

**④ WILLOW BARK EXTRACT**  
Soft turnover / dead-cell support  

**⑤ BETA-GLUCAN · FERMENTS · PGA**  
Comfort · condition · soft moisture film  

*No invented clinical % · Intertek formula*

---

# SLIDE 5 — RITUAL / PAIRING  
*(4:5 — site routine + Perfect Combination 20→30)*

## Veo 3 prompt

```bash
veo3 "Cinematic ritual-story shot, 4:5 vertical. A problem-control serum dropper bottle in the lower-right third, fixed and sharp. Soft morning-evening dual light mood with cool blue glow; abstract watery application film suggesting patting serum into skin — no hands, no face. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty upper and left areas for ritual text overlay. Photorealistic, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 4:5 --duration 4 --resolution 1080p -o ~/Movies/Veo/pcs-serum-s5-ritual.mp4
```

## Text overlay

**YOUR RITUAL**

① Cleanse  
② Intensive Problem Control Toner  
③ **Problem Control Serum** — 2–3 drops · pat  
④ Intensive Problem Control Cream  
⑤ Optional: Soothing Bomb Mask  

**AM & PM** · focus on oily / problem zones  

**PERFECT PAIR**  
Serum **20** + Cream **30** — Zinc PCA in both  
*Dual oil regulation · hydrated control*

**30ml** · *PCS PROFESSIONAL*

---

# SLIDE 6 — CLOSING / BOTTLE CENTER

## Veo 3 prompt

```bash
veo3 "Cinematic closing packshot, 1:1 square. A GENOSYS PROBLEM CONTROL SERUM dropper bottle perfectly centered, hero-scale, sharp and premium — charcoal-to-clear glass, blue label mood, silver collar, soft studio reflection on pure white seamless background. Subtle cool blue rim light, no props, no floating particles crowding the bottle. Photorealistic e-commerce hero quality, Korean medical-aesthetic, no people, no hands, no readable marketing text overlays in the render, no logos watermark outside packaging, no watermark. Very slow subtle push-in, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/pcs-serum-s6-closing.mp4
```

## Text overlay

**PROBLEM CONTROL SERUM**  
*PCS PROFESSIONAL*

Anti-blemishes · oil & sebum control  
Oily & combination skin  

**30ml**  
🇰🇷 Made in Korea · Dermatologically tested  

*Shop genosys.ae · Genosys UAE app*

---

## Instagram caption (short — ready)

WHEN OIL TIPS THE BALANCE. 💧

GENOSYS PROBLEM CONTROL SERUM — daily sebum & blemish care for oily / combination skin.

✦ Zinc PCA · oil balance  
✦ Panthenol · Allantoin · comfort  
✦ Trehalose · Xylitol · light moisture  
✦ 30ml · PCS PROFESSIONAL

Made in Korea 🇰🇷 · Dermatologically tested  
Pair with Intensive Problem Control Cream

App Store + Google Play · link in bio

---

## Instagram caption (long)

WHEN OIL TIPS THE BALANCE. 💧

Meet the GENOSYS PROBLEM CONTROL SERUM — a lightweight anti-blemish serum that helps control excess oil and sebum and supports a clearer, calmer look for oily and combination skin.

✦ Anti-blemishes · oil & sebum control  
✦ Oily · combination · blemish-prone  
✦ Soft turnover support · comfort moisture  
✦ AM & PM · gently pat  

3-PILLAR CARE  
① SEBUM — Zinc PCA  
② TEXTURE — Willow bark support  
③ COMFORT — Panthenol · Allantoin · Trehalose · Xylitol  

5 NO-ADDITIONS  
No paraben · no artificial surfactant · no artificial fragrance · no artificial pigment · no ethanol

YOUR RITUAL  
① Cleanse → ② Problem Control Toner → ③ Serum → ④ Problem Control Cream  

📍 PROBLEM CONTROL SERUM · 30ml  
🇰🇷 Made in Korea · Dermatologically tested · PCS PROFESSIONAL

📱 Download the Genosys UAE app  
Available on the App Store (iOS) and Google Play (Android)

Link in bio or DM to order.

#GENOSYS #ProblemControlSerum #SebumControl #OilySkin #BlemishCare #ZincPCA #KBeauty #KoreanSkincare #AcneProneSkin #SkincareRoutine #UAEBeauty #DubaiSkincare #GenosysAE #GenosysApp #PCSProfessional

---

## Optional site fix (not done this session)
- Remove **Phytolex SC** from `lib/products.ts` / API ingredients for product **20** (not in Intertek)
- Soften API “clinically proven” → dermatologically tested (unless renewal clinical is re-verified for UAE stock)
- Flag brand PPT renewal ingredients vs registered formula for Abeer / HQ clarification
