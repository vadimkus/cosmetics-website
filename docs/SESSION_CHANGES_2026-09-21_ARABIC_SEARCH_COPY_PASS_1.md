# Arabic search copy, pass 1 (21 Sep 2026)

## Data (Search Console, 22 Jun to 19 Sep 2026, via `scripts/gsc.js`)

- Site: 2,068 query/page rows, 13,022 impressions, 677 clicks.
- Arabic-script queries: 74 rows, 288 impressions (2.2%), 2 clicks.
- Arabic pages ranking 8 to 20: 18 rows, 6 pages with more than one impression.

Arabic search is a small channel today. The pass below matches the phrasings
people actually typed on the pages that already show up; it does not invent
new pages.

## What searchers typed vs what the page said

| Query (imp, pos) | Page | Gap |
|---|---|---|
| فوائد حبوب ماتريكس للشعر (30, 10) | /ar/products/43, /45 | People expect pills ("حبوب"). Page never said what form it is. |
| واقي شمس sun cream (13, 5-12) | /ar/products/39 | Mixed-script phrasing absent; page opened with lab figures. |
| واقي الشمس الكوري / واقي شمس كوري / sunscreen كوري (24, 9-24) | /ar/guides/korean-sunscreen-uae | Title and H1 said "لمناخ دبي", never "كوري". |
| كريم ريفيتا (10, 14) | /ar/products/63 | Transliteration "ريفيتا" absent. |
| هيرجن / هير بوستر ادفانس (11, 10) | /ar/products/3 | Transliteration "هيرجن بوستر" absent. |

## Changes

- Product 39, 63, 43, 45 (`data/product*LocalizedCopy.ts`) and 3
  (`data/productTranslations.ts`): a query-matched lead sentence at the top of
  the Arabic description, which is also the first 150 chars of the AR meta
  description. 43 and 45 say plainly that the product is a tonic / ampoule, not
  pills, then continue with the audited copy. Nothing after the lead changed.
- Sunscreen guide AR (`lib/seoLandingPagesAr.ts`): title, description, H1 and
  intro now lead with "واقي شمس كوري" and the mixed-script "sunscreen كوري";
  first FAQ reworded to the typed question; one FAQ added on
  sunscreen vs sun block naming, citing ULTRA SHIELD SPF 50+ PA++++ (registered
  rating on the pack); keywords extended.
- Claims unchanged. All figures already on the pages (SPF 50+ PA++++, SPF 38
  PA+++) come from the registered labels.

## Skipped on purpose

- ژل لایه بردار آنزیمی ژنوسیس (68 imp, pos 62): Persian, not Arabic; no Farsi
  route exists. Noted for later.
- أوكسي جينيو للوجه الشارقة (53 imp): OxyGeneo is a competitor treatment, not a
  GENOSYS product; the locations page is the wrong answer and should not chase it.
- Pigmentation serum guide: already positions 5.8 to 7.6; left alone.

## Measure

Re-run the same query on 19 Oct and 16 Nov and compare position and CTR for
the five query/page pairs above.
