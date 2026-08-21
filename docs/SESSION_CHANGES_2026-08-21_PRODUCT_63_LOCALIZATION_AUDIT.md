# Product 63 RU/AR localization audit

Date: 2026-08-21

Product: `63` · REVITA GLOW BLEMISH BALM CREAM `[SPF 38 PA+++]`

## Source conclusion

The controlling sources were the separate #01 Bright and #02 Natural quantitative
formula / ingredient-list files, registered outer-carton artwork, the available
COAs, Korea registration / free-sale evidence and the official DTS MG product
material. The exact-product folder and both general safety/test-report archives
were also checked.

- Net content: `50 g`; PAO: 12 months.
- Korean triple-functional basis: UV protection, brightening and wrinkle care.
- Registered-pack rating: `SPF 38 PA+++`. SPF primarily addresses UVB. In the
  PA classification, `PA+++` means high UVA protection, corresponding to PFA
  8 to less than 16.
- The underlying exact-product SPF/UVA test report is not present in the
  available archive. The audit therefore treats `SPF 38 PA+++` as a registered
  artwork / product claim, not as an independently reviewed test endpoint.
- No water-resistance claim was found.
- Both shades use four UV filters:
  - #01 Bright: Ethylhexyl Methoxycinnamate 7.5%, Titanium Dioxide
    7.1295%, Ethylhexyl Salicylate 5%, Zinc Oxide 1.96%; total 21.5895%.
  - #02 Natural: the same filters, with Titanium Dioxide 6.1789%; total
    20.6389%.
- Niacinamide is `2.000010%`; adenosine is `0.040000%`; Tocopheryl Acetate
  is `0.100000%`.
- Ten vitamin types are present. Eight types other than B3 and the principal
  vitamin-E form are each at `0.000001%`; no benefit is assigned to those
  trace doses.
- Eight botanical extracts are present at `0.036%` total: seven at `0.005%`
  each and Tremella at `0.001%`. The branded DTS name may still count seven
  herbs because Tremella is filed separately; the INCI count remains eight.
- The shades are not the same formula with pigment alone changed. Pigments,
  mica, Titanium Dioxide and related Aluminum Hydroxide differ. Bright is
  lighter; Natural is deeper and warmer.
- Dermatological testing is stated on the registered carton. The underlying
  dermatological test report is not in the available archive.
- No exact-product safety assessment was found in the exact folder,
  `Intertek_folder/Safety Assessment Report`, or `Registration DOC/SA`.
- No product-specific clinical efficacy percentages are on file.
- The carton instructs application after skincare, blending well and light
  tapping. It does not specify a mandatory proprietary puff, a pre-exposure
  waiting time or a reapplication interval. The puff is not included.
- Fragrance disclosure includes Parfum, lemon and bitter-orange peel oils,
  linalool, linalyl acetate, limonene, citronellol,
  tetramethyl acetyloctahydronaphthalenes and hydroxycitronellal.

## Live corrections

- Added `data/product63LocalizedCopy.ts` as the canonical RU/AR payload and
  connected both the product-number and production-CUID translation keys.
- Rewrote the RU/AR bespoke PDP claim sections, exact shade differences,
  filter table, application, actives, safety, FAQ and product details.
- Made the bespoke PDP read localized ingredient cards rather than exposing
  the English database cards in RU/AR.
- Corrected quick facts, recommended-routine copy and chatbot fallback.
- Kept complexion coverage separate from UV protection and directed customers
  to adequate dedicated sunscreen underneath for dependable full-face use.
- Removed regenerative / energizing, glass-skin guarantee, barrier,
  anti-inflammatory, collagen / fibroblast, plant-HA-alternative,
  all-day / transfer / no-dryness, all-skin and unsupported puff-mechanism
  claims from the audited RU/AR runtime.

## Gallery and shade behavior

The main image, all eight gallery paths and `/videos/revita.mp4` were preserved.
The existing locale mapper continues to serve the RU and AR studio exports.
No slide was removed. Cross-checking the currently mapped slides against the
existing artwork-correction record found no new issue to add; previously
corrected `ru/s7.jpg` and `ar/s1.jpg` remain the active localized exports.

`Bright` and `Natural` remain the stable stored option values for web cart
lines and native mobile color variants. Customer-facing labels remain
`#01 Bright` and `#02 Natural` in every locale.

## Production database

The idempotent updater is
`scripts/update-product-63-localized-copy-20260821.ts`.

It:

- enforces `productNumber: "63"` and size `50 g`;
- writes canonical RU/AR descriptions plus corrected English structured data;
- clears unsupported `skinType`, removes hydration from `targetConcerns`, and
  retains valid `usage: "morning"`;
- preserves `image`, `images` and `videoUrl`;
- reads the row back and requires exact field parity.

Production row `cmljaahes0017e9ex5yfv76en` passed the parity check.
