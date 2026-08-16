"""
Squares the POWER SOLUTION CTS hero shot by continuing its own studio sweep.

WHY. CTS.jpg is 956x662 on a light studio backdrop, same geometry as AWS.jpg
and SWS.jpg. The gallery stage is square and uses object-contain, so the shot
would sit in the middle of the stage tint with 147px of a different grey above
and below it.

Output is a new filename. /images/* is served immutable for a year, so an
in-place replacement would leave repeat visitors on the stale copy. The original
stays on disk because historical order emails reference it.
"""

import numpy as np
from PIL import Image, ImageFilter

import sys

SRC = 'public/images/CTS.jpg'
OUT = sys.argv[1] if len(sys.argv) > 1 else 'public/images/cts-hero.jpg'

SEED_ROWS = 8
SLOPE_SPAN = 90

im = Image.open(SRC).convert('RGB')
w, h = im.size
side = w
pad_top = (side - h) // 2
pad_bottom = side - h - pad_top
print(f'{SRC}  {w}x{h}  ->  {side}x{side}  (pad {pad_top} top, {pad_bottom} bottom)')

a = np.asarray(im, dtype=np.float64)


def extend(seed, slope, count, damp=0.55):
    rows = np.empty((count, w, 3), dtype=np.float64)
    cur = seed.copy()
    step = slope.copy()
    for i in range(count):
        cur = cur + step
        step = step * damp
        rows[i] = cur
    return rows


seed_top = a[:SEED_ROWS].mean(axis=0)
slope_top = -(a[SLOPE_SPAN] - a[0]) / SLOPE_SPAN
top = extend(seed_top, slope_top, pad_top)[::-1]

seed_bottom = a[-SEED_ROWS:].mean(axis=0)
slope_bottom = (a[h - 1] - a[h - 1 - SLOPE_SPAN]) / SLOPE_SPAN
bottom = extend(seed_bottom, slope_bottom, pad_bottom)

canvas = np.clip(np.vstack([top, a, bottom]), 0, 255).astype(np.uint8)

# Lift the sweep toward the cool teal paper the CTS page sits on, without
# chalking the teal CTS wordmark. Same split as AWS: blur holds the sweep,
# detail holds the pack, only the blur is lifted.
LIFT_AMOUNT = 16.0
LIFT_KNEE = 200.0
LIFT_END = 252.0
LIFT_BLUR = 10

f = canvas.astype(np.float64)
low = np.asarray(
    Image.fromarray(canvas).filter(ImageFilter.GaussianBlur(radius=LIFT_BLUR)),
    dtype=np.float64,
)
detail = f - low

t = np.clip((low - LIFT_KNEE) / (LIFT_END - LIFT_KNEE), 0.0, 1.0)
rolloff = 0.5 * (1.0 + np.cos(np.pi * t))
canvas = np.clip(low + LIFT_AMOUNT * rolloff + detail, 0, 255).astype(np.uint8)

out = Image.fromarray(canvas)
blurred = out.filter(ImageFilter.GaussianBlur(radius=9))
out.paste(blurred.crop((0, 0, side, pad_top + 2)), (0, 0))
out.paste(blurred.crop((0, side - pad_bottom - 2, side, side)), (0, side - pad_bottom - 2))

out.save(OUT, 'JPEG', quality=92, optimize=True, progressive=True, subsampling=0)

check = np.asarray(Image.open(OUT).convert('RGB'), dtype=np.int16)
join_top = np.abs(check[pad_top] - check[pad_top - 1]).mean()
join_bottom = np.abs(check[side - pad_bottom - 1] - check[side - pad_bottom]).mean()
print(f'wrote {OUT}')
print(f'  seam delta: top {join_top:.2f}/255, bottom {join_bottom:.2f}/255')
print(f'  corners: {out.getpixel((2, 2))} {out.getpixel((side - 3, 2))} '
      f'{out.getpixel((2, side - 3))} {out.getpixel((side - 3, side - 3))}')

PAGE = (243, 247, 247)
corners = [out.getpixel(p) for p in
           ((2, 2), (side - 3, 2), (2, side - 3), (side - 3, side - 3))]
gap = max(max(abs(c[i] - PAGE[i]) for i in range(3)) for c in corners)
print(f'  gap to page tint #f3f7f7 at the corners: {gap}/255')
clipped = float((np.asarray(out, dtype=np.int16) >= 254).all(axis=2).mean() * 100)
print(f'  pixels blown to white: {clipped:.2f}%')
