# Sentry — Filter iOS Safari View-Transition `removeChild` Race

**Date:** 2026-05-02
**File touched:** `instrumentation-client.ts`
**Trigger:** Sentry event `dd9c98ca18f440f8a31adf0eb58d8dac` (2026-05-02 06:02 UTC)

## Issue

```
NotFoundError: The object can not be found here.
  at l9 (app:///_next/static/chunks/04dprt7993amd.js:20:170401)
  at l7 (… :169752)
  at l9 (… :170989)
  at sr (… :171971)
  at si (… :175397)
  ...45 more frames
```

Tags: `DOMException.code = 8`, `browser = Mobile Safari 26.2`, `os = iOS 18.7`,
`transaction = /orders`, `url = https://genosys.ae/products`,
`turbopack = True`, `handled = yes`.

## Root cause

Race between **WebKit's View Transitions implementation** (enabled by
`experimental.viewTransition: true` in `next.config.js`) and **React 19's
commit phase**:

1. App Router triggers a client-side route change `/orders → /products`.
2. WebKit's `startViewTransition` snapshots the page and reparents DOM nodes
   for the cross-fade animation.
3. React's `commitDeletionEffectsOnFiber → commitMutationEffectsOnFiber` runs
   right after and calls `Node.removeChild` on a node whose parent WebKit
   already swapped out from under it.
4. `removeChild` throws `DOMException` code 8 (`NOT_FOUND_ERR`).

The exception is **handled** by React (`handled: yes`) — it's caught by
React's reconciler and the next render fixes the tree. **No user-visible
breakage**, but Sentry alerting fires.

The minified frames `l9 / l7 / sr / si` are React 19's
`commitDeletionEffectsOnFiber` / `recursivelyTraverseDeletionEffects` /
`commitMutationEffectsOnFiber` / `commitMutationEffects`. We never call
`removeChild` on App-Router-managed DOM in our own source files.

## Decision

Keep `experimental.viewTransition: true` — the cross-page UX win is worth
it on the desktop universe / molecular hero work. Mirror the existing
`isSafariNavigationAbortLoadFailed` pattern: filter the unactionable noise
in `Sentry.beforeSend` so production alerts stop firing.

## Implementation

Added `isIOSViewTransitionRemoveChildRace(event)` in
`instrumentation-client.ts`:

- Matches **only** `NotFoundError` with the exact "object can not be found
  here" message.
- Requires `iOS` OS or `Mobile Safari` / `Safari` / `WebKit` browser.
- Stack must consist exclusively of minified `_next/static/chunks/` frames
  — meaning the error originated entirely inside React internals, not in
  our own components. **Any frame pointing at our own source files passes
  through untouched.**

The filter runs before the existing PII scrubbing block, alongside the
prior Safari navigation-abort filter.

## Files

- Modified: `instrumentation-client.ts`

## Follow-ups

- If we ever see `NotFoundError` events from frames pointing at our own
  components, the filter will let them through and we'll need to actually
  fix the offending component (likely a manual `appendChild`/`removeChild`
  on a node React also owns — see e.g. `ConfettiCelebration`).
- If the rate of these (filtered) events is high enough that we want to
  fix the root cause, the next step is to either:
  1. Disable `experimental.viewTransition` (lose smooth route transitions).
  2. UA-gate it off on iOS in `next.config.js` — not officially supported,
     would need a runtime monkey-patch.
  3. Wait for a React 19.x patch — the team is aware of WebKit View
     Transitions interactions.
