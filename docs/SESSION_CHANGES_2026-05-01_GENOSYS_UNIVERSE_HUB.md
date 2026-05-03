# Session Changes — GENOSYS Universe Hub

Date: 2026-05-01

## Context

After the initial React Three Fiber desktop foundation, Vadim clarified the real direction: GENOSYS desktop should feel like an immersive skincare game/lab with its own universe, not simply a 3D product viewer.

This session starts Slice 1 from `GENOSYS_UNIVERSE_DESKTOP_PLAN.md`: the desktop homepage Universe hub.

## What Changed

### Universe Plan

Added `docs/GENOSYS_UNIVERSE_DESKTOP_PLAN.md`.

The plan defines:

- GENOSYS Universe vision
- Non-negotiable rules
- Final product shape
- Implementation slices
- Technical architecture
- QA gates
- Immediate Slice 1 execution steps

### Universe Zone Registry

Added `lib/genosysUniverse.ts`.

This registry defines the first six product/concern worlds:

- Barrier Chamber
- Brightening Orbit
- Acne Control Deck
- Age Repair Ring
- Professional Protocol Room
- Sun Shield Field

Each zone has:

- localized title/subtitle/signal
- destination route
- scene position
- color/glow identity
- optional product number

### R3F Universe Scene

Added `components/desktop-experience/GenosysUniverseScene.tsx`.

The scene includes:

- central GENOSYS core
- animated orbit rings
- clickable zone portals using Drei `Html`
- ingredient/star particles
- postprocessing bloom and vignette
- OrbitControls for desktop exploration

### Desktop Universe Hub

Added `components/desktop-experience/DesktopGenosysUniverseHub.tsx`.

The hub combines:

- GENOSYS Universe copy
- CTA to Skin Barrier Chamber
- CTA to all products
- R3F universe scene
- six clickable world cards under the scene
- static fallback for blocked WebGL/reduced-motion/PWA states

### Homepage Wiring

Updated desktop homepages to use the Universe hub:

- `app/page.tsx`
- `app/ar/page.tsx`
- `app/ru/page.tsx`

The old mobile hero remains active under `lg`. Desktop uses `DesktopGenosysUniverseHub`.

## Design Decision

The earlier Skin Lab hero was a useful technical proof. The Universe hub is the correct product direction because it creates a navigation metaphor:

- Users do not just shop products.
- They enter worlds based on skin goals.
- The first full world is Skin Barrier.
- Other worlds become upgrade paths as assets and treatment content are prepared.

## What Remains

Next slice: Skin Barrier Chamber.

Target:

- Turn `/products/27` from a generic product-lab surface into a distinct chamber.
- Add Barrier Science, Routine, Inspect, and Buy chapters.
- Prepare a GLB loader slot.
- Add animated barrier membrane/ingredient particles.
- Keep existing price/cart/variant DOM unchanged.

## QA Notes

Expected checks:

- TypeScript compile
- focused ESLint
- production build before commit/push confidence
- browser smoke on `/`, `/ar`, `/ru`, `/products/27`

Mobile/PWA should continue using the non-R3F experience.
