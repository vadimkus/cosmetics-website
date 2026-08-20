# Product 63 — new Revita Glow studio set

**Date:** 19 Aug 2026
**Product:** 63 · REVITA GLOW BB CREAM · `/products/63`

Nine files arrived in `public/images/revita_o/`. Five go inline beside the section each
one illustrates; the rest carry no section of their own and stay in the gallery.

| Slide | Placement |
|---|---|
| `main.jpg` | Main image — both tubes, no text |
| `s2` SPF 38 PA+++ | Inline: the filter section |
| `s3` More than makeup | Inline: the layering section |
| `s4` Beauty with skincare inside | Inline: the actives section |
| `s5` Two shades | Inline: the shade section, and the swatch video's poster |
| `s6` Your final skincare step | Inline: the ritual |
| `s1`, `s7`, `closing` | Gallery |

The filter, layering and actives sections had no figure before this.

## Claims checked against the audited copy

Everything printed on the slides is already in `revitaGlowCopy.ts`: SPF 38 PA+++,
niacinamide 2%, adenosine, erythritol, #01 Bright and #02 Natural, 50 g, dermatologically
tested, made in Korea.

`s3` counts **eight botanical extracts**, which is how that file counts them. The sourcing
note is explicit that the *branded* complex name should be printed as seven — the slide
does not use the branded name, so eight is right.

## One tension worth knowing about

`s3` labels the ten-vitamin complex "skin energizing support". The sourcing note at the
top of `revitaGlowCopy.ts` says eight of the ten vitamins sit at one part per billion, and
that the complex is therefore "described as a formulation feature and never credited with
an effect".

The slide does credit it with an effect — but so does the visible page copy already
("the ten vitamins... go to work"). So the slide is consistent with the page; the tension
is between the page and its own sourcing rule, and it predates this set. Left as-is rather
than changed silently. Tightening it is a one-line copy edit if wanted.

## Order of operations

Assets and page code went out together and were confirmed serving 200 before the record
was written, because the database is shared with production. Cache key bumped to
`product-by-id-v60`.

The previous set in `/images/revita/` stays on disk — order emails already sent reference
the old main image.

## Arabic and Russian slides — 20 Aug 2026

Localized exports were added under `revita_o/ar/` and `revita_o/ru/` using the canonical
English filenames. `lib/localizedProductImages.ts` now swaps approved files for the active
locale in the web gallery, the five bespoke inline figures, and all mobile product APIs.
The main packshot stays shared because it has no overlaid copy.

Two supplied exports were deliberately not registered and therefore fall back to English:

- `ru/s7.jpg` adds "clinically proven results" and "cellular-level cleansing". Neither
  claim is present in the canonical English slide or supported by the product dossier.
- `ar/s1.jpg` adds "developed by beauty experts, scientifically backed", which is also
  absent from the canonical artwork and source record.

All other translated files were content-aligned to `s1`–`s7` and `closing`, visually
checked, and recompressed below 500 KB before deployment. No database update was needed:
the canonical gallery paths remain the single source of truth and localization happens
at render/API response time.

### Corrected exports

Later on 20 Aug, corrected versions of `ru/s7.jpg` and `ar/s1.jpg` were supplied. The
unsupported additions were removed, both slides now match the canonical English claims,
and both were registered for locale swapping. Revita Glow therefore has a complete
eight-slide localized gallery in Arabic and Russian.
