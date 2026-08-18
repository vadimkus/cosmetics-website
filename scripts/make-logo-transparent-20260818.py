"""
Produce a transparent, tightly-cropped version of the GENOSYS wordmark.

`public/Logo/upLOGO.png` is 1186x482 but the wordmark only occupies 1009x203 of it —
150px of dead space above and 129px below. The file is also 100% opaque with pure white
corners. On a white header that is invisible; on the cream footer it reads as a white
sticker sitting on top of the surface, which is what this fixes.

The mobile web header solved the same problem in August by swapping to
`/images/genosys-wordmark-transparent.png`, but that is a different lockup — black rather
than slate grey, and it carries the ® mark. This keeps the footer's existing mark and
just removes the white.

Written to a NEW filename on purpose: /Logo and /images are served with long cache
lifetimes, so replacing an asset in place leaves repeat visitors on the stale copy.

Run: python3 scripts/make-logo-transparent-20260818.py
"""

from PIL import Image, ImageChops

SRC = 'public/Logo/upLOGO.png'
OUT = 'public/Logo/upLOGO-transparent.png'

# Anything at or above WHITE is background; at or below INK is solid. Between the two the
# alpha ramps, which keeps the anti-aliased letter edges smooth instead of jagged.
WHITE = 250
INK = 238


def main() -> None:
    src = Image.open(SRC).convert('RGB')

    # Trim the dead padding.
    diff = ImageChops.difference(src, Image.new('RGB', src.size, (255, 255, 255)))
    bbox = diff.convert('L').point(lambda p: 255 if p > 8 else 0).getbbox()
    cropped = src.crop(bbox)

    # Key out the white. RGB is left untouched so the slate and red stay exactly as drawn.
    rgba = cropped.convert('RGBA')
    px = rgba.load()
    w, h = rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            m = min(r, g, b)
            if m >= WHITE:
                alpha = 0
            elif m <= INK:
                alpha = 255
            else:
                alpha = int(round(255 * (WHITE - m) / (WHITE - INK)))
            px[x, y] = (r, g, b, alpha)

    rgba.save(OUT, optimize=True)

    a = rgba.getchannel('A').histogram()
    total = w * h
    print(f'{SRC}  {src.size}')
    print(f'{OUT}  {rgba.size}')
    print(f'  fully transparent {a[0] / total:.1%} · fully opaque {a[255] / total:.1%}')
    print(f'  corners {[rgba.getpixel(p) for p in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1))]}')


if __name__ == '__main__':
    main()
