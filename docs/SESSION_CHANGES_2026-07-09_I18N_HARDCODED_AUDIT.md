# Session Changes — 2026-07-09 — AR/RU Translation Audit + Fixes

## Audit Method

1. Extracted all 1,431 distinct `t('…')` keys used in `app/`, `components/`,
   `hooks/`, `lib/` and checked each against en/ar/ru.json.
2. Compared AR/RU values against EN to find untranslated copies.
3. Scanned customer-facing JSX for hardcoded English text nodes
   (admin, api, email-template, dev routes excluded).

## Results

### Key coverage: clean
- **0 keys missing in AR, 0 missing in RU** (out of 1,431 used).
- AR/RU values identical to EN are all intentional: brand/technical terms
  (GENOSYS, Google, Apple, Email, Face ID) and product names in routine
  titles (product names are English-only by policy).

### Fixed — customer-facing hardcoded English

1. **`components/pwa/PWAInstallPrompt.tsx`** (mounted in the root layout,
   shows on mobile in every locale): all 12 strings were hardcoded EN.
   Wired `useTranslation` + new `pwa.*` keys in en/ar/ru
   (installTitle/installSubtitle/benefit*/notNow/install/cardTitle/
   cardSubtitle/bannerTitle/bannerSubtitle).
2. **`components/PowerAnimalGame.tsx`** (skin-recommendation game, used on
   AR/RU routes): 3 loading lines translated via inline ternaries matching
   the file's existing style.
3. **`training.professionalTraining`** key was used but missing from all
   locale files (fell back to `|| 'Training Library'`) — added to en/ar/ru.

### Deleted — dead components full of hardcoded EN (zero importers)

`components/product/ProductDescription.tsx`,
`components/profile/{ProfileSettings,ProfileContent,ProfileInfo,
PersonalInfoSection,ProfileForm.backup}.tsx` + their `index.ts` barrel
exports + the orphaned `__tests__/components/ProfileInfo.test.tsx`.
These were legacy/unused and polluted every i18n audit.

### Left as-is (deliberate)

- Admin dashboards (Analytics, Advanced Reporting, User Segmentation,
  Blog/Product management, Customer Profile) — admin UI is English by design.
- Brand names: App Store, Google Play, Apple Pay, Google Pay.
- EN-only routes with no ar/ru siblings: `/certificates`,
  `/certificate/[code]`, `/pwa-demo`, guides internals (AR/RU guides have
  separate implementations). Localizing the gift-certificate pages would be
  a separate task if wanted.

### Test fix

`invoice-admin-pricing-integrity` suite broke this morning when the invoice
route started importing `LEGAL_INFO`/`SOCIAL_LINKS` — the suite's
`siteConfig` mock only provided `SITE_URL`. Mock extended; all 30 suites
pass (243 tests).
