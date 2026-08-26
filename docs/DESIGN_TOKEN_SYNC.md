# Keeping the website and the app on one palette

The GENOSYS storefront ships on three surfaces — desktop web, mobile web, and
the iOS/Android app — from two separate git repositories:

- `cosmetics-website` — Next.js, tokens as CSS custom properties
- `genosys-mobile-app` — React Native, tokens as a JS object

They are not a monorepo and there is no package published between them, so
neither can import the other's tokens at build time.

## How they were kept in sync before

By hand. `utils/theme.js` carried a comment saying the values were copied from
`cerabarrier.css`, and `globals.css` carried a comment saying they were the
same "to the digit". That was the entire mechanism: a developer reading a
comment and retyping hex values.

It had already failed once without anyone noticing. When the app adopted the
cera palette its input border moved to a warm `#d9cec7`, but the website's
`--color-border-secondary` was never carried across and stayed on the old cool
Tailwind grey `#d1d5db`. Nothing would have caught that.

## How they are kept in sync now

`design-tokens.json` is the source of truth. **An identical copy is committed to
both repos.** Each repo has a check that reads its own native token definition
and asserts it still matches that file:

| Repo | Command | Reads |
|---|---|---|
| `cosmetics-website` | `npm run verify:tokens` | `--cera-*` in `app/globals.css`, `.cera-eyebrow` in `cerabarrier.css` |
| `genosys-mobile-app` | `npm run verify:tokens` | `cera` export in `utils/theme.js`, `T.eyebrow` in `utils/typography.js` |

Both checks print the token file's `version` and the first 16 hex of its
sha256. **If the two repos print the same sha256, they are provably holding the
same tokens.** If they print different ones, someone changed one side only.

The checks are wired in where they cannot be skipped:

- Website: the first step of `npm run build`, so a Vercel deploy fails rather
  than shipping a surface that no longer matches the app.
- App: the last step of `npm run verify:release`.

## Changing a token

1. Edit `design-tokens.json` and bump `version`.
2. Update the native definition in that repo, run `npm run verify:tokens`.
3. Copy the same `design-tokens.json` to the other repo, update its native
   definition, run its `npm run verify:tokens`.
4. Confirm both print the same sha256.

## What the file covers today

**Colour:** all eleven cera tokens — cream, creamDeep, blush, blushDeep, rose,
roseInk, ink, body, muted, line, shot.

**Typography:** the eyebrow, because it appears on product pages on every
surface and so a mismatch is directly visible when comparing them side by side.
The web expresses tracking in `em` and React Native takes px, so the JSON stores
`letterSpacingEm` and the app-side check resolves it against the shared font
size (12 × 0.16 = 1.92).

## What it deliberately does not cover yet

- **Status colours** (`green`, `blue`, `orange`, and their bg/line pairs) exist
  only in the app. The website has no named equivalents, which is why the chat
  widget had to have them read out of `ChatButton.js` by hand. Promoting these
  is the obvious next extension.
- **The radius scale.** The website has eight named steps; the app has none and
  uses literals. The 16px card radius matching on both sides is a coincidence.
- **Shadows.** Same warm-cast intent, different numbers, and the two platforms
  express elevation differently enough that a shared token needs thought.
- **The sans type scale.** The web sizes fluidly with `clamp()`; the app is
  fixed. The app's 20px section title against the web's 24px minimum is a real
  difference, but it may be correct — 24px section titles on a phone are heavy.
  This needs a design decision, not a sync mechanism.
