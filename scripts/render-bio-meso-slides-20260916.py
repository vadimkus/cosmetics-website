#!/usr/bin/env python3
"""Re-render the Bio Meso PDRN 60000 (product 60) gallery on the main-image canvas.

The 16 Sep 2026 main (`6000/main-v2.jpg`) is a 1600 px square on a flat white
field. The six gallery slides were 1200x896 with skin-tone, beige and clinic
backgrounds and baked-in type. This renders S1-S6 at 1600x1600 on the same
white, with one type system (Didot headlines to echo the BIO-MESO serif on the
carton, Avenir Next body), the GENOSYS logo, the `cutout/60-v2.webp` product
and the original photography kept as rounded insets.

Copy is carried over from the previous slides verbatim (claims already live);
only em dashes are replaced per house style.

  python3 scripts/render-bio-meso-slides-20260916.py
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public/images/6000"
OUT = SRC
W = H = 1600

BG = (251, 251, 251)
INK = "#323132"
MUTED = "#7a7577"
RED = "#a4262c"
LINE = (222, 218, 216)

AVENIR = "/System/Library/Fonts/Avenir Next.ttc"
DIDOT = "/System/Library/Fonts/Supplemental/Didot.ttc"


def sans(size: int, style: str = "regular") -> ImageFont.FreeTypeFont:
    indices = {"bold": 0, "demi": 2, "medium": 5, "regular": 7, "light": 10}
    return ImageFont.truetype(AVENIR, size, index=indices[style])


def serif(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(DIDOT, size, index=0)


F = {
    "h1": serif(118),
    "h1s": serif(100),
    "stat": serif(150),
    "eyebrow": sans(26, "demi"),
    "sub": sans(40, "light"),
    "body": sans(36, "light"),
    "body_demi": sans(34, "demi"),
    "small": sans(26, "regular"),
    "foot": sans(22, "regular"),
}

LOGO = Image.open(ROOT / "public/images/genosys-logo-transparent.png").convert("RGBA")
CUTOUT = Image.open(ROOT / "public/images/cutout/60-v2.webp").convert("RGBA")
CUTOUT = CUTOUT.crop(CUTOUT.getbbox())


def canvas() -> Image.Image:
    return Image.new("RGBA", (W, H), BG + (255,))


def logo(c: Image.Image, x=110, y=96, width=330) -> None:
    lg = ImageOps.contain(LOGO, (width, 200), Image.Resampling.LANCZOS)
    c.alpha_composite(lg, (x, y))


def tracked(d: ImageDraw.ImageDraw, xy, text: str, font, fill, spacing=6) -> int:
    x, y = xy
    for ch in text:
        d.text((x, y), ch, font=font, fill=fill)
        x += d.textlength(ch, font=font) + spacing
    return int(x)


def wrap(d: ImageDraw.ImageDraw, text: str, font, max_width: int) -> list[str]:
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if d.textlength(trial, font=font) <= max_width:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def paragraph(d, xy, text, font, fill, max_width, leading) -> int:
    x, y = xy
    for line in wrap(d, text, font, max_width):
        d.text((x, y), line, font=font, fill=fill)
        y += leading
    return y


def rule(d: ImageDraw.ImageDraw, x: int, y: int, width: int) -> None:
    d.line((x, y, x + width, y), fill=LINE, width=2)


def footer(c: Image.Image, n: int) -> None:
    d = ImageDraw.Draw(c)
    rule(d, 110, 1462, W - 220)
    d.text((110, 1492), "GENOSYS  ·  BIO-MESO PDRN EXPERT AMPOULE 60000", font=F["foot"], fill=MUTED)
    label = f"{n:02d} / 06"
    d.text((W - 110 - d.textlength(label, font=F["foot"]), 1492), label, font=F["foot"], fill=MUTED)


def place(c: Image.Image, asset: Image.Image, box, shadow=True) -> None:
    x0, y0, x1, y1 = box
    obj = ImageOps.contain(asset, (x1 - x0, y1 - y0), Image.Resampling.LANCZOS)
    x = x0 + (x1 - x0 - obj.width) // 2
    y = y0 + (y1 - y0 - obj.height) // 2
    if shadow:
        layer = Image.new("RGBA", c.size, (0, 0, 0, 0))
        ld = ImageDraw.Draw(layer)
        ld.ellipse(
            (x + obj.width * 0.1, y + obj.height * 0.9, x + obj.width * 0.9, y + obj.height * 1.02),
            fill=(40, 30, 30, 60),
        )
        c.alpha_composite(layer.filter(ImageFilter.GaussianBlur(28)))
    c.alpha_composite(obj, (x, y))


def inset(c: Image.Image, src: str, crop, box, radius=44, anchor=(0.5, 0.5)) -> None:
    """Crop a text-free region of an old slide and seat it as a rounded panel."""
    x0, y0, x1, y1 = box
    im = Image.open(SRC / src).convert("RGB").crop(crop)
    im = ImageOps.fit(im, (x1 - x0, y1 - y0), Image.Resampling.LANCZOS, centering=anchor)
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, im.width - 1, im.height - 1), radius=radius, fill=255)
    panel = im.convert("RGBA")
    panel.putalpha(mask)
    c.alpha_composite(panel, (x0, y0))


def slide_1() -> Image.Image:
    c = canvas()
    logo(c)
    d = ImageDraw.Draw(c)
    tracked(d, (110, 360), "PROFESSIONAL  ·  BIO-MESO PDRN", F["eyebrow"], RED)
    d.text((104, 420), "Skin that looks", font=F["h1"], fill=INK)
    d.text((104, 545), "younger.", font=F["h1"], fill=INK)
    d.text((104, 670), "No needles.", font=F["h1"], fill=RED)
    d.text((110, 840), "Real clinical results in 4 weeks.", font=F["sub"], fill=MUTED)
    # Face: the right half of the old S1, below the baked-in headline.
    inset(c, "S1.jpeg", (700, 165, 1200, 896), (800, 880, 1490, 1400), anchor=(0.5, 0.0))
    footer(c, 1)
    return c


def slide_2() -> Image.Image:
    c = canvas()
    logo(c)
    d = ImageDraw.Draw(c)
    tracked(d, (110, 360), "PROFESSIONAL  ·  BIO-MESO THERAPY", F["eyebrow"], RED)
    d.text((104, 420), "Bio Meso PDRN", font=F["h1"], fill=INK)
    d.text((104, 545), "Ampoule 60000", font=F["h1"], fill=INK)
    d.text((110, 700), "The treatment behind the numbers.", font=F["sub"], fill=MUTED)
    place(c, CUTOUT, (250, 800, 1350, 1420))
    footer(c, 2)
    return c


def slide_3() -> Image.Image:
    c = canvas()
    logo(c)
    d = ImageDraw.Draw(c)
    tracked(d, (110, 360), "PROFESSIONAL  ·  IN-CLINIC", F["eyebrow"], RED)
    d.text((104, 420), "How bio-meso", font=F["h1"], fill=INK)
    d.text((104, 545), "is applied.", font=F["h1"], fill=INK)
    d.text((110, 700), "Targeted PDRN dots. No needles.", font=F["sub"], fill=MUTED)
    # Syringe tip and the dotted cheek, below the label balloon of the old S3.
    inset(c, "S3.jpeg", (470, 400, 1200, 896), (110, 800, 1490, 1400), anchor=(0.6, 0.5))
    footer(c, 3)
    return c


def slide_4() -> Image.Image:
    c = canvas()
    logo(c)
    d = ImageDraw.Draw(c)
    tracked(d, (110, 360), "HOW IT WORKS", F["eyebrow"], RED)
    d.text((104, 420), "Needle-free skin", font=F["h1"], fill=INK)
    d.text((104, 545), "regeneration.", font=F["h1"], fill=INK)
    inset(c, "S4.jpeg", (250, 300, 950, 620), (110, 720, 1490, 1060), anchor=(0.5, 0.5))
    y = paragraph(
        d, (110, 1120),
        "Helps your skin repair itself from within, improving hydration, elasticity and overall skin quality.",
        F["body"], INK, 1380, 50,
    )
    d.text((110, y + 24), "Deeper absorption. No needles.", font=F["body_demi"], fill=RED)
    footer(c, 4)
    return c


def slide_5() -> Image.Image:
    c = canvas()
    logo(c)
    d = ImageDraw.Draw(c)
    tracked(d, (110, 360), "CLINICAL RESULTS  ·  4 WEEKS", F["eyebrow"], RED)
    d.text((104, 420), "The proof.", font=F["h1"], fill=INK)
    stats = [
        ("-7.45%", "periorbital wrinkles"),
        ("+19.86%", "skin elasticity"),
        ("+52.25%", "skin moisture"),
    ]
    y = 590
    for value, label in stats:
        d.text((104, y), value, font=F["stat"], fill=RED)
        d.text((110, y + 175), label, font=F["body"], fill=INK)
        y += 262
    d.text((110, 1385), "Clinically measured. In 4 weeks.", font=F["small"], fill=MUTED)
    # Carton from the cut-out, standing at the right.
    box_only = CUTOUT.crop((0, 0, int(CUTOUT.width * 0.44), CUTOUT.height))
    box_only = box_only.crop(box_only.getbbox())
    place(c, box_only, (1000, 560, 1500, 1400))
    footer(c, 5)
    return c


def slide_6() -> Image.Image:
    c = canvas()
    logo(c)
    d = ImageDraw.Draw(c)
    tracked(d, (110, 360), "YOUR NEXT STEP", F["eyebrow"], RED)
    d.text((104, 420), "Start your", font=F["h1"], fill=INK)
    d.text((104, 545), "PDRN ritual.", font=F["h1"], fill=RED)
    paragraph(
        d, (110, 720),
        "Clinically proven to improve hydration by 52%, increase elasticity and visibly reduce fine lines in just four weeks.",
        F["body"], INK, 760, 50,
    )
    d.text((110, 1000), "genosys.ae", font=F["body_demi"], fill=INK)
    d.text((110, 1050), "Professional use. Ask your GENOSYS clinic.", font=F["small"], fill=MUTED)
    # The four syringes only.
    syr = CUTOUT.crop((int(CUTOUT.width * 0.45), 0, CUTOUT.width, CUTOUT.height))
    syr = syr.crop(syr.getbbox())
    place(c, syr, (900, 620, 1500, 1400))
    footer(c, 6)
    return c


def main() -> None:
    slides = [slide_1(), slide_2(), slide_3(), slide_4(), slide_5(), slide_6()]
    for i, im in enumerate(slides, 1):
        path = OUT / f"S{i}-v2.jpeg"
        im.convert("RGB").save(path, "JPEG", quality=88, optimize=True, progressive=True)
        print(path.relative_to(ROOT), path.stat().st_size)
    sheet = Image.new("RGB", (1800, 1200), (128, 128, 128))
    for i, im in enumerate(slides):
        sheet.paste(im.convert("RGB").resize((600, 600), Image.Resampling.LANCZOS), ((i % 3) * 600, (i // 3) * 600))
    sheet.save("/tmp/bio-meso-slides-sheet.png")


if __name__ == "__main__":
    main()
