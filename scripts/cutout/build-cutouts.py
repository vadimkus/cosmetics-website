#!/usr/bin/env python3
"""
Builds a transparent cut-out of every product packshot.

WHY. The bespoke pages seat the packshot on a tinted panel whose colour is
hand-picked per page to match that shot's studio sweep. The sweeps are not
consistent - measured backgrounds run from rgb(184) to pure white - so on ten of
the fifteen measurable pages the photograph reads as a rectangle stamped on the
panel. A cut-out has no background to match, so the seam cannot exist, and the
same file works on any panel we paint later.

WHAT IT DOES. Vision's foreground mask (RemoveBackground.swift) removes the
sweep, then the frame is normalised: trim to the silhouette and re-pad to a
square with a fixed margin, so a tall bottle and a wide jar occupy the same
share of their stage instead of each being sized by whatever the photographer
framed. Output is WebP with alpha, which is roughly a third the weight of PNG
at the same quality.

No shadow is baked in. The contact shadow is a CSS drop-shadow that follows the
silhouette, which beats a generic ellipse and stays adjustable.

Originals are never touched: cut-outs land in public/images/cutout/ under the
product number, and every surface falls back to the original photograph when a
cut-out is missing.

  python3 scripts/cutout/build-cutouts.py                 # all products
  python3 scripts/cutout/build-cutouts.py 51 64           # selected products
"""

import json
import os
import subprocess
import sys
import tempfile
import time

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CUTOUT_TOOL = "/tmp/cutout"
SWIFT_SOURCE = os.path.join(ROOT, "scripts", "cutout", "RemoveBackground.swift")
OUT_DIR = os.path.join(ROOT, "public", "images", "cutout")
MANIFEST = os.path.join(ROOT, "scripts", "cutout", "cutout-report.json")

# Share of the square left empty around the silhouette. 7% reads as breathing
# room without shrinking the product on a small stage.
MARGIN = 0.07
MAX_EDGE = 1200
WEBP_QUALITY = 86

# Where the product meets the floor, as a share of the source image height.
#
# A few packshots are lit on a glossy surface, so the product has a mirror
# reflection under it. Vision reads that reflection as more product and keeps a
# torn piece of it, which renders as debris hanging off the bottom of the
# packshot. Worse, the frame is trimmed to the silhouette afterwards, so the
# debris drags the bounding box down and pushes the product off-centre.
#
# The reflection cannot be told from the product by shape - it is the product -
# so this is measured per photograph rather than detected. Read it off the shot
# with a horizontal rule at the contact edge; everything below is reflection.
FLOOR = {
    # Box and tube stand on the same glossy floor at 88.8% of frame height.
    "65": 0.888,
    # Both bottles stand on the same glossy floor; their contact edges read as a
    # dark hairline at 86.44% and 86.36% of frame height. Vision tore the large
    # bottle's reflection away but kept the small one's whole, which rendered as
    # a second, upside-down bottle hanging under it.
    "66": 0.866,
    # Two tubes on the same glossy floor, the small one in front. Vision tore the
    # rear tube's reflection away but kept the front one's whole, so the packshot
    # carried a pale upside-down cap hanging under it, ending in a flat cut where
    # the mask ran out. Invisible on the original white sweep; plainly visible
    # once the closing band was tinted.
    #
    # The two contact edges differ because the rear tube stands further back: it
    # meets the floor at 83.59% of frame height, the front tube at 91.60%. The
    # rule has to be the front one, the lower of the two, or it would cut through
    # the tube it is meant to keep. Measured by mirror symmetry about the contact
    # line, which is what a reflection is: r=0.82 for the front tube.
    "32": 0.916,
}

# Regions Vision drops that are part of the product, as fractions of the source
# frame: (x0, y0, x1, y1).
#
# Only for shapes we can reconstruct exactly rather than guess at. A straight
# carton edge qualifies; a bottle's curve does not.
REPAIR = {
    # The carton's lower panel. White board against a white floor leaves almost
    # no gradient to find - contrast across the box edge falls from 89 to 33
    # between 75% and 88% of frame height - so Vision tears the bottom off the
    # box. The carton is square-on with vertical sides, measured in the
    # photograph at x=0.185 and x=0.473 and holding to within a pixel all the
    # way down to the floor, so the missing panel is restored, not invented.
    "65": [(0.1850, 0.7400, 0.4737, 0.8880)],
}

# Secondary subjects Vision drops when it locks onto the largest object.
#
# Each entry is (x0, y0, x1, y1, mode) in frame fractions. "vision" runs the
# segmenter again on just that crop, so a second product standing beside the
# first is traced on its own terms. "keywhite" keeps every pixel darker than
# the paper, for flat type such as a quantity mark, which no segmenter treats
# as a subject. The result is merged over the main cut-out.
PARTS = {
    # Closed box with one vial and an "x10" mark beside it. Vision keeps the
    # box and discards both the vial and the mark.
    "7": [
        (0.740, 0.280, 0.970, 0.790, "vision"),
        (0.735, 0.800, 0.925, 0.900, "keywhite"),
    ],
}

