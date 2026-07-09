# Session: Korean Glass Skin Bundle Prep

**Date:** 2026-06-29  
**Context:** Prep materials for new GENOSYS bundle on genosys.ae

## Actions

- Researched "Korean Glass Skin" online (GENOSYS UK, distributors, clinic facial protocols, international glow/hydrating kits)
- Confirmed existing genosys.ae assets: PDF guide, `complete-glass-skin.html` brochure, training module, chatbot links
- Created desktop prep folder: **`/Users/vadimkus/Desktop/Skin/`**

## Folder Contents

- `01-official-pdfs/` — Achieve Korean Glass Skin guide + hyaluron/mist/overnight/barrier/revita/epi PDFs + hydration protocol
- `02-product-images/` — 20+ catalogue images + PDF cover thumbnail + `bundle-flatlay/` subset
- `03-brochures/` — complete-glass-skin.html
- `04-online-research/ONLINE_RESEARCH.md`
- `05-bundle-spec/UAE_MARKET_PRICING.md` — **competition + pricing table + PDP copy**
- `05-bundle-spec/BUNDLE_BUILD_BRIEF.md`

## Market pass (2026-06-29)

- Competition: mass K-beauty glass kits **99–400 AED**; authorized GENOSYS multi-step **1,100–2,800 AED**
- Internal overlap: Deep Moisturizing Beauty Box **1,120 AED** — Glass Skin Kit adds mist + barrier + overnight
- Launch hero: **GS-02 @ 1,849 AED** (free UAE delivery)

## Bundle pricing (UAE — initial, 2026-06-29)

> ⚠️ **SUPERSEDED by the 2026-06-30 repricing** (SPF added to hero + 3-tier decoy). Final lineup: GS-01 **999** · GS-02★ **2,049** (8 items incl SPF) · GS-06 **2,299** · GS-03 **3,299**. See "Deep research refinements (batch 2)" below + master doc.

| SKU | Name | **Price (AED)** | List | Save |
|-----|------|-----------------|------|------|
| GS-01 | Korean Glass Skin Essentials | **899** | 1,040 | 141 |
| GS-02 | Korean Glass Skin Kit ★ | **1,849** | 2,160 | 311 |
| GS-03 | Korean Glass Skin Complete | **2,799** | 3,310 | 511 |

**Master doc:** `Desktop/Skin/05-bundle-spec/UAE_MARKET_PRICING.md` (competition, PDP copy, vs Deep Moisturizing Box).

## Corrections (2026-06-29 review)

- Tier C algae mask: **10 × single sheet @ 36 AED** (not one “10-pack” SKU); MS code `00140`
- Ingredient copy: **Hyaluronan 11** (not “triple-weight HA”); hyaluron cream seal ≠ ceramides (those are in Skin Barrier Cream)
- Tier B missing Revita Glow + Skin Defender vs full AM/PM protocol — documented as upsell
- Brochure HTML on genosys.ae updated to match Intertek/product INCI positioning
- Added brochure tier alignment table (Daily 1,040 / Intensive 1,670 / Total Recovery 2,550 AED)

## From-scratch verification (2026-06-30)

Re-checked all docs against `lib/products.ts` + `lib/moysklad.ts`:

- **All unit prices verified** (Snow O₂ 330, Booster 260, Hyaluron Serum 330, Hyaluron Cream 290, Mist 160, Barrier 450, Overnight 340, Hydro Soothing 290, EPI 250, Algae 36, Revita Glow 250, Skin Defender 290)
- **All sums verified:** GS-01 1,040 · GS-02 2,160 · GS-03 3,310 · GS-04 2,410 · GS-05 2,450
- **All discount math verified:** 899/1,849/2,799/2,049/2,079
- **Deep Moisturizing Box 1,120** confirmed (1,318 × 0.85)
- **FIXED — 3 wrong MoySklad codes in GS-02 table:** Hyaluron Serum `00195` (was 54458), Hyaluron Cream `54458` (was 00195) — were swapped; Mist `00188` (was 00196)
- **Flagged quirk:** Mist (00188) website D2C = 160 AED vs MoySklad retail list = 80 AED — `lib/products.ts` is source of truth for the bundle

