# Session Changes — 2026-05-02 — 3D Molecules Hero

## TL;DR

Desktop homepage hero swapped from the autoplay video to a **static photoreal portrait + transparent React Three Fiber atom field** drifting around her with cursor parallax. Mobile and PWA paths are unchanged. PDP / `/products/27` reverted to original — no 3D wiring on product pages.

Final shipping stack:

- `genosys-athlete-face-hero.png` — clinical-grade lady portrait with petri-dish glassware + baked-in translucent molecules (1536×1024 PNG, 2 MB)
- `AtomFieldScene.tsx` — 38 small glassy atoms, deterministic seed, individual orbits + cursor parallax that pushes them across X/Y/Z
- `DesktopHero3DVisual.tsx` — composes the static portrait, side vignette, and the R3F overlay; gated to ≥768 px viewport via `useDesktopExperience`
- `Hero.tsx` — desktop block now renders `<DesktopHero3DVisual />` where the desktop autoplay video block used to live; dead video state/ref/`useEffect` and unused logger imports removed

## Why this design

The user explicitly asked for *"static pic + molecules in 3D orbiting"* after rejecting:
- Big benzene-ring / DNA-helix molecule shapes ("don't look like molecules")
- A full procedural / GLB 3D head ("camera is framing the very top of her head" / "we caught the auto-rotate showing the back" — auto-fit and uncanny back-of-head views were never visually clean)
- A flat dumbbell-style 3-atom linear molecule ("looks like a barbell")

The accepted direction was: keep the photo doing the heavy emotional lifting, layer the 3D as small floating accents that respond to the cursor — the photo carries the subject; the atoms add motion and depth.

## Files

### Shipping (homepage uses these)

```ts
// components/Hero.tsx — desktop-only block
{/* Desktop 3D hero visual: static lady portrait + R3F atom field overlay */}
<div className="mb-4">
  <div className="mx-auto max-w-4xl">
    <DesktopHero3DVisual />
  </div>
</div>
```

| File | Role |
|---|---|
| `components/Hero.tsx` | Imports + renders `DesktopHero3DVisual` in the desktop-only branch. Mobile/PWA branches untouched. |
| `components/desktop-experience/DesktopHero3DVisual.tsx` | Composes static `<Image fill>` + side vignette + transparent R3F canvas overlay. Dynamically imports `AtomFieldScene` with `ssr: false`. Gates the 3D layer with `useDesktopExperience({ minWidth: 768 })`. |
| `components/desktop-experience/AtomFieldScene.tsx` | The R3F canvas. 38 glassy atoms (`MeshPhysicalMaterial` with `transmission`, `clearcoat`, `attenuationColor`), each with its own slow orbit + cursor parallax. Deterministic mulberry32 seed (7341) so the layout is identical across reloads. |
| `hooks/useDesktopExperience.ts` | Single source of truth for "should we render WebGL?" — checks viewport width, `prefers-reduced-motion`, and PWA-mode flag. |
| `public/images/desktop-experience/genosys-athlete-face-hero.png` | The static portrait used by the hero. Editorial 3/4 view with petri-dish glassware + baked-in translucent molecules + soft pink fabric backdrop. |

### Tuning constants worth knowing

```ts
// AtomFieldScene.tsx — generateAtoms()
orbitRadius: 0.12 + rand() * 0.45                       // idle orbit size
parallax:    0.35 + rand() * 0.85 + radius * 1.4         // cursor responsiveness
                                                         // bigger atoms → bigger parallax
// useFrame()
position.x: base + cos(t) * orbitRadius + pointer.x * parallax
position.y: base + sin(t * 0.7) * orbitRadius * 0.7 + pointer.y * parallax * 0.85
position.z: base + sin(t) * orbitRadius * 0.6 + pointer.x * parallax * 0.25
```

Cursor X also nudges atoms forward/back on Z, which sells the genuine 3D depth when sweeping horizontally.

The canvas wrapper does **not** have `pointer-events: none` — R3F needs to receive mouse events to update `state.pointer`. The hero block has no clickable elements behind it, so this is safe.

### Inspector / dev route

`/dev/3d-test` (`app/dev/3d-test/page.tsx` + `ModelInspector.tsx`) — drag-and-drop GLB inspector with model switcher, framing toggle, auto-rotate. Useful for validating any future GLB before wiring it into the homepage. Not linked from the public site.

### Parked (in the working tree but not wired)

These were iteration steps the user rejected in favor of the static-photo + atom-field direction. Left on disk for reference only:

- `components/desktop-experience/DesktopSkinLabHero.tsx` + `SkinLabHeroScene.tsx` — the original procedural-mannequin Skin Lab.
- `components/desktop-experience/DesktopGenosysUniverseHub.tsx` + `GenosysUniverseScene.tsx` — the abandoned Universe hub.
- `components/desktop-experience/DesktopProductLab.tsx` + `ProductLabScene.tsx` — PDP 3D experiment that was reverted (`/products/27` is back to original `ProductImageGallery`).
- `components/desktop-experience/SkinBarrierChamber.tsx` + `SkinBarrierChamberScene.tsx` — abandoned `/products/27` chamber.
- `components/desktop-experience/DesktopExperienceGate.tsx` — gate helper.
- `lib/genosysUniverse.ts` — copy / route map for the abandoned Universe hub.
- `public/images/desktop-experience/face-references/` — 12-angle synthetic face reference grid generated for the GLB pipeline.
- `public/models/desktop-experience/lady-head-real.glb`, `genosys-athlete-face-bust-final-optimized.glb`, `genosys-athlete-face-hero-real-optimized.glb` — the optimized GLBs from the earlier 3D-head experiment. The dev inspector route uses these.
- `scripts/build-photoreal-face-hero-glb.py`, `build-final-athlete-face-blender.py`, `generate-athlete-face-glb.mjs` — Blender / GLB asset pipeline.

If we revisit a real 3D head, the regenerate path is documented in `SESSION_CHANGES_2026-05-01_REAL_3D_LADY_HERO.md` (Hyper3D Rodin → `gltf-transform optimize --compress meshopt --texture-compress webp`).

## What changed in `Hero.tsx`

Removed (now-dead with the video block gone):

```diff
- import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
+ import { useState, useMemo, useCallback } from 'react'
- import { debugLog, warnLog } from '@/lib/logger'

- const [videoError, setVideoError] = useState(false)
- const desktopVideoRef = useRef<HTMLVideoElement>(null)

- useEffect(() => {
-   const video = desktopVideoRef.current
-   if (!video || videoError) return
-   video.play().catch(() => {
-     debugLog('Video autoplay prevented (normal browser behavior)')
-   })
- }, [videoError])
```

Replaced (the entire desktop video block with its `<video>` + fallback):

```diff
- {/* Video */}
- <div className="mb-4">
-   <div className="aspect-video w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-gray-100">
-     {!videoError ? (
-       <video ref={desktopVideoRef} autoPlay loop muted playsInline ...>
-         <source src="/videos/start-video.mp4" type="video/mp4" />
-       </video>
-     ) : (
-       <div ...><Image src="/images/genosys-logo.png" .../></div>
-     )}
-   </div>
- </div>
+ {/* Desktop 3D hero visual: static lady portrait + R3F atom field overlay */}
+ <div className="mb-4">
+   <div className="mx-auto max-w-4xl">
+     <DesktopHero3DVisual />
+   </div>
+ </div>
```

Mobile / Arabic / Russian and PWA paths are untouched. The mobile hero remains the static `<Image>` it already was.

## Dependencies

Added to `package.json`:

```jsonc
"@react-three/drei":            "^10.7.7",   // helpers: Float, environment, etc
"@react-three/fiber":           "^9.6.1",    // React renderer for three.js
"@react-three/postprocessing":  "^3.0.4",    // (parked, not used in shipping hero)
"three":                        "^0.184.0",  // peer of fiber/drei

// devDependencies
"@gltf-transform/cli":          "^4.3.0",    // GLB optimizer (asset pipeline)
"sharp":                        "^0.34.5"    // image transforms (asset pipeline)

// scripts
"asset:face-glb":               "blender ... && gltf-transform optimize ..."
```

The shipping hero only uses `@react-three/fiber` + `@react-three/drei` (Float helper) + `three`. The rest is pipeline / parked.

## Build / verification

| Phase | Result |
|---|---|
| `npm run build` | ✓ Compiled in 27 s; 376/376 static pages; **no warnings**, exit 0 |
| `npx tsc --noEmit` | ✓ no errors, exit 0 |
| `npx eslint components/Hero.tsx components/desktop-experience/AtomFieldScene.tsx components/desktop-experience/DesktopHero3DVisual.tsx` | ✓ clean, exit 0 |

Visual QA:

- `localhost:3000` (desktop, ≥768 px): petri-shot lady portrait + 38 small pink/white/pearl atoms drifting around her; cursor sweep pushes atoms to the edges, vertical movement tilts them, X movement also slides them forward/back on Z.
- Mobile / responsive ≤ 767 px: existing mobile static-image hero (no R3F).
- PWA installed app: existing static path (no R3F).
- `/products/27` (Skin Barrier 360 product page): original `ProductImageGallery` — no 3D wiring.

## Service-worker / cache note

During iteration the SW served stale chunks pointing at deleted `RealLadyHeroScene` / `MoleculeOrbitScene` modules and threw *"module factory is not available"* in the console. Resolution that worked end-to-end:

