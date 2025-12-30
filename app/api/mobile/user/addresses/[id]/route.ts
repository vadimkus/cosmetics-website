import { NextRequest, NextResponse } from 'next/server'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { findUserByEmail } from '@/lib/userStorageDb'
import { prisma } from '@/lib/prisma'
import { debugLog, errorLog } from '@/lib/logger'

/**
 * Mobile User Address Endpoint (Single Address)
 * 
 * PUT /api/mobile/user/addresses/:id - Update specific address
 * DELETE /api/mobile/user/addresses/:id - Delete specific address
 */

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now()
  const { id } = await params
  debugLog('[MOBILE_ADDRESSES] Update address request started', { addressId: id })

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

    // Verify address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: id,
        userId: user.id
      }
    })

    if (!existingAddress) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Address not found' 
        },
        { status: 404 }
      )
    }

    // Parse request body
    const body = await request.json()

    // Prepare update data
    const updateData: {
      type?: string
      label?: string | null
      name?: string
      phone?: string
      addressLine1?: string
      addressLine2?: string | null
      city?: string
      emirate?: string
      country?: string
      isDefault?: boolean
    } = {}

    if (body.type !== undefined) {
      const validTypes = ['home', 'work', 'other']
      if (!validTypes.includes(body.type)) {
        return NextResponse.json(
          { 
            success: false, 
            error: `type must be one of: ${validTypes.join(', ')}` 
          },
          { status: 400 }
        )
      }
      updateData.type = body.type
    }

    if (body.label !== undefined) {
      updateData.label = body.label?.trim() || null
    }

    if (body.name !== undefined) {
      if (!body.name || !body.name.trim()) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'name cannot be empty' 
          },
          { status: 400 }
        )
      }
      updateData.name = body.name.trim()
    }

    if (body.phone !== undefined) {
      if (!body.phone || !body.phone.trim()) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'phone cannot be empty' 
          },
          { status: 400 }
        )
      }
      updateData.phone = body.phone.trim()
    }

    if (body.addressLine1 !== undefined) {
      if (!body.addressLine1 || !body.addressLine1.trim()) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'addressLine1 cannot be empty' 
          },
          { status: 400 }
        )
      }
      updateData.addressLine1 = body.addressLine1.trim()
    }

    if (body.addressLine2 !== undefined) {
      updateData.addressLine2 = body.addressLine2?.trim() || null
    }

    if (body.city !== undefined) {
      if (!body.city || !body.city.trim()) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'city cannot be empty' 
          },
          { status: 400 }
        )
      }
      updateData.city = body.city.trim()
    }

    if (body.emirate !== undefined) {
      if (!body.emirate || !body.emirate.trim()) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'emirate cannot be empty' 
          },
          { status: 400 }
        )
      }
      updateData.emirate = body.emirate.trim()
    }

    if (body.country !== undefined) {
      updateData.country = body.country || 'United Arab Emirates'
    }

    // If setting as default, unset other defaults
    if (body.isDefault === true) {
      await prisma.address.updateMany({
        where: { 
          userId: user.id, 
          isDefault: true,
          id: { not: id } // Don't update the current address
        },
        data: { isDefault: false }
      })
      updateData.isDefault = true
    } else if (body.isDefault === false && existingAddress.isDefault) {
      // If unsetting default and this was the default, we need to set another as default
      // Find another address to make default
      const otherAddress = await prisma.address.findFirst({
        where: {
          userId: user.id,
          id: { not: id }
        },
        orderBy: { createdAt: 'desc' }
      })
      
      if (otherAddress) {
        await prisma.address.update({
          where: { id: otherAddress.id },
          data: { isDefault: true }
        })
      }
      
      updateData.isDefault = false
    }

    // Update address
    const updatedAddress = await prisma.address.update({
      where: { id: id },
      data: updateData
    })

    debugLog('[MOBILE_ADDRESSES] Update address completed', Date.now() - startTime, 'ms')
    
    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
      data: {
        id: updatedAddress.id,
        type: updatedAddress.type,
        label: updatedAddress.label,
        name: updatedAddress.name,
        phone: updatedAddress.phone,
        addressLine1: updatedAddress.addressLine1,
        addressLine2: updatedAddress.addressLine2,
        city: updatedAddress.city,
        emirate: updatedAddress.emirate,
        country: updatedAddress.country,
        isDefault: updatedAddress.isDefault
      }
    })

  } catch (error) {
    errorLog('[MOBILE_ADDRESSES] Update address error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now()
  const { id } = await params
  debugLog('[MOBILE_ADDRESSES] Delete address request started', { addressId: id })

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

    // Verify address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: id,
        userId: user.id
      }
    })

    if (!existingAddress) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Address not found' 
        },
        { status: 404 }
      )
    }

    // If deleting the default address, set another as default
    if (existingAddress.isDefault) {
      const otherAddress = await prisma.address.findFirst({
        where: {
          userId: user.id,
          id: { not: id }
        },
        orderBy: { createdAt: 'desc' }
      })
      
      if (otherAddress) {
        await prisma.address.update({
          where: { id: otherAddress.id },
          data: { isDefault: true }
        })
      }
    }

    // Delete address
    await prisma.address.delete({
      where: { id: id }
    })

    debugLog('[MOBILE_ADDRESSES] Delete address completed', Date.now() - startTime, 'ms')
    
    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully'
    })

  } catch (error) {
    errorLog('[MOBILE_ADDRESSES] Delete address error:', error)
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
      'Access-Control-Allow-Methods': 'PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
    },
  })
}


