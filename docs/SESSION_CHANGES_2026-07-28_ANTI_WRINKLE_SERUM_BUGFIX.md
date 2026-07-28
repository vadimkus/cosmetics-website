# MULTI FUNCTIONAL ANTI-WRINKLE SERUM — claim / usage bugfix — 2026-07-28

## Bugs
1. How-to said **once daily / evening preferred** — contradicts artwork (AM & PM) and Bakuchiol photostability.
2. Serum↔cream recommendation implied **serum day / cream night only**.
3. Chatbot knowledge called Bakuchiol **pregnancy-safe** without label support.
4. Directions said **clinically proven** without a published % chart in brand deck.

## Fixes
| Area | Change |
|---|---|
| Live DB product `22` | `howToUse` AM & PM + SPF; `directions` clinically studied; `keyFeatures` softened |
| AR/RU product translations | Frequency + directions aligned |
| `messages/{en,ar,ru}.json` | `pc22Benefit2` / `pc32Benefit2` → AM & PM layering |
| Mobile `i18n/messages/{en,ar,ru}.json` | Same pairing fix |
| `docs/CHATBOT_KNOWLEDGE.md` | Bakuchiol row: no pregnancy-safe claim |

## Script
`scripts/fix-product-22-bakuchiol-copy-20260728.ts` (ran with `--apply`)

## Slides context
See `SESSION_CHANGES_2026-07-28_ANTI_WRINKLE_SERUM_6_SLIDES.md`
