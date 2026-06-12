# Session Changes — Dependency Audit to Zero Vulnerabilities

**Date:** 2026-06-12
**Scope:** `package.json` (new `overrides` block) + `package-lock.json`. No application code touched.
**Result:** `npm audit` went from 8 findings (3 high, 5 moderate) to **0 vulnerabilities**.

## What was fixed and how

| Package | Severity | Chain | Fix | Resolved version |
|---|---|---|---|---|
| `@grpc/grpc-js` | high | `@google-cloud/translate` → `google-gax` | plain `npm audit fix` (non-breaking patch) | 1.14.4 |
| `tar` | high (path-traversal CVEs) | `pdfjs-dist` → optional `canvas` → `@mapbox/node-pre-gyp` | override `"tar": "^7.5.16"` | 7.5.16 (lockfile) |
| `@hono/node-server` | moderate | `prisma` → `@prisma/dev` (dev CLI, pinned exact 1.19.11) | override `"@hono/node-server": "1.19.13"` | 1.19.13 |
| `postcss` | moderate | bundled inside `next` (pinned 8.4.31) | override `"postcss": "$postcss"` (aligns nested copy to our direct dep `^8.5.6`) | 8.5.15 |

Notes:

- The `tar`/`canvas` chain is **optional and not even installed** on dev or Vercel (canvas native build is skipped) — the override sanitizes the lockfile entry that `npm audit` flags. tar v7 vs the `^6` range node-pre-gyp requests is only relevant if canvas ever compiles from source, which doesn't happen in this deployment.
- `@hono/node-server` is Prisma's local dev-server tooling (`prisma dev`), never deployed; 1.19.13 is the patched release of the same minor.
- `postcss` was previously npm's "fix" suggestion of downgrading to Next 9 — the `$postcss` reference override is the correct mechanism: Next's nested copy now resolves to the project's own patched postcss.

## Verification

- `npm audit`: **found 0 vulnerabilities**
- `tsc --noEmit` clean, full `next build` passed, Jest 29 suites / 248 tests passed
- Visual check of `/products` on the local prod build — Tailwind/PostCSS pipeline renders identically (postcss is the one override that touches the build pipeline)

## Maintenance note

The `overrides` block should be revisited (and ideally removed) when:

- `prisma` ships `@prisma/dev` with hono ≥1.19.13 (remove the hono override)
- `next` bumps its bundled postcss to ≥8.5.10 (remove the postcss override)
- `pdfjs-dist`/`canvas` move to node-pre-gyp with tar 7 (remove the tar override)

Check with `npm audit` + `npm ls <pkg>` after major framework upgrades.
