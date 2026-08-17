#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps


ROOT = Path("/Users/vadimkus")
ASSETS = ROOT / ".cursor/projects/Users-vadimkus-VisionDrive/assets"
PUBLIC = ROOT / "cosmetics-website/public/images"
OUT = ROOT / "Desktop/patches"

SIZE = 1024
INK = "#17151f"
MUTED = "#625f6e"
LILAC = "#8d73ae"
DEEP_LILAC = "#695080"
PALE = "#f5f0fa"
SILVER = "#b9b4c2"
WHITE = "#ffffff"


def font(size: int, weight: str = "regular") -> ImageFont.FreeTypeFont:
    candidates = {
        "regular": [
            "/System/Library/Fonts/SFNS.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
        ],
        "medium": [
            "/System/Library/Fonts/SFNS.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
        ],
        "semibold": [
            "/System/Library/Fonts/SFNS.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
        ],
        "bold": [
            "/System/Library/Fonts/SFNS.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
        ],
    }
    for path in candidates[weight]:
        if Path(path).exists():
            index = {"regular": 0, "medium": 1, "semibold": 2, "bold": 3}[weight]
            try:
                return ImageFont.truetype(path, size=size, index=index)
            except OSError:
                return ImageFont.truetype(path, size=size)
    return ImageFont.load_default()


F = {
    "eyebrow": font(18, "semibold"),
    "title": font(58, "bold"),
    "title_small": font(49, "bold"),
    "subtitle": font(27, "medium"),
    "body": font(23, "regular"),
    "body_bold": font(23, "semibold"),
    "small": font(18, "regular"),
    "small_bold": font(18, "semibold"),
    "tiny": font(14, "regular"),
    "number": font(34, "bold"),
}


def cover(path: Path, size: tuple[int, int] = (SIZE, SIZE), anchor=(0.5, 0.5)) -> Image.Image:
    im = Image.open(path).convert("RGB")
    return ImageOps.fit(im, size, method=Image.Resampling.LANCZOS, centering=anchor)


def rounded_panel(
    canvas: Image.Image,
    box: tuple[int, int, int, int],
    fill=(255, 255, 255, 218),
    radius=28,
    outline=(255, 255, 255, 160),
    blur=0,
) -> None:
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=2)
    if blur:
        layer = layer.filter(ImageFilter.GaussianBlur(blur))
    canvas.alpha_composite(layer)


def label(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, color=LILAC) -> None:
    x, y = xy
    draw.text((x, y), text.upper(), font=F["eyebrow"], fill=color)
    width = draw.textbbox((x, y), text.upper(), font=F["eyebrow"])[2] - x
    draw.rounded_rectangle((x, y + 28, x + min(width, 92), y + 32), radius=2, fill=color)


