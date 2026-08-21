# Native product review authentication fix

**Date:** 21 August 2026

## Root cause

The native app submitted product reviews to the website review endpoint without
the browser-only CSRF cookie and matching header. The endpoint therefore
returned HTTP 403 before reaching review validation or persistence.

## Fix

- Website review POST, PUT and DELETE now accept either:
  - the existing browser double-submit CSRF proof, or
  - the native app's API-key plus signed user JWT.
- Native identity is derived from the signed JWT. Any email supplied in a
  native request body or query string is ignored.
- Partial mobile credentials fail closed and do not fall back to browser CSRF.
- Website review behavior and CSRF protection remain unchanged.

## Verification

- Review-authentication unit tests: 3 passed.
- Focused ESLint: passed.
- Next.js production build: passed, including 449 static pages.
- Native iOS and Android Expo bundle exports: passed.
