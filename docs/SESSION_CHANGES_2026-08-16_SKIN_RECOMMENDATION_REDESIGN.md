# Session Changes — 2026-08-16 — /skin-recommendation reworked onto the editorial design

## What was asked

Rework `https://genosys.ae/skin-recommendation` using the new design — the same
editorial system the bespoke product pages now run on (Cormorant Garamond display
serif, cream ground, hairline rules, soft-shadow cards, red accent).

## What changed

Presentation only. Every piece of behaviour is untouched: the four-step quiz,
the camera / AR / Power Animal entry points, the AI expert analysis report, the
recommendation engine, cart and favourites all work exactly as before.

### New file

`app/skin-recommendation/skin-recommendation.css` — page-scoped palette and the
components the quiz needs that a product page does not:

| Class | Purpose |
|---|---|
| `.skinrec-option` | quiz tile, with `[data-selected]` state |
| `.skinrec-option__tick` | red tick badge on a chosen tile, absolutely positioned so selecting never reflows the grid |
| `.skinrec-option--center` | the step 4 variant that centres its icon and label |
| `.skinrec-step-num` | step numeral, filled red once that step is answered |
| `.skinrec-track` / `__fill` | progress bar |
| `.skinrec-cta` | primary ink pill (submit, add to bag, explore concerns) |
| `.skinrec-scan` / `__mark` | the AI analysis panel and its icon |
| `.skinrec-ghost` | secondary outline pill |
| `.skinrec-pill` / `--accent` | result profile pills |

Accent is GENOSYS red (`#c0392f` / `#97281f`) rather than a product colour,
because this page is the brand's own front door into the range rather than one
product's story.

### `app/skin-recommendation/SkinRecommendationClient.tsx`

- Root is now `cera-page skinrec-page` with `ceraSerif.variable`. Without that
  variable the whole `font-family` declaration in `.cera-serif` is invalid at
  computed-value time and every heading silently falls back to the body sans —
  caught in the browser, not by the build.
- Imports `components/product/cerabarrier/cerabarrier.css` for the shared
  structure (`cera-serif`, `cera-eyebrow`, `cera-rule`, `cera-card`,
  `cera-numeral`).
- Hero: eyebrow "Four questions", serif headline, measure-limited lead.
- Scan panel, the two ghost action buttons, and the "or answer manually" rule.
- Progress: eyebrow + serif numeral percentage over a 3px track.
- All four step cards: `cera-card`, serif headings, numerals that fill red as
  each step is answered.
- All four option grids: tile, tick, serif label.
- Results: eyebrow + serif headline, profile pills, serif category headings,
  `cera-card` product cards with the ink pill add-to-bag.
- Analysis report header and the empty state brought onto the same pills.
- Page chrome (mobile sticky header, breadcrumb, back link) recoloured off the
  palette so nothing reads as a white slab over the cream.

### Two content bugs fixed while in there

- Results grid was `xl:grid-cols-4`, which squeezed long uppercase product names
  into a two-line ellipsis on every card ("MICROBIOME ENERGY INFUSIN…"). Capped
  at three columns; names now fit.
- "1 products curated for you" and "We found 1 products perfect for your skin"
  now read singular when there is one. EN and RU both.

## Verification

- `tsc --noEmit` clean, `eslint app/skin-recommendation/` clean,
  `npm run build` compiled successfully.
- Walked the full journey in the browser at 1440×900: landing, tile selection
  (tick + blush state + revealed next step), all four steps answered, submit,
  results with product cards, closing CTA.
- Confirmed the display serif resolves to Cormorant Garamond, page background is
  the cream, and there is no horizontal overflow.
- `/ar/skin-recommendation` checked in RTL: tick mirrors to the top-left, tiles
  right-align, progress fills from the right. `/ru` returns 200 on the same
  component.

Note: the AR route logs a pre-existing hydration warning from
`components/LanguageSwitcher.tsx:23`. Unrelated to this work, left alone.
