# Product 66 — new studio set placed across the page

**Date:** 18 Aug 2026
**Product:** 66 · CERABARRIER BIOME GEL CLEANSER · `/products/66`

A new seven-slide studio set plus a clean two-bottle packshot arrived in
`public/images/cera_o/`. Rather than dropping them into the gallery and leaving them to
the 80px thumbs, each slide now sits beside the section it illustrates — the pattern set
in `SESSION_CHANGES_2026-08-16_BESPOKE_PDP_SLIDES_AUDIT.md`.

## Where each slide went

| Slide | What it says | Placement |
|---|---|---|
| `Main.jpeg` | Both bottles, no text | **Main image** (hero + cross-sell card) |
| `s1` | Barrier Lipid Complex × Microbiome Complex | Inline: **CERABARRIER BIOME™ Complex** |
| `s2` | CLEAN SKIN. INTACT BARRIER. | Gallery |
| `s3` | GEL. WATER. FOAM. | Inline: **the texture section** |
| `s4` | CLINICAL PROOF +145.8% / 2.4× | Inline: **Proof** |
| `s5` | MORE THAN CERAMIDES. | Inline: **Ingredients** (a slot that had no image) |
| `s6` | NO TIGHTNESS. | Inline: **How to use** |
| `s7` | 200 ml homecare / 600 ml professional | Gallery |

Three of these are exact matches rather than decoration: `s3` sits beside a heading that
reads *Gel. Water. Foam.* with gel/water/foam orbs under it; `s1`'s two columns mirror the
numbered list beside it (five ceramides, cholesterol and phytosphingosine, pro- and
prebiotics); and `s4` prints the same two figures as the cards beside it, with the same
footnote.

## The ingredients section gained an image

It used to open straight from the header into the ingredient list. `s5` is that same list
drawn as an architecture, so it now leads the section — centred, capped at 540px, square.
That is the only layout change on the page.

## Every claim was already ours

Checked slide by slide against `cerabarrierCopy.ts` before placing anything:

- **+145.8% immediate hydration** and **2.4×** — already the stats strip, the hero bullets,
  the proof cards and a FAQ answer.
- **"Clinical testing on a single use. Individual results vary."** — the slide's footnote is
  word for word `copy.proof.disclaimer`.
- **5 ceramides NP · AS · AP · NS · EOP**, the probiotic and prebiotic lists, **200 ml
  homecare / 600 ml professional**, dermatologically tested, made in Korea — all present.
- **NO TIGHTNESS** — the copy already carries "No tight feeling" and "no tightness".

Nothing on these slides introduces a claim the page did not already make, and nothing
needed rewording. Unusual, and worth recording: the set was clearly built from the
corrected copy rather than from the old marketing.

## The size cards stayed on the July set

`/images/cera/S4.jpeg` and `S5.jpeg` are the only **per-size** photographs we have — one
bottle each, with "~2–3 months daily use" and "~200–300 professional treatments" printed on
them. The 2026 set photographs the two sizes **together** (`s7`), which cannot fill two
separate cards without showing the same picture twice. So those two cards keep the older
images, and `s7` goes in the gallery.

**They now look different from the rest of the page** — busier, black spec panels, against
a set that is white and minimal. Worth a re-cut when there is time; the facts on them are
correct, so this is a styling issue, not a claims one.

## Nothing was deleted

`/images/cera/` stays on disk. `main3.jpeg` is referenced by order emails already sent, and
per `.cursor/rules/product-gallery-images.mdc` an old main image only comes off after
`repair-dead-order-item-images.ts` runs clean. New files went into a new folder under new
names, so the immutable one-year `Cache-Control` on `/images/*` cannot serve a stale copy.

## Files

| File | Change |
|---|---|
| `components/product/cerabarrier/CerabarrierProductPage.tsx` | Five image constants repointed; new figure in the ingredients section; alt text rewritten to describe what each slide says |
| `scripts/update-product-66-cera-o-slides-20260818.ts` | Main image + 7-slide gallery into the DB |
| `lib/productsDb.ts` | Cache `product-by-id-v56` → **`v57`** (row written outside the admin API) |

The gallery lives only in the DB `images` field; product 66 has no legacy gallery in
`productConfig.ts`, and the main image is deliberately excluded from the array because web
and mobile both prepend `product.image` themselves.

## Verified

- `tsc --noEmit` and `eslint` clean.
- `/products/66`, `/ar/products/66`, `/ru/products/66` all 200, all eight new files
  referenced in each.
- All eight assets return 200 and are 63–164 KB, inside the ≤500 KB guidance.
- Gallery rail shows eight thumbnails in order, main first, no duplicate.
- Desktop and mobile (390px) both render the new inline figure; text on the slide is
  legible at 356px wide.
- Size cards still resolve to the July per-size shots.

## Note for whoever is next

The mobile app is API-driven, so this needs no OTA — the gallery change is live for the app
as soon as the DB row is written. The image files still have to be committed and deployed
before they serve on genosys.ae.
