#!/usr/bin/env python3
"""
Puts the bag labels in sentence case, matching the bespoke product pages.

WHY THIS DIRECTION. Two systems were in play. The 92 bespoke product pages use
sentence case for every control they own - "Add to bag", "Out of stock",
"Log in to shop", "Choose options", "Adding..." - and are internally complete.
The shared catalogue used title case for the bag labels specifically. A signed-in
customer on a product page saw the card say "Add to Bag" and the sticky bar
below it say "Add to bag".

Moving the bespoke set to title case would have meant reopening 450 strings
across 92 files, and to stay coherent it would have had to drag "Out of stock"
along with it. Moving the catalogue is 36 strings in two files.

Neither catalogue had a convention to defend: the app is 209 sentence-case
labels against 257 title-case ones, and the website is similarly split. So this
is not stranding the bag labels among tidy title-case neighbours - it is
aligning them with the only coherent system in either codebase. Bringing the
rest of the catalogues into line is a separate and much larger job.

Single-word labels keep their capital: "Bag" on its own is the start of a label,
not a word inside a sentence.

  python3 scripts/bag-labels-sentence-case.py            # report only
  python3 scripts/bag-labels-sentence-case.py --apply
"""

import json
import sys

APPLY = "--apply" in sys.argv

WEBSITE = "messages/en.json"
APP = "../genosys-mobile-app/i18n/messages/en.json"

CHANGES = {
    WEBSITE: {
        "common.addToCart": "Add to bag",
        "products.addToCart": "Add to bag",
        "cart.title": "Shopping bag",
        "cart.empty": "Your bag is empty",
        "cart.clearCart": "Clear bag",
        "cart.shoppingCart": "Shopping bag:",
        "cart.shoppingBag": "Shopping bag:",
        "checkout.yourCartIsEmpty": "Your bag is empty",
        "checkout.backToCart": "Back to bag",
        "checkout.reviewCart": "Review bag",
        "product.addedToBag": "Added to bag!",
        "product.addToCart": "Add to bag",
        "product.addToBag": "Add to bag",
        "product.inBag": "In bag",
        "product.viewBag": "View bag",
        "product.inCart": "In bag",
        "product.addedToCart": "Added to bag",
        "skinRecommendation.addToCart": "Add to bag",
        "bundleBuilder.addToCart": "Add bundle to bag",
        "payCancel.returnToCart": "Return to bag",
    },
    APP: {
        "chat.addToBag": "Add to bag",
        "bag.clearBagTitle": "Clear bag",
        "bag.emptyCartTitle": "Empty bag",
        "checkout.goToBag": "Go to bag",
        "product.addedToBagTitle": "🛍️ Added to bag",
        "product.viewBag": "View bag",
        "product.addToBag": "Add to bag",
        "product.inBag": "In bag ({count})",
        "ordersDetail.reorderSuccessTitle": "Added to bag",
        "ordersDetail.viewBag": "View bag",
        "favorites.addToBag": "Add to bag",
        "shop.addToBag": "Add to bag",
        "shop.inBag": "In bag",
        "skinCamera.addToBag": "Add to bag",
        "bundleBuilder.addBundleToCart": "Add bundle to bag",
    },
}


def get(doc, path):
    node = doc
    for key in path.split("."):
        if not isinstance(node, dict) or key not in node:
            return None
        node = node[key]
    return node


def put(doc, path, value):
    parts = path.split(".")
    node = doc
    for key in parts[:-1]:
        node = node[key]
    node[parts[-1]] = value


def main():
    total = 0
    for path, changes in CHANGES.items():
        raw = open(path, encoding="utf-8").read()
        doc = json.loads(raw)
        if json.dumps(doc, ensure_ascii=False, indent=2) + "\n" != raw:
            sys.exit(f"{path}: formatting would drift on rewrite - stopping")

        print(f"========== {path} ==========")
        touched = 0
        for key, new in changes.items():
            old = get(doc, key)
            if old is None:
                print(f"  MISSING  {key}")
                continue
            if old == new:
                print(f"  same     {key}")
                continue
            print(f"  {key}\n    - {old}\n    + {new}")
            put(doc, key, new)
            touched += 1

        total += touched
        print(f"  -- {touched} changed\n")

        if APPLY and touched:
            with open(path, "w", encoding="utf-8") as handle:
                json.dump(doc, handle, ensure_ascii=False, indent=2)
                handle.write("\n")

    print(f"{total} labels {'rewritten' if APPLY else 'would change'}")
    if not APPLY:
        print("re-run with --apply")


if __name__ == "__main__":
    main()
