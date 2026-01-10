import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { findUserByEmail, findUserById } from '@/lib/userStorageDb'
import { errorLog, debugLog } from '@/lib/logger'
import { handleApiError, handleUnauthorizedError, handleValidationError } from '@/lib/apiErrorHandler'
import { verifySessionToken } from '@/lib/jwt'

// Helper to get user from session cookie
async function getUserFromSession(request: NextRequest) {
  const sessionCookie = request.cookies.get('genosys_session')
  
  if (!sessionCookie) {
    return null
  }

  try {
    // Use verifySessionToken which handles both JWT and legacy JSON formats
    const sessionData = verifySessionToken(sessionCookie.value)
    
    if (!sessionData || (!sessionData.email && !sessionData.id)) {
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

// GET - Fetch all addresses for the current user
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromSession(request)
    
    if (!user) {
      return handleUnauthorizedError()
    }

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    debugLog('[ADDRESSES_API] Fetched addresses for user:', user.email, 'count:', addresses.length)

    return NextResponse.json({ addresses })
  } catch (error) {
    return handleApiError(error, 'ADDRESSES_GET')
  }
}

// POST - Create a new address
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromSession(request)
    
    if (!user) {
      return handleUnauthorizedError()
    }

    const body = await request.json()
    const { type, name, phone, addressLine1, addressLine2, city, emirate, country, isDefault } = body

    // Validation
    if (!name || !phone || !addressLine1 || !city || !emirate) {
      const errors: Record<string, string[]> = {}
      if (!name) errors.name = ['Name is required']
      if (!phone) errors.phone = ['Phone is required']
      if (!addressLine1) errors.addressLine1 = ['Address line 1 is required']
      if (!city) errors.city = ['City is required']
      if (!emirate) errors.emirate = ['Emirate is required']
      return handleValidationError(errors)
    }

    // If this address is set as default, unset all other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false }
      })
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        type: type || 'home',
        name: name.trim(),
        phone: phone.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2?.trim() || null,
        city: city.trim(),
        emirate: emirate.trim(),
        country: country || 'United Arab Emirates',
        isDefault: isDefault || false
      }
    })

    debugLog('[ADDRESSES_API] Created address:', address.id, 'for user:', user.email)

    return NextResponse.json({ address, success: true })
  } catch (error) {
    return handleApiError(error, 'ADDRESSES_POST')
  }
}
