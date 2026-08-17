# MFC Cream both-sizes — text reconstruction (2026-07-30)

## Request
Desktop HQ file had garbled/soft text on left and right tubes. Reconstruct text, make packshot super quality.

## Method (final)
AI redraw / ESRGAN of AI masters kept melting micro-type.

**Master rebuilt from real high-res 50g packshot** (WhatsApp PNG 1444×3461) for both sizes:
- Left: scaled smaller
- Right: same sharp artwork scaled larger (front label identical on 50g/250g)
- Soft contact shadows, mild unsharp + contrast
- Canvas 4096×4096

Abandoned: label overlays (ghosting), PIL black-bar footer auto-detect (wrong zones), dual ESRGAN blends.

## Correct packaging copy
- MULTI FUNCTIONAL ANTI-WRINKLE CREAM / with BAKUCHIOL
- Body: bakuchiol, Retinol, propolis and collagen
- DERMATOLOGICALLY TESTED · MFC PROFESSIONAL
- Footer: GENOSYS is a compound word of Gene Re-birth System

## Deliverable
`~/Desktop/MFC_AntiWrinkle_Cream_both_sizes_HQ.png` (+ `.jpg`)

Not pushed to website.

## Follow-up — remove forward shadows (same day)
Source: `new-0feeac23-...png` (good composition).
Cut tubes at cap density peak (~y 863–869), wipe floor / cast shadows / reflections below to pure white.
Deliverable overwritten: `~/Desktop/MFC_AntiWrinkle_Cream_both_sizes_HQ.png` (+ `.jpg`).
