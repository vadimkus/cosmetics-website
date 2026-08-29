#!/usr/bin/env python3
"""
Finds title-case UI text hardcoded in components rather than the catalogues.

The catalogue pass left these behind, so a customer can now see a sentence-case
label from the catalogue directly above a title-case heading baked into the
page. This lists them, split by who actually reads the screen.

Admin and internal tooling is reported separately and deliberately left alone:
those are data tables read by staff, where title case is the normal convention,
and no customer ever sees them.

  python3 scripts/audit-hardcoded-case.py
"""

import os
import re
from collections import defaultdict

ROOTS = ["app", "components"]

# Screens only staff see. Title case is conventional in a data table and there
# is no customer-facing label next to it to disagree with.
INTERNAL = re.compile(
    r"(^|/)(admin|analytics)/|"
    r"(Admin|Analytics|Reporting|Profitability|SalesChart|BlogManagement|"
    r"CustomerProfile|LocaleDebugger|Debug|Dashboard)",
    re.I,
)

# The bespoke product pages were already sentence case before any of this.
BESPOKE = re.compile(r"components/product/")

# Text between tags, and the common heading-ish string props.
PATTERNS = [
    re.compile(r">\s*([A-Z][a-z]+(?:\s+[A-Za-z][a-z]+){1,4})\s*<"),
    re.compile(r"\b(?:title|label|heading|placeholder)=\"([A-Z][a-z]+(?:\s+[A-Za-z][a-z]+){1,4})\""),
]

# Proper nouns keep their capitals wherever they appear.
PROTECTED = [
    "Apple Pay", "Google Pay", "App Store", "Google Play", "Play Store",
    "Black Friday", "Apple Privacy Policy", "Google Privacy Policy",
    "United Arab Emirates", "Abu Dhabi", "Middle East", "Beauty Genie",
    "Glass Skin", "Dubai Marina", "Marina Mall",
]
PROTECTED_WORD = re.compile(
    r"\b(Genosys|GENOSYS|Apple|Google|Samsung|WhatsApp|Instagram|Facebook|"
    r"Stripe|PayPal|Tabby|Tamara|Visa|Mastercard|Korean|Korea|Dubai|UAE|"
    r"Emirates|Arab|AED|VAT|SPF|INCI|PDRN|EGF|MTS|AI|iOS|Android|FAQ)\b"
)


def main():
    found = defaultdict(list)

    for root in ROOTS:
        for base, _, files in os.walk(root):
            for name in files:
                if not name.endswith((".tsx", ".ts", ".jsx", ".js")):
                    continue
                path = os.path.join(base, name)
                if BESPOKE.search(path):
                    continue
                bucket = "internal" if INTERNAL.search(path) else "customer"

                try:
                    text = open(path, encoding="utf-8").read()
                except OSError:
                    continue

                for pattern in PATTERNS:
                    for match in pattern.finditer(text):
                        phrase = match.group(1).strip()
                        words = phrase.split()
                        # Only flag if a later word is capitalised.
                        if not any(w[:1].isupper() for w in words[1:]):
                            continue
                        stripped = phrase
                        for name_ in PROTECTED:
                            stripped = stripped.replace(name_, "")
                        stripped = PROTECTED_WORD.sub("", stripped)
                        if not any(
                            w[:1].isupper() for w in stripped.split()[1:] or stripped.split()
                        ):
                            continue
                        found[bucket].append((path, phrase))

    for bucket in ("customer", "internal"):
        items = sorted(set(found[bucket]))
        print(f"===== {bucket}: {len(items)} =====")
        for path, phrase in items:
            print(f"  {path:58} {phrase}")
        print()


if __name__ == "__main__":
    main()
