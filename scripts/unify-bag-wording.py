#!/usr/bin/env python3
"""
Unifies the shopping-container noun on "bag" across the website message files.

WHY. The site shipped two parallel vocabularies. A viewport flag
(`useBagText = isPWA || isMobile`) rendered "Add to Cart" on desktop and
"Add to Bag" on mobile, so the same product changed its button text when the
window was resized, and the options dialog ignored the flag entirely - which
put both words on one screen.

WHAT IS ACTUALLY BEING DECIDED. Only English. Russian already renders
"Корзина" for every one of these keys, so it is unified whichever word wins.
Arabic was split between السلة, the standard e-commerce term, and الحقيبة,
which reads as a literal handbag - that is a correctness fix, not a preference,
and it lands regardless.

CASING. Title case, matching the mobile app, which is already consistent on
"Add to Bag", "In Bag", "Go to Bag", "Clear Bag".

Values are rewritten in place rather than keys being deleted: every caller then
renders the same word no matter which of the duplicate keys it reaches for. The
duplicate keys are removed separately, once their callers are gone.

  python3 scripts/unify-bag-wording.py            # report only
  python3 scripts/unify-bag-wording.py --apply
"""

import json
import sys

APPLY = "--apply" in sys.argv

# Key -> new value. Absent keys are reported, not created.
CHANGES = {
    "en": {
        "common.cart": "Bag",
        "common.addToCart": "Add to Bag",
        "products.addToCart": "Add to Bag",
        "cart.title": "Shopping Bag",
        "cart.empty": "Your Bag is Empty",
        "cart.emptyMessage": "Looks like you haven't added any products to your bag yet.",
        "cart.clearCart": "Clear Bag",
        "cart.clearCartConfirm": "Remove all items from your bag?",
        "cart.shoppingCart": "Shopping Bag:",
        "cart.removeItem": "Remove item from bag",
        "checkout.yourCartIsEmpty": "Your Bag is Empty",
        "checkout.addItemsBeforeCheckout": "You need to add items to your bag before checking out.",
        "checkout.cart": "Bag",
        "checkout.backToCart": "Back to Bag",
        "checkout.cancelledExplanation2": "Your bag items are still saved and ready for checkout",
        "checkout.reviewCart": "Review Bag",
        "checkout.variantRequiredMessage": "Please select color/size for: {products}. Go back to your bag to choose.",
        "product.addToCart": "Add to Bag",
        "product.inCart": "In Bag",
        "product.addedToCart": "Added to Bag",
        "skinRecommendation.addToCart": "Add to Bag",
        "bundleBuilder.addToCart": "Add Bundle to Bag",
        "bundleBuilder.addedToCart": "Bundle added to bag!",
        "payCancel.returnToCart": "Return to Bag",
    },
    # Already "Корзина" throughout. Only the one key that said "Корзина покупок:"
    # while its twin said "Корзина:" is levelled, so the two cannot drift.
    "ru": {
        "cart.shoppingCart": "Корзина:",
        "cart.shoppingBag": "Корзина:",
    },
    # الحقيبة is a handbag. The shopping container in Arabic is السلة.
    "ar": {
        "common.bag": "السلة",
        "cart.shoppingBag": "سلة التسوق:",
        "product.addToBag": "أضف إلى السلة",
        "product.inBag": "في السلة",
        "product.viewBag": "عرض السلة",
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
    for locale, changes in CHANGES.items():
        path = f"messages/{locale}.json"
        doc = json.load(open(path))
        touched = 0

        print(f"========== {locale.upper()} ==========")
        for key, new in changes.items():
            old = get(doc, key)
            if old is None:
                print(f"  MISSING  {key}")
                continue
            if old == new:
                print(f"  same     {key}")
                continue
            print(f"  change   {key}")
            print(f"             - {old}")
            print(f"             + {new}")
            put(doc, key, new)
            touched += 1

        total += touched
        print(f"  -- {touched} changed\n")

        if APPLY and touched:
            with open(path, "w") as handle:
                json.dump(doc, handle, ensure_ascii=False, indent=2)
                handle.write("\n")

    print(f"{total} strings {'rewritten' if APPLY else 'would change'}")
    if not APPLY:
        print("re-run with --apply")


if __name__ == "__main__":
    main()
