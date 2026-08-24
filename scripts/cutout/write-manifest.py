#!/usr/bin/env python3
"""
Writes lib/productCutouts.ts from the build report.

Keyed by the original photograph's path rather than by product number, so any
surface can ask for a cut-out with only the `src` it already has, the same way
localizeProductImage works. An infographic slide is not in the map and comes
back unchanged, which is the safe failure.

  python3 scripts/cutout/build-cutouts.py && python3 scripts/cutout/write-manifest.py
"""

import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
REPORT = os.path.join(ROOT, "scripts", "cutout", "cutout-report.json")
TARGET = os.path.join(ROOT, "lib", "productCutouts.ts")

HEADER = '''/**
 * Packshots with the studio sweep removed.
 *
 * The bespoke pages seat a packshot on a tinted panel whose colour was picked
 * per page to match that shot's background. The backgrounds are not consistent
 * across the catalogue - they run from mid grey to pure white - so the
 * photograph reads as a rectangle stamped on the panel wherever the two
 * disagree, which measured out at ten of the fifteen pages where both could be
 * compared. Framing the shot instead of matching it only adds a second
 * rectangle around the first.
 *
 * A cut-out removes the disagreement rather than hiding it: with no background
 * in the file there is no edge to see, and the panel can be any colour we like.
 *
 * Generated - do not edit by hand:
 *   python3 scripts/cutout/build-cutouts.py
 *   python3 scripts/cutout/write-manifest.py
 *
 * Keyed by the original path so a caller needs only the `src` it already holds.
 * An unlisted image, such as an infographic slide, comes back unchanged.
 */
const CUTOUTS: Record<string, string> = {
'''

FOOTER = '''}

/**
 * The cut-out for `src`, or `src` unchanged when there is none. Safe to call on
 * any image path.
 */
export function cutoutImage(src: string): string {
  if (!src) return src
  return CUTOUTS[src] ?? src
}

/** True when `src` has a cut-out, for callers that style the two differently. */
export function hasCutout(src: string): boolean {
  return Boolean(src) && src in CUTOUTS
}

/** Exposed for the test that checks every listed file is on disk. */
export function getCutoutManifest(): Readonly<Record<string, string>> {
  return CUTOUTS
}
'''


def main():
    with open(REPORT) as handle:
        report = json.load(handle)

    rows = sorted(
        (r for r in report if r["status"] == "ok"),
        key=lambda r: int(r["product"]),
    )

    lines = []
    for row in rows:
        name = (row.get("name") or "").replace("*/", "")
        lines.append(f"  // {row['product']} {name}")
        lines.append(f"  '{row['source']}': '/images/cutout/{row['product']}.webp',")

    with open(TARGET, "w") as handle:
        handle.write(HEADER + "\n".join(lines) + "\n" + FOOTER)

    print(f"wrote {TARGET} with {len(rows)} entries")


if __name__ == "__main__":
    main()
