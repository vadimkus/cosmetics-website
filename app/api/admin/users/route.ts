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
    
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.trim().toLowerCase()
    const limitParam = parseInt(searchParams.get('limit') || '200')
    const limit = Number.isNaN(limitParam) ? 200 : Math.min(limitParam, 500) // Max 500 users
    
    const whereClause = search ? {
      OR: [
        { email: { contains: search, mode: 'insensitive' as const } },
        { name: { contains: search, mode: 'insensitive' as const } },
        { phone: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {}
    
    const users = await prisma.user.findMany({
      where: whereClause,
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
      take: limit
    })
    
    debugLog('📊 Found', users.length, 'users' + (search ? ` (search: "${search}")` : ''))
    
    return NextResponse.json({
      success: true,
      users: users,
      total: users.length
    })
  } catch (error) {
    errorLog('❌ Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}