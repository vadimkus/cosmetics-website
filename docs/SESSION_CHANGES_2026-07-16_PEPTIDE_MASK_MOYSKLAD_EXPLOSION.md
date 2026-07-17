# Peptide Gel Mask — MoySklad pack explosion + Genesis re-push (2026-07-16)

## Problem

Website sells **PEPTIDE GEL MASK** as a **5-mask pack**. MoySklad stocks **singles** (`00012`); box SKU `00016` is empty. Admin push mapped to the box → incomplete docs / failed sync.

Genesis partner order **PARTW2607160539** (AED **2,970**) failed with:
`Could not remove incomplete MoySklad documents for PARTW2607160539`.

## Fix

New module: `lib/moyskladPeptideGelMaskExplosion.ts` (same pattern as Power Solution vials).

- 1 web pack → **5 × `00012`** (`PEPTIDE GEL MASK 39G SINGLE`)
- Unit price = pack price ÷ 5 (clinic **190 → 38**; retail **380 → 76**)
- Wired in `lib/moysklad.ts` before product mapping
- Tests: `__tests__/lib/moyskladPeptideGelMaskExplosion.test.ts`

## Genesis re-push

| Field | Value |
|-------|-------|
| Order | **PARTW2607160539** |
| Customer | Genesis Healthcare Center |
| Total | **2,970 AED** |
| Lines | 5× Power Solution boxes @ 290 + Peptide pack ×**8** @ 190 |
| MoySklad peptide | `00012` ×**40** @ 38 AED |
| SO | `361f8c3d-8130-11f1-0a80-0dc40023a524` |
| Invoice | **04831** (new) |
| Shipment | **06555** (new) |

Script: `scripts/moysklad-repush-partw2607160539-genesis-20260716.ts --commit`

Orphan SO + invoice **04830** from the failed push were deleted, then re-created clean.
