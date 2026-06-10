# Session: TONETRENDZ consignment agreement PDF

**Date:** 2026-06-09

## Files (Desktop)

Folder: `/Users/vadimkus/Desktop/Drive/Genosys/Contract_Customers/Toner_Trends/`

| File | Purpose |
|------|---------|
| `Genosys_Consignment_Agreement_TONETRENDZ.md` | Signing markdown (Agreement **36**) |
| `Genosys_Consignment_Agreement_TONETRENDZ.pdf` | PDF for signature |
| `Genosys_Consignment_Agreement_TONETRENDZ.html` | Intermediate (pandoc) |

## Customer details in agreement

- **TONETRENDZ LADIES COSMETIC & PERSONAL CARE CENTER L.L.C**
- Agreement **No. 36** · **9 June 2026**
- Salon: JVC, Binghatti Azure, Dubai
- License office: Office 214, Gita Shaira Offices, Arjan
- License **1626587** (1 Jun 2026 – 31 May 2027)
- Contact: **Madalina Bogdan** · +971 55 551 2913
- TRN: not yet registered
- Scope: **retail home-care consignment only**; pro consumables = paid invoice

## PDF build

```bash
pandoc Genosys_Consignment_Agreement_TONETRENDZ.md -s \
  -c file:///Users/vadimkus/cosmetics-website/docs/reference/consignment-agreement-pdf.css \
  -o Genosys_Consignment_Agreement_TONETRENDZ.html

"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=Genosys_Consignment_Agreement_TONETRENDZ.pdf \
  file://.../Genosys_Consignment_Agreement_TONETRENDZ.html
```

MoySklad contract **36** matches agreement number in PDF.
