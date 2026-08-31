#!/usr/bin/env python3
"""
Hold every bespoke product video to the ratio of the file it is playing.

All 34 product clips are 9:16 phone exports, but most bespoke pages wrapped
them in `aspect-square sm:aspect-video` with `object-cover`, so on desktop the
page showed a horizontal band through the middle of the shot and threw away the
rest of the height. Squares lost the top and bottom the same way, less badly.

Only the div that directly wraps a <video> is touched. The same class string is
used on image tiles elsewhere on these pages, so a blind find-and-replace would
reshape those too.

Usage:  python3 scripts/fix-product-video-aspect.py [--apply]
"""
import glob
import re
import sys

APPLY = '--apply' in sys.argv

# What a portrait container looks like, matching the two pages that already
# had it right (BioFerment, and Hydro Cool as of Aug 31).
PORTRAIT = 'mx-auto aspect-[9/16] w-full max-w-[340px]'


def rewrite(cls: str) -> str | None:
    """Return the corrected class string, or None if it is already fine."""
    if 'aspect-[9/16]' in cls:
        return None
    if 'aspect-square' not in cls:
        # No ratio at all: the video keeps its own, nothing to crop.
        return None

    out = cls
    # Drop the desktop widescreen override and the square base together.
    out = out.replace(' sm:aspect-video', '')
    out = out.replace('aspect-square', PORTRAIT)
    if 'mx-auto' in cls:
        # Do not end up with it twice if the page already centred the box.
        out = out.replace(f'{PORTRAIT}', PORTRAIT.replace('mx-auto ', ''), 1)
    return out


def main() -> None:
    changed = 0
    for path in sorted(glob.glob('components/product/*/*.tsx')):
        src = open(path).read()
        edits = []

        for m in re.finditer(r'<video\b', src):
            divs = list(re.finditer(r'<div\s+className="([^"]*)"', src[:m.start()]))
            if not divs:
                continue
            div = divs[-1]
            new = rewrite(div.group(1))
            if new:
                edits.append((div.start(1), div.end(1), div.group(1), new))

        if not edits:
            continue

        # Apply back to front so earlier offsets stay valid.
        out = src
        for start, end, old, new in sorted(set(edits), reverse=True):
            out = out[:start] + new + out[end:]
            print(f'{path.split("/")[-1]}')
            print(f'  - {old}')
            print(f'  + {new}')

        changed += 1
        if APPLY:
            open(path, 'w').write(out)

    print(f'\n{changed} page(s) {"updated" if APPLY else "would change"}')
    if not APPLY:
        print('dry run. Re-run with --apply')


if __name__ == '__main__':
    main()
