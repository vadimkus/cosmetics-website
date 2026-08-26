# 2026-08-26 — Chat widget on the app palette, mobile app accessibility sweep

## Website / mobile web

Chat widget repointed from red onto the app's cera palette, colours read out of
`genosys-mobile-app/components/ChatButton.js` rather than picked by eye.

| Element | Was | Now | App source |
|---|---|---|---|
| Launcher FAB | red gradient | ink | `fab: colors.cta` |
| Panel header | red gradient | ink | `panelHeader: colors.cta` |
| User bubble | `red-600` | ink | `userBubble: colors.cta` |
| Send button | `red-600` | ink | `sendBtn: colors.cta` |
| Add-to-bag in cards | `red-600` | ink | `addToBagBtn: colors.cta` |
| Highlighted quick action | red gradient | ink | `quickActionBtnHighlight: colors.cta` |
| Genie avatar circle | `red-100` | blush | `avatarCircle: colors.redBg` |
| Sparkle icon, price, links | `red-600` | rose-ink | `colors.accent` |
| Input focus ring | `red-500` | ink | matches new chrome |

Error strip at `ChatWidget.tsx:918` deliberately left red — genuine failure
state, and the app has no ink equivalent for it.

Commits: `96d2571c` (launcher), `83d2d21c` (panel).

## Mobile app sweep

Two audits run (colour/contrast, accessibility/UX). Five highest-impact
findings fixed and shipped; the rest are logged below as remaining work.

### Fixed

1. **Bag loading state was indistinguishable from the empty state.**
   `app/(tabs)/bag.js` rendered the same unicorn illustration while loading as
   it does when the bag is genuinely empty. Anyone opening the bag mid-fetch
   concluded their items were gone. Now a spinner plus the `bag.loading` string,
   which already existed in all three locales but was never used.

2. **Badge colours failed contrast.** `utils/badges.js` still carried iOS system
   hex from before the palette work: `#FF9500` with white text is **2.20:1**,
   `#007AFF` is **4.02:1**. Swapped to `colors.orange` (5.47:1) and
   `colors.blue` (6.50:1). Visible on every product card in the catalogue.

3. **Skin analysis scores failed contrast.** `components/SkinAnalysisResults.js`
   used `#F59E0B` as *text* on white — **2.15:1**, failing even the large-text
   threshold. Now `colors.orange` (5.47:1) and `colors.greenDeep` (6.52:1).

4. **Touch targets under the 44pt HIG minimum.** Product header back/share/
   wishlist were 36pt, shop favourite heart 32pt, neither with `hitSlop`. Slop
   added to reach 44pt without changing any visuals.

5. **Profile switches announced as unnamed toggles.** The title sits in a
   sibling `View`, so VoiceOver read "switch, on" with no indication of which
   setting. All three (biometric, email, push) now carry the row title as
   `accessibilityLabel`, plus hint and state.

Commit `874f4be`. OTA update group `06c87f5c-c5d7-414c-a4e8-ea4b66e43a89`,
runtime 1.11.0, both platforms.

### Remaining, not done

- `app/concern-detail.js`: three collapsible toggles missing
  `accessibilityRole` / `accessibilityState={{ expanded }}`.
- `app/homecare-scripts.js`: four icon-only buttons with no
  `accessibilityLabel`, including a destructive delete.
- Hard-coded strings bypassing `t()` — the whole sticky mini-cart in
  `concern-detail.js`, the Partner Portal card in `profile.js`, and entire
  screens using file-local `tr()` / `l()` helpers (`homecare-scripts.js`,
  `partners.js`, `blog/index.js`, `faq.js`, `partner-portal.js`).
- Bare spinners with no text: `skin-analysis-camera.js`, `partner-portal.js`
  product list, `blog/index.js`.
- GOLD membership badge text `#8A6D1D` on `#FAF3E3` is 4.05:1, just under AA.
- Remaining hard-coded colour literals (~49) with direct token mappings; a
  handful need a judgment call (star amber, partners pink).

## Unification: shared token source of truth

Audited how far the website and app tokens had drifted. Result was better than
expected and worse than expected in different places.

**Better:** all ten core cera colours were already identical to the digit.

**Worse:** nothing was keeping them that way. The sync mechanism was a developer
reading a comment in `theme.js` and retyping hex values. It had already failed
silently — the app's input border moved to warm `#d9cec7` while the website's
`--color-border-secondary` stayed on cool Tailwind `#d1d5db`.

### Architecture

`design-tokens.json`, committed identically to both repos, is now the source of
truth. Each repo has `npm run verify:tokens` which reads its own native
definition and fails if it disagrees, and prints the file's sha256 so the two
repos can be shown to hold the same tokens. Both currently print
`10d2f3b90175c0fb`.

Wired so it cannot be skipped: first step of the website's `build`, last step of
the app's `verify:release`. Both checks were tested against deliberate drift and
exit non-zero.

Full write-up in `docs/DESIGN_TOKEN_SYNC.md` (copied to both repos).

### Fixes

- **Eyebrow** — the one visible divergence. App was 11px/700/1.2px against the
  site's 12px/600/0.16em. Now identical; tracking resolved from em against the
  shared size. Affects 10+ app screens including product pages.
- **`--cera-shot`** promoted into `globals.css`; it existed only in
  `cerabarrier.css` and the app.
- **Three border tokens** warmed onto the app's separator tones. No real
  consumers, so correctness rather than a visible change.

Commits `d071ec6b` (web), `25432c5` (app). OTA group
`e908febd-baee-4c0e-8a1c-90e4b9b50ae3`.

### Known remaining divergence

- Status colours (green/blue/orange + bg/line pairs) are app-only; the website
  has no named equivalents, which is why the chat widget needed them read out of
  `ChatButton.js` by hand. Obvious next extension to the token file.
- Radius scale: web has eight named steps, app has none.
- Shadows: same intent, different numbers, platforms express elevation
  differently.
- Sans section title: web 24px minimum, app 20px. Left alone deliberately —
  24px section titles on a phone are heavy, so this needs a design decision
  rather than a sync mechanism.
