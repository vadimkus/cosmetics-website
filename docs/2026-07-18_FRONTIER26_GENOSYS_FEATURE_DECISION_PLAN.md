# FRONTIER/26 → GENOSYS feature decision plan

**Date:** 2026-07-18  
**Source reviewed:** https://jovial-kayak-tysa.here.now/  
**Scope:** GENOSYS web + browser PWA. Native mobile-app UI is not part of the web-platform work.

## Executive decision

FRONTIER/26 is a browser-capability demonstration, not a commerce design to copy.

GENOSYS should:

1. **Stabilize the modern-platform features already shipped.**
2. Add only two conversion-relevant platform enhancements:
   - real product-image View Transitions;
   - anchored ingredient explanations.
3. Then move engineering capacity to commercial website features:
   - loyalty redemption;
   - clinic replenishment plans;
   - partner onboarding.
4. Skip WebGL/WebGPU spectacle, theme sliders, font-axis toys, and scroll-jacked galleries.

## Status of the previous FRONTIER/26 plan

### Stable

- `text-wrap: balance` / article `pretty` wrapping
- `:has()` form focus and validation states
- `field-sizing: content` for checkout textareas
- accessible PDP accordion using CSS grid `0fr → 1fr`
- product-card container queries
- OKLCH-derived soft/ring tokens with fallbacks
- reduced-motion behavior

### Implemented but not reliable

- Guide reading progress mounts but remains at `scaleX(0)`.
- Home section reveal works on first entry but does not reliably reset/replay.
- PDP gallery has `view-transition-name`, but thumbnail state changes are not explicitly wrapped in `document.startViewTransition()`.

## Phase A — stabilize what shipped

**Effort:** 1–2 days  
**Decision:** approve immediately.

### A1. Reading progress: CSS-first, JS fallback

- Use `animation-timeline: scroll(root)` as the primary implementation.
- Keep the current JS `scaleX()` implementation only as a feature-detected fallback.
- Mount one shared component on blog and guide layouts.
- Hide it for reduced motion.

**Accept when:**

- blog and guide bars move 0→100%;
- EN/AR/RU routes pass;
- no hydration dependency;
- no conflict with sticky headers.

### A2. Home reveals: deterministic and reversible

- Replace fragile observer state with CSS `animation-timeline: view()` where supported.
- Use `animation-range` to make the reveal follow viewport entry and naturally reverse when scrolling out.
- Use a static no-animation fallback rather than more JS.
- Keep section-level animation only—never every product card.

**Accept when:**

- reveal is visible but restrained;
- scrolling away and back replays deterministically;
- reduced motion shows content immediately;
- no CLS or hidden content if JavaScript fails.

## Phase B — conversion-focused platform features

**Effort:** 3–5 days  
**Decision:** approve a small pilot.

### B1. Real product gallery morph

- Wrap gallery thumbnail state updates in `document.startViewTransition()`.
- Use unique product/image transition names where cross-page morphing is enabled.
- First pilot: `/products/11`, `/products/34`, `/products/52`.
- Retain instant state changes as fallback.

**Business value:** makes product exploration feel premium at the purchase decision point without adding heavy libraries.

### B2. Anchored ingredient explanations

- Use native Popover API + CSS anchor positioning where supported.
- Add concise explanations for PDRN, peptides, ceramides, spicules, growth factors, and exosome-inspired positioning.
- Fallback: inline disclosure/accordion.
- Pilot on 5–8 priority PDPs; do not turn every ingredient into a tooltip.

**Business value:** reduces uncertainty and supports GENOSYS’s professional/clinical positioning.

### B3. Expand container-query behavior

Current cards only adjust title, description, and metadata at a few widths.

Extend to:

- related-product rails;
- favorites;
- homepage product rails;
- bundle-builder cards;
- partner-order catalog.

Cards should adapt image height, badges, CTA density, and description—not only font size.

### B4. Registered-property animation, selectively

Use `@property` only for meaningful numeric UI:

- AI skin-analysis scores;
- loyalty tier/progress;
- replenishment completion.

Do not add continuously animated decorative counters.

## Phase C — commercial website features

**Effort:** 1–2 weeks for the first commercial MVP  
**Decision:** higher priority than further visual experimentation.

### C1. Loyalty redemption at checkout

Already available:

- points engine;
- block/AED conversion;
- 20% redemption cap.

Missing:

- checkout control;
- clear balance/discount preview;
- server/order accounting and reversal handling.

**Priority:** highest quick commercial ROI.

### C2. Clinic replenishment plan MVP

Build on the existing partner portal, credit terms, consignment, and order history:

- standing product/quantity plan;
- weekly/monthly cadence;
- next delivery date;
- one-click reorder;
- `User.moyskladCounterpartyId`;
- MoySklad order push;
- reminder and status tracking.

**Priority:** recurring revenue and lower clinic stock-out risk.

### C3. Partner self-onboarding

- clinic application;
- document/status workflow;
- admin approval;
- partner/credit/consignment activation;
- onboarding checklist.

**Priority:** operational scale after replenishment MVP.

## Phase D — optional campaign experiments

Only after Phases A–C:

- one science-led scroll story on a brand/protocol landing page;
- selective Display-P3 accent treatment with sRGB fallback;
- internal browser-capability QA page.

These must have performance budgets and reduced-motion fallbacks.

## Explicitly skip

- WebGL raymarching / metaballs on commerce pages
- WebGPU
- site-wide hue slider
- variable-font axis playground
- scroll-jacked horizontal catalog
- parallax in cart/checkout/PDP controls
- rewriting the current working accordion merely to use `interpolate-size`

## Decision summary

**Approve now**

- Phase A stability fixes
- loyalty redemption design/build

**Approve as a small pilot**

- product gallery morph
- ingredient helper
- deeper card container queries

**Build next**

- clinic replenishment MVP

**Defer**

- native accordion rewrite
- wide-gamut campaign experiments

**Reject**

- WebGL/WebGPU spectacle, hue controls, font toys, scroll-jacking

## Measurement

- guide/blog progress reliability across browser engines
- home animation replay and reduced-motion pass rate
- PDP gallery interactions per session
- ingredient-helper opens and add-to-cart conversion
- loyalty redemption adoption and conversion
- active clinics on replenishment plans
- reorder-cycle variance and revenue per clinic
- Core Web Vitals before/after each phase

