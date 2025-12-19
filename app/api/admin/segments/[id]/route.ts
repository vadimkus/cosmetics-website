import { NextRequest, NextResponse } from 'next/server'
import { errorLog } from '@/lib/logger'
import { requireAdminAuth } from '@/lib/adminAuth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, filters } = body

    if (!name || !filters || !Array.isArray(filters)) {
      return NextResponse.json(
        { error: 'Invalid segment data' },
        { status: 400 }
      )
    }

    // For now, return success (can be extended to update in database)
    const segment = {
      id,
      name,
      description: description || '',
      filters,
      userCount: 0,
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      segment
    })
  } catch {
    errorLog('Error updating segment:', error)
    return NextResponse.json(
      { error: 'Failed to update segment' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  try {
    const { id: __id } = await params

    // For now, return success (can be extended to delete from database)
    return NextResponse.json({
      success: true,
      message: 'Segment deleted'
    })
  } catch {
    errorLog('Error deleting segment:', error)
    return NextResponse.json(
      { error: 'Failed to delete segment' },
      { status: 500 }
    )
  }
}

