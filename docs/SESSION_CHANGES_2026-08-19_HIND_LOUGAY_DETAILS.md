# Hind Lougay — phone + address from order (2026-08-19)

**Customer:** Hind Lougay · `hlougay@gmail.com`  
**Source:** website COD **CODM2608193118** (2,320 AED)

The order and saved address already had contact details. The admin customer card was empty because it reads the legacy `users.phone` / `users.address` fields.

| | Before | After |
|--|--------|--------|
| Phone | — | **+971507806962** |
| Address | — | **Mohamed Bin Zayed Zone 14 Inshad Street Compound 23 Villa 28, Abu Dhabi** |

Also collapsed a double space on the default saved address line.

Script: `scripts/fix-hind-lougay-details-20260819.ts --commit`

## 2026-08-20 — phone is wrong

Called **+971 50 780 6962**. Voice said wrong number. Drafted email to `hlougay@gmail.com` asking for a working mobile and order confirmation before delivery.

Website order **CODM2608193118** was deleted 20 Aug. MoySklad kept as collagen ×1 @ 18, paid. See `SESSION_CHANGES_2026-08-20_HIND_LOUGAY_CODM3118.md`.

## 2026-08-20 — confirmed and restored

Hind replied from `hlougay@gmail.com` and confirmed **+971 50 708 6962** (`+971507086962`).
The earlier value had `780` instead of `708`.

Updated the confirmed phone in MoySklad and on the website user/address/order records.

Hind then supplied the original order confirmation. Final authoritative correction:

- **CODM2608193118** restored as a **2,320 AED COD order**
- SWS, HES, PCS and CVS ×1 kit each
- Collagen and Sea Algae masks ×1 each, free promo
- Website **PENDING / pending**
- MoySklad **Ждет доставки - Наличные**
- Erroneous payment **06101 / 18 AED** and 18 reward points removed

See `SESSION_CHANGES_2026-08-20_HIND_LOUGAY_CODM3118.md`.
