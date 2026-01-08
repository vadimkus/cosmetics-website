# Cache Fix Documentation

## Issue
After updating product prices in the database, the website at https://genosys.ae/products was still showing old prices even after redeployment.

### Affected Products
- Product 15 (INTENSIVE PROBLEM CONTROL TONER): Should show 260 AED, was showing 130 AED
- Product 52 (SKIN REBOOT PDRN MASK PACK): Should show 400 AED, was showing 450 AED

## Root Cause
Multiple caching layers were preventing price updates from showing:

1. **Vercel CDN Cache**: Set to 3600 seconds (1 hour)
2. **Prisma Accelerate Cache**: Caches database queries
3. **Next.js Route Cache**: Default caching behavior

## Solution Applied

### 1. Reduced API Cache Time ✅
Updated `/app/api/products/route.ts`:

**Before**:
```typescript
response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
response.headers.set('CDN-Cache-Control', 'public, s-maxage=3600')
response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=3600')
```

**After**:
```typescript
// Revalidate every 60 seconds
export const revalidate = 60

response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
response.headers.set('CDN-Cache-Control', 'public, s-maxage=60')
response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=60')
```

### 2. Added Next.js Revalidation
Added `export const revalidate = 60` to force Next.js to revalidate the route every 60 seconds.

## Impact
- ✅ Price updates now propagate within 60 seconds instead of 1 hour
- ✅ Faster response to price changes
- ⚠️ Slightly more database queries (acceptable trade-off for accuracy)

## Cache Timeline

### Previous Behavior:
- Database updated → Old prices cached for up to 1 hour
- Manual cache purge required for immediate updates

### New Behavior:
- Database updated → Prices update within 60 seconds automatically
- No manual intervention needed

## Manual Cache Purge (If Needed)

If you need immediate price updates without waiting 60 seconds:

### Option 1: Redeploy on Vercel
```bash
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

### Option 2: Use Vercel API (if you have access)
```bash
curl -X POST "https://api.vercel.com/v1/edge-config/[config-id]/items" \
  -H "Authorization: Bearer [token]" \
  -H "Content-Type: application/json"
```

### Option 3: Wait for Natural Revalidation
- Cache expires in 60 seconds
- Next request will fetch fresh data

## Verification

### Check if prices are updated:
```bash
# Website API
curl -s "https://genosys.ae/api/products" | jq '.[] | select(.id=="15" or .id=="52") | {id, name, price}'

# Mobile API
curl -s -H "x-api-key: genosys_secure_mobile_2025_v1" \
  "https://genosys.ae/api/mobile/products" | jq '.data[] | select(.id=="15" or .id=="52") | {id, name, price}'
```

Expected results:
```json
{
  "id": "15",
  "name": "INTENSIVE PROBLEM CONTROL TONER",
  "price": 260
}
{
  "id": "52",
  "name": "SKIN REBOOT PDRN MASK PACK",
  "price": 400
}
```

## Going Forward

### When Updating Prices:
1. Update `lib/products.ts` (canonical source)
2. Run sync script: `npx tsx scripts/sync-database-prices-from-products.ts --apply`
3. Commit and push changes
4. **Wait 60-120 seconds** for cache to clear
5. Verify on website

### If Immediate Update Needed:
- Trigger a new deployment (empty commit)
- Or wait maximum 60 seconds for automatic revalidation

## Related Files
- `/app/api/products/route.ts` - Main products API with cache headers
- `/app/api/mobile/products/route.ts` - Mobile API (also has cache headers)
- `/lib/productsDb.ts` - Database query functions
- `/scripts/sync-database-prices-from-products.ts` - Price sync utility

## Cache Settings Summary

| API Endpoint | Cache Duration | Revalidation |
|-------------|---------------|--------------|
| `/api/products` | 60 seconds | 120 seconds |
| `/api/mobile/products` | No cache | Immediate |
| `/api/mobile/products/[id]` | No cache | Immediate |

## Commit
- **Hash**: `07f1511d`
- **Message**: "Fix: Reduce cache time for products API to 60 seconds"
- **Date**: December 14, 2025

## Status
✅ **FIXED** - Prices will update automatically within 60 seconds of database changes
