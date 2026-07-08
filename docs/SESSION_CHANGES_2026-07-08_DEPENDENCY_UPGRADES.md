# Session: Dependency upgrades — website (2026-07-08)

Companion to `genosys-mobile-app/docs/SESSION_CHANGES_2026-07-08_expo-sdk57-upgrade.md`.

## Starting point

`npm audit`: **0 vulnerabilities**. Core stack already current (Next 16, React 19.2, Prisma 7.8, Tailwind 4, Sentry 10, Stripe 22, Jest 30).

## Upgraded

| Package | From → To | Notes |
|---|---|---|
| ai + @ai-sdk/openai + @ai-sdk/react | 6/3/3 → 7/4/4 | Chat + skin-analysis APIs (`streamText`, `generateText`, `useChat`) type-compatible, no code changes |
| lucide-react | 0.543 → 1.23 | Brand icons (Instagram/Facebook/Chrome) dropped upstream — original glyphs preserved in `components/icons/BrandIcons.tsx`, 8 import sites updated |
| expo-server-sdk | 5 → 6 | Push payloads unchanged (`lib/expoPush.ts` compiles clean) |
| jsdom | 27 → 29 | dev/test only |
| cssnano | 7 → 8 | build only |
| sharp | 0.34 → 0.35 | |
| three | 0.184 → 0.185 | |
| @react-oauth/google | 0.12 → 0.13 | |
| pdfjs-dist | **removed** | Was an unused direct dep; `react-pdf` 10.4 bundles its own pdfjs 5.x |

## Deliberately skipped

- **TypeScript 6.0, ESLint 10** — released weeks ago, plugin ecosystem lags, no benefit yet
- **@types/node 26** — stays at 24.x to match the Node runtime

## Test suite repairs (pre-existing gaps, surfaced by the full run)

Six suites were failing for two reasons unrelated to the upgrades:
1. The loyalty engine (added this morning) made checkout routes import the real Prisma client → `jest.mock('@/lib/loyalty')` added to 4 suites
2. The Jul 6 security hardening added a DB-backed rate limiter and invoice owner/admin authorization that the tests never mocked → `jest.mock('@/lib/rateLimitSimple')` + admin-cookie mock added

Result: **31/31 suites, 253 tests passing**, production build compiles, deployed to Vercel.
