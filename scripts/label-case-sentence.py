#!/usr/bin/env python3
"""
Puts interface chrome into sentence case across both catalogues.

Scope is chrome only. Product names, company names and marketing copy are left
alone - see scripts/label-case-scope.py for why those are a different kind of
string that happens to share a namespace.

What "sentence case" means here: the first word keeps its capital, every later
word is lowercased unless it is a protected token. Protected tokens are brand
names, place names, acronyms and feature names, and they are matched as whole
words so that "Pay" in "Apple Pay" survives while "Pay" in "Pay Now" does not.
Multi-word names are matched as phrases first, for the same reason.

  python3 scripts/label-case-sentence.py            # write the proposed diff
  python3 scripts/label-case-sentence.py --apply
"""

import json
import re
import sys

APPLY = "--apply" in sys.argv

CATALOGUES = {
    "website": "messages/en.json",
    "app": "../genosys-mobile-app/i18n/messages/en.json",
}

NOISE = re.compile(r"\{[^}]*\}|<[^>]*>|https?://\S+")

# Values under these keys are product names, company narrative or marketing
# copy. A capitalisation convention has no business rewriting them.
NOT_CHROME = [
    re.compile(r"^product\.routine.*Title$"),
    re.compile(r"^product\.pc.*Benefit.*Title$"),
    re.compile(r"^product\.pcDefault.*Title$"),
    re.compile(r"^orderEmail\."),
    re.compile(r"^about\."),
    re.compile(r"^training\."),
    re.compile(r"^terms\."),
    re.compile(r"^privacy\."),
    re.compile(r"^legal\."),
]

# Matched before single words, so the later words of a name are not lowercased.
PROTECTED_PHRASES = [
    "Apple Pay", "Google Pay", "Samsung Pay", "Black Friday", "Cyber Monday",
    "United Arab Emirates", "Abu Dhabi", "Ras Al Khaimah", "Umm Al Quwain",
    "Eid Al Etihad", "Middle East", "Beauty Genie",
    # Only genuine names live here. Feature and category labels such as "Gift
    # Certificates", "Order Summary", "Bundle Builder" and "AI Skin Analysis"
    # are chrome and are deliberately absent, since they are exactly what this
    # pass exists to change.
    "Glass Skin",
    "Gene Re-Birth System", "Gene Re-Birth",
    "Google Play", "App Store", "Play Store",
    "Marina Mall", "Dubai Marina", "Mall of the Emirates", "Dubai Mall",
]

# A bullet, pipe or emoji ends a clause. The word after one begins a new label
# and keeps its capital, which is why "Secure payments by Stripe - Cards not
# stored" should not become "- cards not stored".
CLAUSE_BREAK = re.compile(r"^[\u2022|\u00b7\u2013\-/:]$|[\u2600-\u27bf\U0001f300-\U0001faff]")

# Whole words that keep their capital anywhere after the first position.
PROTECTED_WORDS = {
    # company, brand, product line
    "Genosys", "GENOSYS", "Montaji", "DTS", "MG", "FZ-LLC", "LLC", "Genie",
    "Apple", "Google", "Samsung", "WhatsApp", "Instagram", "Facebook", "TikTok",
    "Stripe", "PayPal", "Tabby", "Tamara", "Visa", "Mastercard", "Amex",
    "Carrefour", "Quiqup", "Aramex", "Talabat", "Careem", "Noon",
    # places and nationality
    "UAE", "Dubai", "Abu", "Dhabi", "Sharjah", "Ajman", "Fujairah",
    "Ras", "Khaimah", "Umm", "Quwain", "United", "Arab", "Emirates",
    "Korea", "Korean", "Saudi", "Arabia", "Etihad", "Eid",
    # money, tax, identifiers
    "AED", "USD", "EUR", "VAT", "TRN", "ID", "OTP", "PIN", "SMS", "COD",
    # science and formulation
    "SPF", "PA", "INCI", "PDRN", "EGF", "MTS", "DNA", "RNA", "UV", "UVA",
    "UVB", "LED", "RF", "AHA", "BHA", "PHA", "AI", "3D", "2D",
    # tiers
    "Silver", "Gold", "Platinum", "Bronze", "VIP",
    # platforms
    "iOS", "Android", "PWA", "FAQ", "FAQs", "CEO", "PDF", "QR",
    # days and months are proper nouns, and opening hours are full of them
    "Mon", "Tue", "Tues", "Wed", "Thu", "Thur", "Thurs", "Fri", "Sat", "Sun",
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
    "Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Sept", "Oct",
    "Nov", "Dec", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
}

