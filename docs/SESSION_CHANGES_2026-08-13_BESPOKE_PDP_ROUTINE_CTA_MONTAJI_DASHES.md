# Bespoke PDPs - routine CTA, Dubai Municipality registration, dash sweep

Date: 13 Aug 2026
Scope: products 63, 64, 65, 66 (the four bespoke PDPs). Local only, nothing pushed.

Three pieces of feedback, all from looking at the live-ish local pages.

## 1. "You are here" was a dead end

The routine strip marked the step the shopper was already on with a grey pill reading
"You are here" / "This product", sitting in the slot where every other card has its
add button. The current product was the one product in the routine you could not add
from that strip.

Fixed on all four pages:

- The marker moved to a small chip on the image, top corner opposite the step number,
  in the page's own `--cera-rose`. The card already had a rose border and blush fill,
  so orientation is not lost.
- The action slot now renders a real button wired to the page's own `handleAdd`, the
  same handler behind the hero CTA, with `ctaLabel` for the label and `isAdding` /
  `justAdded` for state.

Reusing `handleAdd` rather than `handleAddRoutineProduct` matters for the two products
that have variants. On 63 it adds the shade currently selected in the hero, and if no
shade has been picked it calls `promptForShade()`, which scrolls back to the swatches
instead of guessing. On 66 it adds the currently selected size. `handleAddRoutineProduct`
takes a bare product record and would have added a variant-less line.

One consequence worth knowing: `handleAdd` adds the hero quantity, not a hard 1, so if
someone sets the stepper to 3 the routine card adds 3. That mirrors the hero button,
which is the behaviour I would expect on the product's own page, but it does differ
from the sibling cards which always add 1.

Labels were also normalised. 63 and 64 said "This product", the other two said "You are
here"; all four now say "You are here". Arabic follows the audience the page already
assumes: 63 and 65 use the feminine `أنتِ هنا`, 64 and 66 the neutral `أنت هنا`.

## 2. Dubai Municipality (Montaji) was missing from the quality block

The quality row on 63 and 65 credited only the Korean Certificate of Free Sale. Both
products are also registered with Dubai Municipality, which is the credential a UAE
shopper actually recognises, so it now leads.

Verified against `docs/Montaji_Product_Registration_Letter_normalized.csv` before
writing anything:

| Product | Montaji registration | Status | Valid to |
|---|---|---|---|
| 63 #01 Bright | CPRE-260126-192507 | Approved | Jan 2031 |
| 63 #02 Natural | CPRE-280126-193239 | Approved | Jan 2031 |
| 65 Bio-Meso Homecare 5000 | CPRE-240126-191961 | Approved | Jan 2031 |
| 66 Cerabarrier 200ml | CPRE-250626-236787-0001 | Approved | Jun 2031 |
| 66 Cerabarrier 600ml | CPRE-250626-236786-0001 | Approved | Jun 2031 |

New row value, all three locales: "Registered with Dubai Municipality on the Montaji
system, on top of the Korean certificate of free sale."

The CPRE codes stay in the file header comments and out of the page. They are
traceability for us, not something a shopper can act on, and putting them on the page
would walk straight back into the audit voice we just removed. The old Korean
certificate numbers (2025-25983 on 65) came off the page for the same reason.

64 has no such row because it is a device, not a cosmetic, so it is correctly absent
from the cosmetic registration letter. 66 has a clinical proof section instead of a
quality block, so there was no row to amend and I did not invent one.

## 3. Em dashes replaced with hyphens in English and Arabic

122 replacements across the four copy files and four page components. Alt text and cart
line labels in the `.tsx` files were included since both are user-facing. Code comments
were left alone.

**Russian was deliberately left as it was.** In Russian the em dash is required
punctuation, not a stylistic choice. It stands in for a missing copula, so
`Ниацинамид 2% и аденозин — два актива`, `Число на тубе — это концентрация` and
`Спикулы гидролизованной губки — природные компоненты` are all grammatically correct
as written. Replacing those with hyphens would read as an error to a Russian speaker,
which is the opposite of the goal. Flagged to Vadim rather than done silently; if he
wants it anyway it is one script rerun.

En dashes were also left in place. The only ones remaining are numeric ranges
(`Day 3–4`, `2–3 months`, `200–300 treatments`), where an en dash is correct and reads
as nothing in particular.

## Verification

- `npx tsc --noEmit` clean for everything touched. The only errors in the tree are four
  pre-existing ones in the untracked `utils/formatProductDisplayName.tsx`.
- All 12 URLs return 200: products 63, 64, 65, 66 in `en`, `ar`, `ru`.
- Chip renders in the right language on all 12.
- New Montaji row confirmed in rendered HTML on all six 63 and 65 pages.
- Bio-Meso routine strip checked visually: chip on card 2, working button beneath it.
