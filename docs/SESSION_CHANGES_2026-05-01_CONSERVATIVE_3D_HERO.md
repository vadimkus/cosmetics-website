# Session Changes — Conservative Desktop 3D Hero

Date: 2026-05-01

## Context

After reviewing the full GENOSYS Universe direction, Vadim raised a valid product concern: the customer base may not be ready for a radical homepage replacement. The revised experiment keeps the familiar ecommerce homepage structure and upgrades only the desktop hero media area into an interactive 3D experience.

## What Changed

Updated the locale homepages:

- `app/page.tsx`
- `app/ar/page.tsx`
- `app/ru/page.tsx`

The classic homepage flow is restored:

1. `Hero`
2. `HomeDesktopSections`
3. footer

The full-canvas Universe is no longer the active homepage entry point, but the components remain available for later experiments.

Updated `components/Hero.tsx`.

- Removed the desktop autoplay video from the desktop hero media slot.
- Inserted a desktop-only 3D visual panel in the same position.
- Mobile hero behavior remains unchanged.
- Existing copy, CTAs, proof strip and app badges remain intact.

Added `components/desktop-experience/DesktopHero3DVisual.tsx`.

- Loads `SkinLabHeroScene` dynamically client-side.
- Uses the desktop WebGL/reduced-motion/PWA gate.
- Falls back to a static Skin Barrier image if WebGL is unavailable.
- Keeps the 3D experience contained inside the existing hero layout.

## Product Rationale

This is the safer direction for production:

- Customers still see a familiar ecommerce homepage.
- The brand still gets a tech-forward 3D signal above the fold.
- The change is easy to A/B test against the current video hero.
- Mobile web and installed app remain stable.

## Next Steps

- Replace primitive placeholder geometry with real Skin Barrier GLB/USDZ assets.
- Tune the desktop hero composition once product photos/3D assets are ready.
- Consider an A/B test: video hero vs 3D hero.
- Keep the full GENOSYS Universe as a later opt-in experience or campaign page, not the default homepage yet.
