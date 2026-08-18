"""
Key the white background out of a flat-backed PNG and trim it to its content.

Several brand assets ship as fully opaque PNGs with pure white corners. On a white
surface that is invisible; on any of the cream editorial surfaces it reads as a white
sticker sitting on top of the page.

TWO THINGS THIS DOES THAT A NAIVE WHITE-KEY DOES NOT:

1. **It only removes background-connected white.** `uni.png` is a *white* unicorn. A
   threshold on "how white is this pixel" would punch holes straight through the animal.
   So the background is found by flood-filling inward from the border and nothing
   enclosed by artwork is ever touched.
2. **It feathers the edge.** Alpha ramps across the near-white band rather than switching
   at a threshold, so anti-aliased edges stay smooth instead of going jagged.

RGB is never altered, so colours are exactly as drawn.

Output always goes to a NEW filename: /Logo and /images are served with long cache
lifetimes, so replacing an asset in place leaves repeat visitors on the stale copy.

Usage:
    python3 scripts/make-asset-transparent.py public/images/avatar/uni.png \\
        public/images/avatar/uni-transparent.png
"""

import sys

import numpy as np
from PIL import Image

# Pixels at or above WHITE are background candidates; at or below INK they are artwork.
# Between the two, alpha ramps.
WHITE = 250
INK = 236


def background_mask(min_rgb: np.ndarray) -> np.ndarray:
    """Flood fill inward from the border through near-white pixels."""
    h, w = min_rgb.shape
    candidate = min_rgb >= INK
    seen = np.zeros((h, w), dtype=bool)

    # Seed every border pixel that is itself a candidate.
    stack: list[tuple[int, int]] = []
    for x in range(w):
        for y in (0, h - 1):
            if candidate[y, x] and not seen[y, x]:
                seen[y, x] = True
                stack.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if candidate[y, x] and not seen[y, x]:
                seen[y, x] = True
                stack.append((y, x))

    # Scanline-ish flood fill. Plenty fast for a couple of megapixels.
    while stack:
        y, x = stack.pop()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and candidate[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True
                stack.append((ny, nx))

    return seen


def main() -> None:
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    src_path, out_path = sys.argv[1], sys.argv[2]

    src = Image.open(src_path).convert('RGB')
    arr = np.asarray(src).astype(np.int16)
    min_rgb = arr.min(axis=2)

    bg = background_mask(min_rgb)

    # Alpha: 0 where background is solid white, ramping up across the near-white band,
    # and fully opaque everywhere the flood fill never reached.
    ramp = np.clip((WHITE - min_rgb) / (WHITE - INK), 0.0, 1.0)
    alpha = np.where(bg, ramp * 255.0, 255.0).astype(np.uint8)

    rgba = np.dstack([np.asarray(src).astype(np.uint8), alpha])
    out = Image.fromarray(rgba, 'RGBA')

    bbox = out.getbbox()  # bbox of non-zero alpha
    if bbox:
        out = out.crop(bbox)

    out.save(out_path, optimize=True)

    a = out.getchannel('A')
    hist = a.histogram()
    total = out.width * out.height
    print(f'{src_path}  {src.size}')
    print(f'{out_path}  {out.size}')
    print(f'  fully transparent {hist[0] / total:.1%} · fully opaque {hist[255] / total:.1%}')
    print(f'  corners {[out.getpixel(p) for p in ((0, 0), (out.width - 1, 0), (0, out.height - 1), (out.width - 1, out.height - 1))]}')


if __name__ == '__main__':
    main()
