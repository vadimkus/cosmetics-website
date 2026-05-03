# Session Changes — Face-Led 3D Hero Experiment

Date: 2026-05-01

## Context

Vadim wanted the desktop hero to feel less like a product placeholder and more like a premium skincare/beauty campaign, with a beautiful athletic woman's face, blue eyes, and a science-led 3D layer.

## Asset Direction

Generated original synthetic references instead of using a real model from the web. This avoids licensing and personality-rights issues.

Assets copied into:

- `public/images/desktop-experience/genosys-athlete-face-front.png`
- `public/images/desktop-experience/genosys-athlete-face-three-quarter.png`
- `public/images/desktop-experience/genosys-athlete-face-side.png`
- `public/images/desktop-experience/genosys-athlete-face-hero.png`

The first three are reference views for a future real 3D face/GLB workflow. The hero image is used now.

## What Changed

Updated `components/desktop-experience/DesktopHero3DVisual.tsx`.

- Replaced Skin Barrier fallback imagery with the generated face hero image.
- Keeps the visual inside the existing hero media slot.
- Adds "Skin science hero" and "Interactive skin map" overlay badges.
- Uses the face image as the primary visual subject.

Updated `components/desktop-experience/SkinLabHeroScene.tsx`.

- Removed the placeholder product bottle from the active hero canvas.
- Reworked the R3F layer into a transparent scientific overlay:
  - skin barrier scan rings
  - molecule cluster
  - cheek/skin mapping particles
  - hydration/glow/recovery callout
- The canvas now behaves as a 2.5D interactive skin-science overlay on top of the generated face.

## Important Note

This is not yet a true 3D face mesh. It is the correct interim step:

1. Use a synthetic face hero now.
2. Add interactive R3F scientific layers.
3. Later convert the reference set into a proper face GLB via Blender, Meshy, Tripo, or another image-to-3D workflow.

## Next Steps

- Generate or commission a real 3D face mesh.
- Use the front / three-quarter / side references for mesh creation.
- Replace the 2.5D image layer with a GLB face bust once ready.
- Keep the hero conservative and ecommerce-friendly until user testing proves customers enjoy a stronger immersive version.
