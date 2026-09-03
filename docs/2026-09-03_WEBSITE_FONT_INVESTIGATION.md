# Website fonts: investigation and recommendation

**Date:** 3 September 2026
**Status:** all four steps shipped the same evening (commits `074bc76e`, `78989b89`)

## What is declared

- `Inter` (variable, latin + latin-ext + cyrillic) via next/font in `app/layout.tsx`, exposed as `--font-inter`.
- `Noto Sans Arabic` (300-700) via next/font, `--font-arabic`.
- `Cormorant Garamond` (400/500/600) via next/font in
  `components/product/cerabarrier/ceraFont.ts`, exposed as `--font-cera-serif`,
  applied per page root (`ceraSerif.variable`, 190 mounts), used through a
  `.cera-serif` class (1,030 uses) that is defined in
  `components/product/cerabarrier/cerabarrier.css`, a product page's CSS file
  imported from ten unrelated places (home, footer, login, not-found...).
- `globals.css` stacks:
  `--font-body: "SF Pro Text", var(--font-inter), ...`
  `--font-display: "SF Pro Display", var(--font-inter), ...`
  `--font-mono: "SF Mono", ui-monospace, ...`

## What actually renders (measured, `/products/34`, macOS Chrome)

| Family | Elements | Where |
|---|---|---|
| SF Pro Text | 171 | all UI and body |
| Cormorant Garamond | 60 | headings, and body-size numbers/labels at 13-17px |
| SF Pro Display | 4 | footer column headings (`.font-display`) |
| Helvetica Neue | 3 | payment badges |

`document.fonts` shows Inter loaded (three files) and Cormorant loaded. Inter is
downloaded and never drawn on Apple devices.

## Findings

1. **Two different sans faces by device.** The body stack puts SF Pro before
   Inter. Mac and iPhone users see Apple's system font; Windows and Android
   users see Inter. The site was evidently designed and reviewed on a Mac, so
   what the team sees is not what most Android and Windows customers see. Apple
   users also pay the Inter download for nothing.
2. **The serif goes too small.** Cormorant at 13-15.5px: 30 uses at 15.5px, 17
   at 14.5px, 4 at `text-xs`. Cormorant has a small x-height and light strokes;
   below ~18px it loses legibility, and on a cream background more so. The
   "AED 120.00 more" line in the bag screenshot is one of these.
3. **The serif is fragile.** `.cera-serif` only works on a route whose root
   mounted `ceraSerif.variable`. Where a component using the class is rendered
   under a root that did not, the `font-family` declaration is invalid at
   computed-value time and the text falls back to sans with no warning. 17
   components use the class without mounting the variable themselves; whether
   they render serif depends on which page includes them.
4. **The type scale is fractional.** 269 uses of 15.5px, 245 of 12.5px, 212 of
   14.5px, 209 of 13.5px, 66 of 11.5px, 8 of 10.5px, 2 of 17.5px. Roughly a
   thousand text nodes sit half a pixel off the neighbours they are compared
   against. Same disease as the app had, in a different place.
5. `.font-display` (SF Pro Display / Inter bold) survives on four footer
   headings and about twenty other places: a third voice that is nearly, but
   not exactly, the body face.

## Comparison with the app

App display face is Cormorant Garamond (regular/medium/semibold), matching the
site. App body is the platform system font (SF on iOS, Roboto on Android). So
today: iOS app and iOS web match by accident; Android app (Roboto) and Android
web (Inter) do not.

## Recommendation

**Two faces, one rule each. Inter for everything that is interface; Cormorant
for display only.**

1. **Make Inter the body face on every device.** Remove "SF Pro Text" and "SF
   Pro Display" from the stacks so `--font-body` and `--font-display` both
   resolve to Inter. One rendering everywhere, the one the team already ships
   and pays for. Apple users see a slight change from SF to Inter (two humanist
   grotesques; most people will not notice). Fold `.font-display` into the same
   face at weight 600.
2. **Keep Cormorant, define it once, make it global.** Move
   `ceraSerif.variable` to `<html>` in `app/layout.tsx` and the `.cera-serif`
   rule into `globals.css`, then delete the 190 per-page mounts. The silent
   sans fallback disappears.
3. **Floor the serif at 18px.** Below that, switch to Inter. About 55 call
   sites, all in body-size labels and figures where the serif was decoration
   rather than hierarchy.
4. **Snap the type scale.** Replace the fractional sizes with the nearest
   integer step: 10.5->11, 11.5->12, 12.5->13, 13.5->14, 14.5->15, 15.5->16,
   17.5->18. One codemod, ~1,000 edits, each 0.5px. Then a guard, like the
   app's, so `text-[x.5px]` cannot come back.

Not recommended: dropping Inter for the system font to match the app exactly.
It would save three font files, but a brand site should look the same on a
Windows laptop and a MacBook, and the app's Roboto-on-Android is a React
Native default rather than a choice.

## Effort and risk

Steps 1 and 2 are small, low-risk, and fix real defects (device split, silent
fallback). Step 3 is a legibility fix with visible but wanted change. Step 4
is mechanical with a screenshot pass on the main templates. All four in one
afternoon; each can ship on its own.

## Outcome (measured live, 23:12, `/products/34`, macOS Chrome)

| Family | Before | After |
|---|---|---|
| Inter | 0 elements (loaded, never drawn) | 185, sizes 10-24px |
| SF Pro Text / Display | 175 | 0 |
| Cormorant Garamond | 60, down to 13px | 50, minimum 18px |
| Helvetica Neue (payment badges) | 3 | 3 |
| Fractional font sizes | ~1,000 in code | 0 rendered |

What it took, beyond the plan:

- **1,016 half-pixel sizes** snapped (269 of 15.5, 245 of 12.5, 212 of 14.5,
  209 of 13.5, 66 of 11.5, 8 of 10.5, 2 of 17.5, 5 of 9.5).
- **152 classNames** lost `cera-serif` for sitting under 18px: product names in
  routine strips, step titles, pack-size pills, FAQ questions, cart item names.
- **189 per-page `ceraSerif.variable` mounts** removed across 134 files, 52
  dead imports with them, the variable now set once on `<body>`.
- **`.cera-numeral` set the serif face itself**, which the first census after
  deploy exposed: step numbers "01-04" and pack sizes at 13-16px were still
  Cormorant. It now handles numerals only; 152 display-sized figures take
  `cera-serif` explicitly and 92 small ones stay on Inter.
- **A mistake of mine, caught by the same census.** The `.cera-serif` block was
  first inserted between the global `h1, ..., h6,` selector list and its
  `.font-display {` line, so for one deploy every heading on the site read the
  serif rule (the footer's 12px eyebrows went serif). Moved out; the guard now
  asserts the selector list is intact.
- `RelatedConcernCards` used an inline Georgia; it is on the house serif at 18px.

Guard: `__tests__/lib/fontDiscipline.test.ts`, seven checks: Inter first and no
SF Pro; display equals body; serif defined once, mounted once; no other rule
sets the face; heading rule intact; no serif under 18px in any className; no
half-pixel sizes.
