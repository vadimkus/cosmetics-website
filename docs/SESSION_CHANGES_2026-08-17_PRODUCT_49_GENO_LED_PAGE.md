# Product 49 — GENO-LED IR II — bespoke page

**Date:** 17 Aug 2026
**Page:** https://genosys.ae/products/49
**Audit:** `SESSION_CHANGES_2026-08-17_PRODUCT_49_GENO_LED_SOURCE_AUDIT.md`

## Why this one

It is the only device in the catalogue and the most expensive thing on the site
at AED 5,500, and it was still rendering the generic PDP while forty-odd
cosmetics had bespoke editorial pages. A clinic director deciding on a
five-figure-dirham purchase was getting a paragraph of run-on spec text.

## The page

New `components/product/genoled/`: the page, the copy in three languages and a
palette. Registered in `bespokePdp.tsx` and added to the three route
allow-lists.

Built on the shared editorial system, but device-shaped rather than
cosmetic-shaped — no shade selector, no INCI, no retail routine. Section order:

| Section | Content |
|---|---|
| Hero | Gallery, the five wavelengths as coloured dots, price, quantity, enquiry link beside the CTA |
| Stats | 1,710 LEDs · 5 wavelengths · 70 W · 2.6 kg |
| The five modes | One card per wavelength with its own irradiance, dose and time |
| **Dosimetry** | The full table: irradiance, standard dose, time and dose range per mode |
| Combining | Colour-plus-infrared runs together; red-plus-colour alternates every 3 s |
| The unit | Dome geometry, diode density, portability, no consumables |
| Protocols | Four documented sequences, then the five products they are built on |
| The study | The Biomedicines citation, with the caveat |
| Running a session | Four steps, beside the product video |
| Safety, spec, FAQ, reviews, closing band, sticky bar | As every sibling page |

**The dosimetry table is the point of the page.** Irradiance in mW/cm² and
fluence in J/cm² for each of the five wavelengths, read off brochure slides 5–7.
Nothing else in the catalogue publishes those numbers and no competing listing
in this market publishes them at all, which makes it the one section a
clinician cannot get anywhere else.

The protocol pairing rail reuses `BESPOKE_COMPANIONS`, the map the Power
Solution pages already use, with `'49': ['13', '7', '6', '9', '37']` — SRS, PCS,
CTS, AWS and the Peptide Gel Mask, the five products named in the manufacturer's
own documented protocols.

## The citation

Brochure slide 18 is a screenshot of a published paper, and it holds up:

> Gentile et al., *Platelet-Rich Plasma and Micrografts Enriched with Autologous
> Human Follicle Mesenchymal Stem Cells Improve Hair Re-Growth in Androgenetic
> Alopecia.* Biomedicines 2019, 7(2), 27.

Figure 1 is captioned "During Low level led therapy treatment performed by
Geno-Led". Verified against MDPI, PMC6631937 and the author's own copy.

The page states it and then immediately states its limit: in that study the
light was an adjunct given after PRP and micrograft injections, not the
intervention being measured. It shows the device is used in serious clinical
work. It does not show that light alone regrows hair, and the paper does not
claim it does. Selling the citation harder than that would be selling something
the source contradicts.

## Claims removed

Three came off the page and one off the database record:

- **"Relief of herpes zoster in early stage"** (brochure slide 11). Shingles is
  a viral disease with an antiviral pathway. Not ours to imply.
- **"Prevention of wound infection"** (slide 11). An infection-prevention claim
  belongs to a regulated device dossier.
- **"Increase of synthesis rate of DNA in body"** (slide 13). Unfalsifiable, and
  it reads as filler beside real dosimetry.
- **"Less than 10% output loss after 20,000 hours"**, which was on the stored
  record. It is in neither the IR II brochure nor the registration pack we hold.
  Removed rather than left unsourced; it goes back the day the manufacturer
  confirms it.

"Destruction of acne bacteria" was softened rather than dropped — blue light
acting on *C. acnes* is the accepted mechanism and the device is sold on it, so
the page says what the wavelength is used for without promising destruction.

## Record changes

`scripts/update-product-49-geno-led-record-20260817.ts`, applied:

- Dropped the unsourced durability claim.
- Added the dosimetry, treatment times, rated power, dimensions and the mode
  combination rules to `productDetails`, which previously held no dose data at
  all — that now reaches the API and the mobile app too.
- Rewrote all three descriptions. Russian and Arabic were a third the length of
  the English one and named none of the hardware.
- Corrected one benefit line: the edema wording is not in the IR II pack, so it
  now credits red and infrared with circulation, which is.

`lib/productsDb.ts` cache key bumped `v37 → v38`.

## Verified

- `tsc --noEmit` clean, no lint errors, `next build` compiled.
- Full jest suite: 68 suites, 490 passed, 3 skipped, 0 failing.
- All five dosimetry rows re-read off the rendered brochure pages rather than
  copied from the July note, and all five match.
- Rendered at `/products/49`, `/ru/products/49` and `/ar/products/49`. The
  protocol rail resolves all five products; in Arabic the table mirrors, the
  units stay left-to-right, and the spectrum bar flips.

## Open

**The device needs photography.** There is exactly one product shot on file,
956 × 662, and no gallery. The only other stills available are the 2019
first-generation unit — a different device with different numbers — and the
brochure's own orange-branded slides, which would fight the layout. The page is
built to work with one shot plus the video, but three or four real images of the
IR II would improve it more than any further copy.

**The ten clinical cases were left off deliberately.** They are patient
before-and-afters on slides 19–27. The brochure carrying them is already
downloadable from the page, but putting patient faces on the website is a
consent question rather than a design one, so it needs Vadim's call.
