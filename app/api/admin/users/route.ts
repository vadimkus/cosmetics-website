import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET(_request: NextRequest) {
  try {
    console.log('🔍 Admin users API called')
    
    const prisma = new PrismaClient()
    
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
    
    console.log('📊 Found', users.length, 'users')
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      users: users
    })
  } catch (error) {
    console.error('❌ Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}