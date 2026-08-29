#!/usr/bin/env python3
"""
Proposes sentence-case edits for customer-facing text hardcoded in components.

These are code edits rather than catalogue data, so nothing is applied from a
regex sweep. The script emits an exact (file, old, new) list, that list gets
read, and only then is it applied. Anything it is unsure about is reported in
the SKIPPED section rather than guessed at.

Left alone:
  - admin and internal tooling, where staff read data tables and title case is
    the normal convention
  - the bespoke product pages, which were sentence case before any of this
  - proper nouns, product names and brand taglines

  python3 scripts/hardcoded-case-plan.py            # print the plan
  python3 scripts/hardcoded-case-plan.py --apply
"""

import os
import re
import sys

APPLY = "--apply" in sys.argv

ROOTS = ["app", "components"]

# Staff-only screens. No customer-facing label sits next to these to disagree.
INTERNAL = re.compile(
    r"(^|/)(admin|analytics)/|"
    r"(Admin|Analytics|Reporting|Profitability|SalesChart|BlogManagement|"
    r"CustomerProfile|LocaleDebugger|Debug|Dashboard|ProductForm|"
    r"UserSegmentation|PWAFeaturesDemo|StorageQuotaMonitor)",
    re.I,
)
BESPOKE = re.compile(r"components/product/")

# Whole phrases that are names, not labels.
PROTECTED_PHRASES = [
    "Apple Pay", "Google Pay", "App Store", "Google Play", "Play Store",
    "Black Friday", "Apple Privacy Policy", "Google Privacy Policy",
    "United Arab Emirates", "Abu Dhabi", "Middle East", "Beauty Genie",
    "Glass Skin", "Dubai Marina", "Marina Mall", "Dubai Municipality",
    "Microneedle Roller", "Partner Portal", "Skin Barrier Chamber",
    "Power Animal", "Genosys Product Calculation",
]

PROTECTED_WORDS = {
    "Genosys", "GENOSYS", "Apple", "Google", "Samsung", "WhatsApp", "Instagram",
    "Facebook", "Stripe", "PayPal", "Tabby", "Tamara", "Visa", "Mastercard",
    "Korean", "Korea", "Dubai", "UAE", "Emirates", "Arab", "United", "Municipality",
    "AED", "VAT", "SPF", "INCI", "PDRN", "EGF", "MTS", "AI", "iOS", "Android",
    "FAQ", "FAQs", "PDF", "QR", "ID", "PWA",
}

TAG_TEXT = re.compile(r"(>)(\s*)([A-Z][a-z]+(?:\s+[A-Za-z][a-z]+){1,4})(\s*)(<)")


def sentence_case(phrase):
    guarded = phrase
    slots = []
    for name in sorted(PROTECTED_PHRASES, key=len, reverse=True):
        while name in guarded:
            token = f"\x00{len(slots)}\x00"
            slots.append(name)
            guarded = guarded.replace(name, token, 1)

    out = []
    for index, word in enumerate(guarded.split(" ")):
        if index == 0 or not word or "\x00" in word:
            out.append(word)
            continue
        bare = word.strip(".,:;!?()[]'\u2019")
        if not bare or bare in PROTECTED_WORDS:
            out.append(word)
            continue
        if bare.isupper() and len(bare) > 1:
            out.append(word)
            continue
        if len(bare) == 1:
            out.append(word)
            continue
        out.append(word[:1].lower() + word[1:] if word[:1].isupper() else word)

    result = " ".join(out)
    for index, name in enumerate(slots):
        result = result.replace(f"\x00{index}\x00", name)
    return result


def main():
    plan = []
    skipped = []

    for root in ROOTS:
        for base, _, files in os.walk(root):
            for name in sorted(files):
                if not name.endswith((".tsx", ".jsx")):
                    continue
                path = os.path.join(base, name)
                if BESPOKE.search(path) or INTERNAL.search(path):
                    continue

                text = open(path, encoding="utf-8").read()
                edits = []
                for match in TAG_TEXT.finditer(text):
                    phrase = match.group(3)
                    if not any(w[:1].isupper() for w in phrase.split()[1:]):
                        continue
                    new = sentence_case(phrase)
                    if new == phrase:
                        skipped.append((path, phrase, "protected"))
                        continue
                    old_full = match.group(0)
                    new_full = f"{match.group(1)}{match.group(2)}{new}{match.group(4)}{match.group(5)}"
                    # Only safe if the exact original occurs once in the file.
                    if text.count(old_full) != 1:
                        skipped.append((path, phrase, "ambiguous - appears more than once"))
                        continue
                    edits.append((old_full, new_full, phrase, new))

                for old_full, new_full, phrase, new in edits:
                    plan.append((path, old_full, new_full, phrase, new))

    by_file = {}
    for path, old, new, phrase, new_phrase in plan:
        by_file.setdefault(path, []).append((old, new, phrase, new_phrase))

    for path in sorted(by_file):
        print(f"--- {path}")
        for _, _, phrase, new_phrase in by_file[path]:
            print(f"      {phrase:44} ->  {new_phrase}")

    print(f"\n{len(plan)} edits across {len(by_file)} files")
    if skipped:
        print(f"\nskipped ({len(skipped)}):")
        for path, phrase, why in sorted(set(skipped)):
            print(f"      {phrase:44} {why}")

    if APPLY:
        for path, edits in by_file.items():
            text = open(path, encoding="utf-8").read()
            for old, new, _, _ in edits:
                text = text.replace(old, new, 1)
            open(path, "w", encoding="utf-8").write(text)
        print("\napplied")
    else:
        print("\nre-run with --apply")


if __name__ == "__main__":
    main()
