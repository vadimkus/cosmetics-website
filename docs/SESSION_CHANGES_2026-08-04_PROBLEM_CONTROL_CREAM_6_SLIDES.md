# INTENSIVE PROBLEM CONTROL CREAM — 6 Marketing Slides — 2026-08-04

## Product (ID 30)
**GENOSYS INTENSIVE PROBLEM CONTROL CREAM** (PCC PROFESSIONAL)
- Size: **50g** (290 AED) / **250g** (420 AED professional)
- Form: Anti-blemish · sebum-control cream for oily & combination / acne-prone skin
- Live: https://genosys.ae/products/30
- Image: `/images/PRB.jpg` · gallery `Second/problem_duo.jpg`
- Pairing (Perfect Combination `pc30*`): serum **20** · routine toner **15** → serum **20** → cream **30**

---

## Sources checked

### Online
| Source | Result |
|---|---|
| API `/api/products/30` | INTENSIVE PROBLEM CONTROL CREAM · 50g default · 250g variant · oily · AM–PM |
| Ingredients (API) | Zinc PCA · Panthenol · Beta-Glucan · Allantoin · Pumpkin ferment · Trehalose |
| Perfect Combination | Dual Zinc PCA with serum **20** · hydrated oil control |
| `lib/products.ts` | Zinc PCA · Xylitol · Trehalose · Panthenol · **Phytolex SC** (trap) · Allantoin · Beta-Glucan · derm-tested · sebum efficacy |

### Local Intertek / registration ★ primary
| Doc | Path |
|---|---|
| Formula | `Registration DOC/Formula_up/Formula-GENOSYS INTENSIVE PROBLEM CONTROL CREAM.pdf` |
| Same actives | `Ingredient lists_old/GENOSYS INTENSIVE PROBLEM CONTROL CREAM.pdf` (matches key %) |
| Artwork 50g | `Registration DOC/Artwork/[GENOSYS]PROBLEM CONTROL CREAM.pdf` |
| Artwork 250g | `Registration DOC/Artwork/[GENOSYS]PROBLEM CONTROL CREAM(250g).pdf` |
| Label | `Label/[GENOSYS]INTENSIVE PROBLEM CONTROL CREAM 50g.pdf` |
| COA 50g | `Registration DOC/COA/COA-GENOSYS INTENSIVE PROBLEM CONTROL CREAM 50g(WNL081).pdf` |

### COA (lot WNL081 · 50g)
- Appearance: opaque gel cream
- pH **5.87** (5.50–6.50)
- Content ~51 g

**No dedicated cream PPT** in `public/documents/PPT/` (serum/toner PPT only) — do not import serum renewal patents.

---

## Verified claims (use on slides)

### Artwork (safe)
- Function: **Anti-blemishes, sebum control**
- PCC contributes to excessive sebum control and helps rebalance skin oiliness to prevent and improve skin breakouts
- Application: apply on face · gently massage · **morning and evening**
- **Dermatologically tested**
- **50g / 250g** · MADE IN KOREA · **PCC PROFESSIONAL**

### Intertek lead actives (Formula_up)
| Ingredient | % (W/W) | Slide role |
|---|---|---|
| **Trehalose** | **1.5%** | Moisture without heavy greasiness |
| **Xylitol** | **0.5%** | Humectant · balance feel |
| **Zinc PCA** | **0.05%** | Sebum / oil balance (hero — same order as serum) |
| **Panthenol** | **0.1%** | Soothe · comfort |
| **Allantoin** | **0.1%** | Soothe · protect |
| **Betaine** | **0.1%** | Comfort moisture |
| **Beta-Glucan** | **0.1%** | Comfort · support |
| **Lactobacillus/Pumpkin Ferment Extract** | **0.1%** | Soft microbiome / condition |
| Polyglutamic Acid · Betula · Phaseolus · Rumex · Radish ferment | 0.1% each | Soft botanical / film support |

**Absent from formula:** Phytolex SC · Salicylic Acid · Niacinamide · Willow bark · Tea Tree · ACZERO® / PORE LASER™

---

## Claim caution / traps ★ read before design

| Trap | Rule |
|---|---|
| `lib/products.ts` **Phytolex SC** | ❌ **Not in Intertek formula** — do not claim |
| Brand PPT serum “INTENSIVE” renewal patents | ❌ No cream PPT; do not copy ACZERO® / SA / Niacinamide / 16.6% onto cream |
| Toner clinical **−50% sebum / 4 weeks** | ❌ Do not transfer to cream |
| Invented clinical % / “anti-microbial clinical proof” | Soft wording only — artwork is sebum control · anti-blemishes · derm-tested |
| API “immune-boosting” (beta-glucan) | Prefer soothe · comfort · barrier support |
| Zinc PCA 0.05% | Hero as sebum-care active — not “high-dose zinc” |
| Fragrance-free absolute | Formula has no Parfum listed — still **do not invent 5 No-additions** unless confirmed on this cream artwork (not found in extract) |
| Willow bark | Serum-only active — cream has none |

---

