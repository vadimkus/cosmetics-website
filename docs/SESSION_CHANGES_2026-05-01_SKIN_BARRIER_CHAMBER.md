# Session Changes — Skin Barrier Chamber

Date: 2026-05-01

## Context

This is Slice 2 from `GENOSYS_UNIVERSE_DESKTOP_PLAN.md`.

After the GENOSYS Universe homepage hub, the next required step was making Skin Barrier product `27` feel like the first real room in the Universe, not a generic product detail page.

## What Changed

### Dedicated Chamber Scene

Added `components/desktop-experience/SkinBarrierChamberScene.tsx`.

The scene includes:

- Skin Barrier placeholder tube geometry
- animated barrier membrane rings
- ingredient/recovery particles
- chapter-aware colors
- scene callout via Drei `Html`
- bloom/vignette postprocessing
- orbit controls
- capped DPR and desktop-only WebGL rendering through the existing gate

### Chamber UI

Added `components/desktop-experience/SkinBarrierChamber.tsx`.

The UI adds four desktop chapters:

- **Inspect** — rotate/inspect product, prepared for GLB and 36-frame spin
- **Barrier Science** — explains membrane/particle visual metaphor
- **Routine** — frames Skin Barrier in a post-procedure comfort path
- **Buy** — confirms commerce controls stay in the proven DOM layer

The chamber also shows:

- three proof cards
- asset pipeline status from `lib/productExperience.ts`
- CTA to existing product controls

### Narrow Product Wiring

Updated `components/desktop-experience/DesktopProductLab.tsx`.

Only Skin Barrier (`productNumber === "27"` or name match) renders the dedicated chamber. Other products keep the generic product-lab prototype.

### Commerce Anchor

Updated `app/products/[id]/ProductPageClientRefactored.tsx`.

Added `id="product-commerce"` to the existing price/control area, so the chamber CTA can scroll down to the proven purchase controls. No pricing, cart, variant, review, schema, or checkout logic was changed.

## Architecture Decision

The Skin Barrier Chamber is intentionally **not** the cart. It is the storytelling and discovery layer above the existing commerce system.

This keeps the revenue-critical paths safe while we build the game/lab feel around them.

## Asset Status

The chamber still uses placeholder geometry. Real assets are pending:

- 36 turntable frames for `/public/products/27/360/`
- Skin Barrier `.glb`
- optional `.usdz`

When assets are ready, replace the placeholder tube in `SkinBarrierChamberScene.tsx` with a GLB loader and mark product `27` ready in `lib/productExperience.ts`.

## QA Checklist

- Desktop `/products/27` renders "Skin Barrier Chamber".
- Chapter buttons switch the scene and active text.
- "Continue to product controls" scrolls to existing price/cart controls.
- Non-Skin Barrier PDPs still use the generic `DesktopProductLab`.
- Mobile/tablet still render `ProductImageGallery`.
- TypeScript, focused ESLint, and build pass.

## Next Slice

Slice 3 should begin the desktop `/products` Universe map:

- immersive product/category orbit or shelf above the existing grid
- links to the six Universe zones
- existing product filters/grid preserved below for fast shopping
