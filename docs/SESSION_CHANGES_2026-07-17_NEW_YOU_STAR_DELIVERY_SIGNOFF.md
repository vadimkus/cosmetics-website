# NEW YOU STAR — delivery signoff (invoice 04830)

**Date:** 2026-07-17  
**Order:** PARTW2607160539  
**Invoice:** **04830** / **2,970.00 AED**  
**Customer:** NEW YOU STAR BEAUTY HEALTH CLINIC L.L.C  
**Delivery:** Dubai Science Park Towers, North Tower 4th Floor, Al Barsha  
**Payment:** 30 days → due **2026-08-16**

## PDF

`~/Desktop/orders/Delivery-Signoff-04830-NEW-YOU-STAR.pdf`

## Script

```bash
node --import dotenv/config scripts/generate-delivery-signoff.js \
  --invoice 04830 \
  --header "$HOME/Desktop/orders/Header.png" \
  --stamp "$HOME/Desktop/orders/Stamp.png" \
  --delivered-on 2026-07-17 \
  --delivered-to "Dubai Science Park Towers, North Tower 4th Floor, Al Barsha, Dubai" \
  --payment-days 30 \
  --out "$HOME/Desktop/orders/Delivery-Signoff-04830-NEW-YOU-STAR.pdf"
```
