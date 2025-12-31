import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { findUserByEmail, findUserById } from '@/lib/userStorageDb'
import { errorLog, debugLog } from '@/lib/logger'

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

// GET - Fetch all addresses for the current user
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromSession(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
    errorLog('Error fetching addresses:', error)
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 })
  }
}

// POST - Create a new address
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromSession(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, name, phone, addressLine1, addressLine2, city, emirate, country, isDefault } = body

    // Validation
    if (!name || !phone || !addressLine1 || !city || !emirate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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
    errorLog('Error creating address:', error)
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 })
  }
}
