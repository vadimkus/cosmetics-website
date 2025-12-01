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
    const searchParam = searchParams.get('search')
    const search = searchParam?.trim() || undefined
    const limitParam = parseInt(searchParams.get('limit') || '1000')
    const limit = Number.isNaN(limitParam) ? 1000 : limitParam // Allow fetching all users
    const offsetParam = parseInt(searchParams.get('offset') || '0')
    const offset = Number.isNaN(offsetParam) ? 0 : offsetParam
    
    debugLog('📊 Query params:', { search, limit })
    
    // Build where clause - handle search differently for PostgreSQL
    let whereClause: {
      OR?: Array<{
        email?: { contains: string; mode: 'insensitive' }
        name?: { contains: string; mode: 'insensitive' }
        phone?: { contains: string; mode: 'insensitive' }
      }>
    } = {}
    
    if (search && search.length > 0) {
      // Use case-insensitive search for PostgreSQL
      whereClause = {
        OR: [
          { email: { contains: search, mode: 'insensitive' as const } },
          { name: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search, mode: 'insensitive' as const } }
        ]
      }
    }
    
    debugLog('📊 Where clause:', JSON.stringify(whereClause))
    
    // Build query options - exclude profilePicture to reduce response size
    // Profile pictures can be fetched separately if needed
    const selectFields = {
      id: true,
      email: true,
      name: true,
      phone: true,
      address: true,
      // profilePicture: true, // Excluded to reduce response size - fetch separately if needed
      isAdmin: true,
      canSeePrices: true,
      discountType: true,
      discountPercentage: true,
      birthday: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true
    }
    
    let users
    let totalCount
    
    if (search && search.length > 0) {
      // Search query with where clause
      debugLog('🔍 Executing search query')
      const [userResults, count] = await Promise.all([
        prisma.user.findMany({
          where: whereClause,
          select: selectFields,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset
        }),
        prisma.user.count({ where: whereClause })
      ])
      users = userResults
      totalCount = count
    } else {
      // No search - get all users (no where clause) with pagination
      debugLog('🔍 Executing query without search')
      const [userResults, count] = await Promise.all([
        prisma.user.findMany({
          select: selectFields,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset
        }),
        prisma.user.count()
      ])
      users = userResults
      totalCount = count
    }
    
    debugLog('📊 Found', users.length, 'users' + (search ? ` (search: "${search}")` : ''), `Total: ${totalCount}`)
    
    return NextResponse.json({
      success: true,
      users: users,
      total: totalCount,
      limit,
      offset,
      hasMore: offset + users.length < totalCount
    })
  } catch (error) {
    errorLog('❌ Error fetching users:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    const errorName = error instanceof Error ? error.name : undefined
    
    errorLog('❌ Error details:', { 
      message: errorMessage, 
      stack: errorStack,
      name: errorName,
      error: String(error)
    })
    
    // Always include error details in development, simplified in production
    const errorResponse: {
      error: string
      message: string
      details?: { stack?: string; error?: string; message?: string; name?: string }
    } = {
      error: 'Internal server error',
      message: errorMessage
    }
    
    if (process.env.NODE_ENV === 'development') {
      errorResponse.details = {
        message: errorMessage,
        ...(errorStack && { stack: errorStack }),
        ...(errorName && { name: errorName }),
        error: String(error)
      }
    }
    
    return NextResponse.json(errorResponse, { status: 500 })
  }
}