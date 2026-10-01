# Session changes - 1 Oct 2026 - Product 50 Eye Zone Care Kit: new main

Vadim: "rework main image here (products/50), eye roller is not correct".

The first main (`eyekit_campaign/main.jpg`, 27 Sep) had a generic thin-handled roller, and props: black
pedestals under the serum and cream and an acrylic disc under the patch jar.

## New main - `/images/eyekit_campaign/main-v2.jpg`

- The real packs on pure white, nothing else: the EyeCell kit box at the back left, serum and cream
  standing to its right, the patch jar and the real GENOSYS Eye Roller (product 69 cut-out: one-piece
  white body widening into a black drum) in front. Every pack stands apart, nothing overlapping
  (the rule Vadim set on product 70 the same day).
- Workspace `~/Desktop/Insta_Olga/eyekit50main/`: `e50_refs.py` builds the reference from the real
  cut-outs (official serum and jar PNGs, box and cream keyed off white, roller from eyeroller69);
  `e50_batch.sh` re-shot it in CapCut (`dmain1`, take 2); `e50_fix_main.py` registers the box, serum,
  cream and jar onto the take (SIFT + RANSAC) and pastes the real artwork, because CapCut garbled the
  print ("Mitochondria Therapy" on the box, "ECK" on the jar). CapCut's own roller is kept: it follows
  the real shape and carries no print. Leftovers of CapCut's slightly larger packs are cleaned beside
  and above each pack, never under its base, so contact shadows stay.
- Labels checked at full size.

## Site

- DB main swapped by `scripts/update-product-50-main-v2-20261001.ts`; gallery unchanged.
- Repointed: `lib/products.ts`, `scripts/update-product-50-campaign-gallery.ts`, the training catalogue
  (web `app/training/trainingCatalogue.ts`, mobile `app/api/mobile/training/route.ts`) and the profile
  downloads tile, which still showed the old `eye_kit/main.jpeg` lifestyle photo.
- Cut-out `50-v3.webp` (REVISION 3; PARTS re-trace serum + cream, jar and roller, which Vision dropped).
- The roller packshot inside the kit page's contents list (`eye_kit/roller.jpeg`) is already the real
  roller and stays.
