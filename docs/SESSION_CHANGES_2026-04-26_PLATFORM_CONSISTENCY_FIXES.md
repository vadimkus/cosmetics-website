# Session Changes — Platform Consistency Fixes

Date: 2026-04-26

## Scope

Fixed the P1 platform-consistency items from the GPT-5.5 audit only. No pricing-policy, mobile API security, WebView auth, native app, or broader SEO/AI-search cleanup was changed in this pass.

## Changes

- Preserved Russian in client-side document attributes: `LocaleWrapper` now sets `html.lang="ru"` and `data-locale="ru"` on `/ru/*` routes instead of collapsing non-Arabic pages to English.
- Localized login redirects for product actions, recommendations, blog comments, product info CTAs, and profile auth redirects. Arabic routes now go to `/ar/login`, Russian routes to `/ru/login`, and English routes to `/login`.
- Aligned active PDP desktop/mobile visibility gates with the site-wide `md` breakpoint. The PDP already uses `md:grid-cols-2`; desktop-only product header, cart controls, trust badges, recommendations, and the sticky mobile footer now switch at the same breakpoint.
- Made PDP `ProductSchema` locale-aware by accepting `locale` and `canonicalUrl`, then emitting localized `url`, `offers.url`, and `inLanguage`.
- Cleaned one unused `catch` binding in the already-touched profile file so focused ESLint can run without errors.

## Verification

- `rg` confirmed no remaining plain `router.push('/login')` or `href="/login"` call sites in TypeScript/TSX.
- `rg` confirmed the active PDP client has no remaining `lg:hidden`, `hidden lg:block`, `lg:pb-0`, `lg:py-8`, or `lg:pt-0` mode gates.
- `ReadLints` reported no diagnostics on the edited files.
- `npx eslint` on the edited files completed with 0 errors and 1 pre-existing warning in `app/profile/page.tsx` (`user.contactEmail` dependency).
- Full `npm run lint` is still blocked by existing unrelated repo-wide lint errors.
- Full `npx tsc --noEmit` is still blocked by existing unrelated test typing errors.
