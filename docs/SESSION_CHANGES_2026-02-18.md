# Session Changes — February 18, 2026

## Summary

Created comprehensive professional microneedling protocols for Clinic 971 and added the PDF to the training section of the website.

---

## 1. Clinic 971 Microneedling Protocols

### What was created

A complete professional protocol document (`CLINIC_971_MICRONEEDLING_PROTOCOLS.md`) covering **8 microneedling protocols** built around the **Carboxy Therapy (EZ CO₂ MASK) + Power Solution Ampoules** core system.

### Protocols

| # | Protocol | Primary Ampoule | Needle Depth | Sessions |
|---|----------|----------------|-------------|----------|
| 1 | Anti-Wrinkle | AWS (±CTS) | 0.5–1.0 mm | 4–6 × q4w |
| 2 | Anti-Pigmentation | SWS | 0.25–0.5 mm | 6–8 × q2-3w |
| 3 | Acne & Blemish Control | PCS | 0.25–0.5 mm | 6–8 × q2-3w |
| 4 | Skin Rejuvenation | CVS + HES | 0.5–1.0 mm | 4–6 × q3-4w |
| 5 | SRS Peeling Combination | Varies | 0.5 mm | 4–6 × q4w |
| 6 | Hydration Rescue | HES | 0.5 mm | 3–4 × q2-3w |
| 7 | Neck & Décolleté Anti-Aging | AWS + CTS | 0.25–0.5 mm | 4–6 × q4w |
| 8 | Eye Area Rejuvenation | AWS (½ vial) | 0.25 mm | 4–6 × q4w |

### Document contents

- Power Solutions overview table (all 6 ampoules: AWS, SWS, PCS, HES, CVS, CTS)
- Supporting GENOSYS products reference (carboxy, SRS peeling, masks, recovery creams)
- Needle depth reference by facial area
- Standard session flow and time budgeting
- Each protocol: step-by-step, "Why This Works" rationale, home care program
- Contraindications & safety (absolute and relative)
- Emergency kit checklist
- Printable quick reference card

### Files

| File | Purpose |
|------|---------|
| `docs/protocols/CLINIC_971_MICRONEEDLING_PROTOCOLS.md` | Source markdown |
| `public/documents/PPT/GENOSYS_Microneedling_Protocols.pdf` | PDF for download |

---

## 2. Training Page — New Document Added

Added "Microneedling Protocols (Carboxy + Power Solutions)" to the training section.

### Files modified

| File | Change |
|------|--------|
| `app/training/TrainingClient.tsx` | Added document entry to `trainingDocuments` array |
| `app/api/mobile/training/route.ts` | Added document entry with EN/AR/RU descriptions |

### How it appears

- Listed under **Training Documents** section on `/training`
- Available in mobile app via training API
- Download URL: `/documents/ppt/GENOSYS_Microneedling_Protocols.pdf`

---

## 3. PPT Case-Sensitivity Investigation

### Finding

- Folder on disk (macOS): `public/documents/PPT/` (uppercase)
- Folder in git index: `public/documents/ppt/` (lowercase)
- macOS is case-insensitive, so both work locally
- Vercel (Linux) is case-sensitive and checks out what git tracks → `ppt/` (lowercase)
- **Conclusion:** The existing lowercase `/documents/ppt/` URLs are correct for production. No change needed.

### Note for future

If the folder ever needs to be truly renamed in git, use:
```bash
git mv public/documents/ppt public/documents/ppt_tmp
git mv public/documents/ppt_tmp public/documents/PPT
```
This is the only way to change case on a case-insensitive filesystem with git.

---

## Commits

| Hash | Message |
|------|---------|
| `efc8e091` | add microneedling protocols to training section |

---

*Session: February 18, 2026*
