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


def ensure_tool():
    if os.path.exists(CUTOUT_TOOL):
        return
    subprocess.run(
        ["swiftc", "-O", SWIFT_SOURCE, "-o", CUTOUT_TOOL],
        check=True,
    )


def normalize(png_path):
    """Trim to the silhouette, then centre it on a square with a fixed margin."""
    im = Image.open(png_path).convert("RGBA")
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


def main():
    ensure_tool()
    os.makedirs(OUT_DIR, exist_ok=True)

    with open(os.path.join(ROOT, "/tmp/imgs.json")) as handle:
        products = json.load(handle)

    wanted = set(sys.argv[1:])
    report = []

    for row in products:
        number = str(row["productNumber"])
        if wanted and number not in wanted:
            continue

        source = row.get("image") or ""
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

            canvas = normalize(raw)
            share = coverage(canvas)
            out = os.path.join(OUT_DIR, f"{number}.webp")
            canvas.save(out, "WEBP", quality=WEBP_QUALITY, method=6)

            report.append({
                "product": number,
                "status": "ok",
                "source": source,
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
