# Session — No roller with Bio-Meso spicules (2026-07-14)

## Problem
Homecare Ampoule **#65** showed "Recommended Home Microneedling Routine" with
**Microneedle Roller** as step 2. Spicules must never be combined with a roller.

## Fix
- **#65**: Bio-Meso routine — cleanse → Homecare 5000 → PDRN mask → postcream
  (no roller). Heading: Recommended Bio-Meso Treatment Routine.
- **#1** (roller): replaced spicule ampoule with Hyaluron Serum + new
  `routineHyaluronSerumDescMicroneedling` copy (non-spicule only).
- Rewrote `routinePDRNAmpouleDesc` EN/AR/RU — no "apply after stamping";
  explicit never-with-roller guidance.

## Rule
Bio-Meso spicule products (60, 65) and Microneedle Roller (1) are mutually
exclusive delivery systems — never in the same routine.
