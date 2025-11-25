import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'
import { debugLog, errorLog } from '@/lib/logger'

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  try {
    debugLog('🔍 Admin users API called')
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        profilePicture: true,
        isAdmin: true,
        canSeePrices: true,
        discountType: true,
        discountPercentage: true,
        birthday: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    })
    
    debugLog('📊 Found', users.length, 'users')
    
    return NextResponse.json({
      success: true,
      users: users
    })
  } catch (error) {
    errorLog('❌ Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}