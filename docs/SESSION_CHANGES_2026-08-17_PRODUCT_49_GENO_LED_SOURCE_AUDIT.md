# Product 49 — GENO-LED IR II — source audit

Groundwork for the bespoke page. Every figure below is read from a source
document, not from the current site copy.

## Documents read

- `public/documents/ppt/GENO-LED IR II_2025.pdf` — the official 29-slide DTS MG
  brochure, also the file the page offers for download. Slides 4–7 carry the
  dosimetry as **image-embedded tables**, so they are not in the PDF text layer
  and have to be read off the rendered page.
- `~/Desktop/Drive/Genosys/Registration/Geno-led/` — Certificate of Conformity,
  the RF safety report `F690501_RF-SAF008301`, and a CE certificate for the
  adapter. All three are image-only scans with no text layer.
- `docs/SESSION_CHANGES_2026-07-22_geno-led-ir-ii-dosimetry.md` — the July pass
  that first pulled the dosimetry off slides 4–7. Every figure re-checked
  against the brochure for this audit and all of them match.
- Gentile et al., *Biomedicines* 2019, 7(2), 27 — see "The citation" below.

## Hardware, slide 4

| | GENO-LED IR | GENO-LED IR II |
|---|---|---|
| LEDs | 1,145 | **1,710** |
| Wavelengths | 423 / 532 / 583 / 640 / 830 nm | same |
| Rated power | 60 W | **70 W** |
| Size | 380 × 220 × 280 mm | **520 × 220 × 315 mm** |
| Weight | 1.9 kg | **2.6 kg** |

The 1,710 elements break down as 380 each of red, blue, green and yellow plus
190 infrared. Rated power is **electrical**; total optical output in watts is
not published anywhere in the brochure, so it cannot be stated.

## Dosimetry, slides 5–7

Read off the IR II column. The IR column beside it is the previous generation
and must not be quoted as this product.

| Mode | Irradiance | Wavelength | Standard dose | Treatment time | Dose range | Bandwidth |
|---|---|---|---|---|---|---|
| Red | 42 mW/cm² | 640 ±5 nm | 28 J/cm² | 5–60 min | 1–186 J/cm² | 20 ±5 nm |
| Blue | 46 mW/cm² | 423 ±5 nm | 28 J/cm² | 5–60 min | 1–152 J/cm² | 20 ±5 nm |
| Green | 15 mW/cm² | 532 ±5 nm | 9 J/cm² | 5–60 min | 1–52 J/cm² | 20 ±5 nm |
| Yellow | 11 mW/cm² | 583 ±5 nm | 7 J/cm² | 5–60 min | 1–39 J/cm² | 20 ±5 nm |
| Infrared | 15 mW/cm² | 830 ±5 nm | 12 J/cm² | 1–10 min | 1–56 J/cm² | 20 ±5 nm |

**This table is the page.** Nothing else on the site quotes irradiance and
fluence, and no competitor listing in this market publishes them at all. It is
the one thing a clinician buying a AED 5,500 device actually needs, and it is
verifiable.

Note the infrared row: 1–10 minutes, not 5–60 like the visible modes.

## How the modes combine, slide 15

- **A colour plus infrared runs simultaneously.** RED+IR, BLUE+IR, GREEN+IR,
  YELLOW+IR.
- **Red plus another colour alternates every three seconds.** RED+BLUE,
  RED+GREEN, RED+YELLOW. This is an alternation, not a pulsed duty cycle, and
  should not be described as one.
- Time is set in five-minute steps, a guidance message plays one minute before
  the end, and the unit switches itself off.
- Voice guidance in English, Korean and Chinese; language, volume and time are
  only settable in standby.

## Effects by wavelength, slide 11

Printed on the brochure, in the manufacturer's own words:

