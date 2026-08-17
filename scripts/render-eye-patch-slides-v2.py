#!/usr/bin/env python3
"""Render the information-rich EyeCell carousel in the established GENOSYS style."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps


HOME = Path("/Users/vadimkus")
ASSETS = HOME / ".cursor/projects/Users-vadimkus-VisionDrive/assets"
PUBLIC = HOME / "cosmetics-website/public/images"
OUT = HOME / "Desktop/patches"
SELECTED_MODEL = HOME / "Desktop/Barrier/genosys-lady-face-for-hyper3d.png"
USER_FINAL_S3 = ASSETS / "s3-b39430de-8d62-419c-a1ef-3a05ecc07722.png"
W = H = 1024

INK = "#16151a"
TEXT = "#36323b"
MUTED = "#6e6873"
PLUM = "#755783"
ROSE = "#b28c9d"
PALE = "#f5f0f7"
LINE = "#c9bdcd"
WHITE = "#ffffff"

AVENIR = "/System/Library/Fonts/Avenir Next.ttc"
DIDOT = "/System/Library/Fonts/Supplemental/Didot.ttc"


def fnt(size: int, style: str = "regular") -> ImageFont.FreeTypeFont:
    indices = {"bold": 0, "demi": 2, "medium": 5, "regular": 7, "light": 10}
    return ImageFont.truetype(AVENIR, size, index=indices[style])


def serif(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(DIDOT, size, index=2 if bold else 0)


F = {
    "hero": fnt(62, "demi"),
    "hero_small": fnt(51, "demi"),
    "serif": serif(76),
    "serif_small": serif(64),
    "section": fnt(25, "demi"),
    "body": fnt(19, "regular"),
    "body_demi": fnt(19, "demi"),
    "small": fnt(16, "regular"),
    "small_demi": fnt(16, "demi"),
    "tiny": fnt(13, "regular"),
    "tiny_demi": fnt(13, "demi"),
    "number": fnt(23, "demi"),
}


def cover(path: Path, anchor=(0.5, 0.5)) -> Image.Image:
    return ImageOps.fit(
        Image.open(path).convert("RGB"),
        (W, H),
        method=Image.Resampling.LANCZOS,
        centering=anchor,
    )


def white_cutout(path: Path) -> Image.Image:
    src = Image.open(path).convert("RGB")
    mask = Image.new("L", src.size, 0)
    px, mp = src.load(), mask.load()
    for y in range(src.height):
        for x in range(src.width):
            r, g, b = px[x, y]
            whiteness = min(r, g, b)
            chroma = max(r, g, b) - min(r, g, b)
            mp[x, y] = max(0, min(255, int((248 - whiteness) * 18 + chroma * 2)))
    mask = mask.filter(ImageFilter.GaussianBlur(0.65))
    rgba = src.convert("RGBA")
    rgba.putalpha(mask)
    return rgba.crop(mask.getbbox())


JAR = white_cutout(PUBLIC / "Second/Patches_3.jpg")
SERUM = white_cutout(PUBLIC / "Second/SERUM_2.jpg")


def place(canvas: Image.Image, asset: Image.Image, box, shadow=True) -> None:
    x0, y0, x1, y1 = box
    obj = ImageOps.contain(asset, (x1 - x0, y1 - y0), Image.Resampling.LANCZOS)
    x = x0 + (x1 - x0 - obj.width) // 2
    y = y0 + (y1 - y0 - obj.height) // 2
    if shadow:
        layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
        ld = ImageDraw.Draw(layer)
        ld.ellipse(
            (x + obj.width * 0.12, y + obj.height * 0.84, x + obj.width * 0.88, y + obj.height),
            fill=(20, 12, 28, 95),
        )
        canvas.alpha_composite(layer.filter(ImageFilter.GaussianBlur(18)))
    canvas.alpha_composite(obj, (x, y))


def panel(canvas: Image.Image, box, fill=(255, 255, 255, 232), radius=24, outline=(255, 255, 255, 210)):
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=2)
    canvas.alpha_composite(layer)


def rule(draw: ImageDraw.ImageDraw, x: int, y: int, width: int, color=PLUM) -> None:
    draw.ellipse((x, y - 4, x + 8, y + 4), fill=color)
    draw.line((x + 8, y, x + width, y), fill=color, width=1)


def footer(draw: ImageDraw.ImageDraw, n: int, color=MUTED) -> None:
    draw.text((58, 976), "GENOSYS  ·  EYECELL", font=F["tiny"], fill=color)
    draw.text((946, 976), f"0{n}", font=F["tiny"], fill=color)


def circle(draw: ImageDraw.ImageDraw, cx: int, cy: int, r=27, color=PLUM, width=2):
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), outline=color, width=width)


def icon(draw: ImageDraw.ImageDraw, cx: int, cy: int, kind: str, r=27, color=PLUM):
    circle(draw, cx, cy, r, color)
    w = 2
    if kind == "patch":
        draw.arc((cx - 13, cy - 9, cx + 13, cy + 14), 30, 220, fill=color, width=w)
        draw.arc((cx - 7, cy - 5, cx + 16, cy + 10), 30, 220, fill=color, width=w)
    elif kind == "drop":
        pts = [(cx, cy - 14), (cx - 9, cy + 3), (cx - 7, cy + 11), (cx, cy + 15),
               (cx + 7, cy + 11), (cx + 9, cy + 3)]
        draw.line(pts + [pts[0]], fill=color, width=w, joint="curve")
    elif kind == "spark":
        draw.line((cx, cy - 14, cx, cy + 14), fill=color, width=w)
        draw.line((cx - 14, cy, cx + 14, cy), fill=color, width=w)
        draw.line((cx - 9, cy - 9, cx + 9, cy + 9), fill=color, width=1)
        draw.line((cx - 9, cy + 9, cx + 9, cy - 9), fill=color, width=1)
    elif kind == "clock":
        draw.ellipse((cx - 13, cy - 13, cx + 13, cy + 13), outline=color, width=w)
        draw.line((cx, cy, cx, cy - 8), fill=color, width=w)
        draw.line((cx, cy, cx + 7, cy + 5), fill=color, width=w)
    elif kind == "thermo":
        draw.rounded_rectangle((cx - 4, cy - 14, cx + 4, cy + 7), radius=4, outline=color, width=w)
        draw.ellipse((cx - 8, cy + 4, cx + 8, cy + 18), outline=color, width=w)
        draw.line((cx, cy - 9, cx, cy + 10), fill=color, width=w)
    elif kind == "fluid":
        for off in (-7, 0, 7):
            points = []
            for i in range(20):
                x = cx - 13 + i * 1.4
                y = cy + off + math.sin(i / 3) * 2
                points.append((x, y))
            draw.line(points, fill=color, width=w)
    elif kind == "snow":
        for angle in (0, 60, 120):
            rad = math.radians(angle)
            dx, dy = math.cos(rad) * 14, math.sin(rad) * 14
            draw.line((cx - dx, cy - dy, cx + dx, cy + dy), fill=color, width=w)
    elif kind == "line":
        for off in (-7, 0, 7):
            draw.arc((cx - 13, cy + off - 5, cx + 13, cy + off + 6), 190, 350, fill=color, width=w)
    elif kind == "eye":
        draw.arc((cx - 15, cy - 10, cx + 15, cy + 11), 195, 345, fill=color, width=w)
        draw.arc((cx - 15, cy - 6, cx + 15, cy + 15), 15, 165, fill=color, width=w)
        draw.ellipse((cx - 3, cy - 3, cx + 3, cy + 3), fill=color)
    elif kind == "puff":
        draw.arc((cx - 15, cy - 11, cx + 15, cy + 10), 195, 345, fill=color, width=w)
        draw.arc((cx - 10, cy + 1, cx + 10, cy + 14), 15, 165, fill=color, width=w)
    elif kind == "molecule":
        nodes = [(cx - 10, cy - 7), (cx + 8, cy - 11), (cx + 11, cy + 9), (cx - 7, cy + 11)]
        for a, b in zip(nodes, nodes[1:] + nodes[:1]):
            draw.line((*a, *b), fill=color, width=w)
        for x, y in nodes:
            draw.ellipse((x - 3, y - 3, x + 3, y + 3), outline=color, width=w)
    elif kind == "leaf":
        draw.ellipse((cx - 12, cy - 13, cx + 10, cy + 10), outline=color, width=w)
        draw.line((cx - 8, cy + 12, cx + 7, cy - 8), fill=color, width=w)
    elif kind == "collagen":
        for off in (-6, 2, 10):
            pts = [(cx - 13, cy + off), (cx - 5, cy + off - 4), (cx + 4, cy + off + 3), (cx + 13, cy + off - 2)]
            draw.line(pts, fill=color, width=w)
    elif kind == "cleanse":
        draw.rectangle((cx - 8, cy - 10, cx + 8, cy + 13), outline=color, width=w)
        draw.line((cx - 5, cy - 15, cx + 6, cy - 15), fill=color, width=w)
        draw.line((cx, cy - 15, cx, cy - 10), fill=color, width=w)
    elif kind == "place":
        draw.arc((cx - 15, cy - 7, cx + 15, cy + 11), 195, 345, fill=color, width=w)
        draw.arc((cx - 11, cy + 2, cx - 1, cy + 12), 20, 175, fill=color, width=w)
        draw.arc((cx + 1, cy + 2, cx + 11, cy + 12), 5, 160, fill=color, width=w)
    elif kind == "pat":
        draw.arc((cx - 10, cy - 13, cx + 10, cy + 12), 80, 280, fill=color, width=w)
        draw.line((cx - 12, cy + 7, cx + 6, cy + 14), fill=color, width=w)
    elif kind == "spoon":
        draw.ellipse((cx - 5, cy - 15, cx + 6, cy - 4), outline=color, width=w)
        draw.line((cx, cy - 4, cx, cy + 15), fill=color, width=w)
    elif kind == "jar":
        draw.rounded_rectangle((cx - 13, cy - 7, cx + 13, cy + 13), radius=3, outline=color, width=w)
        draw.line((cx - 11, cy - 12, cx + 11, cy - 12), fill=color, width=w)
        draw.line((cx - 13, cy - 7, cx + 13, cy - 7), fill=color, width=w)
    elif kind == "cart":
        draw.line((cx - 13, cy - 10, cx - 9, cy - 10, cx - 5, cy + 7, cx + 11, cy + 7), fill=color, width=w)
        draw.line((cx - 7, cy - 5, cx + 13, cy - 5, cx + 9, cy + 4, cx - 5, cy + 4), fill=color, width=w)
        draw.ellipse((cx - 5, cy + 10, cx - 1, cy + 14), fill=color)
        draw.ellipse((cx + 7, cy + 10, cx + 11, cy + 14), fill=color)


def numbered_icon(draw, x, y, number, kind):
    draw.ellipse((x, y - 15, x + 30, y + 15), outline=PLUM, width=2)
    draw.text((x + 6, y - 10), f"{number:02}", font=F["tiny_demi"], fill=PLUM)
    icon(draw, x + 70, y, kind, 24)


def hydrogel_patch(width=180, height=82, angle=0) -> Image.Image:
    """Create a clear crescent hydrogel patch with a subtle glossy edge."""
    mask = Image.new("L", (width, height), 0)
    md = ImageDraw.Draw(mask)
    md.ellipse((3, 4, width - 3, height - 4), fill=255)
    md.ellipse((15, -28, width - 14, height * 0.58), fill=0)
    mask = mask.filter(ImageFilter.GaussianBlur(1.2))

    patch = Image.new("RGBA", (width, height), (245, 249, 252, 0))
    patch.putalpha(mask.point(lambda value: int(value * 0.12)))

    edge = ImageChops.subtract(mask.filter(ImageFilter.MaxFilter(3)), mask.filter(ImageFilter.MinFilter(3)))
    edge_layer = Image.new("RGBA", (width, height), (255, 255, 255, 0))
    edge_layer.putalpha(edge.point(lambda value: min(58, value)))
    patch.alpha_composite(edge_layer)
    return patch.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)


def selected_model_background() -> Image.Image:
    """Crop Vadim's selected model to the right and apply visible hydrogel patches."""
    model = ImageOps.fit(
        Image.open(SELECTED_MODEL).convert("RGB"),
        (W, H),
        method=Image.Resampling.LANCZOS,
        centering=(0.0, 0.5),
    ).convert("RGBA")

    positions = [
        (hydrogel_patch(angle=-7), (560, 417)),
        (hydrogel_patch(angle=7), (817, 417)),
    ]
    for patch, (x, y) in positions:
        shadow = Image.new("RGBA", model.size, (0, 0, 0, 0))
        shadow.alpha_composite(patch, (x + 2, y + 5))
        shadow.putalpha(shadow.getchannel("A").filter(ImageFilter.GaussianBlur(6)).point(lambda value: value // 8))
        model.alpha_composite(shadow)
        model.alpha_composite(patch, (x, y))

    model.convert("RGB").save(ASSETS / "patches_s3_selected_model_bg.png", optimize=True)
    return model


def slide_1():
    original = cover(ASSETS / "patches_s1_bg.png")
    neutral = ImageEnhance.Color(original).enhance(0.06)
    neutral = ImageEnhance.Brightness(neutral).enhance(1.05)
    # Keep only a faint lilac reflection; the physical hydrogel remains clear/white.
    c = Image.blend(original, neutral, 0.78).convert("RGBA")
    veil = Image.new("RGBA", c.size, (255, 255, 255, 0))
    vd = ImageDraw.Draw(veil)
    vd.rectangle((0, 0, 560, H), fill=(255, 255, 255, 218))
    c.alpha_composite(veil.filter(ImageFilter.GaussianBlur(34)))
    place(c, JAR, (545, 475, 986, 880))
    d = ImageDraw.Draw(c)
    d.text((62, 70), "COOL. SOOTHE.", font=F["hero"], fill=INK)
    d.text((62, 128), "BRIGHTEN.", font=F["serif"], fill=PLUM)
    rule(d, 62, 220, 340)
    d.text((62, 252), "EYECELL EYE PEPTIDE GEL PATCH", font=F["section"], fill=INK)
    items = [
        ("patch", "THERMO-SENSITIVE HYDROGEL"),
        ("drop", "CALMING · MOISTURIZING EYE CONTOUR"),
        ("spark", "FINE LINES · DARK CIRCLES · EYE BAGS"),
        ("clock", "20–40 MINUTES · 60 PATCHES"),
    ]
    y = 330
    for kind, text in items:
        icon(d, 91, y, kind, 24)
        d.text((137, y - 10), text, font=F["small_demi"], fill=TEXT)
        y += 74
    d.rectangle((62, 660, 160, 714), outline=PLUM, width=1)
    d.text((82, 670), "101g", font=F["section"], fill=INK)
    d.text((62, 739), "E G P   P R O F E S S I O N A L", font=F["small_demi"], fill=INK)
    d.text((62, 775), "Made in Korea  ·  Dermatologically tested", font=F["small"], fill=MUTED)
    footer(d, 1)
    return c


def slide_2():
    c = cover(ASSETS / "patches_s2_bg.png").convert("RGBA")
    top = Image.new("RGBA", c.size, (0, 0, 0, 0))
    td = ImageDraw.Draw(top)
    td.rounded_rectangle((45, 42, 979, 205), radius=28, fill=(255, 255, 255, 230))
    c.alpha_composite(top)
    d = ImageDraw.Draw(c)
    d.text((78, 67), "HEAT", font=F["hero_small"], fill=INK)
    d.text((242, 67), "·", font=F["hero_small"], fill=PLUM)
    d.text((285, 67), "DELIVERY", font=F["hero_small"], fill=PLUM)
    d.text((550, 67), "·", font=F["hero_small"], fill=PLUM)
    d.text((594, 67), "COOL", font=F["hero_small"], fill=INK)
    rule(d, 78, 137, 620)
    d.text((78, 157), "HOW TEMPERATURE-SENSITIVE HYDROGEL WORKS", font=F["small_demi"], fill=MUTED)
    card_x = [50, 366, 682]
    data = [
        ("thermo", "01", "BODY HEAT", "Patch warms on skin"),
        ("fluid", "02", "FLUID STATE", "Closer contact · actives move"),
        ("snow", "03", "COOLING", "Moisture displaces heat"),
    ]
    d.line((180, 580, 844, 580), fill=PLUM, width=2)
    for x, (kind, no, title, desc) in zip(card_x, data):
        panel(c, (x, 395, x + 292, 790), fill=(255, 255, 255, 226), radius=23)
        d = ImageDraw.Draw(c)
        d.text((x + 126, 425), no, font=F["number"], fill=PLUM)
        d.line((x + 115, 462, x + 177, 462), fill=PLUM, width=1)
        icon(d, x + 146, 530, kind, 35)
        d.text((x + 52, 603), title, font=F["section"], fill=INK)
        # Center description by measuring it.
        tw = d.textbbox((0, 0), desc, font=F["small"])[2]
        d.text((x + (292 - tw) / 2, 653), desc, font=F["small"], fill=MUTED)
    panel(c, (205, 833, 819, 925), fill=(255, 255, 255, 225), radius=19)
    d = ImageDraw.Draw(c)
    icon(d, 248, 879, "patch", 23)
    d.text((286, 854), "PATENTED THERMO-SENSITIVE HYDROGEL", font=F["small_demi"], fill=INK)
    d.text((286, 885), "Improved adhesion · cooling moisture delivery", font=F["small"], fill=MUTED)
    footer(d, 2)
    return c


def slide_3():
    # Vadim's final retouch has the correct clear-gel refraction and wet gloss.
    if USER_FINAL_S3.exists():
        return Image.open(USER_FINAL_S3).convert("RGBA")
    c = selected_model_background()
    panel(c, (40, 40, 505, 944), fill=(255, 255, 255, 234), radius=30)
    d = ImageDraw.Draw(c)
    d.text((70, 78), "ONE PATCH.", font=F["hero_small"], fill=INK)
    d.text((70, 140), "FOUR TARGETS.", font=serif(51), fill=PLUM)
    rule(d, 70, 218, 325)
    d.text((70, 244), "COOLING CARE FOR THE EYE CONTOUR", font=F["small_demi"], fill=MUTED)
    targets = [
        ("line", "ANTI-WRINKLE", "Smoother-looking eye lines"),
        ("eye", "DARK CIRCLES", "Brighter, more rested look"),
        ("puff", "EYE BAGS", "Fresher, less puffy appearance"),
        ("drop", "MOISTURE", "Cooling comfort for dehydration"),
    ]
    y = 338
    for i, (kind, title, desc) in enumerate(targets, 1):
        numbered_icon(d, 70, y, i, kind)
        d.text((170, y - 18), title, font=F["body_demi"], fill=INK)
        d.text((170, y + 13), desc, font=F["small"], fill=MUTED)
        d.line((70, y + 49, 460, y + 49), fill=LINE, width=1)
        y += 123
    panel(c, (70, 842, 465, 909), fill=(245, 240, 247, 240), radius=16)
    d = ImageDraw.Draw(c)
    d.text((92, 857), "KFDA FUNCTIONAL COSMETIC", font=F["tiny_demi"], fill=PLUM)
    d.text((92, 881), "Brightening + wrinkle-care functions", font=F["small"], fill=TEXT)
    footer(d, 3)
    return c


def slide_4():
    c = cover(ASSETS / "patches_s4_bg.png").convert("RGBA")
    veil = Image.new("RGBA", c.size, (255, 255, 255, 0))
    vd = ImageDraw.Draw(veil)
    vd.rectangle((0, 0, 590, H), fill=(255, 255, 255, 230))
    c.alpha_composite(veil.filter(ImageFilter.GaussianBlur(22)))
    d = ImageDraw.Draw(c)
    d.text((58, 58), "INSIDE THE", font=F["hero_small"], fill=INK)
    d.text((58, 109), "PATCH", font=F["serif"], fill=PLUM)
    rule(d, 58, 199, 405)
    d.text((58, 225), "INTERTEK-VERIFIED FORMULA", font=F["small_demi"], fill=MUTED)
    actives = [
        ("molecule", "NIACINAMIDE 2%", "Brightens the look of dark circles"),
        ("spark", "ADENOSINE 0.04%", "Wrinkle-care functional active"),
        ("molecule", "ACETYL HEXAPEPTIDE-8 · 46.5 ppb", "Expression-line peptide"),
        ("leaf", "MADE WHITE™", "Madecassoside + Centella support"),
        ("collagen", "COLLAGEN · PANTHENOL · MULTI 12", "Plump feel · soothe · botanical comfort"),
    ]
    y = 318
    for i, (kind, title, desc) in enumerate(actives, 1):
        numbered_icon(d, 58, y, i, kind)
        title_font = F["small_demi"] if len(title) < 32 else F["tiny_demi"]
        d.text((157, y - 18), title, font=title_font, fill=INK)
        d.text((157, y + 12), desc, font=F["tiny"], fill=MUTED)
        d.line((58, y + 47, 555, y + 47), fill=LINE, width=1)
        y += 104
    panel(c, (58, 849, 555, 935), fill=(247, 243, 248, 238), radius=15)
    d = ImageDraw.Draw(c)
    icon(d, 97, 892, "molecule", 22)
    d.text((135, 869), "COA-VERIFIED ACTIVES", font=F["tiny_demi"], fill=PLUM)
    d.text((135, 894), "Niacinamide 2% · Adenosine 0.04%", font=F["small"], fill=INK)
    d.text((135, 916), "Dermatologically tested · Made in Korea", font=F["tiny"], fill=MUTED)
    footer(d, 4)
    return c


def slide_5():
    c = cover(ASSETS / "patches_s5_bg.png", anchor=(0.57, 0.48)).convert("RGBA")
    veil = Image.new("RGBA", c.size, (255, 255, 255, 0))
    vd = ImageDraw.Draw(veil)
    vd.rectangle((0, 0, 585, H), fill=(255, 255, 255, 223))
    c.alpha_composite(veil.filter(ImageFilter.GaussianBlur(20)))
    d = ImageDraw.Draw(c)
    d.text((58, 55), "YOUR", font=F["hero_small"], fill=INK)
    d.text((58, 102), "RITUAL", font=F["serif"], fill=PLUM)
    rule(d, 58, 192, 360)
    steps = [
        ("cleanse", "CLEANSE · TONE", "Prepare the eye contour"),
        ("place", "PLACE", "2 under eyes · optional +2 on brow bones"),
        ("clock", "WAIT", "Leave for 20–40 minutes"),
        ("pat", "FINISH", "Remove · pat in remaining essence"),
        ("spoon", "STORE", "Use spoon · seal lid completely"),
    ]
    y = 275
    d.line((90, y, 90, y + 4 * 104), fill=LINE, width=2)
    for i, (kind, title, desc) in enumerate(steps, 1):
        d.ellipse((72, y - 18, 108, y + 18), fill=WHITE, outline=PLUM, width=2)
        d.text((82, y - 12), str(i), font=F["small_demi"], fill=PLUM)
        icon(d, 149, y, kind, 25)
        d.text((190, y - 18), title, font=F["body_demi"], fill=INK)
        d.text((190, y + 13), desc, font=F["small"], fill=MUTED)
        y += 104
    # Perfect-pair card with exact product cutouts.
    panel(c, (575, 596, 978, 897), fill=(255, 255, 255, 235), radius=22, outline=(117, 87, 131, 150))
    d = ImageDraw.Draw(c)
    d.text((610, 625), "PERFECT PAIR", font=F["small_demi"], fill=PLUM)
    d.line((610, 653, 745, 653), fill=PLUM, width=1)
    place(c, JAR, (760, 660, 958, 822), shadow=False)
    place(c, SERUM, (620, 665, 760, 830), shadow=False)
    d = ImageDraw.Draw(c)
    d.text((610, 832), "PATCH 33 + EYE CONTOUR SERUM 17", font=F["tiny_demi"], fill=INK)
    d.text((610, 858), "Intensive patch days · serum daily", font=F["tiny"], fill=MUTED)
    icon(d, 80, 895, "clock", 22)
    d.text((118, 874), "20–40 MINUTES", font=F["small_demi"], fill=INK)
    d.text((118, 900), "101g · 60 patches · EGP PROFESSIONAL", font=F["small"], fill=MUTED)
    footer(d, 5)
    return c


def slide_6():
    c = cover(ASSETS / "patches_s6_bg.png").convert("RGBA")
    veil = Image.new("RGBA", c.size, (255, 255, 255, 0))
    vd = ImageDraw.Draw(veil)
    vd.rectangle((0, 0, 520, H), fill=(255, 255, 255, 204))
    c.alpha_composite(veil.filter(ImageFilter.GaussianBlur(28)))
    place(c, JAR, (485, 285, 975, 840))
    d = ImageDraw.Draw(c)
    d.text((62, 74), "EYE PEPTIDE", font=F["hero_small"], fill=INK)
    d.text((62, 125), "GEL PATCH", font=F["serif"], fill=PLUM)
    rule(d, 62, 220, 370)
    d.text((62, 250), "E G P   P R O F E S S I O N A L", font=F["small_demi"], fill=INK)
    claims = [
        ("patch", "THERMO-SENSITIVE HYDROGEL", "Cooling · calming · moisturizing"),
        ("spark", "BRIGHTENING + WRINKLE CARE", "Functional cosmetic for the eye contour"),
    ]
    y = 356
    for kind, title, desc in claims:
        icon(d, 92, y, kind, 29)
        d.text((143, y - 20), title, font=F["small_demi"], fill=INK)
        d.text((143, y + 10), desc, font=F["small"], fill=MUTED)
        y += 105
    d.rectangle((62, 587, 174, 644), outline=PLUM, width=1)
    d.text((82, 597), "101g", font=F["section"], fill=INK)
    icon(d, 92, 707, "spark", 25)
    d.text((135, 682), "60 PATCHES", font=F["body_demi"], fill=INK)
    d.text((135, 715), "Made in Korea", font=F["small"], fill=MUTED)
    d.text((135, 741), "Dermatologically tested", font=F["small"], fill=MUTED)
    rule(d, 62, 806, 390)
    icon(d, 92, 858, "cart", 25)
    d.text((135, 844), "SHOP GENOSYS.AE", font=F["body_demi"], fill=INK)
    d.text((135, 874), "Genosys UAE app", font=F["small"], fill=MUTED)
    footer(d, 6)
    return c


def save(slides):
    OUT.mkdir(parents=True, exist_ok=True)
    for i, im in enumerate(slides, 1):
        rgb = im.convert("RGB")
        rgb.save(OUT / f"s{i}.jpeg", quality=95, subsampling=0, optimize=True)
        if i == 1:
            rgb.save(OUT / "main.jpeg", quality=95, subsampling=0, optimize=True)
            rgb.save(OUT / "Main.png", optimize=True)
    sheet = Image.new("RGB", (1500, 1000), "#eee9f0")
    for i, im in enumerate(slides):
        sheet.paste(im.convert("RGB").resize((500, 500), Image.Resampling.LANCZOS), ((i % 3) * 500, (i // 3) * 500))
    sheet.save(OUT / "COMPARE_6_SLIDES.jpeg", quality=93, subsampling=0)


def main():
    slides = [slide_1(), slide_2(), slide_3(), slide_4(), slide_5(), slide_6()]
    save(slides)
    print(f"Rendered GENOSYS-style v2 set to {OUT}")


if __name__ == "__main__":
    main()