# Bumped whenever a cut-out's pixels change.
#
# public/images is served with a one-year immutable cache, so a file rewritten
# under its old name never reaches anyone who has already loaded the page. A new
# revision means a new URL.
REVISION = {
    "65": 2,
    "66": 2,
    # New campaign packshot: two tubes rather than the single one the first
    # cut-out was traced from. A new number, because /images/* is served
    # immutable for a year and anyone who has seen the old file keeps it.
    "28": 2,
    # New campaign packshot, traced from a different frame than the original.
    "42": 2,
    # New campaign packshot: the 1kg pouch square on white, where the previous
    # source was a lifestyle frame with a powder dish beside it.
    "35": 2,
    # The front tube's floor reflection is no longer kept as part of the product.
    "32": 2,
    # New campaign packshot: the 20 g and 100 g tubes together on white, where
    # the previous source was the older single-tube shot.
    "25": 2,
    # New campaign packshot: the bottle square on white, replacing the single
    # legacy shot this page had been running on.
    "23": 2,
    # New campaign packshot: the tube square on white, replacing the shot the
    # page had run on since July.
    "34": 2,
    # New campaign packshot: both bottles square on white, replacing the
    # August main_clean render.
    "10": 2,
    # New campaign packshot: closed box and vial on white, replacing the
    # squared studio-sweep shot.
    "7": 2,
    # New campaign packshot: the pump bottle square on white, replacing the
    # earlier shampoo/Main.jpg render.
    "44": 2,
}


def output_name(number):
    revision = REVISION.get(number, 1)
    return f"{number}.webp" if revision == 1 else f"{number}-v{revision}.webp"


def ensure_tool():
    if os.path.exists(CUTOUT_TOOL):
        return
    subprocess.run(
        ["swiftc", "-O", SWIFT_SOURCE, "-o", CUTOUT_TOOL],
        check=True,
    )


def assemble(png_path, source_path, rects):
    """Vision's cut-out with any `rects` restored from the original photograph.

    Vision writes transparent black, not transparent colour, so a torn region
    has no pixels left to re-expose. The patch is taken from the source frame.
    """
    im = Image.open(png_path).convert("RGBA")
    if not rects:
        return im

    source = Image.open(source_path).convert("RGB")
    if source.size != im.size:
        source = source.resize(im.size, Image.LANCZOS)

    for x0, y0, x1, y1 in rects:
        box = (
            int(round(im.width * x0)),
            int(round(im.height * y0)),
            int(round(im.width * x1)),
            int(round(im.height * y1)),
        )
        patch = source.crop(box).convert("RGBA")
        im.paste(patch, box[:2])
    return im


def add_parts(im, source_path, parts):
    """Merge secondary subjects (see PARTS) into Vision's main cut-out."""
    if not parts:
        return im
    source = Image.open(source_path).convert("RGB")
    if source.size != im.size:
        source = source.resize(im.size, Image.LANCZOS)
    for x0, y0, x1, y1, mode in parts:
        box = (
            int(round(im.width * x0)),
            int(round(im.height * y0)),
            int(round(im.width * x1)),
            int(round(im.height * y1)),
        )
        crop = source.crop(box)
        if mode == "vision":
            with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as src_tmp, \
                 tempfile.NamedTemporaryFile(suffix=".png", delete=False) as out_tmp:
                crop.save(src_tmp.name, "PNG")
                result = subprocess.run(
                    [CUTOUT_TOOL, src_tmp.name, out_tmp.name], capture_output=True, text=True
                )
                if result.returncode != 0:
                    raise RuntimeError(f"part segmentation failed: {result.stderr.strip()[:200]}")
                part = Image.open(out_tmp.name).convert("RGBA")
            os.unlink(src_tmp.name)
            os.unlink(out_tmp.name)
        elif mode == "keywhite":
            grey = crop.convert("L")
            # Full opacity below 200, fading to none at the paper tone, so
            # anti-aliased type edges stay soft instead of jagged.
            alpha = grey.point(lambda v: 255 if v < 200 else max(0, int(255 * (240 - v) / 40)))
            part = crop.convert("RGBA")
            part.putalpha(alpha)
        else:
            raise ValueError(f"unknown part mode {mode}")
        im.alpha_composite(part, box[:2])
    return im


