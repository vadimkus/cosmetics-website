#!/usr/bin/env python3
"""
Splits the title-case labels into what may be rewritten and what may not.

The catalogues mix three kinds of string under the same keys, and only one of
them is interface chrome:

  NAMES     "EPI Turnover Boosting Peeling Gel", "Genosys Middle East FZ-LLC",
            "Apple Pay". Proper nouns. Rewriting these is not a styling change,
            it is getting a product or a company's name wrong.

  COPY      "Enhanced Brightening:", "Complete Care:". Marketing headings
            written as content. They belong to whoever writes the copy, not to
            a capitalisation convention, and they are not buttons.

  CHROME    "Size Options", "Place Order", "Contact Support". Labels the
            interface owns. These are the ones a convention should govern.

Only CHROME is rewritten. The split is by key pattern first, then by whether
the string contains a protected token, because a chrome key can still carry a
proper noun - "Contact Support via WhatsApp" is chrome with a brand inside it.

  python3 scripts/label-case-scope.py
"""

import json
import re
from collections import defaultdict

CATALOGUES = {
    "website": "messages/en.json",
    "app": "../genosys-mobile-app/i18n/messages/en.json",
}

NOISE = re.compile(r"\{[^}]*\}|<[^>]*>|https?://\S+")

# Keys whose values are product names or marketing copy rather than chrome.
NOT_CHROME = [
    re.compile(r"^product\.routine.*Title$"),      # SKU names
    re.compile(r"^product\.pc\d*\w*Benefit\d*Title$"),  # benefit headings
    re.compile(r"^product\.pcDefaultBenefit\d*Title$"),
    re.compile(r"^orderEmail\."),                  # transactional email copy
    re.compile(r"^about\."),                       # company narrative
    re.compile(r"^training\."),                    # course names
    re.compile(r"^terms\.|^privacy\."),            # legal headings
    re.compile(r"Title$", re.I) if False else re.compile(r"^$"),  # placeholder
]

# Words that keep their capital wherever they appear. Brand names, places,
# acronyms, payment rails, and the ingredient and product vocabulary that is
# part of a name rather than a description.
PROTECTED = {
    # company and brand
    "Genosys", "GENOSYS", "Montaji", "DTS", "MG", "FZ-LLC", "LLC",
    "Apple", "Google", "Samsung", "WhatsApp", "Instagram", "Facebook",
    "Stripe", "PayPal", "Tabby", "Tamara", "Visa", "Mastercard", "Amex",
    # places
    "UAE", "Dubai", "Abu", "Dhabi", "Sharjah", "Ajman", "Fujairah",
    "Ras", "Al", "Khaimah", "Umm", "Quwain", "United", "Arab", "Emirates",
    "Emirate", "Korea", "Korean", "Middle", "East", "Saudi", "Arabia",
    # currency, tax, identifiers
    "AED", "USD", "EUR", "VAT", "TRN", "ID", "OTP", "PIN", "SMS", "COD",
    # science and product vocabulary
    "SPF", "PA", "INCI", "PDRN", "EGF", "MTS", "DNA", "RNA", "HA", "PH",
    "UV", "UVA", "UVB", "LED", "RF", "AHA", "BHA", "PHA", "CoQ10",
    # tiers and programme names
    "Silver", "Gold", "Platinum", "Bronze", "VIP",
    # interface proper nouns
    "iOS", "Android", "PWA", "FAQ", "FAQs", "CEO",
}


def strings(node, prefix=""):
    if isinstance(node, str):
        yield prefix, node
    elif isinstance(node, dict):
        for key, value in node.items():
            yield from strings(value, f"{prefix}.{key}" if prefix else key)


def classify(key, text):
    if any(pattern.match(key) for pattern in NOT_CHROME):
        return "copy"
    words = [w.strip(".,:;!?()[]") for w in text.split()]
    if any(w in PROTECTED for w in words[1:] if w):
        return "name"
    return "chrome"


def main():
    for label, path in CATALOGUES.items():
        doc = json.load(open(path, encoding="utf-8"))
        buckets = defaultdict(list)

        for key, raw in strings(doc):
            text = NOISE.sub(" ", raw).strip()
            words = text.split()
            if len(words) < 2 or re.search(r"[.!?](\s|$)", text) or len(words) > 8:
                continue
            capped = [w for w in words[1:] if w[:1].isupper() and w[:1].isalpha()]
            if not capped:
                continue
            buckets[classify(key, text)].append((key, raw))

        print(f"===== {label} =====")
        for kind in ("chrome", "name", "copy"):
            print(f"  {kind:7} {len(buckets[kind]):4}")
        print("\n  chrome sample (these would be rewritten):")
        for key, raw in buckets["chrome"][:14]:
            print(f"    {key:44} {raw}")
        print("\n  held back as names:")
        for key, raw in buckets["name"][:8]:
            print(f"    {key:44} {raw}")
        print()


if __name__ == "__main__":
    main()
