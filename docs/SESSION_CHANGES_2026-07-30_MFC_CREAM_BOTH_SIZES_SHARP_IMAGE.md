# MFC Cream both-sizes packshot — sharp master (2026-07-30)

## Request
Enhance user packshot of MULTI FUNCTIONAL ANTI-WRINKLE CREAM (both sizes): same composition/background, higher sharpness and text readability. Do **not** put on website unless asked.

## Source
- Cursor assets: `main-8130f138-5738-4b32-9091-376ef5c794b7.png`

## Deliverables (Desktop only)
| File | Notes |
|---|---|
| `~/Desktop/MFC_AntiWrinkle_Cream_both_sizes_MASTER.png` | **Primary** — exact frame, 3× Lanczos + dual UnsharpMask (3072×3072) |
| `~/Desktop/MFC_AntiWrinkle_Cream_both_sizes_MASTER.jpg` | Same, JPEG q97 |
| `~/Desktop/MFC_AntiWrinkle_Cream_both_sizes_AI_retouch.png` | Optional AI retouch (same layout) |
| `~/Desktop/MFC_AntiWrinkle_Cream_both_sizes_SHARP.png` | Earlier 2× pass |

## Method (MASTER)
1. Keep original pixels / framing / background
2. Upscale 3× Lanczos
3. Light median blend (denoise without killing type)
4. Mild contrast/brightness/color
5. UnsharpMask fine + broad for label readability

## Website
Not copied to `public/images/` — wait for Vadim OK.