def normalize(im, floor=None):
    """Trim to the silhouette, then centre it on a square with a fixed margin.

    `floor` clears the mask below the contact line before trimming, so a kept
    reflection is gone before it can influence the crop.
    """
    im = im.copy()

    if floor is not None:
        cut = int(round(im.height * floor))
        below = Image.new("RGBA", (im.width, im.height - cut), (0, 0, 0, 0))
        im.paste(below, (0, cut))

    bbox = im.getbbox()
    if not bbox:
        raise ValueError("cut-out is fully transparent")
    product = im.crop(bbox)

    edge = max(product.size)
    canvas_edge = int(round(edge / (1 - 2 * MARGIN)))
    canvas = Image.new("RGBA", (canvas_edge, canvas_edge), (0, 0, 0, 0))
    canvas.paste(
        product,
        ((canvas_edge - product.width) // 2, (canvas_edge - product.height) // 2),
    )

    if canvas_edge > MAX_EDGE:
        canvas = canvas.resize((MAX_EDGE, MAX_EDGE), Image.LANCZOS)
    return canvas


def coverage(image):
    """Share of pixels that are meaningfully opaque, as a sanity check.

    A mask that ate the product leaves almost nothing behind, and a mask that
    kept the sweep leaves almost everything. Both need a human to look.
    """
    alpha = image.getchannel("A")
    opaque = sum(count for value, count in enumerate(alpha.histogram()) if value > 24)
    return opaque / float(image.width * image.height)


PRODUCTS_JSON = "/tmp/imgs.json"
PRODUCTS_EXPORT = (
    "npx tsx --env-file=.env.local -e \""
    "import { prisma } from './lib/prisma';"
    "import { writeFileSync } from 'fs';"
    "(async () => {"
    "  const rows = await prisma.product.findMany({"
    "    select: { productNumber: true, name: true, image: true, images: true },"
    "    orderBy: { productNumber: 'asc' } });"
    "  writeFileSync('/tmp/imgs.json', JSON.stringify(rows, null, 2));"
    "  await prisma.\\$disconnect(); })();\""
)


def load_products():
    """The catalogue, exported from the database beforehand.

    This lives in /tmp, which makes it easy to reuse a stale copy without
    noticing. That is not hypothetical: product 28's packshot was replaced, this
    ran against the previous day's export, and it rebuilt a cut-out of the
    *old* photograph and reported success. Nothing in the output said otherwise.

    So: refuse an export older than an hour, and print the source for every
    product it builds, so the file being traced is visible rather than assumed.
    """
    if not os.path.exists(PRODUCTS_JSON):
        sys.exit(
            f"{PRODUCTS_JSON} is missing. Export the catalogue first:\n\n"
            f"  {PRODUCTS_EXPORT}\n"
        )

    age = time.time() - os.path.getmtime(PRODUCTS_JSON)
    if age > 3600:
        sys.exit(
            f"{PRODUCTS_JSON} is {int(age / 60)} minutes old, so it may not have the\n"
            "packshot you just changed. Re-export it:\n\n"
            f"  {PRODUCTS_EXPORT}\n"
        )

    with open(PRODUCTS_JSON) as handle:
        return json.load(handle)


def main():
    ensure_tool()
    os.makedirs(OUT_DIR, exist_ok=True)

    products = load_products()
    wanted = set(sys.argv[1:])

    # Building a subset must not drop the rest of the catalogue from the report,
    # or the manifest written from it shrinks to whatever was rebuilt last.
    previous = {}
    if wanted and os.path.exists(MANIFEST):
        with open(MANIFEST) as handle:
            previous = {row["product"]: row for row in json.load(handle)}

    report = []

    for row in products:
        number = str(row["productNumber"])
        if wanted and number not in wanted:
            if number in previous:
                report.append(previous[number])
            continue

        source = row.get("image") or ""
        print(f"  {number:>3}  {source}")
        disk = os.path.join(ROOT, "public", source.lstrip("/"))
        if not source or not os.path.exists(disk):
            report.append({"product": number, "status": "missing-source", "source": source})
            continue

        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
            raw = tmp.name
        try:
            result = subprocess.run(
                [CUTOUT_TOOL, disk, raw], capture_output=True, text=True
            )
            if result.returncode != 0:
                report.append({
                    "product": number,
                    "status": "vision-failed",
                    "source": source,
                    "detail": result.stderr.strip()[:200],
                })
                continue

            canvas = normalize(
                add_parts(assemble(raw, disk, REPAIR.get(number)), disk, PARTS.get(number)),
                FLOOR.get(number),
            )
            share = coverage(canvas)
            filename = output_name(number)
            out = os.path.join(OUT_DIR, filename)
            canvas.save(out, "WEBP", quality=WEBP_QUALITY, method=6)

            report.append({
                "product": number,
                "status": "ok",
                "source": source,
                "file": f"/images/cutout/{filename}",
                "name": row.get("name"),
                "coverage": round(share, 3),
                "bytes": os.path.getsize(out),
                # Flagged for review rather than dropped: the threshold is a
                # smell test, not a verdict, and a flat box shot legitimately
                # fills most of the frame.
                "review": share < 0.05 or share > 0.85,
            })
        finally:
            os.unlink(raw)

    with open(MANIFEST, "w") as handle:
        json.dump(report, handle, indent=2)

    ok = [r for r in report if r["status"] == "ok"]
    flagged = [r for r in ok if r["review"]]
    print(f"built {len(ok)} of {len(report)}")
    for row in report:
        if row["status"] != "ok":
            print(f"  FAILED p{row['product']}: {row['status']} {row.get('detail', '')}")
    for row in flagged:
        print(f"  REVIEW p{row['product']}: coverage {row['coverage']}")


if __name__ == "__main__":
    main()