## Concept validation + improvements (2026-06-30)

**Web scan verdict: concept is sound & well-timed.**
- Glass skin still dominant in 2026, evolved to **"Glass Skin 2.0 / bloom / cloud"** — barrier-first, ceramide/PDRN/peptide, shorter routines (Vogue, Jivaka, OneulKorea)
- GENOSYS runs a real clinical "Korean Glass Skin Facial" (Autumn Harmony UK) — protocol mapping confirmed
- UAE demand surging: **+60% QoQ** (Aster), Watsons doubled YoY, Dubai = 35–40% of UAE K-beauty (Khaleej Times)

**Improvements applied to Desktop/Skin docs:**
- Repositioned as **"Glass Skin 2.0 — barrier-first"**
- **GS-06 "Glass Skin + PDRN"** added (GS-02 + Bio-Meso PDRN Homecare 5000) → **2,099 AED** (rides 2026 PDRN trend)
- **GS-01 repriced 899 → 999** with 2 bonus algae masks = on-trend minimalist hero (fixes free-ship awkwardness)
- PDP price-gap justifier block + AM/PM visual step card
- Naming: keep SEO title + branded sub-line; GWP over deeper discount; verified MS codes in ops section

**✅ Mist price confirmed (no blocker):** Microbiome Mist (id 14 / MS 00188) = **160 AED retail** (D2C, used in bundles) / **80 AED clinic-B2B** — two valid lists, same as Sea Algae (36/18). Confirmed by owner 2026-06-30. All bundle sums correct.

## Deep research refinements (2026-06-30, batch 2)

Massive web investigation → refined base case (full detail in `Desktop/Skin/05-bundle-spec/UAE_MARKET_PRICING.md §9`):

- **SPF added to hero (biggest fix):** every dermatologist names SPF the #1 non-negotiable glass-skin step; our kits omitted it. GS-02/03/06 now include **Ultra Shield SPF50+** (id 39, 250). Mass kits skip SPF too → also a differentiator.
- **3-tier good-better-best decoy:** GS-01 (Good 999) / **GS-02★ (Better, hero, 2,049, 8 items incl SPF)** / GS-03 (Best/anchor 3,299) + GS-06 PDRN featured (2,299). Retired GS-04 (SPF now standard); GS-05 → checkout add-on.
- **PDRN validated hard** (+610% YoY, 37.2M monthly interactions) — but claim barrier/texture/regeneration-support only, not injectable-equivalent; salmon-derived = non-vegan.
- **Barrier+microbiome = dominant 2026 framework** → lead with "Glass Skin 2.0 — barrier-first."
- **Competition confirmed mass (99–260 AED)** vs our 999–3,299 premium lane; **authenticity/freshness** (marketplace stock 6–18 mo old) is a real wedge.
- **Pricing psychology:** anchoring (+15–28%), 3-tier decoy (middle wins 60%+), % discounts for high-ticket, charm 999 for entry, bundle-as-default.
- **UAE seasonality:** launch now into Dubai Summer Surprises (Jul 2–Aug 30) + AC/indoor-summer angle; Oct–Mar peak; build Ramadan/Eid 2027 gift set.
- **Oil-cleanser gap RESOLVED (owner decision):** Skin Defender (biphasic oil remover, id 11) = the PM oil-cleanse step → then Snow O₂ (water). Included in GS-03 Complete (now 3,299, 12 items + masks); offered as +290 "double cleanse" add-on on GS-01/GS-02.

## Discount logic — reuse existing engine (2026-06-30)

Owner asked "can we apply our existing bundle discount logic here too?" → **yes, two mechanisms already exist:**

