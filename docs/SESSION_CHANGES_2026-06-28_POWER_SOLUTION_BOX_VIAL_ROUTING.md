# Session — Power Solution box → vial routing on MoySklad push

**Date:** 2026-06-28  
**Context:** Hamza Ahmed retail order — SWS + HES boxes @ 580 AED each + 2 free masks, total **1,160 AED**. Push failed because MoySklad has **no box stock** (`00019` SWS box, `00070` HES box).

## Problem

Website sells Power Solution as **10-vial boxes** (580 AED retail). Warehouse tracks **individual vials** (`00020` SWS, `00071` HES, etc.). Admin **Push to MoySklad** mapped directly to box SKUs → stock error.

## Solution

Automatic explosion on push (same pattern as beauty boxes):

| Website line | MoySklad pick |
|---|---|
| POWER SOLUTION SWS ×1 @ 580 | `00020` SWS 1 Vial × **10** @ **58** AED |
| POWER SOLUTION HES ×1 @ 580 | `00071` HES 1 Vial × **10** @ **58** AED |

All six Power Solution types supported (AWS, SWS, CVS, HES, PCS, CTS).

## Code

- `lib/moyskladPowerSolutionExplosion.ts` — **1 box = 10 vials**, price = box ÷ 10
- `lib/moysklad.ts` — vial UUIDs in `PRODUCT_MAP`; push loop explodes before mapping
- `__tests__/lib/moyskladPowerSolutionExplosion.test.ts`
- `docs/MOYSKLAD_INTEGRATION.md` — documented

## Hamza Ahmed order (after fix)

- Customer: Hamza Ahmed · guntane2024@gmail.com · +971554488923 · Baniyas square Al ghurair building 602, Dubai
- Order number: **CODM2606285937** · total **1,160 AED** · COD
- Lines: SWS box + HES box + free collagen mask + free sea algae mask
- **Action:** Re-click **Push to MoySklad** in admin

### 2026-06-28 push error (HTTP 412 duplicate name)

First push created MoySklad order **CODM2606285937** + invoice **04732** (box SKUs, no shipment — box stock). Web DB had no `moySkladOrderId` saved → retry hit duplicate `name`.

**Fix applied:**
- Orphan chain trashed (invoice 04732 + order)
- `prepareMoySkladOrderForPush()` — finds orphan by orderNumber, trashes incomplete chain before re-push
- `trashMoySkladOrderChain()` — paymentin → demand → invoice → order
- `getMoySkladOrderSyncStatus()` — **complete** only when shipment (demand) exists, not invoice alone

Re-push will book **vials** (00020×10 + 00071×10), not boxes.

## Prior manual precedent

- Ammar Mohammad (2026-06-14): SWS booked as vials when box out of stock — `scripts/moysklad-create-ammar-mohammad-sws-order-20260614.js`
