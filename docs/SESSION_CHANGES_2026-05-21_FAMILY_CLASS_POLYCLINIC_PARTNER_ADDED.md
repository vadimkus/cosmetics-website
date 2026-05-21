# Family Class Polyclinic (Longevium) Partner Added

Date: 2026-05-21

## Request

Add `Family Class Polyclinic` (Triple 777 Center, Jumeirah 3 — phone `+971 4 563 8202`,
Instagram `@longevium.dubai`) to the partners list following the existing partner pattern.

## Change

- Added `FAMILY CLASS POLYCLINIC (LONGEVIUM), JUMEIRAH 3` entry to `lib/partners.ts`.
- Used the official Longevium clinic logo (downloaded from `longevium.clinic`) and saved it to
  `public/images/partners/family-class.png` (512x512 PNG).
- The clinic is licensed as "Family Class Polyclinic" but operates publicly as
  `Longevium` (longevity & metabolic health). Both names appear in the partner name so users
  recognize the brand on Instagram and on the licensing plate.
- Description matches the Longevium clinic positioning (longevity, molecular dermatology,
  peptide protocols, weight management, stem cell therapy, aesthetic gynecology).
- Website link points to the Longevium Dubai Instagram (`https://www.instagram.com/longevium.dubai`).
  The PartnerCard auto-detects Instagram and displays the `Instagram` button label.
- Directions link uses a Google Maps search for `Triple 777 Center Jumeirah 3 Dubai`.
- Theme: `emerald` (consistent with other clinics — KindCare, Hortman, Milyne, FAYY Health).

## Mobile App Visibility

The native mobile partners API (`/api/mobile/partners`) reads from `lib/partners.ts`, so this
partner is included in the mobile app feed automatically with no further changes.

## Filters

`PartnersList.tsx` auto-classifies this partner:
- Area pill: `Jumeirah` (matched on the word `Jumeirah` in the location string).
- Type pill: `Aesthetic clinics` (matched on `polyclinic` keyword).
