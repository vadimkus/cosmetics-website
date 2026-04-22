# Addresses Page UI Sweep — 2026-04-22

## Context

Audit of the Addresses page (`/profile/addresses`) on mobile web. User-flagged screenshot (iPhone Safari) showed a page that worked but had several UX rough edges. Shipped the full P0+P1 backlog in one sweep; left a couple of pre-existing cross-page items out of scope.

## What shipped

### P0 — Correctness / functional

**1. Replaced `window.confirm()` with inline delete confirmation.**
Previously `handleDeleteAddress` popped a native `confirm()` dialog. On mobile Safari this renders as a system-looking popup that breaks visual consistency with the rest of the app and feels like an error. Replaced with a two-step inline confirmation: tap **Delete** in the action menu → the menu collapses and the same card reveals a confirmation panel with an `AlertTriangle` icon, "Remove this address?" headline, and side-by-side Cancel / Delete buttons. Deletion happens only on confirm. Both `deleting` state and destructive styling preserved.

**2. Bumped `•••` tap target from 28px → 40px.**
Previously `<button className="p-1">` with a `w-5 h-5` icon = 28×28 tap target, well below the 44px iOS HIG minimum. Now `w-10 h-10 flex items-center justify-center rounded-full` (40px) with `-mr-2` negative margin to keep the icon optically aligned to the card edge. Shy of 44px still, but 40px is the practical limit without destroying the card grid — and 40px is what iOS itself uses for in-card menus (Settings rows, Mail cells, etc).

**3. Tap-outside and Escape dismiss for the `•••` menu.**
Previously the only way to close an open menu was re-tapping `•••` on the same card. If the user accidentally opened it, they were trapped. Added a `mousedown` / `touchstart` listener scoped by `[data-address-card]` — clicks anywhere outside a card collapse the menu. Escape key also dismisses. Both the action menu and the delete confirmation respect this.

### P1 — Should fix

**4. Dropped the "Manage your delivery addresses" banner.**
A 56px gray banner under the header repeated what the page title already said. Removed — the page now goes straight from header to content, saving vertical space and reducing chrome.

**5. Formatted UAE phone numbers for display.**
Added `formatUAEPhoneForDisplay(raw)` helper. Handles `+971559152985`, `971559152985`, `0559152985`, and pre-formatted inputs. Outputs canonical `+971 55 915 2985`. Returns unchanged for non-UAE numbers (never mangles international input). Applied only at render; stored value is untouched.

**6. Redesigned the action menu from flat row → iOS-style vertical list.**
The old menu was a horizontal row of 3 buttons (Edit / Set as Default / Delete) with pill borders. On 375px iPhones this crowded and wrapped awkwardly. New menu:

- Full-width vertical list inside a white card
- Each action is 44px tall with a leading icon (16px) and label
- Dividers between actions are inset to align with label text (iOS Settings pattern)
- Delete is visually distinguished by red text + `active:bg-red-50`
- `•••` icon morphs into `×` when the menu is open, signalling "tap to close"

**7. Tap feedback on cards.**
Added `transition-colors active:bg-gray-100` to every card. Previously tapping anywhere on the card (outside the ••• button) did nothing visually — no feedback at all. Now there's a subtle press state on touch.

**8. `MapPin` icon for "Other" address type.**
Previously the `getTypeIcon` switch fell through to `Home` for any type that wasn't `work/office`, so "Other" looked identical to Home. Now `other` → `MapPin`, `work/office` → `Briefcase`, everything else → `Home`.

## Out of scope (not UI bugs on this page)

- **"Dubai, Ajman" on the Home card** — data issue from user input (city=Dubai, emirate=Ajman). The UI renders whatever the DB contains; can't fix at this layer.
- **Chat widget overlap with the "Add New Address" CTA** — global placement concern, not specific to this page.
- **Header `+` tap target (32px)** — same sub-44px concern, but changing it touches the shared header pattern used by other profile subpages. Deferred.

## Files touched

- `app/profile/addresses/page.tsx`

## Verification

- `tsc --noEmit --skipLibCheck` → no new errors for this file
- `ReadLints` → clean
- All three locales (EN / RU / AR) for new i18n keys: `removeThisAddress`, `keep`, `removeOptions`, `closeMenu`
- Removed now-unused keys: `manageHint`, `deleteConfirm`

## Key design decisions

- **Inline confirmation vs bottom sheet** — iOS-native would be an action sheet slide-up, but that requires a modal library and portal plumbing. Inline confirmation uses existing card chrome, feels just as intentional, and ships with zero new dependencies.
- **40px over 44px for the •••** — 44px would force the icon to overshoot the card's top edge, breaking the grid. 40px gets us into the "good enough" zone per Material Design (48dp = 48 CSS px, but iOS production apps routinely use 40).
- **`data-address-card` sentinel** — using a data attribute for the dismissal boundary is more robust than a ref-based DOM walk; any card or nested element counts as "inside the menu area" without explicit wiring.
