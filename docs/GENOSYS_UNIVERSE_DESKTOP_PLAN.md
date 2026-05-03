# GENOSYS Universe — Desktop Immersive Experience Plan

Date: 2026-05-01

## Vision

GENOSYS desktop should feel like entering a premium skincare universe, not browsing a catalogue. The user should feel they are inside a clinical-luxury lab where products, skin concerns, routines, ingredients, and treatment protocols are explorable objects.

The benchmark is not another cosmetics store. The target feeling is closer to a polished game menu, Apple product theatre, and futuristic dermatology lab combined.

## Non-Negotiable Principles

1. **Desktop only for the immersive layer.** Mobile web and installed PWA keep their current proven flows unless we explicitly design separate mobile experiences later.
2. **Commerce remains stable.** Cart, pricing, variants, checkout, auth, discounts, reviews, schema markup, and order flows stay DOM-based and tested.
3. **R3F is the experience layer, not the source of truth.** Product data still comes from the existing database/config patterns.
4. **Every visual effect must have a product purpose.** Beauty for beauty's sake is not enough. Effects should teach: barrier repair, pigmentation, hydration, recovery, professional protocols.
5. **Progressive enhancement.** If WebGL, motion, or device capacity is unsuitable, the user gets an elegant static fallback.
6. **All locales stay respected.** English, Arabic RTL, and Russian must not diverge.
7. **Each slice must be locally viewable.** We should always have something running at `localhost:3000` after a slice.

## Current Foundation Already Built

Implemented in `SESSION_CHANGES_2026-05-01_DESKTOP_R3F_EXPERIENCE.md`:

- R3F dependencies installed.
- `useDesktopExperience()` added.
- `DesktopExperienceGate` added.
- Desktop homepage R3F hero prototype added.
- Desktop PDP product-lab prototype added.
- Mobile/PWA paths unchanged.

## Final Product Shape

### 1. GENOSYS Universe Hub

The desktop homepage becomes the entry point to the universe:

- Central GENOSYS world / lab core.
- Orbiting product zones.
- Clickable portals into concerns and products.
- Animated particles representing ingredients and skin biology.
- A clear path to Skin Barrier as the first full chamber.

Primary zones:

- **Barrier Chamber** — Skin Barrier, hydration, sensitivity, post-procedure recovery.
- **Brightening Orbit** — pigmentation, radiance, sun damage.
- **Acne Control Deck** — blemishes, pores, oil balance.
- **Age Repair Ring** — anti-aging, wrinkles, firmness.
- **Professional Protocol Room** — microneedling, pro solutions, clinic workflows.
- **Sun Shield Field** — SPF, UAE climate, daily defense.

### 2. Skin Barrier Chamber

First full interactive product room:

- Real product model or calibrated placeholder until GLB is ready.
- 36-frame spin once photos are uploaded.
- Barrier-layer particles showing hydration/recovery logic.
- Product callouts: ingredients, benefits, how to use, who it is for.
- Add to Bag remains in the existing PDP DOM.

### 3. Product Universe Map

Desktop `/products` evolves from flat catalogue into a map:

- Interactive shelf/orbit of product categories.
- Filters become navigation controls, not just dropdowns.
- Users can enter product families by concern or routine.
- Existing product grid remains available as a fallback and for fast buying.

### 4. Treatment Paths

Concern pages become guided journeys:

- Start with a concern portal.
- Show morning/evening routine as a path.
- Products appear as nodes in the path.
- PDFs/protocols become downloadable evidence cards.

### 5. Return Hooks

Make users want to come back:

- Saved skin journey for logged-in users.
- Recently explored products.
- Routine progress cards.
- Seasonal UAE climate modules.
- New product chambers as we upload assets.

## Implementation Slices

### Slice 1 — Universe Hub

Goal: replace the temporary Skin Lab hero with a true GENOSYS Universe hub.

Work:

- Add universe zone config.
- Add R3F scene with central core and orbiting portals.
- Add desktop overlay cards linking to products/concerns.
- Apply to `/`, `/ar`, `/ru`.

Acceptance:

- Desktop homepage says GENOSYS Universe.
- Users can click into Skin Barrier and concern zones.
- Mobile/PWA still render existing homepage path.
- TypeScript, focused lint, and local smoke test pass.

### Slice 2 — Skin Barrier Chamber

Goal: make `/products/27` feel like the first product room.

Work:

- Convert current product-lab placeholder into Skin Barrier chamber.
- Add tab/chapters: Inspect, Barrier Science, Routine, Buy.
- Add animated barrier membrane and ingredient particles.
- Prepare GLB loader boundary.

Acceptance:

- `/products/27` desktop has a distinct chamber, not generic PDP.
- Existing price, variant, quantity, and cart controls still work.
- Static fallback remains elegant.

### Slice 3 — Universe Product Listing

Goal: add an immersive desktop entry above `/products`.

Work:

- Add category orbit/shelf.
- Keep existing grid below for fast shopping.
- Link orbit portals to existing category/concern pages.

Acceptance:

- `/products` desktop feels like entering a catalogue world.
- Existing filters and product grid remain usable.

### Slice 4 — Concern Worlds

Goal: turn high-value concern pages into treatment journeys.

Work:

- Build reusable `TreatmentPathScene`.
- Apply first to hydration/sensitivity/barrier-related concern.
- Reuse routine data from `lib/concernsData.ts`.

Acceptance:

- Concern page explains a routine visually.
- Product nodes link to PDPs.
- PDFs remain accessible.

### Slice 5 — Asset Replacement

Goal: replace placeholders with real assets.

Work:

- Process 36 photos per product.
- Add `glb` / `usdz` paths to product experience config.
- Add model loading with fallback.
- Optimize compressed assets.

Acceptance:

- Skin Barrier uses real product asset.
- Performance remains acceptable.
- Fallback still works.

## Technical Architecture

Core files:

- `hooks/useDesktopExperience.ts` — desktop/WebGL/reduced-motion/PWA gate.
- `components/desktop-experience/DesktopExperienceGate.tsx` — wrapper for immersive surfaces.
- `components/desktop-experience/*Scene.tsx` — R3F scenes.
- `components/desktop-experience/*Hub.tsx` — DOM + R3F composed page sections.
- `lib/productExperience.ts` — product-specific 360/model asset registry.
- `lib/genosysUniverse.ts` — universe zone registry.

Performance rules:

- Dynamic import R3F scenes with `ssr: false`.
- Keep `dpr` capped.
- Prefer simple geometry until assets are optimized.
- Use static fallback when WebGL/reduced-motion/PWA gate blocks.
- Do not block checkout or product data on 3D loading.

## QA Gates Per Slice

- `npx tsc --noEmit`
- Focused ESLint for edited files
- `npx next build` before commit/push-level confidence
- Browser smoke:
  - Desktop homepage
  - Desktop `/products/27`
  - Mobile-width fallback
  - Arabic homepage RTL
  - Russian homepage

## Immediate Execution

Start with Slice 1 now:

1. Create `lib/genosysUniverse.ts`.
2. Add `GenosysUniverseScene`.
3. Add `DesktopGenosysUniverseHub`.
4. Replace the temporary `DesktopSkinLabHero` usage on homepages.
5. Verify locally on `localhost:3000`.
