# Session Changes — Face GLB Reference Pack

Date: 2026-05-01

## Context

Vadim asked to convert the generated front / three-quarter / side references into a proper GLB and generate more images so the model can rotate smoothly.

## What Was Generated

Created a fuller synthetic reference set for the same beauty / athlete direction. These are original generated references and are stored in:

`public/images/desktop-experience/face-references/`

Reference files:

- `genosys-athlete-face-ref-00-front.png`
- `genosys-athlete-face-ref-15-left.png`
- `genosys-athlete-face-ref-15-right.png`
- `genosys-athlete-face-ref-30-left.png`
- `genosys-athlete-face-ref-30-right.png`
- `genosys-athlete-face-ref-45-left.png`
- `genosys-athlete-face-ref-45-right.png`
- `genosys-athlete-face-ref-profile-left.png`
- `genosys-athlete-face-ref-profile-right.png`
- `genosys-athlete-face-ref-back.png`
- `genosys-athlete-face-ref-front-up.png`
- `genosys-athlete-face-ref-front-down.png`

Some generated outputs are clean single-angle references; a few came back as multi-view contact sheets. Keep them because they are still useful for a human Blender artist or image-to-3D tool.

## Local GLB Created

Generated a web-ready GLB asset at:

`public/models/desktop-experience/genosys-athlete-face-bust.glb`

Generation script:

`scripts/generate-athlete-face-glb.mjs`

The script exports a reference-driven procedural face bust using Three.js and `GLTFExporter`.

## Hero Integration

Updated `components/desktop-experience/SkinLabHeroScene.tsx`:

- Loads the GLB through `useGLTF`.
- Preloads the GLB for the desktop hero.
- Applies pointer-driven rotation to the loaded model group.
- Keeps the scientific molecule/ring atmosphere separate from the face asset.

## Important Limitation

This is a proper `.glb` file, but it is **not** a photorealistic reconstructed face mesh from the images. Local tooling available in this environment:

- Blender: not installed.
- Python photogrammetry / `trimesh`: not installed.
- Three.js GLTF export: available.

So the local GLB is a clean web prototype. To get a beauty-campaign-grade supermodel face, the next step is to feed the reference set into a dedicated tool such as Meshy, Tripo, Blender sculpting, or another licensed image-to-3D workflow, then replace `genosys-athlete-face-bust.glb` with the production mesh.
