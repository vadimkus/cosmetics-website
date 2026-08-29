#!/usr/bin/env python3
"""
Audits label capitalisation across both catalogues before anything is changed.

The question this answers is not "how many strings are title case" - it is
"which of those are title case because someone chose it, and which are title
case because the string contains a proper noun". "Gift Certificates" is a
styling choice. "Apple Pay" is a name. A sentence-case pass has to move the
first and leave the second alone, and the only way to know the difference is to
look at the capitalised words themselves.

So this reports the vocabulary rather than a count: every word that appears
capitalised mid-string, with how often and where. That list is what the
protected-token list gets built from, by hand.

  python3 scripts/audit-label-case.py
"""

import json
import re
from collections import Counter, defaultdict

CATALOGUES = {
    "website": "messages/en.json",
    "app": "../genosys-mobile-app/i18n/messages/en.json",
}

# Placeholders and markup are not words.
NOISE = re.compile(r"\{[^}]*\}|<[^>]*>|https?://\S+|\{\{[^}]*\}\}")


def strings(node, prefix=""):
    if isinstance(node, str):
        yield prefix, node
    elif isinstance(node, dict):
        for key, value in node.items():
            yield from strings(value, f"{prefix}.{key}" if prefix else key)


def is_prose(text):
    """Sentences get capitals for grammatical reasons; only labels are in scope."""
    return bool(re.search(r"[.!?](\s|$)", text)) or len(text.split()) > 8


def main():
    mid_caps = Counter()
    examples = defaultdict(list)
    totals = {}

    for label, path in CATALOGUES.items():
        doc = json.load(open(path, encoding="utf-8"))
        labels = 0
        title = 0

        for key, raw in strings(doc):
            text = NOISE.sub(" ", raw).strip()
            words = text.split()
            if len(words) < 2 or is_prose(text):
                continue
            labels += 1

            # Words after the first that begin with a capital. These are either
            # a title-case choice or a proper noun, and telling them apart is
            # exactly the judgement that cannot be automated.
            capped = [
                w.strip(".,:;!?()[]\u2019's")
                for w in words[1:]
                if w[:1].isupper() and w[:1].isalpha()
            ]
            capped = [w for w in capped if w]
            if not capped:
                continue
            title += 1
            for word in capped:
                mid_caps[word] += 1
                if len(examples[word]) < 3:
                    examples[word].append(f"{label}:{key} = {raw}")

        totals[label] = (labels, title)

    for label, (labels, title) in totals.items():
        print(f"{label:8}  {labels:4} multi-word labels, {title:4} with mid-string capitals")

    print(f"\n{len(mid_caps)} distinct capitalised words to triage:\n")
    for word, count in mid_caps.most_common():
        print(f"  {count:4}  {word}")
        for sample in examples[word][:1]:
            print(f"        {sample}")


if __name__ == "__main__":
    main()
