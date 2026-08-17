# Barcodes per product + inline size/shade picker in the routine strip

Date: 2026-08-13
Scope: local only. Nothing pushed.

Two requests:

1. "would be great to add barcode info per product as well. Helps a lot"
2. "user should be able to select shade/size from here - without moving to other pages"

---

## 1. Barcodes

### The trap I walked into first

MoySklad holds a barcode for all 160 products, and it is the obvious place to
read from. Those barcodes are wrong for this purpose. Every one of them sits in
the `2000000xxxxxx` range, which is MoySklad's internally generated in-store
code, not the EAN-13 printed on the Korean carton. Publishing one would have put
a number on the page that scans to nothing.

The real codes are Korean GS1, so they start `880`. They live in two documents
already in the repo:

| Source | Covers | Count |
|---|---|---|
| `docs/Montaji_Product_Registration_Letter_normalized.csv` | Cosmetics registered with Dubai Municipality | 73 |
| `docs/GENOSYS_Export_Orderform_Codes_2026_normalized.csv` | Everything on the current factory order form, including devices | 128 |

Devices are not cosmetics, so they never appear in the Montaji register. The
order form is the only source for the Hair Stamp (`8809392232240`) and the Scalp
Brush (`8800065000357`).

### Why the mapping was curated by hand

I wrote `scripts/_audit-barcode-match.ts` to propose matches by name similarity.
It is useful as a starting point and useless as an authority. Its top-scoring
answers included:

- Revita Glow BB Cream (#63) matched to "Blemish Balm Cream 50g", which is #42
- Hair Stamp (#64) matched to "HairGen Booster", which is #3
- Scalp Peeling alpha (#46) matched to "HR3 Matrix Scalp Brush", which is #61
- Power Solution PCS (#7) matched to the SWS solution

A wrong barcode is a false statement about a physical object, so every entry in
`data/productBarcodes.ts` was resolved against the source rows by hand, using
the size on the product record to disambiguate. Examples that needed it:

- Snow O2 (#10) is 180ml `8809205627713`, not the 500ml `8809205630263`
- Problem Control Toner (#15) is 200ml `8809579274438`, not the 500ml `…483`
- Hydro Soothing (#28), Problem Control (#30), Hyaluron (#29) and Multi Vita
  (#31) creams all have a retail and a professional size registered separately
- Ultra Shield (#39) has two registrations under the same name. The 2026 order
  form ships `8809849803436`, so that is the current carton

### Deliberately absent

These are left out on purpose and are documented in the data file so nobody
"helpfully" fills them in later:

- **#1 Microneedle Roller.** The order form has a separate barcode per needle
  length and per body type. The record says only "0.25mm", which is not one SKU.
- **#45 Hair Solution alpha.** Montaji registers "Alpha (box 8 pcs)"
  `8809518823871` and "Alpha (8 pcs: home)" `8809518824038`. Both are alpha,
  both are eight pieces. Needs the carton checked.
- **#48 Hair-GENTRON, #49 GENO-LED IR II.** Devices, in neither source.
- **#54 to #59, #62.** Beauty boxes assembled here, so they carry the barcodes
  of their contents.

That is 55 of 66 products mapped, 59 barcodes in total once the shade and size
splits are counted.

### Guarding the transcription

`__tests__/data/productBarcodes.test.ts` checks every code, because these were
typed by hand out of PDFs and CSVs and end up on the page as a factual claim:

- valid EAN-13 check digit, which catches roughly nine in ten single-digit typos
- `880` prefix, which is what stops a MoySklad `2000000xxxxxx` code being pasted
  in by someone who does not know the distinction
- no barcode assigned to two different products

All 59 pass.

### Where it shows up

- **On the page.** A "Barcode" row in the spec table of all four bespoke PDPs,
  via `CeraBarcodeRows` in `CeraPrimitives.tsx`. Products whose SKU splits show
  one line per variant, so #63 lists both shades and #66 both sizes. Products
  with no documented barcode render no row at all rather than a blank one.
- **In JSON-LD.** `ProductSchema.tsx` now emits `gtin13`, which the file had
  been carrying a "placeholder for future barcode support" comment about. This
  is the part that "helps a lot" beyond the page itself: Google Merchant Center
  and Shopping treat GTIN as a strong product identifier.

`gtin13` is emitted only where one code covers the whole offer. Products 63 and
66 correctly omit it, because a single Product node spanning two shades or two
sizes cannot honestly claim one GTIN. Verified from the rendered HTML:

```
p63  gtin13 = (none, two shades)      barcode row = both shades listed
p64  gtin13 = 8809392232240
p65  gtin13 = 8809849808110
p66  gtin13 = (none, two sizes)       barcode row = both sizes listed
```

The digits are wrapped in `dir="ltr"` with `unicode-bidi:isolate`. Without that,
Arabic bidi reordering walks the numeral run around the label, which is the same
bug the shade codes hit earlier.

`data/` is gitignored with per-file exceptions, so `.gitignore` gained
`!/data/productBarcodes.ts`.

---

## 2. Inline size and shade picker in the routine strip

### Before

Routine cards for products with more than one size rendered a `Choose options`
link that navigated to that product's own page. The shopper lost their place,
and the routine they were part-way through building was abandoned.

### After

That link is now a button that opens `ProductOptionDialog`, the same component
the catalogue's `ProductCard` already uses. The shopper picks the size or shade,
sets a quantity, and adds to bag without the URL changing.

Reusing the existing dialog rather than writing an inline selector means the
variant availability rules, pricing display and RTL handling are the ones that
are already tested, and it inherits `MAX_LINE_QUANTITY` and the trade pricing
logic for free.

Wiring, in all four pages:

- `handleAddRoutineProduct(item, selection?, quantity = 1)` now forwards
  `selection.selectedColor` and `selection.selectedSize` into `addItem`, and
  reports the selection-aware price to analytics instead of `item.price`
- `handleChooseRoutineOptions` opens the dialog, redirecting logged-out shoppers
  to login exactly as the single-SKU add button beside it already did
- The `<Link>` fallback survives only for steps with no linked product record,
  where "View product" is still the honest label

### A bug found on the way

The CERABARRIER routine had no `needsSizeChoice` check at all. Any linked
product was added straight to the bag at whatever size happened to be default,
with no way for the shopper to know. It now computes `needsSizeChoice` from
`getProductSizeOptions` and routes those steps to the picker like the others.

`cerabarrierCopy.ts` gained a `routine.chooseOptions` label in all three
locales ("Choose size" / "اختر الحجم" / "Выбрать объём"), matching the wording
already used on the Bio-Meso and Hair Stamp pages. Arabic uses the neutral form
there, consistent with that page's existing `thisProduct` label.

### Which routines actually show a picker

No routine step is a shade product, so every picker in play is a size picker:

| Page | Routine steps | Steps needing a choice |
|---|---|---|
| 63 | 10, 16, 21, 29, 63 | 10, 16, 29 |
| 64 | 44, 64, 45, 3 | none |
| 65 | 10, 65, 52, 25 | 10, 25 |
| 66 | 66, 14, 19, 27, 40 | none |

Confirmed from the rendered HTML that those buttons are now `<button>` elements
carrying the disabled-state classes, not anchors.

---

## Also fixed

`utils/formatProductDisplayName.tsx` (untracked local work, not from this task)
had four `noUncheckedIndexedAccess` errors on regex capture groups that were
failing the whole typecheck. Guarded with `?? ''`.

## Verification

- `npx tsc --noEmit` clean
- `npx eslint` clean on all seven touched files
- All four product pages return 200 with no runtime error markers
- Barcode row and `gtin13` confirmed present in the rendered HTML as tabled above

Cursor's browser automation was down for this session, so interaction with the
dialog itself has not been clicked through. The page is also behind login for
pricing, so the dialog path needs a logged-in check before this ships.

## Files

| File | Change |
|---|---|
| `data/productBarcodes.ts` | New. 59 curated EAN-13s over 55 products, plus lookup helpers |
| `__tests__/data/productBarcodes.test.ts` | New. Check digit, prefix and duplicate guards |
| `.gitignore` | Un-ignore the new data file |
| `scripts/_audit-barcode-match.ts` | New. Match proposal tool, review aid only |
| `components/schema/ProductSchema.tsx` | Emit `gtin13` where a code exists |
| `components/product/cerabarrier/CeraPrimitives.tsx` | New `CeraBarcodeRows` |
| `messages/{en,ar,ru}.json` | `product.barcode` label |
| `components/product/*/[Product]Page.tsx` (4) | Barcode row, option dialog wiring |
| `components/product/cerabarrier/cerabarrierCopy.ts` | `routine.chooseOptions` |
| `utils/formatProductDisplayName.tsx` | Typecheck fix |