1. Delete the orphaned source files (`RealLadyHeroScene.tsx`, `MoleculeOrbitScene.tsx`).
2. `rm -rf .next && npm run dev` to rebuild from a clean Turbopack cache.
3. In the browser tab: hard-reload (Cmd+Shift+R) **or** DevTools → Application → Service Workers → Unregister, then reload.

When deploying, bump `lib/swVersion.ts` (auto-generated by `scripts/generate-sw-version.js`) so production clients pick up the new bundle without a manual cache flush.

## Reverted in this session (kept reverted on `main`)

- `app/products/[id]/ProductPageClientRefactored.tsx` — back to HEAD; no `DesktopProductLab`, no `#product-commerce` anchor. `/products/27` renders the standard PDP.

## Follow-up: video layer + click-to-replay (same session)

After the static-photo / atom-field hero shipped, a `hero.mp4` (15 MB, ~16:9, dropped to `public/videos/desktop-experience/genosys-hero.mp4`) was added behind the same surface. Behavior:

| State | What happens |
|---|---|
| First paint | Static petri-shot + atoms render immediately (instant LCP). The `<video>` element preloads silently in the background. |
| Buffer ready (`canplaythrough` fires) | Auto-starts a cycle: static fades out, video fades in (~900 ms ease-in-out), plays end-to-end **once**. |
| Cycle ends | Video fades out, static fades back in. Hero container becomes a `role="button"` (cursor pointer, keyboard-accessible). |
| User clicks the block (or presses Enter/Space) | Cycle replays: video rewinds and plays once more, then back to static. |
| Cursor parallax | Always running. Clicks bubble through the R3F canvas to the container's `onClick`, so the molecules don't intercept the click target. |
| `prefers-reduced-motion: reduce` | `<video>` element is never mounted. Static + atoms only. |

Tuning constants live at the top of `DesktopHero3DVisual.tsx`:

```ts
const STATIC_SRC = '/images/desktop-experience/genosys-athlete-face-hero.png'
const VIDEO_SRC = '/videos/desktop-experience/genosys-hero.mp4'
const PLAYS_PER_CYCLE = 1
```

Why no `loop` attribute on the `<video>`: native `loop` never fires `onEnded`, so we couldn't count plays. We replay manually via `onEnded` → `currentTime = 0` → `play()`, and after `PLAYS_PER_CYCLE` we set `videoActive = false` to fade out.

Why `canplaythrough` instead of `loadeddata`: `loadeddata` only requires the first frame. `canplaythrough` is the browser's estimate that it can run end-to-end without buffering — that's what the user described as "once video is loaded."

Why click goes on the outer container, not on a button overlay: the R3F canvas sits on top to keep cursor parallax alive. We rely on React event bubbling: clicks anywhere inside (including inside the canvas) bubble up to the container's `onClick`. R3F doesn't `stopPropagation` by default. Keyboard support via `role="button"` + `tabIndex` + `onKeyDown` for Enter / Space — both cleared when the video is active so screen readers don't announce a stale button.

Autoplay failsafe: if `video.play()` rejects (very rare for muted video), we set `videoActive = false` and stay on the static — the hero block never breaks.

## Known limitations / next steps

- **No smile cross-fade** — the prior session generated `genosys-athlete-face-front-smile.png` (a soft-smile twin of the front portrait), but we then switched the hero to the petri-shot 3/4 view, which has no matching smile reference. A "she smiles every 8 s" loop would require regenerating a smile variant of `genosys-athlete-face-hero.png` with the same petri-dish backdrop, then wiring a 1.4 s cross-fade in `DesktopHero3DVisual`. Stub left in the doc for follow-up.
- **No `prefers-reduced-motion` opt-out for the atom drift itself** — `useDesktopExperience` already respects the OS flag and disables R3F entirely; orbits don't run when WebGL is off. If we want a "still 3D, no orbits" tier, gate the orbit math on a `reducedMotion` prop.
- **All 38 atoms render every frame** — fine on desktop GPUs, but if FPS regressions show up on entry-level Intel iGPUs, switch `Atom` to `InstancedMesh` and pass per-instance positions via a buffer.

## Files added / modified summary

- **Modified**: `components/Hero.tsx`, `package.json`, `package-lock.json`
- **Added (shipping)**: `components/desktop-experience/{AtomFieldScene,DesktopHero3DVisual}.tsx`, `hooks/useDesktopExperience.ts`, `public/images/desktop-experience/genosys-athlete-face-hero.png`
- **Added (dev / parked)**: rest of `components/desktop-experience/`, `app/dev/3d-test/`, `lib/genosysUniverse.ts`, `public/images/desktop-experience/{face-references,*.png}`, `public/models/desktop-experience/*.glb`, `scripts/build-*.py`, `scripts/generate-athlete-face-glb.mjs`
- **Doc**: `docs/SESSION_CHANGES_2026-05-02_3D_MOLECULES_HERO.md`, `docs/README.md` index entry
