# Khadija Faidar — verified GENOSYS gift routine (2026-08-11)

Customer order: `CODM2608106779`.

Complimentary products:

- Skin Renewal Peeling System (SRS)
- Snow Booster
- Soothing Repair Postcream
- Microbiome Energy Infusing Mist

## Verification and correction

- SRS is labelled **PROFESSIONAL** and contains an AHA complex. It is not included in the customer's home-care routine and should only be used by a trained clinic professional.
- Snow Booster is a daily moisturizing/pH-balancing toner used after cleansing.
- Microbiome Mist must be shaken before use and sprayed from 10–20 cm with eyes closed; it may be used throughout the day and over makeup.
- Soothing Repair Postcream is the final cream step after toner/serum. It may be applied morning/evening or as needed. Its artwork says to avoid use during pregnancy/lactation.

Sources:

- `lib/products.ts`
- `public/documents/PPT/GENOSYS MICROBIOME ENERGY INFUSING MIST.pdf`
- Intertek artwork: `[GENOSYS]SKIN RENEWAL PEELIGN SYSTEM(SRS).pdf`
- Intertek artwork: `Artwork-GENOSYS SOOTHING REPAIR POSTCREAM 100g.pdf`

## Professional Meso-Homecare Protocol PDF (2026-08-11)

- Script: `scripts/khadija-professional-protocol-20260811.js` (playwright render)
- PDF: `~/Desktop/orders/GENOSYS_Khadija_Professional_Meso_Homecare_Protocol.pdf` (4 pages, Header.png letterhead, McKinsey-style)
- Structure: P1 cover + rules (meso once-weekly, SRS = professional-only); P2 Exhibit 1 daily AM/PM (Snow Booster → Hyaluron Serum → Postcream AM / Overnight Mask PM, SPF50, Mist anytime); P3 Exhibit 2 weekly meso-night alternating Week A = PDRN 5000 spicule ampoule / Week B = CTS + 0.5mm roller, mask + Postcream after; P4 Exhibit 3 roller hygiene, stop-conditions, 6-week calendar, expectations.
- Roller image: `/images/Second/roller1.jpg`; PDRN 5000 = spicule ampoule (no roller needed).

## Update — SRS added to the routine (2026-08-11, same evening)

- Per user request, SRS is now part of the program as a **monthly peel night** (purple track), replacing that week's meso-night; minimum 7-day gap to any roller/spicule session; patch test 24h before first use; 15–20 min per label; cool-water rinse; Postcream after; SPF 50 mandatory.
- 6-week calendar: W1 PDRN, W2 CTS, W3 PDRN, **W4 SRS peel**, W5 PDRN, W6 CTS.
- Page 3 rebuilt as 3 compact tracks (PDRN / CTS / SRS); cover rules updated ("SRS once a month, own evening, patch test"); page 4 SRS callout now usage cautions instead of clinic-only.
