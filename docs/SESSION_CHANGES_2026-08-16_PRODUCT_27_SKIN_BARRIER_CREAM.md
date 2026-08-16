# Product 27 SKIN BARRIER PROTECTING CREAM: Intertek audit, selling-tone rewrite, bespoke page

**Date:** 16 Aug 2026
**Live:** https://genosys.ae/products/27 (plus /ru and /ar)

The cream half of the pair whose serum is product 19. The gallery ritual slide says
it outright: "PERFECT PAIR 19 + 27, serum soothes, cream seals".

## Documents read

- `Registration DOC/Formula_up/Formula-GENOSYS SKIN BARRIER PROTECTING CREAM.pdf` — current DTS MG formula, signed
- `Registration DOC/SA/SA-GENOSYS SKIN BARRIER PROTECTING CREAM.pdf` — QACS, Dec 2020, Amendment I
- `Label/[GENOSYS]SKIN BARRIER PROTECTING CREAM.pdf` — all language panels
- `Registration DOC/COA/COA-GENOSYS SKIN BARRIER PROTECTING CREAM.pdf`

No DTS MG deck and no efficacy study for this product.

## Distinctive fact

**Ceramide NP at 0.5%, and the Korean carton panel prints the number in brackets:
5,000 ppm.** Ceramides are expensive and most creams that put the word on the front
use them somewhere between a hundredth and a tenth of a percent. This is at half a
percent, delivered inside CERACARE H5, a 10% premix that also carries glycerin and
hydrogenated lecithin.

Behind it, **glycerin at 17.49%**, nearly a fifth of the tube, arriving from two
separate raw materials. That makes this the richest cream in the range, and the three
now divide cleanly enough to put on the page:

| | Water | Character |
|---|---|---|
| 27 Skin Barrier | 49.9% | Glycerin 17.5%, shea 3%, ceramide 5,000 ppm. Sensitive and dry skin |
| 29 Hyaluron | 72.4% | Light and watery, hyaluronate 1,000 ppm. Dehydrated skin of any type |
| 30 Problem Control | 86.6% | No oil in it at all. Oily and blemish-prone skin |

The carton also asks for **patting rather than massage**, which is unusual for a cream
this rich and is a deliberate instruction for reactive skin. Both the other creams say
massage. The page says why.

## The honest shape of the page

The carton names three things: enriched ceramide, botanical extracts and an amino acid
complex. Only the first is a working dose. The seventeen amino acids come to 0.00093%
between them, about nine parts per million. The seven botanicals arrive as MultiEx
BSASM Plus at 0.0001%, one part per million. The page names all three and credits one.

## The MultiEx mirror image

MultiEx BSASM Plus in this cream is **0.0001%**. In the All For Sensitive Serum
(product 19) it is **1.0000%**, ten thousand times more, and that page is correctly
built around it.

This record had MultiEx as its **productDetails technology line**, which is the exact
mirror of the failure logged on product 19, where an INCI-only audit banned the name at
the dose where it actually works. Same complex, two products, wrong call in both
directions. Fixed here; product 19 was fixed on 15 Aug.

## Cut from live copy

- **MultiEx BSASM Plus as the technology.** It is at one part per million
- **"Barrier Repair"** as a benefit. The product is called Protecting and so is the carton
- **"All skin types"**. The carton and the Turkish panel say sensitive and dry skin
- **Macadamia oil** written up as a featured restorative active. It is at 0.0001%, alongside meadowfoam at the same level
- **"Visible improvement in skin barrier function within 2-4 weeks"**. There is no efficacy study on file for this product at all
- **"Gently massage in upward motions"**. The carton says pat
- **"Efficacy test on improving skin restorative force"** in the static fallback. No such test on file

## Accuracy bugs fixed

1. The full INCI was **missing 1,2-Hexanediol** at 2%, and missing the **C18-C21 Alkane** the carton prints. Replaced with the carton list, fifty entries.
2. `directions` literally read "dermatologically tested and dermatologically tested".
3. `productNumber` was null; set to `'27'`.

## Page

`components/product/spcream/` — single 100g tube, so it runs the product 20 layout
rather than either two-tube cream, with a warm sage palette from the pack's olive
print and the pale botanicals in the slides.

Sections: Barrier · Amino · Moisture → three names on the box, one of them is a dose →
where it sits against the other two creams → serum first then pat this in → actives and
full INCI → suited / not → routine → spec (pH 6.07, no lot) → FAQ → reviews.

The "clean" slot holds the three-cream comparison rather than a no-additions badge,
because this carton has no such badge and the genuinely useful thing to tell a shopper
is which of the three creams is theirs.

Six quick facts added where there were none. Cache key `product-by-id-v33`.

## Image job logged

Gallery **s4** lists the botanicals last as a "botanical soothe stack" with no dose,
which reads as a fifth pillar next to the ceramide. At 0.0001% it is not one. Logged in
`~/Desktop/genosys-artwork-corrections.html`; the copy names them and credits the
ceramide.

## Files

- `components/product/spcream/spcreamCopy.ts`, `spcream.css`, `SpcreamProductPage.tsx`
- `components/product/bespokePdp.tsx`
- `app/products/[id]/page.tsx`, `app/ar/products/[id]/page.tsx`, `app/ru/products/[id]/page.tsx`
- `data/productTranslations.ts`, `data/productTranslationsRu.ts`
- `lib/productQuickFactsCatalog.ts` (six new facts)
- `lib/chatbot/config.ts`, `app/api/skin-analysis/ai/route.ts`
- `lib/products.ts`, `lib/productsDb.ts`
- `scripts/update-product-27-spcream-selling-copy-20260816.ts` (applied)
- `scripts/apply-product-27-locale-files-20260816.py`, `scripts/scaffold-spcream-page-20260816.py`
