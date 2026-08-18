# The three open items from the hair-loss protocol work — all closed

Follow-up to `SESSION_CHANGES_2026-08-18_HAIR_LOSS_PROTOCOL_REWRITE.md`, which listed
three things deliberately left untouched. All three are now done.

---

## 1. The hair-loss concern page made the same claim as the PDF

The SEO block in `lib/concernsData.ts` is not only meta tags — `h1`, `heroShort` and
`intro` are **rendered on the page**. They said:

| | Was |
|---|---|
| title | "**Hair Loss Treatment** UAE \| Scalp Care & **Hair Growth** Dubai" |
| h1 | "**Hair Loss Treatment** & Scalp Care" |
| heroShort | "…shampoo, tonic & solution that **reactivate follicles and reduce hair loss from the first month**" |
| intro | "…**strengthen hair follicles, stimulate growth**… **stimulate dormant follicles** — a technique increasingly **recommended by Dubai trichologists**" |

All three languages carried it. "From the first month" is a timeline claim, and the
trichologist line is an endorsement with nothing behind it.

Rewritten in EN, AR and RU. The page still targets the concern — someone searching for
hair loss should still find us — but it now says the range is registered for scalp
cleansing, scalp nourishing and hair conditioning, and that anyone losing hair should see
a doctor first. The protocol download's own blurb, which promised "growth-boosting
steps", was corrected in the previous session.

## 2. The two hair devices called themselves hair-loss treatments

Products 3 (HairGen BOOSTER, AED 1,800) and 48 (Hair-GENTRON, AED 3,300) had never been
audited, and their records claimed what was stripped from products 43–47:

- **3** — "designed for comprehensive scalp treatment and **hair loss prevention**",
  "**promote hair growth**", "deliver nutrients directly to the hair follicles"
- **48** — "designed for professional **hair loss treatment**", "**promote hair growth,
  improve scalp circulation**", "safe and painless therapy **without side effects**",
  "**guaranteed** proper distance … for **maximum effectiveness**"

Fixed in the database (`scripts/fix-hair-devices-claims-20260818.ts`) **and in both
translation files** (`scripts/fix-hair-device-translations-20260818.ts`) — Russian and
Arabic override the record per locale, so fixing only the English record would have left
the claims live for two thirds of the site.

**Product 3** is now described from its own documents: 52 microneedles per single-use
stamp, 14 LEDs through 48 light bumps, three speeds at 280/330/400 RPM, a ten-minute
auto-stop, 5 V / 2 A, a 24-month warranty, and the four contraindications from the manual
(progressive acne/eczema/dermatitis, diabetes complications, keloid or metal allergy,
inflamed or infection-prone areas). It also states the running cost that no document
volunteers: **roughly AED 167 per session** in consumables. Needle depth is omitted
because neither the leaflet nor the manual states one.

**Product 48** has no manual, leaflet, specification sheet or study on file at all. Its
record is now limited to what the device physically is, and says so explicitly. The patent
number is kept; the award is kept but labelled "an award, not evidence of efficacy".

## 3. The other seven protocol PDFs — audited and rewritten

### ★ Twenty-two false ingredient attributions

Every "Key Active Ingredients" table was checked against the products' **full INCI
lists**, not their curated key-ingredient lists, so absence is proof rather than a gap in
our own records. Twenty-two claims named an ingredient in a product that does not contain
it:

| Protocol | Claimed | Reality |
|---|---|---|
| acne | Niacinamide in the **toner, serum and cream** | In none of the three |
| acne | Tea tree extract in the **serum** | Not present |
| acne | Centella in the **cream** | Not present |
| acne | Hyaluronic acid in the **cleanser and cream** | In neither |
| pigmentation | **L-ascorbic acid** in the MV serum | It is ethyl ascorbic acid, 1,000 ppm |
| pigmentation | Niacinamide, arbutin, hyaluronic acid in **Snow Booster** | None of the three |
| pigmentation | Arbutin in the **MV serum** | Not present |
| pigmentation | **AHA/BHA** in the Epi peeling gel | Neither. It is cellulose 3% + enzyme |
| scar | **EGF** in the Soothing Repair Postcream | Not present. EGF is only in product 26, at 0.1 ppm |
| scar | Allantoin in the **Barrier Cream** | Not present |
| anti-aging | **"Stem Cell Technology"** in ND Cell | No stem cell ingredient. It is a brand name |
| anti-aging | Hyaluronic acid in **Snow Booster** | Not present |
| hydration | Panthenol and allantoin in the **Barrier Cream** | Neither |
| hydration | Panthenol in the **Hydro Soothing Cream** | Not present |
| sensitive | Centella, panthenol, hyaluronic acid in **Snow Booster** | None of the three |
| sensitive | Panthenol and **madecassoside** in All For Sensitive | Neither. Madecassoside is in product 26, at 1 ppm |
| sensitive | Ceramides in the **Postcream** | Not present |
| sensitive | Hyaluronic acid in the **cleanser** | Not present |

