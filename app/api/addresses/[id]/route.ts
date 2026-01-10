import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { findUserByEmail, findUserById } from '@/lib/userStorageDb'
import { debugLog, errorLog } from '@/lib/logger'
import { handleApiError, handleUnauthorizedError, handleNotFoundError } from '@/lib/apiErrorHandler'

// Helper to get user from session cookie
async function getUserFromSession(request: NextRequest) {
  const sessionCookie = request.cookies.get('genosys_session')
  
  if (!sessionCookie) {
    return null
  }

  try {
    const sessionData = JSON.parse(sessionCookie.value)
    
    if (!sessionData.email && !sessionData.id) {
      return null
    }

    const user = sessionData.id
      ? await findUserById(sessionData.id)
      : await findUserByEmail(sessionData.email)
    
    return user
  } catch (error) {
    errorLog('Error parsing session cookie:', error)
    return null
  }
}

// GET - Fetch a specific address
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getUserFromSession(request)
    
    if (!user) {
      return handleUnauthorizedError()
    }

    const address = await prisma.address.findFirst({
      where: { id, userId: user.id }
    })

    if (!address) {
      return handleNotFoundError('Address')
    }

    return NextResponse.json({ address })
  } catch (error) {
    return handleApiError(error, 'ADDRESS_GET')
  }
}

// PUT - Update an address
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getUserFromSession(request)
    
    if (!user) {
      return handleUnauthorizedError()
    }

    // Verify the address belongs to the user
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId: user.id }
    })

    if (!existingAddress) {
      return handleNotFoundError('Address')
    }

    const body = await request.json()
    const { type, name, phone, addressLine1, addressLine2, city, emirate, country, isDefault } = body

    // If this address is set as default, unset all other defaults
    if (isDefault && !existingAddress.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false }
      })
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        type: type || existingAddress.type,
        name: name?.trim() || existingAddress.name,
        phone: phone?.trim() || existingAddress.phone,
        addressLine1: addressLine1?.trim() || existingAddress.addressLine1,
        addressLine2: addressLine2 !== undefined ? (addressLine2?.trim() || null) : existingAddress.addressLine2,
        city: city?.trim() || existingAddress.city,
        emirate: emirate?.trim() || existingAddress.emirate,
        country: country || existingAddress.country,
        isDefault: isDefault !== undefined ? isDefault : existingAddress.isDefault
      }
    })

    debugLog('[ADDRESSES_API] Updated address:', id, 'for user:', user.email)

    return NextResponse.json({ address, success: true })
  } catch (error) {
    return handleApiError(error, 'ADDRESS_PUT')
  }
}

// DELETE - Delete an address
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getUserFromSession(request)
    
    if (!user) {
      return handleUnauthorizedError()
    }

    // Verify the address belongs to the user
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId: user.id }
    })

    if (!existingAddress) {
      return handleNotFoundError('Address')
    }

    await prisma.address.delete({
      where: { id }
    })

    debugLog('[ADDRESSES_API] Deleted address:', id, 'for user:', user.email)

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error, 'ADDRESS_DELETE')
  }
}
