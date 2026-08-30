# Hydro Cool Main5 label reconstruct — 2026-08-29

## What
Sharpened the front label on the Hydro Cool Modeling Mask pouch shot (`Main5.jpeg`). Official artwork was perspective-mapped onto the existing sticker plate. Pouch, zipper, foil, and canvas stay 4096×4096.

Desktop / Olga only. Not pushed to genosys.ae.

## Files
- Working: `~/Desktop/HH/Main5.jpeg`
- Same file: `~/Desktop/Insta_Olga/hydro_o/Main5.jpeg`
- Natural second copy: `~/Desktop/HH/Main5_v2.jpeg`
- Same second copy: `~/Desktop/Insta_Olga/hydro_o/Main5_v2.jpeg`
- Backup (untouched original): `~/Desktop/HH/Main5_before.jpeg` and `~/Desktop/Insta_Olga/hydro_o/Main5_before.jpeg`

## Sources
- Official dieline: `~/Desktop/HH/HYDRO COOL MODELING MASK.pdf` (same file as Intertek `Registration DOC/Artwork/[GENOSYS]HYDRO COOL MODELING MASK.pdf`)
- Layout check: `~/Desktop/HH/HYDRO COOL MODELING MASK.png`
- Wording follows the registered artwork: mix 30 g, peel **15–20 minutes**, DTS MG, `www.genosys.info`, **6M**, barcode **8809392232011**

## Method
- Rendered the PDF at 600 dpi, warped the full lockup onto the printed sticker quad
- Dest plate: TL 1196,1329 / TR 2913,1329 / BR 2913,2857 / BL 1116,2857
- Artwork aspect 1.143 vs dest ~1.150 — no type stretch
- Soft 4 px edge so it sits on the foil. Gentle lighting only. Original pack pixels kept outside the plate

## Check
- Title / body / navy fine print / barcode readable at full res
- Laplacian variance on the title block ~5× the soft original
- Top-left no longer paints the official bar onto the foil highlight

## Second pass
- Rebuilt from `Main5_before.jpeg`; the first edited `Main5.jpeg` was not used.
- Removed the trapezoid and rounded-looking corner introduced by the first pass.
- Used a straight rectangular sticker plate at `1180,1329` to `2927,2858`.
- Preserved the official artwork ratio: output **1.14258**, source **1.14268**.
- Restored restrained photographic grain and the original low-frequency light falloff.
- Used a 1.5 px anti-aliased physical edge instead of the first pass's broad feather.

## Closing bag match
- Created `~/Desktop/HH/Closing_v2.jpeg` and
  `~/Desktop/Insta_Olga/hydro_o/closing_v2.jpeg`.
- Replaced the different narrow/front-label pouch with the exact pouch pixels from
  `Main.jpeg`, including its registered two-panel label.
- Scaled the Main pouch uniformly to the Closing pouch height: output pouch ratio
  **0.80573**, source pouch ratio **0.80594**.
- Preserved the 2048×2048 Closing canvas and every left-side typography/icon pixel.
- Original `Closing.jpeg` / `closing.jpeg` remain untouched.
