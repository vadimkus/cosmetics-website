# Mobile web header unification — 26 Aug 2026

Commit `59f0f605`.

## Why

Each page built its own header, so the three repeated parts had drifted. The bag
title was serif 17px, the account title sans 16px, checkout sans 16px in a cool
grey. The signed-in avatar was rose on the profile stack, `red-600` on checkout
and skin recommendation, ink on terms and privacy. The back link came in three
reds at two sizes.

## The canonical set

| Part | Value | Reference |
|---|---|---|
| Title | `text-[17px] font-semibold text-[var(--cera-ink)]` | the native app's `T.navTitle` |
| Avatar, signed in | `bg-[var(--cera-ink)]` | the site header on the shop pages |
| Avatar, signed out | `bg-[var(--cera-muted)]`, no green dot | — |
| Back link | `text-[var(--cera-rose-ink)]` at `text-[15px]` | — |

Applied across the 20 headers carrying `mweb-float-sticky-top`, block-scoped to
the 30 lines below each header so identical strings elsewhere in the same file
were left alone. One exception was caught in review and reverted: the error
message in `app/profile/addresses/add/page.tsx` keeps `text-red-600`.

Two headers keep their own shape on purpose: the bundle builder's centred
overlay title, and the PDP locale bar, which has no title at all.

## Also fixed

Terms and privacy are public pages but drew a filled avatar with a green online
dot regardless of session, claiming a sign-in that did not exist. Both are now
conditional on `user`, matching the bag.

## Scope note

The floating shape of these bars is gated to mobile web
(`@media (max-width: 767px) and (display-mode: browser)`), but the colours and
type here are not — they render in the PWA too, which is intended.
