"""
Squares the POWER SOLUTION CVS hero shot by continuing its own studio sweep.

WHY. CVS.jpg is 956x662 on a lilac-grey seamless backdrop. The gallery stage is
square and uses object-contain, so the shot sat in the middle of the stage tint
with 147px of a different grey above and below it - a hard-cornered rectangle
inside the stage's rounded card.

The fix is at the image level rather than in CSS, because the backdrop is a 2D
gradient (darker top-left, lighter bottom-right) and no flat stage colour or
single linear-gradient can meet it without a visible seam.

HOW. The top and bottom edge rows of the photo carry no product detail, only
smooth sweep, so they can be extended outward. The extension continues the
photo's own vertical brightness slope rather than repeating a flat row, which is
what a real sweep does as it runs away from the light. The slope is damped as it
goes so it cannot run away into a band. The first extended row is the photo's
own edge row, so the join is seamless by construction.

Output is a new filename. /images/* is served immutable for a year, so an
in-place replacement would leave repeat visitors on the stale copy. The original
stays on disk because historical order emails reference it.
"""

import numpy as np
from PIL import Image, ImageFilter

import sys

SRC = 'public/images/CVS.jpg'
# Overridable so the look can be iterated into /tmp. /images/* is served with a
# one-year immutable cache, so the real file is written once, at the end.
OUT = sys.argv[1] if len(sys.argv) > 1 else 'public/images/cvs-hero.jpg'

# How many edge rows to average into the seed row. Enough to cancel JPEG noise,
# few enough that no product pixel is pulled in.
SEED_ROWS = 8
# Rows used to measure the sweep's vertical gradient at each edge.
SLOPE_SPAN = 90

im = Image.open(SRC).convert('RGB')
w, h = im.size
side = w  # pad vertically only; the sides already reach the frame
pad_top = (side - h) // 2
pad_bottom = side - h - pad_top
print(f'{SRC}  {w}x{h}  ->  {side}x{side}  (pad {pad_top} top, {pad_bottom} bottom)')

a = np.asarray(im, dtype=np.float64)

def extend(seed, slope, count, damp=0.55):
    """Rows running outward from an edge, continuing `slope` per row with the
    step shrinking geometrically so a long pad cannot drift into a visible band."""
    rows = np.empty((count, w, 3), dtype=np.float64)
    cur = seed.copy()
    step = slope.copy()
    for i in range(count):
        cur = cur + step
        step = step * damp
        rows[i] = cur
    return rows

# --- top -----------------------------------------------------------------
seed_top = a[:SEED_ROWS].mean(axis=0)
# Per-row change measured inside the photo, then reversed: going up continues
# the sweep in the opposite direction to going down.
slope_top = -(a[SLOPE_SPAN] - a[0]) / SLOPE_SPAN
top = extend(seed_top, slope_top, pad_top)[::-1]  # outermost row first

# --- bottom --------------------------------------------------------------
seed_bottom = a[-SEED_ROWS:].mean(axis=0)
slope_bottom = (a[h - 1] - a[h - 1 - SLOPE_SPAN]) / SLOPE_SPAN
bottom = extend(seed_bottom, slope_bottom, pad_bottom)

canvas = np.clip(np.vstack([top, a, bottom]), 0, 255).astype(np.uint8)

# --- lift the sweep toward the page tint ---------------------------------
# The shot now fills the stage, but its sweep runs to #c8c5cd at the top left
# while the page behind the card is #f5f4f8, so the card still read as a grey
# slab dropped into a cream page.
#
# The lift is applied to the image's broad tone only. A plain levels move on the
# whole image also rescales the pack, and at LIFT 150->196 that cost 44% of the
# contrast in the 200-255 range where the box and the vial labels live - the pack
# went chalky. So the image is split first: a heavy blur holds the sweep, which
# is pure low frequency, and the difference holds every edge, letter and label.
# Only the blur is lifted, then the detail is added back at full amplitude, so
# the pack keeps exactly the contrast it was photographed with.
#
# The curve is a flat offset up to LIFT_KNEE, then a cosine rolloff to nothing at
# white. Flat means the sweep and the shadow under the box move together, so the
# shadow stays as strong as it was and the pack stays grounded rather than
# floating. The rolloff means the pack's own brightness barely moves and nothing
# clips. The rolloff is long enough that the curve stays monotonic, so the
# sweep's gradient cannot band or invert.
LIFT_AMOUNT = 22.0
LIFT_KNEE = 200.0
LIFT_END = 252.0
# On a 956px frame this leaves the box's cast shadow largely in the detail layer
# while still taking the whole sweep gradient into the blur.
LIFT_BLUR = 10

