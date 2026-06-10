#!/usr/bin/env python3
"""Extract GENOSYS product photos from the source workbook and normalize them
onto clean white backgrounds.

Strategy:
- Map each embedded image (Pictures column D) to its product source row
  (exact anchor match first, then the nearest orphan anchor within 3 rows).
- For photos with a UNIFORM studio background (low border colour variance) the
  background is flood-filled to white from the edges. This converts black/grey
  studio backdrops to white without eating the product interior.
- Full-bleed marketing posters / banners (non-uniform borders) are left as-is.
- Output square-ish thumbnails on a white canvas for even table rows.
"""
from pathlib import Path
import csv
import io

from openpyxl import load_workbook
from PIL import Image, ImageDraw, ImageStat

SRC = Path('/Users/vadimkus/Desktop/GENOSYS_UAE_PriceList_Clinics_2026.xlsx')
CSV_PATH = Path('/Users/vadimkus/cosmetics-website/docs/GENOSYS_UAE_PriceList_Clinics_2026_normalized.csv')
OUT = Path('/Users/vadimkus/cosmetics-website/scripts/genosys_product_images')
THUMB = 220                # output thumbnail max side
STD_THRESH = 34.0          # border colour std below this => uniform studio bg
PAD = 6                    # white padding around product in the final thumb


def get_bytes(im):
    try:
        d = im._data()
        return d() if callable(d) else d
    except Exception:
        try:
            return im.ref.getvalue()
        except Exception:
            return None


def _patch_mean(img, box):
    return ImageStat.Stat(img.crop(box)).mean[:3]


def _chdiff(a, b):
    return max(abs(a[0] - b[0]), abs(a[1] - b[1]), abs(a[2] - b[2]))


def whiten(img):
    """Flood-fill the background to white when 3+ corners agree on a colour.

    Robust to a tall product touching one edge (only one corner is "wrong").
    True multi-colour posters/banners (corners disagree) are left untouched.
    """
    img = img.convert('RGB')
    w, h = img.size
    ps = max(4, int(min(w, h) * 0.06))
    corner_boxes = {
        'tl': (0, 0, ps, ps), 'tr': (w - ps, 0, w, ps),
        'bl': (0, h - ps, ps, h), 'br': (w - ps, h - ps, w, h),
    }
    cmean = {k: _patch_mean(img, b) for k, b in corner_boxes.items()}
    TOL = 34
    best_keys, best_color = [], None
    for k, c in cmean.items():
        grp = [j for j, cj in cmean.items() if _chdiff(c, cj) < TOL]
        if len(grp) > len(best_keys):
            best_keys, best_color = grp, c
    if len(best_keys) < 3:
        return img, False  # poster / non-uniform background

    bg = [sum(cmean[k][i] for k in best_keys) / len(best_keys) for i in range(3)]
    brightness = sum(bg) / 3.0
    if brightness > 240 and _chdiff(bg, (255, 255, 255)) < 14:
        return img, False  # already clean white
    thresh = 80 if brightness < 90 else (62 if brightness < 170 else 48)

    corner_xy = {'tl': (1, 1), 'tr': (w - 2, 1), 'bl': (1, h - 2), 'br': (w - 2, h - 2)}
    seeds = [corner_xy[k] for k in best_keys]
    for mid in [(w // 2, 1), (w // 2, h - 2), (1, h // 2), (w - 2, h // 2)]:
        if _chdiff(img.getpixel(mid), bg) < TOL * 1.6:
            seeds.append(mid)
    for s in seeds:
        try:
            ImageDraw.floodfill(img, s, (255, 255, 255), thresh=thresh)
        except Exception:
            pass
    return img, True


def finalize(img):
    """Place the (whitened) image on a padded white square thumbnail."""
    img.thumbnail((THUMB - 2 * PAD, THUMB - 2 * PAD))
    canvas = Image.new('RGB', (img.width + 2 * PAD, img.height + 2 * PAD), (255, 255, 255))
    canvas.paste(img, (PAD, PAD))
    return canvas


def main():
    prod_rows = {}
    with CSV_PATH.open() as f:
        for r in csv.DictReader(f):
            prod_rows[int(r['row'])] = r['product']
    prod_set = set(prod_rows)

    wb = load_workbook(SRC)
    ws = wb.active
    anchor_imgs = {}
    for im in getattr(ws, '_images', []):
        try:
            r0, c0 = im.anchor._from.row, im.anchor._from.col
        except Exception:
            continue
        if c0 != 3:
            continue
        a = r0 + 1
        data = get_bytes(im)
        if not data:
            continue
        if a in anchor_imgs and len(data) <= anchor_imgs[a][1]:
            continue
        anchor_imgs[a] = (data, len(data))

    assign, consumed = {}, set()
    for p in prod_rows:
        if p in anchor_imgs:
            assign[p] = anchor_imgs[p][0]
            consumed.add(p)
    orphans = sorted(a for a in anchor_imgs if a not in prod_set)
    for p in sorted(prod_rows):
        if p in assign:
            continue
        cands = [a for a in orphans if a not in consumed and abs(a - p) <= 3]
        if not cands:
            continue
        cands.sort(key=lambda a: (abs(a - p), 0 if a > p else 1))
        a = cands[0]
        assign[p] = anchor_imgs[a][0]
        consumed.add(a)

    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob('row_*.png'):
        old.unlink()

    whitened = kept = 0
    for p, data in assign.items():
        try:
            img = Image.open(io.BytesIO(data))
            img, changed = whiten(img)
            finalize(img).save(OUT / f'row_{p}.png')
            whitened += int(changed)
            kept += int(not changed)
        except Exception as e:
            print('skip', p, e)
    print(f'mapped={len(assign)}/{len(prod_rows)}  whitened={whitened}  left_as_is={kept}')


if __name__ == '__main__':
    main()
