import { NextRequest, NextResponse } from 'next/server'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { findUserByEmail } from '@/lib/userStorageDb'
import { debugLog, errorLog } from '@/lib/logger'
import { prisma } from '@/lib/database'

/**
 * Mobile User Wishlist Endpoint (DB-backed — wishlist_items table)
 *
 * GET    /api/mobile/user/wishlist                    - Get user's wishlist
 * POST   /api/mobile/user/wishlist                    - Add item to wishlist
 * DELETE /api/mobile/user/wishlist?productId=xxx      - Remove item from wishlist
 *
 * Headers Required:
 * - x-api-key: Mobile app API key
 * - Authorization: Bearer <jwt_token>
 *
 * GET returns LIVE product data (name/image/price re-read from the products
 * table) so favorites never show stale prices; items whose product has been
 * hidden or deleted are dropped from the response.
 */

async function authenticate(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  const authHeader = request.headers.get('Authorization')
  const token = extractTokenFromHeader(authHeader)

  const authValidation = validateMobileAuth(apiKey, token)
  if (!authValidation.valid) {
    return {
      error: NextResponse.json(
        { success: false, error: authValidation.error },
        { status: authValidation.status || 500 }
      ),
    }
  }
  if (!authValidation.payload) {
    return {
      error: NextResponse.json(
        { success: false, error: 'Authentication token required' },
        { status: 401 }
      ),
    }
  }

  const user = await findUserByEmail(authValidation.payload.email)
  if (!user) {
    return {
      error: NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      ),
    }
  }

  return { user }
}

async function findProductByAnyId(productId: string) {
  return prisma.product.findFirst({
    where: { OR: [{ id: productId }, { productNumber: productId }] },
  })
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_WISHLIST] Get wishlist request started')

  try {
    const auth = await authenticate(request)
    if (auth.error) return auth.error
    const user = auth.user

    const rows = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' },
    })

    if (rows.length === 0) {
      return NextResponse.json({ success: true, data: [] })
    }

    // Enrich with LIVE product data; drop items whose product is gone/hidden
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { id: { in: rows.map(r => r.productId) } },
          { productNumber: { in: rows.map(r => r.productId) } },
        ],
      },
    })
    const productByKey = new Map<string, (typeof products)[number]>()
    for (const p of products) {
      productByKey.set(p.id, p)
      if (p.productNumber) productByKey.set(p.productNumber, p)
    }

    const items = []
    const deadRowIds: string[] = []
    for (const row of rows) {
      const product = productByKey.get(row.productId)
      if (!product) {
        deadRowIds.push(row.id)
        continue
      }
      if (product.isHidden) continue // keep the row; product may return
      items.push({
        id: row.id,
        productId: row.productId,
        productName: product.name,
        productImage: product.image,
        productPrice: product.price,
        inStock: product.inStock,
        addedAt: row.createdAt.toISOString(),
      })
    }

    // Self-heal: purge rows pointing at deleted products
    if (deadRowIds.length > 0) {
      prisma.wishlistItem
        .deleteMany({ where: { id: { in: deadRowIds } } })
        .catch(err => errorLog('[MOBILE_WISHLIST] Dead-row cleanup failed:', err))
    }

    debugLog('[MOBILE_WISHLIST] Get wishlist completed', Date.now() - startTime, 'ms')
    return NextResponse.json({ success: true, data: items })
  } catch (error) {
    errorLog('[MOBILE_WISHLIST] Get wishlist error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_WISHLIST] Add to wishlist request started')

  try {
    const auth = await authenticate(request)
    if (auth.error) return auth.error
    const user = auth.user

    const { productId } = await request.json()

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'productId is required' },
        { status: 400 }
      )
    }

    const product = await findProductByAnyId(productId)
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Idempotent add — @@unique([userId, productId]) makes duplicates a no-op
    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Product already in wishlist' },
        { status: 409 }
      )
    }

    const row = await prisma.wishlistItem.create({
      data: { userId: user.id, productId },
    })

    debugLog('[MOBILE_WISHLIST] Add to wishlist completed', Date.now() - startTime, 'ms')
    return NextResponse.json(
      {
        success: true,
        message: 'Product added to wishlist',
        data: {
          id: row.id,
          productId: row.productId,
          productName: product.name,
          productImage: product.image,
          productPrice: product.price,
          addedAt: row.createdAt.toISOString(),
        },
      },
      { status: 201 }
    )
  } catch (error) {
    errorLog('[MOBILE_WISHLIST] Add to wishlist error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_WISHLIST] Remove from wishlist request started')

  try {
    const auth = await authenticate(request)
    if (auth.error) return auth.error
    const user = auth.user

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'productId query parameter is required' },
        { status: 400 }
      )
    }

    const result = await prisma.wishlistItem.deleteMany({
      where: { userId: user.id, productId },
    })

    if (result.count === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found in wishlist' },
        { status: 404 }
      )
    }

    debugLog('[MOBILE_WISHLIST] Remove from wishlist completed', Date.now() - startTime, 'ms')
    return NextResponse.json({
      success: true,
      message: 'Product removed from wishlist',
    })
  } catch (error) {
    errorLog('[MOBILE_WISHLIST] Remove from wishlist error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
    },
  })
}
