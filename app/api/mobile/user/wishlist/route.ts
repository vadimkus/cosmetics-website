import { NextRequest, NextResponse } from 'next/server'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { findUserByEmail } from '@/lib/userStorageDb'
import { debugLog, errorLog } from '@/lib/logger'
import { prisma } from '@/lib/database'

/**
 * Mobile User Wishlist Endpoint
 * 
 * GET /api/mobile/user/wishlist - Get user's wishlist
 * POST /api/mobile/user/wishlist - Add item to wishlist
 * DELETE /api/mobile/user/wishlist?productId=xxx - Remove item from wishlist
 * 
 * Headers Required:
 * - x-api-key: Mobile app API key
 * - Authorization: Bearer <jwt_token>
 */

// Wishlist item interface
interface WishlistItem {
  id: string
  productId: string
  productName: string
  productImage: string
  productPrice: number
  addedAt: string
}

// In-memory wishlist storage (you may want to add a Wishlist table to your schema later)
const userWishlists = new Map<string, WishlistItem[]>()

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_WISHLIST] Get wishlist request started')

  try {
    // Extract API key and JWT token
    const apiKey = request.headers.get('x-api-key')
    const authHeader = request.headers.get('Authorization')
    const token = extractTokenFromHeader(authHeader)

    // Validate API key and token
    const authValidation = validateMobileAuth(apiKey, token)
    
    if (!authValidation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: authValidation.error
        },
        { status: authValidation.status || 500 }
      )
    }

    if (!authValidation.payload) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication token required' 
        },
        { status: 401 }
      )
    }

    const tokenPayload = authValidation.payload

    // Verify user exists
    const user = await findUserByEmail(tokenPayload.email)
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found' 
        },
        { status: 404 }
      )
    }

    // Get user's wishlist
    const wishlist = userWishlists.get(user.id) || []

    debugLog('[MOBILE_WISHLIST] Get wishlist completed', Date.now() - startTime, 'ms')
    
    return NextResponse.json({
      success: true,
      data: wishlist
    })

  } catch {
    errorLog('[MOBILE_WISHLIST] Get wishlist error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_WISHLIST] Add to wishlist request started')

  try {
    // Extract API key and JWT token
    const apiKey = request.headers.get('x-api-key')
    const authHeader = request.headers.get('Authorization')
    const token = extractTokenFromHeader(authHeader)

    // Validate API key and token
    const authValidation = validateMobileAuth(apiKey, token)
    
    if (!authValidation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: authValidation.error
        },
        { status: authValidation.status || 500 }
      )
    }

    if (!authValidation.payload) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication token required' 
        },
        { status: 401 }
      )
    }

    const tokenPayload = authValidation.payload

    // Verify user exists
    const user = await findUserByEmail(tokenPayload.email)
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found' 
        },
        { status: 404 }
      )
    }

    // Parse request body
    const { productId, productName, productImage, productPrice } = await request.json()

    // Validate required fields
    if (!productId || !productName || !productImage || productPrice === undefined) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: productId, productName, productImage, productPrice' 
        },
        { status: 400 }
      )
    }

    // Verify product exists in database
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Product not found' 
        },
        { status: 404 }
      )
    }

    // Get user's current wishlist
    const wishlist = userWishlists.get(user.id) || []

    // Check if item already in wishlist
    const existingItem = wishlist.find(item => item.productId === productId)
    if (existingItem) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Product already in wishlist' 
        },
        { status: 409 }
      )
    }

    // Add item to wishlist
    const newItem: WishlistItem = {
      id: `wishlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productId,
      productName,
      productImage,
      productPrice: Number(productPrice),
      addedAt: new Date().toISOString()
    }

    wishlist.push(newItem)
    userWishlists.set(user.id, wishlist)

    debugLog('[MOBILE_WISHLIST] Add to wishlist completed', Date.now() - startTime, 'ms')
    
    return NextResponse.json({
      success: true,
      message: 'Product added to wishlist',
      data: newItem
    }, { status: 201 })

  } catch {
    errorLog('[MOBILE_WISHLIST] Add to wishlist error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_WISHLIST] Remove from wishlist request started')

  try {
    // Extract API key and JWT token
    const apiKey = request.headers.get('x-api-key')
    const authHeader = request.headers.get('Authorization')
    const token = extractTokenFromHeader(authHeader)

    // Validate API key and token
    const authValidation = validateMobileAuth(apiKey, token)
    
    if (!authValidation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: authValidation.error
        },
        { status: authValidation.status || 500 }
      )
    }

    if (!authValidation.payload) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication token required' 
        },
        { status: 401 }
      )
    }

    const tokenPayload = authValidation.payload

    // Verify user exists
    const user = await findUserByEmail(tokenPayload.email)
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found' 
        },
        { status: 404 }
      )
    }

    // Get productId from query parameters
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'productId query parameter is required' 
        },
        { status: 400 }
      )
    }

    // Get user's current wishlist
    let wishlist = userWishlists.get(user.id) || []

    // Find and remove item
    const initialLength = wishlist.length
    wishlist = wishlist.filter(item => item.productId !== productId)

    if (wishlist.length === initialLength) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Product not found in wishlist' 
        },
        { status: 404 }
      )
    }

    // Update wishlist
    userWishlists.set(user.id, wishlist)

    debugLog('[MOBILE_WISHLIST] Remove from wishlist completed', Date.now() - startTime, 'ms')
    
    return NextResponse.json({
      success: true,
      message: 'Product removed from wishlist'
    })

  } catch {
    errorLog('[MOBILE_WISHLIST] Remove from wishlist error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
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
