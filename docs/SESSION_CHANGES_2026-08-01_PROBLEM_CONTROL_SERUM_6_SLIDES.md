# PROBLEM CONTROL SERUM — 6 Marketing Slides — 2026-08-01 (re-verified)

## Product (ID 20)
**GENOSYS PROBLEM CONTROL SERUM** (PCS PROFESSIONAL)
- Size: **30ml** · **330 AED**
- Live: https://genosys.ae/products/20
- Gallery: `/images/problem_serum/main.jpeg` + `s1`–`s6.jpeg`
- Desktop copy: `~/Desktop/problem_serum/`
- Pairing: cream **30** · routine toner **15** → serum **20** → cream **30**

Master content (same claims): `docs/SESSION_CHANGES_2026-07-31_PROBLEM_CONTROL_SERUM_6_SLIDES.md`  
Visual redesign log: `docs/SESSION_CHANGES_2026-07-31_PROBLEM_CONTROL_SERUM_SLIDES_V3_REDESIGN.md`

---

## Re-verify 2026-08-01

### Online
| Check | Result |
|---|---|
| API `/api/products/20` | PROBLEM CONTROL SERUM · 30ml · 330 AED · inStock |
| Skin / usage | oily · morning-evening · concerns acne-blemishes, pore-care |
| Heroes in API ingredients | Zinc PCA · Willow Bark · Trehalose · Panthenol · Allantoin · Beta-Glucan |
| Gallery | `problem_serum/s1`–`s6` live |

### Local Intertek (unchanged)
| Source | Path |
|---|---|
| Formula | `Ingredient lists_old/GENOSYS PROBLEM CONTROL SERUM.pdf` |
| Artwork | `Registration DOC/Artwork/[GENOSYS]PROBLEM CONTROL SERUM.pdf` |
| COA | `…/COA-GENOSYS PROBLEM CONTROL SERUM 30ml(WND018).pdf` — pH **5.62** · translucent viscous |

| Ingredient | % (W/W) |
|---|---|
| **Zinc PCA** | **0.05%** |
| **Panthenol** | **0.2%** |
| **Trehalose** | **1%** |
| **Xylitol** | **0.5%** |
| **Allantoin** | **0.1%** |
| **Betaine** | **0.1%** |
| **Beta-Glucan** | **0.08%** |
| Salix Nigra (Willow) Bark Extract | **0.001%** (soft wording only) |

Artwork: Anti-blemishes · oil & sebum control · AM & PM · Dermatologically tested · **5 No-additions** · PCS PROFESSIONAL · Made in Korea.

### Still absent from Intertek (do not claim)
ACZERO® · PORE LASER™ · Salicylic Acid hero · Niacinamide · Phytolex SC · Tea Tree Complex · **16.6%** redness (brand PPT renewal only)

### Site traps still open
- `lib/products.ts` still lists **Phytolex SC** — not in Intertek
- API “clinically proven” / “2–4 weeks” — skip on slides

---

## 6-slide map

| # | Slide | Aspect | Text core |
|---|---|---|---|
| 1 | Hero | 1:1 | WHEN OIL TIPS THE BALANCE. |
| 2 | 3-Pillar Care | 1:1 | SEBUM · TEXTURE · COMFORT |
| 3 | Free-from | 1:1 | 5 NO-ADDITIONS + derm tested |
| 4 | Ingredients | 1:1 | Zinc PCA 0.05% · Panthenol · Trehalose… |
| 5 | Ritual / Pair | 1:1* | Toner 15 → Serum 20 → Cream 30 |
| 6 | Closing | 1:1 | Bottle center · shop CTA |

\*Live gallery `s5` is 1024² (same as others); Veo prompt below keeps 4:5 option for Stories.

Accent: Pantone **2738 C** blue · **432 C** charcoal · **187 C** red sparingly.

---

# SLIDE 1 — HERO

## Veo 3

```bash
veo3 "Cinematic product hero shot, 1:1 square. A premium Korean professional serum dropper bottle for blemish / sebum care — clear-to-charcoal glass with blue label accent mood, matte dropper bulb and silver collar, fixed and sharp on the right. Soft luminous blue and cool silver particles suggesting oil balance and clarified skin, subtle watery serum sheen. Pure white seamless studio background, soft diffused beauty lighting, gentle reflection. The entire left half clean empty white space for text overlay. Photorealistic, premium Korean medical-aesthetic cosmeceutical aesthetic, blue-charcoal mood, no people, no hands, no readable text, no logos, no watermark. Very slow subtle push-in, minimal motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/pcs-serum-s1-hero.mp4
```

## Overlay
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

## Veo 3

