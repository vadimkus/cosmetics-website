import { NextRequest, NextResponse } from 'next/server'
import { deleteUser } from '@/lib/userStorageDb'
import { errorLog } from '@/lib/logger'

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Delete user from database
    const success = await deleteUser(userId)
    
    if (!success) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    })
  } catch {
    errorLog('Account deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
