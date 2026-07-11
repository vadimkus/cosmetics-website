# Session — Sea Algae Mask Weight Fix: 23g → 25g (2026-07-11)

## Context

Vadim: the Soothing Bomb Sea Algae Mask sheet is **25g, not 23g** — fix it
everywhere. The product description already said "25g x 10ea"; only the size
labels carried the wrong 23g.

## Fixed

| Where | What |
|---|---|
| DB product `36` | `size` and `productDetails.size` → "1 sheet (25g)" (live-verified via API) |
| `lib/products.ts` | static catalog entry size → "1 sheet (25g)" |
| `lib/orderSizeDefaults.ts` | default mask size for SOOTHING BOMB SEA ALGAE → "25g" |
| `lib/moysklad.ts` | comment on product mapping → 25g |
| App `contexts/CartContext.js` | free-mask promo seaAlgae size → "1 sheet (25g)" |

- Web deployed (commit `81c48db7`); product API confirmed serving 25g with no
  23g remnants.
- App shipped via EAS OTA (runtime 1.11.0, update group
  `16a105c6-08af-48b2-a5a4-a2f45d44cad1`, commit `5e5a64f`).

## MoySklad rename — DONE

MoySklad product `00140` renamed "Genosys Soothing Bomb Sea Algae Mask 23g" →
"**Genosys Soothing Bomb Sea Algae Mask 25g**" via
`scripts/moysklad-rename-sea-algae-mask-25g-20260711.js --commit` at 15:32.
(The network block on api.moysklad.ru lifted after ~20 minutes; future
invoices and printouts will show 25g.)

## Not touched

- Collagen mask references (23g elsewhere) — only sea algae was corrected per
  instruction.
- Historical MoySklad scripts/docs mentioning "23g" in comments — inert
  one-off scripts, left as-is.