PLACEHOLDER = re.compile(r"^\{.*\}$")


def strings(node, prefix=""):
    if isinstance(node, str):
        yield prefix, node
    elif isinstance(node, dict):
        for key, value in node.items():
            yield from strings(value, f"{prefix}.{key}" if prefix else key)


def get(doc, path):
    node = doc
    for key in path.split("."):
        node = node[key]
    return node


def put(doc, path, value):
    parts = path.split(".")
    node = doc
    for key in parts[:-1]:
        node = node[key]
    node[parts[-1]] = value


def in_scope(key, raw):
    if any(pattern.match(key) for pattern in NOT_CHROME):
        return False
    text = NOISE.sub(" ", raw).strip()
    words = text.split()
    if len(words) < 2 or len(words) > 8:
        return False
    # A full stop means a sentence, where capitals are grammar rather than style.
    if re.search(r"[.!?…](\s|$)", text):
        return False
    return any(w[:1].isupper() and w[:1].isalpha() for w in words[1:])


def sentence_case(raw):
    """Lowercase later words, leaving protected names and placeholders intact."""
    guarded = raw
    slots = []
    for phrase in sorted(PROTECTED_PHRASES, key=len, reverse=True):
        pattern = re.compile(rf"\b{re.escape(phrase)}\b")
        while True:
            match = pattern.search(guarded)
            if not match:
                break
            token = f"\x00{len(slots)}\x00"
            slots.append(match.group(0))
            guarded = guarded[: match.start()] + token + guarded[match.end():]

    def lower_word(word):
        """Lowercase a word, honouring protection segment by segment.

        Compounds are split on their punctuation so that "anti-Aging" becomes
        "anti-aging" rather than "anti-Aging", while "FZ-LLC" survives whole.
        """
        if "\x00" in word or PLACEHOLDER.match(word):
            return word
        bare = word.strip(".,:;!?()[]\u2019\"'")
        if not bare or not bare[:1].isalpha():
            return word
        if bare in PROTECTED_WORDS or (bare.isupper() and len(bare) > 1):
            return word
        # A lone capital is an initial, a vitamin, or the pronoun "I" - never a
        # styling choice. "Vitamin C" and "Keep what I entered" both rely on it.
        if len(bare) == 1:
            return word
        # A pluralised acronym: LEDs, IDs, PDFs, FAQs.
        if len(bare) > 2 and bare[-1] == "s" and bare[:-1].isupper():
            return word

        def lower_segment(segment):
            if not segment or segment in PROTECTED_WORDS:
                return segment
            if segment.isupper() and len(segment) > 1:
                return segment
            return segment[:1].lower() + segment[1:]

        parts = re.split(r"([-/])", word)
        return "".join(p if p in "-/" else lower_segment(p) for p in parts)

    out = []
    new_clause = True
    for word in guarded.split(" "):
        if not word:
            out.append(word)
            continue
        if new_clause:
            out.append(word)
        else:
            out.append(lower_word(word))
        # A separator, or a word ending in one, opens the next clause.
        new_clause = bool(CLAUSE_BREAK.search(word)) and "\x00" not in word

    result = " ".join(out)
    for index, original in enumerate(slots):
        result = result.replace(f"\x00{index}\x00", original)
    return result


def main():
    report = []
    total = 0

    for label, path in CATALOGUES.items():
        raw_text = open(path, encoding="utf-8").read()
        doc = json.loads(raw_text)
        if json.dumps(doc, ensure_ascii=False, indent=2) + "\n" != raw_text:
            sys.exit(f"{path}: formatting would drift on rewrite - stopping")

        changed = []
        for key, value in list(strings(doc)):
            if not in_scope(key, value):
                continue
            new = sentence_case(value)
            if new != value:
                changed.append((key, value, new))
                if APPLY:
                    put(doc, key, new)

        total += len(changed)
        report.append(f"===== {label}: {len(changed)} labels =====")
        for key, old, new in changed:
            report.append(f"  {key}\n    - {old}\n    + {new}")

        if APPLY and changed:
            with open(path, "w", encoding="utf-8") as handle:
                json.dump(doc, handle, ensure_ascii=False, indent=2)
                handle.write("\n")

    text = "\n".join(report)
    open("/tmp/label-case-diff.txt", "w", encoding="utf-8").write(text)
    print(text[:1500])
    print(f"\n... full diff in /tmp/label-case-diff.txt")
    print(f"{total} labels {'rewritten' if APPLY else 'would change'}")


if __name__ == "__main__":
    main()
