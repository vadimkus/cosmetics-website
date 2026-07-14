# Session — Bio Meso PDRN Ampoule 60000 Recommended Routine (2026-07-14)

## Request
Add a Recommended Routine for product **60** (Bio Meso PDRN Ampoule 60000) —
the last retail gap after the Jul 9 routines rollout (previously excluded as
professional-only).

## Routine (clinic protocol)
Heading: **Recommended Bio-Meso Treatment Routine**

1. Snow O₂ Cleanser (#10)
2. Bio Meso PDRN Ampoule 60000 (#60) — self
3. Skin Reboot PDRN Mask Pack (#52)
4. Soothing Repair Postcream (#25) — matches Perfect Combination pairing

## Changes
- `lib/productRoutines.ts` — entry `'60'`
- `lib/routineStepLinks.ts` — `routineBioMesoExpertTitle` → `60`
- `messages/en.json` / `ar.json` / `ru.json` — heading + step title/desc

Web PDP + mobile API pick this up automatically via `ProductRoutineCard` /
`getMobileRoutine` (no app OTA needed).

## Verify
- `/products/60` mobile + desktop: routine after Product Details / left column
- Step 2 is unlinked (self); steps 1/3/4 deep-link