The pattern is the one found across the whole range: the recognisable ingredient gets
named, and the one actually present at a working dose — **zinc PCA, betaine, ceramide NP,
MultiEx BSASM Plus** — goes unmentioned. Zinc PCA is the active in all three Problem
Control products and appeared in none of them.

Two further claims were wrong rather than absent: adenosine described as **"relaxes
facial muscles"** (that is an injectable's mechanism, not adenosine's), and a
**"triple-weight hyaluronic acid"** that is not the manufacturer's complex — Hyaluronan 11
is eleven molecular-weight grades mapped onto eight INCI names, and the cream's carton
prints the dose of each.

### Rewritten

All seven now build from `scripts/protocols/protocolContent.ts` through a shared template,
so the house style and the letterhead live in one place. Each carries a **retraction block
naming the claims it used to make**, on the precedent of the product pages.

Prices were the one thing the old documents got right: every price and every set total was
re-verified against the live records and all were correct.

Each document also gained the thing its subject most needed and did not have:

- **acne** — zinc PCA at its three real concentrations, and that the peeling gel contains no acid
- **pigmentation** — the printed vitamin doses, and that sunscreen is the step that decides the outcome
- **scar** — what actually carries the soothing (dipotassium glycyrrhizate 0.200%, not EGF)
- **anti-aging** — glycerin at 25.45% as the serum's real headline, and the peanut oil disclosure on ND Cell
- **hydration** — the fill-then-seal logic, with the carton's own per-grade hyaluronate doses
- **sensitive** — **a list of which products are fragranced**, which is the single most useful fact for reactive skin and was missing entirely
- **sun** — that the product with *more* filter rates *lower*, and the octinoxate 7.50% disclosure

### Letterhead

All seven previously had **no letterhead at all**. They now carry the correct entity from
`lib/siteConfig.ts` — Genosys Middle East FZ-LLC at VUET0209 Al Hulaila, current phone —
rather than the "Genosys Middle FZ-LLC" at the superseded Al Hamra address that the
hair-loss PDF had.

`fileSize` updated for all seven in `lib/concernsData.ts` (they had drifted: declared
160–190 KB against actual 257–282 KB).

## Verified

- `tsc --noEmit` and `eslint` clean.
- All eight protocol PDFs serve 200 as `application/pdf`.
- No banned claim survives in any rebuilt document except inside its own retraction block.
- Device records and both translation files scanned clean for treatment, growth,
  stimulation and circulation claims.

Superseded PDFs kept in `/tmp/protocol-backup/` for this session;
`~/Desktop/Protocol_Hair_Loss_SUPERSEDED_2026-08-18.pdf` is the durable copy of the worst
of them.

## ★ Adjacent, not done — needs a decision

Five other concern pages use "Treatment" the same way the hair-loss page did, in the `h1`
that renders on the page:

| Page | h1 |
|---|---|
| acne-treatment | "Acne & Blemish **Treatment**" |
| pigmentation | "Pigmentation & Skin Brightening **Treatment**" |
| scars-treatment | "Scar **Treatment** & Skin Repair" |
| anti-aging | "Anti-Aging & Wrinkle **Treatment**" |
| sensitivity | "Sensitive Skin Care & Soothing **Treatment**" |

These are milder than "hair loss treatment" — they are common retail category language —
but they are the same construction over cosmetics that treat nothing. Changing them
affects search rankings, so it is a commercial call rather than a correction.
