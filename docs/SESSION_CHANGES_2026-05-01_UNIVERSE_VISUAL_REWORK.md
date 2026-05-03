# Session Changes — GENOSYS Universe Visual Rework

Date: 2026-05-01

## Context

Vadim reviewed the first GENOSYS Universe hub and did not like the look. The issue was valid: the first pass felt like a technical demo with labels attached to a sphere, not a premium game-like GENOSYS world.

This rework improves the visual direction while keeping the same architecture and routes.

## What Was Wrong

- Too much text was floating inside the 3D scene.
- The center object looked like a generic moon/ball instead of a skincare/lab core.
- The scene labels made the experience feel cluttered and less premium.
- The left-side logo repeated what the header already says.
- The cards looked more like prototype/debug cards than a luxury interface.

## What Changed

### R3F Scene

Updated `components/desktop-experience/GenosysUniverseScene.tsx`.

Changes:

- Removed large text labels from inside the canvas.
- Replaced text-heavy portals with small numbered portal markers.
- Reworked the center object into a more clinical-lab core with a small product chamber.
- Added subtler orbit shells and lighting.
- Reduced particle intensity and visual clutter.
- Kept portal clickability through numbered markers.

### Desktop Hub UI

Updated `components/desktop-experience/DesktopGenosysUniverseHub.tsx`.

Changes:

- Rewrote copy from "Enter the skincare universe" to a stronger positioning line:
  - "A skincare world, not a catalogue."
- Removed repeated logo inside the hero.
- Added a "Current mission" card for Skin Barrier.
- Improved CTA hierarchy:
  - Primary: start with Barrier Chamber
  - Secondary: classic catalogue
- Reworked cards into numbered world entries that visually match the scene markers.
- Improved the scene frame to feel more like a premium command center.

## Direction Going Forward

The correct visual rule is:

**The 3D canvas should feel cinematic and spatial. The DOM should carry readable navigation and commerce.**

Do not put too much copy inside the 3D scene. Use the scene for atmosphere, motion, depth, and object presence. Use DOM panels/cards for explanation and navigation.

## QA Focus

- Desktop homepage should feel less cluttered than the first pass.
- Scene should have fewer words and more premium atmosphere.
- Portal cards must remain clickable.
- `/ar` and `/ru` still render localized copy.
- Mobile/PWA still use the existing non-R3F path.
