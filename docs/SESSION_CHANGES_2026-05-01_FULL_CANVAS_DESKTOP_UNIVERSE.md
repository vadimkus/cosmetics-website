# Session Changes — Full-Canvas Desktop Universe

Date: 2026-05-01

## Context

Vadim rejected the design because it still felt like a normal ecommerce page with a 3D block inserted into it. The new requirement is explicit: from below the header until the footer, the desktop homepage should be a full 3D canvas experience.

## Research Direction

Current immersive WebGL/R3F ecommerce and luxury examples use:

- full-viewport canvas as the page stage
- DOM overlays only for copy, CTAs and controls
- clickable 3D hotspots
- spatial product/world navigation
- minimal page chrome
- footer after the immersive scene, not multiple classic content sections

The important lesson: the 3D should not look like a WebGL demo or embedded card. The page itself should feel like the scene.

## What Changed

Updated locale homepages:

- `app/page.tsx`
- `app/ar/page.tsx`
- `app/ru/page.tsx`

Removed the classic desktop `HomeDesktopSections` from the homepage render so the desktop route becomes:

1. mobile fallback hero for mobile only
2. desktop GENOSYS Universe full-canvas experience
3. footer

The homepage still keeps schema data (`HomeItemListSchema`, FAQ, breadcrumb, speakable schema) for SEO.

Updated `components/desktop-experience/DesktopGenosysUniverseHub.tsx`.

- Canvas now fills the whole desktop universe section.
- Text, CTA buttons, stats, mission card and world cards are overlays.
- Product/concern worlds remain linked through DOM cards and 3D hotspot numbers.
- The section is sized to the viewport below the header.

Updated `components/desktop-experience/GenosysUniverseScene.tsx`.

- Scene is positioned as a full-canvas spatial field.
- Camera and composition adjusted for the larger stage.
- Molecular sculpture and orbiting world markers are placed as one universe system.

## Design Rule

Desktop homepage must be treated as a product universe, not as a landing page with a 3D module.

Mobile web and PWA remain separate and should not inherit this heavy desktop experience.

## Next Steps

- Replace primitive molecular geometry with real art-directed GLB assets.
- Add camera state changes when a world card is hovered or selected.
- Add a real product model to the Skin Barrier world.
- Add a lightweight intro loading state for the canvas.
