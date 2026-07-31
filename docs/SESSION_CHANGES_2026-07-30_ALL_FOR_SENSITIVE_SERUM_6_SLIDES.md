# ALL FOR SENSITIVE SERUM — 6 Marketing Slides — 2026-07-30

## Product (ID 19)
**GENOSYS ALL FOR SENSITIVE SERUM** (AFS PROFESSIONAL)
- Size: **30ml** (330 AED)
- Form: Soothing · moisturizing serum for sensitive / reactive skin
- Visual: dark charcoal → soft teal translucent glass dropper · matte black bulb · silver GENOSYS collar · white DNA / AFS PROFESSIONAL mark
- Live: https://genosys.ae/products/19
- Image: `/images/sensitive_serum/main.jpeg` (+ gallery s1–s6) · video `/videos/all_serum.mp4`
- Accent (artwork Pantone): **375 C** fresh lime/chartreuse (Centella mood) · **432 C** charcoal · **187 C** red → use **soft lime / fresh green** overlays

## Sources checked
### Online
- Product page + API: `https://genosys.ae/products/19` · `/api/products/19`
- Brand brochure under `public/documents/ppt/`: **no dedicated AFS marketing PDF** (only site `Protocol_Sensitive.pdf` — **do not trust for INCI**; invents Panthenol / Madecassoside)
- Perfect Combination pairs with product **27** (Skin Barrier Protecting Cream)

### Local — Intertek / registration ★ primary
- Formula: `Ingredient lists_old/GENOSYS ALL FOR SENSITIVE SERUM.pdf` + `Registration DOC/Formula_up/Formula-GENOSYS ALL FOR SENSITIVE SERUM.pdf` (WINNOVA / DTS)
- Artwork: `Registration DOC/Artwork/[GENOSYS]ALL FOR SENSITIVE SERUM.pdf` · Label PDF
- COA: `Registration DOC/COA/COA-GENOSYS ALL FOR SENSITIVE SERUM 30ml(WOC056).pdf` — pH **5.77** (5.20–6.20), translucent viscous liquid
- Test report: micro + heavy metals only (`2019-DUBI-000787-A-001-SENSITIVE SERUM.pdf`) — **no efficacy % chart**
- Safety Assessment: finished-product SA on file (cosmetic safety, not clinical % claims)
- Product photo: `Artwork/Product_images/AFS SERUM.png`

### Site copy (secondary — already Intertek-audited 2026-07-29)
- `lib/products.ts` / live API: Centella · Chamomile · Allantoin · HA · Phytosphingosine · Aloe · Witch Hazel · Beta-Glucan · Pumpkin ferment ✓
- ✓ Perfect Combination `pc19Benefit*` fixed + OTA shipped 2026-07-30 — Centella/Allantoin + NMF cream language; BSASM removed
- Overlays refreshed 2026-07-30 (tighter; pairing line matches live pc19)

## Verified claims (use these)
- Designed for **sensitive skin** — relieve · protect from harmful environment · supply moisture (artwork / bottle)
- Function: **Soothing, Moisturizing**
- **AM & PM** — apply on face · gently pat (artwork)
- **Dermatologically tested**
- **5 No-additions** (artwork): Paraben · Artificial Surfactant · Artificial Fragrance · Artificial Pigment · Ethanol  
  ⚠️ Formula still lists Orange Peel Oil + Limonene → do **not** say “fragrance-free”; stick to brand’s “no artificial fragrance”
- Made in Korea · 30ml · AFS PROFESSIONAL
- Lead actives from formula (meaningful %):
  - **Betaine 0.5%** — comfort humectant
  - **Allantoin 0.1%** — soothe · protect
  - **Centella Asiatica Extract 0.05%** — calm · support repair feel
  - **Sodium Hyaluronate 0.01%** — moisture
  - Botanicals: Scutellaria · Polygonum Cuspidatum · Licorice · Green Tea · Chamomile · Rosemary · Aloe · Witch Hazel water · Lotus
  - **Phytosphingosine** (trace) — barrier lipid support (soft wording)
  - **Beta-Glucan** · **Lactobacillus/Pumpkin Ferment** (soft / support)
- Pair: Skin Barrier Protecting Cream (**27**) · protocol also allows Hydro Soothing / Soothing Repair Postcream — without inventing shared BSASM

