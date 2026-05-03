# Session Changes — Real Lady Hero Final

Date: 2026-05-01

## Context

The desktop homepage hero needed to stop showing the stylized/mannequin 3D face and show the generated beautiful athletic woman reference clearly. Browser screenshots confirmed the procedural GLB was technically loading but visually wrong for the brief.

## What Changed

- Added a Blender-based GLB builder for the photoreal face reference:
  - `scripts/build-photoreal-face-hero-glb.py`
  - Output: `public/models/desktop-experience/genosys-athlete-face-hero-real.glb`
  - Optimized output: `public/models/desktop-experience/genosys-athlete-face-hero-real-optimized.glb`
- Updated `npm run asset:face-glb` to rebuild the photoreal GLB asset instead of the mannequin bust.
- Added `components/desktop-experience/RealLadyHeroScene.tsx` as the R3F loader for the real-lady GLB asset.
- Updated the visible desktop homepage hero to use the clean photoreal generated reference directly:
  - `components/desktop-experience/DesktopHero3DVisual.tsx`
  - Image: `public/images/desktop-experience/face-references/genosys-athlete-face-ref-front-down.png`

## Important Decision

The finalized GLB asset exists and builds cleanly, but browser rendering of the GLB plane produced visible texture strip artifacts in the hero slot during visual QA. The live hero therefore uses the photoreal reference image directly as the visible layer, because it is visually correct and does not risk shipping a mannequin, blank canvas, or GLB artifact.

## Verification

- Rebuilt the GLB with `npm run asset:face-glb`.
- Inspected the optimized GLB with `gltf-transform inspect`.
- Ran focused typecheck and ESLint on the edited hero files.
- Restarted the local Next dev server and cleared stale browser service worker/cache state.
- Took browser screenshots until the hero showed the real woman face cleanly.

## Follow-Up

For a true rotatable photoreal head, use a real head-scan/artist-authored GLB or a production image-to-3D service. The current local GLB pipeline is useful for packaging a photoreal reference into a GLB, but it is not a substitute for neural/artist facial reconstruction.
