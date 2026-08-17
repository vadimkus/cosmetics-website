# Genesis — delivery signoff (invoice 04830)

**Date:** 2026-07-18  
**Order:** PARTW2607160539  
**Invoice:** **04830** / **2,970.00 AED**  
**Customer:** Genesis Healthcare Centre FZ-LLC  
**Delivery:** Dubai Science Park Towers, North Tower 4th Floor, Al Barsha  
**Payment:** 30 days → due **2026-08-17**

## PDF

`~/Desktop/orders/Delivery-Signoff-04830-GENESIS.pdf`

## Script

```bash
node --import dotenv/config scripts/generate-delivery-signoff.js \
  --invoice 04830 \
  --header "$HOME/Desktop/orders/Header.png" \
  --stamp "$HOME/Desktop/orders/Stamp.png" \
  --delivered-on 2026-07-18 \
  --delivered-to "Dubai Science Park Towers, North Tower 4th Floor, Al Barsha, Dubai" \
  --payment-days 30 \
  --out "$HOME/Desktop/orders/Delivery-Signoff-04830-GENESIS.pdf"
```
