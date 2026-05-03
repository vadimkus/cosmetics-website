# Session Changes — Full-Bleed Molecular Hero

Date: 2026-05-01

## Context

Vadim reviewed the molecular homepage hero and called out the real issue: it looked like a low-quality block or embedded widget. The science direction was better than the avatar, but the presentation still felt boxed-in and not premium enough.

## What Changed

Updated `components/desktop-experience/DesktopGenosysUniverseHub.tsx`.

- Removed the framed card container around the R3F canvas.
- Moved the WebGL scene into the page atmosphere as a full-bleed right-side layer.
- Kept copy, CTAs and product-world cards as DOM overlays.
- Reduced visible UI chrome around the 3D scene.
- Updated the fallback visual to avoid the same boxed treatment.

Updated `components/desktop-experience/GenosysUniverseScene.tsx`.

- Increased canvas DPR range for sharper desktop rendering.
- Removed the block-like molecule pedestal.
- Replaced pedestal cylinders with floating translucent skin-membrane rings.
- Reduced sparkles and simplified the palette so the scene feels less toy-like.
- Increased geometry segments and lighting quality.

## Design Rule

For the desktop GENOSYS Universe, the 3D scene must not look like a widget, iframe, banner, or decorative card. It should feel native to the page, cinematic, and spatial.

The DOM should carry readable commerce/navigation. The WebGL layer should carry atmosphere, science, motion and product-world identity.

## Next Improvements

- Build a custom molecular sculpture instead of primitive atom balls.
- Add real ingredient labels outside the canvas as clean DOM annotations.
- Add hover-triggered world lighting.
- Replace placeholder molecules with actual Skin Barrier ingredient architecture once confirmed.
