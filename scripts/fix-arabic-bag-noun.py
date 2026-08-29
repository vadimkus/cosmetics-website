#!/usr/bin/env python3
"""
Corrects the Arabic shopping-container noun in the bespoke product copy.

THE BUG. The bespoke Arabic copy calls the shopping container الحقيبة, which
is a handbag or a suitcase - the thing you carry. The container you put
purchases into is السلة. So roughly 250 buttons across ~80 product pages have
been telling Arabic readers to "add this to your handbag".

WHAT IS CHANGED. The noun only:

    الحقيبة  -> السلة     (the bag)
    حقيبتك   -> سلتك      (your bag)

The verb is left exactly as written. The copy deliberately alternates between
the feminine imperative أضيفي and the masculine أضف depending on who the
product is addressed to, and that choice is not this script's business.

WHAT IS DELIBERATELY NOT CHANGED. One line means an actual handbag:

    mistCopy.ts:  الرذاذ اليومي. المكتب والحقيبة وحوض المساء.
                  "The daily mist. The office, the handbag, the evening basin."

That is a list of places you keep the bottle, not a checkout control. A blind
find-and-replace turns it into "the office, the shopping basket and the evening
basin", so it is excluded by exact string match - if the line is ever reworded
the guard stops matching and the exclusion is reported as stale rather than
silently lapsing.

  python3 scripts/fix-arabic-bag-noun.py            # report only
  python3 scripts/fix-arabic-bag-noun.py --apply
"""

import os
import sys
from collections import Counter

APPLY = "--apply" in sys.argv

ROOTS = ["components", "app", "lib", "data"]

# Longest first, so حقيبتك is never half-eaten by a shorter rule.
SUBSTITUTIONS = [
    ("حقيبتك", "سلتك"),
    ("الحقيبة", "السلة"),
]

# Lines where حقيبة genuinely means a handbag and must survive untouched.
KEEP = [
    "الرذاذ اليومي. المكتب والحقيبة وحوض المساء.",
]


def walk():
    for root in ROOTS:
        for base, dirs, names in os.walk(root):
            dirs[:] = [d for d in dirs if d not in {"node_modules", ".next"}]
            for name in names:
                if name.endswith((".ts", ".tsx", ".json")):
                    yield os.path.join(base, name)


def main():
    pairs = Counter()
    kept = Counter()
    files_changed = 0
    total = 0

    for path in walk():
        try:
            original = open(path, encoding="utf-8").read()
        except (UnicodeDecodeError, OSError):
            continue
        if "حقيب" not in original:
            continue

        out_lines = []
        touched = 0

        for line in original.split("\n"):
            protected = next((k for k in KEEP if k in line), None)
            if protected:
                kept[protected] += 1
                out_lines.append(line)
                continue

            new = line
            for src, dst in SUBSTITUTIONS:
                if src in new:
                    for _ in range(new.count(src)):
                        pairs[(src, dst)] += 1
                    new = new.replace(src, dst)

            if new != line:
                touched += 1
            out_lines.append(new)

        if not touched:
            continue

        files_changed += 1
        total += touched
        if APPLY:
            with open(path, "w", encoding="utf-8") as handle:
                handle.write("\n".join(out_lines))

    print("substitutions")
    for (src, dst), n in pairs.most_common():
        print(f"  {n:>4}  {src}  ->  {dst}")

    print("\nprotected (genuine handbag, left alone)")
    for text, n in kept.items():
        print(f"  {n:>4}  {text}")
    for text in KEEP:
        if text not in kept:
            print(f"  STALE - no longer present, review this exclusion: {text}")

    print(f"\n{total} lines across {files_changed} files "
          f"{'rewritten' if APPLY else 'would change'}")
    if not APPLY:
        print("re-run with --apply")


if __name__ == "__main__":
    main()
