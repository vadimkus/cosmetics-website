# Session Changes — 2026-08-16 — /contact /brand /about /delivery /faq /orders reworked

## What was asked

Rework and redesign those six pages.

## The shared stylesheet, first

Three pages reworked earlier the same day (`/skin-recommendation`, `/training`,
`/blog`) each restated the same palette in their own CSS file. Six more pages
would have made nine copies of one set of tokens.

New `components/editorial/editorial.css` holds it once: `.genosys-page` sets
the house red over the cerabarrier tokens, plus `ed-cta`, `ed-ghost`, `ed-pill`,
`ed-row`, `ed-mark`, `ed-panel`, `ed-field`, `ed-label` and `ed-disclosure`.
Use it as:

```tsx
<div className={`cera-page genosys-page ${ceraSerif.variable}`}>
```

The three earlier pages still carry their own copies and can migrate later;
nothing new should.

## Page by page

### /contact

Six channel tiles, each previously a different colour — green, red, blue, pink,
blue, red — with no rule a reader could infer. One treatment now. The channels
and the document list became data instead of six near-identical blocks of JSX.

### /delivery

Stated the same four facts (Dubai 1 hour, UAE 24–36 hours, free over AED 1,000,
10-day returns) in **three** separate blocks: a stats strip, a details grid and
a pair of highlight cards. Changing the free-shipping threshold meant three
edits. Each fact appears once now, and returns get their own section with the
honest reason sealed skincare cannot come back opened.

Russian and Arabic carried their own ~250-line copies of the whole page. Both
now render the shared client, the same fix `/training` needed.

### /faq

Restyle only. Search, category filter, expand-all, the deep-link hash and the
FAQPage JSON-LD all behave as before. The boxed stats grid becomes
hairline-divided figures, and the two different reds resolve to one.

Added `.ed-field--flanked`: `.ed-field` sets horizontal padding in a shorthand
that outranks a Tailwind `pl-10` utility, which had the search glyph sitting on
top of the placeholder.

### /about and /brand

Already red and grey, so a palette and typography pass rather than a rebuild.
Headings take the display serif, mono uppercase kickers become the house
eyebrow, hard-coded shades resolve to tokens.

Worth remembering: headings written with a template-literal `className` were
missed by the first pass, which left half of `/about` in bold sans against the
other half in serif. Any future sweep needs both forms.

### /orders

Same palette pass, with one thing fenced off. The order status map is meaning,
not decoration — amber is pending, teal confirmed, emerald paid, blue
processing, indigo shipped, orange out for delivery, green delivered, red
cancelled. Flattening those into the brand red would have destroyed the only
signal on the page. The script lifts that map out before the swap runs and puts
it back afterwards. Green savings figures and amber warnings are likewise
untouched.

## Also removed

`app/orders/page.tsx.backup`, a 36 KB gitignored copy from January.

## Verification

- `tsc --noEmit` clean; `eslint` clean on every touched folder except two
  pre-existing `react-hooks/exhaustive-deps` warnings in `/orders` that are
  present on the parent commit too.
- `npm run build` compiled successfully.
- Checked `/contact`, `/delivery`, `/faq`, `/about` and `/brand` in the browser;
  opened a FAQ question to confirm the disclosure and answer styling.
- `/ru/delivery` and `/ar/delivery` return 200 on the newly shared client.
- **`/orders` was not visually verified.** Signed out it redirects to login, so
  the order list, the status badges and the savings figures were not seen
  rendered. The status map is preserved in the source and the page compiles,
  but someone with an account should look at a real order before this is
  trusted.