1. **Beauty Box engine** (`lib/discountUtils.ts` → `BEAUTY_BOX_REGULAR_PRICES` + `BEAUTY_BOX_DISCOUNT_PERCENTAGE=15`): fixed curated set, built-in 15%, category `Beauty Boxes`, excluded from BF/VIP stacking. **→ Use this for Glass Skin kits.** Wiring = add `productNumber: listPrice` to the map, set category, store discounted price. MoySklad explosion mirrors `DEEP MOISTURIZING BEAUTY BOX`.
2. **Build-Your-Set tiered ladder** (`app/bundle-builder/` → `BUNDLE_DISCOUNT_TIERS`): 2=5% · 3=10% · 4=15% · 5+=20% on retail (mutually exclusive w/ VIP/BF, customer gets better). **→ cross-sell for DIY routines.**

Decisions:
- Standardise 3 core kits at ~15% (GS-02 2,049 / GS-06 2,299 / GS-03 3,299 already 14–15%) → matches the 6 existing Beauty Boxes.
- GS-01 = deliberate entry exception (~10%, +2 bonus masks) → display flat "Save AED 113" (badge hard-codes 15%), or reprice for clean badge (owner's call). *(Superseded by batch 3: honest-15% rebuild = **884** on 4-core list + masks as GWP — not 945.)*
- ⚠️ **Tension:** Build-Your-Set gives 20% at 5+ items; curated kits give 15%. Protect kits with non-% value (bonus masks, protocol PDF, gift packaging, authorized-fresh stock), or cap the builder at 15% / exclude Glass Skin components.

Full detail: `Desktop/Skin/05-bundle-spec/UAE_MARKET_PRICING.md §9B`.

## Deep refine — margin + profit-aware offers (2026-06-30, batch 3)

Owner pushed "still not good enough." Stopped polishing copy; investigated the **business layer**. Full detail → `Desktop/Skin/05-bundle-spec/UAE_MARKET_PRICING.md §10`.

- **Verified all 15 SKUs** exist in `lib/products.ts` (in stock, prices correct). Bio-Meso PDRN already has `productNumber: '65'`; Skin Defender is category `Cleanser` (supports oil-cleanse use).
- **Found real COGS** = GENOSYS Export Orderform FOB Korea USD (`docs/GENOSYS_Export_Orderform_Codes_2026_normalized.csv`). Computed bundle margins:
  - **Gross margin ~84–85%** (FOB), ~79–82% landed (×1.3). FOB→RRP markup ~7–8×.
  - **The 15% discount is a brand/clinic-integrity cap, NOT a cost limit** — we could go to 25% and stay >75%. This reframes the whole discount question.
- **GWP economics:** Sea Algae costs ~3.6 AED/sheet but reads as 36 → **GWP transfers ~10× perceived value per real AED**. Lead with GWP (masks/sachets), hold discount at 15%. (2026 research: GWP preserves reference price, lifts beauty sales 15–20%, 90% rebuy / 92% refer.)
- **Missing LTV lever = subscription:** consumables used up in 4–8 wks; S&S 10–15% converts 15–25% of buyers, lifts LTV 3–5×, = 25–40% of skincare revenue. → add **"Glass Skin Monthly Refill"** (Mist+Serum+Cream).
- **New acquisition funnel:** **Glass Skin Discovery sachet set** (~10 AED COGS) at 99–149 AED — captures the 99–260 AED mass searcher + collects quiz/email data.
- **Routine pressure-test:** GS-02 sound but lacks exfoliant → offer **EPI +250 add-on**; GS-03 4-cream stack → **position Hydro Soothing as post-EPI-peel calm** (clear non-overlapping job).
- **Conversion levers:** skin quiz (+28%), clinical/ingredient trust above fold, free-ship bar as GS-01→1,000 nudge.
- **Caveat (margin leaks):** opened-skincare returns are ~total write-offs → reserve 8–12%; model GWP/testers as COGS; score offers on **contribution dollars, not AOV**.
- **GS-01 badge fix:** rebuild as 4 core (list 1,040) → **884 at honest 15% + 2 free masks (GWP)** so the Beauty Box "15%" badge is truthful (alt: keep 999 flat-saving — owner's call).

## Next Steps (website build)

1. Add bundle SKU in `lib/products.ts` with component line items
2. Hero flatlay from Desktop/Skin images
3. Cross-link training + PDF download on PDP
4. EN/AR/RU copy from BUNDLE_BUILD_BRIEF routine section
