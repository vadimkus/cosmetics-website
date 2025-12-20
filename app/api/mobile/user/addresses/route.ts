import { NextRequest, NextResponse } from 'next/server'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { findUserByEmail } from '@/lib/userStorageDb'
import { prisma } from '@/lib/prisma'
import { debugLog, errorLog } from '@/lib/logger'

/**
 * Mobile User Addresses Endpoint
 * 
 * GET /api/mobile/user/addresses - Get user's saved addresses
 * POST /api/mobile/user/addresses - Create new address
 * PUT /api/mobile/user/addresses/:id - Update specific address
 * DELETE /api/mobile/user/addresses/:id - Delete specific address
 * 
 * Headers Required:
 * - x-api-key: Mobile app API key
 * - Authorization: Bearer <jwt_token>
 * 
 * Address format:
 * {
 *   type: "home" | "work" | "other",
 *   label?: string,
 *   name: string,
 *   phone: string,
 *   addressLine1: string,
 *   addressLine2?: string,
 *   city: string,
 *   emirate: string,
 *   country?: string (defaults to "United Arab Emirates"),
 *   isDefault?: boolean
 * }
 */

// Helper to parse legacy GENOSYS_ADDR_V1 format
function parseLegacyAddress(addressString: string | null): {
  type: string
  label?: string
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  emirate: string
  country: string
} | null {
  if (!addressString) return null
  
  const V1_PREFIX = 'GENOSYS_ADDR_V1:'
  if (addressString.startsWith(V1_PREFIX)) {
    try {
      const jsonPart = addressString.slice(V1_PREFIX.length)
      const obj = JSON.parse(jsonPart)
      return {
        type: obj.type || 'home',
        label: obj.label,
        name: obj.name || '',
        phone: obj.phone || '',
        addressLine1: obj.address || '',
        addressLine2: obj.addressLine2,
        city: obj.city || '',
        emirate: obj.emirate || '',
        country: obj.country || 'United Arab Emirates'
      }
    } catch {
      return null
    }
  }
  
  // Plain string - return as addressLine1
  return {
    type: 'home',
    name: '',
    phone: '',
    addressLine1: addressString,
    city: '',
    emirate: '',
    country: 'United Arab Emirates'
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_ADDRESSES] Get addresses request started')

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

    // Get user from database
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

    // Get addresses from Address table
    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    // If no addresses in Address table, check legacy User.address field for backward compatibility
    if (addresses.length === 0 && user.address) {
      const legacyAddress = parseLegacyAddress(user.address)
      if (legacyAddress) {
        // Return legacy address in expected format
        return NextResponse.json({
          success: true,
          data: [{
            id: 'legacy',
            type: legacyAddress.type,
            label: legacyAddress.label || 'Primary Address',
            name: legacyAddress.name,
            phone: legacyAddress.phone,
            addressLine1: legacyAddress.addressLine1,
            addressLine2: legacyAddress.addressLine2,
            city: legacyAddress.city,
            emirate: legacyAddress.emirate,
            country: legacyAddress.country,
            isDefault: true
          }]
        })
      }
    }

    // Format addresses for response
    const formattedAddresses = addresses.map(addr => ({
      id: addr.id,
      type: addr.type,
      label: addr.label,
      name: addr.name,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2,
      city: addr.city,
      emirate: addr.emirate,
      country: addr.country,
      isDefault: addr.isDefault
    }))
    
    debugLog('[MOBILE_ADDRESSES] Get addresses completed', Date.now() - startTime, 'ms')
    
    return NextResponse.json({
      success: true,
      data: formattedAddresses
    })

  } catch (error) {
    errorLog('[MOBILE_ADDRESSES] Get addresses error:', error)
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
  debugLog('[MOBILE_ADDRESSES] Create address request started')

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
    const body = await request.json()

    // Action: set default address (used by mobile "Set as default")
    if (body?.action === 'setDefault' && body?.id) {
      const id = String(body.id || '').trim()
      if (!id) {
        return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 })
      }
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false }
      })
      await prisma.address.update({
        where: { id },
        data: { isDefault: true }
      })
      return NextResponse.json({ success: true, data: { ok: true } })
    }

    // Support both new structured format and legacy format
    let addressData: {
      type: string
      label?: string
      name: string
      phone: string
      addressLine1: string
      addressLine2?: string
      city: string
      emirate: string
      country: string
      isDefault?: boolean
    }

    // Check if it's legacy format (address string with optional label)
    if (body.address && typeof body.address === 'string') {
      const legacyParsed = parseLegacyAddress(body.address)
      if (legacyParsed) {
        addressData = {
          ...legacyParsed,
          label: body.label || legacyParsed.label,
          isDefault: body.isDefault !== undefined ? body.isDefault : true
        }
      } else {
        // Plain string address
        addressData = {
          type: body.type || 'home',
          label: body.label,
          name: body.name || user.name || '',
          phone: body.phone || user.phone || '',
          addressLine1: body.address.trim(),
          addressLine2: body.addressLine2,
          city: body.city || '',
          emirate: body.emirate || '',
          country: body.country || 'United Arab Emirates',
          isDefault: body.isDefault !== undefined ? body.isDefault : true
        }
      }
    } else {
      // New structured format
      addressData = {
        type: body.type || 'home',
        label: body.label,
        name: body.name || user.name || '',
        phone: body.phone || user.phone || '',
        addressLine1: body.addressLine1 || '',
        addressLine2: body.addressLine2,
        city: body.city || '',
        emirate: body.emirate || '',
        country: body.country || 'United Arab Emirates',
        isDefault: body.isDefault !== undefined ? body.isDefault : false
      }
    }

    // Validate required fields
    if (!addressData.addressLine1 || !addressData.addressLine1.trim()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'addressLine1 is required' 
        },
        { status: 400 }
      )
    }

    if (!addressData.name || !addressData.name.trim()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'name is required' 
        },
        { status: 400 }
      )
    }

    if (!addressData.phone || !addressData.phone.trim()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'phone is required' 
        },
        { status: 400 }
      )
    }

    if (!addressData.city || !addressData.city.trim()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'city is required' 
        },
        { status: 400 }
      )
    }

    if (!addressData.emirate || !addressData.emirate.trim()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'emirate is required' 
        },
        { status: 400 }
      )
    }

    // Validate type
    const validTypes = ['home', 'work', 'other']
    if (!validTypes.includes(addressData.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `type must be one of: ${validTypes.join(', ')}` 
        },
        { status: 400 }
      )
    }

    // If this is set as default, unset other defaults
    if (addressData.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false }
      })
    }

    // Create new address
    const newAddress = await prisma.address.create({
      data: {
        userId: user.id,
        type: addressData.type,
        label: addressData.label ?? null,
        name: addressData.name.trim(),
        phone: addressData.phone.trim(),
        addressLine1: addressData.addressLine1.trim(),
        addressLine2: addressData.addressLine2?.trim() ?? null,
        city: addressData.city.trim(),
        emirate: addressData.emirate.trim(),
        country: addressData.country,
        isDefault: addressData.isDefault ?? false
      }
    })

    debugLog('[MOBILE_ADDRESSES] Create address completed', Date.now() - startTime, 'ms')
    
    return NextResponse.json({
      success: true,
      message: 'Address created successfully',
      data: {
        id: newAddress.id,
        type: newAddress.type,
        label: newAddress.label,
        name: newAddress.name,
        phone: newAddress.phone,
        addressLine1: newAddress.addressLine1,
        addressLine2: newAddress.addressLine2,
        city: newAddress.city,
        emirate: newAddress.emirate,
        country: newAddress.country,
        isDefault: newAddress.isDefault
      }
    }, { status: 201 })

  } catch (error) {
    errorLog('[MOBILE_ADDRESSES] Create address error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_ADDRESSES] Update address request started')

  try {
    const apiKey = request.headers.get('x-api-key')
    const authHeader = request.headers.get('Authorization')
    const token = extractTokenFromHeader(authHeader)

    const authValidation = validateMobileAuth(apiKey, token)
    if (!authValidation.valid) {
      return NextResponse.json({ success: false, error: authValidation.error }, { status: authValidation.status || 500 })
    }
    if (!authValidation.payload) {
      return NextResponse.json({ success: false, error: 'Authentication token required' }, { status: 401 })
    }

    const tokenPayload = authValidation.payload
    const user = await findUserByEmail(tokenPayload.email)
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const id = String(body?.id || '').trim()
    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 })
    }

    // Reuse the same parsing as POST by accepting legacy or structured payloads
    // If client sends legacy, `addressLine1` will be derived.
    const tmpRequest = {
      ...body,
      // allow clients that still send `address` instead of `addressLine1`
      addressLine1: body?.addressLine1 || body?.address || ''
    }

    const type = String(tmpRequest.type || 'home').trim().toLowerCase()
    const validTypes = ['home', 'work', 'other']
    if (!validTypes.includes(type)) {
      return NextResponse.json({ success: false, error: `type must be one of: ${validTypes.join(', ')}` }, { status: 400 })
    }

    const addressLine1 = String(tmpRequest.addressLine1 || '').trim()
    const name = String(tmpRequest.name || user.name || '').trim()
    const phone = String(tmpRequest.phone || user.phone || '').trim()
    const city = String(tmpRequest.city || '').trim()
    const emirate = String(tmpRequest.emirate || '').trim()
    const country = String(tmpRequest.country || 'United Arab Emirates').trim() || 'United Arab Emirates'
    const label = tmpRequest.label ? String(tmpRequest.label).trim() : null
    const addressLine2 = tmpRequest.addressLine2 ? String(tmpRequest.addressLine2).trim() : null
    const isDefault = tmpRequest.isDefault === true

    if (!addressLine1) return NextResponse.json({ success: false, error: 'addressLine1 is required' }, { status: 400 })
    if (!name) return NextResponse.json({ success: false, error: 'name is required' }, { status: 400 })
    if (!phone) return NextResponse.json({ success: false, error: 'phone is required' }, { status: 400 })
    if (!city) return NextResponse.json({ success: false, error: 'city is required' }, { status: 400 })
    if (!emirate) return NextResponse.json({ success: false, error: 'emirate is required' }, { status: 400 })

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false }
      })
    }

    const updated = await prisma.address.update({
      where: { id },
      data: {
        type,
        label,
        name,
        phone,
        addressLine1,
        addressLine2,
        city,
        emirate,
        country,
        isDefault
      }
    })

    debugLog('[MOBILE_ADDRESSES] Update address completed', Date.now() - startTime, 'ms')
    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    errorLog('[MOBILE_ADDRESSES] Update address error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_ADDRESSES] Delete address request started')

  try {
    const apiKey = request.headers.get('x-api-key')
    const authHeader = request.headers.get('Authorization')
    const token = extractTokenFromHeader(authHeader)

    const authValidation = validateMobileAuth(apiKey, token)
    if (!authValidation.valid) {
      return NextResponse.json({ success: false, error: authValidation.error }, { status: authValidation.status || 500 })
    }
    if (!authValidation.payload) {
      return NextResponse.json({ success: false, error: 'Authentication token required' }, { status: 401 })
    }

    const tokenPayload = authValidation.payload
    const user = await findUserByEmail(tokenPayload.email)
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const id = request.nextUrl.searchParams.get('id')
    if (id) {
      await prisma.address.delete({ where: { id: String(id) } })
      debugLog('[MOBILE_ADDRESSES] Delete address completed', Date.now() - startTime, 'ms')
      return NextResponse.json({ success: true, data: { ok: true } })
    }

    // If no id provided, clear all addresses (legacy behavior)
    await prisma.address.deleteMany({ where: { userId: user.id } })
    debugLog('[MOBILE_ADDRESSES] Delete addresses completed', Date.now() - startTime, 'ms')
    return NextResponse.json({ success: true, data: { ok: true } })
  } catch (error) {
    errorLog('[MOBILE_ADDRESSES] Delete address error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
    },
  })
}