| | Brochure text | On the page? |
|---|---|---|
| Red 640 | cell regeneration, blood circulation, collagen and elastin, pain relief | yes |
| Blue 423 | destruction of acne bacteria, inhibition of sebaceous glands, prevention of wound infection, relief of breakouts | partly — see below |
| Green 532 | calming and soothing, sensitive skin, mind and body rest | yes |
| Yellow 583 | relief of redness, relief of erythema / rosacea, relief of herpes zoster in early stage | partly — see below |
| Infrared 830 | metabolism, blood circulation, collagen and elastin, wound healing | yes |

## What is not going on the page, and why

- **"Relief of herpes zoster in early stage."** Shingles is a viral disease with
  an antiviral treatment pathway. A distributor's product page is not the place
  to imply a light device treats it, whatever the brochure says.
- **"Prevention of wound infection."** Same reasoning: an infection-prevention
  claim belongs to a regulated medical device dossier, not to us.
- **"Increase of synthesis rate of DNA in body"** (slide 13). Not a mechanism
  anyone can check, and it reads as filler next to real dosimetry.
- **"Destruction of acne bacteria"** softened rather than dropped. Blue light
  acting on *C. acnes* is the accepted mechanism and the device is sold on it,
  but the page says what the wavelength is used for rather than promising
  destruction.
- **Any percentage improvement.** There is no efficacy trial in the pack. The
  ten before-and-after cases on slides 19–27 are photographs with protocol
  captions and no measurements attached.
- **First-generation figures.** The old `GENO-LED LEAFLET.pdf` in the artwork
  folder is the 1,145-LED device at 57.4 W. Do not mix its numbers, or its 2019
  product photography, into this page.

## The clinical cases, slides 19–27

Ten cases, all credited "Courtesy of Dr. Marija Boscovic", each captioned with
the protocol used. They are useful because they show the device inside real
GENOSYS protocols:

- acne: SRS → GENO-LED blue → PCS, then SRS → ALA mask + blue and red → PCC
- acne scarring: CTS or CVS + Dermafix, then Peptide Gel Mask + red
- one case pairs AWS + Dermafix with Peptide Gel Mask + red

**The photographs are not being copied onto the page.** They are patient
before-and-afters, and the brochure they sit in is already downloadable from
the page for anyone who wants them. The protocols themselves are worth stating,
because they cross-sell four products we stock: SRS (13), PCS (7), CTS (6),
AWS (9) and the Peptide Gel Mask (37).

## The citation

Slide 18 of the brochure is a screenshot of a published paper, and it checks
out:

> Gentile P, Scioli MG, Bielli A, De Angelis B, De Sio C, De Fazio D,
> Ceccarelli G, Trivisonno A, Orlandi A, Cervelli V, Garcovich S.
> *Platelet-Rich Plasma and Micrografts Enriched with Autologous Human Follicle
> Mesenchymal Stem Cells Improve Hair Re-Growth in Androgenetic Alopecia.*
> **Biomedicines 2019, 7(2), 27.** doi:10.3390/biomedicines7020027

Figure 1 is captioned "A non-smoker 58-year-old male patient classified
androgenetic alopecia (AGA) 3V according to Norwood–Hamilton Scale. **During
Low level led therapy treatment performed by Geno-Led.**" Verified against the
MDPI page, the PMC copy (PMC6631937) and the author's own PDF.

**State it precisely.** In that study LLLT was an adjunct given 15 days after
each PRP or HF-MSC injection and every three weeks afterwards, not the
intervention being measured. The honest claim is that this is the LLLT device a
Tor Vergata team used in a published androgenetic-alopecia protocol. It is not
"clinically proven to regrow hair", and writing that would be a lie the paper
itself contradicts.

## Pack and commercial

- AED 5,500, `noDiscount: true` on the record, in stock, category Device.
- One product photograph on file, `/images/LEDD.jpg`, 956 × 662, and a video at
  `/videos/led.mp4`. There is no gallery.
- **The device needs its own photography.** The only other stills available are
  the 2019 first-generation shots, which are the wrong unit, and the brochure's
  own slides, which are manufacturer-branded in orange and would fight the
  editorial layout. The page is built to work with one shot and the video, but
  three or four real images of the IR II would improve it more than any further
  copy would.
