# Session — Deep Moisturizing Routine: Cerabarrier Cleanser (2026-07-12)

## Request
Review the "Recommended Deep Moisturizing Routine" (seen on
https://genosys.ae/products/34) — GENOSYS now has the Cerabarrier
cleanser with ceramides — amend as required and ship for all locales.

## What was done
Step 1 of the Deep Moisturizing routine swapped from **Snow O₂ Cleanser**
(brightening oxygen cleanser) to **Cerabarrier Biome Gel Cleanser**
(Pink Ceramide + microbiome complex, cleans without stripping the
moisture barrier) — a better fit for a moisture/barrier routine.

Applied consistently to all five products sharing that routine heading
in `lib/productRoutines.ts`:
- 18 Moisture Replenishing Hyaluron Serum
- 28 Intensive Hydro Soothing Cream
- 29 Moisture Replenishing Hyaluron Cream
- 34 Skin Rescue Overnight Cream Mask
- 35 Hydro Cool Modeling Mask

No new translations needed — `routineCerabarrierCleanserTitle/Desc`
already exist in EN/RU/AR. Step deep-links to product 66.

## Verified live (after Vercel deploy)
- `products/34` step 1: EN "Cerabarrier Biome Gel Cleanser",
  RU "Гель для умывания Cerabarrier Biome",
  AR "منظف سيرا باريير بيوم الجل" — all linking to product 66.
- Applies to web PDP and the mobile app routine card (API-driven,
  no OTA needed).

## Deploy
Commit `15cace26`, pushed, Vercel deployed.