## Visual mood
- **Blue / charcoal** Problem Control line (Pantone-like 2738 C + 432 C) · coral-red sparingly
- Cream tube (50g / optional 250g pro) — opaque gel cream texture
- Pair mood with serum dropper on ritual slide only

---

## 6-slide map

| # | Slide | Purpose | Aspect |
|---|---|---|---|
| 1 | Hero | Oily/combo · sebum · blemish cream | 1:1 |
| 2 | 3-Pillar Care | Sebum · Hydrate · Soothe | 1:1 |
| 3 | Cream vs oil myth | Moisture without clog · light gel cream | 1:1 |
| 4 | Ingredients | Zinc PCA · Trehalose · Xylitol · comfort stack | 1:1 |
| 5 | Ritual / Pair | AM & PM · serum **20** | 4:5 |
| 6 | Closing | Tube **center** | 1:1 |

---

# SLIDE 1 — HERO / HOOK

## Veo 3 prompt

```bash
veo3 "Cinematic product hero shot, 1:1 square. A premium Korean professional anti-blemish cream squeeze tube, matte white-to-charcoal with cool blue clinical label mood, fixed and sharp on the right. Soft luminous blue and cool silver particles suggesting oil balance and clarified skin, subtle opaque gel-cream sheen. Pure white seamless studio background, soft diffused beauty lighting, gentle reflection. The entire left half clean empty white space for text overlay. Photorealistic, premium Korean medical-aesthetic cosmeceutical aesthetic, blue-charcoal mood, no people, no hands, no readable text, no logos, no watermark. Very slow subtle push-in, minimal motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/pcc-cream-s1-hero.mp4
```

## Text overlay

**CONTROL OIL. KEEP MOISTURE.**  
INTENSIVE PROBLEM CONTROL CREAM

✦ Oily · combination · blemish-prone skin  
✦ Anti-blemishes · sebum control  
✦ Rebalances oiliness · clearer look  
✦ Lightweight daily cream  

**50g / 250g** · *PCC PROFESSIONAL*  
*Made in Korea · Dermatologically tested*

---

# SLIDE 2 — 3-PILLAR CARE

## Veo 3 prompt

```bash
veo3 "Cinematic technology-story shot, 1:1 square. An anti-blemish cream squeeze tube positioned upper right, fixed and sharp. Across left and center, an elegant three-pillar visualization in cool blue, silver, and soft mint: (1) sebum-balance droplets calming oil shine, (2) light hydration veil without greasiness, (3) soothing comfort glow — scientific but soft, never medical-harsh. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty areas on the left for text overlay. Photorealistic with subtle scientific mood, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/pcc-cream-s2-pillars.mp4
```

## Text overlay

**SEBUM · HYDRATE · SOOTHE**

**① SEBUM** — Zinc PCA 0.05% · oil balance  
**② HYDRATE** — Trehalose 1.5% · Xylitol 0.5%  
**③ SOOTHE** — Panthenol · Allantoin · Beta-Glucan  

*Function: Anti-blemishes · sebum control*  
*Artwork language — Intertek actives*

---

# SLIDE 3 — HYDRATED CONTROL  
*(artwork oil-rebalance story — cream texture)*

## Veo 3 prompt

```bash
veo3 "Cinematic texture-story shot, 1:1 square. An anti-blemish cream tube upper right, fixed and sharp, with a soft opaque gel-cream dollop mid-left catching cool blue studio light — looks light, not greasy. Subtle matte-skin glow particles suggesting balanced oil without dryness. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty areas for text overlay. Photorealistic, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/pcc-cream-s3-texture.mp4
```

## Text overlay

**MOISTURE WITHOUT THE GREASE.**

PCC helps rebalance skin oiliness  
to prevent and improve the look of breakouts  

✦ Light gel-cream texture  
✦ Hydrates while controlling excess oil feel  
✦ Daily AM & PM massage  
✦ Dermatologically tested  

*Opaque gel cream · pH band ~5.5–6.5 (COA)*  
*PCC PROFESSIONAL · Made in Korea*

---

# SLIDE 4 — KEY INGREDIENTS

## Veo 3 prompt

```bash
veo3 "Cinematic ingredient-story shot, 1:1 square. An anti-blemish cream tube fixed and sharp on the right. On the left, elegant abstract botanical-scientific motifs: zinc mineral cool glints, watery trehalose / xylitol moisture threads, panthenol comfort glow, soft ferment / botanical accents — cool blue, silver, and soft sage. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty areas on the left for ingredient text overlay. Photorealistic, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/pcc-cream-s4-ingredients.mp4
```

## Text overlay

**PROBLEM-CONTROL CREAM COMPLEX**  
*with Zinc PCA*

**① ZINC PCA 0.05%**  
Oil & sebum balance support  

**② TREHALOSE 1.5% · XYLITOL 0.5%**  
Moisture without heavy greasiness  

**③ PANTHENOL 0.1% · ALLANTOIN 0.1%**  
Soothe · comfort blemish-prone feel  

**④ BETA-GLUCAN · BETAINE 0.1%**  
Comfort · soft barrier support  

**⑤ PUMPKIN FERMENT · PGA · BOTANICALS**  
Condition · soft moisture film  

