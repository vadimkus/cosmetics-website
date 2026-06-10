#!/usr/bin/env python3
"""Generate store-style badge images and QR codes for the price-list promo page.

Outputs (scripts/genosys_promo_assets/):
  badge_web.png / badge_ios.png / badge_android.png   -> rounded store-style buttons
  qr_web.png / qr_ios.png / qr_android.png            -> brand-green QR codes
"""
from pathlib import Path
import qrcode
from qrcode.constants import ERROR_CORRECT_M
from PIL import Image, ImageDraw, ImageFont

OUT = Path('/Users/vadimkus/cosmetics-website/scripts/genosys_promo_assets')
OUT.mkdir(parents=True, exist_ok=True)

WEB = 'https://genosys.ae'
IOS = 'https://apps.apple.com/ae/app/genosys-uae/id6756648064'
AND = 'https://play.google.com/store/apps/details?id=ae.genosys.app'

PRIMARY = (31, 58, 52)      # #1F3A34 deep clinical green
ANDROID = (26, 107, 60)     # #1A6B3C distinct green
BLACK = (17, 17, 17)        # #111111
GOLD = (182, 134, 44)       # #B6862C
WHITE = (255, 255, 255)
SUBT = (220, 228, 224)      # muted white for the small line

ARIAL = '/System/Library/Fonts/Supplemental/Arial.ttf'
ARIAL_B = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'

S = 4                       # supersample
W, H = 200 * S, 60 * S      # badge logical 200x60 -> ratio 3.33
R = int(H * 0.16)
ACCENT_H = int(H * 0.07)


def font(bold, px):
    return ImageFont.truetype(ARIAL_B if bold else ARIAL, int(px))


def rounded_mask(size, rad):
    m = Image.new('L', size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius=rad, fill=255)
    return m


def glyph_globe(d, box):
    x0, y0, x1, y1 = box
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    r = min(x1 - x0, y1 - y0) / 2
    sw = max(2, int(r * 0.13))
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=WHITE, width=sw)
    d.ellipse([cx - r * 0.5, cy - r, cx + r * 0.5, cy + r], outline=WHITE, width=sw)
    d.line([cx - r, cy, cx + r, cy], fill=WHITE, width=sw)
    d.line([cx - r * 0.86, cy - r * 0.5, cx + r * 0.86, cy - r * 0.5], fill=WHITE, width=sw)
    d.line([cx - r * 0.86, cy + r * 0.5, cx + r * 0.86, cy + r * 0.5], fill=WHITE, width=sw)


def glyph_play(d, box):
    x0, y0, x1, y1 = box
    w = x1 - x0
    cy = (y0 + y1) / 2
    h = (y1 - y0) * 0.92
    lx = x0 + w * 0.30
    d.polygon([(lx, cy - h / 2), (lx, cy + h / 2), (x0 + w * 0.92, cy)], fill=WHITE)


def glyph_apple(canvas, box):
    """Draw a clean apple silhouette into the badge via a hi-res mask."""
    x0, y0, x1, y1 = [int(v) for v in box]
    bw, bh = x1 - x0, y1 - y0
    sz = 600
    m = Image.new('L', (sz, sz), 0)
    d = ImageDraw.Draw(m)
    cx = sz / 2
    cy = sz * 0.60
    lobe = sz * 0.255
    off = sz * 0.165
    # two overlapping lobes -> apple body (twin bumps on top, round bottom)
    d.ellipse([cx - off - lobe, cy - lobe, cx - off + lobe, cy + lobe], fill=255)
    d.ellipse([cx + off - lobe, cy - lobe, cx + off + lobe, cy + lobe], fill=255)
    d.rectangle([cx - off, cy - lobe, cx + off, cy + lobe], fill=255)
    # round the bottom a touch
    d.ellipse([cx - lobe * 1.15, cy + lobe * 0.05, cx + lobe * 1.15, cy + lobe * 1.05], fill=255)
    # bite on the right
    br = sz * 0.15
    d.ellipse([cx + off + lobe - br * 1.1, cy - br, cx + off + lobe + br * 0.9, cy + br], fill=0)
    # top dimple between the bumps
    d.ellipse([cx - sz * 0.06, cy - lobe - sz * 0.05, cx + sz * 0.06, cy - lobe + sz * 0.07], fill=0)
    # leaf
    leaf = Image.new('L', (sz, sz), 0)
    ImageDraw.Draw(leaf).ellipse([cx, cy - lobe - sz * 0.20, cx + sz * 0.17, cy - lobe + sz * 0.02], fill=255)
    leaf = leaf.rotate(-28, center=(cx, cy - lobe))
    m = Image.composite(Image.new('L', (sz, sz), 255), m, leaf)
    # paste white apple via mask, fit to box (keep aspect)
    side = min(bw, bh)
    m = m.resize((side, side), Image.LANCZOS)
    white = Image.new('RGBA', (side, side), WHITE + (255,))
    canvas.paste(white, (x0 + (bw - side) // 2, y0 + (bh - side) // 2), m)


def badge(path, bg, top, main, glyph):
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, W - 1, H - 1], radius=R, fill=bg + (255,))
    d.rectangle([0, H - ACCENT_H, W, H], fill=GOLD + (255,))
    # glyph box on the left
    gsz = int(H * 0.56)
    gx = int(W * 0.085)
    gy = (H - ACCENT_H - gsz) // 2 + int(H * 0.02)
    gbox = (gx, gy, gx + gsz, gy + gsz)
    if glyph == 'globe':
        glyph_globe(d, gbox)
    elif glyph == 'play':
        glyph_play(d, gbox)
    elif glyph == 'apple':
        glyph_apple(img, gbox)
        d = ImageDraw.Draw(img)
    # text block
    tx = gx + gsz + int(W * 0.05)
    f_top = font(True, H * 0.17)
    f_main = font(True, H * 0.36)
    block_h = (H * 0.17) + (H * 0.36) + (H * 0.04)
    ty = (H - ACCENT_H - block_h) / 2
    d.text((tx, ty), top.upper(), font=f_top, fill=SUBT)
    d.text((tx, ty + H * 0.21), main, font=f_main, fill=WHITE)
    img.putalpha(rounded_mask((W, H), R))
    img = img.resize((W // S, H // S), Image.LANCZOS)
    img.save(path)


def make_qr(url, path, fg=PRIMARY):
    qr = qrcode.QRCode(border=2, box_size=16, error_correction=ERROR_CORRECT_M)
    qr.add_data(url)
    qr.make(fit=True)
    qr.make_image(fill_color=fg, back_color='white').convert('RGB').save(path)


def main():
    badge(OUT / 'badge_web.png', PRIMARY, 'Shop online at', 'genosys.ae', 'globe')
    badge(OUT / 'badge_ios.png', BLACK, 'Download on the', 'App Store', 'apple')
    badge(OUT / 'badge_android.png', ANDROID, 'Get it on', 'Google Play', 'play')
    make_qr(WEB, OUT / 'qr_web.png')
    make_qr(IOS, OUT / 'qr_ios.png')
    make_qr(AND, OUT / 'qr_android.png')
    print('promo assets written to', OUT)


if __name__ == '__main__':
    main()
