# Session Changes — 2026-07-05: Dependency Updates (Semver-Safe Tier)

## Scope

First tier of a staged dependency refresh for the production site. Only
semver-compatible (patch/minor) updates were applied — no majors.
Commit: `f6413941`.

## What was updated (website)

`npm update` across the board. Notable bumps:

| Package | From | To |
|---|---|---|
| next / eslint-config-next / @next/bundle-analyzer | 16.2.9 | 16.2.10 |
| react / react-dom | 19.2.3 | 19.2.7 |
| stripe | 22.2.2 | 22.3.0 |
| @sentry/nextjs | 10.57.0 | 10.63.0 |
| @playwright/test | 1.60.0 | 1.61.1 |
| framer-motion | 12.40.0 | 12.42.2 |
| @stripe/stripe-js / @stripe/react-stripe-js | 9.8.0 / 6.6.0 | 9.9.0 / 6.7.0 |
| tailwindcss / @tailwindcss/postcss | 4.3.1 | 4.3.2 |
| pg, openai, google-auth-library, next-intl, swr, zustand, react-pdf, pdfjs-dist (minor), jsdom (minor), tsx, postcss, cssnano (minor) | — | latest in-range |

## Stripe API version pin bump (required)

stripe-node 22.3.0 types the pinned `apiVersion` as `'2026-06-24.dahlia'`.
The four pinned sites were bumped from `2026-05-27.dahlia` in lockstep
(same Dahlia release train — additive changes only):

- `lib/stripe.ts`
- `app/api/mobile/checkout/stripe/route.ts`
- `app/api/mobile/payments/applepay/intent/route.ts`
- `app/api/mobile/payments/applepay/status/route.ts`

## Verification

- `tsc --noEmit` clean (the only error was the Stripe apiVersion literal,
  fixed above).
- Full production build: 433/433 static pages generated.
- Post-deploy smoke test: home / PDP / `/api/products` all 200; Stripe
  checkout + Apple Pay intent routes return 401 (auth gate) not 500 —
  modules initialize fine with the new SDK.
- **Recommended**: watch the next real order / run a small test payment to
  confirm end-to-end Stripe flow.

## Mobile app (genosys-mobile-app)

`npx expo install --check` → **"Dependencies are up to date"** for
Expo SDK 54. No changes shipped. `npm outdated` majors there (Expo 57,
RN 0.86, Sentry RN 8, Stripe RN 0.68, gesture-handler 3, async-storage 3)
all belong to the **Expo SDK 57 upgrade**, which is a separate project:
new native builds via EAS + App Store / Play review, not an OTA.

## Deferred majors (website) — each is its own deliberate upgrade

| Package | Current → Latest | Risk / notes |
|---|---|---|
| ai + @ai-sdk/* | 6 → 7 / 3 → 4 | Chat streaming APIs changed; needs functional test of chat |
| nodemailer | 8 → 9 | Order emails — test before trusting |
| pdfjs-dist | 4 → 6 | PDF viewer (brochures, invoices); react-pdf compat must match |
| lucide-react | 0.543 → 1.x | Icons sitewide; API mostly stable but large surface |
| expo-server-sdk | 5 → 6 | Push notifications to the app |
| @react-oauth/google | 0.12 → 0.13 | Google login flow |
| eslint | 9 → 10 | Dev-only; blocked until eslint-config-next supports 10 |
| typescript | 5.9 → 6.0 | Dev-only; wait for Next.js official support |
| jsdom | 27 → 29 | Check usage sites first |
| cssnano | 7 → 8 | Build-time CSS; visual diff advised |
| sharp | 0.34 → 0.35 | Image processing; treated as major by semver <1.0 |
| three | 0.184 → 0.185 | 3D viewer; 0.x = breaking allowed each minor |
| @types/node | 24 → 26 | Intentionally pinned to Node 24 runtime — do NOT bump |

## Environment note

- Machine `/usr/local/bin/node` is v16.16.0 (July 2022 .pkg install) and
  powers the running Homebridge service — do not delete casually. nvm
  default is 24.12.0 and repo `.nvmrc`/`engines` say 24, so interactive
  shells and CI are fine.