*No Phytolex SC · no invented clinical % · Intertek formula*

---

# SLIDE 5 — RITUAL / PAIRING  
*(4:5 — Perfect Combination 30↔20)*

## Veo 3 prompt

```bash
veo3 "Cinematic ritual-story shot, 4:5 vertical. An anti-blemish cream squeeze tube in the lower-right third, fixed and sharp, with a soft abstract serum-dropper silhouette mood far left (no readable logos). Soft morning-evening dual light with cool blue glow suggesting a complete blemish-care ritual — no hands, no face. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty upper and left areas for ritual text overlay. Photorealistic, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 4:5 --duration 4 --resolution 1080p -o ~/Movies/Veo/pcc-cream-s5-ritual.mp4
```

## Text overlay

**YOUR RITUAL**

① Cleanse  
② Intensive Problem Control Toner  
③ Problem Control Serum — 2–3 drops · pat  
④ **Intensive Problem Control Cream** — massage  
⑤ Optional: Soothing Bomb Mask  

**AM & PM** · focus on oily / problem zones  

**PERFECT PAIR**  
Serum **20** + Cream **30** — Zinc PCA in both  
*Dual oil regulation · hydrated control*

**50g / 250g** · *PCC PROFESSIONAL*

---

# SLIDE 6 — CLOSING / TUBE CENTER

## Veo 3 prompt

```bash
veo3 "Cinematic closing packshot, 1:1 square. A GENOSYS INTENSIVE PROBLEM CONTROL CREAM squeeze tube perfectly centered, hero-scale, sharp and premium — matte white-charcoal tube, cool blue label mood, soft studio reflection on pure white seamless background. Subtle cool blue rim light, no props crowding the tube. Photorealistic e-commerce hero quality, Korean medical-aesthetic, no people, no hands, no readable marketing text overlays in the render, no logos watermark outside packaging, no watermark. Very slow subtle push-in, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/pcc-cream-s6-closing.mp4
```

## Text overlay

**INTENSIVE PROBLEM CONTROL CREAM**  
*PCC PROFESSIONAL*

Anti-blemishes · sebum control  
Oily & combination skin  

**50g / 250g**  
🇰🇷 Made in Korea · Dermatologically tested  

*Shop genosys.ae · Genosys UAE app*

---

## Instagram caption (short)

CONTROL OIL. KEEP MOISTURE. 💧

GENOSYS INTENSIVE PROBLEM CONTROL CREAM — daily sebum & blemish care cream for oily / combination skin.

✦ Zinc PCA 0.05% · oil balance  
✦ Trehalose 1.5% · Xylitol 0.5% · light moisture  
✦ Panthenol · Allantoin · comfort  
✦ 50g / 250g · PCC PROFESSIONAL

Made in Korea 🇰🇷 · Dermatologically tested  
Pair with Problem Control Serum

App Store + Google Play · link in bio

---

## Instagram caption (long)

CONTROL OIL. KEEP MOISTURE. 💧

Meet GENOSYS INTENSIVE PROBLEM CONTROL CREAM — a lightweight anti-blemish cream that helps control excess sebum and rebalance oiliness while keeping skin hydrated — for oily and combination, blemish-prone skin.

✦ Anti-blemishes · sebum control  
✦ Rebalances oiliness · clearer look  
✦ Light gel-cream · AM & PM massage  
✦ Zinc PCA · Trehalose · Xylitol · comfort stack  

3-PILLAR CARE  
① SEBUM — Zinc PCA  
② HYDRATE — Trehalose · Xylitol  
③ SOOTHE — Panthenol · Allantoin · Beta-Glucan  

YOUR RITUAL  
① Cleanse → ② Toner → ③ Serum → ④ Cream  

PERFECT PAIR — Serum 20 + Cream 30 (Zinc PCA in both)

📍 INTENSIVE PROBLEM CONTROL CREAM · 50g / 250g  
🇰🇷 Made in Korea · Dermatologically tested · PCC PROFESSIONAL

📱 Download the Genosys UAE app  
Available on the App Store (iOS) and Google Play (Android)

Link in bio or DM to order.

#GENOSYS #ProblemControlCream #SebumControl #OilySkin #BlemishCare #ZincPCA #KBeauty #KoreanSkincare #AcneProneSkin #SkincareRoutine #UAEBeauty #DubaiSkincare #GenosysAE #GenosysApp #PCCProfessional

---

## Check summary

| Check | Result |
|---|---|
| Live API | Product 30 · 50g/250g · 290/420 AED · oily · AM–PM |
| Formula_up vs artwork INCI | Match |
| Zinc PCA / Trehalose / Xylitol / Panthenol | 0.05% / 1.5% / 0.5% / 0.1% |
| Phytolex SC | Absent — site/lib trap |
| Willow / SA / Niacinamide | Absent from cream |
| COA | Opaque gel cream · pH 5.87 |
| Pairing | Serum **20** (Zinc PCA both) · toner **15** |

## Optional site fix (not done)
- Remove **Phytolex SC** from `lib/products.ts` product **30** (same trap as serum **20**)
