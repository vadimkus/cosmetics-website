# Product 66's small bottle kept its reflection

Date: 26 Aug 2026

The CERABARRIER cut-out showed the small bottle standing on an upside-down copy of itself.
The mirrored label text was legible in it.

## What happened

Both bottles are lit on a glossy surface, so both have a reflection in the source
photograph. Vision tore the large bottle's reflection away but kept the small one's whole,
at full alpha — so it survived into `66.webp` as product rather than as the debris the
pipeline already knows to expect.

It cost more than the ghost itself. The frame is trimmed to the silhouette after masking,
so the reflection dragged the bounding box down and pushed both bottles up and small
inside the canvas.

## The fix

`build-cutouts.py` already carries a `FLOOR` table for exactly this — the contact line,
measured per photograph, below which everything is reflection. Product 65 had an entry;
66 did not.

Measured off the source frame: both contact edges read as a dark hairline, the large
bottle's at **86.44%** of frame height and the small one's at **86.36%**. A floor of
`0.866` sits just below the lower of the two, so neither base is clipped.

`REVISION` bumped to 2, so the new pixels arrive under a new URL — `/images/cutout` is
served with a one-year immutable cache and a file rewritten under its old name would never
reach anyone who had already loaded the page. `lib/productCutouts.ts` now points at
`66-v2.webp`.

No database change: the product's image is `/images/cera_o/Main.jpeg` and the manifest maps
it to the cut-out.

## The rest of the catalogue

I checked whether any other cut-out had the same problem, and got it wrong twice before
looking properly.

A detector for the silhouette *widening* below a pinch flagged 22 of 67 — every bottle
shoulder and the flange on a syringe. A detector for *mirror symmetry* across a seam
flagged 63 of 67, because a cylindrical bottle is trivially symmetric over a short span.

Neither is a usable test, so they are not in the repository. Rendering all 67 cut-outs on
the page's cream and looking at them settled it in a minute: **66 was the only one.**

Worth remembering the next time this comes up — the honest tool here is a contact sheet.
