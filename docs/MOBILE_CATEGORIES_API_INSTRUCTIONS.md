# Mobile Categories API Endpoint - Exact Implementation Instructions

## Overview
Add a `/api/mobile/categories` endpoint to return all unique product categories for the mobile app.

---

## Step 1: Create the API Route File

**File Path:** `app/api/mobile/categories/route.ts`

**Full Code:**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog, debugLog } from '@/lib/logger'

/**
 * Mobile API Endpoint for Categories
 * GET /api/mobile/categories
 * 
 * Authentication: Requires x-api-key header matching MOBILE_APP_KEY
 * Returns: List of all unique product categories
 * 
 * ✅ FEATURES:
 * - Returns distinct categories from products table
 * - Filters out hidden products
 * - Alphabetically sorted
 * - API key authentication
 */

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Security: Validate API Key
    const apiKey = request.headers.get('x-api-key')
    const expectedKey = process.env.MOBILE_APP_KEY
    
    if (!expectedKey) {
      errorLog('[MOBILE_API_CATEGORIES] MOBILE_APP_KEY environment variable not configured')
      return NextResponse.json(
        { 
          success: false, 
          error: 'API service unavailable' 
        },
        { status: 503 }
      )
    }
    
    if (!apiKey || apiKey !== expectedKey) {
      debugLog('[MOBILE_API_CATEGORIES] Unauthorized access attempt:', {
        providedKey: apiKey ? 'PROVIDED' : 'MISSING',
        userAgent: request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for') || 'unknown'
      })
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized - Invalid or missing API key' 
        },
        { status: 401 }
      )
    }
    
    debugLog('[MOBILE_API_CATEGORIES] Authenticated request - fetching categories')
    
    // Query distinct categories from products
    const rows = await prisma.product.findMany({
      select: { category: true },
      where: { 
        isHidden: false, // Only include visible products
        category: { not: null }
      },
      distinct: ['category']
    })
    
    // Process and sort categories
    const categories = rows
      .map((r) => (r.category ?? '').trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
    
    const duration = Date.now() - startTime
    debugLog(`[MOBILE_API_CATEGORIES] SUCCESS: Retrieved ${categories.length} categories in ${duration}ms`)
    
    return NextResponse.json({
      success: true,
      data: categories,
      meta: {
        count: categories.length,
        timestamp: new Date().toISOString(),
        processingTime: `${duration}ms`
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'public, s-maxage=300',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
      }
    })
    
  } catch (error) {
    const duration = Date.now() - startTime
    errorLog('[MOBILE_API_CATEGORIES] Database error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`,
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error - Unable to fetch categories' 
      },
      { status: 500 }
    )
  }
}

/**
 * Handle unsupported HTTP methods
 */
export async function POST() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}
```

---

## Step 2: Test the Endpoint

### Using curl:

```bash
curl -H "x-api-key: YOUR_MOBILE_APP_KEY" \
  https://genosys.ae/api/mobile/categories
```

### Expected Response:

```json
{
  "success": true,
  "data": [
    "Anti-aging",
    "Cleansers",
    "Cushion BB",
    "Eye Care",
    "Masks",
    "Moisturizers",
    "Scalp/Hair",
    "Serums",
    "Sun",
    "Toners"
  ],
  "meta": {
    "count": 10,
    "timestamp": "2025-12-14T10:30:00.000Z",
    "processingTime": "45ms"
  }
}
```

---

## Step 3: Update Mobile App

### Flutter/Dart Example:

```dart
Future<List<String>> fetchCategories() async {
  final response = await http.get(
    Uri.parse('https://genosys.ae/api/mobile/categories'),
    headers: {'x-api-key': 'YOUR_MOBILE_APP_KEY'},
  );
  
  if (response.statusCode == 200) {
    final data = json.decode(response.body);
    return List<String>.from(data['data']);
  } else {
    throw Exception('Failed to load categories');
  }
}
```

### React Native Example:

```javascript
const fetchCategories = async () => {
  const response = await fetch('https://genosys.ae/api/mobile/categories', {
    headers: { 'x-api-key': 'YOUR_MOBILE_APP_KEY' }
  });
  
  const json = await response.json();
  return json.data; // Array of category strings
};
```

---

## Schema Confirmation

✅ Your schema uses `product.category: String` (not a separate Category table)

From your `prisma/schema.prisma`:
```prisma
model Product {
  id            String   @id @default(cuid())
  productNumber String?  @unique
  name          String
  price         Float
  description   String   @db.Text
  image         String
  category      String   // ← String field, not a relation
  inStock       Boolean  @default(true)
  isHidden      Boolean  @default(false)
  // ... other fields
  
  @@index([category]) // Index exists for faster queries
  @@map("products")
}
```

---

## Features

✅ **Authentication:** Uses same x-api-key pattern as `/api/mobile/products`  
✅ **Filtering:** Only returns categories from visible products (`isHidden: false`)  
✅ **Deduplication:** Uses Prisma's `distinct` to get unique categories  
✅ **Sorting:** Alphabetically sorted for consistent display  
✅ **Caching:** 5-minute cache with 10-minute stale-while-revalidate  
✅ **Error Handling:** Matches existing mobile API error patterns  
✅ **Logging:** Uses `debugLog` and `errorLog` from `@/lib/logger`  

---

## Notes

- Categories with multiple values (e.g., "Cushion BB, Sun") are returned as-is
- If you want to split comma-separated categories, add this processing:

```typescript
const categories = rows
  .flatMap((r) => (r.category ?? '').split(',').map(c => c.trim()))
  .filter(Boolean)
  .filter((v, i, a) => a.indexOf(v) === i) // Remove duplicates
  .sort((a, b) => a.localeCompare(b))
```

---

## Deployment

After creating the file:

1. Commit the changes:
   ```bash
   git add app/api/mobile/categories/route.ts
   git commit -m "Add mobile categories API endpoint"
   git push origin main
   ```

2. Vercel will auto-deploy the new endpoint

3. Test in production:
   ```bash
   curl -H "x-api-key: YOUR_KEY" https://genosys.ae/api/mobile/categories
   ```

---

## Summary

**Endpoint:** `GET /api/mobile/categories`  
**Authentication:** `x-api-key` header  
**Response Format:** `{ success: true, data: string[], meta: {...} }`  
**Cache Duration:** 5 minutes (300 seconds)  
**Pattern:** Matches existing mobile API architecture  

The endpoint is production-ready and follows your existing patterns! 🚀
