# Return-to-top control for mobile web

Date: 18 Aug 2026
Commit: `bb77faaa`

## Why

The catalogue, product pages and guides run long on a phone. Reaching the end left no way
back up except repeated swiping. iOS Safari scrolls to top when you tap the status bar, but
it is undiscoverable and does nothing in Chrome, so a visible control is the only option that
works for every visitor.

## The bug found while deciding placement

Two page-local back-to-top buttons already existed:

- `app/privacy-policy/PrivacyPolicyClient.tsx`
- `app/terms/TermsClient.tsx`

Both rendered at `fixed bottom-24 right-4 z-40`. The chat bubble (`components/ChatWidget.tsx`)
sits at `bottom-24 right-4 z-50`, and **neither page is in the chat's hidden-page list**. So
on both pages the button has been sitting directly underneath the bubble at a lower
z-index — in the DOM, rendered, impossible to tap.

Both are removed in favour of one global control.

## The control

`components/ScrollToTop.tsx`, mounted in `app/layout.tsx` after `<ChatWidgetLazy />`.

| Decision | Value | Reasoning |
|---|---|---|
| Scope | mobile web only (`!isPWA && isMobile`) | what was asked; the installed app has its own chrome |
| Side | leading corner LTR, trailing corner RTL | the chat owns the opposite corner and mirrors, so this mirrors the other way |
| Vertical offset | `calc(var(--mobile-nav-height) + 16px)` | tracks the tab bar instead of restating its height |
| Threshold | `scrollY > innerHeight * 1.5` | see below |
| Size | 44×44 | Apple HIG minimum, WCAG 2.5.5 |
| z-index | 50 | same tier as the chat, different corner |
| Motion | `prefersReducedMotion()` → `auto`, else `smooth` | uses the existing `hooks/useReducedMotion.ts` helper |

**Threshold.** The old page-local buttons used a flat 600px, which is most of a screen on a
small phone and barely half of one on a tall phone. A viewport-relative 1.5 screens means the
control only appears once scrolling back by hand has actually become a chore.

**Accessibility.** Kept mounted so the fade has something to animate, but `aria-hidden` with
`tabIndex={-1}` while invisible, so it is never a focus stop the user cannot see. The
`aria-label` is now a real `common.backToTop` key in all three locales rather than the inline
ternary the two old buttons used.

## New CSS custom property

`app/globals.css` now declares:

```css
:root {
  --mobile-nav-height: calc(58px + env(safe-area-inset-bottom, 0px));
}
```

`.mobile-web-footer-nav` consumes it for its own `height` / `min-height`, and the control
offsets from it. One source of truth, so the two cannot drift.

The chat widget's own hardcoded `bottom-24` (96px) was left alone — it predates this work and
moving it is a separate decision.

## Known interaction, left as is

The cookie consent banner is `fixed bottom-0 z-[60]`, so it covers the control on a first
visit. That is the right precedence for a blocking consent action, and the banner is
dismissed once per browser.

## Verification

Typecheck clean, no lint errors, 490 tests across 68 suites, clean production build.

Measured in a 390×844 phone viewport with an iPhone user agent:

| State | Result |
|---|---|
| At top | opacity 0, `tabIndex -1`, `aria-hidden true` |
| 1.2 screens (below threshold) | still hidden |
| 2.2 screens | opacity 1, `tabIndex 0`, `aria-hidden false` |
| Geometry | 44×44 at 16px from the leading edge, 74px above the bottom |
| Chat bubble | 318px from the leading edge, 96px up — no overlap |
| Arabic | control on the trailing side (330px), chat mirrored to the leading side |
| `/privacy-policy` | exactly one back-to-top present, duplicate gone |
| Click | `scrollY` returns to 0 |

No console errors.
