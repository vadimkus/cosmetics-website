import { NextRequest, NextResponse } from 'next/server'
import { errorLog } from '@/lib/logger'
import { requireAdminAuth } from '@/lib/adminAuth'

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  try {
    // For now, return empty segments (can be extended to store in database)
    // In a production system, you'd store segments in a database table
    return NextResponse.json({
      segments: []
    })
  } catch {
    errorLog('Error fetching segments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch segments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  try {
    const body = await request.json()
    const { name, description, filters } = body

    if (!name || !filters || !Array.isArray(filters)) {
      return NextResponse.json(
        { error: 'Invalid segment data' },
        { status: 400 }
      )
    }

    // For now, return success (can be extended to store in database)
    // In a production system, you'd save segments to a database table
    const segment = {
      id: `segment_${Date.now()}`,
      name,
      description: description || '',
      filters,
      userCount: 0, // Would be calculated when segment is loaded
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      segment
    })
  } catch {
    errorLog('Error creating segment:', error)
    return NextResponse.json(
      { error: 'Failed to create segment' },
      { status: 500 }
    )
  }
}

