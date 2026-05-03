# Session Changes — Rotatable 3D Face Hero

Date: 2026-05-01

## Context

The previous face-led hero used a flat generated face image with a moving scientific overlay. That was visually misleading: the face itself did not rotate, while the "Skin barrier scan" card and decorative scan elements moved. Vadim correctly flagged this as strange.

## What Changed

Updated `components/desktop-experience/DesktopHero3DVisual.tsx`.

- Removed the "Skin science hero" pill.
- Removed the "Interactive skin map" pill.
- Removed the flat face image as the primary desktop hero layer.
- Kept the generated face image only as the non-WebGL fallback.

Updated `components/desktop-experience/SkinLabHeroScene.tsx`.

- Replaced the 2.5D flat-image overlay with an actual procedural R3F face bust.
- The hero subject is now made from real 3D geometry:
  - head
  - neck and shoulders
  - hair cap and bun shape
  - ears
  - blue eyes, irises, pupils
  - brows
  - nose
  - lips
  - cheek glow
- Removed the "Skin barrier scan" HTML callout entirely.
- Kept only subtle background molecules and a soft barrier ring as atmosphere.
- The face responds to pointer movement and drag through `OrbitControls`.

## Honest Limitation

This is now a real rotatable 3D object, but it is still a procedural prototype, not a photorealistic scanned/modelled human face. The production-quality version should use a GLB face bust made in Blender or generated from the synthetic reference set.

## Recommended Next Step

Use the generated front / three-quarter / side references to create a proper GLB face mesh, then replace the procedural bust in `SkinLabHeroScene.tsx`.
