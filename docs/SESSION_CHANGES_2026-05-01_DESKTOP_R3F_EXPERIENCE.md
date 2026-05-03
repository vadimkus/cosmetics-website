# Session Changes — Desktop React Three Fiber Experience

Date: 2026-05-01

## Context

Vadim wants GENOSYS desktop to feel like a tech-forward dermacosmetics company, not a normal catalogue site. The first implementation pass starts the desktop-only rebuild with React Three Fiber while keeping mobile web and installed PWA behavior unchanged.

This work follows the earlier Skin Barrier 360 prep. The 36-frame spin and real GLB/USDZ assets are still asset-pending; this pass builds the local interactive foundation now so real product assets can be swapped in when photos/models arrive.

## What Changed

### Dependencies

Added the desktop 3D stack:

- `three`
- `@react-three/fiber`
- `@react-three/drei`
- `@react-three/postprocessing`

### Desktop Experience Gate

Added `hooks/useDesktopExperience.ts` and `components/desktop-experience/DesktopExperienceGate.tsx`.

The gate only enables the R3F surface when all conditions are true:

- Client has hydrated
- Viewport is desktop width (`>= 1024px`)
- Browser supports WebGL
- User has not enabled reduced-motion preference
- Installed PWA mode is not active

This preserves mobile web and native/app-like behavior while letting desktop evolve aggressively.

### Desktop Homepage

Added:

- `components/desktop-experience/DesktopSkinLabHero.tsx`
- `components/desktop-experience/SkinLabHeroScene.tsx`

The homepage now renders:

- Existing `Hero` for `< lg` screens
- New `DesktopSkinLabHero` for desktop (`lg+`)
- Existing `HomeDesktopSections` below the new desktop hero

Applied to all homepage locales:

- `app/page.tsx`
- `app/ar/page.tsx`
- `app/ru/page.tsx`

The scene currently uses a Skin Barrier-style placeholder tube, molecule/ring elements, live pointer rotation, and desktop lab copy. It is intentionally built as a real R3F scene, not a static mockup.

### Product Detail Page

Added:

- `components/desktop-experience/DesktopProductLab.tsx`
- `components/desktop-experience/ProductLabScene.tsx`

Updated:

- `app/products/[id]/ProductPageClientRefactored.tsx`

Desktop PDP now renders a product-lab scene above the existing price, variants, quantity, and add-to-cart blocks. Mobile/tablet keeps `ProductImageGallery`. Commerce logic remains untouched.

For Skin Barrier (`productNumber === "27"`), the placeholder label is specialized as `SKIN BARRIER`. Other products use a generic interactive inspection placeholder until their assets are prepared.

## Architecture Decision

The rebuild is intentionally progressive:

1. Keep checkout/pricing/cart DOM-based and proven.
2. Replace desktop presentation surfaces with R3F.
3. Keep all R3F behind a shared desktop gate.
4. Use placeholders only where real assets are not ready.
5. Swap placeholders with real GLB/USDZ and/or 36-frame spins once assets arrive.

This avoids breaking revenue-critical flows while still changing the perceived desktop product experience immediately.

## Asset Upgrade Path

For Skin Barrier:

1. Upload/process the 36 iPhone turntable shots from the capture workflow documented in `SESSION_CHANGES_2026-05-01_SKIN_BARRIER_360_PREP.md`.
2. Export optimized frames to `public/products/27/360/skin-barrier-001.webp` through `skin-barrier-036.webp`.
3. Produce a lightweight `skin-barrier.glb` and optional `skin-barrier.usdz`.
4. Replace the R3F placeholder geometry in `ProductLabScene.tsx` / `SkinLabHeroScene.tsx` with a GLB loader.
5. Mark product `27` as `ready` in `lib/productExperience.ts` when assets are verified.

## Local QA Checklist

- Desktop `/` renders the Skin Lab hero.
- Desktop `/ar` renders RTL Skin Lab copy.
- Desktop `/ru` renders Russian Skin Lab copy.
- Desktop `/products/27` renders the product-lab scene.
- Mobile widths still render the old homepage hero and product gallery.
- Installed PWA mode does not render the R3F experience.
- Reduced-motion browsers get static fallback.
- WebGL-disabled browsers get static fallback.
- Cart, pricing, variants, reviews, and schema markup remain unchanged.

## Known Follow-Ups

- Replace placeholder geometry with real GLB/USDZ assets.
- Add a real 360/3D media switcher once Skin Barrier frames are uploaded.
- Consider a desktop product shelf/wall for `/products` after PDP and homepage are stable.
- Add Playwright/browser smoke tests for desktop vs mobile render paths once visual direction is approved.