def wrap(draw: ImageDraw.ImageDraw, text: str, font_obj, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textbbox((0, 0), candidate, font=font_obj)[2] <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_lines(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    lines: Iterable[str],
    font_obj,
    fill,
    spacing=10,
) -> int:
    x, y = xy
    for line in lines:
        draw.text((x, y), line, font=font_obj, fill=fill)
        bbox = draw.textbbox((x, y), line, font=font_obj)
        y = bbox[3] + spacing
    return y


def product_cutout() -> Image.Image:
    src = Image.open(PUBLIC / "Second/Patches_3.jpg").convert("RGB")
    px = src.load()
    mask = Image.new("L", src.size, 0)
    mp = mask.load()
    for y in range(src.height):
        for x in range(src.width):
            r, g, b = px[x, y]
            # White studio background becomes transparent; preserve the glossy black pack.
            whiteness = min(r, g, b)
            chroma = max(r, g, b) - min(r, g, b)
            alpha = max(0, min(255, int((248 - whiteness) * 18 + chroma * 2)))
            mp[x, y] = alpha
    mask = mask.filter(ImageFilter.GaussianBlur(0.65))
    bbox = mask.getbbox()
    rgba = src.convert("RGBA")
    rgba.putalpha(mask)
    return rgba.crop(bbox)


PRODUCT = product_cutout()


def place_product(canvas: Image.Image, box: tuple[int, int, int, int], shadow=True) -> None:
    x0, y0, x1, y1 = box
    target = ImageOps.contain(PRODUCT, (x1 - x0, y1 - y0), Image.Resampling.LANCZOS)
    x = x0 + (x1 - x0 - target.width) // 2
    y = y0 + (y1 - y0 - target.height) // 2
    if shadow:
        sh = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
        sd = ImageDraw.Draw(sh)
        sd.ellipse((x + target.width * 0.12, y + target.height * 0.82,
                    x + target.width * 0.88, y + target.height * 1.02),
                   fill=(30, 20, 45, 105))
        sh = sh.filter(ImageFilter.GaussianBlur(20))
        canvas.alpha_composite(sh)
    canvas.alpha_composite(target, (x, y))


def brand_footer(draw: ImageDraw.ImageDraw, slide_no: int, inverse=False) -> None:
    color = WHITE if inverse else MUTED
    draw.text((60, 973), "GENOSYS  ·  EYECELL", font=F["tiny"], fill=color)
    n = f"0{slide_no}"
    box = draw.textbbox((0, 0), n, font=F["tiny"])
    draw.text((964 - (box[2] - box[0]), 973), n, font=F["tiny"], fill=color)


def slide_1() -> Image.Image:
    c = cover(ASSETS / "patches_s1_bg.png").convert("RGBA")
    veil = Image.new("RGBA", c.size, (255, 255, 255, 0))
    vd = ImageDraw.Draw(veil)
    vd.rectangle((0, 0, 560, SIZE), fill=(255, 255, 255, 190))
    veil = veil.filter(ImageFilter.GaussianBlur(45))
    c.alpha_composite(veil)
    place_product(c, (570, 485, 965, 860))
    d = ImageDraw.Draw(c)
    label(d, (60, 65), "THERMO-SENSITIVE EYE CARE")
    y = draw_lines(d, (60, 125), ["EYE CONTOUR,", "RESET."], F["title"], INK, 0)
    d.text((60, y + 23), "Cooling hydrogel care that moves with skin.", font=F["subtitle"], fill=MUTED)
    rounded_panel(c, (60, 435, 495, 708), fill=(255, 255, 255, 205))
    d = ImageDraw.Draw(c)
    bullets = [
        ("60", "CRESCENT PATCHES"),
        ("20–40", "MINUTES"),
        ("2", "VERIFIED ACTIVES"),
    ]
    by = 468
    for value, desc in bullets:
        d.text((92, by), value, font=F["number"], fill=DEEP_LILAC)
        d.text((230, by + 7), desc, font=F["small_bold"], fill=INK)
        by += 72
    d.text((60, 752), "EyeCell EYE PEPTIDE GEL PATCH", font=F["body_bold"], fill=INK)
    d.text((60, 787), "101g  ·  EGP PROFESSIONAL  ·  MADE IN KOREA", font=F["small"], fill=MUTED)
    brand_footer(d, 1)
    return c


def slide_2() -> Image.Image:
    c = cover(ASSETS / "patches_s2_bg.png").convert("RGBA")
    d = ImageDraw.Draw(c)
    # Dark translucent header creates hierarchy without hiding the three states.
    rounded_panel(c, (42, 38, 982, 215), fill=(27, 22, 38, 218), radius=28)
    d = ImageDraw.Draw(c)
    d.text((72, 68), "THE PATCH THAT", font=F["title_small"], fill=WHITE)
    d.text((72, 122), "CHANGES WITH YOU.", font=F["title_small"], fill=WHITE)
    d.text((72, 181), "Patented temperature-sensitive hydrogel", font=F["small"], fill="#ddd3eb")
    cards = [
        (45, "01", "WARM", "Body heat activates\nthe hydrogel."),
        (365, "02", "FLUID", "Hydrogel becomes fluid\nfor closer contact."),
        (685, "03", "COOL", "Moisture leaves a\nfresh cooling feel."),
    ]
    for x, no, title, body in cards:
        rounded_panel(c, (x, 708, x + 292, 934), fill=(255, 255, 255, 220), radius=24)
        d = ImageDraw.Draw(c)
        d.text((x + 26, 735), no, font=F["small_bold"], fill=LILAC)
        d.text((x + 26, 774), title, font=F["subtitle"], fill=INK)
        draw_lines(d, (x + 26, 820), body.split("\n"), F["small"], MUTED, 4)
    brand_footer(d, 2)
    return c


def slide_3() -> Image.Image:
    c = cover(ASSETS / "patches_s3_european_bg.png").convert("RGBA")
    rounded_panel(c, (42, 42, 485, 940), fill=(255, 255, 255, 226), radius=34)
    d = ImageDraw.Draw(c)
    label(d, (72, 78), "MULTI-CONCERN EYE CARE")
    y = draw_lines(d, (72, 142), ["4 SIGNS.", "ONE COOLING", "RITUAL."], F["title_small"], INK, 0)
    concerns = [
        ("01", "FINE LINES", "Smoother-looking eye contour"),
        ("02", "DARK CIRCLES", "Brighter, more rested look"),
        ("03", "EYE BAGS", "Fresh, less puffy appearance"),
        ("04", "DEHYDRATION", "Cooling moisture and comfort"),
    ]
    y += 38
    for no, title, desc in concerns:
        d.ellipse((72, y + 3, 108, y + 39), fill=PALE, outline="#d8c9e7", width=2)
        d.text((80, y + 9), no, font=F["tiny"], fill=DEEP_LILAC)
        d.text((126, y), title, font=F["small_bold"], fill=INK)
        d.text((126, y + 29), desc, font=F["tiny"], fill=MUTED)
        y += 87
    d.text((72, 872), "Brightening + wrinkle-care functional cosmetic", font=F["tiny"], fill=MUTED)
    brand_footer(d, 3)
    return c


def slide_4() -> Image.Image:
    c = cover(ASSETS / "patches_s4_bg.png").convert("RGBA")
    veil = Image.new("RGBA", c.size, (255, 255, 255, 0))
    vd = ImageDraw.Draw(veil)
    vd.rectangle((0, 0, 575, SIZE), fill=(255, 255, 255, 226))
    veil = veil.filter(ImageFilter.GaussianBlur(25))
    c.alpha_composite(veil)
    d = ImageDraw.Draw(c)
    label(d, (60, 65), "INTERTEK-VERIFIED FORMULA")
    draw_lines(d, (60, 125), ["WHAT'S INSIDE.", "VERIFIED."], F["title_small"], INK, 2)
    ingredients = [
        ("2%", "NIACINAMIDE", "Brightens the look of dark circles"),
        ("0.04%", "ADENOSINE", "Wrinkle-care functional active"),
        ("46.5 ppb", "ACETYL HEXAPEPTIDE-8", "Expression-line peptide"),
        ("MADE WHITE™", "MADECASSOSIDE + CENTELLA", "Soft brightening and soothing support"),
        ("MULTI 12", "BOTANICAL COMPLEX", "Comfort · moisture · antioxidant support"),
    ]
    y = 300
    for value, name, desc in ingredients:
        value_font = F["small_bold"] if len(value) > 8 else F["body_bold"]
        d.text((60, y), value, font=value_font, fill=DEEP_LILAC)
        d.text((240, y + 2), name, font=F["small_bold"], fill=INK)
        d.text((240, y + 31), desc, font=F["tiny"], fill=MUTED)
        d.line((60, y + 62, 535, y + 62), fill=(195, 185, 207, 140), width=1)
        y += 91
    d.text((60, 795), "Niacinamide + Adenosine verified by COA.", font=F["small_bold"], fill=INK)
    d.text((60, 828), "Dermatologically tested · Made in Korea", font=F["small"], fill=MUTED)
    brand_footer(d, 4)
    return c


def slide_5() -> Image.Image:
    # Crop the 3:4 generated art into the square format used by the existing carousel.
    c = cover(ASSETS / "patches_s5_bg.png", anchor=(0.56, 0.48)).convert("RGBA")
    rounded_panel(c, (42, 42, 540, 948), fill=(255, 255, 255, 229), radius=34)
    d = ImageDraw.Draw(c)
    label(d, (72, 78), "YOUR EYE RITUAL")
    draw_lines(d, (72, 142), ["20–40 MINUTES", "TO A FRESHER", "LOOK."], F["title_small"], INK, 0)
    steps = [
        ("01", "PREP", "Cleanse and tone."),
        ("02", "PLACE", "Two under eyes; optional +2\nat brow bones."),
        ("03", "WAIT", "Leave for 20–40 minutes."),
        ("04", "FINISH", "Remove and pat in residue."),
    ]
    y = 335
    for no, title, desc in steps:
        d.rounded_rectangle((72, y, 120, y + 48), radius=14, fill=PALE)
        d.text((84, y + 12), no, font=F["tiny"], fill=DEEP_LILAC)
        d.text((140, y), title, font=F["small_bold"], fill=INK)
        draw_lines(d, (140, y + 28), desc.split("\n"), F["small"], MUTED, 2)
        y += 91
    rounded_panel(c, (72, 724, 510, 888), fill=(239, 231, 247, 235), radius=22)
    d = ImageDraw.Draw(c)
    d.text((96, 750), "PERFECT PAIR", font=F["eyebrow"], fill=DEEP_LILAC)
    d.text((96, 790), "Patch + Eye Contour Serum", font=F["body_bold"], fill=INK)
    d.text((96, 827), "Intensive patch days · serum daily", font=F["small"], fill=MUTED)
    d.text((72, 905), "Use the spoon provided · seal the lid after use", font=F["tiny"], fill=MUTED)
    brand_footer(d, 5)
    return c


def slide_6() -> Image.Image:
    c = cover(ASSETS / "patches_s6_bg.png").convert("RGBA")
    place_product(c, (270, 365, 754, 760))
    d = ImageDraw.Draw(c)
    label(d, (60, 54), "EYECELL PROFESSIONAL")
    title = "A COOLER WAY TO\nCARE FOR EYES."
    draw_lines(d, (60, 112), title.split("\n"), F["title_small"], INK, 0)
    d.text((60, 229), "Thermo-sensitive hydrogel · cooling · moisturizing", font=F["body"], fill=MUTED)
    rounded_panel(c, (290, 782, 734, 917), fill=(255, 255, 255, 215), radius=25)
    d = ImageDraw.Draw(c)
    product_name = "EYE PEPTIDE GEL PATCH"
    bbox = d.textbbox((0, 0), product_name, font=F["body_bold"])
    d.text(((SIZE - (bbox[2] - bbox[0])) / 2, 807), product_name, font=F["body_bold"], fill=INK)
    meta = "101g · 60 PATCHES · MADE IN KOREA"
    bbox = d.textbbox((0, 0), meta, font=F["small"])
    d.text(((SIZE - (bbox[2] - bbox[0])) / 2, 850), meta, font=F["small"], fill=MUTED)
    d.text((414, 885), "SHOP GENOSYS.AE", font=F["tiny"], fill=DEEP_LILAC)
    brand_footer(d, 6)
    return c


def save_slide(im: Image.Image, n: int) -> None:
    rgb = im.convert("RGB")
    rgb.save(OUT / f"s{n}.jpeg", quality=94, subsampling=0, optimize=True)
    if n == 1:
        rgb.save(OUT / "main.jpeg", quality=94, subsampling=0, optimize=True)
        rgb.save(OUT / "Main.png", optimize=True)


def comparison(slides: list[Image.Image]) -> None:
    thumb = 500
    sheet = Image.new("RGB", (thumb * 3, thumb * 2), "#eeeaf2")
    for i, slide in enumerate(slides):
        t = slide.convert("RGB").resize((thumb, thumb), Image.Resampling.LANCZOS)
        sheet.paste(t, ((i % 3) * thumb, (i // 3) * thumb))
    sheet.save(OUT / "COMPARE_6_SLIDES.jpeg", quality=92, subsampling=0)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    slides = [slide_1(), slide_2(), slide_3(), slide_4(), slide_5(), slide_6()]
    for idx, slide in enumerate(slides, start=1):
        save_slide(slide, idx)
    comparison(slides)
    print(f"Rendered {len(slides)} slides to {OUT}")


if __name__ == "__main__":
    main()
