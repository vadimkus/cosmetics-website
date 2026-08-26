# SWS box — ingest + GENOSYS lockup fix — 2026-08-23

Local only: `~/Desktop/Insta_Olga/sws_0/`

## Ingested

| File | What |
|---|---|
| `box.jpeg` | Open SWS kit, 1254². Working file. |
| `box_before.jpeg` | Backup of the AI box before the lockup swap. |
| `logo.jpeg` | Official GENOSYS wordmark: GEN + emblem + SYS, lockup proportions. |
| `logo_red.jpeg` | Official emblem only: 4 bars per arm, circular center. |
| `logo_lockup.png` | Reconstructed RGBA wordmark from the two refs. |

## What was wrong

The white box had a fake red “O” (gear / radial blocks) in two places:

1. Inner lid, above POWER SOLUTION
2. Front lip, left of POWER SOLUTION / SWS

Vial labels were not touched.

## What we did

Rebuilt the wordmark from `logo.jpeg` letters + `logo_red.jpeg` emblem, same gaps and emblem-to-cap-height overhang. Warped onto those two spots. POWER SOLUTION, SWS, and the orange vial icon stay as they were.

Not pushed. Product 8 gallery not touched.