## Claim caution / bug traps
- ❌ **MultiEx BSASM® Plus** · **Phytolex SC** — not in Intertek formula
- ❌ **Panthenol** · **Madecassoside** — Protocol_Sensitive invents these for AFS; formula has Centella extract only
- ❌ Invented clinical % / “clinically proven wrinkle/redness %” — no efficacy study in local brand deck (only derm-tested + micro/metals)
- ❌ Fragrance-free absolute — orange peel oil + limonene present
- ❌ Confuse with Hydro Soothing Cream / Postcream claims
- Soft: “immune-boosting” API beta-glucan wording → prefer soothe · comfort · barrier support

## 6-slide map
| # | Slide | Purpose | Aspect |
|---|---|---|---|
| 1 | Hero | Sensitive · soothe · moisture | 1:1 |
| 2 | 3-Pillar Care | Relieve · Protect · Moisturize | 1:1 |
| 3 | Free-from + Derm tested | 5 No-additions · safety mood | 1:1 |
| 4 | Ingredients | Centella · Allantoin · Betaine · botanicals | 1:1 |
| 5 | Ritual / Result | AM & PM · pair barrier cream | 4:5 |
| 6 | Closing | Bottle **center** | 1:1 |

---

# SLIDE 1 — HERO / HOOK

## Veo 3 prompt

```bash
veo3 "Cinematic product hero shot, 1:1 square. A dark charcoal glass serum dropper bottle fading to soft teal translucency at the base, matte black rubber bulb and silver metallic collar, fixed and sharp on the right — premium Korean professional sensitive-skin packaging. Soft lime-green and fresh mint luminous particles with gentle calming botanical light accents floating beside the bottle, suggesting soothed, comforted skin. Pure white seamless studio background, soft diffused beauty lighting, gentle reflection. The entire left half clean empty white space for text overlay. Photorealistic, premium Korean medical-aesthetic cosmeceutical aesthetic, refined lime-green and charcoal mood, no people, no hands, no readable text, no logos, no watermark. Very slow subtle push-in, minimal motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/afs-serum-s1-hero.mp4
```

## Text overlay *(refreshed 2026-07-30)*

**WHEN SKIN SAYS ENOUGH.**  
ALL FOR SENSITIVE SERUM

✦ Sensitive · reactive · easily irritated skin  
✦ Soothe · comfort · moisturize  
✦ Environmental stress protection feel  
✦ Lightweight daily serum  

**30ml** · *AFS PROFESSIONAL*  
*Made in Korea · Dermatologically tested*

---

# SLIDE 2 — 3-PILLAR CARE  
*(artwork function language — not invented mechanism)*

## Veo 3 prompt

```bash
veo3 "Cinematic technology-story shot, 1:1 square. A dark charcoal-to-teal glass serum dropper bottle with silver collar, positioned upper right, fixed and sharp. Across left and center, an elegant three-pillar calming visualization in soft lime, mint, and ivory: (1) soothing relief glow reducing redness-like warmth, (2) a gentle protective shield against environmental stress particles, (3) soft moisture droplets replenishing comfort — scientific but soft, never clinical-harsh. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty areas on the left for text overlay. Photorealistic with subtle scientific mood, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/afs-serum-s2-pillars.mp4
```

## Text overlay *(refreshed 2026-07-30)*

**RELIEVE · PROTECT · MOISTURIZE**

**① RELIEVE** — Centella · Chamomile · Allantoin  
**② PROTECT** — Phytosphingosine · botanical complex  
**③ MOISTURIZE** — Betaine · Sodium Hyaluronate  

*Function: Soothing · Moisturizing*  
*Artwork language — Intertek actives*

---

# SLIDE 3 — FREE-FROM + DERM TESTED  
*(artwork “5 No-additions” — wording exact; no “fragrance-free”)*

## Veo 3 prompt

```bash
veo3 "Cinematic clean-formula product shot, 1:1 square. A dark charcoal-to-teal serum dropper bottle with silver collar, positioned upper right, fixed and sharp. On the left, five elegant minimal icon-like soft lime and silver marks suggesting a clean free-from checklist, with a calm protective aura — no literal text in the image. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty areas for checklist text overlay. Photorealistic, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/afs-serum-s3-freefrom.mp4
```

## Text overlay *(refreshed 2026-07-30)*

**CLEAN COMFORT FORMULA**

**5 NO-ADDITIONS**  
✗ Paraben  
✗ Artificial surfactant  
✗ Artificial fragrance  
✗ Artificial pigment  
✗ Ethanol  

**DERMATOLOGICALLY TESTED**  
pH comfort range · COA ~5.8  

*No invented clinical %*

---

# SLIDE 4 — KEY INGREDIENTS  
*(Intertek formula — real actives only)*

## Veo 3 prompt

