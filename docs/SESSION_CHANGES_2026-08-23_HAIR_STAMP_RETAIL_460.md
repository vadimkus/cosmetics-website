# Hair Stamp retail — MoySklad 460 (2026-08-23)

**SKU:** MoySklad `00141` · website product **64**

## Source of truth: MoySklad

| List | AED |
|------|----:|
| розничная (retail) | **460** |
| оптовая (clinic) | **230** |

Website and DB were **600** from the 15 Jun 2026 create script (`scripts/create-hairstamp-hairgen-booster-20260615.ts`). That figure was never on the MoySklad card (retail 460 / clinic 230). The June clinic CSV **370** was a third, stale list.

## Changes

- Production DB `products.price` **600 → 460**
- `lib/products.ts` fallback 460
- Chatbot catalogue line 460
- HairGen Booster / Hair-GENTRON running-cost copy: stamp **57.50** (460÷8), session **150** (92.50+57.50)
- Clinic CSV `00141` **370 → 230**
- ISR cache key `product-by-id-v65` → `v66`
- Lodyana SO **GENCardM260823LODY** Hair Stamp **370 → 230**; total **540 → 400**

Live cart/PDP stay on 600 until the next deploy (ISR ~5 min + cache key). Mobile API reads DB and should show 460 now.

Scripts:
- `scripts/set-product-64-retail-price-460.ts`
- `scripts/moysklad-amend-lodyana-hairstamp-price-20260823.js --commit`
