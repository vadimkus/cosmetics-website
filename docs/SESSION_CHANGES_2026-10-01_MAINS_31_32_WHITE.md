# Session changes - 1 Oct 2026 - White-canvas mains for products 31 and 32

Vadim (screenshot of /products): rework the mains of MULTI FUNCTIONAL ANTI-WRINKLE CREAM (32) and
MULTI VITA RADIANCE CREAM (31) "so we have same as problem control, white canvas, shoot in capcut".
Both were studio shots on a grey sweep with window shadows.

- References: the real tube pairs (site cut-outs `31.webp`, `32-v2.webp`) on white at product 30's
  scale (tallest tube 74% of frame height, group centred, bottoms at 90%). Workspace
  `~/Desktop/Insta_Olga/mains_white/campaign/` (`mw_prompts.py`, `mw_batch.sh`).
- CapCut re-shoot, 4 takes each; labels checked at full size. Picks: `m31_1` (all print clean),
  `m32_2` (`m32_1` printed "ANTI-WRNKLE" on the small tube). The tiny body paragraph is approximate,
  as it already was on the previous mains; unreadable at card size.
- Background lifted to pure #FFFFFF with a near-white curve (232-249 -> 255); tube shading kept.
- New files (cache rule): `radiance/main-v2.jpg`, `multifunc_cream/main-v2.jpg`; cut-outs `31-v2.webp`,
  `32-v3.webp` (builder REVISION 31: 2, 32: 3; the old glossy-floor trim for 32 removed).
- Repointed: DB `image` for 31 and 32, `lib/products.ts`, `routineStepImages`, `OrderHistory`,
  `DownloadsSection`, the old 31/32 image scripts, `productCutouts`.
- Commits `198c5d47e`, `1983c0bca`; revalidated; live on both product pages and the /products grid.
- New rule `.cursor/rules/capcut-batches.mdc`: never ask whether CapCut is open; activate it with
  osascript and start the batch.
