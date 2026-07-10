# CERABARRIER — MoySklad PRODUCT_MAP fix (2026-07-10)

**Issue:** Admin MoySklad push failed — `unmapped line items: CERABARRIER BIOME GEL CLEANSER (200ml)`.

**Cause:** Product 66 launched Jul 2026; MoySklad codes **54484** / **54485** existed but `lib/moysklad.ts` had no mapping.

## Fix

Added to `lib/moysklad.ts`:

| Map | Key | MoySklad |
|-----|-----|----------|
| `PRODUCT_MAP` | `CERABARRIER BIOME GEL CLEANSER` | 54484 (200ml default) |
| `SIZE_VARIANT_MAP` | `… \| 200ml` | `4403ccba-6ed1-11f1-0a80-16ec00a25b21` |
| `SIZE_VARIANT_MAP` | `… \| 600ml` | `44439568-6ed1-11f1-0a80-112d00a360a0` |

**Action:** Re-push the failed order from admin — should sync now.