```bash
veo3 "Cinematic technology-story shot, 1:1 square. A serum dropper bottle for problem-control skincare positioned upper right, fixed and sharp. Across left and center, an elegant three-pillar visualization in cool blue, silver, and soft mint: (1) sebum-balance droplets calming oil shine, (2) refined pore / texture light grid, (3) soothing hydration veil — scientific but soft, never medical-harsh. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty areas on the left for text overlay. Photorealistic with subtle scientific mood, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/pcs-serum-s2-pillars.mp4
```

## Overlay
**SEBUM · TEXTURE · COMFORT**

**① SEBUM** — Zinc PCA · oil & sebum balance  
**② TEXTURE** — Willow bark support · smoother look  
**③ COMFORT** — Panthenol · Allantoin · Trehalose · Xylitol  

*Function: Anti-blemishes · oil and sebum control*

---

# SLIDE 3 — FREE-FROM + DERM TESTED

## Veo 3

```bash
veo3 "Cinematic clean-formula product shot, 1:1 square. A problem-control serum dropper bottle positioned upper right, fixed and sharp. On the left, five elegant minimal soft-blue and silver marks suggesting a clean free-from checklist, with a calm protective aura — no literal text in the image. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty areas for checklist text overlay. Photorealistic, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/pcs-serum-s3-freefrom.mp4
```

## Overlay
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

## Veo 3

```bash
veo3 "Cinematic ingredient-story shot, 1:1 square. A serum dropper bottle fixed and sharp on the right. On the left, elegant abstract botanical-scientific motifs: zinc mineral cool glints, soft willow-bark botanical light, watery trehalose / xylitol moisture threads, panthenol comfort glow — cool blue, silver, and soft sage accents. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty areas on the left for ingredient text overlay. Photorealistic, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/pcs-serum-s4-ingredients.mp4
```

## Overlay
**PROBLEM-CONTROL COMPLEX**  
*with Zinc PCA*

**① ZINC PCA 0.05%** — Oil & sebum balance support  
**② PANTHENOL 0.2% · ALLANTOIN 0.1%** — Soothe · comfort  
**③ TREHALOSE 1% · XYLITOL 0.5%** — Moisture without heavy greasiness  
**④ WILLOW BARK EXTRACT** — Soft turnover / dead-cell support  
**⑤ BETA-GLUCAN · FERMENTS · PGA** — Comfort · soft moisture film  

*No invented clinical % · Intertek formula*

---

# SLIDE 5 — RITUAL / PAIRING

## Veo 3 (Stories-friendly 4:5 optional)

```bash
veo3 "Cinematic ritual-story shot, 4:5 vertical. A problem-control serum dropper bottle in the lower-right third, fixed and sharp. Soft morning-evening dual light mood with cool blue glow; abstract watery application film suggesting patting serum into skin — no hands, no face. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty upper and left areas for ritual text overlay. Photorealistic, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 4:5 --duration 4 --resolution 1080p -o ~/Movies/Veo/pcs-serum-s5-ritual.mp4
```

## Overlay
**YOUR RITUAL**

① Cleanse  
② Intensive Problem Control Toner  
③ **Problem Control Serum** — 2–3 drops · pat  
④ Intensive Problem Control Cream  
⑤ Optional: Soothing Bomb Mask  

**AM & PM** · focus on oily / problem zones  

**PERFECT PAIR**  
Serum **20** + Cream **30** — Zinc PCA in both  

**30ml** · *PCS PROFESSIONAL*

---

# SLIDE 6 — CLOSING

## Veo 3

```bash
veo3 "Cinematic closing packshot, 1:1 square. A GENOSYS PROBLEM CONTROL SERUM dropper bottle perfectly centered, hero-scale, sharp and premium — charcoal-to-clear glass, blue label mood, silver collar, soft studio reflection on pure white seamless background. Subtle cool blue rim light, no props, no floating particles crowding the bottle. Photorealistic e-commerce hero quality, Korean medical-aesthetic, no people, no hands, no readable marketing text overlays in the render, no logos watermark outside packaging, no watermark. Very slow subtle push-in, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/pcs-serum-s6-closing.mp4
```

## Overlay
**PROBLEM CONTROL SERUM**  
*PCS PROFESSIONAL*

Anti-blemishes · oil & sebum control  
Oily & combination skin  

**30ml**  
🇰🇷 Made in Korea · Dermatologically tested  

*Shop genosys.ae · Genosys UAE app*

---

## Instagram caption (short)

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

## Optional site fix (still open)
- Remove **Phytolex SC** from `lib/products.ts` product **20**
- Soften API “clinically proven” → dermatologically tested
- Clarify with Abeer / HQ whether UAE stock is registered PCS or PPT “INTENSIVE” renewal