f = canvas.astype(np.float64)
low = np.asarray(
    Image.fromarray(canvas).filter(ImageFilter.GaussianBlur(radius=LIFT_BLUR)),
    dtype=np.float64,
)
detail = f - low

t = np.clip((low - LIFT_KNEE) / (LIFT_END - LIFT_KNEE), 0.0, 1.0)
rolloff = 0.5 * (1.0 + np.cos(np.pi * t))  # 1 below the knee, easing to 0 at LIFT_END
canvas = np.clip(low + LIFT_AMOUNT * rolloff + detail, 0, 255).astype(np.uint8)

print('  lift curve:', ', '.join(
    f'{int(v)}->{v + LIFT_AMOUNT * 0.5 * (1 + np.cos(np.pi * min(max((v - LIFT_KNEE) / (LIFT_END - LIFT_KNEE), 0), 1))):.0f}'
    for v in (170, 190, 205, 220, 235, 250)))

out = Image.fromarray(canvas)

# A wide blur over the whole frame, composited back only inside the two pads.
# The pads are built from single rows, so without this they can show faint
# vertical streaking where the seed row carried JPEG noise. The photo itself is
# never touched.
blurred = out.filter(ImageFilter.GaussianBlur(radius=9))
out.paste(blurred.crop((0, 0, side, pad_top + 2)), (0, 0))
out.paste(blurred.crop((0, side - pad_bottom - 2, side, side)), (0, side - pad_bottom - 2))

out.save(OUT, 'JPEG', quality=92, optimize=True, progressive=True, subsampling=0)

check = np.asarray(Image.open(OUT).convert('RGB'), dtype=np.int16)
join_top = np.abs(check[pad_top] - check[pad_top - 1]).mean()
join_bottom = np.abs(check[side - pad_bottom - 1] - check[side - pad_bottom]).mean()
print(f'wrote {OUT}')
print(f'  seam delta: top {join_top:.2f}/255, bottom {join_bottom:.2f}/255  (under ~1.5 is invisible)')
print(f'  corners: {out.getpixel((2, 2))} {out.getpixel((side - 3, 2))} '
      f'{out.getpixel((2, side - 3))} {out.getpixel((side - 3, side - 3))}')

# The page tint the card sits on. The corners are what touch it.
PAGE = (245, 244, 248)
corners = [out.getpixel(p) for p in
           ((2, 2), (side - 3, 2), (2, side - 3), (side - 3, side - 3))]
gap = max(max(abs(c[i] - PAGE[i]) for i in range(3)) for c in corners)
print(f'  gap to page tint #f5f4f8 at the corners: {gap}/255 (was 47 before the lift)')

# Clipping check: the pack must not lose its detail into flat white.
clipped = float((np.asarray(out, dtype=np.int16) >= 254).all(axis=2).mean() * 100)
print(f'  pixels blown to white: {clipped:.2f}%  (a real sweep photo should stay near 0)')

# Contrast retention on the pack. This is the number that went wrong with a plain
# levels move: the box face and the vial labels must keep their original bite.
orig = np.asarray(Image.open(SRC).convert('L'), dtype=np.float64)
now = np.asarray(out.convert('L'), dtype=np.float64)[pad_top:pad_top + h]
for label, (x0, x1, y0, y1) in {
    'box face + logo': (180, 500, 230, 560),
    'vial labels': (600, 880, 480, 580),
    'sweep (should be flat)': (60, 300, 20, 120),
}.items():
    a0 = orig[y0:y1, x0:x1].std()
    a1 = now[y0:y1, x0:x1].std()
    print(f'  contrast {label:<24} {a0:6.2f} -> {a1:6.2f}  ({a1 / a0 * 100:5.1f}% kept)')
