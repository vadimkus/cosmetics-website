# SRS marketing slides — HES system — 2026-08-17

## Why v1 / v2 were rejected

HES is one lit still life plus editorial type. v1/v2 stamped catalog photos and AI packaging on top of empty lab stock.

| Fail | What I shipped | What HES actually does |
|---|---|---|
| s1 | AI box with garbled "COREANCEUTICALS" + two vials | One real closed box + one real vial, same studio |
| s2 / s5 / s7 | Real vial pasted on top of an AI vial | One vial in the scene |
| s3 | Type slab on top, photo shoved to the bottom | Numbers left, glass right, same frame |
| s4 | Ingredient list, no leaders | Gold callout lines into the still life |
| s5 | Numbered 01–05 list | Four icons only |
| s6 | No face callouts / wrong lockup | White callouts on the cheek, helix above the code |
| s7 | White card + floating second vial | One vial sitting on the acrylic |
| Lockup | Helix beside the letters | Helix above SRS / rule / PROFESSIONAL |

## v3 — what changed

Rebuild script: `/tmp/srs_slides_v3.py`

| # | File | Now |
|---|---|---|
| 1 | `s1.jpeg` | Real closed box from `kit-open.jpeg` + one real vial from `vial.jpeg`. Kicker / gold rule / **A REAL PEEL.** / tracked name. Footer 2 ml × 10. No AI box. |
| 2 | `s2.jpeg` | Empty glass-disc plate + **one** real vial. NOT A HOME ROLL. / A REAL PEEL. / NEW after fifteen minutes. |
| 3 | `s3.jpeg` | Glass stays on the right. 15 / 13.5 / 2 + glycerin 25% + pH 3.02. |
| 4 | `s4.jpeg` | Gold leaders into the dish. Glycolic / lactic / mandelic / glycerin. |
| 5 | `s5.jpeg` | Empty petri plate + one vial. DESIGNED FOR PROFESSIONAL PEELING. APPLY / SIT / RINSE / SPF. No numbered list. |
| 6 | `s6.jpeg` | Model + white face callouts + two-line FOR list + helix-above lockup. |
| 7 | `s7.jpeg` | Empty pedestal + olive + one vial on the acrylic. Shop genosys.ae / app. |

All seven: `~/Desktop/images/srs/s1.jpeg`–`s7.jpeg` (1254²). Not on the website gallery.

## Still not a photographer

The HES set was shot as one still life. These slides still composite a punched vial onto generated glass. Lighting will never match a real studio day. If a slide still feels pasted, that is why.

## Product facts used (Intertek / carton)

Glycolic 15% + lactic 13.5% + mandelic 2%. Glycerin 25%. pH 3.02. Sit 15–20 min. Cold rinse. No neutralize. 2 ml × 10. Soft peeling. Smoother, brighter, more even tone. Peptide is not on the slides.

Accent: SRS red RGB 196, 32, 56. Fonts: Bodoni 72 Bold + Helvetica Neue. Gold rules. Helix-above lockup.