```bash
veo3 "Cinematic ingredient-story shot, 1:1 square. A dark charcoal-to-teal glass serum dropper bottle with silver collar, fixed and sharp on the right. On the left, elegant abstract botanical motifs: Centella leaves in soft lime, chamomile petals, clear moisture droplets, and a gentle barrier lipid ribbon in mint and ivory. Pure white seamless studio background, soft diffused beauty lighting. Large clean empty areas on the left for ingredient text overlay. Photorealistic, premium Korean medical-aesthetic, no people, no hands, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/afs-serum-s4-ingredients.mp4
```

## Text overlay *(refreshed 2026-07-30)*

**INSIDE THE SERUM**

**① CENTELLA ASIATICA 0.05%** — calm · comfort  
**② ALLANTOIN 0.1%** — soothe · protect  
**③ BETAINE 0.5%** — gentle moisture  
**④ SODIUM HYALURONATE** — soft hydration  
**⑤ CHAMOMILE · LICORICE · GREEN TEA · SCUTELLARIA**  

*Also: Aloe · Witch Hazel · Phytosphingosine · Beta-Glucan*

---

# SLIDE 5 — RITUAL / RESULT

## Veo 3 prompt

```bash
veo3 "Cinematic skincare lifestyle shot, 4:5 portrait. An adult with calm, even, comforted-looking skin, soft natural glow, relaxed expression with eyes gently closed — complexion looking soothed and resilient, not heavy makeup, no visible irritation. Soft lime-green and mint lighting accents. Bright clean white studio background, soft diffused beauty lighting. The dark charcoal-to-teal ALL FOR SENSITIVE SERUM dropper bottle with silver collar softly placed in the lower right corner. Clean empty space along the left edge and top for minimal text overlay. Photorealistic, K-beauty aesthetic, natural calm healthy skin, no readable text, no logos, no watermark. Very slow subtle motion, every frame usable as a still." --aspect 4:5 --duration 4 --resolution 1080p -o ~/Movies/Veo/afs-serum-s5-result.mp4
```

## Text overlay *(refreshed 2026-07-30)*

**CALM. COMFORT. DAILY.**

**①** Cleanse + toner (gentle)  
**②** 2–3 drops · pat — avoid eye area  
**③** AM & PM · seal with Skin Barrier Protecting Cream  

*Day: Ultra Shield SPF*  
Serum soothes (Centella + Allantoin) · cream NMF barrier support  

**30ml** · *AFS PROFESSIONAL*

---

# SLIDE 6 — CLOSING (bottle center)

## Veo 3 prompt

```bash
veo3 "Cinematic product closing shot, 1:1 square. A dark charcoal glass serum dropper bottle fading to soft teal at the base, matte black bulb and silver metallic collar, perfectly centered in the frame as the hero, fixed and sharp — not on the right. Soft reflection on a seamless white surface, delicate lime-green luminous particles drifting gently around the bottle. Pure white seamless studio background, soft diffused beauty lighting with fresh green accents. Clean empty space above and below the bottle for closing text overlay. Photorealistic, premium Korean medical-aesthetic cosmeceutical aesthetic, refined sensitive-skin calm mood, no people, no hands, no readable text, no logos, no watermark. Very slow subtle push-in, minimal motion, every frame usable as a still." --aspect 1:1 --duration 4 --resolution 1080p -o ~/Movies/Veo/afs-serum-s6-closing.mp4
```

## Text overlay *(refreshed 2026-07-30)*

**RELIEVE. PROTECT. MOISTURIZE.**

✦ Centella + Allantoin soothing care  
✦ Betaine · HA moisture comfort  
✦ 5 No-additions clean formula  
✦ Dermatologically tested  

*AM & PM · 30ml · close the cap*

**ALL FOR SENSITIVE SERUM**  
**AFS PROFESSIONAL · Made in Korea**

---

## Pairing *(site aligned 2026-07-30)*
- Cream **27** Skin Barrier Protecting Cream — Perfect Combination live  
- Pairing copy: Centella/Allantoin (serum) + NMF amino acids (cream) — **no MultiEx BSASM®**  
- Optional: Hydro Soothing Cream · Soothing Repair Postcream · Ultra Shield SPF (day)

## Site fix (2026-07-30)
- Fixed `pc19Benefit1–4` in web + mobile i18n; shipped OTA group `c8f6679c`
- See `SESSION_CHANGES_2026-07-30_AFS_PC19_PAIRING_INTERTEK_FIX.md`

## Instagram caption
- Delivered 2026-07-31 → `SESSION_CHANGES_2026-07-31_AFS_SERUM_IG_CAPTION.md`
