# Product 64 (Hair Stamp For HAIRGEN BOOSTER) — production image + spec correction

**Date:** 2026-08-12
**Scope:** Production only. The local bespoke PDP redesign was deliberately **not** deployed.

## What changed on production

Vadim supplied three replacement graphics in `public/images/needles/`. They were
verified against manufacturer documentation, deployed, and the live product
record was repointed at them.

### Images

| Field | Before | After |
|---|---|---|
| `image` | `/images/needles/main.jpeg` | `/images/needles/main_new.jpeg` |
| `images[0]` | `/images/needles/s1.jpg` | `/images/needles/s1_new.jpeg` |
| `images[1]` | `/images/needles/s2.jpg` | unchanged |
| `images[2]` | `/images/needles/s3.jpg` | `/images/needles/s3_new.jpeg` |
| `images[3]` | `/images/needles/s4.jpg` | unchanged |

All new files are 1024×1024 JPEG, 461–639 KB — within the ≤500 KB / ≤2000 px
guidance in `.cursor/rules/product-gallery-images.mdc` (s1/s3 slightly over on size).

New filenames were used rather than in-place replacement, per the immutable
one-year `Cache-Control` on `/images/*`.

### Text corrections (the "140 needles" error)

The record claimed **140 microneedles**. That figure appears in **no** manufacturer
document. The DTS MG HairGen Booster leaflet (17 Jun 2021) states
`GENOSYS HAIR STAMP / Microneedles 52EA`.

| Field | Before | After |
|---|---|---|
| `description` | "an array of ultra-fine microneedles" | "an array of **52** ultra-fine microneedles" |
| `ingredients[0].description` | "Array of **140** ultra-fine **medical-grade** microneedles…" | "Array of **52** ultra-fine microneedles…" |
| `productDetails.needles` | "**140** ultra-fine microneedles per stamp" | "**52** ultra-fine microneedles per stamp" |

`medical-grade` was dropped: the Korean registration for this device is
두피관리기기 (scalp care device), not a medical device, and no manufacturer
document uses the term.

No needle depth was added — see open items.

## Source of truth

- `Desktop/Drive/Genosys/Training Materials/HairGen_Booster/210617_Hairgen Booster leaflet-small.pdf`
- `Desktop/Drive/Genosys/Training Materials/HairGen_Booster/User's manual-Hairgen Booster.pdf`

There is no Intertek filing for this item — it is a device accessory, not a cosmetic.

### Claims verified against the leaflet

| Claim (image) | Leaflet support |
|---|---|
| 52 microchannels / 52 ultra-fine needles | "Microneedles 52EA" |
| For HairGen Booster · pairs with HAIR SOLUTION α | "developed to be used with GENOSYS HR³ MATRIX HAIR SOLUTION α" |
| Single-use · no cross-contamination | "Each treatment, a new set of solution + applicator should be installed" |
| 1 box = 8 stamps (8 treatments) | matches `size` field; box photo shows 8 |
| Massaging sensation — not painful | "No pain during treatment – Massaging sensation instead of needling sensation" |
| Transcellular delivery | "Transdermal drug delivery system / Transcellular" |
| Collagen + elastin + angiogenesis | "1) natural collagen and elastin production 2) angiogenesis" |
| 10-min session | "Hair solution is absorbed within 10 mins" / auto-stop at 10 min |
| Made in Korea | manufacturer 메디씽큐, Gyeonggi-do |
| `s2.jpg` three causes of hair loss | "Causes of Hair Loss": genetic DHT, environmental, psychological |
| `s4.jpg` protocol steps | "How to Use" steps 1–7 |

## Open items

1. **`0.3mm Depth`** appears on `s1_new.jpeg` and `s3_new.jpeg`. No manufacturer
   document states any needle depth. The previous graphics said 0.25mm; neither
   number is sourced. Vadim chose to publish anyway, since 52 corrects the larger
   error. Regenerate both files without the depth line when convenient, or get
   DTS MG to confirm the real depth.
2. **`Medical-Grade`** still appears on `s1_new.jpeg` (removed from page text but
   baked into the graphic). Same regeneration pass.
3. ~~**`descriptionRu` / `descriptionAr` are `null`**~~ — resolved in a follow-up,
   see "Russian and Arabic copy" below.
4. `main.jpeg`, `s1.jpg`, `s3.jpg` were **left in place** — historical order
   emails still reference the old main image. Do not delete without first running
   `scripts/repair-dead-order-item-images.ts`.

## Deployment

- Commit `005ccf50` — the three image files only. Verified via
  `git diff --cached --name-only` that no redesign files were staged.
- DB write applied with `scripts/update-product-64-images-and-specs.ts --apply`
  (dry run first; backup in `backups/product-64-before-image-spec-fix-*.json`).
- Verified live: all five gallery URLs return 200; `/products/64`,
  `/ru/products/64`, `/ar/products/64` all return 200, reference the new
  filenames, and contain zero occurrences of "140 ultra-fine".

## Russian and Arabic copy (follow-up, commit `db15a7c7`)

Localised PDP copy does **not** come from the `descriptionRu` / `descriptionAr`
columns — `ProductContentDisplay` reads `data/productTranslationsRu.ts` and
`data/productTranslations.ts` first and only falls back to the DB. Those files had
no `'64'` entry, which is why both locales served English body copy. Writing to the
DB columns would have changed nothing.

Added a full `'64'` entry to both files: `description`, `productDetails`,
`benefits`, `ingredients`, `howToUse`, `directions`. The copy carries the corrected
52-needle figure and deliberately omits the unsourced `0.3mm` depth and
`medical-grade` claims, so the page text stays cleaner than the graphics.

Verified live: `/ru/products/64` and `/ar/products/64` both serve the translated
copy. No OTA needed — the mobile app reads the same files through the API.

## Reverted: howToUse normalization (`25ce505e`, reverted by `a821afdb`)

**Do not redo this.** A commit was pushed that converted 117 Russian and Arabic
`howToUse` entries from JSON step arrays to numbered plain text, justified by an
apparent raw-JSON leak on the localised pages. That leak does not exist:

- The `\"step\"` string found in `/ru/products/1` HTML is the **interface strings
  bundle** (`step` → `Шаг`, used by the skin-type quiz), not product copy.
- `components/product/ProductContentDisplay.tsx` already renders **both** shapes.
  `tryParseJSON` yields either a string, rendered as `<p class="whitespace-pre-line">`,
  or an array, rendered as `<ol class="list-decimal">` with `<strong>{step.step}:</strong>`.

So the change fixed nothing and destroyed the step labels ("Подготовка",
"Применение", …) on 117 entries. Reverted; `git diff db15a7c7 HEAD -- data/` is
empty, confirming both files are byte-identical to their prior known-good state.

Russian and Arabic legitimately use the richer labelled-step format while English
and the DB use plain text. That asymmetry is **intentional going forward** — if it
is ever unified, unify upward to labelled steps in English, not downward.

## Not deployed

The bespoke clinical-luxury PDP work (products 63–66:
`components/product/revitaglow/`, `biomeso/`, `cerabarrier/`, `hairstamp/`,
`bespokePdp.tsx`, and the route allowlist edits) remains local and uncommitted
by design.
