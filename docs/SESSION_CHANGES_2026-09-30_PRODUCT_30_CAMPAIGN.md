# Session changes - 30 Sep 2026 - Product 30 "Everything under control." + selling copy

INTENSIVE PROBLEM CONTROL CREAM (product 30, 50g 290 AED / 250g 420 AED). Live at
https://genosys.ae/products/30 (also `/ru`, `/ar`).

Owner direction: "do the best ever campaign", then "remove dossier, we are selling".

## Campaign - "EVERYTHING UNDER CONTROL."

Ultramarine `#242D9D` (tube type) + lime `#D7E36B`. Product only on slide 12, where the real 50g
and 250g tubes (`~/Desktop/problem/`) are composited onto an empty CapCut set so the labels stay
exact. Main unchanged: `problem_cream/main.jpeg`. Workspace `~/Desktop/Insta_Olga/pccream30/campaign/`
(`c30_*` scripts, `c30_card.py` for the tubes). Exports `public/images/problemcream_art/` (s1-s12,
`ru/`, `ar/`; 36 files). Replaces the six old `problem_cream/s*.jpeg` slides (two of which printed
wrong lines).

| # | Visual | EN headline |
|---|---|---|
| 1 | balanced gyroscope | EVERYTHING UNDER CONTROL. |
| 2 | empty oil cruet | 0 · OILS, BUTTERS OR WAXES. |
| 3 | water-jelly cube | 86% · WATER, SET IN A GEL. |
| 4 | sheriff star | THE SHINE SHERIFF. |
| 5 | die showing one pip | SPOT CHECK. |
| 6 | floating feather | LIGHTER THAN A CREAM. |
| 7 | cactus with a blue flower | OILY, STILL THIRSTY. |
| 8 | empty perfume bottle | SCENT: NONE. |
| 9 | dominoes, last one standing | THE LAST WORD. |
| 10 | lime halves | THE SERUM'S OTHER HALF. |
| 11 | ball resting on a cushion | SOFT LANDING. |
| 12 | both tubes, card | EVERYTHING UNDER CONTROL. |

## Copy - dossier out, selling in (EN / RU / AR)

- Page: `components/product/pccream/pccreamCopy.ts` (EN, dead inline RU/AR removed) and
  `pccreamLocalizedCopy.ts` (RU/AR) rewritten. Gone: carton/batch/specification talk, "Honest
  answer", dimethicone 0.005%, polymer and solvent percentages, 86.6/86.595% water, pH 5.87.
- Record: `data/product30LocalizedCopy.ts` gains `PRODUCT_30_EN` (DB EN fields); RU/AR rewritten.
- Also: quick facts, routine lines in `messages/{en,ru,ar}.json`, fallback, chatbot, SP cream page
  comparison line, section slides now localized on the page.
- Kept as facts: oil-free gel cream (no plant oils, butters or waxes), zinc PCA 0.05% (serum dose),
  trehalose + xylitol, panthenol + allantoin + beta-glucan, no perfume, dermatologically tested,
  massaged in last AM/PM, 50g / 250g. Never claimed: non-comedogenic, acne treatment,
  "no emulsifier", "no oil at all".
- Tests: new `__tests__/data/product30SellingCopy.test.ts`; `productLocalizedCopyAudit` product 30
  case now requires the selling facts and bans dossier terms instead of pinning lab figures.

## Deploy and checks

- Commit `4e7ad70fc`; DB updated by `scripts/update-product-30-campaign.ts --apply` (gallery 12,
  EN fields, RU/AR descriptions); `products` tag and `/products/30` revalidated in all locales.
- Live: EN/RU/AR headline, 12 localized slides, no old slides, no dossier phrases in product 30 copy;
  mobile API serves `ru/` slides with `locale=ru`.
- Tests: 150 suites, 1615 passed.

## Redo: "WATER, NOT OIL." (30 Sep, 23:35 - 00:40)

Vadim: "this campaign - I don't like, redo from scratch, main must be on white". The "Everything under
control." set was metaphor for its own sake (gyroscope, sheriff star, dice, cactus, dominoes, limes),
the failure the new rule names. Redone product story first, like the liked 49 set.

- **Anchor:** every headline is "X, not Y", so one idea (a water gel, not an oily cream) is said twelve
  times: WATER, NOT OIL. · 86% WATER. · 0 OILS, BUTTERS OR WAXES. · FRESH, NOT SHINY. (zinc PCA) ·
  HYDRATED, NOT HEAVY. (trehalose, xylitol) · CALM, NOT TIGHT. (panthenol, allantoin, beta-glucan) ·
  CLEAN, NOT SCENTED. · LIGHT, NOT LAYERED. · THE LAST STEP. (toner, serum, cream) · HOME, AND PRO.
  (50g / 250g) · SUNSCREEN ON TOP. (Ultra Shield SPF 50+) · card.
- **Visuals are the product or what it is made of**: the tube in a water splash, a water droplet, the
  gel dollop and swipe, zinc PCA powder, sugar crystals, a ripple, a glass of water, and the real
  toner / serum / cream / SPF packs. Ultramarine `#242D9D` + pale water blue `#E4EFF6`.
- **Main on white:** both real tubes composited on pure white (`problemcream_v2/main.jpg`), cut-out
  `30-v2.webp`. Every pack in the set is a real cut-out composited in (`c30b_compose.py`), labels exact.
- Page, record and quick copy headline now "Water, not oil." / "Вода, а не масло." / "ماء، لا زيت.";
  section slides from the new set (s2, s3, s4, s9). AR slide 11 says "Ultra Shield" without "SPF 50+"
  (the "+" broke the bidi order).
- Workspace `~/Desktop/Insta_Olga/pccream30v2/campaign/` (`c30b_*`). Exports
  `public/images/problemcream_v2/` (main + s1-s12, `ru/`, `ar/`; 37 files).
- Commits `24299b273` (set + copy), `9b8a74ba3` (cut-out). DB via `update-product-30-campaign.ts
  --apply` (main, gallery, copy). Live: EN/RU/AR headline, new main, 12 localized slides, no old art or
  old main; app `ar/` slides. Tests 150 suites, 1615 passed.
